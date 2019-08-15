import { html, css, LitElement, SlotMixin } from '@lion/core';
// import { LocalOverlayController, ModalDialogController, overlays } from '@lion/overlays';
import { OverlayController } from '@lion/overlays';

import { FormControlMixin, InteractionStateMixin } from '@lion/field';
import { ValidateMixin } from '@lion/validate';
import './differentKeyNamesShimIE.js';

import '../lion-select-invoker.js';

function detectInteractionMode() {
  if (navigator.appVersion.indexOf('Mac') !== -1) {
    return 'mac';
  }
  return 'windows/linux';
}

/**
 * LionSelectRich: wraps the <lion-listbox> element
 *
 * @customElement lion-select-rich
 * @extends LionField
 */
export class LionSelectRich extends InteractionStateMixin(ValidateMixin(FormControlMixin(SlotMixin(LitElement)))) {
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
      invoker: () =>  document.createElement('lion-select-invoker'),
    };
  }

  get _invokerNode() {
    return this.querySelector('[slot=invoker]');
  }

  // get _listboxNode() {
  //   return this.querySelector('[slot=input]');
  // }

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
    console.log('this.formElements', this.formElements);
    if (this.formElements[index]) {
      this.formElements[index].active = true;
    }
  }

  get formElements() {
    return this._listboxNode.formElements;
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
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }

    this._listboxNode = this.querySelector('[slot=input]');

    this._listboxNode._delegatedParent = this;
    this._listboxNode.formElements.forEach((formElement) => {
      console.log('formElement', formElement);
      formElement.__parentFormGroup = this;
    });

    this.__setupEventListeners();
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
    if (changedProps.has('opened') && this.__overlay) {
      if (this.opened) {
        console.log('overlay show');

        // if (window.innerWidth > 600) {
        //   this._listboxNode.style.position = '';

          this.__overlay.show();
        // } else {
        //   this._listboxNode.style.position = 'relative';
        //   this._listboxNode.style.display = '';
        //   this.__overlayMobile.show();
        // }
      } else {
        // console.log('overlay hide');

        this.__overlay.hide();
        // this.__overlayMobile.hide();
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

  // /**
  //  * Overrides FormRegistrar adding to make sure children have specific default states when added
  //  *
  //  * @override
  //  * @param {FormControl} child
  //  */
  // addFormElement(child) {
  //   super.addFormElement(child);
  //   // we need to adjust the elements being registered
  //   /* eslint-disable no-param-reassign */
  //   child.id = child.id || `${this.localName}-option-${uuid()}`;

  //   if (this.disabled) {
  //     child.makeRequestToBeDisabled();
  //   }
  //   // the first elements checked by default
  //   if (!this.__hasInitialSelectedFormElement && (!child.disabled || this.disabled)) {
  //     child.active = true;
  //     child.checked = true;
  //     this.__hasInitialSelectedFormElement = true;
  //   }

  //   this.__setAttributeForAllFormElements('aria-setsize', this.formElements.length);
  //   child.setAttribute('aria-posinset', this.formElements.length);

  //   this.__onChildModelValueChanged({ target: child });
  //   this.resetInteractionState();
  //   /* eslint-enable no-param-reassign */
  // }




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

    this._listboxNode.addEventListener('active-changed', this.__onChildActiveChanged);
    this._listboxNode.addEventListener('model-value-changed', this.__onChildModelValueChanged);
    // this._listboxNode.addEventListener('keyup', this.__onKeyUp);

    // For switching on closed invoker
    this._invokerNode.addEventListener('keyup', this.__onKeyUp);
  }

  __teardownEventListeners() {
    this._listboxNode.removeEventListener('active-changed', this.__onChildActiveChanged);
    this._listboxNode.removeEventListener('model-value-changed', this.__onChildModelValueChanged);
    // this._listboxNode.removeEventListener('keyup', this.__onKeyUp);

    this._invokerNode.removeEventListener('keyup', this.__onKeyUp);
  }

  __onChildActiveChanged({ target }) {
    console.log('__onChildActiveChanged');

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

  // __setAttributeForAllFormElements(attribute, value) {
  //   this.formElements.forEach(formElement => {
  //     formElement.setAttribute(attribute, value);
  //   });
  // }

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
    console.log('__listboxOnKeyUp', ev.key);

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
        console.log('omhoog met die pijl');
        this.activeIndex = this.__getPreviousEnabledOption(this.activeIndex);
        break;
      case 'ArrowDown':
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

    const keys = ['ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (keys.includes(key) && this.interactionMode === 'windows/linux') {
      console.log('set checked');
      this.checkedIndex = this.activeIndex;
    }
  }

  __listboxOnKeyDown(ev) {
    console.log('__listboxOnKeyDown');

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
    console.log('__onKeyUp', this.opened, this.disabled);

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
      console.log('__listboxOnClick');
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

  _defineOverlay() {
    return new OverlayController({
      contentNode: this._listboxNode,
      invokerNode: this._invokerNode,
      hidesOnEsc: false,
      hidesOnOutsideClick: true,
    },
    [
      {
        condition: () => window.innerWidth > 600,
        // ...withDropdownConfig()
        inheritsReferenceObjectWidth: true,
        popperConfig: {
          placement: 'bottom-start',
          modifiers: {
            offset: {
              enabled: false,
            },
          },
        },
      },
      {
        condition: () => window.innerWidth <= 600,
        // ...withModalDialogConfig()
        isGlobal: true,
        hasBackdrop: true,
        preventsScroll: true,
        trapsKeyboardFocus: true,
        hidesOnEsc: true,
      }
    ]
    );
  }

  __setupOverlay() {
    this.__overlay = this._defineOverlay();

    // this.__overlay = overlays.add(
    //   new LocalOverlayController({
    //     contentNode: this._listboxNode,
    //     invokerNode: this._invokerNode,
    //     hidesOnEsc: false,
    //     hidesOnOutsideClick: true,
    //     inheritsReferenceObjectWidth: true,
    //     popperConfig: {
    //       placement: 'bottom-start',
    //       modifiers: {
    //         offset: {
    //           enabled: false,
    //         },
    //       },
    //     },

    //     // contentNode: this._listboxNode,
    //     // invokerNode: this._invokerNode,
    //     // hidesOnEsc: false,
    //     // hidesOnOutsideClick: true,
    //   }),
    // );

    // this.__overlayMobile = overlays.add(
    //   new ModalDialogController({
    //     contentNode: this._listboxNode,
    //     invokerNode: this._invokerNode,
    //     hidesOnEsc: false,
    //     hidesOnOutsideClick: true,
    //   }),
    // );

    this.__overlayOnShow = () => {
      this.opened = true;
      if (this.checkedIndex) {
        this.activeIndex = this.checkedIndex;
      }
      this._listboxNode.focus();
    };
    this.__overlay.addEventListener('show', this.__overlayOnShow);
    // this.__overlayMobile.addEventListener('show', this.__overlayOnShow);

    this.__overlayOnHide = () => {
      this.opened = false;
      this._invokerNode.focus();
    };
    this.__overlay.addEventListener('hide', this.__overlayOnHide);
    // this.__overlayMobile.addEventListener('hide', this.__overlayOnHide);
  }

  __teardownOverlay() {
    this.__overlay.removeEventListener('show', this.__overlayOnShow);
    this.__overlay.removeEventListener('hide', this.__overlayOnHide);
    // this.__overlayMobile.removeEventListener('show', this.__overlayOnShow);
    // this.__overlayMobile.removeEventListener('hide', this.__overlayOnHide);
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

  _getFromAllFormElements(property) {
    return this.formElements.map(e => e[property]);
  }
}
