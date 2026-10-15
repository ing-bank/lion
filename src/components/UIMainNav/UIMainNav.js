/* eslint-disable no-new */
/* eslint-disable max-classes-per-file */
import { html, nothing, css, isServer } from 'lit';
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

/**
 * @typedef {import('lit').ElementPart} ElementPart
 * @typedef {import('lit').TemplateResult} TemplateResult
 * @typedef {import('../shared/UIBaseElementTypes.js').TemplateContext} TemplateContext
 */

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

  /*
   * No entries for the section items: the menu is label-only, and `templates.icon` renders nothing
   * for an id that is not in this map, so those rows carry no icon node at all - nothing is rendered
   * and then hidden in CSS. Search and GitHub keep theirs: those two icons carry meaning instead of
   * repeating the label next to them.
   */

  // GitHub SVG template literal
  'lion:portal:github': html`
    <svg
      width="20"
      height="20"
      viewBox="-1.5 -1.5 27 27"
      data-filled="true"
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
    /**
     * @param {ElementPart} litPart
     */
    nav: ({ element }) => {
      assertNav(element);
    },
    /**
     * @param {ElementPart} litPart
     * @param {{ context: TemplateContext, localContext: any }} param1
     */
    'l1-invoker': ({ element, options }, { context, localContext }) => {
      assertButton(element);
      element.setAttribute('aria-label', context.translations.l1Invoker);
    },
    /**
     * @param {ElementPart} litPart
     * @param {{ context: TemplateContext, localContext: any }} param1
     */
    level: ({ element, options }, { context, localContext }) => {
      const { level, isToggleTarget, levelConfig } = localContext;

      UIMainNavPartDirective.setLevel(element, level);
      // `level-2` alone collides: every item that has children renders a level 2 panel, and a
      // popovertarget can only address one id. levelConfig.key (set when the tree is built) makes
      // both the panel id and its invoker's popovertarget unique per parent.
      const levelId = levelConfig?.key ? `level-${level}-${levelConfig.key}` : `level-${level}`;
      element.setAttribute('id', levelId);
      context.registerRef(levelId, element);

      const { showVia = 'disclosure', initialOpen, visuallyHidden = false } = levelConfig || {};

      /*
       * The invoker is looked up through onRegisterRef, not read once: a panel's setup runs a single
       * time and the invoker for it can be registered on a later render (the mobile layout re-renders
       * the tree from its templateContextProcessor), in which case reading `refs` here returned
       * undefined and the panel kept its early return forever - clicking a section then opened
       * nothing (measured: no data-open, no aria-expanded on the top level invokers).
       *
       * The key carries the level's own key as well: every item with children renders a level 2 panel,
       * and a shared `level-invoker-l2` name meant each panel bound to whichever invoker registered
       * last. Same reason the panel id is keyed.
       */
      const invokerKey =
        level === 1
          ? 'l1-invoker'
          : `level-invoker-l${level}${levelConfig?.key ? `-${levelConfig.key}` : ''}`;

      // levelConfig is undefined for the level 0 wrapper the burger lives in.
      if (!isToggleTarget || levelConfig?.hideToggle) return;

      const attachToggle = invoker => {
        if (!invoker) return;

        if (level === 1) {
          new VisibilityToggleCtrl(options?.host, {
            visuallyHidden: false,
            initialOpen: false,
            target: element,
            mode: 'popover',
            invoker,
            level: 1,
          });
          return;
        }

        new VisibilityToggleCtrl(options?.host, {
          target: element,
          visuallyHidden,
          mode: showVia,
          initialOpen,
          invoker,
          level,
        });
      };

      if (context.refs[invokerKey]) {
        attachToggle(context.refs[invokerKey]);
      } else {
        context.onRegisterRef(invokerKey, attachToggle);
      }
    },
    /**
     * @param {ElementPart} litPart
     * @param {{ context: TemplateContext, localContext: any }} param1
     */
    'level-back-btn': ({ element }, { context, localContext }) => {
      assertButton(element);
      UIMainNavPartDirective.setLevel(element, localContext.level);
      element.setAttribute('type', 'button');
      if (isServer) return;

      element.addEventListener('click', ({}) => {
        element.parentElement?.hidePopover();
      });
      context.registerRef(`level-back-btn-l${localContext.level}`, element);
    },
    /**
     * @param {ElementPart} litPart
     * @param {{ context: TemplateContext, localContext: any }} param1
     */
    list: ({ element }, { context, localContext }) => {
      element.setAttribute('role', 'list');
      assertList(element);

      UIMainNavPartDirective.setLevel(element, localContext.level);

      // element.setAttribute('data-part', 'list');
      context.registerRef(`list-${localContext.level}`, element);
    },
    /**
     * @param {ElementPart} litPart
     * @param {{ context: TemplateContext, localContext: any }} param1
     */
    listitem: ({ element }, { context, localContext }) => {
      assertListItem(element);
      element.setAttribute('data-part', 'listitem');
      UIMainNavPartDirective.setLevel(element, localContext.level);
      context.registerRef(`listitem-l${localContext.level}`, element, { isPartOfCollection: true });
    },
    /**
     * @param {ElementPart} litPart
     * @param {{ context: TemplateContext, localContext: any }} param1
     */
    anchor: ({ element }, { context, localContext }) => {
      UIMainNavPartDirective.setLevel(element, localContext.level);
      assertAnchor(element);
      element.setAttribute('data-part', 'anchor');
      // The "overview" entry a top level row moves into its level (see toNavLevels in TopNav.astro).
      if (localContext.item?.overview) {
        element.setAttribute('data-overview', '');
      }
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
    },
    'level-invoker': ({ element }, { context, localContext }) => {
      assertButton(element);
      UIMainNavPartDirective.setLevel(element, localContext.level);
      element.setAttribute('data-part', 'level-invoker');
      /*
       * One invoker per parent, so the ref key carries the level's own key: every item with children
       * renders a level 2 panel, and a single shared `level-invoker-l2` ref meant each panel bound to
       * whichever invoker happened to register last - clicking a section then toggled nothing at all
       * (measured: no data-open after a click on "components"). Same reason the panel id is keyed.
       */
      const targetKey = localContext.item?.nextLevel?.key;
      const levelKey = targetKey ? `-${targetKey}` : '';
      // popovertarget only when the level opens as a popover: in the default disclosure mode the
      // element is not a popover, so the attribute would address nothing.
      if (localContext.item?.nextLevel?.showVia === 'popover') {
        element.setAttribute('popovertarget', `level-${localContext.level + 1}${levelKey}`);
      }
      element.setAttribute('type', 'button');
      if (localContext.item?.name) {
        element.setAttribute('aria-label', `Show ${localContext.item.name}`);
      }
      context.registerRef(`level-invoker-l${localContext.level + 1}${levelKey}`, element);
      if (isServer) return;

      element.addEventListener('click', async event => {
        const isLeftMouseClick = event.button === 0;
        if (!isLeftMouseClick) return;
        updateNavData(context.data.navData, {
          activeItem: localContext.item,
          shouldReset: true,
        });
        event.stopPropagation();
      });
    },
    'command-invoker': ({ element, options }, { localContext }) => {
      assertButton(element);
      UIMainNavPartDirective.setLevel(element, localContext.level);
      if (isServer) return;

      element.addEventListener('click', () => {
        options.host.dispatchEvent(new CustomEvent(localContext.item.command));
      });
    },
    icon: ({ element }, { context, localContext }) => {
      UIMainNavPartDirective.setLevel(element, localContext.level);
      element.setAttribute('data-part', 'icon');
      context.registerRef(`icon-l${localContext.level}`, element);
    },
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

  static _updateListItem({ element }, { localContext }) {
    if (localContext.item.active) {
      element.setAttribute('data-active', '');
    }
    if (localContext.item.hasActiveChild) {
      element.setAttribute('data-has-active-child', '');
    }
  }

  static _updateIcon({ element }, { localContext: { item } }) {
    element.setAttribute(
      'icon-id',
      item.active || item.hasActiveChild ? item.iconActiveId || item.iconId : item.iconId,
    );
  }
}

/**
 * @typedef {{name: string; url: string; active?:boolean; iconId?: string; items?: NavItemData[]}} NavItem
 */
export class UIMainNav extends UIBaseElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
  };

  _partDirective = UIMainNavPartDirective;

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
    /**
     * @param {TemplateContext} context
     * @returns {TemplateResult}
     */
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
    /**
     * @param {TemplateContext} context
     * @param {{ levelConfig: NavLevel, level: number, isToggleTarget: boolean, hasActiveChild: boolean }} param1
     * @returns {TemplateResult}
     */
    navLevel(context, { levelConfig, level, isToggleTarget, hasActiveChild }) {
      const { templates, part, translations } = context;
      // Only a level that *replaces* the previous one needs a way back. Inline levels expand
      // downward, so the expander itself is the way back and the button would be noise.
      const hasBackButton = isToggleTarget && level > 1 && levelConfig?.showVia === 'popover';

      return html`<!-- -->
        <div ${part('level', { levelConfig, level, isToggleTarget, hasActiveChild })}>
          ${hasBackButton
            ? html`<!-- -->
                <button ${part('level-back-btn', { level })}>
                  <span data-part="back-chevron" aria-hidden="true"></span>
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
                          // An item may be both a link and a parent (the portal's top level items
                          // are): the panel is a popover either way, so the link keeps working and
                          // the chevron next to it expands the level.
                          isToggleTarget: true,
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

      if (item.url && item.nextLevel) {
        // Link + expander: the anchor navigates to the section, the button reveals its levels. The
        // chevron itself is drawn by the stylesheet (::after), so this stays icon-free.
        return html`<!-- -->
          <a ${part('anchor', { item, level })}>
            ${templates.icon(context, { item, level })}<span>${item.name}</span>
          </a>
          <button ${part('level-invoker', { item, level })}></button>`;
      }

      if (item.url) {
        // N.B. taken care of by directive
        // eslint-disable-next-line lit-a11y/anchor-is-valid
        return html`<!-- -->
          <a ${part('anchor', { item, level })}>
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

UIMainNav.provideDesign({
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

      /*
       * The burger is the mobile counterpart of the theme switch labels: the same 32px box, the same
       * circle and the same hover treatment, so the two controls read as one group on the right of
       * the bar instead of a small icon pressed against the switch. Measured before: the burger box
       * was 20x26 and its left edge sat exactly on the switch's right edge (0px apart).
       */
      [data-part='l1-invoker'] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        /* border-box: the global reset in styles.css does not reach into the shadow root, so without
         * this the 1px border made the burger 34px against the switch labels' 32px. */
        box-sizing: border-box;
        width: 2rem;
        height: 2rem;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 50%;
        background: transparent;
        color: var(--text-secondary);
        cursor: pointer;
        transition:
          color 0.2s,
          background-color 0.2s;
      }

      [data-part='l1-invoker']:hover {
        color: var(--text-primary);
        background: var(--overlay-subtle);
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

      /*
       * A filled glyph must not be stroked: the rule above doubles the ink of a solid path, which
       * measured 24 x 23.4 inside the 24 x 24 viewBox - about 17% larger than the stroked icons next
       * to it, so the octocat read as oddly scaled. Its viewBox carries the optical margin instead.
       */
      [data-part='icon'] svg[data-filled] {
        stroke: none;
      }

      [data-part='command-invoker']:hover,
      [data-part='level-invoker']:hover,
      [data-part='anchor']:hover {
        color: var(--secondary-text);
        text-decoration: none;
      }

      [data-part='anchor'][data-level='1'][aria-current='page'],
      [data-part='anchor'][data-level='1'][aria-current='page']:hover {
        /* Outline treatment: the accent cannot be the ink on a light surface, so the current page
         * is marked by a yellow outline around readable text. */
        color: var(--accent-on-surface);
        outline: 2px solid var(--accent-yellow);
        outline-offset: 2px;
        border-radius: 4px;
        font-weight: 500;
      }

      /*
       * The burger is mirrored. Its three lines are drawn 24, 16 and 22 units long, all anchored to
       * the left edge, so the original leans left; flipping it horizontally puts the longest line at
       * the outer edge of the bar.
       */
      [data-part='l1-invoker'] [data-part='icon'] {
        transform: scaleX(-1);
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
   * The configuration for rendering our templates differs as well.
   */
  dynamicLayouts: () => ({
    mobile: {
      styles: [
        css`
          /* :host {
            --_width: 400px;
            --_bg-color: transparent;
            --_anim-factor: 1;
            --_anim-speed: 0.25s;
            --_anim-delay: 0.05s;
          }

          [data-level='1'][popover]::backdrop {
            background: rgba(0, 0, 0, 0.5);
          }

          @media (prefers-reduced-motion) {
            :host {
              --_anim-factor: 0;
            }
          }

          :host(:not([data-prevent-animations])) [popover]:popover-open {
            @starting-style {
              translate: var(--_width) 0;
              opacity: 0;
            }
          }

          :host(:not([data-prevent-animations])) [popover]:popover-open {
            translate: 0 0;
            opacity: 1;
          }

          :host(:not([data-prevent-animations])) [popover]:popover-open::backdrop {
            opacity: 1;
          }

          :host(:not([data-prevent-animations])) [popover] {
            transition:
              translate calc(var(--_anim-factor) * var(--_anim-speed)) ease-out,
              opacity calc(var(--_anim-factor) * var(--_anim-speed)) ease-out,
              overlay calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete,
              display calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete;
            transition-delay: calc(var(--_anim-factor) * var(--_anim-delay));
            translate: calc(-1 * var(--_width)) 0;
            opacity: 0;
          }

          :host(:not([data-prevent-animations])) [popover]::backdrop {
            @starting-style {
              opacity: 0;
            }

            transition: opacity calc(var(--_anim-factor) * var(--_anim-speed)) ease-out
              allow-discrete;
            transition-delay: calc(var(--_anim-factor) * var(--_anim-delay));
            opacity: 0;
          }
          */

          /*
           * Spacing: one rhythm for the whole fly-out. The rows are 0.25rem apart, the row itself
           * carries its padding (0.6rem 0.75rem) and bleeds 0.75rem into the panel's own 1.5rem
           * padding, so the label stays on the 24px gutter while a hover or current state covers the
           * full width of the panel instead of only the text.
           */
          [data-part='list'] {
            flex-direction: column;
            /* The UA gives a <ul> padding-inline-start: 40px, which held the fly-out items 40px away
             * from the panel edge (measured: items at x=104 with a 64px panel padding, i.e. the text
             * sat too close to the 283px panel's right edge). */
            padding: 0;
            gap: 0.25rem;
          }

          /*
           * Full bleed, once: the top-level row spans the panel edge to edge, so a hover or current
           * state covers the whole width instead of stopping at the gutter, and its own padding keeps
           * the label on the 24px line.
           *
           * Only level 1 carries the negative margin. A deeper row lives inside a level that is
           * already edge to edge, so bleeding it again added another 24px per level - measured row
           * widths 367, 415 and 463px inside a 320px panel, with the rows starting 24, 48 and 72px
           * left of the panel. Deeper rows bleed nothing and take their indent from their padding.
           */
          [data-part='listitem'] {
            border-radius: 8px;
          }

          [data-part='listitem'][data-level='1'] {
            margin-inline: -1.5rem;
          }

          /*
           * The "overview" entry: the section's own page, which the toggle above it moved down here.
           * It is a label for the level rather than one more item, so it reads like a muted
           * small-caps heading and carries its own space below - the level's items start after it.
           */
          [data-part='anchor'][data-overview] {
            color: var(--text-secondary);
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          [data-part='listitem']:has(> [data-part='anchor'][data-overview]) {
            margin-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-color);
          }

          /* A collapsed branch that holds the current page: the toggle carries the accent, because the
           * current entry itself is a level down and out of sight. */
          [data-part='listitem'][data-has-active-child] > [data-part='level-invoker'] {
            color: var(--accent-on-surface);
          }

          [data-part='listitem'] > [data-part='anchor'],
          [data-part='listitem'] > [data-part='command-invoker'],
          [data-part='listitem'] > [data-part='level-invoker'] {
            padding: 0.6rem 1.5rem;
            border-radius: 8px;
          }

          /* The selection states are the row's, not the text's: hover, focus and the current page
           * fill the whole width between the panel's gutters. */
          [data-part='listitem']:hover,
          [data-part='listitem']:focus-within {
            background-color: var(--overlay-subtle);
          }

          /*
           * The row that holds the current page: an item with its own page reports it on the anchor
           * (aria-current), a top-level row that is now a toggle carries data-active from the nav data
           * instead.
           */
          [data-part='listitem']:has(> [data-part='anchor'][aria-current='page']),
          [data-part='listitem'][data-active] {
            background-color: color-mix(in srgb, var(--accent-yellow) 16%, transparent);
            box-shadow: inset 3px 0 0 0 var(--accent-yellow);
          }

          [data-part='listitem']:has(> [data-part='anchor'][aria-current='page'])
            > [data-part='anchor'] {
            box-shadow: none;
            outline: none;
            text-decoration: none;
            font-weight: 600;
          }

          /*
           * Fly-out animation: a fade with a small scale, not a slide. The panel is anchored to the
           * left edge, so it settles from 0.97 into place from that edge (transform-origin) instead of
           * travelling sideways - a slide out of an off-screen edge left nothing to see while the
           * backdrop faded, and the reverse read as a jump rather than a recede.
           *
           * The two states each declare their own transition, which is what lets the panel recede
           * faster than it arrives: the closing animation is the one on the *closed* rule, the opening
           * one lives on :popover-open.
           */
          :host {
            --_flyout-duration-in: 0.24s;
            --_flyout-duration-out: 0.22s;
            --_flyout-ease-in: cubic-bezier(0.2, 0, 0.2, 1);
            --_flyout-ease-out: cubic-bezier(0.2, 0, 0.2, 1);
            /* Only the entry moves: coming in the panel settles out of the edge (0.97 -> 1). Going
             * out it is a plain fade - scale 1, so the exit is opacity and nothing else. */
            --_flyout-scale-in: 0.97;
            --_flyout-scale-out: 1;
          }

          @media (prefers-reduced-motion: reduce) {
            :host {
              --_flyout-duration-in: 0.01s;
              --_flyout-duration-out: 0.01s;
              --_flyout-scale-in: 1;
              --_flyout-scale-out: 1;
            }
          }

          :host(:not([data-prevent-animations])) [popover] {
            transition:
              opacity var(--_flyout-duration-out) var(--_flyout-ease-out),
              scale var(--_flyout-duration-out) var(--_flyout-ease-out),
              overlay var(--_flyout-duration-out) allow-discrete,
              display var(--_flyout-duration-out) allow-discrete;
            opacity: 0;
            scale: var(--_flyout-scale-out);
          }

          :host(:not([data-prevent-animations])) [popover]:popover-open {
            transition:
              opacity var(--_flyout-duration-in) var(--_flyout-ease-in),
              scale var(--_flyout-duration-in) var(--_flyout-ease-in),
              overlay var(--_flyout-duration-in) allow-discrete,
              display var(--_flyout-duration-in) allow-discrete;
            /* The panel grows out of the edge it is attached to. */
            transform-origin: left center;
            opacity: 1;
            scale: 1;

            @starting-style {
              opacity: 0;
              scale: var(--_flyout-scale-in);
            }
          }

          [popover]::backdrop {
            background: light-dark(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.5));
            opacity: 0;
            transition: opacity var(--_flyout-duration-out) var(--_flyout-ease-out) allow-discrete;

            @starting-style {
              opacity: 0;
            }
          }

          [popover]:popover-open::backdrop {
            opacity: 1;
          }

          [data-level='1'][data-open] {
            /*
             * Was background-color: black — the dark theme's surface spelled as a colour literal:
             * in light mode the fly-out stayed black while its own ink stayed dark, so the panel
             * rendered dark-on-dark (panel colour rgb(0,0,0) on rgb(0,0,0) = 1.00:1, its links
             * rgb(90,90,90) on rgb(0,0,0) = 3.04:1, both below AA).
             */
            background-color: var(--bg-color);
            color: var(--text-primary);
            border-right: 1px solid var(--border-color);
            position: fixed;
            height: 100vh;
            /* Was content-sized (163px) and then min-width 15rem; a drawer reads better at a fixed
             * share of the viewport, capped so it does not swallow a tablet screen. */
            width: min(20rem, 88vw);
            padding: 2rem 1.5rem;
            overflow-y: auto;
          }

          /*
           * Levels deeper than the first unfold *downward*, in place: no extra panel, no scroll
           * jump, no covering the parent. Level 0 (the hamburger's own wrapper) and level 1 (the
           * fly-out) must stay out of this: level 0 is not a panel and went invisible (opacity 0)
           * when these rules caught it. Closed, a level carries the hidden attribute, so the
           * opening is a
           * grid-rows transition from 0fr, which is the one way to animate to an unknown height.
           */
          [data-part='level']:not([data-level='0']):not([data-level='1']) {
            display: grid;
            grid-template-rows: 0fr;
            position: static;
            width: auto;
            height: auto;
            padding: 0;
            border: none;
            background: none;
            overflow: hidden;
            opacity: 0;
            transition:
              grid-template-rows var(--_flyout-duration-in) var(--_flyout-ease-in),
              opacity var(--_flyout-duration-in) var(--_flyout-ease-in),
              display var(--_flyout-duration-in) var(--_flyout-ease-in) allow-discrete;
          }

          [data-part='level']:not([data-level='0']):not([data-level='1'])[data-open] {
            grid-template-rows: 1fr;
            opacity: 1;

            @starting-style {
              grid-template-rows: 0fr;
              opacity: 0;
            }
          }

          /* The grid row needs to be allowed to be shorter than its content. */
          [data-part='level']:not([data-level='0']):not([data-level='1']) > [data-part='list'] {
            min-height: 0;
          }

          /*
           * Levels inside a level. The indent is *not* a padding on the nested list: the rows bleed
           * the panel's 1.5rem padding to be full width (see [data-part='listitem'] below), so
           * padding the list made every level's rows 1.25rem wider than the one above it - measured
           * 347, 375 and 403px inside a 320px panel, i.e. the deepest labels ran out of the panel.
           *
           * The list stays flush and the indent is added to the row's own padding per depth, so a
           * deeper label starts further in while every row keeps the panel's width.
           */
          [data-part='list'] [data-part='list'] {
            padding-left: 0;
            margin-top: 0.25rem;
            gap: 0.15rem;
          }

          [data-part='listitem'][data-level='2'] > [data-part='anchor'],
          [data-part='listitem'][data-level='2'] > [data-part='command-invoker'],
          [data-part='listitem'][data-level='2'] > [data-part='level-invoker'] {
            padding-left: 2.75rem;
          }

          [data-part='listitem'][data-level='3'] > [data-part='anchor'],
          [data-part='listitem'][data-level='3'] > [data-part='command-invoker'],
          [data-part='listitem'][data-level='3'] > [data-part='level-invoker'] {
            padding-left: 4rem;
          }

          [data-part='listitem'][data-level='4'] > [data-part='anchor'],
          [data-part='listitem'][data-level='4'] > [data-part='command-invoker'],
          [data-part='listitem'][data-level='4'] > [data-part='level-invoker'] {
            padding-left: 5.25rem;
          }

          [data-part='level-invoker'] {
            justify-content: flex-start;
            width: auto;
            flex: 0 0 auto;
          }

          /*
           * A row: the label (anchor or toggle button) takes the line, the expander chevron sits at
           * the end of it. Without this the empty chevron button wrapped onto its own line under
           * every item that has children.
           */
          [data-part='listitem'] {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          /* The nested level takes its own line, full width: without this it sits in the same flex
           * row as the label and squeezes the chevron away from the right edge. */
          [data-part='level']:not([data-level='0']):not([data-level='1']) {
            flex: 1 0 100%;
          }

          [data-part='listitem'] > [data-part='anchor'],
          [data-part='listitem'] > [data-part='command-invoker'],
          [data-part='listitem'] > [data-part='level-invoker'] {
            flex: 0 1 auto;
          }

          [data-part='listitem'] > [data-part='anchor'] {
            flex: 1 1 auto;
          }

          /* An item that is only a toggle (a folder without its own page) keeps the whole line. */
          [data-part='listitem']:not(:has(> [data-part='anchor'])) > [data-part='level-invoker'],
          [data-part='listitem']:not(:has(> [data-part='anchor'])) > [data-part='command-invoker'] {
            flex: 1 1 auto;
          }

          [data-part='level-invoker']::after {
            content: '';
            width: 0.45rem;
            height: 0.45rem;
            margin-left: auto;
            border-right: 1.5px solid currentColor;
            border-bottom: 1.5px solid currentColor;
            transform: rotate(-45deg);
            transition: transform var(--_flyout-duration-in) var(--_flyout-ease-in);
          }

          [data-part='listitem']:has(> [data-part='level'][data-open])
            [data-part='level-invoker']::after {
            transform: rotate(45deg);
          }

          /* The back chevron is drawn here (the portal iconset has no chevronLeft, so the button
           * used to render an empty icon slot next to its label). */
          [data-part='back-chevron'] {
            width: 0.45rem;
            height: 0.45rem;
            border-left: 1.5px solid currentColor;
            border-bottom: 1.5px solid currentColor;
            transform: rotate(45deg);
          }

          [data-part='level-back-btn'] {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            padding: 0.5rem 0;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            font: inherit;
            cursor: pointer;
            text-transform: capitalize;
          }

          [data-part='level-back-btn']:hover {
            color: var(--text-primary);
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
            color: var(--accent-on-surface);
            text-decoration: underline;
            text-decoration-color: var(--accent-yellow);
            text-decoration-thickness: 2px;
            text-underline-offset: 3px;
          }
        `,
      ],
      breakpoint: '1024px',
      container: globalThis,
      templateContextProcessor: (/** @type {{ data: { navData: any; }; }} */ context) => {
        // The desktop row is one flat line of links, so the levels are stripped here: the mobile
        // layout is the only one that renders a tree.
        const stripLevels = items =>
          items.map(({ nextLevel, ...item }) => {
            // A top-level item's own page lives as the first entry of its level (see toNavLevels in
            // TopNav.astro, which is what turns the row into a toggle in the fly-out). The desktop
            // row is a link itself, so it takes the url back.
            const [first] = nextLevel?.items ?? [];
            // `overview` is the marker TopNav puts on the entry it moved into the level.
            const withLink = first?.overview && first.url ? { ...item, url: first.url } : item;
            return withLink;
          });

        return {
          ...context,
          data: {
            ...context.data,
            navData: {
              ...context.data.navData,
              items: stripLevels(context.data.navData.items),
              hideToggle: true,
              shouldHandleScrollLock: false,
            },
          },
        };
      },
    },
  }),
});
