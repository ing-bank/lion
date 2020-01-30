import { css, html } from '@lion/core';
import { LionTabs } from '@lion/tabs';

/**
 * # <ing-tabs> webcomponent
 *
 * @customElement ing-tabs
 * @extends LionTabs
 */
export class MdTabs extends LionTabs {
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          position: relative;
        }

        :host .tabs__tab-group {
          position: relative;
        }

        :host([orientation='vertical']) .tabs__tab-group {
          display: block;
        }

        :host([orientation='vertical']) .tabs__panels ::slotted([slot='panel']) {
          border-top-right-radius: 0;
          border-top-left-radius: 0;
        }

        #tabsBar {
          position: absolute;
          background-color: #ff3234;
          z-index: 2;
        }

        :host(:not([orientation='vertical'])) #tabsBar {
          /* width: 50px; */
          border-top-right-radius: 4px;
          border-top-left-radius: 4px;
          transition: transform 200ms ease-in-out, width 200ms ease-in-out;
        }

        :host([orientation='vertical']) #tabsBar {
          border-top-left-radius: 4px;
          transition: transform 200ms ease-in-out, height 200ms ease-in-out;
        }
      `,
    ];
  }

  // constructor() {
  //   super();
  //   this.autoOrientation = true;
  //   this.orientation = 'vertical';
  // }

  // render() {
  //   return html`
  //     <div class="tabs__tab-group" role="tablist">
  //       <div id="tabsBar"></div>
  //       <slot name="tab"></slot>
  //     </div>
  //     <div id="panelsWrapper" class="tabs__panels">
  //       <slot name="panel"></slot>
  //     </div>
  //   `;
  // }

  // async performUpdate() {
  //   this.ResizeObserver = window.ResizeObserver;
  //   if (!this.ResizeObserver) {
  //     const ro = await import('resize-observer-polyfill');
  //     this.ResizeObserver = ro.default;
  //   }
  //   super.performUpdate();
  // }

  // __setupResizeObserver() {
  //   const panelsContainer = this.shadowRoot.getElementById('panelsWrapper');

  //   const resizeObserver = new this.ResizeObserver(() => {
  //     if (this.__getMinHorizontalWidth() >= panelsContainer.getBoundingClientRect().width) {
  //       this.orientation = 'vertical';
  //     } else {
  //       this.orientation = 'horizontal';
  //     }
  //   });
  //   this.__activeResizeObserver = resizeObserver.observe(panelsContainer);
  // }

  // __cleanupResizeObserver() {
  //   if (this.__activeResizeObserver) {
  //     this.__activeResizeObserver.disconnect();
  //   }
  // }

  // __getMinHorizontalWidth() {
  //   let totalWidth = 0;
  //   this.tabs.forEach(tab => {
  //     totalWidth = totalWidth + tab.tabContentWidth + 1;
  //   });
  //   return totalWidth;
  // }

  // get tabs() {
  //   return [...this.children].filter(child => child.getAttribute('slot') === 'tab');
  // }

  // __positionTabBar() {
  //   const selectedTab = this.tabs[this.selectedIndex];
  //   const tabBar = this.shadowRoot.getElementById('tabsBar');
  //   if (selectedTab && tabBar) {
  //     if (this.orientation === 'vertical') {
  //       tabBar.style.transform = `translateY(${selectedTab.offsetTop}px)`;
  //       tabBar.style.width = `4px`;
  //       tabBar.style.height = `${selectedTab.getBoundingClientRect().height}px`;
  //       if (this.selectedIndex === 0) {
  //         tabBar.style.borderTopLeftRadius = '4px';
  //       } else {
  //         tabBar.style.borderTopLeftRadius = '';
  //       }
  //     }
  //     if (this.orientation === 'horizontal') {
  //       tabBar.style.transform = `translateX(${selectedTab.offsetLeft}px)`;
  //       tabBar.style.width = `${selectedTab.getBoundingClientRect().width}px`;
  //       tabBar.style.height = `4px`;
  //     }
  //   }
  // }

  // __allTabsReady() {
  //   return Promise.all(this.tabs.map(tab => tab.updateComplete));
  // }

  // updated(changeProperties) {
  //   super.updated(changeProperties);
  //   if (changeProperties.has('orientation')) {
  //     this.setAttribute('aria-orientation', this.orientation);
  //     this.tabs.forEach(tab => {
  //       tab.setAttribute('orientation', this.orientation);
  //     });

  //     this.__allTabsReady().then(() => {
  //       this.__positionTabBar();
  //     });
  //   }

  //   if (changeProperties.has('selectedIndex')) {
  //     this.__allTabsReady().then(() => {
  //       this.__positionTabBar();
  //     });
  //   }

  //   if (changeProperties.has('autoOrientation')) {
  //     if (this.autoOrientation) {
  //       this.updateComplete.then(() => {
  //         this.__setupResizeObserver();
  //       });
  //     } else {
  //       this.__cleanupResizeObserver();
  //     }
  //   }
  // }

  // disconnectedCallback() {
  //   // eslint-disable-next-line wc/guard-super-call
  //   super.disconnectedCallback();
  //   this.__cleanupResizeObserver();
  // }
}
