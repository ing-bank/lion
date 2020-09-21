import { ChoiceGroupMixin, FormControlMixin, FormRegistrarMixin } from '@lion/form-core';
import { css, html, dedupeMixin, ScopedElementsMixin, SlotMixin } from '@lion/core';
import '@lion/core/src/differentKeyEventNamesShimIE.js';
import '@lion/core/src/closestPolyfill.js';
import { LionOptions } from './LionOptions.js';

// TODO: extract ListNavigationWithActiveDescendantMixin that can be reused in [role="menu"]
// having children with [role="menuitem|menuitemcheckbox|menuitemradio|option"] and
// list items that can be found via MutationObserver or registration (.formElements)

/**
 * @typedef {import('./LionOption').LionOption} LionOption
 * @typedef {import('../types/ListboxMixinTypes').ListboxMixin} ListboxMixin
 * @typedef {import('../types/ListboxMixinTypes').ListboxHost} ListboxHost
 * @typedef {import('@lion/form-core/types/registration/FormRegistrarPortalMixinTypes').FormRegistrarPortalHost} FormRegistrarPortalHost
 */

function uuid() {
  return Math.random().toString(36).substr(2, 10);
}

/**
 * @param {HTMLElement} container
 * @param {HTMLElement} element
 * @param {Boolean} [partial]
 */
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
 * @type {ListboxMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
const ListboxMixinImplementation = superclass =>
  class ListboxMixin extends FormControlMixin(
    ScopedElementsMixin(ChoiceGroupMixin(SlotMixin(FormRegistrarMixin(superclass)))),
  ) {
    static get properties() {
      return {
        orientation: String,
        selectionFollowsFocus: {
          type: Boolean,
          attribute: 'selection-follows-focus',
        },
        rotateKeyboardNavigation: {
          type: Boolean,
          attribute: 'rotate-keyboard-navigation',
        },
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

          :host([hidden]) {
            display: none;
          }

          :host([disabled]) {
            color: #adadad;
          }

          :host([orientation='horizontal']) ::slotted([role='listbox']) {
            display: flex;
          }
        `,
      ];
    }

    static get scopedElements() {
      return {
        ...super.scopedElements,
        'lion-options': LionOptions,
      };
    }

    get slots() {
      return {
        ...super.slots,
        input: () => {
          const lionOptions = /** @type {HTMLElement & FormRegistrarPortalHost} */ (document.createElement(
            ListboxMixin.getScopedTagName('lion-options'),
          ));
          lionOptions.registrationTarget = this;
          return lionOptions;
        },
      };
    }

    // TODO: inherit from FormControl ?
    get _inputNode() {
      return /** @type {HTMLElement} */ (this.querySelector('[slot="input"]'));
    }

    get _listboxNode() {
      return /** @type {LionOptions} */ (this._inputNode);
    }

    get _listboxActiveDescendantNode() {
      return this._listboxNode.querySelector(`#${this._listboxActiveDescendant}`);
    }

    /**
     * @overridable
     */
    get _listboxSlot() {
      return /** @type {ShadowRoot} */ (this.shadowRoot).querySelector('slot[name=input]');
    }

    get _scrollTargetNode() {
      return this._listboxNode;
    }

    get serializedValue() {
      return this.modelValue;
    }

    // Duplicating from FormGroupMixin, because you cannot independently inherit/override getter + setter.
    // If you override one, gotta override the other, they go in pairs.
    set serializedValue(value) {
      super.serializedValue = value;
    }

    get activeIndex() {
      return this.formElements.findIndex(el => el.active === true);
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

    /**
     * @type {number | number[]}
     */
    get checkedIndex() {
      const options = this.formElements;
      if (!this.multipleChoice) {
        return options.indexOf(options.find(o => o.checked));
      }
      return options.filter(o => o.checked).map(o => options.indexOf(o));
    }

    /**
     * @deprecated
     * This setter exists for backwards compatibility of single choice groups.
     * A setter api would be confusing for a multipleChoice group. Use `setCheckedIndex` instead.
     * @param {number} index
     */
    set checkedIndex(index) {
      this.setCheckedIndex(index);
    }

    /**
     * When `multipleChoice` is false, will toggle, else will check provided index
     * @param {Number} index
     */
    setCheckedIndex(index) {
      if (this.formElements[index]) {
        if (!this.multipleChoice) {
          this.formElements[index].checked = true;
        } else {
          this.formElements[index].checked = !this.formElements[index].checked;
          // __onChildCheckedChanged, which also responds to programmatic (model)value changes
          // of children, will do the rest
        }
      }
    }

    constructor() {
      super();
      /**
       * When setting this to true, on initial render, no option will be selected.
       * It it advisable to override `_noSelectionTemplate` method in the select-invoker
       * to render some kind of placeholder initially
       */
      this.hasNoDefaultSelected = false;
      /**
       * Informs screen reader and affects keyboard navigation.
       * By default 'vertical'
       */
      this.orientation = 'vertical';
      /**
       * Will give first option active state when navigated to the next option from
       * last option.
       */
      this.rotateKeyboardNavigation = false;
      /**
       * When true, will synchronize activedescendant and selected element on
       * arrow key navigation.
       * This behavior can usually be seen on <select> on the Windows platform.
       * Note that this behavior cannot be used when multiple-choice is true.
       * See: https://www.w3.org/TR/wai-aria-practices/#kbd_selection_follows_focus
       */
      this.selectionFollowsFocus = false;

      /** @type {number | null} */
      this._listboxActiveDescendant = null;
      this.__hasInitialSelectedFormElement = false;
      this._repropagationRole = 'choice-group'; // configures FormControlMixin

      /** @type {EventListener} */
      this._listboxOnKeyDown = this._listboxOnKeyDown.bind(this);
      /** @type {EventListener} */
      this._listboxOnClick = this._listboxOnClick.bind(this);
      /** @type {EventListener} */
      this._listboxOnKeyUp = this._listboxOnKeyUp.bind(this);
      /** @type {EventListener} */
      this._onChildActiveChanged = this._onChildActiveChanged.bind(this);
      /** @type {EventListener} */
      this.__proxyChildModelValueChanged = this.__proxyChildModelValueChanged.bind(this);
      /** @type {EventListener} */
      this.__preventScrollingWithArrowKeys = this.__preventScrollingWithArrowKeys.bind(this);
    }

    connectedCallback() {
      if (this._listboxNode) {
        // if there is none yet, it will be supplied via 'get slots'
        this._listboxNode.registrationTarget = this;
      }
      super.connectedCallback();
      this._setupListboxNode();
      this.__setupEventListeners();

      // TODO: should this be handled at a more generic level?
      this.registrationComplete.then(() => {
        this.__initInteractionStates();
      });
    }

    /**
     * @param {import('lit-element').PropertyValues } changedProperties
     */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.__moveOptionsToListboxNode();
    }

    /**
     * Moves options put in unnamed slot to slot with [role="listbox"]
     */
    __moveOptionsToListboxNode() {
      const slot = /** @type {HTMLSlotElement} */ (
        /** @type {ShadowRoot} */ (this.shadowRoot).getElementById('options-outlet')
      );
      if (slot) {
        slot.addEventListener('slotchange', () => {
          slot.assignedNodes().forEach(node => {
            this._listboxNode.appendChild(node);
          });
        });
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      this._teardownListboxNode();
      this.__teardownEventListeners();
    }

    /**
     * In the select disabled options are still going to a possible value for example
     * when prefilling or programmatically setting it.
     *
     * @override
     */
    _getCheckedElements() {
      return this.formElements.filter(el => el.checked);
    }

    __initInteractionStates() {
      this.initInteractionState();
    }

    /**
     * @param {import('lit-element').PropertyValues } changedProperties
     */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (this.formElements.length === 1) {
        this.singleOption = true;
      }

      if (changedProperties.has('disabled')) {
        if (this.disabled) {
          // this._invokerNode.makeRequestToBeDisabled();
          this.__requestOptionsToBeDisabled();
        } else {
          // this._invokerNode.retractRequestToBeDisabled();
          this.__retractRequestOptionsToBeDisabled();
        }
      }
    }

    /**
     * @override
     */
    // eslint-disable-next-line
    _inputGroupInputTemplate() {
      return html`
        <div class="input-group__input">
          <slot name="input"></slot>
          <slot id="options-outlet"></slot>
        </div>
      `;
    }

    /**
     * Overrides FormRegistrar adding to make sure children have specific default states when added
     *
     * @override
     * @param {LionOption} child
     * @param {Number} indexToInsertAt
     */
    // @ts-expect-error
    addFormElement(child, indexToInsertAt) {
      // @ts-expect-error
      super.addFormElement(/** @type {FormControl} */ child, indexToInsertAt);

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

      // TODO: small perf improvement could be made if logic below would be scheduled to next update,
      // so it occurs once for all options
      this.__setAttributeForAllFormElements('aria-setsize', this.formElements.length);
      this.formElements.forEach((el, idx) => {
        el.setAttribute('aria-posinset', idx + 1);
      });

      this.__proxyChildModelValueChanged(
        /** @type {Event & { target: LionOption; }} */ ({ target: child }),
      );
      this.resetInteractionState();
      /* eslint-enable no-param-reassign */
    }

    __setupEventListeners() {
      this._listboxNode.addEventListener(
        'active-changed',
        /** @type {EventListener} */ (this._onChildActiveChanged),
      );
      this._listboxNode.addEventListener(
        'model-value-changed',
        /** @type {EventListener} */ (this.__proxyChildModelValueChanged),
      );

      // this._listboxNode.addEventListener('checked-changed', this.__onChildCheckedChanged);
    }

    __teardownEventListeners() {
      this._listboxNode.removeEventListener(
        'active-changed',
        /** @type {EventListener} */ (this._onChildActiveChanged),
      );
      this._listboxNode.removeEventListener(
        'model-value-changed',
        /** @type {EventListener} */ (this.__proxyChildModelValueChanged),
      );
    }

    /**
     * @param {Event & { target: LionOption }} ev
     */
    _onChildActiveChanged({ target }) {
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

    /**
     * @param {Event & { target: LionOption }} cfgOrEvent
     */
    __onChildCheckedChanged(cfgOrEvent) {
      const { target } = cfgOrEvent;
      if (cfgOrEvent.stopPropagation) {
        cfgOrEvent.stopPropagation();
      }
      if (target.checked) {
        if (!this.multipleChoice) {
          this.formElements.forEach(formElement => {
            if (formElement !== target) {
              // eslint-disable-next-line no-param-reassign
              formElement.checked = false;
            }
          });
        }
      }
    }

    /**
     * // TODO: add to choiceGroup
     * @param {string} attribute
     * @param {number} value
     */
    __setAttributeForAllFormElements(attribute, value) {
      this.formElements.forEach(formElement => {
        formElement.setAttribute(attribute, value);
      });
    }

    /**
     * @param {Event & { target: LionOption; }} ev
     */
    __proxyChildModelValueChanged(ev) {
      // We need to redispatch the model-value-changed event on 'this', so it will
      // align with FormControl.__repropagateChildrenValues method. Also, this makes
      // it act like a portal, in case the listbox is put in a modal overlay on body level.
      if (ev.stopPropagation) {
        ev.stopPropagation();
      }
      this.__onChildCheckedChanged(ev);
      this.requestUpdate('modelValue');
      this.dispatchEvent(
        new CustomEvent('model-value-changed', { detail: { element: ev.target } }),
      );
    }

    /**
     * @param {number} currentIndex
     * @param {number} offset
     */
    __getNextOption(currentIndex, offset) {
      /**
       * @param {number} i
       */
      const until = i => (offset === 1 ? i < this.formElements.length : i >= 0);

      for (let i = currentIndex + offset; until(i); i += offset) {
        if (this.formElements[i] && !this.formElements[i].disabled) {
          return i;
        }
      }

      if (this.rotateKeyboardNavigation) {
        const startIndex = offset === -1 ? this.formElements.length - 1 : 0;
        for (let i = startIndex; until(i); i += 1) {
          if (this.formElements[i] && !this.formElements[i].disabled) {
            return i;
          }
        }
      }
      return currentIndex;
    }

    /**
     * @param {number} currentIndex
     * @param {number} [offset=1]
     */
    _getNextEnabledOption(currentIndex, offset = 1) {
      return this.__getNextOption(currentIndex, offset);
    }

    /**
     * @param {number} currentIndex
     * @param {number} [offset=-1]
     */
    _getPreviousEnabledOption(currentIndex, offset = -1) {
      return this.__getNextOption(currentIndex, offset);
    }

    /**
     * @desc
     * Handle various keyboard controls; UP/DOWN will shift focus; SPACE selects
     * an item.
     *
     * @param {KeyboardEvent} ev - the keydown event object
     */
    _listboxOnKeyDown(ev) {
      if (this.disabled) {
        return;
      }

      const { key } = ev;

      switch (key) {
        case 'Enter':
        case ' ':
          ev.preventDefault();
          this.setCheckedIndex(this.activeIndex);
          break;
        case 'ArrowUp':
          ev.preventDefault();
          if (this.orientation === 'vertical') {
            this.activeIndex = this._getPreviousEnabledOption(this.activeIndex);
          }
          break;
        case 'ArrowLeft':
          if (this.orientation === 'horizontal') {
            this.activeIndex = this._getPreviousEnabledOption(this.activeIndex);
          }
          break;
        case 'ArrowDown':
          ev.preventDefault();
          if (this.orientation === 'vertical') {
            this.activeIndex = this._getNextEnabledOption(this.activeIndex);
          }
          break;
        case 'ArrowRight':
          if (this.orientation === 'horizontal') {
            this.activeIndex = this._getNextEnabledOption(this.activeIndex);
          }
          break;
        case 'Home':
          ev.preventDefault();
          this.activeIndex = this._getNextEnabledOption(0, 0);
          break;
        case 'End':
          ev.preventDefault();
          this.activeIndex = this._getPreviousEnabledOption(this.formElements.length - 1, 0);
          break;
        /* no default */
      }

      const keys = ['ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (keys.includes(key) && this.selectionFollowsFocus && !this.multipleChoice) {
        this.setCheckedIndex(this.activeIndex);
      }
    }

    // TODO: move to ChoiceGroupMixin?
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

    _setupListboxNode() {
      if (this._listboxNode) {
        this.__setupListboxNodeInteractions();
      } else if (this._listboxSlot) {
        /**
         * For ShadyDom the listboxNode is available right from the start so we can add those events
         * immediately.
         * For native ShadowDom the select gets render before the listboxNode is available so we
         * will add an event to the slotchange and add the events once available.
         */
        this._listboxSlot.addEventListener('slotchange', () => {
          this.__setupListboxNodeInteractions();
        });
      }
    }

    /**
     * Helper method used within `._setupListboxNode`
     */
    __setupListboxNodeInteractions() {
      this._listboxNode.setAttribute('role', 'listbox');
      this._listboxNode.setAttribute('aria-orientation', this.orientation);
      this._listboxNode.setAttribute('aria-multiselectable', `${this.multipleChoice}`);
      this._listboxNode.setAttribute('tabindex', '0');
      this._listboxNode.addEventListener('click', this._listboxOnClick);
      this._listboxNode.addEventListener('keyup', this._listboxOnKeyUp);
      this._listboxNode.addEventListener('keydown', this._listboxOnKeyDown);
      /** Since _scrollTargetNode can be _listboxNode, handle here  */
      this._scrollTargetNode.addEventListener('keydown', this.__preventScrollingWithArrowKeys);
    }

    _teardownListboxNode() {
      if (this._listboxNode) {
        this._listboxNode.removeEventListener('keydown', this._listboxOnKeyDown);
        this._listboxNode.removeEventListener('click', this._listboxOnClick);
        this._listboxNode.removeEventListener('keyup', this._listboxOnKeyUp);
      }
    }

    /**
     * @param {KeyboardEvent} ev
     */
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
     * @overridable
     * @param {MouseEvent} ev
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    _listboxOnClick(ev) {
      const option = /** @type {HTMLElement} */ (ev.target).closest('[role=option]');
      const foundIndex = this.formElements.indexOf(option);
      if (foundIndex > -1) {
        this.activIndex = foundIndex;
      }
    }

    /**
     * @overridable
     * @param {KeyboardEvent} ev
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    _listboxOnKeyUp(ev) {
      if (this.disabled) {
        return;
      }
      const { key } = ev;
      // eslint-disable-next-line default-case
      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'Home':
        case 'End':
        case ' ':
        case 'Enter':
          ev.preventDefault();
      }
    }
  };

export const ListboxMixin = dedupeMixin(ListboxMixinImplementation);
