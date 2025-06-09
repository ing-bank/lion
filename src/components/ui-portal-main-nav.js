/* eslint-disable lit-a11y/anchor-is-valid */
import { css, html, nothing } from 'lit';
import '@lion/ui/define/lion-icon.js';
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
 * @typedef {{name: string; url: string; active?:boolean; iconId?: string; children?: NavItemData[]}} NavItem
 */
export class UIPortalMainNav extends UIBaseElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
  };

  constructor() {
    super();
    /**
     * @type {NavItem[]}
     */
    this.navData = [];
    this.getLink = item =>
      html`<a href="${item.redirect || item.url}" aria-current=${item.active ? 'page' : ''}
        >${item.name}</a
      >`;
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
      });
    }
  }

  get templateContext() {
    return {
      ...super.templateContext,
      data: { navData: this.navData },
    };
  }

  static templates = {
    main(context) {
      const { data, templates } = context;

      return html` <nav>${templates.navLevel(context, { children: data.navData })}</nav> `;
    },
    navLevel(context, { children }) {
      const { templates } = context;

      return html`<ul>
        ${children.map(
          item =>
            html`<li>
              ${templates.navItem(context, { item })}
              ${item.children?.length
                ? html`<ul>
                    <li>
                      ${item.children.map(
                        child1 => html`
                          ${this.getLink(child1)}
                          ${child1.children?.length
                            ? html` collapsible
                                <ul>
                                  ${item.children.map(
                                    child2 => html`
                                      <li>${templates.navItem(context, { item: child2 })}</li>
                                    `,
                                  )}
                                </ul>`
                            : nothing}
                        `,
                      )}
                    </li>
                  </ul>`
                : nothing}
            </li>`,
        )}
      </ul>`;
    },
    navItem(context, { item }) {
      return this.getLink(item);
    },
  };
}
export const tagName = 'ui-portal-main-nav';

const sharedGlobalStyles = css`
  * {
    box-sizing: border-box;
  }
`;

/**
 * Base UI Nav templates contains an accessible base html that can be used for all kinds of navigations,
 * regardless of presentation: horizontally stacked, vertically stacked or a combination of both.
 * With or without collapsible levels, with or without overlays.
 * with any amount of nested levels.
 * @returns
 */
const baseUINavMarkup = {
  templates: () => ({
    main(context) {
      const { data, templates } = context;

      return html`
        <nav data-part="nav">
          <input type="checkbox" id="burger-toggle" hidden />
          <label for="burger-toggle" class="burger">
            <span></span>
            <span></span>
            <span></span>
          </label>

          <div id="l1-wrapper" data-part="l1-wrapper">
            ${templates.navRootLevel(context, { children: data.navData, level: 1 })}
            ${templates.navNestedLevel(context, {
              children: data.navData.find(item => item.active)?.children,
              level: 2,
            })}
          </div>
        </nav>
      `;
    },
    navRootLevel(context, { children, level, hasActiveChild = false }) {
      const { templates } = context;

      return html`<div
        data-part="level"
        data-level="${level}"
        data-has-active-child="${hasActiveChild}"
      >
        <ul data-part="list" data-level="${level}">
          ${children.map(
            item =>
              html`<li data-part="listitem" data-level="${level}" ?data-:active="${item.active}">
                ${templates.navItem(context, { item, level })}
              </li>`,
          )}
        </ul>
        <div class="nav-item-last">
          <a href="/search" data-part="anchor" data-level="${level}">
            <lion-icon
              data-part="icon"
              data-level="${level}"
              icon-id="lion-portal:portal:search"
            ></lion-icon>
            <span>Search</span>
          </a>
        </div>
      </div>`;
    },
    navNestedLevel(context, { children, level, hasActiveChild = false }) {
      const { templates } = context;

      if (!children?.length) {
        return nothing;
      }

      return html`<div
        data-part="level"
        data-level="${level}"
        data-has-active-child="${hasActiveChild}"
      >
        <ul data-part="list" data-level="${level}">
          ${children.map(
            item =>
              html`<li data-part="listitem" data-level="${level}" ?data-:active="${item.active}">
                ${templates.navItem(context, { item, level })}
                ${item.children?.length
                  ? templates.navNestedLevel(context, {
                      level: level + 1,
                      children: item.children,
                      hasActiveChild: item.hasActiveChild,
                    })
                  : nothing}
              </li>`,
          )}
        </ul>
      </div>`;
    },
    navItem(context, { item, level }) {
      return html`<a
        data-part="anchor"
        data-level="${level}"
        href="${item.redirect || item.url}"
        aria-current=${item.active ? 'page' : ''}
        >${level === 1
          ? html`<lion-icon
              data-part="icon"
              data-level="${level}"
              icon-id="${item.iconId}${item.active ? 'Filled' : ''}"
            ></lion-icon>`
          : nothing}<span>${item.name}</span></a
      >`;
    },
  }),
  // this is not working
  // you need to use global elements definitions
  scopedElements: () => ({}),
};

UIPortalMainNav.provideStylesAndMarkup({
  markup: baseUINavMarkup,
  /** 2 columns */
  styles: () => [
    sharedGlobalStyles,
    uiPortalMainNavBurgerCss,
    css`
      :host {
        height: 100vh;
        /** Make this the positioning parent of l0 and l1 */
        position: relative;
        display: block;
        position: sticky;
        top: 0;
      }

      #l1-wrapper {
        display: flex;
      }

      :host [data-part='nav'] {
        height: 100%;
      }

      :host [data-part='level'][data-level='1'],
      :host [data-part='level'][data-level='2'] {
        padding-block-start: var(--size-6);
        padding-inline: var(--size-2);
        overflow-y: scroll;
        height: 100vh;
      }

      :host [data-part='level'][data-level='1'] {
        width: 160px;
        border-right: 1px solid #ccc;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      :host [data-part='level'][data-level='2'] {
        width: 200px;
      }

      /**
       * When a l0 child is active, or a l1 child => open correct l1
       */
      :host
        [data-part='listitem']:not([data-\:active])
        [data-part='level'][data-level='2']:not([data-has-active-child]) {
        /** TODO: sr-only, because we want to present all links to the screen reader */
        display: none;
      }

      :host [data-part='list'] {
        list-style-type: none;
        margin: 4px;
        padding: 0;
      }

      :host [data-part='anchor'][data-level='1'] {
        display: block;
        padding-block: var(--size-6);
        padding-inline: var(--size-6);
      }

      :host [data-part='anchor'][data-level='2'] {
        display: block;
        padding-block: var(--size-3);
        padding-inline: var(--size-6);
      }

      :host [data-part='anchor'][data-level='2'][aria-current='page'] {
        padding-block: var(--size-2);
      }

      :host [data-part='icon'][data-level='1'] {
        display: block;
        width: var(--size-7);
        height: var(--size-7);
        margin-bottom: var(--size-1);
      }

      :host [data-part='anchor'][data-level='1'] {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-block-end: 6px;
      }

      :host [data-part='anchor'] {
        display: block;
        color: var(--primary-text-color);
        text-decoration: inherit;
        font-size: 1rem;
        fill: var(--primary-icon-color);
        margin-inline: var(--size-1);
        border-radius: var(--radius-4);
      }

      :host [data-part='anchor'][aria-current='page'] {
        font-weight: bold;
        background-color: var(--primary-color);
      }

      :host [data-part='anchor']:hover {
        text-decoration: underline;
        text-underline-offset: 0.3em;
        background-color: var(--primary-color);
      }

      :host [data-part='anchor']:focus {
        outline: 2px solid var(--contrast-color-dark);
      }

      :host [data-part='anchor'][data-level='2']:focus,
      :host [data-part='anchor'][data-level='2']:focus {
        outline-offset: 2px;
      }

      :host [data-part='level'][data-level='2'] {
        color: var(--primary-text-color, #333);

        /* 14px/Regular */
        font-family: 'ING Me';
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
        text-decoration: none;
      }

      :host [data-part='listitem'][data-level='2'][data-\\:active] {
        border-radius: var(--radius-4);
        background: var(--primary-color, #f0f0f0);
        padding-block-end: 12px;
        margin-block: 6px;
      }

      :host [data-part='level'][data-level='3'] {
        overflow: hidden;
      }

      :host [data-part='anchor'][data-level='3'],
      :host [data-part='anchor'][data-level='4'] {
        /* 14px/Regular */
        font-family: 'ING Me';
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
        text-decoration: none;
        margin-left: var(--size-8);
        padding-inline: var(--size-2);
      }

      :host [data-part='anchor'][data-level='3'][aria-current='page'],
      :host [data-part='anchor'][data-level='4'][aria-current='page'] {
        font-weight: bold;
      }

      :host [data-level='2'] > [aria-current='page'] {
        background: transparent;
        font-weight: bold;
      }

      :host [data-part='list'][data-level='4'] {
        margin-left: var(--size-4);
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
