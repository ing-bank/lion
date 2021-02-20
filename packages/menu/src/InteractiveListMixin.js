/* eslint-disable max-classes-per-file */
import { html, css, dedupeMixin, SlotMixin, DisabledMixin, LitElement } from '@lion/core';
import '@lion/core/src/differentKeyEventNamesShimIE.js';
import { uuid } from './utils/uuid.js';
import { isInView } from './utils/isInView.js';
import {
  isDisabled,
  setDisabled,
  toggleDisabled,
  isChecked,
  setChecked,
  toggleChecked,
  isActive,
  setActive,
  getValue,
} from './utils/listItemInteractions.js';

/**
 * @typedef {'menuitem'|'menuitemcheckbox'|'menuitemradio'|'option'|'treeitem'|'radio'|'checkbox'} InteractiveListItemRole
 */

 /**
  * Lightweight component supporting InteractiveListItemRole as a type.
  *
  * Supports:
  * - 1. menu item
  * <lion-item> Item label </lion-item>
  * - 2. sub menu
  * <lion-item>
  *   <button slot="invoker"> Item label </button>
  *   <lion-menu slot="subitems"> ... </lion-menu>
  * </lion-item>
  *
  * Sets the role property on the right element. For case 1, this would be the item itself,
  * for case 2 it would be the [slot=invoker].
  */
class LionItem extends LitElement {
  static get properties() {
    return {
      type: String,
    }
  }

  get _invokerNode() {
    return this.querySelector('[slot=invoker]');
  }

  constructor() {
    super();
    /** @type {InteractiveListItemRole} */
    this.type = '';
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this._computedType) {
      this._computedType = this.type || 'listitem';
    }
    if (this._invokerNode) {
      this._invokerNode.setAttribute('role', this._computedType);
    } else {
      this.setAttribute('role', this._computedType);
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot></slot>
    `;
  }
}

class LionMenuitem extends LionItem  {
  connectedCallback() {
    this._computedType = `menuitem${this.type}`;
    super.connectedCallback();
  }
}
customElements.define('lion-menuitem', LionMenuitem);

/**
 * Handles keyboard interaction plus bookkeeping for active and selected states.
 * Can be used as a fundament for:
 * - [role="menu|menubar"] having children with [role="menuitem|menuitemcheckbox|menuitemradio"]
 * - [role="listbox"] having children with [role="option"]
 * - [role="toolbar"] having children with [role="radiogroup|radio|group|checkbox|spinbutton"]
 * - [role="tree"] having children with [role="group|treeitem"]
 *
 * An interactive list accepts two types of items:
 * - 'smart' items: responsible for registering themselves and reflecting accessibility properties,
 * for example LionOption
 * - 'regular' items with a [role="menuitem|menuitemcheckbox|menuitemradio|option|radio|checkbox|treeitem|listitem]
 *
 * Features:
 * - keyboard navigation according to [aria specs](https://www.w3.org/TR/wai-aria-practices-1.1) for role
 * - types
 *
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
const InteractiveListMixinImplementation = superclass =>
  class InteractiveListMixin extends DisabledMixin(SlotMixin(superclass)) {
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

          :host([orientation='horizontal']) ::slotted([slot='list']) {
            display: flex;
          }
        `,
      ];
    }

    render() {
      return html`
        <slot name="list"></slot>
        <slot></slot>
      `;
    }

    static get properties() {
      return {
        orientation: { type: String, reflect: true },

        multipleChoice: { type: Boolean, attribute: 'multiple-choice' },

        selectionFollowsFocus: { type: Boolean, attribute: 'selection-follows-focus' },

        rotateKeyboardNavigation: { type: Boolean, attribute: 'rotate-keyboard-navigation' },

        /** renamed hasNoDefaultSelected */
        noPreselect: { type: Boolean, attribute: 'no-preselect' },

        /**
         * By default, a typed character (or a sequence thereof) will be matched against
         * the values of list items. The first and closest match, becomes active
         * (focused or activedescendant depending on _matchMode)
         */
        _activateOnTypedChars: Boolean,

        /**
         * When children are 'smart' (like LionOption), checked and active states will be set
         * to them and they are responsible for setting [aria-selected].
         * When false, `get listItems()` needs to be configured to point to the list items
         */
        _hasSmartListItems: Boolean,

        /**
         * Whenever possible (for [role="listbox|menu"], usually with one level) we use an
         * [active descendant](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant).
         * For [role=toolbar], we use a [roving tabindex](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex)
         * Other examples:
         * - [role="menubar"](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html)
         * - [role="tree"](https://www.w3.org/TR/wai-aria-practices-1.1/examples/treeview/treeview-1/treeview-1b.html)
         * For disclosure menus, we need keyboard navigation, but treat every list item (more precise its anchor child) as a tab stop
         * @type {'activedescendant'|'roving-tabindex'|'none'}
         */
        _activeMode: String,
      };
    }

    get slots() {
      return {
        ...super.slots,
        list: () => document.createElement('div'),
      };
    }

    /**
     * This is the (usually focusable, unless combobox) element that will contain [aria-activedescendant]
     * Depending on the children, role will be "listbox|menu|menubar|tree|toolbar"
     * @type {HTMLElement}
     */
    get _listNode() {
      return /** @type {HTMLElement} */ (Array.from(this.children).find(c => c.slot === 'list'));
    }

    get _scrollTargetNode() {
      return this;
    }

    /**
     * Place in the template that contains children with ._childrenRoles
     * @type {HTMLSlotElement}
     */
    get _listItemsSlot() {
      /** @type {ShadowRoot} */
      const { shadowRoot } = this;
      const slots = Array.from(shadowRoot.querySelectorAll('slot'));
      return /** @type {HTMLSlotElement} */ (slots.find(s => !s.name));
    }

    /**
     * @type {HTMLElement[]}
     */
    get listItems() {
      // @ts-ignore
      return this.__listItems || this.formElements;
    }

    /**
     * @overridable
     * @type {InteractiveListItemRole[]}
     */
    // eslint-disable-next-line class-methods-use-this
    get _childrenRoles() {
      return ['menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'treeitem', 'listitem'];
    }

    get activeIndex() {
      return this.listItems.findIndex(el => isActive(el));
    }

    set activeIndex(index) {
      if (this.listItems[index]) {
        const prevActiveEl = this.activeItem;
        const el = this.listItems[index];
        // Unset siblings
        this.listItems.forEach(item => {
          setActive(item, true);
        });
        setActive(el);

        // Update 'active mode'
        if (this._activeMode === 'activedescendant') {
          this._listNode.setAttribute('aria-activedescendant', el.id);
        } else if (this._activeMode === 'roving-tabindex') {
          el.focus();
        }

        if (!isInView(this._scrollTargetNode, el)) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        if (this._activeMode === 'roving-tabindex') {
          if (prevActiveEl) {
            prevActiveEl.setAttribute('tabindex', '-1');
          }
          el.setAttribute('tabindex', '0');
        }
      }
    }

    get activeItem() {
      return this.listItems[this.activeIndex];
    }

    /**
     * @type {number | number[]}
     */
    get checkedIndex() {
      if (!this.multipleChoice) {
        return this.listItems.findIndex(o => isChecked(o));
      }
      return this.listItems.filter(o => isChecked(o)).map(o => this.listItems.indexOf(o));
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
      const item = this.listItems[index];
      if (item) {
        if (!this.multiple) {
          // Uncheck all
          this.listItems.forEach(item => {
            setChecked(item, true);
          });
          setChecked(this.listItems[index]);
        } else {
          toggleChecked(this.listItems[index]);
        }
      }
    }

    /**
     * Since we cannot check instanceof with mixins, use this getter instead
     */
    // eslint-disable-next-line class-methods-use-this
    get isInteractiveList() {
      return true;
    }

    constructor() {
      super();

      this.orientation = 'vertical';
      this.multipleChoice = false;
      this.selectionFollowsFocus = false;
      this.rotateKeyboardNavigation = false;
      /**
       * The level of nested menus. Will be reflected as attribute for styling purposes
       */
      this.level = 0;
      /** @type {'activedescendant'|'roving-tabindex'|'disclosure'} */
      this._activeMode = 'activedescendant';
      this._hasSmartChildren = false;
      /**
       * The role that will be put on _listNode
       * @type {'menu'|'menubar'|'listbox'|'tree'|'toolbar'}
       */
      this._listRole = 'menu';

      /** @type {HTMLElement[]} */
      this.__listItems = [];

      /**
       * The pending char sequence that will set active list item
       */
      this._activateOnCharTimeout = 2000;
      this.__typedChars = [];

      this._onListClick = this._onListClick.bind(this);
      this._onListKeyUp = this._onListKeyUp.bind(this);
      this._onListKeyDown = this._onListKeyDown.bind(this);
    }

    /**
     * @param {import('lit-element').PropertyValues } changedProperties
     */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this._setupList();
    }

    _setupList() {
      /**
       * @param {HTMLElement} node
       */
      const shouldAddItem = node => {
        const role = /** @type {InteractiveListItemRole|'group'} */ (node.getAttribute('role'));
        return (role && this._childrenRoles.includes(role)) || node.hasAttribute('data-item');
      };

      this._listItemsSlot.addEventListener('slotchange', () => {
        const nodes = /** @type {HTMLElement[]} */ (this._listItemsSlot.assignedNodes());
        const newItems = [];

        // Move items to _listNode and add interactive node references (with [role]) to listItems
        nodes.forEach(node => {
          // move list item to element with aria-activedescendant ([role="listbox|menu|menubar"])
          this._listNode.appendChild(node);
          if (this._hasSmartChildren || !(node instanceof Element)) {
            return;
          }
          const shouldAdd = shouldAddItem(node);
          /**
           * When [role=group], we can have a grouped set within a level, like multiple menuitemradios or -checkboxes
           * When no role at all, we might deal with a wrapped node (for instance triggering a submenu)
           * Alternatively, when _activeMode is ['disclosure'](https://www.w3.org/TR/wai-aria-practices-1.1/examples/disclosure/disclosure-navigation.html),
           * we search for a[href]
           */
          if (!shouldAdd) {
            // for now allow one nested group as direct child of [role="menu|menubar"]
            Array.from(node.children).forEach(child => {
              if (shouldAddItem(child)) {
                newItems.push(child);
              }
            });
          } else {
            newItems.push(node);
          }
        });

        newItems.forEach(item => {
          if (!this.__listItems.includes(item)) {
            this.__listItems.push(item);
          }
        });

        this._initListItems(newItems);
      });

      this._listNode.setAttribute('role', this._listRole);
      this._listNode.setAttribute('tabindex', '0');
      this._listNode.addEventListener('click', this._onListClick);
      this._listNode.addEventListener('keyup', this._onListKeyUp);
      this._listNode.addEventListener('keydown', this._onListKeyDown);
    }

    _initListItems() {
      this.listItems.forEach(item => {
        if (this._activeMode === 'roving-tabindex') {
          // This makes them focusable, but not part of tab sequence
          item.setAttribute('tabindex', '-1');
        } else if (this._activeMode === 'activedescendant') {
          // eslint-disable-next-line no-param-reassign
          item.id = item.id || `${this.localName}-item-${uuid()}`;
        }
      });

      if (!this.noPreselect && this.checkedIndex === -1) {
        this.checkedIndex = 0;
      }
    }

    /**
     * @desc
     * Handle various keyboard controls; UP/DOWN will shift focus; SPACE selects
     * an item.
     *
     * @param {KeyboardEvent} ev - the keydown event object
     */
    _onListKeyDown(ev) {
      if (isDisabled(this)) {
        return;
      }

      const charHandled = this.__onKeydownActivateTypedChars(ev);
      if (charHandled) {
        return;
      }

      const { key } = ev;

      switch (key) {
        case 'Enter':
        case ' ':
          ev.preventDefault();
          // ev.stopPropagation(); // prevent nested menus from conflicting
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
          this.activeIndex = this._getPreviousEnabledOption(this.listItems.length - 1, 0);
          break;
        /* no default */
      }

      const keys = ['ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (keys.includes(key) && this.selectionFollowsFocus && !this.multipleChoice) {
        this.setCheckedIndex(this.activeIndex);
      }
    }

    /**
     * @param {KeyboardEvent} ev - the keydown event object
     * @returns {boolean} whether a character key or a number was typed
     */
    __onKeydownActivateTypedChars(ev) {
      if (!this._activateOnTypedChars) {
        return false;
      }

      const { key, code } = ev;

      if (code.startsWith('Key') || code.startsWith('Digit') || code.startsWith('Numpad')) {
        this.__typedChars.push(key);
        // TODO: schedule in updated loop for perf
        const chars = this.__typedChars.join('');
        const matchItem = this.listItems.find(item => this._matchCharsAgainstItem({ chars, item }));
        this.activeIndex = this.listItems.indexOf(matchItem);

        if (typeof this.__clearCharTimeout === 'function') {
          this.__clearCharTimeout();
        }
        this.__clearCharTimeout = setTimeout(() => {
          this.__typedChars = [];
        }, this._activateOnCharTimeout);

        return true;
      }
      return false;
    }

    /**
     * @overridable
     * @param {{chars: string[], item: HTMLElement}} config
     */
    // eslint-disable-next-line class-methods-use-this
    _matchCharsAgainstItem({ chars, item }) {
      const value = getValue(item).toLowerCase();
      return value.startsWith(chars);
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
    _onListClick(ev) {
      /** @type {HTMLElement} */
      const { target } = ev;
      const item = /** @type {HTMLElement} */ (target.closest('[role]')); // TODO: we might need a more specific contract
      const foundIndex = this.listItems.indexOf(item);
      if (foundIndex > -1) {
        this.activeIndex = foundIndex;
        this.setCheckedIndex(foundIndex);
      }
    }

    /**
     * @overridable
     * @param {KeyboardEvent} ev
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    _onListKeyUp(ev) {
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

    /**
     * @param {number} currentIndex
     * @param {number} offset
     */
    __getNextOption(currentIndex, offset) {
      /**
       * @param {number} i
       */
      const until = i => (offset === 1 ? i < this.listItems.length : i >= 0);

      for (let i = currentIndex + offset; until(i); i += offset) {
        if (this.listItems[i] && !isDisabled(this.listItems[i])) {
          return i;
        }
      }

      if (this.rotateKeyboardNavigation) {
        const startIndex = offset === -1 ? this.listItems.length - 1 : 0;
        for (let i = startIndex; until(i); i += 1) {
          if (this.listItems[i] && !isDisabled(this.listItems[i])) {
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
  };
export const InteractiveListMixin = dedupeMixin(InteractiveListMixinImplementation);
