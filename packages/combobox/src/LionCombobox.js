// eslint-disable-next-line max-classes-per-file
import { html, css } from '@lion/core';
import { OverlayMixin, withDropdownConfig } from '@lion/overlays';
import { LionListbox } from '@lion/listbox';
// import '../lion-combobox-invoker.js';

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
      autocomplete: String,
      matchMode: {
        type: String,
        attribute: 'match-mode',
      },
    };
  }

  static get styles() {
    // TODO: share input-group css?
    return [
      super.styles,
      css`
        :host [role='combobox'] ::slotted(input) {
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
          overflow: hidden;
        }

        .combobox__input {
          display: flex;
          flex: 1;
        }
      `,
    ];
  }

  /** @type {SlotsMap} */
  get slots() {
    return {
      ...super.slots,
      input: () => document.createElement('input'),
      // Note that [role=listbox] has no tabindex, contrary to listbox and select-rich
      listbox: super.slots.input,
      // selection-display could be provided by default in extension layer
    };
  }

  /**
   * Wrapper with combobox role for the text input that the end user controls the listbox with.
   * @type {HTMLElement}
   */
  get _comboboxNode() {
    return /** @type {HTMLElement} */ (
      /** @type {ShadowRoot} */ (this.shadowRoot).querySelector('[data-ref="combobox"]')
    );
  }

  get _comboboxTextNode() {
    return /** @type {HTMLInputElement} */ (this.querySelector('[slot=input]'));
  }

  /**
   * @override FormControlMixin
   * Will tell FormControlMixin that a11y wrt labels / descriptions / feedback
   * should be applied here.
   */
  get _inputNode() {
    return this._comboboxTextNode;
  }

  /**
   * @type {HTMLElement | null}
   */
  get _selectionDisplayNode() {
    return this.querySelector('[slot="selection-display"]');
  }

  constructor() {
    super();
    /**
     * @desc When "list", will filter listbox suggestions based on textbox value.
     * When "both", an inline completion string will be added to the textbox as well.
     * @type {'list'|'both'|'none'}
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

    /** @type {EventListener} */
    this.__showOverlay = this.__showOverlay.bind(this);

    this.__cboxInputValue = '';
    this.__prevCboxValueNonSelected = '';
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);
    // if (changedProperties.has('modelValue')) {
    //   this.__syncSelectionDisplayElement();
    // }
    if (changedProperties.has('autocomplete')) {
      this._comboboxTextNode.setAttribute('aria-autocomplete', this.autocomplete);
    }
  }

  async __setupCombobox() {
    this._comboboxNode.setAttribute('role', 'combobox');
    this._comboboxNode.setAttribute('aria-haspopup', 'listbox');
    this._comboboxNode.setAttribute('aria-expanded', 'false'); // Reuse select-rich invoker logic

    this._comboboxNode.setAttribute('aria-owns', this._listboxNode.id);

    this._comboboxTextNode.setAttribute('aria-autocomplete', this.autocomplete);
    this._comboboxTextNode.setAttribute('aria-controls', this._listboxNode.id);
    this._comboboxTextNode.setAttribute('aria-labelledby', this._labelNode.id);

    this._comboboxTextNode.addEventListener('keydown', this._listboxOnKeyDown);

    this._comboboxTextNode.addEventListener('input', ev => {
      this.__cboxInputValue = /** @type {LionOption} */ (ev.target).value;
      // For performance, schedule till next frame
      requestAnimationFrame(() => {
        this._handleAutocompletion({
          curValue: this.__cboxInputValue,
          prevValue: this.__prevCboxValueNonSelected,
        });
      });
    });
  }

  /**
   * @param {MouseEvent} ev
   */
  _listboxOnClick(ev) {
    super._listboxOnClick(ev);
    this._comboboxTextNode.focus();
    this.__blockListShowDuringTransition();
    this.__syncCheckedWithTextboxOnInteraction();
  }

  /**
   * @override
   */
  _setupListboxInteractions() {
    super._setupListboxInteractions();
    // Only the textbox should be focusable
    this._listboxNode.removeAttribute('tabindex');
  }

  /**
   * @overridable
   * @param {LionOption} option
   * @param {string} curValue current ._comboboxTextNode value
   */
  filterOptionCondition(option, curValue) {
    const idx = option.value.toLowerCase().indexOf(curValue.toLowerCase());
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
    option.innerHTML = innerHTML.replace(new RegExp(`(${matchingString})`, 'i'), `<b>$1</b>`);
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
   * @desc Matches visibility of listbox options against current ._comboboxTextNode contents
   * @param {object} config
   * @param {string} config.curValue current ._comboboxTextNode value
   * @param {string} config.prevValue previous ._comboboxTextNode value
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
    this.formElements.forEach((/** @type {OptionWithFilterFn} */ option, index) => {
      // [1]. Cleanup previous matching states
      if (option.onFilterUnmatch) {
        option.onFilterUnmatch(curValue, prevValue);
      } else {
        this._onFilterUnmatch(option, curValue, prevValue);
      }

      // [2]. If ._comboboxTextNode is empty, no filtering will be applied
      if (!curValue) {
        visibleOptions.push(option);
        return;
      }

      // [3]. Cleanup previous visibility and a11y states
      /* eslint-disable no-param-reassign */
      option.disabled = true; // makes it compatible with keyboard interaction methods
      option.removeAttribute('aria-posinset');
      option.removeAttribute('aria-setsize');
      /* eslint-enable no-param-reassign */

      // [4]. Add options that meet matching criteria
      const show = this.filterOptionCondition(option, curValue);
      if (show) {
        visibleOptions.push(option);
        if (option.onFilterMatch) {
          option.onFilterMatch(curValue);
        } else {
          this._onFilterMatch(option, curValue);
        }
      }

      // [5]. Synchronize ._comboboxTextNode value and active descendant with closest match
      const beginsWith = option.value.toLowerCase().indexOf(curValue.toLowerCase()) === 0;
      if (beginsWith && !hasAutoFilled && show && userIsAddingChars) {
        if (this.autocomplete === 'both') {
          this._comboboxTextNode.value = option.value;
          this._comboboxTextNode.selectionStart = this.__cboxInputValue.length;
          this._comboboxTextNode.selectionEnd = this._comboboxTextNode.value.length;
        }
        this.activeIndex = index;
        hasAutoFilled = true;
      }
    });

    // [6]. enable a11y, visibility and user interaction for visible options
    visibleOptions.forEach((option, idx) => {
      /* eslint-disable no-param-reassign */
      option.setAttribute('aria-posinset', `${idx + 1}`);
      option.setAttribute('aria-setsize', `${visibleOptions.length}`);
      option.disabled = false;
      /* eslint-enable no-param-reassign */
    });
    this.__prevCboxValueNonSelected = curValue.slice(
      0,
      /** @type {number} */ (this._comboboxTextNode.selectionStart),
    );

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
      this.__toggleComboboxDisabled();
    }
    if (name === 'modelValue') {
      this.__blockListShowDuringTransition();
    }
  }

  __toggleComboboxDisabled() {
    if (this._comboboxNode) {
      this._comboboxNode.setAttribute('disabled', `${this.disabled}`);
      this._comboboxNode.setAttribute('readonly', `${this.readOnly}`);
    }
  }

  /**
   * @override FormControlMixin
   */
  // eslint-disable-next-line
  _inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <div class="combobox__input" data-ref="combobox">
          <slot name="selection-display"></slot>
          <slot name="input"></slot>
        </div>
      </div>
    `;
  }

  // eslint-disable-next-line
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

  // __syncSelectionDisplayElement() {
  //   // sync to invoker
  //   if (this._selectionDisplayNode) {
  //     if (!this.multipleChoice && this.checkedIndex !== -1) {
  //       this._selectionDisplayNode.selectedElements = [this.formElements[this.checkedIndex]];
  //     } else {
  //       this._selectionDisplayNode.selectedElements = this._getCheckedElements();
  //     }
  //   }
  // }

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
    return this._comboboxNode;
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
    if (/** @type {KeyboardEvent} */ (ev).key === 'Tab' || this.__blockListShow) {
      return;
    }
    this.opened = true;
  }

  /**
   * @override OverlayMixin
   */
  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this._overlayInvokerNode.addEventListener('focusin', this.__showOverlay);
    this._overlayInvokerNode.addEventListener('keyup', this.__showOverlay);
  }

  /**
   * @override OverlayMixin
   */
  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    this._overlayInvokerNode.removeEventListener('focusin', this.__showOverlay);
    this._overlayInvokerNode.removeEventListener('keyup', this.__showOverlay);
  }

  /**
   * @param {Event & { target:LionOption }} ev
   */
  _onChildActiveChanged(ev) {
    super._onChildActiveChanged(ev);
    if (ev.target.active) {
      this._comboboxTextNode.setAttribute('aria-activedescendant', ev.target.id);
    }
  }

  /**
   * @param {KeyboardEvent} ev
   */
  _listboxOnKeyDown(ev) {
    super._listboxOnKeyDown(ev);
    const { key } = ev;
    switch (key) {
      case 'Escape':
        this._comboboxTextNode.value = '';
        break;
      case ' ':
      case 'Enter':
        this.__syncCheckedWithTextboxOnInteraction();
      /* no default */
    }
  }

  __syncCheckedWithTextboxOnInteraction() {
    if (!this.multipleChoice) {
      this._comboboxTextNode.value = this.formElements[
        /** @type {number} */ (this.checkedIndex)
      ].value;
      this.opened = false;
    }
  }

  /**
   * Normally, when textbox gets focus or a char is typed, it opens listbox.
   * In transition phases (like clicking option) we prevent this.
   */
  __blockListShowDuringTransition() {
    this.__blockListShow = true;
    // We need this timeout to make sure click handler triggered by keyup (space/enter) of
    // button has been executed.
    // TODO: alternative would be to let the 'checking' party 'release' this boolean
    // Or: call 'stopPropagation' on keyup of keys that have been handled in keydown
    setTimeout(() => {
      this.__blockListShow = false;
    }, 200);
  }
}
