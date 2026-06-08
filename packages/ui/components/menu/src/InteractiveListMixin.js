/* eslint-disable max-classes-per-file */
/* eslint-disable import/no-extraneous-dependencies */
import { html, css, LitElement } from 'lit';
import { SlotMixin, DisabledMixin } from '@lion/ui/core.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { MoreButtonMenuMixin } from './MoreButtonMenuMixin.js';
import { uuid } from './utils/uuid.js';
import { isInView } from './utils/isInView.js';
import {
  isDisabled,
  isChecked,
  setChecked,
  toggleChecked,
  isActive,
  setActive,
  getValue,
} from './utils/listItemInteractions.js';

/**
 * @typedef {import('../types/InteractiveListMixinTypes.js').InteractiveListItemRole} InteractiveListItemRole
 */

// TODO: consider renaming to FocusGroupMixin

// TODO: make all available in controller/directive (same logic with an elegant prop-to-host-mapping)

/**
 * @param {Element} potentialFocusable
 * @returns {Element|null}
 */
function isFocusableElement(potentialFocusable) {
  // @ts-ignore - returns Element or falsy value
  return (
    potentialFocusable &&
    (potentialFocusable.hasAttribute('tabindex') ||
      ['BUTTON', 'A'].includes(potentialFocusable.tagName))
  );
}

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
export class LionItem extends LitElement {
  /** @type {any} */
  static get properties() {
    return {
      type: { type: String },
    };
  }

  get _invokerNode() {
    return /** @type {HTMLElement[]} */ (Array.from(this.children)).find(
      child => child.slot === 'invoker',
    );
  }

  static styles = [
    css`
      :host {
        display: block;
      }
    `,
  ];

  constructor() {
    super();
    /** @type {InteractiveListItemRole |''} */
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

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot></slot>
    `;
  }
}

export class LionMenuitem extends LionItem {
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
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const InteractiveListMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class InteractiveListMixin extends DisabledMixin(SlotMixin(MoreButtonMenuMixin(superclass))) {
    /** @type {any} */
    static styles = [
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

    render() {
      return html`
        <slot name="list"></slot>
        <slot></slot>
      `;
    }

    static get properties() {
      return {
        // TODO: align with name of open-ui => "inline|block" in focusgroup
        orientation: { type: String, reflect: true },
        // TODO: align with name of platform => ("multiple" in select, selection not part of focusgroup)
        multipleChoice: { type: Boolean, attribute: 'multiple-choice' },
        // TODO: align with name of open-ui
        selectionFollowsFocus: { type: Boolean, attribute: 'selection-follows-focus' },
        // TODO: align with name of open-ui => "wrap" in focsugroup
        rotateKeyboardNavigation: { type: Boolean, attribute: 'rotate-keyboard-navigation' },
        // TODO: align with name of open-ui
        noPreselect: { type: Boolean, attribute: 'no-preselect' },

        // TODO: implement, for now we start with only more-menu. See instructions in code about more menu.
        // Values:
        // - 'more-menu'
        // - 'scroll-buttons' (think of those material design tab bars)
        // - 'scroll-bar' (puts overflow: scroll on it) (think of tab bars, tables etc.)
        itemWrap: { type: Boolean, attribute: 'item-wrap' },

        _activateOnTypedChars: Boolean,
        _hasSmartListItems: Boolean,
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
      const slots = Array.from(
        /** @type {ShadowRoot} */ (this.shadowRoot).querySelectorAll('slot'),
      );
      return /** @type {HTMLSlotElement} */ (slots.find(s => !s.name));
    }

    /**
     * When used with FormRegistrarMixin, children will register themselves. Otherwise,
     * __listItems are gathered via a slotchange listener
     * @type {HTMLElement[]}
     */
    get listItems() {
      // @ts-ignore
      return this.__listItems || this.formElements;
    }

    /**
     * The roles to look for when children are registered to listItems
     * @overridable
     * @type {InteractiveListItemRole[]}
     */
    // eslint-disable-next-line class-methods-use-this
    get _childrenRoles() {
      // @ts-ignore - string type in array of InteractiveListItemRole
      return [...this._interactiveChildrenRoles, 'listitem', 'group'];
    }

    // eslint-disable-next-line class-methods-use-this
    get _interactiveChildrenRoles() {
      return ['menuitem', 'menuitemcheckbox', 'menuitemradio', 'option', 'treeitem'];
    }

    get activeIndex() {
      return this.listItems.findIndex(el => isActive(el));
    }

    set activeIndex(index) {
      const activeItem = this.listItems[index];

      if (!activeItem) return;

      const prevActiveEl = this.activeItem;
      // This can be a focusable element or a wrapper thereof
      const el = this.listItems[index];

      // Unset siblings
      this.listItems.forEach(item => {
        setActive(item, true);
      });
      setActive(el);

      // Determine focusableEl and prevFocusableEl

      let focusableEl;
      let prevFocusableEl;

      if (this._activeMode === 'activedescendant') {
        focusableEl = el;
        prevFocusableEl = prevActiveEl;
      }
      // activeMode is 'roving-tabindex' or 'tabbable-disclosure'
      else {
        // are we a focusable element or a wrapper thereof?
        focusableEl = isFocusableElement(el) ? el : el.firstElementChild;
        prevFocusableEl =
          prevActiveEl &&
          (isFocusableElement(prevActiveEl) ? prevActiveEl : prevActiveEl.firstElementChild);
      }

      if (!focusableEl) return;

      // Update 'active mode'
      if (this._activeMode === 'activedescendant') {
        this._listNode.setAttribute('aria-activedescendant', focusableEl.id);
      } else if (
        this._activeMode === 'roving-tabindex' ||
        this._activeMode === 'tabbable-disclosure'
      ) {
        // @ts-ignore - Element extends HTMLElement for focus
        focusableEl.focus();
      }

      // @ts-ignore - focusableEl is safely used as HTMLElement here
      if (!isInView(this._scrollTargetNode, focusableEl)) {
        focusableEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      if (this._activeMode === 'roving-tabindex') {
        if (prevFocusableEl) {
          prevFocusableEl.setAttribute('tabindex', '-1');
        }
        focusableEl.setAttribute('tabindex', '0');
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
      if (!item) return;
      if (!this.multipleChoice) {
        // Uncheck all
        this.listItems.forEach(listItem => {
          setChecked(listItem, true);
        });
        setChecked(this.listItems[index]);
      } else {
        toggleChecked(this.listItems[index]);
      }
    }

    /**
     * Since we cannot check instanceof with mixins, use this getter instead.
     * This way, the outside world can confirm the type of an element
     */
    // eslint-disable-next-line class-methods-use-this
    get isInteractiveList() {
      return true;
    }

    constructor() {
      super();

      // TODO: copy descriptions from ListboxMixin and ChoiceGroupMixin to here
      this.orientation = 'vertical';
      this.multipleChoice = false;
      this.selectionFollowsFocus = false;
      this.rotateKeyboardNavigation = false;

      /**
       * By default, checkedIndex is set to 0. When noPreselect is true,
       * checkedIndex will not be set
       * @type {boolean}
       */
      this.noPreselect = false;

      /**
       * Whenever possible (for [role="listbox|menu"], usually with one level) we use an
       * [active descendant](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_focus_activedescendant).
       * For [role=toolbar], we use a [roving tabindex](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex)
       * Other examples:
       * - [role="menubar"](https://www.w3.org/TR/wai-aria-practices-1.1/examples/menubar/menubar-1/menubar-1.html)
       * - [role="tree"](https://www.w3.org/TR/wai-aria-practices-1.1/examples/treeview/treeview-1/treeview-1b.html)
       * For disclosure menus, we need keyboard navigation, but treat every list item
       * (more precisely its anchor child) as a tab stop.
       * @type {'activedescendant'|'roving-tabindex'|'tabbable-disclosure'|'none'}
       */
      this._activeMode = 'activedescendant';

      /**
       * When children are 'smart' (like LionOption), checked and active states will be set
       * to them and they are responsible for setting [aria-selected].
       * When false, `get listItems()` needs to be configured to point to the list items.
       * @type {boolean}
       */
      this._hasSmartChildren = false;

      /**
       * The role that will be put on _listNode
       * @type {'menu'|'menubar'|'listbox'|'tree'|'toolbar'}
       */
      this._listRole = 'menu';

      /**
       * @type {HTMLElement[]}
       */
      this.__listItems = [];

      /**
       * By default, a typed character (or a sequence thereof) will be matched against
       * the values of list items. The first and closest match, becomes active
       * (focused or activedescendant depending on _matchMode)
       * @type {boolean}
       */
      this._activateOnTypedChars = false;

      /**
       * The pending char sequence that will set active list item
       * @type {number}
       */
      this._activateOnCharTimeout = 2000;

      /**
       * @type {string[]}
       */
      this.__typedChars = [];

      this._onListClick = this._onListClick.bind(this);
      this._onListKeyUp = this._onListKeyUp.bind(this);
      this._onListKeyDown = this._onListKeyDown.bind(this);
      this._onListFocusIn = this._onListFocusIn.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      window.addEventListener('popstate', this._onPopState);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      window.removeEventListener('popstate', this._onPopState);
    }

    /**
     * @param {import('lit').PropertyValues } changedProperties
     */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this._setupList();
    }

    /**
     * @param {Node[]} nodes
     */
    #identifyNewItemsAndInitListItems(nodes) {
      /**
       *
       * @param {HTMLElement} node
       * @param {{ newItems: HTMLElement[], level?: number }} opts
       * @returns
       */
      const handleInteractiveListAdditionLevel = (node, { newItems, level = 1 }) => {
        // Move list item to element with aria-activedescendant ([role="listbox|menu|menubar"])
        if (level === 1) {
          this._listNode.appendChild(node);
          if (this._hasSmartChildren || !(node instanceof Element)) {
            return;
          }
        }
        /**
         * When [role=group], we can have a grouped set within a level, like multiple
         * menuitemradios or -checkboxes.
         * When no role at all, we might deal with a wrapped node (for instance triggering a
         * submenu)
         * Alternatively, when _activeMode is ['tabbable-disclosure'](https://www.w3.org/TR/wai-aria-practices-1.1/examples/disclosure/disclosure-navigation.html),
         * we search for a[href]
         */
        if (node.getAttribute('role') === 'group') {
          // @ts-ignore - HTMLCollection is iterable
          for (const child of node.children) {
            // @ts-ignore
            handleInteractiveListAdditionLevel(child, { newItems, level: level + 1 });
          }
          return;
        }
        // Also support scenarios like these: https://adrianroselli.com/2019/06/link-disclosure-widget-navigation.html
        // TODO: For now, we only allow direct children. Should we consider deeper nesting?
        const focusableChildren = Array.from(node.children).filter(c => isFocusableElement(c));
        if (focusableChildren.length) {
          for (const focusableChild of focusableChildren) {
            // @ts-ignore - focusableChild is HTMLElement
            newItems.push(focusableChild);
          }
        } else {
          // Then we must be focusable (either via activedescendant, tabindex)
          newItems.push(node);
        }
      };

      /** @type {HTMLElement[]} */
      const newItems = [];

      // Move items to _listNode and add interactive node references (with [role]) to listItems
      nodes.forEach(node => {
        // @ts-expect-error - node type compatibility
        handleInteractiveListAdditionLevel(node, { newItems });
      });

      // @ts-expect-error
      if (this.itemWrap && nodes.length) {
        // @ts-expect-error
        this._initMoreButtonMenu();
      }

      newItems.forEach(item => {
        if (!this.__listItems.includes(item)) {
          this.__listItems.push(item);
        }
      });

      this._initListItems(newItems);
    }

    _setupList() {
      // /**
      //  * @param {HTMLElement} node
      //  */
      // const shouldAddItem = node => {
      //   const role = /** @type {InteractiveListItemRole|'group'} */ (node.getAttribute('role'));
      //   return (
      //     (role && this._interactiveChildrenRoles.includes(role)) || node.hasAttribute('data-item')
      //   );
      // };

      this._listItemsSlot.addEventListener('slotchange', () => {
        // N.B. we do not use `this._listItemsSlot.assignedNodes()`, as it omits comment nodes.
        // Comment nodes are really important for lit-html)
        const nodes = Array.from(
          (this._listItemsSlot.assignedSlot || this).childNodes || [],
          // @ts-expect-error
        ).filter(n => !n.slot);
        this.#identifyNewItemsAndInitListItems(nodes);
      });

      this._listNode.setAttribute('role', this._listRole);
      this._listNode.setAttribute(
        'tabindex',
        this._activeMode === 'tabbable-disclosure' ? '-1' : '0',
      );
      this._listNode.addEventListener('click', this._onListClick);
      this._listNode.addEventListener('keyup', this._onListKeyUp);
      this._listNode.addEventListener('keydown', this._onListKeyDown);
      this._listNode.addEventListener('focusin', this._onListFocusIn);

      // TODO: add "more menu" functionality here... when itemWrap is set. We only support "more-menu" (for now):
      // 1. we can measure the width (if orientation is horizontal) of this._listNode
      // and see how its children fit, moving them to an overlayController
      // having hideVisually as hide mechanism (opening on focus, closing on blur).
      // N.B. this._listNode has `display:flex`. This means we need to add `text-wrap: nowrap;`
      // to avoid elems going over two lines, or give them a max-height based on measuring the height of one item.
      // 2. N.B. hideVisually needs to be implementd in OverlayController.
      // 3. when the more menu opens a next level, MultiLevelListMixin will be applied to the host as well.
      // That means it knows when a child menu is open. If _subListMap of one of the items is open, we should hide more menu like this:
      // https://jsfiddle.net/a4ocktfp/19/
    }

    /**
     * When _listItemsSlot receives new items, they are initialized via this method
     * @param {LionItem[]|HTMLElement[]} newItems the newly added items needing initialization
     */
    _initListItems(newItems) {
      if (this._activeMode === 'roving-tabindex') {
        // Make item focusable, but not part of tab sequence
        newItems.forEach(item => item.setAttribute?.('tabindex', '-1'));
      } else if (this._activeMode === 'activedescendant') {
        newItems.forEach(item => {
          // eslint-disable-next-line no-param-reassign
          item.id = item.id || `${this.localName}-item-${uuid()}`;
        });
      } // for 'tabbable-disclosure', we assume items are already focusable and part of tab sequence

      if (!this.noPreselect && this.checkedIndex === -1) {
        this.checkedIndex = 0;
      }
      newItems.forEach(item => {
        if (!item.hasAttribute('checked')) {
          setChecked(item, true);
        } else {
          setChecked(item);
        }
      });

      this.__syncCurrentPageWithLocationHref(window.location);
    }

    /**
     * Handles various keyboard controls
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
          if (this.orientation === 'vertical' || this._activeMode === 'tabbable-disclosure') {
            this.activeIndex = this._getPreviousEnabledOption(this.activeIndex);
          }
          break;
        case 'ArrowLeft':
          if (this.orientation === 'horizontal' || this._activeMode === 'tabbable-disclosure') {
            this.activeIndex = this._getPreviousEnabledOption(this.activeIndex);
          }
          break;
        case 'ArrowDown':
          ev.preventDefault();
          if (this.orientation === 'vertical' || this._activeMode === 'tabbable-disclosure') {
            this.activeIndex = this._getNextEnabledOption(this.activeIndex);
          }
          break;
        case 'ArrowRight':
          if (this.orientation === 'horizontal' || this._activeMode === 'tabbable-disclosure') {
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
        const matchItem = this.listItems.find(item =>
          this._matchCharsAgainstItem({ chars: [chars], item }),
        );
        // @ts-ignore - matchItem might be undefined
        this.activeIndex = this.listItems.indexOf(matchItem);

        // @ts-ignore - __clearCharTimeout can be a function
        if (typeof this.__clearCharTimeout === 'function') {
          // @ts-ignore
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
     * @param {FocusEvent} ev
     */
    _onListFocusIn(ev) {
      /** @type {HTMLElement} */
      // @ts-ignore - target is EventTarget
      const { target } = ev;
      // const item = /** @type {HTMLElement} */ (target.closest('[role]'));
      // @ts-ignore - target is HTMLElement
      const foundIndex = this.listItems.indexOf(target);
      if (foundIndex > -1 && foundIndex !== this.activeIndex) {
        this.activeIndex = foundIndex;
      }
    }

    /**
     * @overridable
     * @param {MouseEvent} ev
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    _onListClick(ev) {
      /** @type {HTMLElement} */
      // @ts-ignore - target is EventTarget
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

    /**
     * @param {Location} location
     */
    __syncCurrentPageWithLocationHref(location) {
      this.listItems.forEach(item => {
        if (/** @type {HTMLAnchorElement} */ (item).href) {
          if (location.href.includes(/** @type {HTMLAnchorElement} */ (item).href)) {
            setChecked(item);
          } else {
            setChecked(item, true);
          }
        }
      });
    }

    /** @protected */
    _onPopState = () => {
      this.__syncCurrentPageWithLocationHref(document.location);
    };
  };
// @ts-ignore
export const InteractiveListMixin = dedupeMixin(InteractiveListMixinImplementation);
