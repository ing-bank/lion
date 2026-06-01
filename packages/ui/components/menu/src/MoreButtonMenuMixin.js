// eslint-disable-next-line import/no-extraneous-dependencies
import { css } from 'lit';

const styles = css`
  /** More button is hidden by default */
  [data-more-button-wrapper] {
    display: none;
  }

  [data-more-button-menu][data-open]:not(:has([role='listitem'] [aria-expanded='true'])) {
    position: absolute;
    overflow: visible;
    height: auto;
    width: auto;
    top: 100%;
  }

  [data-more-button-menu] {
    overflow: hidden;
    height: 1px;
    width: 1px;
  }

  [role='list']:has(> [data-more-button-wrapper]) > [role='listitem'] > :is(button, a) {
    white-space: nowrap;
  }
`;

// @ts-ignore - JS mixin typing
export const MoreButtonMenuMixin = superclass =>
  class MoreButtonMenuMixinClass extends superclass {
    constructor() {
      super();
      this.__resizeTimeout = null;
      this.isMoreButtonShown = null;
      this.handleResize = this.handleResize.bind(this);
    }

    disconnectedCallback() {
      window.removeEventListener('resize', this.handleResize);
      if (this.__resizeTimeout) {
        clearTimeout(this.__resizeTimeout);
      }
      super.disconnectedCallback?.();
    }

    _initMoreButtonMenu() {
      this._createMoreButtonWrapper();
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    }

    // eslint-disable-next-line class-methods-use-this
    _getDeepActiveElement() {
      let host = document.activeElement || document.body;
      while (host?.shadowRoot?.activeElement) {
        host = host.shadowRoot.activeElement;
      }
      return host;
    }

    _createMoreButtonWrapper() {
      const moreButtonWrapper = document.createElement('div');
      const style = document.createElement('style');
      style.textContent = styles.cssText;
      moreButtonWrapper.appendChild(style);
      moreButtonWrapper.setAttribute('data-more-button-wrapper', '');
      [...this.getMoreButtonSlotProjection().childNodes].forEach(node =>
        moreButtonWrapper.appendChild(node),
      );
      const moreButton = moreButtonWrapper.querySelector('button');
      moreButton?.setAttribute('data-more-button', '');
      moreButton?.setAttribute('tabindex', '-1');
      moreButton?.setAttribute('aria-expanded', 'false');
      const moreButtonMenu = document.createElement('div');
      moreButtonMenu.setAttribute('data-more-button-menu', '');
      moreButtonWrapper.appendChild(moreButtonMenu);
      this._listNode.appendChild(moreButtonWrapper);

      const isElementDirectFocusableItemUnderMoreButtonMenu = (/** @type {Element} */ element) =>
        this.listItems.includes(element) && moreButtonMenu.contains(element);

      moreButtonMenu.addEventListener(
        'focusin',
        /** @type {FocusEvent} */ event => {
          const target = /** @type {HTMLElement} */ (event?.target);
          if (!isElementDirectFocusableItemUnderMoreButtonMenu(target)) return;

          // A user did `Shift + Tab` from L2 menu to More menu
          if (target?.getAttribute('aria-expanded') === 'true') {
            // close L2 menu
            target?.click();
          }
          moreButton?.setAttribute('aria-expanded', 'true');
          moreButtonMenu.setAttribute('data-open', '');
        },
      );

      moreButtonMenu.addEventListener('focusout', () => {
        // We need this timeout for Safari/WebKit.
        // Unfortunately, an in progress click gets canceled when overflow:hidden is applied.
        // Although mousedown would work instead, the consuming developer should have the freedom to apply all possible interaction pattterns.
        // Especially, we should be compatible with 'withClickInteraction'
        setTimeout(() => {
          if (isElementDirectFocusableItemUnderMoreButtonMenu(this._getDeepActiveElement())) return;
          moreButton?.setAttribute('aria-expanded', 'false');

          moreButtonMenu.removeAttribute('data-open');
        }, 100);
      });

      this.hasMoreButtonMenuAnyFocusedFirstLevelItems = false;

      moreButton?.addEventListener('mousedown', () => {
        this.hasMoreButtonMenuAnyFocusedFirstLevelItems = false;
        const focusableFirstLevelItems = moreButtonMenu.querySelectorAll(
          ':scope > [role="listitem"] > :is(a, button)',
        );

        [...focusableFirstLevelItems]?.forEach(focusableFirstLevelItem => {
          if (this._getDeepActiveElement() === focusableFirstLevelItem) {
            this.hasMoreButtonMenuAnyFocusedFirstLevelItems = true;
          }
        });
      });

      moreButton?.addEventListener('click', () => {
        if (!this.hasMoreButtonMenuAnyFocusedFirstLevelItems) {
          moreButtonMenu.querySelector(':scope > [role="listitem"] > :is(a, button)')?.focus();
          moreButtonMenu.setAttribute('data-open', '');
        }
      });
    }

    getMoreButtonSlotProjection() {
      return this.querySelector('[slot="more-button"]');
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
      this.style.display = 'none';
      const parentWidth = this.parentElement.clientWidth;
      this.style.display = '';
      return (
        this._listNode.scrollWidth === this._listNode.clientWidth &&
        this._listNode.scrollWidth <= parentWidth
      );
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
      while (nextSibling) {
        nextNodes.push(nextSibling);

        if (isMarkerComment(nextSibling)) {
          break;
        }

        ({ nextSibling } = nextSibling);
      }

      const fragment = document.createDocumentFragment();
      const nodes = [...previousNodes, listItem, ...nextNodes];
      nodes.forEach(node => fragment.appendChild(node));
      return fragment;
    };

    /**
     * @param {{ moreButtonMenuElement: HTMLButtonElement, listItem: HTMLElement }} opts
     */
    moveItemToMoreButtonMenuFromMainMenu({ moreButtonMenuElement, listItem }) {
      const fragment = this.getListItemWithAdjacentNodes(listItem);
      moreButtonMenuElement.prepend(fragment);
      // eslint-disable-next-line no-param-reassign
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

    /**
     * @param {number} hiddenItemsCount
     */
    moveHiddenItemsFromMainMenuToMoreButtonMenu(hiddenItemsCount) {
      const moreButtonMenuElement = this.getMoreButtonMenu();
      const listItems = this._listNode.querySelectorAll(':scope > [role="listitem"]');
      for (let i = 0; i < hiddenItemsCount; i += 1) {
        const listItem = listItems[listItems.length - 1 - i];
        this.moveItemToMoreButtonMenuFromMainMenu({ moreButtonMenuElement, listItem });
      }
    }

    handleResize() {
      if (this.__resizeTimeout) {
        return;
      }

      this.style.visibility = 'hidden';

      this.__resizeTimeout = setTimeout(() => {
        this.__resizeTimeout = null;

        this.renderAllItemsInMainMenu();
        this.hideMoreButton();

        if (this.doItemsFit()) {
          this.style.visibility = '';
          return;
        }

        this.style.visibility = 'hidden';
        this.displayMoreButton();
        const hiddenItemsCount = this.hideItemsOneByOneInMainMenuUntilTheyFit();
        this.moveHiddenItemsFromMainMenuToMoreButtonMenu(hiddenItemsCount);
        this.style.visibility = '';
      }, 50);
    }
  };
