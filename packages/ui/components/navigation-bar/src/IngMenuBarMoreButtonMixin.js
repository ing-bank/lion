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
        allFirstLevelItems: { type: Array, state: true },
        visibleFirstLevelItems: { type: Array },
        hiddenFirstLevelItems: { type: Array },
        showMoreButton: { type: Boolean },
      };
    }

    constructor() {
      super();
      /**
       * All first level items
       */
      this.allFirstLevelItems = [];
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
      // Check if allFirstLevelItems property changed
      if (changedProperties.has('allFirstLevelItems')) {
        this.calculateVisibleItems();
      }
      if (changedProperties.has('hiddenFirstLevelItems') && this.hiddenFirstLevelItems.length !== changedProperties.get('hiddenFirstLevelItems')?.length) {
        function isFocusableElement(potentialFocusable) {
          // @ts-ignore - returns Element or falsy value
          return (
            potentialFocusable &&
            (potentialFocusable.hasAttribute('tabindex') ||
              ['BUTTON', 'A'].includes(potentialFocusable.tagName))
          );
        }

        const getFocusableChildren = (parent) => {
          const listItems = parent.querySelectorAll(':scope > [role="listitem"]');
          const focusableChildren = [];
          listItems.forEach(listItem => {
            [...listItem.children].filter(c => isFocusableElement(c))
              .forEach(focusableChild => focusableChildren.push(focusableChild)); 
          });
          return focusableChildren;
        };

        const mainMenu = this.shadowRoot.querySelectorAll('lion-menu-hybrid')[1];
        const listItems = mainMenu._listNode.querySelectorAll(':scope > [role="listitem"]');
        
        const mainMenuFocusableChildren = getFocusableChildren(mainMenu._listNode);
        

        const moreButtonMenu = this.getMoreButtonMenu();
        const moreButtonFocusableChildren = getFocusableChildren(moreButtonMenu);
        const focusableChildren = [...mainMenuFocusableChildren, ...moreButtonFocusableChildren];
        
        if (focusableChildren.length > 0) {
          mainMenu._initListItems(focusableChildren);
        }
        
      }
    }

    getFirstLevelItems() {
      const toplevelList = this.shadowRoot
        .querySelectorAll('lion-menu-hybrid')[1]
        .querySelector('[role="list"]');
      return [...toplevelList.children].filter(child => child.getAttribute('role') === 'listitem');
    }

    getMoreButtonWrapper() {
      return this.shadowRoot
        .querySelector('lion-menu-hybrid .more-button-wrapper');
    }

    getMoreButtonMenu() {
      return this.shadowRoot
        .querySelector('lion-menu-hybrid .more-button-menu');
    }

    /**
     * Check if all items fit in the available width
     * @private
     * @returns {boolean} True if items fit without scrolling, false otherwise
     */
    doItemsFit() {
      const listElement = this.shadowRoot
        .querySelectorAll('lion-menu-hybrid')[1]
        ?.querySelector('[role="list"]');

      return listElement.scrollWidth === listElement.clientWidth;
    }

    /**
     * Handler for resize events
     */
    handleResize = () => {
      // Reset display property for all first-level listitems
      const listItems = this.getFirstLevelItems();
      listItems.forEach(item => {
        item.style.display = '';
      });
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
      if (!this.allFirstLevelItems || this.allFirstLevelItems.length === 0) {
        return;
      }

      // Phase 1: Render all items without More button to measure them
      this.showMoreButton = false;
      this.getMoreButtonWrapper().style.display = 'none';
      this.visibleFirstLevelItems = this.allFirstLevelItems || [];

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
      // Phase 2: Check if all items fit without More button using scrollWidth vs clientWidth
      if (this.doItemsFit()) {
        console.log('fit');
        // All items fit - render only the original items without More button
        this.visibleFirstLevelItems = this.allFirstLevelItems || [];
        this.hiddenFirstLevelItems = [];
        this.showMoreButton = false;
        return;
      }

      // Phase 3: Items don't fit - set showMoreButton to true and start removal loop
      this.showMoreButton = true;
      this.getMoreButtonWrapper().style.display = 'block';
      console.log('does not fit');

      // Phase 4: Start the removal loop after rendering with More button
      this.hideItemsUntilFit();
    }

    /**
     * Hide items from the end one by one until they fit in available width
     * Updates visibleFirstLevelItems and hiddenFirstLevelItems accordingly
     * @private
     */
    hideItemsUntilFit() {
      const listItems = this.getFirstLevelItems();

      // Iterate from the end of allFirstLevelItems backwards
      for (let i = this.allFirstLevelItems.length - 1; i >= 0; i--) {
        // Hide this item in the DOM
        if (listItems[i]) {
          listItems[i].style.display = 'none';
        }

        // Check if remaining items (including More button) fit
        if (this.doItemsFit()) {
          // Items fit! Update visible/hidden lists
          this.visibleFirstLevelItems = this.allFirstLevelItems.slice(0, i);
          this.hiddenFirstLevelItems = this.allFirstLevelItems.slice(i);
          return;
        }
      }
    }

    _renderMoreButtonWrapper(l1Items) {
      return html`<div class="more-button-wrapper">
        <button>More</button>
        <div class="more-button-menu">
          ${l1Items}
        </div>        
      </div>`;
    }
  }

  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  return IngMenuBarMoreButtonMixin;
};

export const IngMenuBarMoreButtonMixin = dedupeMixin(IngMenuBarMoreButtonMixinImplementation);
