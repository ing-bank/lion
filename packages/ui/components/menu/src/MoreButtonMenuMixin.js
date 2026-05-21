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
      this.hasResizeObserver = false;
      this.__resizeObserver = new ResizeObserver(() => {
        this.handleResize();
      });
      /** @type {boolean|null} */
      this.isMoreButtonShown = null;
    }

    disconnectedCallback() {
      this.removeResizeObserver();
      if (this.__resizeTimeout) {
        clearTimeout(this.__resizeTimeout);
      }
      super.disconnectedCallback();
    }

    _initMoreButtonMenu() {
      this.init = false;
      this.addResizeObserver();
    }

    _createMoreButtonWrapper() {
      const moreButtonWrapper = document.createElement('div');
      moreButtonWrapper.setAttribute('data-more-button-wrapper', '');
      [...this.getMoreButtonSlotProjection().childNodes].forEach(node =>
        moreButtonWrapper.appendChild(node),
      );
      moreButtonWrapper.querySelector('button')?.setAttribute('data-more-button', '');
      const moreButtonMenu = document.createElement('div');
      moreButtonMenu.setAttribute('data-more-button-menu', '');
      moreButtonWrapper.appendChild(moreButtonMenu);
      this._listNode.appendChild(moreButtonWrapper);
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

    getMoreButtonSlotProjection() {
      return this.querySelector('[slot="more-button"]');
    }

    getMoreButton() {
      return this.querySelector('[data-more-button]');
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
    getListItemWithAdjacentNodes = listItem => {
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

      const fragment = this.getListItemWithAdjacentNodes(listItem);
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

    renderAllItemsInMainMenu() {
      this.moveAllItemsToMainMenuFromMoreButtonMenu();
    }

    hideItemsOneByOneInMainMenuUntilTheyFit() {
      let hiddenItemsCount = 0;
      const mainMenuItems = this.getListItems();
      for (let i = mainMenuItems.length - 1; i >= 0 && !this.doItemsFit(); i -= 1) {
        mainMenuItems[i].style.display = 'none';
        hiddenItemsCount += 1;
      }
      return hiddenItemsCount;
    }

    moveHiddenItemsFromMainMenuToMoreButtonMenu(hiddenItemsCount) {
      for (let i = 0; i < hiddenItemsCount; i += 1) {
        this.moveItemToMoreButtonMenuFromMainMenu();
      }
    }

    handleResize = () => {
      if (!this.hasResizeObserver && this.init) {
        this.hasResizeObserver = true; // Skip the first automatic trigger
        return;
      }

      this.init = true;

      if (this.__resizeTimeout) {
        return;
      }

      this.__resizeTimeout = setTimeout(() => {
        // stop listening to resize while we make changes to avoid multiple triggers
        this.removeResizeObserver();

        this.renderAllItemsInMainMenu();
        this.hideMoreButton();

        if (this.doItemsFit()) {
          this.addResizeObserver();
          return;
        }

        this.displayMoreButton();
        const hiddenItemsCount = this.hideItemsOneByOneInMainMenuUntilTheyFit();
        this.moveHiddenItemsFromMainMenuToMoreButtonMenu(hiddenItemsCount);

        // after all changes start listening to resize event again
        this.addResizeObserver();
      }, 50);
    };
  };
