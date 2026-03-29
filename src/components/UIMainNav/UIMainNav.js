/* eslint-disable no-new */
/* eslint-disable max-classes-per-file */
import { html, nothing, css, isServer } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { UIBaseElement } from '../shared/UIBaseElement.js';
import { updateNavData } from './updateNavData.js';
import { VisibilityToggleCtrl } from '../shared/VisibilityToggleCtrl.js';
import { UIPartDirective } from '../shared/UIPartDirective.js';
import {
  sharedGlobalStyle,
  resetPopoverStyle,
  visibilityStyle,
  scrollLockStyle,
} from '../shared/styles.js';
import {
  assertNav,
  assertList,
  assertListItem,
  assertAnchor,
  assertButton,
} from '../shared/element-assertions.js';

// TODO: move to generic parts
const iconIds = {
  // Search SVG template literal
  'lion:portal:search': html`
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  `,

  // GitHub SVG template literal
  'lion:portal:github': html`
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
      />
    </svg>
  `,

  'lion:portal:l1Invoker': html`<svg
    width="800"
    height="800"
    viewBox="0 0 28 28"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 7C4 6.44771 4.44772 6 5 6H24C24.5523 6 25 6.44771 25 7C25 7.55229 24.5523 8 24 8H5C4.44772 8 4 7.55229 4 7Z"
    />
    <path
      d="M4 13.9998C4 13.4475 4.44772 12.9997 5 12.9997L16 13C16.5523 13 17 13.4477 17 14C17 14.5523 16.5523 15 16 15L5 14.9998C4.44772 14.9998 4 14.552 4 13.9998Z"
    />
    <path
      d="M5 19.9998C4.44772 19.9998 4 20.4475 4 20.9998C4 21.552 4.44772 21.9997 5 21.9997H22C22.5523 21.9997 23 21.552 23 20.9998C23 20.4475 22.5523 19.9998 22 19.9998H5Z"
    />
  </svg>`,
};

export class UIMainNavPartDirective extends UIPartDirective {
  /**
   * This will be used in component documentation to generate anatomy
   */
  parts = {
    root: { role: 'presentation' },
    nav: {
      role: 'nav',
      description: `Main navigation landmark for the page. All navigation items are inside`,
    },
    'l1-invoker': {
      role: 'button',
      optional: true,
      description: `Button (usually hamburger icon) that is responsible for toggling l1 nav. Common on mobile layouts`,
    },
    level: {
      role: 'presentation',
      description: `This marks the difference between different navigation levels (l1, l2, l3 etc.). Commonly bound to disclosure patterns like collapsibles, dropdowns and fly-outs`,
    },
    'level-back-btn': {
      role: 'button',
      optional: true,
      description: `In mobile fly-out menus, this is used to go back to the previous level`,
    },
    list: {
      role: 'list',
      description: `Necessary semantics for screen readers. Each level contains at least 1 list`,
    },
    listitem: {
      role: 'listitem',
      description: `Neccessary semantics. A list item wraps a an anchor, command-invoker or, level-invoker`,
    },
    anchor: {
      role: 'link',
      description: `Most navigation items are anchors with an href. Up to the app to handle them in a SPA or MPA.`,
    },
    'level-invoker': {
      role: 'button',
      description: ``,
    },
    'command-invoker': {
      role: 'button',
      description: `Sends an event up, that can be handlded by the parent. For instance, a search modal that is opened`,
      optional: true,
    },
    icon: { name: 'icon', role: 'img', optional: true },
  };

  setupFunctions = {
    // root: (part, options) => this.constructor._setupRoot(part, options),
    nav: (part, options) => this.constructor._setupNav(part, options),
    'l1-invoker': (part, options) => this.constructor._setupL1Invoker(part, options),
    level: (part, options) => this.constructor._setupLevel(part, options),
    'level-back-btn': (part, options) => this.constructor._setupLevelBackBtn(part, options),
    list: (part, options) => this.constructor._setupList(part, options),
    listitem: (part, options) => this.constructor._setupListitem(part, options),
    anchor: (part, options) => this.constructor._setupAnchor(part, options),
    'level-invoker': (part, options) => this.constructor._setupInvokerForLevel(part, options),
    'command-invoker': (part, options) => this.constructor._setupCommandInvoker(part, options),
    icon: (part, options) => this.constructor._setupIcon(part, options),
  };

  updateFunctions = {
    root: (part, options) => this.constructor._updateRoot(part, options),
    'l1-invoker': (part, options) => this.constructor._updateL1Invoker(part, options),
    listitem: (part, options) => this.constructor._updateListItem(part, options),
    icon: (part, options) => this.constructor._updateIcon(part, options),
    // 'command-invoker': (part, options) => this.constructor._updateCommandInvoker(part, options),
  };

  static setLevel(element, level) {
    if (typeof level !== 'number') {
      throw new Error('[UIMainNavPartDirective]: Please provide a level in localContext');
    }
    element.setAttribute('data-level', level);
  }

  /**
   * Since l1-toggle can be dynamically rendered, we need to check it its toggle controller
   * is already registered when the l1-invoker becomes available. (for instance when switching from desktop to mobile)
   */
  static getVisibilityToggleCtrlForInvoker({ invoker, host }) {
    return (
      this.__controllers && Array.from(this.__controllers)?.find(ctrl => ctrl.invoker === invoker)
    );
  }

  // static _setupRoot({ element }, { context }) {
  //   element.setAttribute('data-part', 'root');
  //   context.registerRef('root', element);
  // }

  static _updateRoot({ element }, { context }) {
    if (context.data.hasL1Open) {
      element.setAttribute('data-has-l1-open', '');
    } else {
      element.removeAttribute?.('data-has-l1-open');
    }
  }

  static _setupNav({ element }) {
    assertNav(element);
    // element.setAttribute('data-part', 'nav');
    // context.registerRef('nav', element);
  }

  static _setupL1Invoker({ element, options }, { context, localContext }) {
    assertButton(element);
    element.setAttribute('aria-label', context.translations.l1Invoker);
  }

  static _updateL1Invoker({ element, options }, { context, localContext }) {
    // desktop flow
    if (context.data.navData.hideToggle) {
      element.setAttribute('hidden', '');
      if (isServer) return;

      // If we switch from mobile to desktop, hide a potential open/close
      const toggleCtrl = this.getVisibilityToggleCtrlForInvoker({
        host: options.host,
        invoker: element,
      });

      if (toggleCtrl) {
        toggleCtrl?.teardown();
      } else {
        // if mobile was SSR rendered, we do not have the toggleCtrl instance.
        // TODO: alternatively, render the SSR default (mobile) always first
        context.onRegisterRef('level-1', target => {
          target.removeAttribute?.('hidden');
          target.removeAttribute?.('popover');
          target.removeAttribute?.('data-visually-hidden');
        });
      }
      return;
    }

    // When on mobile, we register a VisibilityToggleCtrl for the l1-invoker.
    element.removeAttribute?.('hidden');
    if (isServer) return;

    context.onRegisterRef('level-1', target => {
      new VisibilityToggleCtrl(options.host, {
        invoker: element,
        target,
        level: 1,
        mode: 'popover',
        initialOpen: false,
        // visuallyHidden: true,
        shouldHandleScrollLock: localContext.levelConfig.shouldHandleScrollLock,
      });
    });
  }

  static _setupLevel({ element, options }, { context, localContext }) {
    const { level, isToggleTarget, levelConfig } = localContext;

    this.setLevel(element, level);
    // element.setAttribute('data-part', 'level');
    element.setAttribute('id', `level-${level}`);
    context.registerRef(`level-${level}`, element);

    const { showVia = 'disclosure', initialOpen, visuallyHidden = false } = levelConfig || {};

    // Toggles consist of invoker/target pairs. We get the already registered invoker here
    const invoker = context.refs[level === 1 ? 'l1-invoker' : `level-invoker-l${level}`];
    if (!(isToggleTarget && invoker)) return;

    if (localContext.levelConfig.hideToggle) {
      return;
    }

    if (level === 1) {
      new VisibilityToggleCtrl(options.host, {
        visuallyHidden: false,
        initialOpen: false,
        target: element,
        mode: 'popover',
        invoker,
        level: 1,
      });
      return;
    }

    new VisibilityToggleCtrl(options.host, {
      target: element,
      visuallyHidden,
      mode: showVia,
      initialOpen,
      invoker,
      level,
    });
  }

  static _setupLevelBackBtn({ element }, { context, localContext }) {
    assertButton(element);
    this.setLevel(element, localContext.level);
    // element.setAttribute('data-part', 'level-back-btn');
    element.setAttribute('type', 'button');
    if (isServer) return;
    element.addEventListener('click', ({}) => {
      element.parentElement.hidePopover();
    });
    context.registerRef(`level-back-btn-l${localContext.level}`, element);
  }

  static _setupList({ element }, { context, localContext }) {
    element.setAttribute('role', 'list');
    assertList(element);
    this.setLevel(element, localContext.level);
    element.setAttribute('data-part', 'list');
    context.registerRef(`list-${localContext.level}`, element);
  }

  static _setupListitem({ element }, { context, localContext }) {
    assertListItem(element);
    element.setAttribute('data-part', 'listitem');
    this.setLevel(element, localContext.level);
    context.registerRef(`list-item-l${localContext.level}`, element, { isPartOfCollection: true });
  }

  static _updateListItem({ element }, { localContext }) {
    if (localContext.item.active) {
      element.setAttribute('data-active', '');
    }
    if (localContext.item.hasActiveChild) {
      element.setAttribute('data-has-active-child', '');
    }
  }

  static _setupAnchor({ element }, { context, localContext }) {
    this.setLevel(element, localContext.level);
    assertAnchor(element);
    element.setAttribute('data-part', 'anchor');
    element.setAttribute('href', localContext.item.url);
    if (localContext.item.target) {
      element.setAttribute('target', localContext.item.target);
    }
    if (localContext.item.rel) {
      element.setAttribute('rel', localContext.item.rel);
    }
    context.registerRef(`anchor-l${localContext.level}`, element, { isPartOfCollection: true });
    if (localContext.item.active) {
      element.setAttribute('aria-current', 'page');
    }
    if (isServer) return;

    // element.addEventListener('focus', () => {
    //   // Every state update should change navData and trigger a re-render
    //   updateNavData(context.data.navData, localContext.item.url, { shouldReset: true });
    //   setTimeout(() => {
    //     context.set('navData', context.data.navData);
    //     context.set('hasL1Open', hasL1Open(context.data.navData));
    //   }, 100);
    // });
  }

  static _setupInvokerForLevel({ element }, { context, localContext }) {
    assertButton(element);
    this.setLevel(element, localContext.level);
    element.setAttribute('data-part', 'level-invoker');
    element.setAttribute('popovertarget', `level-${localContext.level + 1}`);
    element.setAttribute('type', 'button');
    context.registerRef(`level-invoker-l${localContext.level + 1}`, element);
    if (isServer) return;

    // For invokers >= l1 we want to set them to get `active` state.
    element.addEventListener('click', async event => {
      const isLeftMouseClick = event.button === 0;
      if (!isLeftMouseClick) return;
      // Every state update should change navData and trigger a re-render
      updateNavData(context.data.navData, {
        // activePath: localContext.item.nextLevel.items[0].url,
        activeItem: localContext.item,
        shouldReset: true,
      });

      event.stopPropagation();
      // await context.host.updateComplete;
      // context.set('navData', context.data.navData);
    });
  }

  static _setupIcon({ element }, { context, localContext }) {
    this.setLevel(element, localContext.level);
    // assertLionIcon(element);
    element.setAttribute('data-part', 'icon');
    context.registerRef(`icon-l${localContext.level}`, element);
  }

  static _updateIcon({ element }, { localContext: { item } }) {
    element.setAttribute(
      'icon-id',
      item.active || item.hasActiveChild ? item.iconActiveId || item.iconId : item.iconId,
    );
  }

  static _setupCommandInvoker({ element, options }, { localContext }) {
    assertButton(element);
    this.setLevel(element, localContext.level);
    if (isServer) return;

    // TODO: explore https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using_interest_invokers
    // Find out browser compatibility and cross shadow root support
    element.addEventListener('click', () => {
      options.host.dispatchEvent(new CustomEvent(localContext.item.command));
    });
  }
}

/**
 * @typedef {{name: string; url: string; active?:boolean; iconId?: string; items?: NavItemData[]}} NavItem
 */
export class UIMainNav extends UIBaseElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
  };

  static _partDirective = UIMainNavPartDirective;

  static tagName = 'ui-main-nav';

  constructor() {
    super();
    /**
     * @type {NavLevel}
     */
    this.navData = [];
    // this._iconSvgs = {};
  }

  /**
   * What data do we feed to our templates?
   */
  get templateContext() {
    return {
      ...super.templateContext,
      data: {
        navData: this.navData,
        // iconIdL1Invoker: 'lion:portal:menu',
        // TODO: make part of navData?
        // iconSvgs: this._iconSvgs,

        iconIds,
      },
      translations: { l1Invoker: 'Main menu', levelBackBtn: 'Back' },
      fns: {
        /**
         * It's very common that components switch layouts based on screen size.
         * In this case, we want to stop current animations...
         * Call this method during initialization of a new layout.
         * @example
         * ```js
         * UIMainNav.provideDesign({
         *   // ...,
         *   layouts: () => ({
         *     myLayout: {
         *       // ...,
         *       templateContext: context => {
         *         const navData = {
         *           ...context.data.navData,
         *           // ...,
         *         };
         *         updateNavData(navData, { shouldReset: true });
         *         context.closeMenu({ shouldPreventAnimations: true });
         *         return {
         *           ...context,
         *           data: { ...context.data, navData },
         *         };
         *       },
         *     // ...,
         *    });
         *    // ...,
         * });
         * ```
         * @param {{shouldPreventAnimations: boolean}} options
         */
        closeMenu: ({ shouldPreventAnimations }) => {
          if (shouldPreventAnimations) {
            this.setAttribute('data-prevent-animations', '');
          }

          const controllers = Array.from(this.__controllers || []) || [];
          for (const ctrl of controllers || []) {
            if (ctrl instanceof VisibilityToggleCtrl) {
              ctrl.hide();
            }
          }
          if (shouldPreventAnimations) {
            this.removeAttribute('data-prevent-animations');
          }
        },
        updateNavData,
      },
    };
  }

  /**
   *
   */
  static templates = {
    root(context) {
      const { data, templates, part } = context;

      return html`
        <div ${part('root')}>
          <nav ${part('nav')}>
            ${templates.navLevel0?.(context, { levelConfig: data.navData })}
            ${templates.navLevel(context, {
              levelConfig: data.navData,
              level: 1,
              isToggleTarget: true,
            })}
          </nav>
        </div>
      `;
    },
    navLevel(context, { levelConfig, level, isToggleTarget, hasActiveChild }) {
      const { templates, part, translations } = context;
      const hasBackButton = isToggleTarget && level > 1;

      return html` <div ${part('level', { levelConfig, level, isToggleTarget, hasActiveChild })}>
        ${hasBackButton
          ? html`<!-- -->
              <button ${part('level-back-btn', { level })}>
                ${templates.icon(context, {
                  item: { iconId: 'lion:portal:chevronLeft' },
                  level: 0,
                })}
                ${translations.levelBackBtn}
              </button>`
          : nothing}
        <ul ${part('list', { level })}>
          ${levelConfig.items.map(
            item =>
              html`<!-- -->
                <li ${part('listitem', { item, level })}>
                  ${templates.navItem(context, { item, level })}
                  ${item.nextLevel
                    ? templates.navLevel(context, {
                        hasActiveChild: item.hasActiveChild,
                        levelConfig: item.nextLevel,
                        isToggleTarget: !item.url,
                        level: level + 1,
                      })
                    : nothing}
                </li>`,
          )}
        </ul>
      </div>`;
    },
    navItem(context, { item, level }) {
      const { part, templates } = context;

      if (item.url) {
        // N.B. taken care of by directive
        // eslint-disable-next-line lit-a11y/anchor-is-valid
        return html` <a ${part('anchor', { item, level })}>
          ${templates.icon(context, { item, level })}<span>${item.name}</span>
        </a>`;
      }

      if (item.nextLevel) {
        return html`<!-- -->
          <button ${part('level-invoker', { item, level })}>
            ${templates.icon(context, { item, level })}<span>${item.name}</span>
          </button>`;
      }
      // N.B. we can also have url and nextLevel. Then we want a button with dropdown icon

      // If we have no .url and no .nextLevel, we are a regular button. We send up an event to
      // which our parent can listen
      return html`<!-- -->
        <button ${part('command-invoker', { item, level })}>
          ${templates.icon(context, { item, level })}<span>${item.name}</span>
        </button>`;
    },
    navLevel0(context, { levelConfig }) {
      const { data, part, templates } = context;

      return html`<!-- -->
        <div ${part('level', { level: 0 })}>
          <div data-part="l0-before"><slot name="l0-before"></slot></div>
          <button ${part('l1-invoker', { levelConfig })}>
            ${templates.icon(context, { level: 0, item: { iconId: 'lion:portal:l1Invoker' } })}
          </button>
          <div data-part="l0-after"><slot name="l0-after"></slot></div>
        </div>`;
    },
    icon(context, { item, level }) {
      const svg = context.data.iconIds[item.iconId];

      if (svg) {
        return html`<span data-part="icon" data-level="${level}">${svg}</span>`;
      }
      // Should be implemented in extension layer in opinionated way (like via LionIcon)
      // By default, we don't use web component composition, to allow for ssr renderable markup (scoped elements not supported yet)
      return nothing;
    },
  };
}

// N.B. provision should happen in separate file later

// const mobileStyle = css`
//   :host([data-layout='mobile']) {
//     width: 0;
//   }

//   :host([data-layout='mobile']) .burger {
//     position: absolute;
//     z-index: 1000;

//     display: flex;
//     flex-direction: column;
//     width: 32px;
//     height: 32px;
//     justify-content: space-around;
//     cursor: pointer;
//     left: 20px;
//     top: 20px;
//   }

//   :host([data-layout='mobile']) .burger span {
//     height: 4px;
//     background: #333;
//     border-radius: 2px;
//     transition: 0.3s;
//     display: block;
//   }

//   :host([data-layout='mobile']) #l1-wrapper {
//     display: none;
//     z-index: 100;
//   }

//   :host([data-layout='mobile']) [data-part='level'][data-level='1'],
//   :host([data-layout='mobile']) [data-part='level'][data-level='2'] {
//     z-index: 100;
//   }

//   :host([data-layout='mobile']) #burger-toggle:checked ~ #l1-wrapper {
//     display: flex;
//     position: absolute;
//   }
// `;

const mobileStyle = css`
  /**
   * Hide until hydration on mobile (to prevent flash of unstyled content of desktop render)
   */
  :host(:not([data-layout])) {
    display: none;
  }

  :host(:not([data-prevent-animations])) [popover]:popover-open {
    @starting-style {
      translate: var(--_width) 0;
    }
  }

  :host(:not([data-prevent-animations])) [popover]:popover-open {
    translate: 0 0;
  }

  :host(:not([data-prevent-animations])) [popover] {
    transition:
      translate calc(var(--_anim-factor) * var(--_anim-speed)) ease-out,
      overlay calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete,
      display calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete;
    translate: calc(-1 * var(--_width)) 0;
  }

  [data-level='1'][popover]::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  /* ----------------------------
   * part: root
   */

  @media (prefers-reduced-motion) {
    :host {
      --_anim-factor: 0;
    }
  }

  :host {
    --_width: 400px;
    --_bg-color: white;
    --_anim-factor: 1;
    --_anim-speed: 0.25s;
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

  [data-part='level'][data-level='0'] {
    position: fixed;
    background: var(--_bg-color);
  }

  [data-part='l1-invoker'] {
    padding: var(--size-2);
  }

  [data-part='level'][data-level='1'] {
    height: 100%;
    width: var(--_width);
    position: fixed;
  }

  [data-part='level']:not([data-level='0']) {
    left: 0;
    top: 0;
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

  [data-part='anchor'],
  [data-part='invoker-for-level'],
  [data-part='level-back-btn'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: inherit;
    text-decoration: inherit;
    font-size: 0.875rem;
    fill: #666666;
    gap: var(--size-2);
  }

  [data-part='anchor']:hover,
  [data-part='invoker-for-level']:hover,
  [data-part='level-back-btn']:hover {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }

  [data-part='level-back-btn'] {
    display: flex;
    padding: var(--size-6);
    font-size: 0.875rem;
    width: 100%;
  }

  [data-part='icon'] {
    display: block;
    width: var(--size-5);
    height: var(--size-5);
  }

  [data-part='logo'] {
    display: none;
  }
`;

UIMainNav.provideDesign({
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
    sharedGlobalStyle,
    resetPopoverStyle,
    visibilityStyle,
    scrollLockStyle,
    css`
      :host([data-layout-cloak]) {
        visibility: hidden;
      }

      [data-part='root'] {
        color: var(--text-secondary);
      }

      [data-part='icon'] {
        width: 1.25rem;
        height: 1.25rem;
        display: block;
      }

      [data-part='icon'] svg {
        width: 100%;
        height: 100%;
        /* fill: currentColor; */
        stroke: currentColor;
      }

      [data-part='command-invoker']:hover,
      [data-part='level-invoker']:hover,
      [data-part='anchor']:hover {
        color: var(--secondary-text);
        text-decoration: none;
      }

      [data-part='anchor'][data-level='1'][aria-current='page'] {
        color: var(--highlight-color);
        font-weight: 500;
      }

      [data-part='anchor'][data-level='1'][aria-current='page']:hover {
        color: var(--highlight-color);
      }

      [data-part='icon'][data-level='1'] + span {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      [data-part='command-invoker'],
      [data-part='level-invoker'],
      [data-part='anchor'] {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 1rem;
      }

      [data-part='command-invoker'][data-level='1'],
      [data-part='level-invoker'][data-level='1'],
      [data-part='anchor'][data-level='1'] {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
        font-weight: 400;
        border-radius: 0;
        margin: 0;
        white-space: nowrap;
        height: auto;
        border: none;
        background: transparent;
        cursor: pointer;
        transition: color 0.2s ease;
        box-sizing: border-box;
        line-height: 1.5;
        text-transform: capitalize;
      }

      [data-part='list'] {
        list-style: none;
        display: flex;
        gap: 2rem;
        margin: 0;
      }
    `,
  ],
  /**
   * For mobile and desktop, we use the same templates, but different styles.
   * The configuration for rendering our templates differs.
   */
  dynamicLayouts: () => ({
    mobile: {
      styles: [
        css`
          [data-part='list'] {
            flex-direction: column;
          }

          [data-level][data-open] {
            background-color: black;
            position: fixed;
            height: 100vh;
            padding: 4rem;
          }
        `,
      ],
      breakpoint: '0px',
      container: globalThis,
      templateContextProcessor: context => {
        const navData = {
          ...context.data.navData,
          hideToggle: false,
          shouldHandleScrollLock: true,
        };
        context.fns.updateNavData(navData, { shouldReset: true });
        context.fns.closeMenu({ shouldPreventAnimations: true });
        return {
          ...context,
          data: { ...context.data, navData },
        };
      },
    },
    desktop: {
      styles: [
        css`
          [data-part='root'] {
            color: var(--text-secondary);
          }

          [data-part='level'][data-level='1'] {
            display: flex;
          }

          [data-part='list'] {
            list-style: none;
            display: flex;
            gap: 2rem;
            margin: 0;
          }

          [data-part='anchor'][aria-current='page'] {
            color: var(--highlight-color);
          }
        `,
      ],
      breakpoint: '1024px',
      container: globalThis,
      templateContextProcessor: (/** @type {{ data: { navData: any; }; }} */ context) => ({
        ...context,
        data: {
          ...context.data,
          navData: {
            ...context.data.navData,
            hideToggle: true,
            shouldHandleScrollLock: false,
          },
        },
      }),
    },
  }),
});
