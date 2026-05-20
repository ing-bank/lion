/**
 * @param {any} superclass
 */
/** @type {any} */
// @ts-ignore - JS mixin typing
export const MoreButtonMenuMixin = superclass =>
  class MoreButtonMenuMixinClass extends superclass {
    constructor() {
      super();
      this.__resizeTimeout = null;
      this.init = false;
      this.hasResizeObserver = false;
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

      this.hasResizeObserver = false;
      this.__resizeTimeout = null;

      // @ts-ignore - host is a custom element instance
      this.__resizeObserver?.observe(/** @type {Element} */ (this));
    }

    removeResizeObserver() {
      this.__resizeObserver?.disconnect();
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

    /**
     * @param {Node} listItem
     */
    getListItemsWithAdjacentNodesFragment = listItem => {
      const markerNodeType = this.nodeType && Node.COMMENT_NODE;
      /** @param {Node | null | undefined} node */
      const isMarkerComment = node => node?.nodeType === markerNodeType && node?.nodeValue === '';

      const previousNodes = [];
      let { previousSibling } = listItem;
      while (previousSibling) {
        previousNodes.unshift(previousSibling);
        if (isMarkerComment(previousSibling)) {
          break;
        }
        ({ previousSibling } = previousSibling);
      }

      const nextNodes = [];
      let { nextSibling } = listItem;
      let includeOneMoreAfterComment = false;
      while (nextSibling) {
        nextNodes.push(nextSibling);

        if (includeOneMoreAfterComment) {
          break;
        }

        if (isMarkerComment(nextSibling)) {
          includeOneMoreAfterComment = true;
        }

        ({ nextSibling } = nextSibling);
      }

      const fragment = document.createDocumentFragment();
      const nodes = [...previousNodes, listItem, ...nextNodes];
      nodes.forEach(node => fragment.appendChild(node));
      return fragment;
    };

    moveItemToMoreButtonMenuFromMainMenu() {
      const moreButtonMenuElement = this.getMoreButtonMenu();
      const listItems = this._listNode.querySelectorAll(':scope > [role="listitem"]');
      const listItem = listItems[listItems.length - 1];

      const fragment = this.getListItemsWithAdjacentNodesFragment(listItem);
      moreButtonMenuElement.prepend(fragment);
      listItem.style.display = '';
      this.displayMoreButton();
    }

    moveAllItemsToMainMenuFromMoreButtonMenu() {
      const moreButtonMenu = this.getMoreButtonMenu();
      const moreButtonMenuWrapper = this.getMoreButtonMenuWrapper();
      if (moreButtonMenu.childNodes.length === 0) {
        return;
      }
      [...moreButtonMenu.childNodes].forEach(node => {
        moreButtonMenuWrapper.before(node);
      });
    }

    handleResize = () => {
      if (!this.hasResizeObserver && this.init) {
        this.hasResizeObserver = true; // Skip the first automatic trigger
        return;
      }

      if (this.__resizeTimeout) {
        return;
      }

      this.__resizeTimeout = setTimeout(() => {
        this.removeResizeObserver();
        this.hideMoreButton();
        this.moveAllItemsToMainMenuFromMoreButtonMenu();

        // 1) Check if items fit
        // If items fit, don't do nothing (return)
        if (this.doItemsFit()) {
          this.addResizeObserver();
          this.__resizeTimeout = null;
          return;
        }

        // 2) Items don't fit, show more button
        this.displayMoreButton();

        // 3) Hide items 1 by 1 from end until they fit
        let hiddenItemsCount = 0;
        const mainMenuItems = this.getListItems();
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
