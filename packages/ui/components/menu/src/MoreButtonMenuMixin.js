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
      };
    }

    constructor() {
      super();
      this.__resizeTimeout = null;
      this.__resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      /** @type {boolean|null} */
      this.isMoreButtonShown = null;
    }

    connectedCallback() {
      super.connectedCallback();
      this.addResizeObserver();
    }

    disconnectedCallback() {
      this.removeResizeObserver();
      if (this.__resizeTimeout) {
        clearTimeout(this.__resizeTimeout);
      }
      super.disconnectedCallback();
    }

    addResizeObserver() {
      if (!this.itemWrap) {
        return;
      }

      // @ts-ignore - host is a custom element instance
      this.__resizeObserver?.observe(/** @type {Element} */ (this));
    }

    removeResizeObserver() {
      this.__resizeObserver?.disconnect();
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

    displayMoreButton() {
      this.getMoreButtonMenuWrapper().style.display = 'block';
      this.isMoreButtonShown = true;
    }

    hideMoreButton() {
      this.getMoreButtonMenuWrapper().style.display = 'none';
      this.isMoreButtonShown = false;
    }

    doItemsFit() {
      return this._listNode.scrollWidth - this._listNode.clientWidth === 0;
    }

    getListItems() {
      const listNode = this._listNode;
      return Array.from(listNode.querySelectorAll(':scope > [role="listitem"]'));
    }

    moveItemToMoreButtonMenuFromMainMenu() {
      const moreButtonMenuElement = this.getMoreButtonMenu();
      const listItems = this._listNode.querySelectorAll(':scope > [role="listitem"]');
      const listItem = listItems[listItems.length - 1];

      moreButtonMenuElement.appendChild(listItem.previousSibling.previousSibling);
      moreButtonMenuElement.appendChild(listItem.previousSibling);
      const { nextSibling } = listItem.nextSibling;
      const { nextSibling: nextAfterNextSibling } = listItem.nextSibling.nextSibling;
      moreButtonMenuElement.appendChild(listItem);
      moreButtonMenuElement.appendChild(nextSibling);
      moreButtonMenuElement.appendChild(nextAfterNextSibling);
      listItem.style.display = '';
      this.displayMoreButton();
    }

    moveItemToMainMenuFromMoreButtonMenu() {
      const moreButtonMenu = this.getMoreButtonMenu();
      const listItem = moreButtonMenu.querySelector(':scope > [role="listitem"]');

      if (!listItem) {
        return false;
      }

      const beforeNode = listItem.previousSibling;
      const beforeBeforeNode = beforeNode?.previousSibling;
      const afterNode = listItem.nextSibling;
      const afterAfterNode = afterNode?.nextSibling;
      const nodesToMove = [beforeBeforeNode, beforeNode, listItem, afterNode, afterAfterNode];

      nodesToMove.forEach(node => {
        this._listNode.appendChild(node);
      });

      return true;
    }

    moveAllItemsToMainMenuFromMoreButtonMenu() {
      while (this.moveItemToMainMenuFromMoreButtonMenu()) {
        // Keep moving items back until the more-button menu is empty.
      }
    }

    handleResize = () => {
      if (this.__resizeTimeout) {
        clearTimeout(this.__resizeTimeout);
      }

      this.__resizeTimeout = setTimeout(() => {
        this.removeResizeObserver();
        this.hideMoreButton();
        this.moveAllItemsToMainMenuFromMoreButtonMenu();

        // Make all items visible on main menu
        const mainMenuItems = this.getListItems();
        for (const mainMenuItem of mainMenuItems) {
          mainMenuItem.style.display = '';
        }

        // 1) Check if items fit
        // If items fit, don't do nothing (return)
        if (this.doItemsFit()) {
          return;
        }

        // 2) Items don't fit, show more button
        this.displayMoreButton();

        // 3) Hide items 1 by 1 from end until they fit
        let hiddenItemsCount = 0;
        for (let i = mainMenuItems.length - 1; i >= 0 && !this.doItemsFit(); i -= 1) {
          mainMenuItems[i].style.display = 'none';
          hiddenItemsCount += 1;
        }

        // 4) Move hidden items to more menu
        for (let i = 0; i < hiddenItemsCount; i += 1) {
          this.moveItemToMoreButtonMenuFromMainMenu();
        }

        // 5) after all changes start listening to resize again
        this.addResizeObserver();
      }, 50);
    };
  };
