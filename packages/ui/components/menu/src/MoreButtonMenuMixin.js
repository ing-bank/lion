/**
 * @param {any} superclass
 */
/** @type {any} */
// @ts-ignore - JS mixin typing
export const MoreButtonMenuMixin = superclass =>
  class MoreButtonMenuMixinClass extends superclass {
    static get properties() {
      return {
        ...super.properties,
        itemsFit: { type: Boolean, state: true },
      };
    }

    constructor() {
      super();
      this.itemsFit = true;
      this.__resizeTimeout = null;
      this.__resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
    }

    connectedCallback() {
      super.connectedCallback();
      if (this.itemWrap) {
        // @ts-ignore - host is a custom element instance
        this.__resizeObserver?.observe(/** @type {Element} */ (this));
      }
    }

    disconnectedCallback() {
      this.__resizeObserver?.disconnect();
      if (this.__resizeTimeout) {
        clearTimeout(this.__resizeTimeout);
      }
      super.disconnectedCallback();
    }

    getMoreButton() {
      return this.querySelector('[data-more-button-menu]');
    }

    getMoreButtonMenu() {
      return this.querySelector('[data-more-button-menu]');
    }

    getMoreButtonMenuWrapper() {
      return this.querySelector('[data-more-button-wrapper]');
    }

    doItemsFit() {
      const listElement = this._listNode;
      return listElement.scrollWidth === listElement.clientWidth;
    }

    getFirstLevelListItems() {
      const listNode = this._listNode;
      return Array.from(listNode.querySelectorAll(':scope > [role="listitem"]'));
    }

    hideItemsUntilFit(listItems) {
      // First, make the more button wrapper visible
      this.getMoreButtonMenuWrapper().style.display = 'block';

      // Then check if items fit (including the more button)
      let i = listItems.length - 1;
      while (i >= 0) {
        const listItem = listItems[i];
        listItem.style.display = 'none';
        this.moveItemToMoreButtonMenu(listItem);

        if (this.doItemsFit()) {
          return;
        }

        i -= 1;
      }
    }

    moveItemToMoreButtonMenu(listItem) {
      const moreButtonMenuElement = this.getMoreButtonMenu();
      moreButtonMenuElement.appendChild(listItem.previousSibling.previousSibling);
      moreButtonMenuElement.appendChild(listItem.previousSibling);
      const { nextSibling } = listItem.nextSibling;
      const { nextSibling: nextAfterNextSibling } = listItem.nextSibling.nextSibling;
      moreButtonMenuElement.appendChild(listItem);
      moreButtonMenuElement.appendChild(nextSibling);
      moreButtonMenuElement.appendChild(nextAfterNextSibling);

      // Show the item again after moving
      listItem.style.display = '';
    }

    moveFirstItemFromMoreMenuToListMenu() {
      const moreButtonMenu = this.getMoreButtonMenu();
      const listItem = moreButtonMenu.querySelector(':scope > [role="listitem"]');

      const beforeNode = listItem.previousSibling;
      const beforeBeforeNode = beforeNode?.previousSibling;
      const afterNode = listItem.nextSibling;
      const afterAfterNode = afterNode?.nextSibling;
      const nodesToMove = [beforeBeforeNode, beforeNode, listItem, afterNode, afterAfterNode];

      nodesToMove.forEach(node => {
        moreButtonMenu.appendChild(node);
      });
    }

    handleResize = () => {
      if (this.__resizeTimeout) {
        clearTimeout(this.__resizeTimeout);
      }

      this.__resizeTimeout = setTimeout(() => {
        const listItems = this.getFirstLevelListItems();

        for (let i = 0; i < listItems.length; i += 1) {
          const listItem = listItems[i];
          listItem.style.display = '';
        }
        this.getMoreButtonMenuWrapper().style.display = 'none';

        if (this.doItemsFit()) {
          this.getMoreButtonMenuWrapper().style.display = 'block';
        } else {
          this.hideItemsUntilFit(listItems);
        }

        this.itemsFit = this.doItemsFit();
      }, 10);
    };
  };
