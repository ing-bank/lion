/**
 * @param {any} superclass
 */
/** @type {any} */

import { OverlayController, withDropdownConfig } from '../../../exports/overlays.js';

// @ts-ignore - JS mixin typing
export const MoreButtonMenuMixin = superclass =>
  class MoreButtonMenuMixinClass extends superclass {
    constructor() {
      super();
      this.__resizeTimeout = null;
      this.__hasWindowResizeListener = false;
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

      setTimeout(() => {
        this._setupMoreButtonMenuOverlay();
      }, 100);
    }

    _setupMoreButtonMenuOverlay() {
      const ctrl = new OverlayController({
        ...withDropdownConfig,
        placementMode: 'local',
        inheritsReferenceWidth: 'min',
        popperConfig: {
          placement: 'bottom-start',
          strategy: 'absolute',
          modifiers: [
            {
              name: 'offset',
              enabled: false,
            },
          ],
        },
        handlesAccessibility: true,
        invokerNode: this.getMoreButton(),
        contentNode: this.getMoreButtonMenu(),
        _noDialogEl: true,
      });
      ctrl.show();

      this.contextWrapper = this.getMoreButtonMenu().parentElement;
      const styles = window.getComputedStyle(this.contextWrapper);
      this.contextWrapperStyle = {};
      ({
        minWidth: this.contextWrapperStyle.minWidth,
        width: this.contextWrapperStyle.width,
        position: this.contextWrapperStyle.position,
        inset: this.contextWrapperStyle.inset,
        margin: this.contextWrapperStyle.margin,
        transform: this.contextWrapperStyle.transform,
      } = styles);

      this.moreButtonMenuCtrl = ctrl;
      this.isMoreButtonMenuPopperActive = true;
    }

    reApplyContextWrapperStyles() {
      if (!this.contextWrapper) {
        return;
      }
      const styles = this.contextWrapperStyle;
      Object.assign(this.contextWrapper.style, {
        minWidth: styles.minWidth,
        width: styles.width,
        position: styles.position,
        inset: styles.inset,
        margin: styles.margin,
        transform: styles.transform,
      });
    }

    _createMoreButtonWrapper() {
      const moreButtonWrapper = document.createElement('div');
      moreButtonWrapper.setAttribute('data-more-button-wrapper', '');
      [...this.getMoreButtonSlotProjection().childNodes].forEach(node =>
        moreButtonWrapper.appendChild(node),
      );
      moreButtonWrapper.querySelector('button')?.setAttribute('data-more-button', '');
      moreButtonWrapper.querySelector('button')?.setAttribute('tabindex', '-1');
      const moreButtonMenu = document.createElement('div');
      moreButtonMenu.setAttribute('data-more-button-menu', '');
      moreButtonMenu.setAttribute('role', 'none');
      moreButtonMenu.addEventListener('click', event => {
        console.log('click', event);
        console.log('this.moreButtonMenuCtrl', this.moreButtonMenuCtrl);
        // this.moreButtonMenuCtrl._popper.destroy();
        // this.reApplyContextWrapperStyles();
        // this.isMoreButtonMenuPopperActive = false;
      });

      moreButtonMenu.addEventListener('focusin', event => {
        if (!this.isMoreButtonMenuPopperActive) {
          this._setupMoreButtonMenuOverlay();
        }
        console.log('focusin', event.target);
        console.log('2', event.relatedTarget?.getRootNode()?.host?.closest('[level="2"]'));
        if (event.relatedTarget?.closest('[level="2"]')) {
          event.target.click();
        }
        console.log('focusin', event.target);
      });

      moreButtonWrapper.appendChild(moreButtonMenu);
      this._listNode.appendChild(moreButtonWrapper);

      this.handleResize();

      this._setupMoreButtonMenuOverlay();
      setTimeout(() => {
        this.moreButtonMenuCtrl._popper.destroy();
        this.reApplyContextWrapperStyles();
        this.isMoreButtonMenuPopperActive = false;
      }, 100);
    }

    addResizeObserver() {
      if (!this.itemWrap) {
        return;
      }

      this.__resizeTimeout = null;
      if (!this.__hasWindowResizeListener) {
        window.addEventListener('resize', this.handleResize);
        this.__hasWindowResizeListener = true;
      }
    }

    getMoreButtonSlotProjection() {
      return this.querySelector('[slot="more-button"]');
    }

    getMoreButton() {
      return this.querySelector('[data-more-button]');
    }

    removeResizeObserver() {
      if (this.__hasWindowResizeListener) {
        window.removeEventListener('resize', this.handleResize);
        this.__hasWindowResizeListener = false;
      }
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
