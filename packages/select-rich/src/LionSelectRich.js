import { LionListbox } from '@lion/listbox';
import { html, ScopedElementsMixin, SlotMixin, browserDetection } from '@lion/core';
import { OverlayMixin, withDropdownConfig } from '@lion/overlays';
import '@lion/core/src/differentKeyEventNamesShimIE.js';
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
// @ts-expect-error
export class LionSelectRich extends SlotMixin(ScopedElementsMixin(OverlayMixin(LionListbox))) {
  static get scopedElements() {
    return {
      ...super.scopedElements,
      'lion-select-invoker': LionSelectInvoker,
    };
  }

  static get properties() {
    return {
      ...super.properties,
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

  // @ts-ignore
  get slots() {
    return {
      ...super.slots,
      invoker: () => document.createElement(LionSelectRich.getScopedTagName('lion-select-invoker')),
    };
  }

  /**
   * @protected
   * @type {LionSelectInvoker}
   */
  get _invokerNode() {
    return /** @type {LionSelectInvoker} */ (Array.from(this.children).find(
      child => child.slot === 'invoker',
    ));
  }

  /**
   * @configure ListboxMixin
   * @protected
   */
  // @ts-ignore
  get _scrollTargetNode() {
    // TODO: should this be defined here or in extension layer?
    // @ts-expect-error we allow the _overlayContentNode to define its own _scrollTargetNode
    return this._overlayContentNode._scrollTargetNode || this._overlayContentNode;
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

    this.__onKeyUp = this.__onKeyUp.bind(this);
    this.__invokerOnBlur = this.__invokerOnBlur.bind(this);
    this.__overlayOnHide = this.__overlayOnHide.bind(this);
    this.__overlayOnShow = this.__overlayOnShow.bind(this);
    this.__invokerOnClick = this.__invokerOnClick.bind(this);
    this.__overlayBeforeShow = this.__overlayBeforeShow.bind(this);
    this._listboxOnClick = this._listboxOnClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this._invokerNode.selectedElement = this.formElements[
      /**  @type {number} */ (this.checkedIndex)
    ];
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
  requestUpdateInternal(name, oldValue) {
    super.requestUpdateInternal(name, oldValue);
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
   * @param {import('lit-element').PropertyValues } changedProperties
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
    this._onFormElementsChanged();
  }

  /**
   * @enhance FprmRegistrarMixin
   * @param {FormRegisteringHost} child the child element (field)
   */
  removeFormElement(child) {
    super.removeFormElement(child);
    this._onFormElementsChanged();
  }

  // TODO: move to overlayMixin and offer open and close
  toggle() {
    this.opened = !this.opened;
  }

  /**
   * In the select disabled options are still going to a possible value for example
   * when prefilling or programmatically setting it.
   * @override ChoiceGroupMixin
   */
  _getCheckedElements() {
    return this.formElements.filter(el => el.checked);
  }

  _onFormElementsChanged() {
    this.singleOption = this.formElements.length === 1;
    this._invokerNode.singleOption = this.singleOption;
  }

  __initInteractionStates() {
    this.initInteractionState();
  }

  __toggleInvokerDisabled() {
    if (this._invokerNode) {
      this._invokerNode.disabled = this.disabled;
      this._invokerNode.readOnly = this.readOnly;
    }
  }

  __syncInvokerElement() {
    // sync to invoker
    if (this._invokerNode) {
      this._invokerNode.selectedElement = this.formElements[
        /**  @type {number} */ (this.checkedIndex)
      ];
      /**
       * Manually update this, as the node reference may be the same, but the modelValue might not.
       * This would mean that it won't pass the LitElement dirty check.
       * hasChanged in selectedElement won't work, since the oldValue and the newValue's modelValues will be the same,
       * as they are referenced through the same node reference.
       */
      this._invokerNode.requestUpdate('selectedElement');
    }
  }

  __setupInvokerNode() {
    this._invokerNode.id = `invoker-${this._inputId}`;
    this._invokerNode.setAttribute('aria-haspopup', 'listbox');

    this.__setupInvokerNodeEventListener();
  }

  __invokerOnClick() {
    if (!this.disabled && !this.readOnly && !this.singleOption && !this.__blockListShow) {
      this._overlayCtrl.toggle();
    }
  }

  __invokerOnBlur() {
    this.dispatchEvent(new Event('blur'));
  }

  __setupInvokerNodeEventListener() {
    this._invokerNode.addEventListener('click', this.__invokerOnClick);

    this._invokerNode.addEventListener('blur', this.__invokerOnBlur);
  }

  __teardownInvokerNode() {
    this._invokerNode.removeEventListener('click', this.__invokerOnClick);
    this._invokerNode.removeEventListener('blur', this.__invokerOnBlur);
  }

  /**
   * @configure OverlayMixin
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

  __overlayBeforeShow() {
    if (this.hasNoDefaultSelected) {
      this._noDefaultSelectedInheritsWidth();
    }
  }

  __overlayOnShow() {
    if (this.checkedIndex != null) {
      this.activeIndex = /**  @type {number} */ (this.checkedIndex);
    }
    this._listboxNode.focus();
  }

  __overlayOnHide() {
    this._invokerNode.focus();
  }

  /**
   * @enhance OverlayMixin
   */
  _setupOverlayCtrl() {
    super._setupOverlayCtrl();
    this._initialInheritsReferenceWidth = this._overlayCtrl.inheritsReferenceWidth;

    this._overlayCtrl.addEventListener('before-show', this.__overlayBeforeShow);
    this._overlayCtrl.addEventListener('show', this.__overlayOnShow);

    this._overlayCtrl.addEventListener('hide', this.__overlayOnHide);
  }

  /**
   * @enhance OverlayMixin
   */
  _teardownOverlayCtrl() {
    super._teardownOverlayCtrl();
    this._overlayCtrl.removeEventListener('show', this.__overlayOnShow);
    this._overlayCtrl.removeEventListener('before-show', this.__overlayBeforeShow);
    this._overlayCtrl.removeEventListener('hide', this.__overlayOnHide);
  }

  /**
   * @configure FormControlMixin
   */
  _onLabelClick() {
    this._invokerNode.focus();
  }

  /**
   * @configure OverlayMixin
   */
  get _overlayInvokerNode() {
    return this._invokerNode;
  }

  /**
   * @configure OverlayMixin
   */
  get _overlayContentNode() {
    return this._listboxNode;
  }

  /**
   * @param {KeyboardEvent} ev
   */
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

  _listboxOnClick() {
    this.opened = false;
  }

  _setupListboxNode() {
    super._setupListboxNode();
    this._listboxNode.addEventListener('click', this._listboxOnClick);
  }

  _teardownListboxNode() {
    super._teardownListboxNode();
    if (this._listboxNode) {
      this._listboxNode.removeEventListener('click', this._listboxOnClick);
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
