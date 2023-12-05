import { html, nothing, css, isServer } from 'lit';
import { directive, AsyncDirective } from 'lit/async-directive.js';
import { LionIcon } from '@lion/ui/icon.js';
import { UIBaseElement } from './shared/UIBaseElement.js';
import { addIconResolverForPortal } from './iconset-portal/addIconResolverForPortal.js';

addIconResolverForPortal();

function assertList(element) {
  if (isServer) return;
  if (!(element instanceof HTMLUListElement || element instanceof HTMLOListElement)) {
    throw new Error(
      '[UIPortalMainNavPartDirective.anchor] Please apply to HTMLUListElement (`<ul>`) | HTMLOListElement (`<ol>`)',
    );
  }
}

function assertListItem(element) {
  if (isServer) return;
  if (!(element instanceof HTMLLIElement)) {
    throw new Error('[UIPortalMainNavPartDirective.anchor] Please apply to HTMLLIElement (`<li>`)');
  }
}

function assertAnchor(element) {
  if (isServer) return;
  if (!(element instanceof HTMLAnchorElement)) {
    throw new Error(
      '[UIPortalMainNavPartDirective.anchor] Please apply to HTMLAnchorElement (`<a>`)',
    );
  }
}

function assertButton(element) {
  if (isServer) return;
  if (
    !(element instanceof HTMLElement || element instanceof LionButton) ||
    element.getAttribute('role') === 'button'
  ) {
    throw new Error(
      '[UIPortalMainNavPartDirective.toggle-for-level] Please apply to HTMLButtonElement (`<button>`) | LionButton | `[role=button]`',
    );
  }
}

function assertLionIcon(element) {
  if (isServer) return;
  if (!(element instanceof LionIcon)) {
    throw new Error('[UIPortalMainNavPartDirective.icon] Please apply to LionIcon');
  }
}

export function initNavData(navData, activePath, shouldReset = false) {
  /** @type WeakMap<{NavItem},{NavItem}> */
  const itemParents = new WeakMap();

  function resetActive(navData, currentUrl) {
    for (const navItem of navData) {
      navItem.active = false;
      navItem.hasActiveChild = false;
      if (navItem.children?.length) {
        resetActive(navItem.children, currentUrl);
      }
    }
  }

  function setParents(navData, parentItem = null) {
    for (const navItem of navData) {
      if (parentItem) {
        itemParents.set(navItem, parentItem);
      }
      if (navItem.children?.length) {
        setParents(navItem.children, navItem);
      }
    }
  }

  let activeItem;
  function setActive(navData, currentUrl) {
    if (activeItem) return;

    for (const navItem of navData) {
      if (currentUrl === navItem.url) {
        navItem.active = true;
        activeItem = navItem;
      }
      if (navItem.children?.length) {
        setActive(navItem.children, currentUrl);
      }
    }
  }

  function _setParentsActive(navItem) {
    const parentItem = itemParents.get(navItem);
    if (parentItem) {
      parentItem.hasActiveChild = true;
      _setParentsActive(parentItem);
    }
  }

  if (shouldReset) {
    resetActive(navData);
  }

  setParents(navData);
  setActive(navData, activePath);
  _setParentsActive(activeItem);
}

function setLevel(el, { level }) {
  if (typeof level !== 'number') {
    throw new Error('[UIPortalMainNavPartDirective] Please provide a level in localContext');
  }
  el.setAttribute('data-level', level);
}
export class UIPortalMainNavPartDirective extends AsyncDirective {
  constructor() {
    super();
    this._hasFirstUpdated = false;
  }

  _setupLevel(part, { level, isToggleTarget }) {
    const { element } = part;
    setLevel(element, { level });
    element.setAttribute('data-part', 'level');
    element.setAttribute('id', `level-${level}`);
    if (isToggleTarget) {
      element.setAttribute('popover', '');
    }
  }

  _setupLevelBackBtn(part, { level, isToggleTarget }) {
    const { element } = part;
    assertButton(element);
    element.setAttribute('data-part', 'level-back-btn');

    if (isServer) return;

    element.addEventListener('click', ({}) => {
      element.parentElement.hidePopover();
    });
  }

  _setupList(part) {
    const { element } = part;
    assertList(element);
    element.setAttribute('data-part', 'list');
  }

  _setupListitem(part) {
    const { element } = part;
    assertListItem(element);
    element.setAttribute('data-part', 'listitem');
  }

  _updateListItem(part, { item }) {
    const { element } = part;
    if (item.active) {
      element.setAttribute('data-active', '');
    }
    if (item.hasActiveChild) {
      element.setAttribute('data-has-active-child', '');
    }
  }

  _setupAnchor(part, { item, level }) {
    const { element } = part;
    setLevel(element, { level });
    assertAnchor(element);
    element.setAttribute('data-part', 'anchor');
    element.setAttribute('href', item.url);
    if (item.active) {
      element.setAttribute('aria-current', 'page');
    }
  }

  _setupToggleForLevel(part, { context, level, item }) {
    const { element } = part;
    assertButton(element);

    setLevel(element, { level });
    element.setAttribute('data-part', 'toggle-for-level');
    element.setAttribute('popovertarget', `level-${level + 1}`);

    if (isServer) return;

    element.addEventListener('click', () => {
      initNavData(context.data.navData, item.children[0].url, true);
      console.log('before requestUpdate');
      context.set('navData', context.data.navData);
      context.set('hasL1Open', Boolean(context.data.navData.find(d => d.hasActiveChild)));

      // context.host.render();
    });
  }

  _setupIcon(part, { item, level }) {
    const iconEl = part.element;

    if (!this._hasFirstUpdated) {
      setLevel(iconEl, { level });

      iconEl.setAttribute('data-part', 'icon');
    }

    iconEl.setAttribute(
      'icon-id',
      item.active || item.hasActiveChild ? item.iconActiveId || item.iconId : item.iconId,
    );
  }

  // _$initialize(...args) {
  //   super._$initialize(...args);
  // }

  setup(part, [name, localContext]) {
    switch (name) {
      case 'level':
        this._setupLevel(part, localContext);
        break;
      case 'level-back-btn':
        this._setupLevelBackBtn(part, localContext);
        break;
      case 'list':
        this._setupList(part, localContext);
        break;
      case 'listitem':
        this._setupListitem(part, localContext);
        break;
      case 'anchor':
        this._setupAnchor(part, localContext);
        break;
      case 'toggle-for-level':
        this._setupToggleForLevel(part, localContext);
        break;
      case 'icon':
        this._setupIcon(part, localContext);
        break;
    }
  }

  update(part, options) {
    if (!this._hasFirstUpdated) {
      this.setup(part, options);
    }
    this._hasFirstUpdated = true;

    const [name, localContext] = options;
    switch (name) {
      case 'listitem':
        this._updateListItem(part, localContext);
        break;
    }
  }

  // render() {
  //   // console.log('bladie', this);
  //   // return 'test';
  //   this.__part.element.setAttribute('haha', '');
  // }
}
const portalMainNavPartDirective = directive(UIPortalMainNavPartDirective);

// TODO: apply https://web.dev/website-navigation/ (aria-current="page" etc.)

/**
 * @typedef {{name: string; url: string; active?:boolean; iconId?: string; children?: NavItemData[]}} NavItem
 */
export class UIPortalMainNav extends UIBaseElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
    hasL1Open: { type: Boolean, state: true },
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
      part: portalMainNavPartDirective,
      data: { navData: this.navData, hasL1Open: this.hasL1Open },
      host: this,
    };
  }

  // static templates = {
  //   main(context) {
  //     const { data, templates } = context;

  //     return html` <nav>${templates.navLevel(context, { children: data.navData })}</nav> `;
  //   },
  //   navLevel(context, { children, level = 0 }) {
  //     const { templates } = context;

  //     return html`<ul>
  //       ${children.map(
  //         item => html`<li>
  //           ${templates.navItem(context, { item, level })}
  //           ${item.children?.length
  //             ? templates.navLevel(context, {
  //                 children: item.children,
  //                 level: level + 1,
  //               })
  //             : nothing}
  //         </li>`,
  //       )}
  //     </ul>`;
  //   },
  //   navItem(context, { item, level }) {
  //     const { directives } = context;

  //     return html`<a ${directives.navItem(item)}>${item.name}</a>`;
  //   },
  // };
}
export const tagName = 'ui-portal-main-nav';

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

      // console.log('data.hasL1Open', data.hasL1Open);

      return html`
        <div data-part="root" ?data-has-l1-open="${data.hasL1Open}">
          <nav data-part="nav">
            <button popovertarget="l1-wrapper" data-part="l1-invoker">Open Menu</button>
            <div popover id="l1-wrapper" data-part="l1-wrapper">
              ${templates.navLevel(context, { children: data.navData, level: 1 })}
            </div>
          </nav>
        </div>
      `;
    },
    navLevel(context, { children, level, isToggleTarget }) {
      const { templates, part } = context;

      return html`<div ${part('level', { level, isToggleTarget })}>
        ${isToggleTarget
          ? html`<button ${part('level-back-btn', { level })}>Back</button>`
          : nothing}
        <ul ${part('list')}>
          ${children.map(
            item => html`<li ${part('listitem', { item })}>
              ${templates.navItem(context, { item, level })}
              ${item.children?.length
                ? templates.navLevel(context, {
                    level: level + 1,
                    children: item.children,
                    isActive: item.active,
                    isToggleTarget: !item.url,
                  })
                : nothing}
            </li>`,
          )}
        </ul>
      </div>`;
    },
    navItem(context, { item, level }) {
      const { part } = context;

      if (item.url) {
        return html`<a ${part('anchor', { item, level })}
          >${level === 1
            ? html`<lion-icon ${part('icon', { level, item })}></lion-icon>`
            : nothing}<span>${item.name}</span></a
        >`;
      }

      return html`<button ${part('toggle-for-level', { context, level, item })}>
        ${level === 1
          ? html`<lion-icon ${part('icon', { level, item })}></lion-icon>`
          : nothing}<span>${item.name}</span>
      </button>`;
    },
  }),
  scopedElements: () => ({
    'lion-icon': LionIcon,
  }),
};

const sharedGlobalStyles = css`
  * {
    box-sizing: border-box;
  }
`;

const unstyledPopoverStyles = css`
  [popover] {
    border: 0;
    margin: 0;
    padding: 0;
  }
`;

/**
 * Multiple columns, no l1 toggle
 */
const desktopStyles = css`
  /** we don't have a toggle button, so we always show l1 */
  [popover]:not(:popover-open) {
    display: block;
  }
  [popovertarget='l1-wrapper'] {
    display: none;
  }

  [data-part='root'] {
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

  [data-part='nav'] {
    height: 100%;
  }

  [data-part='l1-wrapper'] {
    height: 100%;
  }

  [data-part='level'] {
    padding-top: var(--size-6);
    overflow: scroll;
  }

  [data-part='level'][data-level='1'] {
    width: var(--_width-l0);
    height: 100%;
    border-right: 1px solid #ccc;
  }

  /**
  * When a l0 child is active, or a l1 child => open correct l1
  */
  [data-part='listitem']:not([data-active], [data-has-active-child])
    [data-part='level'][data-level='2'] {
    /** TODO: sr-only, because we want to present all links to the screen reader */
    display: none;
  }

  [data-part='level'][data-level='2'] {
    /* position: absolute; */
    width: var(--_width-l1);
    left: var(--_width-l0);
    top: 0;
    padding-inline: var(--size-6);
    border-right: 1px solid #ccc;
    height: 100%;
  }

  [data-part='list'] {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  [data-part='listitem'] {
    display: block;
    margin-bottom: var(--size-6);
  }

  [data-part='icon'][data-level='1'] {
    display: block;
    width: var(--size-7);
    height: var(--size-7);
    margin-bottom: var(--size-1);
  }

  [data-part='anchor'][data-level='1'],
  [data-part='toggle-for-level'][data-level='1'] {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  [data-part='anchor'],
  [data-part='toggle-for-level'] {
    color: inherit;
    text-decoration: inherit;
    font-size: 14px;
    fill: #666666;
    /** <button> reset */
    border: none;
    padding: 0;
    width: 100%;
    background-color: transparent;
  }

  [data-part='anchor']:hover,
  [data-part='toggle-for-level']:hover {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }

  [data-part='listitem'][data-\:active] {
  }
`;

const mobileStyles = css`
  /** we place the menu 100% to the left, so it can be animated in */
  [popover]:not(:popover-open) {
    display: block;
  }

  /*   0. BEFORE-OPEN STATE   */

  [popover]:popover-open {
    @starting-style {
      translate: var(--_width) 0;
    }
  }

  /*   1. IS-OPEN STATE   */
  [popover]:popover-open {
    translate: 0 0;
  }

  /*   2. EXIT STATE   */
  [popover] {
    transition: translate 0.3s ease-out, overlay 0.3s ease-out allow-discrete,
      display 0.3s ease-out allow-discrete;
    translate: calc(-1 * var(--_width)) 0;
  }

  /* ----------------------------
 * part: root
 */

  [data-part='root'] {
    --_width: 400px;
    --_bg-color: white;
  }

  [data-part='listitem']:not([data-active], [data-has-active-child])
    [data-part='level'][data-level='2'] {
    /** TODO: sr-only, because we want to present all links to the screen reader */
    display: none;
  }

  /* ----------------------------
 * part: nav
 */

  [data-part='nav'] {
    height: 100%;
  }

  /* ----------------------------
 * part: l1-wrapper
 */

  [data-part='l1-wrapper'] {
    height: 100%;
    width: var(--_width);
    border: 0;
    margin: 0;
    padding: 0;
    position: fixed;
  }

  [data-part='level'] {
    left: 0;
    top: 0;
    position: fixed;
    background-color: var(--_bg-color);
    width: var(--_width);
    height: 100%;
  }

  [data-part='list'] {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  [data-part='listitem'] {
    display: block;
    padding: var(--size-6);
  }

  [data-part='anchor'] {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  [data-part='anchor'] {
    color: inherit;
    text-decoration: inherit;
    font-size: 14px;
    fill: #666666;
  }

  [data-part='anchor']:hover {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }
`;

UIPortalMainNav.provideStylesAndMarkup({
  markup: baseUINavMarkup,
  styles: () => [
    sharedGlobalStyles,
    unstyledPopoverStyles,
    // css`
    //   :host {
    //     container-type: inline-size;
    //   }

    //   @container (max-width: 999px) {
    //     ${mobileStyles}
    //   }

    //   @container (min-width: 1000px) {
    //     ${desktopStyles}
    //   }
    // `,
  ],
  layouts: () => ({
    mobile: {
      styles: mobileStyles,
      breakpoint: '0px',
      container: globalThis,
      // templateContext: ctxt => ({ ...ctxt, data: { ...ctxt.data, shouldToggleL1: true } }),
    },
    desktop: {
      styles: desktopStyles,
      breakpoint: '1024px',
      container: globalThis,
      // templateContext: ctxt => ({ ...ctxt, data: { ...ctxt.data, shouldToggleL1: false } }),
    },
  }),
  // layoutsContainer: () => globalThis,
});

customElements.define(tagName, UIPortalMainNav);
