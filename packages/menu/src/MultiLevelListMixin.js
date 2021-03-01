import { html, dedupeMixin } from '@lion/core';
import { DisclosureMixin } from '@lion/collapsible';
import { InteractiveListMixin } from './InteractiveListMixin.js';

/**
 * All logic that is needed for interactive lists that are allowed to have multiple nested, collapsible levels
 * Applies to [role=menu] and [role=tree]
 */
const MultiLevelListMixinImplementation = superclass =>
  class extends DisclosureMixin(InteractiveListMixin(superclass)) {
    render() {
      return html`
        <slot name="invoker"></slot>
        <slot name="list"></slot>
        <slot id="list-items-outlet"></slot>
      `;
    }

    static get properties() {
      return {
        invokerNode: Object,
        behaveAsAccordion: { type: Boolean, attribute: 'behave-as-accordion' },
        level: { type: Number, reflect: true },
      };
    }

    /**
     * @configure DisclosureMixin
     */
    get _invokerNode() {
      return this.invokerNode || super._invokerNode;
    }

    /**
     * @configure DisclosureMixin
     * This will be compatible with DisclosureMixin and OverlayMixin. It contains the invoked
     * InteractiveList widget (like menu|tree).
     */
    get _contentNode() {
      return this._listNode;
    }

    constructor() {
      super();

      /**
       * When an invokerNode is supplied (usually by a parent level menu), it will take precedence
       * over [slot=invoker] and previousElementSibling with [data-invoker] attribute
       * @type {HTMLElement}
       */
      this.invokerNode = undefined;
      /**
       * @configure DisclosureMixin
       */
      this.handleFocus = true;
      /**
       * The parent list if level > 1
       * @type {InteractiveList}
       */
      this.parentList = undefined;
      /**
       * When true, will have a maximum of one submenu open at a time
       */
      this.behaveAsAccordion = false;
      /**
       * The level of nested menus. Will be reflected as attribute for styling purposes
       */
      this.level = 0;
      /**
       * @configure InteractiveListMixin
       */
      this.noPreselect = true;
      /**
       * @configure InteractiveListMixin
       */
      this._activeMode = 'roving-tabindex';
      /**
       * @type {Map<HTMLElement|LionItem,InteractiveList>}
       */
      this._subListMap = new Map();
    }

    /**
     * @param {import('lit-element').PropertyValues } changedProperties
     */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (changedProperties.has('invokerNode')) {
        this._setupDisclosure();
        this._onOpenedChanged();
      }
    }

    /**
     * Gets the child InteractiveList, based on item
     * @param {LionItem|HTMLElement} item can be sibling of or parent of InteractiveList
     */
    static _getSubInteractiveList(item) {
      /**
       * Note that, according to W3C spec, the sub level element with [role=menu|menubar|tree]
       * needs to be a sibling of the invoker element with
       * [role=menuitem|menuitemchecbox|menuitemradio|treeitem] (and not the parent)
       *
       * In the example below <lion-menu> is considered as item
       * @example
       * <lion-menuitem>
       *   <button slot="invoker"></button>
       *   <lion-menu> ... </lion-menu>
       * </lion-menuitem>
       */
      const siblingOfInvoker = item.nextElementSibling && item.nextElementSibling.isInteractiveList;
      if (siblingOfInvoker) {
        return item.nextElementSibling;
      }
      /**
       * In the example below div[role=listitem] | [data-item] is considered as item
       * @example
       * <div role="listitem" data-item>
       *   <button slot="invoker"></button>
       *   <lion-menu> ... </lion-menu>
       * </div>
       */
      const childOfInvoker =
        item.getAttribute('role') === 'listitem' || item.hasAttribute('data-item');
      if (childOfInvoker) {
        return Array.from(item.children).find(child => child.isInteractiveList);
      }
      return undefined;
    }

    _initListItems(newItems) {
      super._initListItems(newItems);

      const ctor = this.constructor;
      newItems.forEach(item => {
        const subList = ctor._getSubInteractiveList(item);
        if (subList) {
          this._subListMap.set(item, subList);
          subList.level = this.level + 1;
          subList.parentList = this;
          subList.invokerNode = item;
          subList.invokerInteraction = this.invokerInteraction;
          subList._activeMode = this._activeMode;
        }
      });
    }

    /**
     * @enhance DisclosureMixin
     * @param {Event} [ev]
     */
    toggle(ev) {
      if (ev && this._listNode.contains(ev.target)) {
        // prevent nested menus (inside invokers) from triggering invoker
        return;
      }
      super.toggle();
    }

    /**
     * @enhance InteractiveListMixin
     */
    _onListKeyDown(ev) {
      const targetFromsubList = Array.from(this._subListMap).find(
        ([, s]) => s === ev.target || s.contains(ev.target),
      );

      if (targetFromsubList) {
        return;
      }

      super._onListKeyDown(ev);

      const subListOfActiveItem = this._subListMap.get(this.activeItem);
      const parentListOfActiveItem = this.parentList;
      const { key } = ev;

      switch (key) {
        case 'Enter':
        case ' ':
          // make it work like a button
          this.activeItem.click();
          break;
        case 'ArrowDown':
          if (this.orientation === 'horizontal' && subListOfActiveItem) {
            this.activeItem.click();
          }
          break;
        case 'ArrowRight':
          if (this.orientation === 'vertical' && subListOfActiveItem) {
            this.activeItem.click();
          }
          break;
        case 'ArrowUp':
          if (this.orientation === 'horizontal' && parentListOfActiveItem) {
            this.close();
            parentListOfActiveItem._onOverlayShow();
          }
          break;
        case 'ArrowLeft':
          if (this.orientation === 'vertical' && parentListOfActiveItem) {
            this.close();
            parentListOfActiveItem._onOverlayShow();
          }
          break;
        /* no default */
      }
    }

    /**
     * @enhance DisclosureMixin
     */
    _setupDisclosure() {
      if (this._invokerNode) {
        super._setupDisclosure();
      }
    }

    /**
     * @enhance DisclosureMixin
     */
    _teardownDisclosure() {
      if (this._invokerNode) {
        super._teardownDisclosure();
      }
    }

    /**
     * @enhance DisclosureMixin
     */
    async _onOpenedChanged() {
      if (this._invokerNode) {
        await super._onOpenedChanged();
      }
    }
  };
export const MultiLevelListMixin = dedupeMixin(MultiLevelListMixinImplementation);
