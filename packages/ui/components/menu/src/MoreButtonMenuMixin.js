/**
 * @param {any} superclass
 */
/** @type {any} */

const styles = `
  <style>
    /** More button is hidden by default */
    [data-more-button-wrapper] {
      display: none;
    }

    [data-more-button-menu]:has([role='listitem'] [active]:focus):not(
        :has([role='listitem'] [active][aria-expanded='true'])
      ) {
      overflow: visible;
      width: auto;
      height: auto;
      position: absolute;
      top: 100%;
      background-color: var(--oj2_bg_default);
    }
    [data-more-button-menu],
    [data-more-button-menu]:has([role='listitem'] [active][aria-expanded='true']) {
      overflow: hidden;
      width: 1px;
      height: 1px;
    }

    :host([responsive-mode='desktop']) [level='1'] > [slot='list'] > [role='listitem'] > button,
    :host([responsive-mode='desktop']) [level='1'] > [slot='list'] > [role='listitem'] > a,
    :host([responsive-mode='desktop'])
      [level='1']
      > [slot='list']
      > [data-more-button-wrapper]
      > [role='listitem']
      > button,
    :host([responsive-mode='desktop'])
      [level='1']
      > [slot='list']
      > [data-more-button-wrapper]
      > [role='listitem']
      > a {
      white-space: nowrap;
    }
    /**
    * TODO listitem rigth margin/gap is not taken at the account ATM
    */
    /**
     * More button relies on the fact that the menu items do not break the line
     * TODO is it optimal?
     */
    :host([responsive-mode='desktop']) > [role='list'] > [role='listitem'] > button,
    :host([responsive-mode='desktop']) > [role='list'] > [role='listitem'] > a {
      white-space: nowrap;
    }    
  </style>
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
      while (host && host.shadowRoot && host.shadowRoot.activeElement) {
        host = host.shadowRoot.activeElement;
      }
      return host;
    }

    _createMoreButtonWrapper() {
      const moreButtonWrapper = document.createElement('div');
      const style = document.createElement('style');
      style.textContent = styles;
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
      moreButtonMenu.setAttribute('role', 'none');
      this._listNode.appendChild(moreButtonWrapper);

      const isElementDirectFocusableItemUnderMoreButtonMenu = element => {
        const targetTagName = element?.tagName;
        return (
          element?.parentElement?.parentElement === moreButtonMenu &&
          (targetTagName === 'BUTTON' || targetTagName === 'A')
        );
      };

      moreButtonMenu.addEventListener('focusin', event => {
        const target = event?.target;
        if (isElementDirectFocusableItemUnderMoreButtonMenu(target)) {
          if (target?.getAttribute('aria-expanded') === 'true') {
            target?.click();
          }
          moreButton?.setAttribute('aria-expanded', 'true');
        }
      });

      moreButtonMenu.addEventListener('focusout', event => {
        const target = event?.target;
        if (isElementDirectFocusableItemUnderMoreButtonMenu(target)) {
          moreButton?.setAttribute('aria-expanded', 'false');
        }
      });

      this.hasMoreButtonMenuAnyFocusedFirstLevelItems = false;

      moreButton?.addEventListener('mousedown', () => {
        this.hasMoreButtonMenuAnyFocusedFirstLevelItems = false;
        const focusableFirstLevelItems = moreButtonMenu.querySelectorAll(
          ':scope > [role="listitem"] > a, :scope > [role="listitem"] > button',
        );

        [...focusableFirstLevelItems]?.forEach(focusableFirstLevelItem => {
          if (this._getDeepActiveElement() === focusableFirstLevelItem) {
            this.hasMoreButtonMenuAnyFocusedFirstLevelItems = true;
          }
        });
      });

      moreButton?.addEventListener('click', () => {
        if (!this.hasMoreButtonMenuAnyFocusedFirstLevelItems) {
          moreButtonMenu
            .querySelector(':scope > [role="listitem"] > a, :scope > [role="listitem"] > button')
            ?.focus();
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

    handleResize() {
      if (this.__resizeTimeout) {
        return;
      }

      this.__resizeTimeout = setTimeout(() => {
        this.__resizeTimeout = null;

        this.renderAllItemsInMainMenu();
        this.hideMoreButton();

        if (this.doItemsFit()) {
          return;
        }

        this.displayMoreButton();
        const hiddenItemsCount = this.hideItemsOneByOneInMainMenuUntilTheyFit();
        this.moveHiddenItemsFromMainMenuToMoreButtonMenu(hiddenItemsCount);
      }, 50);
    }
  };
