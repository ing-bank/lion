/* eslint-disable lit-a11y/anchor-is-valid, import/no-extraneous-dependencies */
import { css } from 'lit';
// import '@lion/ui/define/lion-icon.js';
import { UIBaseElement } from './shared/UIBaseElement.js';
import { addIconResolverForPortal } from './iconset-portal/addIconResolverForPortal.js';
import uiPortalMainNavBurgerCss from './ui-portal-main-nav-burger.css.js';

try {
  addIconResolverForPortal();
} catch (e) {
  // do nothing
  // icons can be registered by somebody else?
}

// TODO: apply https://web.dev/website-navigation/ (aria-current="page" etc.)

/**
 * @typedef {{name: string; url: string; active?:boolean; iconId?: string; children?: NavItemData[]; svg?: string; target?: string; rel?: string}} NavItem
 */
export class UIPortalMainNav extends UIBaseElement {
  static properties = {
    navData: { type: Object, attribute: 'nav-data' },
  };

  constructor() {
    super();
    /**
     * @type {{items: NavItem[], githubUrl: string}}
     */
    this.navData = { items: [] };
  }

  connectedCallback() {
    super.connectedCallback();
    if (window) {
      // only on the client
      window.setTimeout(() => {
        // remove the second navigation
        // its rendered twice due to lack of lit/ssr
        // https://github.com/lit/lit/issues/4472
        const $navs = this.renderRoot.querySelectorAll('[data-part="nav"]');
        if ($navs.length > 1) {
          $navs[1].remove();
        }

        // Inject global styles for mobile layout
        this._injectGlobalStyles();

        // Setup mobile collapsible behavior for nested levels
        this._setupMobileCollapsibles();

        // Setup search button event handler
        this._setupSearchButton();
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  _injectGlobalStyles() {
    // Check if styles are already injected
    if (document.getElementById('ui-portal-main-nav-global-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'ui-portal-main-nav-global-styles';
    style.textContent = `
      .github-link {
        display: flex !important;
      }

      @media (max-width: 768px) {
        .github-link {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  _setupMobileCollapsibles() {
    // Only on mobile
    if (window.innerWidth > 768) return;

    const shadowRoot = this.renderRoot;

    // Handle L1 items with L2 children
    shadowRoot.querySelectorAll('[data-part="listitem"][data-level="1"]').forEach(l1Item => {
      const l2Level = l1Item.querySelector('[data-part="level"][data-level="2"]');
      const anchor = l1Item.querySelector('[data-part="anchor"][data-level="1"]');

      if (l2Level && anchor) {
        // Make anchor toggleable
        anchor.style.cursor = 'pointer';
        anchor.setAttribute('role', 'button');
        anchor.setAttribute('aria-expanded', 'true');

        // Create visual indicator
        const indicator = document.createElement('span');
        indicator.style.cssText =
          'margin-left: auto; font-size: 0.6rem; transition: transform 0.2s ease;';
        indicator.textContent = '▼';
        anchor.appendChild(indicator);

        // Toggle handler for L1
        anchor.addEventListener('click', e => {
          const hasChildren =
            l2Level &&
            l2Level.querySelectorAll('[data-part="level"][data-level="2"] > [data-part="list"]')
              .length > 0;
          if (!hasChildren) {
            // No children, allow normal navigation
            return;
          }
          e.preventDefault();
          const isExpanded = anchor.getAttribute('aria-expanded') === 'true';
          anchor.setAttribute('aria-expanded', String(!isExpanded));
          l2Level.classList.toggle('collapsed');
          indicator.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
        });

        // Initialize L2 toggle
        l2Level.classList.add('collapsed');
        anchor.setAttribute('aria-expanded', 'false');
        indicator.style.transform = 'rotate(-90deg)';
      }
    });

    // Handle L2 items with L3 children
    shadowRoot.querySelectorAll('[data-part="listitem"][data-level="2"]').forEach(l2Item => {
      const l3Level = l2Item.querySelector('[data-part="level"][data-level="3"]');
      const anchor = l2Item.querySelector('[data-part="anchor"][data-level="2"]');

      if (l3Level && anchor) {
        // Make anchor toggleable
        anchor.style.cursor = 'pointer';
        anchor.setAttribute('role', 'button');
        anchor.setAttribute('aria-expanded', 'true');

        // Create visual indicator
        const indicator = document.createElement('span');
        indicator.style.cssText =
          'margin-left: auto; font-size: 0.6rem; transition: transform 0.2s ease;';
        indicator.textContent = '▼';
        anchor.appendChild(indicator);

        // Toggle handler for L2
        anchor.addEventListener('click', e => {
          const hasChildren =
            l3Level &&
            l3Level.querySelectorAll('[data-part="level"][data-level="3"] > [data-part="list"]')
              .length > 0;
          if (!hasChildren) {
            // No children, allow normal navigation
            return;
          }
          e.preventDefault();
          const isExpanded = anchor.getAttribute('aria-expanded') === 'true';
          anchor.setAttribute('aria-expanded', String(!isExpanded));
          l3Level.classList.toggle('collapsed');
          indicator.style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
        });

        // Initialize L3 toggle
        l3Level.classList.add('collapsed');
        anchor.setAttribute('aria-expanded', 'false');
        indicator.style.transform = 'rotate(-90deg)';
      }
    });
  }

  _setupSearchButton() {
    const shadowRoot = this.renderRoot;
    const navItemLast = shadowRoot.querySelector('.nav-item-last');

    if (!navItemLast) return;

    // Find the search button (item with "Search" text)
    const links = navItemLast.querySelectorAll('a');
    const searchLink = Array.from(links).find(link => link.textContent.trim() === 'Search');

    if (searchLink) {
      // Prevent default navigation for search
      searchLink.addEventListener('click', e => {
        e.preventDefault();

        // Dispatch custom event to open search modal
        const event = new CustomEvent('search-requested', {
          bubbles: true,
          composed: true,
          detail: { source: 'navbar-search-button' },
        });

        // Dispatch from the document so it can be caught by SearchModal
        document.dispatchEvent(event);
      });
    }
  }

  get templateContext() {
    return {
      ...super.templateContext,
      data: this.navData,
    };
  }

  // static templates = {
  //   main(context) {
  //     const { data, templates } = context;

  //     return html` <nav>${templates.navLevel(context, { children: data.items })}</nav> `;
  //   },
  //   navLevel(context, { children }) {
  //     const { templates } = context;

  //     return html`<ul>
  //       ${children.map(
  //         item =>
  //           html`<li>
  //             ${templates.navItem(context, { item })}
  //             ${item.children?.length
  //               ? html`<ul>
  //                   <li>
  //                     ${item.children.map(
  //                       child1 => html`
  //                         ${templates.navItem(context, { item: child1 })}
  //                         ${child1.children?.length
  //                           ? html` collapsible
  //                               <ul>
  //                                 ${item.children.map(
  //                                   child2 => html`
  //                                     <li>${templates.navItem(context, { item: child2 })}</li>
  //                                   `,
  //                                 )}
  //                               </ul>`
  //                           : nothing}
  //                       `,
  //                     )}
  //                   </li>
  //                 </ul>`
  //               : nothing}
  //           </li>`,
  //       )}
  //     </ul>`;
  //   },
  //   navItem(context, { item }) {
  //     return html`<a href="${item.redirect || item.url}" aria-current=${item.active ? 'page' : ''}
  //       >${item.name}
  //     </a>`;
  //   },
  // };
}
export const tagName = 'ui-portal-main-nav';

const sharedGlobalStyles = css`
  * {
    box-sizing: border-box;
  }
`;

// /**
//  * Base UI Nav templates contains an accessible base html that can be used for all kinds of navigations,
//  * regardless of presentation: horizontally stacked, vertically stacked or a combination of both.
//  * With or without collapsible levels, with or without overlays.
//  * with any amount of nested levels.
//  * @returns
//  */
// const baseUINavMarkup = {
//   templates: () => ({
//     main(context) {
//       const { data, templates } = context;

//       return html`
//         <nav data-part="nav">
//           <input type="checkbox" id="burger-toggle" hidden />
//           <label for="burger-toggle" class="burger">
//             <span></span>
//             <span></span>
//             <span></span>
//           </label>

//           <div id="l1-wrapper" data-part="l1-wrapper">
//             ${templates.navRootLevel(context, { children: data.items, level: 1 })}
//             ${templates.navNestedLevel(context, {
//               children: data.items.find(item => item.active)?.children,
//               level: 2,
//             })}
//           </div>
//         </nav>
//       `;
//     },
//     navRootLevel(context, { children, level, hasActiveChild = false }) {
//       const { templates } = context;
//       const navItems = children.filter(item => !item.svg);
//       const actionItems = children.filter(item => item.svg);

//       return html`<div
//         data-part="level"
//         data-level="${level}"
//         data-has-active-child="${hasActiveChild}"
//       >
//         <ul data-part="list" data-level="${level}">
//           ${navItems.map(
//             item =>
//               html` <li data-part="listitem" data-level="${level}" ?data-:active="${item.active}">
//                 ${templates.navItem(context, { item, level })}
//               </li>`,
//           )}
//         </ul>
//         <div class="nav-item-last">
//           ${actionItems.map(
//             item =>
//               html`<a
//                 href="${item.url}"
//                 data-part="anchor"
//                 data-level="${level}"
//                 title="${item.name}"
//                 ?target="${item.target}"
//                 ?rel="${item.rel}"
//               >
//                 ${unsafeHTML(item.svg)}
//                 <span>${item.name}</span>
//               </a>`,
//           )}
//         </div>
//       </div>`;
//     },
//     navNestedLevel(context, { children, level, hasActiveChild = false }) {
//       const { templates } = context;

//       if (!children?.length) {
//         return nothing;
//       }

//       return html`<div
//         data-part="level"
//         data-level="${level}"
//         data-has-active-child="${hasActiveChild}"
//       >
//         <ul data-part="list" data-level="${level}">
//           ${children.map(
//             item =>
//               html`<li data-part="listitem" data-level="${level}" ?data-:active="${item.active}">
//                 ${templates.navItem(context, { item, level })}
//                 ${item.children?.length
//                   ? templates.navNestedLevel(context, {
//                       level: level + 1,
//                       children: item.children,
//                       hasActiveChild: item.hasActiveChild,
//                     })
//                   : nothing}
//               </li>`,
//           )}
//         </ul>
//       </div>`;
//     },
//     navItem(context, { item, level }) {
//       return html`<a
//         data-part="anchor"
//         data-level="${level}"
//         href="${item.redirect || item.url}"
//         aria-current=${item.active ? 'page' : ''}
//         >${level === 1
//           ? html` <lion-icon
//               data-part="icon"
//               data-level="${level}"
//               icon-id="${item.iconId}${item.active ? 'Filled' : ''}"
//             ></lion-icon>`
//           : nothing}<span>${item.name}</span>
//       </a>`;
//     },
//   }),
//   // this is not working
//   // you need to use global elements definitions
//   scopedElements: () => ({}),
// };

UIPortalMainNav.provideDesign({
  // templates: () => ({
  //   main(context) {
  //     const { data, templates } = context;

  //     return html`
  //       <nav data-part="nav">
  //         <input type="checkbox" id="burger-toggle" hidden />
  //         <label for="burger-toggle" class="burger">
  //           <span></span>
  //           <span></span>
  //           <span></span>
  //         </label>

  //         <div id="l1-wrapper" data-part="l1-wrapper">
  //           ${templates.navRootLevel(context, { children: data.items, level: 1 })}
  //           ${templates.navNestedLevel(context, {
  //             children: data.items.find(item => item.active)?.children,
  //             level: 2,
  //           })}
  //         </div>
  //       </nav>
  //     `;
  //   },
  //   navRootLevel(context, { children, level, hasActiveChild = false }) {
  //     const { templates } = context;
  //     const navItems = children.filter(item => !item.svg);
  //     const actionItems = children.filter(item => item.svg);

  //     return html`<div
  //       data-part="level"
  //       data-level="${level}"
  //       data-has-active-child="${hasActiveChild}"
  //     >
  //       <ul data-part="list" data-level="${level}">
  //         ${navItems.map(
  //           item =>
  //             html` <li data-part="listitem" data-level="${level}" ?data-:active="${item.active}">
  //               ${templates.navItem(context, { item, level })}
  //             </li>`,
  //         )}
  //       </ul>
  //       <div class="nav-item-last">
  //         ${actionItems.map(
  //           item =>
  //             html`<a
  //               href="${item.url}"
  //               data-part="anchor"
  //               data-level="${level}"
  //               title="${item.name}"
  //               ?target="${item.target}"
  //               ?rel="${item.rel}"
  //             >
  //               ${unsafeHTML(item.svg)}
  //               <span>${item.name}</span>
  //             </a>`,
  //         )}
  //       </div>
  //     </div>`;
  //   },
  //   navNestedLevel(context, { children, level, hasActiveChild = false }) {
  //     const { templates } = context;

  //     if (!children?.length) {
  //       return nothing;
  //     }

  //     return html`<div
  //       data-part="level"
  //       data-level="${level}"
  //       data-has-active-child="${hasActiveChild}"
  //     >
  //       <ul data-part="list" data-level="${level}">
  //         ${children.map(
  //           item =>
  //             html`<li data-part="listitem" data-level="${level}" ?data-:active="${item.active}">
  //               ${templates.navItem(context, { item, level })}
  //               ${item.children?.length
  //                 ? templates.navNestedLevel(context, {
  //                     level: level + 1,
  //                     children: item.children,
  //                     hasActiveChild: item.hasActiveChild,
  //                   })
  //                 : nothing}
  //             </li>`,
  //         )}
  //       </ul>
  //     </div>`;
  //   },
  //   navItem(context, { item, level }) {
  //     return html`<a
  //       data-part="anchor"
  //       data-level="${level}"
  //       href="${item.redirect || item.url}"
  //       aria-current=${item.active ? 'page' : ''}
  //       >${level === 1
  //         ? html` <lion-icon
  //             data-part="icon"
  //             data-level="${level}"
  //             icon-id="${item.iconId}${item.active ? 'Filled' : ''}"
  //           ></lion-icon>`
  //         : nothing}<span>${item.name}</span>
  //     </a>`;
  //   },
  // }),
  /** Horizontal layout */
  styles: () => [
    sharedGlobalStyles,
    uiPortalMainNavBurgerCss,
    css`
      /* RESET & BASE */
      :host {
        height: auto !important;
        width: 100% !important;
        position: relative;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        background: transparent;
        border: none;
        padding: 0 !important;
        margin: 0 !important;
        box-sizing: border-box;
      }

      /* NAV ELEMENT */
      :host [data-part='nav'] {
        height: auto !important;
        width: 100% !important;
        display: flex !important;
        align-items: center !important;
        padding: 0 !important;
        margin: 0 !important;
        position: relative;
        flex: 1;
        box-sizing: border-box;
      }

      /* BURGER - HIDDEN BY DEFAULT, SHOWN ON MOBILE */
      :host .burger {
        display: none !important;
      }

      /* BURGER STYLES */
      :host .burger {
        position: relative;
        display: none;
        flex-direction: column;
        width: 32px;
        height: 32px;
        justify-content: space-around;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        z-index: 1001;
      }

      :host .burger span {
        height: 3px;
        width: 24px;
        background: var(--text-secondary);
        border-radius: 2px;
        transition: all 0.3s ease;
        display: block;
      }

      :host input[id='burger-toggle']:checked ~ .burger span:first-child {
        transform: rotate(45deg) translate(8px, 8px);
      }

      :host input[id='burger-toggle']:checked ~ .burger span:nth-child(2) {
        opacity: 0;
      }

      :host input[id='burger-toggle']:checked ~ .burger span:last-child {
        transform: rotate(-45deg) translateY(-10px);
      }

      :host input[id='burger-toggle'] {
        display: none !important;
        visibility: hidden;
      }

      /* L1 WRAPPER - FLEX HORIZONTAL */
      #l1-wrapper {
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        height: auto !important;
        flex-direction: row !important;
        flex: 1;
        padding: 0 !important;
        margin: 0 !important;
        gap: 0 !important;
      }

      /* LEVEL 1 - HORIZONTAL */
      :host [data-part='level'][data-level='1'] {
        width: auto !important;
        height: auto !important;
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-start !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        overflow: visible !important;
        gap: 0 !important;
        flex: 1;
        box-sizing: border-box;
      }

      /* LIST LEVEL 1 - MAIN-NAV STYLES */
      :host [data-part='list'][data-level='1'] {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: flex-end !important;
        list-style: none !important;
        margin: 0 !important;
        padding: 0 !important;
        gap: 24px !important;
        width: 100% !important;
        height: auto !important;
        flex: 1;
        box-sizing: border-box;
      }

      /* LIST ITEMS LEVEL 1 */
      :host [data-part='listitem'][data-level='1'] {
        display: flex !important;
        align-items: center !important;
        margin: 0 !important;
        padding: 0 !important;
        background: none !important;
        border: none !important;
        height: auto !important;
        width: auto !important;
        box-sizing: border-box;
      }

      /* ANCHORS LEVEL 1 - MAIN-NAV STYLES */
      :host [data-part='anchor'][data-level='1'] {
        display: inline-flex !important;
        align-items: center !important;
        gap: 0.5rem;
        padding: 0.5rem !important;
        color: var(--text-secondary) !important;
        text-decoration: none !important;
        font-size: 0.9rem !important;
        font-weight: 400 !important;
        border-radius: 0 !important;
        margin: 0 !important;
        white-space: nowrap;
        height: auto !important;
        border: none !important;
        background: transparent !important;
        cursor: pointer;
        transition: color 0.2s ease;
        box-sizing: border-box;
        line-height: 1.5;
      }

      :host [data-part='anchor'][data-level='1']:hover {
        color: var(--highlight-color) !important;
        text-decoration: none !important;
      }

      :host [data-part='anchor'][data-level='1'][aria-current='page'] {
        color: var(--highlight-color) !important;
        font-weight: 500 !important;
      }

      :host [data-part='anchor'][data-level='1'][aria-current='page']:hover {
        color: var(--highlight-color) !important;
      }

      :host [data-part='anchor'][data-level='1']:focus {
        outline: 2px solid var(--focus-border-color-outer, #ffc107);
        outline-offset: -2px;
      }

      /* ICONS LEVEL 1 */
      :host [data-part='icon'][data-level='1'] {
        display: none !important;
      }

      /* TEXT IN LEVEL 1 ANCHORS */
      :host [data-part='anchor'][data-level='1'] span {
        font-family: var(
          --font-family,
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          Roboto,
          Oxygen,
          Ubuntu,
          Cantarell,
          sans-serif
        );
        line-height: 1.5;
      }

      /* BLOG VARIANT STYLES */
      :host([variant='l1-blog']) [data-part='anchor'][data-level='1'] {
        color: #e0e0e0 !important;
      }

      :host([variant='l1-blog']) [data-part='anchor'][data-level='1']:hover {
        color: #ffc107 !important;
      }

      :host([variant='l1-blog']) [data-part='anchor'][data-level='1'][aria-current='page'] {
        color: #ffc107 !important;
      }

      :host([variant='l1-blog']) [data-part='anchor'][data-level='1'][aria-current='page']:hover {
        color: #ffc107 !important;
      }

      /* HIDE ALL LOWER LEVELS - DESKTOP ONLY */
      :host [data-part='level'][data-level='2'],
      :host [data-part='level'][data-level='3'],
      :host [data-part='level'][data-level='4'],
      :host [data-part='level'][data-level='5'] {
        display: none !important;
        visibility: hidden !important;
      }

      :host [data-part='list'][data-level='2'],
      :host [data-part='list'][data-level='3'],
      :host [data-part='list'][data-level='4'],
      :host [data-part='list'][data-level='5'] {
        display: none !important;
        visibility: hidden !important;
      }

      :host [data-part='listitem'][data-level='2'],
      :host [data-part='listitem'][data-level='3'],
      :host [data-part='listitem'][data-level='4'],
      :host [data-part='listitem'][data-level='5'] {
        display: none !important;
        visibility: hidden !important;
      }

      :host [data-part='anchor'][data-level='2'],
      :host [data-part='anchor'][data-level='3'],
      :host [data-part='anchor'][data-level='4'],
      :host [data-part='anchor'][data-level='5'] {
        display: none !important;
        visibility: hidden !important;
      }

      /* SEARCH AND GITHUB CONTAINER */
      :host .nav-item-last {
        display: flex !important;
        align-items: center !important;
        gap: 0.5rem !important;
        flex-shrink: 0 !important;
      }

      :host .nav-item-last [data-part='anchor'] {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        width: 40px !important;
        height: 40px !important;
        cursor: pointer !important;
        text-decoration: none !important;
        color: var(--text-secondary) !important;
        border-radius: var(--border-radius-default) !important;
        transition:
          color 0.2s ease,
          background-color 0.2s ease !important;
        padding: 0 !important;
        margin: 0 !important;
      }

      :host .nav-item-last [data-part='anchor']:hover {
        color: var(--highlight-color) !important;
        background-color: rgba(255, 193, 7, 0.1) !important;
      }

      :host .nav-item-last [data-part='anchor'] svg {
        width: 20px !important;
        height: 20px !important;
      }

      :host .nav-item-last [data-part='anchor'] span {
        display: none !important;
      }

      /* RESPONSIVE - SHOW BURGER ON MOBILE */
      @media (max-width: 768px) {
        :host .burger {
          display: flex !important;
        }

        :host [data-part='nav'] {
          flex-direction: column;
        }

        :host #l1-wrapper {
          position: absolute !important;
          top: 64px !important;
          left: 0 !important;
          right: 0 !important;
          background: rgba(0, 0, 0, 0.95) !important;
          flex-direction: column !important;
          display: none !important;
          width: 100% !important;
          z-index: 1000 !important;
          padding: 0 !important;
          border-bottom: 1px solid var(--border-color) !important;
        }

        :host input[id='burger-toggle']:checked ~ #l1-wrapper {
          display: flex !important;
        }

        /* LEVEL 1 - MOBILE FLYOUT */
        :host [data-part='level'][data-level='1'] {
          width: 100% !important;
          border: none !important;
        }

        :host [data-part='list'][data-level='1'] {
          flex-direction: column !important;
          width: 100% !important;
          gap: 0 !important;
          justify-content: flex-start !important;
          align-items: stretch !important;
        }

        :host [data-part='listitem'][data-level='1'] {
          display: flex !important;
          flex-direction: column !important;
          width: 100% !important;
        }

        :host [data-part='anchor'][data-level='1'] {
          padding: 1rem !important;
          width: 100% !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-left: none !important;
          white-space: normal !important;
          justify-content: space-between !important;
        }

        /* LEVEL 2 - SHOW ON MOBILE */
        :host [data-part='level'][data-level='2'] {
          display: flex !important;
          visibility: visible !important;
          width: 100% !important;
          border: none !important;
          flex-direction: column !important;
          max-height: 1000px !important;
          opacity: 1 !important;
          overflow: hidden !important;
          transition:
            max-height 0.3s ease,
            opacity 0.3s ease !important;
        }

        :host [data-part='level'][data-level='2'].collapsed {
          max-height: 0 !important;
          opacity: 0 !important;
        }

        :host [data-part='list'][data-level='2'] {
          display: flex !important;
          visibility: visible !important;
          flex-direction: column !important;
          width: 100% !important;
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          list-style: none !important;
        }

        :host [data-part='listitem'][data-level='2'] {
          display: flex !important;
          visibility: visible !important;
          flex-direction: column !important;
          width: 100% !important;
        }

        :host [data-part='anchor'][data-level='2'] {
          display: flex !important;
          visibility: visible !important;
          padding: 0.75rem 1rem 0.75rem 2rem !important;
          width: 100% !important;
          color: var(--text-primary) !important;
          font-size: 0.875rem !important;
          border: none !important;
          background: transparent !important;
          text-decoration: none !important;
        }

        :host [data-part='anchor'][data-level='2']:hover {
          background-color: rgba(255, 193, 7, 0.05) !important;
          color: var(--highlight-color) !important;
        }

        :host [data-part='anchor'][data-level='2'][aria-current='page'] {
          color: var(--highlight-color) !important;
          background-color: rgba(255, 193, 7, 0.1) !important;
          font-weight: 500 !important;
        }

        /* LEVEL 3 - SHOW ON MOBILE */
        :host [data-part='level'][data-level='3'] {
          display: flex !important;
          visibility: visible !important;
          width: 100% !important;
          border: none !important;
          flex-direction: column !important;
          max-height: 1000px !important;
          opacity: 1 !important;
          overflow: hidden !important;
          transition:
            max-height 0.3s ease,
            opacity 0.3s ease !important;
        }

        :host [data-part='level'][data-level='3'].collapsed {
          max-height: 0 !important;
          opacity: 0 !important;
        }

        :host [data-part='list'][data-level='3'] {
          display: flex !important;
          visibility: visible !important;
          flex-direction: column !important;
          width: 100% !important;
          gap: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          list-style: none !important;
        }

        :host [data-part='listitem'][data-level='3'] {
          display: flex !important;
          visibility: visible !important;
          flex-direction: column !important;
          width: 100% !important;
        }

        :host [data-part='anchor'][data-level='3'] {
          display: flex !important;
          visibility: visible !important;
          padding: 0.75rem 1rem 0.75rem 3rem !important;
          width: 100% !important;
          color: var(--text-primary) !important;
          font-size: 0.875rem !important;
          border: none !important;
          background: transparent !important;
          text-decoration: none !important;
        }

        :host [data-part='anchor'][data-level='3']:hover {
          background-color: rgba(255, 193, 7, 0.05) !important;
          color: var(--highlight-color) !important;
        }

        :host [data-part='anchor'][data-level='3'][aria-current='page'] {
          color: var(--highlight-color) !important;
          background-color: rgba(255, 193, 7, 0.1) !important;
          font-weight: 500 !important;
        }

        /* LEVEL 4 & 5 - HIDE */
        :host [data-part='level'][data-level='4'],
        :host [data-part='level'][data-level='5'] {
          display: none !important;
          visibility: hidden !important;
        }

        :host [data-part='list'][data-level='4'],
        :host [data-part='list'][data-level='5'] {
          display: none !important;
          visibility: hidden !important;
        }

        /* HIDE ICONS ON MOBILE */
        :host [data-part='icon'][data-level='1'] {
          display: none !important;
        }

        :host [data-part='icon'][data-level='2'],
        :host [data-part='icon'][data-level='3'] {
          display: none !important;
        }

        /* SEARCH AND GITHUB ON MOBILE */
        :host .nav-item-last {
          flex-direction: column !important;
          width: 100% !important;
          padding: 1rem 0 !important;
          border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
          gap: 0 !important;
        }

        :host .nav-item-last [data-part='anchor'] {
          width: 100% !important;
          height: auto !important;
          padding: 0.75rem 1rem !important;
          border-radius: 0 !important;
          justify-content: flex-start !important;
          gap: 0.5rem !important;
        }

        :host .nav-item-last [data-part='anchor'] span {
          display: inline !important;
          color: var(--text-primary) !important;
          font-size: 0.875rem !important;
        }

        :host .nav-item-last [data-part='anchor']:hover {
          background-color: rgba(255, 193, 7, 0.05) !important;
        }
      }
    `,
  ],
  layouts: () => ({
    'floating-toggle': 0,
    'inline-columns': 900,
  }),
  layoutsContainer: () => globalThis,
});

customElements.define(tagName, UIPortalMainNav);
