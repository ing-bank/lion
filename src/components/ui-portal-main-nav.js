/* eslint-disable lit-a11y/anchor-is-valid */
import { css, html, nothing } from 'lit';
import '@lion/ui/define/lion-icon.js';
import { UIBaseElement } from './shared/UIBaseElement.js';
import { addIconResolverForPortal } from './iconset-portal/addIconResolverForPortal.js';
import { navItemDirective } from '../directives/nav-item.js';

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
    layoutWide: { type: Boolean, attribute: 'layout-wide' }, // true or false
  };

  constructor() {
    super();
    /**
     * @type {NavItem[]}
     */
    this.navData = [];
    this.layoutWide = false;
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
    navLevel(context, { children }) {
      const { templates, directives } = context;

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
                          <a ${directives.navItem(child1)}>${child1.name}</a>
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
      const { directives } = context;

      return html`<a ${directives.navItem(item)}>${item.name}</a>`;
    },
  };

  attributeChangedCallback(attrName, oldVal, newVal) {
    super.attributeChangedCallback(attrName, oldVal, newVal);
    if (attrName === 'layout-wide') {
      if (newVal === true || newVal === 'true') {
        this.setAttribute('data-wide', 'true');
      } else {
        this.removeAttribute('data-wide');
      }
    }
  }
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
        <ul data-part="list" data-level="${level}">
          ${children.map(
            item =>
              html`<li data-part="listitem" data-level="${level}" ?data-:active="${item.active}">
                ${templates.navItem(context, { item, level })}
                ${item.children?.length
                  ? templates.navLevel(context, {
                      level: level + 1,
                      children: item.children,
                      hasActiveChild: item.hasActiveChild,
                    })
                  : nothing}
              </li>`,
          )}
        </ul>
        ${level === 1
          ? html`
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
            `
          : nothing}
      </div>`;
    },
    navLevel3(context, { children, level, item }) {
      const { templates, directives } = context;

      return html`<div>
        <a ${directives.navItem(item)} class="second-level-title">${item.name}</a>
        <ul data-part="list" class="second-level-list">
          ${children.map(
            child =>
              html`<li ?data-:active="${child.active}">
                ${templates.navItem(context, { child, level })}
              </li>`,
          )}
        </ul>
      </div>`;

      // accordion with all the links
      // return html`<lion-accordion>
      //     <h3 slot="invoker"><button>${item.name}</button></h3>
      //     <div slot="content">
      //       <ul>
      //           ${children.map(
      //                   item => html`<li ?data-:active="${item.isActive}">
      //                 ${templates.navItem(context, { item, level })}
      //
      //         </li>`)}
      //       </ul>
      //     </div>
      // </div>`;
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
  // this is not working
  // you need to use global elements definitions
  scopedElements: () => ({}),
};

UIPortalMainNav.provideStylesAndMarkup({
  markup: baseUINavMarkup,
  /** 2 columns */
  styles: () => [
    sharedGlobalStyles,
    css`
      :host([data-layout='inline-columns']) {
        --_width-l0: var(--size-12);
        --_width-l1: var(--size-13);
        height: 100vh;
        /** Make this the positioning parent of l0 and l1 */
        position: relative;
        width: var(--_width-l0);
        display: block;
        position: sticky;
        top: 0;
      }

      :host([data-layout='inline-columns'][data-wide='true']) {
        width: calc(var(--_width-l0) + var(--_width-l1));
      }

      :host([data-layout='inline-columns']) [data-part='nav'] {
        height: 100%;
      }

      :host([data-layout='inline-columns']) [data-part='level'][data-level='1'],
      :host([data-layout='inline-columns']) [data-part='level'][data-level='2'] {
        padding-block-start: var(--size-6);
        padding-inline: var(--size-2);
        overflow-y: scroll;
      }

      :host([data-layout='inline-columns']) [data-part='level'][data-level='1'] {
        width: var(--_width-l0);
        height: 100vh;
        border-right: 1px solid #ccc;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
        /* padding-inline: var(--size-6); */
        border-right: 1px solid #ccc;
        height: 100%;
      }

      :host([data-layout='inline-columns']) [data-part='list'] {
        list-style-type: none;
        margin: 4px;
        padding: 0;
      }

      :host([data-layout='inline-columns']) [data-part='anchor'][data-level='1'] {
        display: block;
        padding-block: var(--size-6);
        padding-inline: var(--size-6);
      }

      :host([data-layout='inline-columns']) [data-part='anchor'][data-level='2'] {
        display: block;
        padding-block: var(--size-3);
        padding-inline: var(--size-6);
      }

      :host([data-layout='inline-columns'])
        [data-part='anchor'][data-level='2'][aria-current='page'] {
        padding-block: var(--size-2);
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
        margin-block-end: 6px;
      }

      :host([data-layout='inline-columns']) [data-part='anchor'] {
        display: block;
        color: inherit;
        text-decoration: inherit;
        font-size: 1rem;
        fill: var(--primary-icon-color);
        margin-inline: var(--size-1);
        border-radius: var(--radius-4);
      }

      :host([data-layout='inline-columns']) [data-part='anchor'][aria-current='page'] {
        font-weight: bold;
        background-color: var(--primary-color-lighter);
      }

      :host([data-layout='inline-columns']) [data-part='anchor']:hover {
        text-decoration: underline;
        text-underline-offset: 0.3em;
        background-color: var(--primary-color);
      }

      :host([data-layout='inline-columns']) [data-part='anchor']:focus {
        outline: 2px solid var(--contrast-color-dark);
      }

      :host([data-layout='inline-columns']) [data-part='anchor'][data-level='2']:focus,
      :host([data-layout='inline-columns']) [data-part='anchor'][data-level='2']:focus {
        outline-offset: 2px;
      }

      :host([data-layout='inline-columns']) [data-part='level'][data-level='2'] {
        display: none;
      }

      :host([data-layout='inline-columns']) [data-\\:active] [data-part='level'][data-level='2'] {
        display: block;
      }

      :host([data-layout='inline-columns']) [data-part='level'][data-level='2'] {
        color: var(--primary-text-color, #333);

        /* 14px/Regular */
        font-family: 'ING Me';
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
        text-decoration: none;
      }

      :host([data-layout='inline-columns']) [data-part='listitem'][data-level='2'][data-\\:active] {
        border-radius: var(--radius-4);
        background: var(--primary-color-lighter, #f0f0f0);
        padding-block-end: 12px;
        margin-block: 6px;
      }

      :host([data-layout='inline-columns']) [data-part='level'][data-level='3'] {
        overflow: hidden;
      }

      :host([data-layout='inline-columns']) [data-part='anchor'][data-level='3'],
      :host([data-layout='inline-columns']) [data-part='anchor'][data-level='4'] {
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

      :host([data-layout='inline-columns'])
        [data-part='anchor'][data-level='3'][aria-current='page'],
      :host([data-layout='inline-columns'])
        [data-part='anchor'][data-level='4'][aria-current='page'] {
        font-weight: bold;
      }

      :host([data-layout='inline-columns']) [data-level='2'] > [aria-current='page'] {
        background: transparent;
        font-weight: bold;
      }

      :host([data-layout='inline-columns']) [data-part='list'][data-level='4'] {
        margin-left: var(--size-4);
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
        overflow-y: scroll;
      }

      :host([data-layout='floating-toggle']) [data-part='level'][data-level='1'] {
        width: var(--_width-l0);
        height: 100%;
        border-right: 1px solid var(--primary-lines-color);
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
        background-color: var(--page-background);
        padding-inline: var(--size-6);
        border-right: 1px solid var(--primary-lines-color);
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
        font-size: 0.875rem;
        fill: var(--primary-icon-color);
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
