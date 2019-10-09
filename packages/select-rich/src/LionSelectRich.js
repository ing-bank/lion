import { html, css, LitElement, SlotMixin } from '@lion/core';
import { LocalOverlayController, overlays } from '@lion/overlays';
import { FormControlMixin, InteractionStateMixin, FormRegistrarMixin } from '@lion/field';
import { ValidateMixin } from '@lion/validate';
import './differentKeyNamesShimIE.js';

import '../lion-select-invoker.js';

function uuid() {
  return Math.random()
    .toString(36)
    .substr(2, 10);
}

function detectInteractionMode() {
  if (navigator.appVersion.indexOf('Mac') !== -1) {
    return 'mac';
  }
  return 'windows/linux';
}

/**
 * LionSelectRich: wraps the <lion-listbox> element
 *
 * @customElement
 * @extends LionField
 */
export class LionSelectRich extends FormRegistrarMixin(
  InteractionStateMixin(ValidateMixin(FormControlMixin(SlotMixin(LitElement)))),
) {
  static get properties() {
    return {
      checkedValue: {
        type: Object,
      },

      disabled: {
        type: Boolean,
        reflect: true,
      },

      opened: {
        type: Boolean,
        reflect: true,
      },

      interactionMode: {
        type: String,
        attribute: 'interaction-mode',
      },

      modelValue: {
        type: Array,
      },

      name: {
        type: String,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([disabled]) {
          color: #adadad;
        }
      `,
    ];
  }

  static _isPrefilled(modelValue) {
    if (!modelValue) {
      return false;
    }
    const checkedModelValue = modelValue.find(subModelValue => subModelValue.checked === true);
    if (!checkedModelValue) {
      return false;
    }

    const { value } = checkedModelValue;
    return super._isPrefilled(value);
  }

  get slots() {
    return {
      ...super.slots,
      invoker: () => document.createElement('lion-select-invoker'),
    };
  }

  get _invokerNode() {
    return this.querySelector('[slot=invoker]');
  }

  get _listboxNode() {
    return this.querySelector('[slot=input]');
  }

  get _listboxActiveDescendantNode() {
    return this._listboxNode.querySelector(`#${this._listboxActiveDescendant}`);
  }

  get checkedIndex() {
    if (this.modelValue) {
      return this.modelValue.findIndex(el => el.value === this.checkedValue);
    }
    return -1;
  }

  set checkedIndex(index) {
    if (this.formElements[index]) {
      this.formElements[index].checked = true;
    }
  }

  get activeIndex() {
    return this.formElements.findIndex(el => el.active === true);
  }

  set activeIndex(index) {
    if (this.formElements[index]) {
      this.formElements[index].active = true;
    }
  }

  constructor() {
    super();
    this.interactionMode = 'auto';
    this.disabled = false;
    this.opened = false;
    // for interaction states
    // we use a different event as 'model-value-changed' would bubble up from all options
    this._valueChangedEvent = 'select-model-value-changed';
    this._listboxActiveDescendant = null;
    this.__hasInitialSelectedFormElement = false;

    this.__setupEventListeners();
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this.__setupOverlay();
    this.__setupInvokerNode();
    this.__setupListboxNode();
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this.__teardownEventListeners();
    this.__teardownOverlay();
    this.__teardownInvokerNode();
    this.__teardownListboxNode();
  }

  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);
    if (
      name === 'checkedValue' &&
      !this.__isSyncingCheckedAndModelValue &&
      this.modelValue &&
      this.modelValue.length > 0
    ) {
      if (this.checkedIndex) {
        this.checkedIndex = this.checkedIndex;
      }
    }

    if (name === 'modelValue') {
      this.dispatchEvent(new CustomEvent('select-model-value-changed'));
      this.__onModelValueChanged();
    }

    if (name === 'interactionMode') {
      if (this.interactionMode === 'auto') {
        this.interactionMode = detectInteractionMode();
      }
    }
  }

  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has('opened')) {
      if (this.opened) {
        this.__overlay.show();
      } else {
        this.__overlay.hide();
      }
    }

    if (changedProps.has('disabled')) {
      if (this.disabled) {
        this._invokerNode.makeRequestToBeDisabled();
        this.__requestOptionsToBeDisabled();
      } else {
        this._invokerNode.retractRequestToBeDisabled();
        this.__retractRequestOptionsToBeDisabled();
      }
    }
  }

  toggle() {
    this.opened = !this.opened;
  }

  /**
   * @override
   */
  // eslint-disable-next-line
  inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="invoker"></slot>
        <slot name="input"></slot>
      </div>
    `;
  }

  /**
   * Overrides FormRegistrar adding to make sure children have specific default states when added
   *
   * @override
   * @param {*} child
   */
  addFormElement(child) {
    super.addFormElement(child);
    // we need to adjust the elements being registered
    /* eslint-disable no-param-reassign */
    child.id = child.id || `${this.localName}-option-${uuid()}`;

    if (this.disabled) {
      child.makeRequestToBeDisabled();
    }
    // the first elements checked by default
    if (!this.__hasInitialSelectedFormElement && (!child.disabled || this.disabled)) {
      child.active = true;
      child.checked = true;
      this.__hasInitialSelectedFormElement = true;
    }

    this.__setAttributeForAllFormElements('aria-setsize', this.formElements.length);
    child.setAttribute('aria-posinset', this.formElements.length);

    this.__onChildModelValueChanged({ target: child });
    this.resetInteractionState();
    /* eslint-enable no-param-reassign */
  }

  _getFromAllFormElements(property) {
    return this.formElements.map(e => e[property]);
  }

  /**
   * add same aria-label to invokerNode as inputElement
   * @override
   */
  _onAriaLabelledbyChanged({ _ariaLabelledby }) {
    if (this.inputElement) {
      this.inputElement.setAttribute('aria-labelledby', _ariaLabelledby);
    }
    if (this._invokerNode) {
      this._invokerNode.setAttribute(
        'aria-labelledby',
        `${_ariaLabelledby} ${this._invokerNode.id}`,
      );
    }
  }

  /**
   * add same aria-label to invokerNode as inputElement
   * @override
   */
  _onAriaDescribedbyChanged({ _ariaDescribedby }) {
    if (this.inputElement) {
      this.inputElement.setAttribute('aria-describedby', _ariaDescribedby);
    }
    if (this._invokerNode) {
      this._invokerNode.setAttribute('aria-describedby', _ariaDescribedby);
    }
  }

  __setupEventListeners() {
    this.__onChildActiveChanged = this.__onChildActiveChanged.bind(this);
    this.__onChildModelValueChanged = this.__onChildModelValueChanged.bind(this);
    this.__onKeyUp = this.__onKeyUp.bind(this);

    this.addEventListener('active-changed', this.__onChildActiveChanged);
    this.addEventListener('model-value-changed', this.__onChildModelValueChanged);
    this.addEventListener('keyup', this.__onKeyUp);
  }

  __teardownEventListeners() {
    this.removeEventListener('active-changed', this.__onChildActiveChanged);
    this.removeEventListener('model-value-changed', this.__onChildModelValueChanged);
    this.removeEventListener('keyup', this.__onKeyUp);
  }

  __onChildActiveChanged({ target }) {
    if (target.active === true) {
      this.formElements.forEach(formElement => {
        if (formElement !== target) {
          // eslint-disable-next-line no-param-reassign
          formElement.active = false;
        }
      });
      this._listboxNode.setAttribute('aria-activedescendant', target.id);
    }
  }

  __setAttributeForAllFormElements(attribute, value) {
    this.formElements.forEach(formElement => {
      formElement.setAttribute(attribute, value);
    });
  }

  __onChildModelValueChanged({ target }) {
    if (target.checked) {
      this.formElements.forEach(formElement => {
        if (formElement !== target) {
          // eslint-disable-next-line no-param-reassign
          formElement.checked = false;
        }
      });
    }
    this.modelValue = this._getFromAllFormElements('modelValue');
  }

  __onModelValueChanged() {
    this.__isSyncingCheckedAndModelValue = true;

    const foundChecked = this.modelValue.find(subModelValue => subModelValue.checked);
    if (foundChecked && foundChecked.value !== this.checkedValue) {
      this.checkedValue = foundChecked.value;

      // sync to invoker
      this._invokerNode.selectedElement = this.formElements[this.checkedIndex];
    }

    this.__isSyncingCheckedAndModelValue = false;
  }

  __getNextEnabledOption(currentIndex, offset = 1) {
    for (let i = currentIndex + offset; i < this.formElements.length; i += 1) {
      if (this.formElements[i] && !this.formElements[i].disabled) {
        return i;
      }
    }
    return currentIndex;
  }

  __getPreviousEnabledOption(currentIndex, offset = -1) {
    for (let i = currentIndex + offset; i >= 0; i -= 1) {
      if (this.formElements[i] && !this.formElements[i].disabled) {
        return i;
      }
    }
    return currentIndex;
  }

  /**
   * @desc
   * Handle various keyboard controls; UP/DOWN will shift focus; SPACE selects
   * an item.
   *
   * @param ev - the keydown event object
   */
  __listboxOnKeyUp(ev) {
    if (this.disabled) {
      return;
    }

    const { key } = ev;

    switch (key) {
      case 'Escape':
        ev.preventDefault();
        this.opened = false;
        break;
      case 'Enter':
      case ' ':
        ev.preventDefault();
        if (this.interactionMode === 'mac') {
          this.checkedIndex = this.activeIndex;
        }
        this.opened = false;
        break;
      case 'ArrowUp':
        ev.preventDefault();
        this.activeIndex = this.__getPreviousEnabledOption(this.activeIndex);
        break;
      case 'ArrowDown':
        ev.preventDefault();
        this.activeIndex = this.__getNextEnabledOption(this.activeIndex);
        break;
      case 'ArrowLeft':
        ev.preventDefault();
        this.activeIndex = this.__getPreviousEnabledOption(this.activeIndex);
        break;
      case 'ArrowRight':
        ev.preventDefault();
        this.activeIndex = this.__getNextEnabledOption(this.activeIndex);
        break;
      case 'Home':
        ev.preventDefault();
        this.activeIndex = this.__getNextEnabledOption(0, 0);
        break;
      case 'End':
        ev.preventDefault();
        this.activeIndex = this.__getPreviousEnabledOption(this.formElements.length - 1, 0);
        break;
      /* no default */
    }

    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (keys.includes(key) && this.interactionMode === 'windows/linux') {
      this.checkedIndex = this.activeIndex;
    }
  }

  __listboxOnKeyDown(ev) {
    if (this.disabled) {
      return;
    }

    const { key } = ev;

    switch (key) {
      case 'Tab':
        // Tab can only be caught in keydown
        ev.preventDefault();
        this.opened = false;
        break;
      /* no default */
    }
  }

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
        if (this.interactionMode === 'mac') {
          this.opened = true;
        } else {
          this.checkedIndex = this.__getPreviousEnabledOption(this.checkedIndex);
        }
        break;
      case 'ArrowDown':
        ev.preventDefault();
        if (this.interactionMode === 'mac') {
          this.opened = true;
        } else {
          this.checkedIndex = this.__getNextEnabledOption(this.checkedIndex);
        }
        break;
      case 'ArrowRight':
        ev.preventDefault();
        if (this.interactionMode !== 'mac') {
          this.checkedIndex = this.__getNextEnabledOption(this.checkedIndex);
        }
        break;
      case 'ArrowLeft':
        ev.preventDefault();
        if (this.interactionMode !== 'mac') {
          this.checkedIndex = this.__getPreviousEnabledOption(this.checkedIndex);
        }
        break;
      /* no default */
    }
  }

  __requestOptionsToBeDisabled() {
    this.formElements.forEach(el => {
      if (el.makeRequestToBeDisabled) {
        el.makeRequestToBeDisabled();
      }
    });
  }

  __retractRequestOptionsToBeDisabled() {
    this.formElements.forEach(el => {
      if (el.retractRequestToBeDisabled) {
        el.retractRequestToBeDisabled();
      }
    });
  }

  __setupInvokerNode() {
    this._invokerNode.id = `invoker-${this._inputId}`;
    this._invokerNode.setAttribute('aria-haspopup', 'listbox');

    this.__setupInvokerNodeEventListener();
  }

  __setupInvokerNodeEventListener() {
    this.__invokerOnClick = () => {
      if (!this.disabled) {
        this.toggle();
      }
    };
    this._invokerNode.addEventListener('click', this.__invokerOnClick);

    this.__invokerOnBlur = () => {
      this.dispatchEvent(new Event('blur'));
    };
    this._invokerNode.addEventListener('blur', this.__invokerOnBlur);
  }

  __teardownInvokerNode() {
    this._invokerNode.removeEventListener('click', this.__invokerOnClick);
    this._invokerNode.removeEventListener('blur', this.__invokerOnBlur);
  }

  /**
   * For ShadyDom the listboxNode is available right from the start so we can add those events
   * immediately.
   * For native ShadowDom the select gets render before the listboxNode is available so we
   * will add an event to the slotchange and add the events once available.
   */
  __setupListboxNode() {
    if (this._listboxNode) {
      this.__setupListboxNodeEventListener();
    } else {
      const inputSlot = this.shadowRoot.querySelector('slot[name=input]');
      if (inputSlot) {
        inputSlot.addEventListener('slotchange', () => {
          this.__setupListboxNodeEventListener();
        });
      }
    }
  }

  __setupListboxNodeEventListener() {
    this.__listboxOnClick = () => {
      this.opened = false;
    };
    this._listboxNode.addEventListener('click', this.__listboxOnClick);

    this.__listboxOnKeyUp = this.__listboxOnKeyUp.bind(this);
    this._listboxNode.addEventListener('keyup', this.__listboxOnKeyUp);

    this.__listboxOnKeyDown = this.__listboxOnKeyDown.bind(this);
    this._listboxNode.addEventListener('keydown', this.__listboxOnKeyDown);
  }

  __teardownListboxNode() {
    if (this._listboxNode) {
      this._listboxNode.removeEventListener('click', this.__listboxOnClick);
      this._listboxNode.removeEventListener('keyup', this.__listboxOnKeyUp);
      this._listboxNode.removeEventListener('keydown', this.__listboxOnKeyDown);
    }
  }

  /**
   * @overridable Subclassers can override the default
   */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlay({ invokerNode, contentNode } = {}) {
    return overlays.add(
      new LocalOverlayController({
        contentNode,
        invokerNode,
        hidesOnEsc: false,
        hidesOnOutsideClick: true,
        inheritsReferenceObjectWidth: true,
        popperConfig: {
          placement: 'bottom-start',
          modifiers: {
            offset: {
              enabled: false,
            },
          },
        },
      }),
    );
  }

  __setupOverlay() {
    this.__overlay = this._defineOverlay({
      invokerNode: this._invokerNode,
      contentNode: this._listboxNode,
    });

    this.__overlayOnShow = () => {
      this.opened = true;
      if (this.checkedIndex) {
        this.activeIndex = this.checkedIndex;
      }
      this._listboxNode.focus();
    };
    this.__overlay.addEventListener('show', this.__overlayOnShow);

    this.__overlayOnHide = () => {
      this.opened = false;
      this._invokerNode.focus();
    };
    this.__overlay.addEventListener('hide', this.__overlayOnHide);
  }

  __teardownOverlay() {
    this.__overlay.removeEventListener('show', this.__overlayOnShow);
    this.__overlay.removeEventListener('hide', this.__overlayOnHide);
  }

  // eslint-disable-next-line class-methods-use-this
  __isRequired(modelValue) {
    const checkedModelValue = modelValue.find(subModelValue => subModelValue.checked === true);
    if (!checkedModelValue) {
      return { required: false };
    }
    const { value } = checkedModelValue;
    return {
      required:
        (typeof value === 'string' && value !== '') ||
        (typeof value !== 'string' && value !== undefined && value !== null),
    };
  }
}
