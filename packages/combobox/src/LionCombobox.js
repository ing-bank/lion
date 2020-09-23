// eslint-disable-next-line max-classes-per-file
import { html, css, browserDetection } from '@lion/core';
import { OverlayMixin, withDropdownConfig } from '@lion/overlays';
import { LionListbox } from '@lion/listbox';

// TODO: make ListboxOverlayMixin that is shared between SelectRich and Combobox
// TODO: extract option matching based on 'typed character cache' and share that logic
// on Listbox or ListNavigationWithActiveDescendantMixin

/**
 * @typedef {import('@lion/listbox').LionOption} LionOption
 * @typedef {import('@lion/listbox').LionOptions} LionOptions
 * @typedef {import('@lion/overlays/types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/core/types/SlotMixinTypes').SlotsMap} SlotsMap
 */

/**
 * LionCombobox: implements the wai-aria combobox design pattern and integrates it as a Lion
 * FormControl
 */

export class LionCombobox extends OverlayMixin(LionListbox) {
  static get properties() {
    return {
      autocomplete: { type: String, reflect: true },
      matchMode: {
        type: String,
        attribute: 'match-mode',
      },
      __shouldAutocompleteNextUpdate: Boolean,
    };
  }

  static get styles() {
    // TODO: share input-group css?
    return [
      super.styles,
      css`
        :host ::slotted([slot='input']) {
          outline: none;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border: none;
          border-bottom: 1px solid;
        }

        :host ::slotted([role='listbox']) {
          max-height: 200px;
          display: block;
          overflow: auto;
        }
      `,
    ];
  }

  /**
   * @type {SlotsMap}
   */
  get slots() {
    return {
      ...super.slots,
      /**
       * The interactive element that can receive focus
       */
      input: () => {
        if (this._ariaVersion === '1.1') {
          /**
           * For Safari, aria-owns="textbox-id ..." does not work.
           * We therefore need to wrap [role=combobox] around the input textbox.
           * Since we now have two level depth light dom (needed for a11y), we might get into trouble
           * styling the input node. All styles that would previously go to
           */
          const combobox = document.createElement('div');
          const textbox = document.createElement('input');

          // Reset textbox styles so that it 'merges' with parent [role=combobox]
          // that is styled by Subclassers
          textbox.style.cssText = `
          border: none;
          outline: none;
          width: 100%;
          height: 100%;
          display: block;
          box-sizing: border-box;
          padding: 0;`;

          combobox.appendChild(textbox);
          return combobox;
        }
        // ._ariaVersion === '1.0'
        /**
         * For full browser support, we implement the aria 1.0 spec.
         * That means that the input element will have [role-"combobox"]
         */
        return document.createElement('input');
      },
      /**
       * As opposed to our parent (LionListbox), the end user doesn't interact with the
       * element that has [role=listbox] (in a combobox, it has no tabindex), but with
       * the text box (<input>) element.
       */
      listbox: super.slots.input,
    };
  }

  /**
   * Wrapper with combobox role for the text input that the end user controls the listbox with.
   * @type {HTMLElement}
   */
  get _comboboxNode() {
    return /** @type {HTMLElement} */ (this.querySelector('[slot="input"]'));
  }

  /**
   * @override FormControlMixin
   * Will tell FormControlMixin that a11y wrt labels / descriptions / feedback
   * should be applied here.
   */
  get _inputNode() {
    if (this._ariaVersion === '1.1') {
      return /** @type {HTMLInputElement} */ (this._comboboxNode.querySelector('input'));
    }
    return /** @type {HTMLInputElement} */ (this._comboboxNode);
  }

  /**
   * @type {HTMLElement | null}
   */
  get _selectionDisplayNode() {
    return this.querySelector('[slot="selection-display"]');
  }

  /**
   * @configure ListboxMixin
   * @type {HTMLElement}
   */
  get _activeDescendantOwnerNode() {
    return this._inputNode;
  }

  constructor() {
    super();
    /**
     * @desc When "list", will filter listbox suggestions based on textbox value.
     * When "both", an inline completion string will be added to the textbox as well.
     * @type {'none'|'list'|'inline'|'both'}
     */
    this.autocomplete = 'both';
    /**
     * @desc When typing in the textbox, will by default be set on 'begin',
     * only matching the beginning part in suggestion list.
     * => 'a' will match 'apple' from ['apple', 'pear', 'citrus'].
     * When set to 'all', will match middle of the word as well
     * => 'a' will match 'apple' and 'pear'
     * @type {'begin'|'all'}
     */
    this.matchMode = 'all';

    /**
     * For optimal support, we allow aria v1.1 on newer browsers
     * @type {'1.1'|'1.0'}
     */
    this._ariaVersion = browserDetection.isChromium ? '1.1' : '1.0';

    this.__cboxInputValue = '';
    this.__prevCboxValueNonSelected = '';

    /** @type {EventListener} */
    this.__showOverlay = this.__showOverlay.bind(this);
    /** @type {EventListener} */
    this._textboxOnInput = this._textboxOnInput.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._selectionDisplayNode) {
      this._selectionDisplayNode.comboboxElement = this;
    }
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('autocomplete')) {
      this._inputNode.setAttribute('aria-autocomplete', this.autocomplete);
    }
    if (changedProperties.has('disabled')) {
      this.setAttribute('aria-disabled', `${this.disabled}`); // create mixin if we need it in more places
    }
    if (
      changedProperties.has('__shouldAutocompleteNextUpdate') &&
      this.__shouldAutocompleteNextUpdate
    ) {
      // Only update list in render cycle
      this._handleAutocompletion({
        curValue: this.__cboxInputValue,
        prevValue: this.__prevCboxValueNonSelected,
      });
      this.__shouldAutocompleteNextUpdate = false;
    }

    if (this._selectionDisplayNode) {
      this._selectionDisplayNode.onComboboxElementUpdated(changedProperties);
    }
  }

  __setupCombobox() {
    this._comboboxNode.setAttribute('role', 'combobox');
    this._comboboxNode.setAttribute('aria-haspopup', 'listbox');
    this._comboboxNode.setAttribute('aria-expanded', 'false');
    this._comboboxNode.setAttribute('aria-owns', this._listboxNode.id);

    this._inputNode.setAttribute('aria-autocomplete', this.autocomplete);
    this._inputNode.setAttribute('aria-controls', this._listboxNode.id);
    this._inputNode.setAttribute('aria-labelledby', this._labelNode.id);

    this._inputNode.addEventListener('keydown', this._listboxOnKeyDown);
    this._inputNode.addEventListener('input', this._textboxOnInput);
  }

  __teardownCombobox() {
    this._inputNode.removeEventListener('keydown', this._listboxOnKeyDown);
    this._inputNode.removeEventListener('input', this._textboxOnInput);
  }

  /**
   * @param {Event} ev
   */
  _textboxOnInput(ev) {
    this.__cboxInputValue = /** @type {LionOption} */ (ev.target).value;
    // Schedules autocompletion of options
    this.__shouldAutocompleteNextUpdate = true;
  }

  /**
   * @param {MouseEvent} ev
   */
  _listboxOnClick(ev) {
    super._listboxOnClick(ev);
    this._inputNode.focus();
    this.__resetActive();
    this.opened = false;
    this.__syncCheckedWithTextboxOnInteraction();
  }

  /**
   * @override
   */
  _setupListboxNode() {
    super._setupListboxNode();
    // Only the textbox should be focusable
    this._listboxNode.removeAttribute('tabindex');
  }

  /**
   * @overridable
   * @param {LionOption} option
   * @param {string} curValue current ._inputNode value
   */
  filterOptionCondition(option, curValue) {
    const idx = option.choiceValue
      .toString()
      .toLowerCase()
      .indexOf(curValue.toString().toLowerCase());
    if (this.matchMode === 'all') {
      return idx > -1; // matches part of word
    }
    return idx === 0; // matches beginning of value
  }

  /* eslint-disable no-param-reassign, class-methods-use-this */

  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} matchingString
   */
  _onFilterMatch(option, matchingString) {
    const { innerHTML } = option;
    option.__originalInnerHTML = innerHTML;
    const newInnerHTML = innerHTML.replace(new RegExp(`(${matchingString})`, 'i'), `<b>$1</b>`);
    // For Safari, we need to add a label to the element
    option.innerHTML = `<span aria-label="${option.textContent}">${newInnerHTML}</span>`;
    // Alternatively, an extension can add an animation here
    option.style.display = '';
  }

  /**
   * @overridable
   * @param {LionOption & {__originalInnerHTML?:string}} option
   * @param {string} [curValue]
   * @param {string} [prevValue]
   */
  // eslint-disable-next-line no-unused-vars
  _onFilterUnmatch(option, curValue, prevValue) {
    if (option.__originalInnerHTML) {
      option.innerHTML = option.__originalInnerHTML;
    }
    // Alternatively, an extension can add an animation here
    option.style.display = 'none';
  }

  /* eslint-enable no-param-reassign, class-methods-use-this */

  /**
   * @desc Matches visibility of listbox options against current ._inputNode contents
   * @param {object} config
   * @param {string} config.curValue current ._inputNode value
   * @param {string} config.prevValue previous ._inputNode value
   */
  _handleAutocompletion({ curValue, prevValue }) {
    if (this.autocomplete === 'none') {
      return;
    }

    /**
     * The filtered list of options that will match in this autocompletion cycle
     * @type {LionOption[]}
     */
    const visibleOptions = [];
    let hasAutoFilled = false;
    const userIsAddingChars = prevValue.length < curValue.length;

    /** @typedef {LionOption & { onFilterUnmatch?:function, onFilterMatch?:function }} OptionWithFilterFn */
    this.formElements.forEach((/** @type {OptionWithFilterFn} */ option) => {
      const show = this.filterOptionCondition(option, curValue);

      // [1]. Synchronize ._inputNode value and active descendant with closest match
      const beginsWith =
        option.choiceValue.toString().toLowerCase().indexOf(curValue.toString().toLowerCase()) ===
        0;
      if (beginsWith && !hasAutoFilled && show && userIsAddingChars) {
        if (this.autocomplete === 'both' || this.autocomplete === 'inline') {
          this._inputNode.value = option.choiceValue;
          this._inputNode.selectionStart = this.__cboxInputValue.length;
          this._inputNode.selectionEnd = this._inputNode.value.length;
        }
        hasAutoFilled = true;
      }

      if (this.autocomplete === 'none' || this.autocomplete === 'inline') {
        return;
      }

      // [2]. Cleanup previous matching states
      if (option.onFilterUnmatch) {
        option.onFilterUnmatch(curValue, prevValue);
      } else {
        this._onFilterUnmatch(option, curValue, prevValue);
      }

      // [3]. If ._inputNode is empty, no filtering will be applied
      if (!curValue) {
        visibleOptions.push(option);
        return;
      }

      // [4]. Cleanup previous visibility and a11y states
      option.setAttribute('aria-hidden', 'true');
      option.removeAttribute('aria-posinset');
      option.removeAttribute('aria-setsize');

      // [5]. Add options that meet matching criteria
      if (show) {
        visibleOptions.push(option);
        if (option.onFilterMatch) {
          option.onFilterMatch(curValue);
        } else {
          this._onFilterMatch(option, curValue);
        }
      }
    });

    // [6]. enable a11y, visibility and user interaction for visible options
    visibleOptions.forEach((option, idx) => {
      option.setAttribute('aria-posinset', `${idx + 1}`);
      option.setAttribute('aria-setsize', `${visibleOptions.length}`);
      option.removeAttribute('aria-hidden');
    });
    /** @type {number} */
    const { selectionStart } = this._inputNode;
    this.__prevCboxValueNonSelected = curValue.slice(0, selectionStart);

    if (this._overlayCtrl && this._overlayCtrl._popper) {
      this._overlayCtrl._popper.update();
    }
  }

  /**
   * @param {'disabled'|'modelValue'|'readOnly'} name
   * @param {unknown} oldValue
   */
  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);
    if (name === 'disabled' || name === 'readOnly') {
      this.__setComboboxDisabledAndReadOnly();
    }
  }

  __setComboboxDisabledAndReadOnly() {
    if (this._comboboxNode) {
      this._comboboxNode.setAttribute('disabled', `${this.disabled}`);
      this._comboboxNode.setAttribute('readonly', `${this.readOnly}`);
    }
  }

  /**
   * @override FormControlMixin
   */
  // eslint-disable-next-line class-methods-use-this
  _inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="_combobox"></slot>
        <slot name="selection-display"></slot>
        <slot name="input"></slot>
      </div>
    `;
  }

  // eslint-disable-next-line class-methods-use-this
  _overlayListboxTemplate() {
    return html`
      <slot name="_overlay-shadow-outlet"></slot>
      <div id="overlay-content-node-wrapper" role="dialog">
        <slot name="listbox"></slot>
      </div>
      <slot id="options-outlet"></slot>
    `;
  }

  _groupTwoTemplate() {
    return html` ${super._groupTwoTemplate()} ${this._overlayListboxTemplate()}`;
  }

  /**
   * @override OverlayMixin
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return /** @type {OverlayConfig} */ ({
      ...withDropdownConfig(),
      elementToFocusAfterHide: undefined,
    });
  }

  _setupOverlayCtrl() {
    super._setupOverlayCtrl();
    this.__initFilterListbox();
    this.__setupCombobox();
  }

  __initFilterListbox() {
    this._handleAutocompletion({
      curValue: this.__cboxInputValue,
      prevValue: this.__prevCboxValueNonSelected,
    });
  }

  /**
   * @override Configures OverlayMixin
   */
  get _overlayInvokerNode() {
    return this._inputNode;
  }

  /**
   * @override Configures OverlayMixin
   */
  get _overlayContentNode() {
    return this._listboxNode;
  }

  get _listboxNode() {
    return /** @type {LionOptions} */ ((this._overlayCtrl && this._overlayCtrl.contentNode) ||
      Array.from(this.children).find(child => child.slot === 'listbox'));
  }

  /**
   * @param {Event} ev
   */
  __showOverlay(ev) {
    if (
      /** @type {KeyboardEvent} */ (ev).key === 'Tab' ||
      /** @type {KeyboardEvent} */ (ev).key === 'Esc' ||
      /** @type {KeyboardEvent} */ (ev).key === 'Enter'
    ) {
      return;
    }
    this.opened = true;
  }

  /**
   * @override OverlayMixin
   */
  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this._overlayInvokerNode.addEventListener('keyup', this.__showOverlay);
  }

  /**
   * @override OverlayMixin
   */
  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    this._overlayInvokerNode.removeEventListener('keyup', this.__showOverlay);
  }

  // /**
  //  * @param {Event & { target:LionOption }} ev
  //  */
  // _onChildActiveChanged(ev) {
  //   super._onChildActiveChanged(ev);
  //   if (ev.target.active) {
  //     this._inputNode.setAttribute('aria-activedescendant', ev.target.id);
  //   }
  // }

  /**
   * @param {KeyboardEvent} ev
   */
  _listboxOnKeyDown(ev) {
    super._listboxOnKeyDown(ev);
    const { key } = ev;
    switch (key) {
      case 'Escape':
        this.opened = false;
        this.__shouldAutocompleteNextUpdate = true;
        this._inputNode.value = '';
        this.__cboxInputValue = '';
        this.activeIndex = -1;
        this.__resetActive();
        this.checkedIndex = -1;
        break;
      case 'Enter':
        if (!this.formElements[this.activeIndex]) {
          return;
        }
        this.__syncCheckedWithTextboxOnInteraction();
        this.__resetActive();
        this.opened = false;
        break;
      default:
        if (
          this.activeIndex === -1 &&
          (this.autocomplete === 'inline' || this.autocomplete === 'both')
        ) {
          this.activeIndex = 0;
        }
      /* no default */
    }
  }

  __syncCheckedWithTextboxOnInteraction() {
    if (!this.multipleChoice && this.checkedIndex !== -1) {
      this._inputNode.value = this.formElements[/** @type {number} */ (this.checkedIndex)].value;
      this.__cboxInputValue = this.formElements[/** @type {number} */ (this.checkedIndex)].value;
    }
  }

  __resetActive() {
    this.formElements.forEach(el => {
      // eslint-disable-next-line no-param-reassign
      el.active = false;
    });
  }
}
