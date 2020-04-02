import { ChoiceGroupMixin } from '@lion/choice-input';
import { css, html, LitElement, ScopedElementsMixin, SlotMixin } from '@lion/core';
import { FormControlMixin, FormRegistrarMixin, InteractionStateMixin } from '@lion/field';
import { formRegistrarManager } from '@lion/field/src/registration/formRegistrarManager.js';
import { OverlayMixin, withDropdownConfig } from '@lion/overlays';
import { ValidateMixin } from '@lion/validate';
import './differentKeyNamesShimIE.js';
import { LionSelectInvoker } from './LionSelectInvoker.js';

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

function isInView(container, element, partial = false) {
  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;
  const eTop = element.offsetTop;
  const eBottom = eTop + element.clientHeight;
  const isTotal = eTop >= cTop && eBottom <= cBottom;
  let isPartial;

  if (partial === true) {
    isPartial = (eTop < cTop && eBottom > cTop) || (eBottom > cBottom && eTop < cBottom);
  } else if (typeof partial === 'number') {
    if (eTop < cTop && eBottom > cTop) {
      isPartial = ((eBottom - cTop) * 100) / element.clientHeight > partial;
    } else if (eBottom > cBottom && eTop < cBottom) {
      isPartial = ((cBottom - eTop) * 100) / element.clientHeight > partial;
    }
  }
  return isTotal || isPartial;
}

/**
 * LionSelectRich: wraps the <lion-listbox> element
 *
 * @customElement lion-select-rich
 * @extends {LitElement}
 */
export class LionSelectRich extends ScopedElementsMixin(
  ChoiceGroupMixin(
    OverlayMixin(
      FormRegistrarMixin(
        InteractionStateMixin(ValidateMixin(FormControlMixin(SlotMixin(LitElement)))),
      ),
    ),
  ),
) {
  static get scopedElements() {
    return {
      ...super.scopedElements,
      'lion-select-invoker': LionSelectInvoker,
    };
  }

  static get properties() {
    return {
      disabled: {
        type: Boolean,
        reflect: true,
      },

      readOnly: {
        type: Boolean,
        reflect: true,
        attribute: 'readonly',
      },

      interactionMode: {
        type: String,
        attribute: 'interaction-mode',
      },

      /**
       * When setting this to true, on initial render, no option will be selected.
       * It it advisable to override `_noSelectionTemplate` method in the select-invoker
       * to render some kind of placeholder initially
       */
      hasNoDefaultSelected: {
        type: Boolean,
        reflect: true,
        attribute: 'has-no-default-selected',
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

  get slots() {
    return {
      ...super.slots,
      invoker: () =>
        document.createElement(this.constructor.getScopedTagName('lion-select-invoker')),
    };
  }

  get _invokerNode() {
    return Array.from(this.children).find(child => child.slot === 'invoker');
  }

  get _listboxNode() {
    return (
      (this._overlayCtrl && this._overlayCtrl.contentNode) ||
      Array.from(this.children).find(child => child.slot === 'input')
    );
  }

  get _listboxActiveDescendantNode() {
    return this._listboxNode.querySelector(`#${this._listboxActiveDescendant}`);
  }

  get modelValue() {
    const el = this.formElements.find(option => option.checked);
    return el ? el.modelValue.value : '';
  }

  set modelValue(value) {
    const el = this.formElements.find(option => option.modelValue.value === value);

    if (el) {
      el.checked = true;
    } else {
      // cache user set modelValue, and then try it again when registration is done
      this.__cachedUserSetModelValue = value;
    }

    this.requestUpdate('modelValue');
  }

  get serializedValue() {
    return this.modelValue;
  }

  get checkedIndex() {
    let checkedIndex = -1;
    this.formElements.forEach((option, i) => {
      if (option.checked) {
        checkedIndex = i;
      }
    });
    return checkedIndex;
  }

  set checkedIndex(index) {
    if (this._listboxNode.children[index]) {
      this._listboxNode.children[index].checked = true;
    }
  }

  get activeIndex() {
    return this.formElements.findIndex(el => el.active === true);
  }

  get _scrollTargetNode() {
    return this._overlayContentNode._scrollTargetNode || this._overlayContentNode;
  }

  set activeIndex(index) {
    if (this.formElements[index]) {
      const el = this.formElements[index];
      el.active = true;

      if (!isInView(this._scrollTargetNode, el)) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }

  constructor() {
    super();
    this.interactionMode = 'auto';
    this.disabled = false;
    // for interaction states
    this._listboxActiveDescendant = null;
    this.__hasInitialSelectedFormElement = false;
    this.hasNoDefaultSelected = false;
    this._repropagationRole = 'choice-group'; // configures FormControlMixin
    this.__setupEventListeners();
    this.__initInteractionStates();
  }

  connectedCallback() {
    this._listboxNode.registrationTarget = this;
    if (super.connectedCallback) {
      super.connectedCallback();
    }
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

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.__setupOverlay();
    this.__setupInvokerNode();
    this.__setupListboxNode();

    formRegistrarManager.addEventListener('all-forms-open-for-registration', () => {
      // Now that we have rendered + registered our listbox, try setting the user defined modelValue again
      if (this.__cachedUserSetModelValue) {
        this.modelValue = this.__cachedUserSetModelValue;
      }
    });

    this._invokerNode.selectedElement = this.formElements[this.checkedIndex];
    this.__toggleInvokerDisabled();
  }

  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);
    if (name === 'interactionMode') {
      if (this.interactionMode === 'auto') {
        this.interactionMode = detectInteractionMode();
      }
    }

    if (name === 'disabled' || name === 'readOnly') {
      this.__toggleInvokerDisabled();
    }
  }

  async __initInteractionStates() {
    await this.registrationComplete;
    // This timeout is here, so that we know we handle after the initial model-value
    // event (see firstUpdated method FormConrtolMixin) has fired.
    setTimeout(() => {
      this.initInteractionState();
    });
  }

  get _inputNode() {
    // In FormControl, we get direct child [slot="input"]. This doesn't work, because the overlay
    // system wraps it in [slot="_overlay-shadow-outlet"]
    return this.querySelector('[slot="input"]');
  }

  render() {
    return html`
      ${this._labelTemplate()} ${this._helpTextTemplate()} ${this._inputGroupTemplate()}
      ${this._feedbackTemplate()}
      <slot name="_overlay-shadow-outlet"></slot>
    `;
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('disabled')) {
      if (this.disabled) {
        this._invokerNode.makeRequestToBeDisabled();
        this.__requestOptionsToBeDisabled();
      } else {
        this._invokerNode.retractRequestToBeDisabled();
        this.__retractRequestOptionsToBeDisabled();
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
          this._inputNode.getAttribute('aria-describedby'),
        );
      }

      if (changedProperties.has('showsFeedbackFor')) {
        // The ValidateMixin sets aria-invalid on the inputNode, but in this component we also need it on the invoker
        this._invokerNode.setAttribute('aria-invalid', this._hasFeedbackVisibleFor('error'));
      }
    }

    if (changedProperties.has('modelValue')) {
      this.__syncInvokerElement();
    }
  }

  toggle() {
    this.opened = !this.opened;
  }

  /**
   * @override
   */
  // eslint-disable-next-line
  _inputGroupInputTemplate() {
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
   * @param {Number} indexToInsertAt
   */
  addFormElement(child, indexToInsertAt) {
    super.addFormElement(child, indexToInsertAt);

    // we need to adjust the elements being registered
    /* eslint-disable no-param-reassign */
    child.id = child.id || `${this.localName}-option-${uuid()}`;

    if (this.disabled) {
      child.makeRequestToBeDisabled();
    }

    // the first elements checked by default
    if (
      !this.hasNoDefaultSelected &&
      !this.__hasInitialSelectedFormElement &&
      (!child.disabled || this.disabled)
    ) {
      child.active = true;
      child.checked = true;
      this.__hasInitialSelectedFormElement = true;
    }

    this.__setAttributeForAllFormElements('aria-setsize', this.formElements.length);
    child.setAttribute('aria-posinset', this.formElements.length);

    this.__proxyChildModelValueChanged({ target: child });
    this.resetInteractionState();
    /* eslint-enable no-param-reassign */
  }

  __setupEventListeners() {
    this.__onChildActiveChanged = this.__onChildActiveChanged.bind(this);
    this.__proxyChildModelValueChanged = this.__proxyChildModelValueChanged.bind(this);
    this.__onKeyUp = this.__onKeyUp.bind(this);

    this._listboxNode.addEventListener('active-changed', this.__onChildActiveChanged);
    this._listboxNode.addEventListener('model-value-changed', this.__proxyChildModelValueChanged);
    this.addEventListener('keyup', this.__onKeyUp);
  }

  __teardownEventListeners() {
    this._listboxNode.removeEventListener('active-changed', this.__onChildActiveChanged);
    this._listboxNode.removeEventListener(
      'model-value-changed',
      this.__proxyChildModelValueChanged,
    );
    this._listboxNode.removeEventListener('keyup', this.__onKeyUp);
  }

  __toggleInvokerDisabled() {
    if (this._invokerNode) {
      this._invokerNode.disabled = this.disabled;
      this._invokerNode.readOnly = this.readOnly;
    }
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

  __proxyChildModelValueChanged(ev) {
    // We need to redispatch the model-value-changed event on 'this', so it will
    // align with FormControl.__repropagateChildrenValues method. Also, this makes
    // it act like a portal, in case the listbox is put in a modal overlay on body level.
    if (ev.stopPropagation) {
      ev.stopPropagation();
    }
    this.dispatchEvent(new CustomEvent('model-value-changed', { detail: { element: ev.target } }));
  }

  __syncInvokerElement() {
    // sync to invoker
    if (this._invokerNode) {
      this._invokerNode.selectedElement = this.formElements[this.checkedIndex];
    }
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
      if (!this.disabled && !this.readOnly) {
        this._overlayCtrl.toggle();
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
      this._overlayCtrl.inheritsReferenceWidth = 'min';
    } else {
      this._overlayCtrl.inheritsReferenceWidth = this._initialInheritsReferenceWidth;
    }
  }

  __setupOverlay() {
    this._initialInheritsReferenceWidth = this._overlayCtrl.inheritsReferenceWidth;
    this.__overlayBeforeShow = () => {
      if (this.hasNoDefaultSelected) {
        this._noDefaultSelectedInheritsWidth();
      }
    };
    this.__overlayOnShow = () => {
      if (this.checkedIndex != null) {
        this.activeIndex = this.checkedIndex;
      }
      this._listboxNode.focus();
    };
    this._overlayCtrl.addEventListener('before-show', this.__overlayBeforeShow);
    this._overlayCtrl.addEventListener('show', this.__overlayOnShow);

    this.__overlayOnHide = () => {
      this._invokerNode.focus();
    };
    this._overlayCtrl.addEventListener('hide', this.__overlayOnHide);

    this.__preventScrollingWithArrowKeys = this.__preventScrollingWithArrowKeys.bind(this);
    this._scrollTargetNode.addEventListener('keydown', this.__preventScrollingWithArrowKeys);
  }

  __teardownOverlay() {
    this._overlayCtrl.removeEventListener('show', this.__overlayOnShow);
    this._overlayCtrl.removeEventListener('before-show', this.__overlayBeforeShow);
    this._overlayCtrl.removeEventListener('hide', this.__overlayOnHide);
    this._scrollTargetNode.removeEventListener('keydown', this.__overlayOnHide);
  }

  __preventScrollingWithArrowKeys(ev) {
    if (this.disabled) {
      return;
    }
    const { key } = ev;
    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'Home':
      case 'End':
        ev.preventDefault();
      /* no default */
    }
  }

  /**
   * @override Configures OverlayMixin
   */
  get _overlayInvokerNode() {
    return this._invokerNode;
  }

  /**
   * @override Configures OverlayMixin
   */
  get _overlayContentNode() {
    return this._listboxNode;
  }

  set fieldName(value) {
    this.__fieldName = value;
  }

  get fieldName() {
    const label =
      this.label ||
      (this.querySelector('[slot=label]') && this.querySelector('[slot=label]').textContent);
    return this.__fieldName || label || this.name;
  }
}
