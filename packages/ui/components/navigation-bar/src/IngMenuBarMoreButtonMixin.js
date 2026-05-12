import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { html } from 'lit';

/**
 * @typedef {import('lit').LitElement} LitElement
 * @typedef {import('./types/index.js').IngMenuBarMoreButtonMixin} IngMenuBarMoreButtonMixin
 * @typedef {import('./types.js').MenuItem} MenuItem
 */

/**
 *
 * Dependencies
 * . getFirstLevelItems
 * . menuItems -> menu in LionNavigationBar
 * '.navigation-bar__container' - max width
 * '.more-button-wrapper' - defined in now in LionNavigationBar. TODO move it here as a function
 * . desktop vs mobile. Do not run any from this file on 'mobile'
 * . this.breakpointMin = 1200; // force desktop -> changed in LionNavigationBar
 */

/**
 * IngMenuBarMoreButtonMixin provides responsive menu logic with More button.
 * Handles:
 * - Calculation of which menu items fit in available width
 * - Responsive More button with hidden items
 * - Tracking of original vs. visible menu items
 *
 * @type {IngMenuBarMoreButtonMixin}
 */
export const IngMenuBarMoreButtonMixinImplementation = superclass => {
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class IngMenuBarMoreButtonMixin extends superclass {
    /** ====================
     * Static public getters
     * ===================== */
    static get properties() {
      return {
        visibleFirstLevelItems: { type: Array },
        hiddenFirstLevelItems: { type: Array },
        showMoreButton: { type: Boolean },
      };
    }

    constructor() {
      super();
      /**
       * The first level items before More button
       */
      this.visibleFirstLevelItems = [];
      /**
       * The first level items inside the `More button` menu
       */
      this.hiddenFirstLevelItems = [];
      /**
       * When `More button` has to be rendered.
       */
      this.showMoreButton = false;

      /** ========================
       * Hardcoded CSS Selectors
       * ======================== */

      /**
       * The parent container which we don't want to overflow
       */
      this.navigationBarContainerSelector = '.navigation-bar__container';
      /**
       * The first level `li` item with the More button
       */
      this.moreButtonWrapperSelector = '.more-button-wrapper';
    }

    // Add lifecycle methods here
    connectedCallback() {
      super.connectedCallback();
      // eslint-disable-next-line no-restricted-globals
      addEventListener('resize', this.handleResize);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      // eslint-disable-next-line no-restricted-globals
      removeEventListener('resize', this.handleResize);
    }

    updated(changedProperties) {
      // Check if menu property changed
      if (changedProperties.has('menu')) {
        this.calculateVisibleItems();
      }
    }

    getFirstLevelItems() {
      const toplevelList = this.shadowRoot
        .querySelector('lion-menu-hybrid[data-has-full-width-flyout]')
        .querySelector('[role="list"]');
      return [...toplevelList.children].filter(child => child.getAttribute('role') === 'listitem');
    }

    /**
     * Handler for resize events
     */
    handleResize = () => {
      this.calculateVisibleItems();
    };

    /**
     * Calculate which first-level items fit in the available width
     * Triggered by menu property changes and window resize events
     * Strategy:
     * 1. Render all items without More button initially
     * 2. Check if they all fit in available width
     * 3. If they fit, we're done (no More button needed)
     * 4. If they don't fit, create More button and add it as the last element
     * 5. Remove items from the end one by one (excluding More button) until remaining items + More button fit
     */
    calculateVisibleItems() {
      if (!this.menu || this.menu.length === 0) {
        return;
      }

      // Phase 1: Render all items without More button to measure them
      this.showMoreButton = false;
      this.visibleFirstLevelItems = this.menu || [];

      // Wait for the render to complete
      this.updateComplete.then(() => {
        this.checkAndAdjustItems();
      });
    }

    /**
     * Helper method to check if items fit and adjust with More button if needed
     * This handles the async measurement and removal loop
     * @private
     */
    checkAndAdjustItems() {
      const navBarContainer = this.shadowRoot.querySelector(this.navigationBarContainerSelector);
      if (!navBarContainer) {
        return;
      }

      const containerRect = navBarContainer.getBoundingClientRect();
      const containerRight = containerRect.right;

      const itemElements = this.getFirstLevelItems();

      if (itemElements.length === 0) {
        return;
      }

      // Phase 2: Check if all items fit without More button
      const lastItemRect = itemElements[itemElements.length - 1].getBoundingClientRect();

      if (lastItemRect.right <= containerRight) {
        // All items fit - render only the original items without More button
        this.visibleFirstLevelItems = this.menu || [];
        this.hiddenFirstLevelItems = [];
        this.showMoreButton = false;
        return;
      }

      // Phase 3: Items don't fit - set showMoreButton to true and start removal loop
      this.showMoreButton = true;

      // Phase 4: Start the removal loop after rendering with More button
      this.updateComplete.then(() => {
        this.removeItemsUntilFit(containerRight, 0);
      });
    }

    /**
     * Recursively remove items from the end until remaining items + More button fit
     * @private
     * @param {number} containerRight - The right boundary of the container
     * @param {number} removedCount - Number of items removed so far
     */
    removeItemsUntilFit(containerRight, removedCount) {
      const moreButtonElement = this.shadowRoot?.querySelector(this.moreButtonWrapperSelector);
      const regularItemElements = this.getFirstLevelItems() || [];

      if (!moreButtonElement || regularItemElements.length === 0) {
        return;
      }

      const moreButtonRect = moreButtonElement.getBoundingClientRect();
      const moreButtonWidth = moreButtonRect.width;
      const lastItemRect =
        regularItemElements[regularItemElements.length - 1].getBoundingClientRect();
      const simulatedMoreRight = lastItemRect.right + moreButtonWidth;

      // Check if current items + More button fit
      if (simulatedMoreRight <= containerRight) {
        // Items + More button now fit!
        const visibleCount = this.menu.length - removedCount;
        this.visibleFirstLevelItems = this.menu.slice(0, visibleCount);
        this.hiddenFirstLevelItems = this.menu.slice(visibleCount);
        this.showMoreButton = true;
        return;
      }

      // Need to remove another item
      if (removedCount < this.menu.length - 1) {
        const visibleCount = this.menu.length - removedCount - 1;
        this.visibleFirstLevelItems = this.menu.slice(0, visibleCount);
        this.hiddenFirstLevelItems = this.menu.slice(visibleCount);
        this.showMoreButton = true;

        this.updateComplete.then(() => {
          this.removeItemsUntilFit(containerRight, removedCount + 1);
        });
      } else {
        // Only More button with all items hidden
        this.visibleFirstLevelItems = [];
        this.hiddenFirstLevelItems = this.menu;
        this.showMoreButton = true;
      }
    }

    _renderMoreButtonWrapper(l1Items) {
      return html`<div class="more-button-wrapper">
        <button data-invoker>More</button>
        ${l1Items}
      </div>`;
    }
  }

  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  return IngMenuBarMoreButtonMixin;
};

export const IngMenuBarMoreButtonMixin = dedupeMixin(IngMenuBarMoreButtonMixinImplementation);
