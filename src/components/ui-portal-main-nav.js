import { html, nothing, css } from 'lit';
import { directive, AsyncDirective } from 'lit/async-directive.js';
import { LionIcon } from '@lion/ui/icon.js';
import { UIBaseElement } from './shared/UIBaseElement.js';
import { addIconResolverForPortal } from './iconset-portal/addIconResolverForPortal.js';

addIconResolverForPortal();

export class NavItemDirective extends AsyncDirective {
  update(part, [item]) {
    const anchorEl = part.element;
    if (!(anchorEl instanceof HTMLAnchorElement)) {
      throw new Error('[NavItemDirective] Please apply to HTMLAnchorElement');
    }
    anchorEl.href = item.url;
    // anchorEl.textContent = item.name;
    if (item.active) {
      anchorEl.setAttribute('aria-current', 'page');
    }
  }
}
const navItemDirective = directive(NavItemDirective);

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
  }

  get templateContext() {
    return {
      ...super.templateContext,
      directives: { navItem: navItemDirective },
      data: { navData: this.navData },
    };
  }

  static templates = {
    main(context) {
      const { data, templates } = context;

      return html` <nav>${templates.navLevel(context, { children: data.navData })}</nav> `;
    },
    navLevel(context, { children, level = 0 }) {
      const { templates } = context;

      return html`<ul>
        ${children.map(
          item => html`<li>
            ${templates.navItem(context, { item, level })}
            ${item.children?.length
              ? templates.navLevel(context, {
                  children: item.children,
                  level: level + 1,
                })
              : nothing}
          </li>`,
        )}
      </ul>`;
    },
    navItem(context, { item, level }) {
      const { directives } = context;

      return html`<a ${directives.navItem(item)}>${item.name}</a>`;
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
          ${data.shouldToggleL1
            ? html`<button popovertarget="l1-wrapper" data-part="l1-invoker">Open Menu</button>`
            : nothing}

          <div ?popover="${data.shouldToggleL1}" id="l1-wrapper" data-part="l1-wrapper">
            ${templates.navLevel(context, { children: data.navData, level: 1 })}
          </div>
        </nav>
      `;
    },
    navLevel(context, { children, level, hasActiveChild = false }) {
      const { templates } = context;

      return html`<div
        data-part="level"
        data-level="${level}"
        ?data-:has-active-child="${hasActiveChild}"
      >
        <ul data-part="list">
          ${children.map(
            item => html`<li data-part="listitem" ?data-:active="${item.isActive}">
              ${templates.navItem(context, { item, level })}
              ${item.children?.length
                ? templates.navLevel(context, {
                    level: level + 1,
                    children: item.children,
                    isActive: item.isActive,
                    hasActiveChild: item.hasActiveChild,
                  })
                : nothing}
            </li>`,
          )}
        </ul>
      </div>`;
    },
    navItem(context, { item, level }) {
      const { directives } = context;

      return html`<a data-part="anchor" data-level="${level}" ${directives.navItem(item)}
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
  scopedElements: () => ({
    'lion-icon': LionIcon,
  }),
};

UIPortalMainNav.provideStylesAndMarkup({
  markup: baseUINavMarkup,
  /** 2 columns */
  styles: () => [
    sharedGlobalStyles,
    css`
      :host([data-layout='inline-columns']) {
        --_width-l0: var(--size-11);
        --_width-l1: var(--size-13);
        height: 100vh;
        /** Make this the positioning parent of l0 and l1 */
        position: relative;
        width: calc(var(--_width-l0) + var(--_width-l1));
        display: block;
        position: sticky;
        top: 0;
      }

      :host([data-layout='inline-columns']) [data-part='nav'] {
        height: 100%;
      }

      :host([data-layout='inline-columns']) [data-part='level'] {
        padding-top: var(--size-6);
        overflow: scroll;
      }

      :host([data-layout='inline-columns']) [data-part='level'][data-level='1'] {
        width: var(--_width-l0);
        height: 100%;
        border-right: 1px solid #ccc;
      }

      /**
       * When a l0 child is active, or a l1 child => open correct l1
       */
      :host([data-layout='inline-columns'])
        [data-part='listitem']:not([data-\:active])
        [data-part='level'][data-level='2']:not([data-\:has-active-child]) {
        /** TODO: sr-only, because we want to present all links to the screen reader */
        display: none;
      }

      :host([data-layout='inline-columns']) [data-part='level'][data-level='2'] {
        width: var(--_width-l1);
        position: absolute;
        left: var(--_width-l0);
        top: 0;
        padding-inline: var(--size-6);
        border-right: 1px solid #ccc;
        height: 100%;
      }

      :host([data-layout='inline-columns']) [data-part='list'] {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      :host([data-layout='inline-columns']) [data-part='listitem'] {
        display: block;
        margin-bottom: var(--size-6);
      }

      :host([data-layout='inline-columns']) [data-part='icon'][data-level='1'] {
        display: block;
        width: var(--size-7);
        height: var(--size-7);
        margin-bottom: var(--size-1);
      }

      :host([data-layout='inline-columns']) [data-part='anchor'][data-level='1'] {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      :host([data-layout='inline-columns']) [data-part='anchor'] {
        color: inherit;
        text-decoration: inherit;
        font-size: 14px;
        fill: #666666;
      }

      :host([data-layout='inline-columns']) [data-part='anchor']:hover {
        text-decoration: underline;
        text-underline-offset: 0.3em;
      }

      :host([data-layout='inline-columns']) [data-part='listitem'][data-\:active] {
      }
    `,
    css`
      /* ----------------------------
       * part: root
       */

      :host([data-layout='floating-toggle']) {
        --_width-l0: var(--size-11);
        --_width-l1: var(--size-13);
        height: 100vh;
        /** Make this the positioning parent of l0 and l1 */
        position: relative;
        width: calc(var(--_width-l0) + var(--_width-l1));
        display: block;
        position: sticky;
        top: 0;
      }

      /* ----------------------------
       * part: nav
       */

      :host([data-layout='floating-toggle']) [data-part='nav'] {
        height: 100%;
      }

      /* ----------------------------
       * part: l1-wrapper
       */

      :host([data-layout='floating-toggle']) [data-part='l1-wrapper'] {
        height: 100%;
        width: 100%;
      }

      /* ----------------------------
       * part: level
       */

      :host([data-layout='floating-toggle']) [data-part='level'] {
        padding-top: var(--size-6);
        overflow: scroll;
      }

      :host([data-layout='floating-toggle']) [data-part='level'][data-level='1'] {
        width: var(--_width-l0);
        height: 100%;
        border-right: 1px solid #ccc;
      }

      /**
         * When a l0 child is active, or a l1 child => open correct l1
         */

      :host([data-layout='floating-toggle'])
        [data-part='listitem']:not([data-\:active])
        [data-part='level'][data-level='2']:not([data-\:has-active-child]) {
        /** TODO: sr-only, because we want to present all links to the screen reader */
        display: none;
      }

      :host([data-layout='floating-toggle']) [data-part='level'][data-level='2'] {
        width: var(--_width-l1);
        position: fixed;
        left: 0;
        top: 0;
        background-color: white;
        padding-inline: var(--size-6);
        border-right: 1px solid #ccc;
        height: 100%;
      }

      :host([data-layout='floating-toggle']) [data-part='list'] {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      :host([data-layout='floating-toggle']) [data-part='listitem'] {
        display: block;
        margin-bottom: var(--size-6);
      }

      :host([data-layout='floating-toggle']) [data-part='icon'][data-level='1'] {
        display: block;
        width: var(--size-7);
        height: var(--size-7);
        margin-bottom: var(--size-1);
      }

      :host([data-layout='floating-toggle']) [data-part='anchor'][data-level='1'] {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      :host([data-layout='floating-toggle']) [data-part='anchor'] {
        color: inherit;
        text-decoration: inherit;
        font-size: 14px;
        fill: #666666;
      }

      :host([data-layout='floating-toggle']) [data-part='anchor']:hover {
        text-decoration: underline;
        text-underline-offset: 0.3em;
      }

      :host([data-layout='floating-toggle']) [data-part='listitem'][data-\:active] {
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
