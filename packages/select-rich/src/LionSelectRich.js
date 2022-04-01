import { LionListbox } from '@lion/listbox';
import { html, ScopedElementsMixin, SlotMixin, browserDetection } from '@lion/core';
import { OverlayMixin, withDropdownConfig } from '@lion/overlays';
import { LionSelectInvoker } from './LionSelectInvoker.js';

/**
 * @typedef {import('@lion/listbox').LionOptions} LionOptions
 * @typedef {import('@lion/listbox').LionOption} LionOption
 * @typedef {import('@open-wc/scoped-elements/src/types').ScopedElementsHost} ScopedElementsHost
 * @typedef {import('@lion/form-core/types/registration/FormRegisteringMixinTypes').FormRegisteringHost} FormRegisteringHost
 * @typedef {import('@lion/form-core/types/FormControlMixinTypes').FormControlHost} FormControlHost
 * @typedef {import('@lion/core/types/SlotMixinTypes').SlotsMap} SlotsMap
 */

function detectInteractionMode() {
  if (browserDetection.isMac) {
    return 'mac';
  }
  return 'windows/linux';
}

/**
 * LionSelectRich: wraps the <lion-listbox> element
 */
export class LionSelectRich extends SlotMixin(ScopedElementsMixin(OverlayMixin(LionListbox))) {
  static get scopedElements() {
    return {
      ...super.scopedElements,
      'lion-select-invoker': LionSelectInvoker,
    };
  }

  /** @type {any} */
  static get properties() {
    return {
      navigateWithinInvoker: {
        type: Boolean,
        attribute: 'navigate-within-invoker',
      },
      interactionMode: {
        type: String,
        attribute: 'interaction-mode',
      },
      singleOption: {
        type: Boolean,
        reflect: true,
        attribute: 'single-option',
      },
    };
  }

  /**
   * @enhance FormControlMixin
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="invoker"></slot>
        <div id="overlay-content-node-wrapper">
          <slot name="input"></slot>
          <slot id="options-outlet"></slot>
        </div>
      </div>
    `;
  }

  get slots() {
    return {
      ...super.slots,
      invoker: () => {
        const invokerEl = this.createScopedElement('lion-select-invoker');
        invokerEl.setAttribute('data-tag-name', 'lion-select-invoker');
        return invokerEl;
      },
    };
  }

  /**
   * @protected
   * @type {LionSelectInvoker}
   */
  get _invokerNode() {
    return /** @type {LionSelectInvoker} */ (
      Array.from(this.children).find(child => child.slot === 'invoker')
    );
  }

  /**
   * @configure ListboxMixin
   * @protected
   */
  get _scrollTargetNode() {
    // TODO: should this be defined here or in extension layer?
    return /** @type {HTMLElement} */ (
      /** @type {HTMLElement & {_scrollTargetNode?: HTMLElement}} */ (this._overlayContentNode)
        ._scrollTargetNode || this._overlayContentNode
    );
  }

  constructor() {
    super();

    /**
     * When invoker has focus, up and down arrow keys changes active state of listbox,
     * without opening overlay.
     * @type {Boolean}
     */
    this.navigateWithinInvoker = false;
    /**
     * Aligns behavior for 'selectionFollowFocus' and 'navigateWithinInvoker' with
     * platform. When 'auto' (default), platform is automatically detected
     * @type {'windows/linux'|'mac'|'auto'}
     */
    this.interactionMode = 'auto';

    this.singleOption = false;
    /** @protected */
    this._arrowWidth = 28;

    /** @private */
    this.__onKeyUp = this.__onKeyUp.bind(this);
    /** @private */
    this.__invokerOnBlur = this.__invokerOnBlur.bind(this);
    /** @private */
    this.__overlayOnHide = this.__overlayOnHide.bind(this);
    /** @private */
    this.__overlayOnShow = this.__overlayOnShow.bind(this);
    /** @private */
    this.__invokerOnClick = this.__invokerOnClick.bind(this);
    /** @private */
    this.__overlayBeforeShow = this.__overlayBeforeShow.bind(this);
    /** @protected */
    this._listboxOnClick = this._listboxOnClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._invokerNode.selectedElement =
      this.formElements[/**  @type {number} */ (this.checkedIndex)];

    this._invokerNode.hostElement = this;

    this.__setupInvokerNode();
    this.__toggleInvokerDisabled();
    this.addEventListener('keyup', this.__onKeyUp);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.__teardownInvokerNode();
    this.removeEventListener('keyup', this.__onKeyUp);
  }

  /**
   * @param {string} name
   * @param {unknown} oldValue
   */
  requestUpdate(name, oldValue) {
    super.requestUpdate(name, oldValue);
    if (name === 'interactionMode') {
      if (this.interactionMode === 'auto') {
        this.interactionMode = detectInteractionMode();
      } else {
        this.selectionFollowsFocus = Boolean(this.interactionMode === 'windows/linux');
        this.navigateWithinInvoker = Boolean(this.interactionMode === 'windows/linux');
      }
    }

    if (name === 'disabled' || name === 'readOnly') {
      this.__toggleInvokerDisabled();
    }
  }

  /**
   * @param {import('@lion/core').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('disabled')) {
      if (this.disabled) {
        this._invokerNode.makeRequestToBeDisabled();
      } else {
        this._invokerNode.retractRequestToBeDisabled();
      }
    }

    if (this._inputNode && this._invokerNode) {
      if (changedProperties.has('_ariaLabelledNodes')) {
        this._invokerNode.setAttribute(
          'aria-labelledby',
          `${this._inputNode.getAttribute('aria-labelledby')} ${this._invokerNode.id}`,
        );
      }

      if (changedProperties.has('_ariaDescribedNodes')) {
        this._invokerNode.setAttribute(
          'aria-describedby',
          /** @type {string} */ (this._inputNode.getAttribute('aria-describedby')),
        );
      }

      if (changedProperties.has('showsFeedbackFor')) {
        // The ValidateMixin sets aria-invalid on the inputNode, but in this component we also need it on the invoker
        this._invokerNode.setAttribute('aria-invalid', `${this._hasFeedbackVisibleFor('error')}`);
      }
    }

    if (changedProperties.has('modelValue')) {
      this.__syncInvokerElement();
    }
  }

  /**
   * @enhance FprmRegistrarMixin make sure children have specific default states when added
   * @param {LionOption & FormControlHost} child
   * @param {Number} indexToInsertAt
   */
  addFormElement(child, indexToInsertAt) {
    super.addFormElement(child, indexToInsertAt);
    // the first elements checked by default
    if (
      !this.hasNoDefaultSelected &&
      !this.__hasInitialSelectedFormElement &&
      (!child.disabled || this.disabled)
    ) {
      /* eslint-disable no-param-reassign */
      child.active = true;
      child.checked = true;
      /* eslint-enable no-param-reassign */
      this.__hasInitialSelectedFormElement = true;
    }
    this._alignInvokerWidth();

    this._onFormElementsChanged();
  }

  /**
   * @enhance FprmRegistrarMixin
   * @param {FormRegisteringHost} child the child element (field)
   */
  removeFormElement(child) {
    super.removeFormElement(child);
    this._alignInvokerWidth();
    this._onFormElementsChanged();
  }

  /**
   * In the select disabled options are still going to a possible value for example
   * when prefilling or programmatically setting it.
   * @override ChoiceGroupMixin
   * @protected
   */
  _getCheckedElements() {
    return this.formElements.filter(el => el.checked);
  }

  /** @protected */
  _onFormElementsChanged() {
    this.singleOption = this.formElements.length === 1;
    this._invokerNode.singleOption = this.singleOption;
  }

  /** @private */
  __initInteractionStates() {
    this.initInteractionState();
  }

  /** @private */
  __toggleInvokerDisabled() {
    if (this._invokerNode) {
      this._invokerNode.disabled = this.disabled;
      this._invokerNode.readOnly = this.readOnly;
    }
  }

  /** @private */
  __syncInvokerElement() {
    // sync to invoker
    if (this._invokerNode) {
      this._invokerNode.selectedElement =
        this.formElements[/**  @type {number} */ (this.checkedIndex)];
      /**
       * Manually update this, as the node reference may be the same, but the modelValue might not.
       * This would mean that it won't pass the LitElement dirty check.
       * hasChanged in selectedElement won't work, since the oldValue and the newValue's modelValues will be the same,
       * as they are referenced through the same node reference.
       */
      this._invokerNode.requestUpdate('selectedElement');
    }
  }

  /** @private */
  __setupInvokerNode() {
    this._invokerNode.id = `invoker-${this._inputId}`;
    this._invokerNode.setAttribute('aria-haspopup', 'listbox');

    this.__setupInvokerNodeEventListener();
  }

  /** @private */
  __invokerOnClick() {
    if (!this.disabled && !this.readOnly && !this.singleOption && !this.__blockListShow) {
      this._overlayCtrl.toggle();
    }
  }

  /** @private */
  __invokerOnBlur() {
    this.dispatchEvent(new Event('blur'));
  }

  /** @private */
  __setupInvokerNodeEventListener() {
    this._invokerNode.addEventListener('click', this.__invokerOnClick);

    this._invokerNode.addEventListener('blur', this.__invokerOnBlur);
  }

  /** @private */
  __teardownInvokerNode() {
    this._invokerNode.removeEventListener('click', this.__invokerOnClick);
    this._invokerNode.removeEventListener('blur', this.__invokerOnBlur);
  }

  /**
   * @configure OverlayMixin
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    return {
      ...withDropdownConfig(),
    };
  }

  /**
   * With no selected element, we should override the inheritsReferenceWidth in most cases.
   * By default, we will set it to 'min', and then set it back to what it was initially when
   * something is selected.
   * As a subclasser you can override this behavior.
   * @protected
   */
  _noDefaultSelectedInheritsWidth() {
    if (this.checkedIndex === -1) {
      this._overlayCtrl.updateConfig({ inheritsReferenceWidth: 'min' });
    } else {
      this._overlayCtrl.updateConfig({
        inheritsReferenceWidth: this._initialInheritsReferenceWidth,
      });
    }
  }

  /** @private */
  __overlayBeforeShow() {
    if (this.hasNoDefaultSelected) {
      this._noDefaultSelectedInheritsWidth();
    }
  }

  /** @private */
  __overlayOnShow() {
    if (this.checkedIndex != null) {
      this.activeIndex = /**  @type {number} */ (this.checkedIndex);
    }
    this._listboxNode.focus();
  }

  /** @private */
  __overlayOnHide() {
    this._invokerNode.focus();
  }

  /**
   * @enhance OverlayMixin
   * @protected
   */
  _setupOverlayCtrl() {
    super._setupOverlayCtrl();
    this._initialInheritsReferenceWidth = this._overlayCtrl.inheritsReferenceWidth;
    this._alignInvokerWidth();

    this._overlayCtrl.addEventListener('before-show', this.__overlayBeforeShow);
    this._overlayCtrl.addEventListener('show', this.__overlayOnShow);

    this._overlayCtrl.addEventListener('hide', this.__overlayOnHide);
  }

  /**
   * @enhance OverlayMixin
   * @protected
   */
  _teardownOverlayCtrl() {
    super._teardownOverlayCtrl();
    this._overlayCtrl.removeEventListener('show', this.__overlayOnShow);
    this._overlayCtrl.removeEventListener('before-show', this.__overlayBeforeShow);
    this._overlayCtrl.removeEventListener('hide', this.__overlayOnHide);
  }

  /**
   * Align invoker width with content width
   * Make sure display is not set to "none" while calculating the content width
   * @protected
   */
  async _alignInvokerWidth() {
    if (this._overlayCtrl && this._overlayCtrl.content) {
      await this.updateComplete;
      const initContentDisplay = this._overlayCtrl.content.style.display;
      const initContentMinWidth = this._overlayCtrl.content.style.minWidth;
      const initContentWidth = this._overlayCtrl.content.style.width;
      this._overlayCtrl.content.style.display = '';
      this._overlayCtrl.content.style.minWidth = 'auto';
      this._overlayCtrl.content.style.width = 'auto';
      const contentWidth = this._overlayCtrl.content.getBoundingClientRect().width;
      /**
       * TODO when inside an overlay the current solution doesn't work.
       * Since that dialog is still hidden, open and close the select-rich
       * doesn't have any effect so the contentWidth returns 0
       */
      if (contentWidth > 0) {
        this._invokerNode.style.width = `${contentWidth + this._arrowWidth}px`;
      }
      this._overlayCtrl.content.style.display = initContentDisplay;
      this._overlayCtrl.content.style.minWidth = initContentMinWidth;
      this._overlayCtrl.content.style.width = initContentWidth;
    }
  }

  /**
   * @configure FormControlMixin
   * @protected
   */
  _onLabelClick() {
    this._invokerNode.focus();
  }

  /**
   * @configure OverlayMixin
   * @protected
   */
  get _overlayInvokerNode() {
    return this._invokerNode;
  }

  /**
   * @configure OverlayMixin
   * @protected
   */
  get _overlayContentNode() {
    return this._listboxNode;
  }

  /**
   * @param {KeyboardEvent} ev
   * @protected
   */
  // TODO: rename to _onKeyUp in v1
  __onKeyUp(ev) {
    if (this.disabled) {
      return;
    }

    if (this.opened) {
      return;
    }

    const { key } = ev;
    switch (key) {
      case 'ArrowUp':
        ev.preventDefault();

        if (this.navigateWithinInvoker) {
          this.setCheckedIndex(
            this._getPreviousEnabledOption(/**  @type {number} */ (this.checkedIndex)),
          );
        } else {
          this.opened = true;
        }
        break;
      case 'ArrowDown':
        ev.preventDefault();
        if (this.navigateWithinInvoker) {
          this.setCheckedIndex(
            this._getNextEnabledOption(/**  @type {number} */ (this.checkedIndex)),
          );
        } else {
          this.opened = true;
        }
        break;
      /* no default */
    }
  }

  /**
   * @desc
   * Handle various keyboard controls; UP/DOWN will shift focus; SPACE selects
   * an item.
   *
   * @param {KeyboardEvent} ev - the keydown event object
   * @protected
   */
  _listboxOnKeyDown(ev) {
    super._listboxOnKeyDown(ev);

    if (this.disabled) {
      return;
    }
    const { key } = ev;

    switch (key) {
      case 'Tab':
        // Tab can only be caught in keydown
        this.opened = false;
        break;
      /* no default */
      case 'Escape':
        this.opened = false;
        this.__blockListShowDuringTransition();
        break;
      case 'Enter':
      case ' ':
        this.opened = false;
        this.__blockListShowDuringTransition();
        break;
      /* no default */
    }
  }

  /** @protected */
  _listboxOnClick() {
    this.opened = false;
  }

  /** @protected */
  _setupListboxNode() {
    super._setupListboxNode();
    this._listboxNode.addEventListener('click', this._listboxOnClick);
  }

  /** @protected */
  _teardownListboxNode() {
    super._teardownListboxNode();
    if (this._listboxNode) {
      this._listboxNode.removeEventListener('click', this._listboxOnClick);
    }
  }

  /**
   * Normally, when textbox gets focus or a char is typed, it opens listbox.
   * In transition phases (like clicking option) we prevent this.
   * @private
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
