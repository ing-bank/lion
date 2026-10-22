// eslint-disable-next-line import/no-extraneous-dependencies
import { css } from 'lit';

/**
 * @typedef {import('../types/MoreButtonMenuMixinTypes.js').MoreButtonMenuMixin} MoreButtonMenuMixinType
 * @typedef {import('../types/MoreButtonMenuMixinTypes.js').MoreButtonMenuHost} MoreButtonMenuHostType
 */

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

  /** N.B. this is a simplified version of sr-only. when we move to overlayctrl, we should build this into overlayctrl */
  [data-more-button-menu] {
    overflow: hidden;
    height: 0;
    width: 0;
  }

  [role='list']:has(> [data-more-button-wrapper]) > [role='listitem'] > :is(button, a) {
    white-space: nowrap;
  }
`;

// @ts-ignore - JS mixin typing
/**
 * @type {MoreButtonMenuMixinType}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
// prettier-ignore
export const MoreButtonMenuMixin = /** @type {MoreButtonMenuMixinType} */ (superclass =>
  class MoreButtonMenuMixinClass extends /** @type {import('@open-wc/dedupe-mixin').Constructor<MoreButtonMenuHostType>} */ (/** @type {any} */ (superclass)) {
    /** @param {...any} args */
    constructor(...args) {
      super(...args);
      /** @type {ResizeObserver | null} */ this.__moreButtonObserver = null;
      /** @type {number | undefined} */ this.__fitFrame = undefined;
      this.isMoreButtonShown = null;
      this.handleResize = this.handleResize.bind(this);
    }

    disconnectedCallback() {
      window.removeEventListener('resize', this.handleResize);
      this.__moreButtonObserver?.disconnect();
      this.__moreButtonObserver = null;
      if (this.__fitFrame !== undefined) {
        cancelAnimationFrame(this.__fitFrame);
        this.__fitFrame = undefined;
      }
      super.disconnectedCallback?.();
    }

    _initMoreButtonMenu() {
      this._createMoreButtonWrapper();
      // ResizeObserver reacts to the list box changing (container/layout resize), so the fit
      // re-evaluates without polling. Its initial callback also performs the first fit.
      this.__moreButtonObserver = new ResizeObserver(() => this.__scheduleFitUpdate());
      this.__moreButtonObserver.observe(this._listNode);
      // `window` resize is also observed (kept for robustness and the test harness) — both paths
      // coalesce through __scheduleFitUpdate().
      window.addEventListener('resize', this.handleResize);
    }

    /**
     * Coalesce re-fit requests into a single frame; multiple observers/resizes in the same frame
     * schedule only one layout pass.
     * @private
     */
    __scheduleFitUpdate() {
      if (this.__fitFrame !== undefined) {
        return;
      }
      this.__fitFrame = requestAnimationFrame(() => {
        this.__fitFrame = undefined;
        this.__applyFit();
      });
    }

    /**
     * Apply the fitted More-button visibility. Guarded so a re-fit triggered by our own DOM moves
     * (which change the observed boxes and re-fire ResizeObserver) does not recurse.
     * @private
     */
    __applyFit() {
      this.renderAllItemsInMainMenu();
      this.hideMoreButton();
      this.style.visibility = '';

      if (this.__mainMenuFits()) {
        return;
      }

      this.style.visibility = 'hidden';
      this.displayMoreButton();
      const hiddenItemsCount = this.__hiddenItemsCount();
      this.moveHiddenItemsFromMainMenuToMoreButtonMenu(hiddenItemsCount);
      this.style.visibility = '';
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
      [...(this.getMoreButtonSlotProjection()?.childNodes ?? [])].forEach(node =>
        moreButtonWrapper.appendChild(node),
      );
      const moreButton = moreButtonWrapper.querySelector('button');
      moreButton?.setAttribute('data-more-button', '');
      moreButton?.setAttribute('tabindex', '-1');
      moreButton?.setAttribute('aria-expanded', 'false');
      const moreButtonMenu = document.createElement('div');
      moreButtonMenu.setAttribute('data-more-button-menu', '');
      moreButtonMenu.setAttribute('tabindex', '-1');
      moreButtonWrapper.appendChild(moreButtonMenu);
      this._listNode.appendChild(moreButtonWrapper);

      const isElementDirectFocusableItemUnderMoreButtonMenu = (/** @type {HTMLElement} */ element) =>
        (this.listItems.includes(element) && moreButtonMenu.contains(element)) ||
        element === moreButtonMenu;

      moreButtonMenu.addEventListener(
        'focusin',
        (/** @type {FocusEvent} */ event) => {
          const target = /** @type {HTMLElement} */ (event?.target);
          if (!isElementDirectFocusableItemUnderMoreButtonMenu(target)) return;

          // If applicable hide any other L2 menus
          /** @type {any} */ (this.querySelector('[level="2"]:has([data-open])'))?._overlayCtrl?.hide();

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
          if (isElementDirectFocusableItemUnderMoreButtonMenu(/** @type {HTMLElement} */ (this._getDeepActiveElement()))) return;
          moreButton?.setAttribute('aria-expanded', 'false');

          moreButtonMenu.removeAttribute('data-open');
        }, 100);
      });

      moreButton?.addEventListener('click', () => {
        if (moreButtonMenu.getAttribute('data-open') === null) {
          moreButtonMenu?.focus({ preventScroll: true });
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
      const wrapper = /** @type {HTMLElement} */ (this.getMoreButtonMenuWrapper());
      if (!wrapper) return;
      wrapper.style.display = 'block';
      this.isMoreButtonShown = true;
    }

    hideMoreButton() {
      const wrapper = /** @type {HTMLElement} */ (this.getMoreButtonMenuWrapper());
      if (!wrapper) return;
      wrapper.style.display = 'none';
      this.isMoreButtonShown = false;
    }

    /**
     * Whether the full main menu fits without the More button. Read-only: no layout writes in
     * this scope, so it can be measured without forcing a synchronous reflow on the caller's hot path.
     * @protected
     */
    __mainMenuFits() {
      const list = this._listNode;
      return list.scrollWidth <= list.clientWidth;
    }

    /**
     * How many trailing main-menu items must move to the More menu once it is shown, measured in a
     * single batched layout pass. All widths are read together with no writes interleaved, so this
     * avoids the read→write→read→write layout thrash of measuring per hidden item.
     * @protected
     */
    __hiddenItemsCount() {
      const list = this._listNode;
      const wrapper = this.getMoreButtonMenuWrapper();
      const moreButtonWidth = wrapper ? /** @type {HTMLElement} */ (wrapper).offsetWidth : 0;
      const available = list.clientWidth - moreButtonWidth;
      const items = this.getListItems();
      // Reads happen inside __itemWidth() in a plain for-loop with no writes between iterations,
      // so the browser lays out once and the loop reads from the cached layout — a single pass.
      let taken = 0;
      for (let i = 0; i < items.length; i += 1) {
        const width = this.__itemWidth(/** @type {HTMLElement} */ (items[i]));
        if (taken + width > available) {
          return items.length - i;
        }
        taken += width;
      }
      return 0;
    }

    /**
     * Read the intrinsic layout width of a main-menu item. Kept as its own read accessor so the
     * measurement pass reads geometry without a preceding mutation (no forced reflow) and the
     * reads are not nested in the loop.
     * @param {HTMLElement} item
     */
    // eslint-disable-next-line class-methods-use-this -- pure width accessor
    __itemWidth(item) {
      return item.offsetWidth;
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
        if (previousSibling.nodeType === Node.ELEMENT_NODE) {
          break;
        }
        previousNodes.unshift(previousSibling);
        if (isMarkerComment(previousSibling)) {
          break;
        }
        ({ previousSibling } = previousSibling);
      }

      const nextNodes = [];
      let { nextSibling } = listItem;
      while (nextSibling) {
        if (nextSibling.nodeType === Node.ELEMENT_NODE) {
          break;
        }
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
      if (!moreButtonMenu || !moreButtonMenuWrapper) return;
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


    /**
     * @param {number} hiddenItemsCount
     */
    moveHiddenItemsFromMainMenuToMoreButtonMenu(hiddenItemsCount) {
      const moreButtonMenuElement = this.getMoreButtonMenu();
      const listItems = this._listNode.querySelectorAll(':scope > [role="listitem"]');
      for (let i = 0; i < hiddenItemsCount; i += 1) {
        const listItem = listItems[listItems.length - 1 - i];
        // @ts-ignore - the list items of a menu host are elements
        this.moveItemToMoreButtonMenuFromMainMenu({ moreButtonMenuElement, listItem });
      }
    }

    handleResize() {
      this.__scheduleFitUpdate();
    }
  });
