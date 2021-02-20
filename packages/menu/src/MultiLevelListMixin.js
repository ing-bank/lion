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
      return (
        this.invokerNode ||
        this.previousElementSibling?.hasAttribute('data-invoker') ||
        super._invokerNode
      );
    }

    /**
     * @configure DisclosureMixin
     */
    get _contentNode() {
      return this._listNode;
    }

    constructor() {
      super();

      this.handleFocus = true;
      /** @type {InteractiveList} */
      this.parentList = undefined;
      this.behaveAsAccordion = false;
      this.noPreselect = true;

      this._activeMode = 'roving-tabindex';

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

    _initListItems(newItems) {
      super._initListItems(newItems);

      function getSubList(item) {
        // Note that, according to w3c spec, the sub level element with [role=menu|menubar|tree] needs
        // to be a sibling of the invoker element with [role=menuitem|menuitemchecbox|menuitemradio|treeitem]
        const siblingOfInvoker =
          item.nextElementSibling && item.nextElementSibling.isInteractiveList;
        if (siblingOfInvoker) {
          return item.nextElementSibling;
        }
        const childOfInvoker =
          item.getAttribute('role') === 'listitem' || item.hasAttribute('data-item');
        if (childOfInvoker) {
          return Array.from(item.children).find(child => child.isInteractiveList);
        }
        return undefined;
      }

      newItems.forEach(item => {
        const subList = getSubList(item);
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
