import { html, nothing, css, isServer } from 'lit';
import { LionIcon } from '@lion/ui/icon.js';
import { UIBaseElement } from '../shared/UIBaseElement.js';
import { VisibilityToggleCtrl } from '../shared/VisibilityToggleCtrl.js';
import { UIPartDirective } from '../shared/UIPartDirective.js';
import {
  sharedGlobalStyles,
  visibilityStyles,
  resetPopoverStyles,
  resetButtonStyles,
} from '../shared/styles.js';
import {
  assertNav,
  assertList,
  assertListItem,
  assertAnchor,
  assertButton,
  assertLionIcon,
} from '../shared/element-assertions.js';
import { addIconResolverForPortal } from '../iconset-portal/addIconResolverForPortal.js';

addIconResolverForPortal();

export function initNavData(navData, { activePath, activeItem, shouldReset = false } = {}) {
  const parents = new WeakMap();
  let shouldLookForReset = shouldReset;
  // False when activePath or activeItem is provided
  let hasActiveSet = !activePath && !activeItem;
  // We will use this as a helper to prevent that we're resetting parents when we're not supposed to
  let newActiveItem = null;
  let lastParent = null;

  const handleParents = (navItem, { action }) => {
    const parent = parents.get(navItem);
    if (parent) {
      if (action === 'activate') {
        parent.hasActiveChild = true;
      } else if (action === 'reset') {
        delete parent.hasActiveChild;
        // In case we're resetting, we don't want to reset the parent of the new active item
        if (newActiveItem === parent) return;
      } else {
        throw new Error(`[UIPortalMainNav]: Unknown action ${action}`);
      }
      handleParents(parent, { action });
    }
  };

  const loopLvl = level => {
    for (const navItem of level.items) {
      parents.set(navItem, lastParent);
      if (shouldLookForReset && navItem.active) {
        delete navItem.active;
        handleParents(navItem, { action: 'reset' });
        shouldLookForReset = false;
      }
      if ((activePath && navItem.url === activePath) || (activeItem && navItem === activeItem)) {
        navItem.active = true;
        handleParents(navItem, { action: 'activate' });
        hasActiveSet = true;
        newActiveItem = navItem;
      }
      if (hasActiveSet && !shouldLookForReset) {
        break;
      }
      if (navItem.nextLevel) {
        lastParent = navItem;
        loopLvl(navItem.nextLevel);
      }
    }
  };

  loopLvl(navData);
}

export class UIPortalMainNavPartDirective extends UIPartDirective {
  setup(part, [context, name, localContext]) {
    switch (name) {
      case 'root':
        this._setupRoot(part, { context, localContext });
        break;
      case 'nav':
        this._setupNav(part, { context, localContext });
        break;
      case 'l1-invoker':
        this._setupL1Invoker(part, { context, localContext });
        break;
      case 'level':
        this._setupLevel(part, { context, localContext });
        break;
      case 'level-back-btn':
        this._setupLevelBackBtn(part, { context, localContext });
        break;
      case 'list':
        this._setupList(part, { context, localContext });
        break;
      case 'listitem':
        this._setupListitem(part, { context, localContext });
        break;
      case 'anchor':
        this._setupAnchor(part, { context, localContext });
        break;
      case 'invoker-for-level':
        this._setupInvokerForLevel(part, { context, localContext });
        break;
      case 'icon':
        this._setupIcon(part, { context, localContext });
        break;
    }
  }

  update(part, [context, name, localContext]) {
    super.update(part, [context, name, localContext]);
    switch (name) {
      case 'root':
        this._updateRoot(part, { context, localContext });
        break;
      case 'l1-invoker':
        this._updateL1Invoker(part, { context, localContext });
        break;

      // case 'level':
      //   this._updateLevel(part, { context, localContext });
      //   break;

      case 'listitem':
        this._updateListItem(part, { context, localContext });
        break;
      case 'icon':
        this._updateIcon(part, { context, localContext });
        break;
    }
  }

  static setLevel(element, level) {
    if (typeof level !== 'number') {
      throw new Error('[UIPortalMainNavPartDirective]: Please provide a level in localContext');
    }
    element.setAttribute('data-level', level);
  }

  /**
   * Since l1-toggle can be dynamically rendered, we need to check it its toggle controller
   * is already registered when the l1-invoker becomes available. (for instance when switching from desktop to mobile)
   */
  static getVisibilityToggleCtrlForInvoker({ invoker, host }) {
    return Array.from(host.__controllers)?.find(ctrl => ctrl.invoker === invoker);
  }

  _setupRoot({ element }, { context }) {
    element.setAttribute('data-part', 'root');
    context.registerRef('root', element);
  }

  _updateRoot({ element }, { context }) {
    if (context.data.hasL1Open) {
      element.setAttribute('data-has-l1-open', '');
    } else {
      element.removeAttribute?.('data-has-l1-open');
    }
  }

  _setupNav({ element }, { context }) {
    assertNav(element);
    element.setAttribute('data-part', 'nav');
    context.registerRef('nav', element);
  }

  // TODO: merge with all invokers....
  _setupL1Invoker({ element, options }, { context, localContext }) {
    assertButton(element);
    element.setAttribute('data-part', 'l1-invoker');
    // element.setAttribute('popovertarget', 'level-1');
    element.setAttribute('aria-label', context.translations.l1Invoker);
    context.registerRef('l1-invoker', element);

    // if (isServer) return;

    // const { level } = localContext;

    // // In case we have l1 rendered on layout switch, make sure a controller is assigned
    // const target = context.refs[level === 1 ? 'l1-invoker' : `invoker-for-level-l${level}`];
    // const targetWasAlreadyRendered = Boolean(target);
    // const hasCtrl = this.constructor.getVisibilityToggleCtrlForInvoker({
    //   invoker: element,
    //   host: options.host,
    // });
    // if (targetWasAlreadyRendered && !hasCtrl) {
    //   new VisibilityToggleCtrl(options.host, {
    //     invoker: element,
    //     target,
    //     level: 1,
    //     visuallyHidden: true,
    //     mode: 'popover',
    //     initialOpen: false,
    //   });
    // }

    // TODO: implement cleanups of controllers on disconnect of PartDirective (and host)
  }

  // TODO: merge with all invokers....
  _updateL1Invoker({ element, options }, { context, localContext }) {
    if (localContext.levelConfig.hideToggle) {
      element.setAttribute('hidden', '');
      if (!isServer) {
        const toggleCtrl = this.constructor.getVisibilityToggleCtrlForInvoker({
          host: this.host,
          invoker: element,
        });
        toggleCtrl?.teardown();
      }
    } else {
      element.removeAttribute?.('hidden');
      const target = context.refs['level-1'];
      if (!target) return;
      new VisibilityToggleCtrl(options.host, {
        invoker: element,
        target,
        level: 1,
        mode: 'popover',
        initialOpen: false,
        visuallyHidden: true,
        shouldHandleScrollLock: localContext.levelConfig.shouldHandleScrollLock,
      });
    }
  }

  _setupLevel({ element, options }, { context, localContext }) {
    const { level, isToggleTarget, levelConfig } = localContext;

    this.constructor.setLevel(element, level);
    element.setAttribute('data-part', 'level');
    element.setAttribute('id', `level-${level}`);
    context.registerRef(`level-${level}`, element);

    const { showVia = 'disclosure', initialOpen, visuallyHidden = true } = levelConfig || {};

    // Toggles consist of invoker/target pairs. We get the already registered invoker here
    const invoker = context.refs[level === 1 ? 'l1-invoker' : `invoker-for-level-l${level}`];
    if (!(isToggleTarget && invoker)) return;

    if (localContext.levelConfig.hideToggle) {
      return;
    }

    if (level === 1) {
      new VisibilityToggleCtrl(options.host, {
        invoker,
        target: element,
        level: 1,
        visuallyHidden: true,
        mode: 'popover',
        initialOpen: false,
      });
    } else {
      new VisibilityToggleCtrl(options.host, {
        invoker,
        target: element,
        level,
        visuallyHidden,
        mode: showVia,
        initialOpen,
      });
    }
  }

  // _updateLevel({ element, options }, { context, localContext }) {
  //   // // TODO: maybe we should get element.contains(element.getRootNode().activeElement)
  //   // // context.setSrVisibilityForLevel({ element, hasActiveChild, isFocused: false });
  //   // if (localContext.level <= 1) return;
  //   // if (!localContext.hasActiveChild) {
  //   //   element.setAttribute('data-visually-hidden', '');
  //   // } else {
  //   //   element.removeAttribute?.('data-visually-hidden', '');
  //   // }
  // }

  _setupLevelBackBtn({ element }, { context, localContext }) {
    assertButton(element);
    this.constructor.setLevel(element, localContext.level);
    element.setAttribute('data-part', 'level-back-btn');
    element.setAttribute('type', 'button');
    if (isServer) return;
    element.addEventListener('click', ({}) => {
      element.parentElement.hidePopover();
    });
    context.registerRef(`level-back-btn-l${localContext.level}`, element);
  }

  _setupList({ element }, { context, localContext }) {
    element.setAttribute('role', 'list');
    assertList(element);
    element.setAttribute('data-part', 'list');
    context.registerRef(`list-${localContext.level}`, element);
  }

  _setupListitem({ element }, { context, localContext }) {
    assertListItem(element);
    element.setAttribute('data-part', 'listitem');
    context.registerRef(`list-item-l${localContext.level}`, element, { isPartOfCollection: true });
  }

  _updateListItem({ element }, { context, localContext }) {
    if (localContext.item.active) {
      element.setAttribute('data-active', '');
    }
    if (localContext.item.hasActiveChild) {
      element.setAttribute('data-has-active-child', '');
    }
  }

  _setupAnchor({ element }, { context, localContext }) {
    this.constructor.setLevel(element, localContext.level);
    assertAnchor(element);
    element.setAttribute('data-part', 'anchor');
    element.setAttribute('href', localContext.item.url);
    context.registerRef(`anchor-l${localContext.level}`, element, { isPartOfCollection: true });
    if (localContext.item.active) {
      element.setAttribute('aria-current', 'page');
    }
    if (isServer) return;

    // element.addEventListener('focus', () => {
    //   // Every state update should change navData and trigger a re-render
    //   initNavData(context.data.navData, localContext.item.url, { shouldReset: true });
    //   setTimeout(() => {
    //     context.set('navData', context.data.navData);
    //     context.set('hasL1Open', hasL1Open(context.data.navData));
    //   }, 100);
    // });
  }

  _setupInvokerForLevel({ element }, { context, localContext }) {
    assertButton(element);
    this.constructor.setLevel(element, localContext.level);
    element.setAttribute('data-part', 'invoker-for-level');
    element.setAttribute('popovertarget', `level-${localContext.level + 1}`);
    element.setAttribute('type', 'button');
    context.registerRef(`invoker-for-level-l${localContext.level + 1}`, element);
    if (isServer) return;

    // For invokers >= l1 we want to set them to get `active` state.
    element.addEventListener('click', async event => {
      // Every state update should change navData and trigger a re-render
      initNavData(context.data.navData, {
        // activePath: localContext.item.nextLevel.items[0].url,
        acitiveItem: localContext.item,
        shouldReset: true,
      });

      event.stopPropagation();
      await context.host.updateComplete;
      // context.set('navData', context.data.navData);
    });
  }

  _setupIcon({ element }, { context, localContext }) {
    this.constructor.setLevel(element, localContext.level);
    assertLionIcon(element);
    element.setAttribute('data-part', 'icon');
    context.registerRef(`icon-l${localContext.level}`, element);
  }

  _updateIcon({ element }, { localContext: { item } }) {
    element.setAttribute(
      'icon-id',
      item.active || item.hasActiveChild ? item.iconActiveId || item.iconId : item.iconId,
    );
  }
}

// TODO: apply https://web.dev/website-navigation/ (aria-current="page" etc.)

/**
 * @typedef {{name: string; url: string; active?:boolean; iconId?: string; items?: NavItemData[]}} NavItem
 */
export class UIPortalMainNav extends UIBaseElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
  };

  static _partDirective = UIPortalMainNavPartDirective;

  constructor() {
    super();
    /**
     * @type {NavLevel}
     */
    this.navData = [];
  }

  get templateContext() {
    return {
      ...super.templateContext,
      data: {
        navData: this.navData,
        iconIdL1Invoker: 'lion:portal:menu',
      },
      translations: { l1Invoker: 'Open main menu', levelBackBtn: 'Back' },
      closeMenu: ({ shouldPreventAnimations }) => {
        if (shouldPreventAnimations) {
          this.setAttribute('data-prevent-animations', '');
        }
        for (const ctrl of Array.from(this.__controllers)) {
          if (ctrl instanceof VisibilityToggleCtrl) {
            ctrl.hide();
          }
        }
        if (shouldPreventAnimations) {
          this.removeAttribute('data-prevent-animations');
        }
      },
      host: this,
    };
  }
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
      const { data, templates, part } = context;

      return html`
        <div ${part('root')}>
          <nav ${part('nav')}>
            ${templates.level0?.(context, { levelConfig: data.navData })}
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

      return html`<div ${part('level', { levelConfig, level, isToggleTarget, hasActiveChild })}>
        ${hasBackButton
          ? html`<button ${part('level-back-btn', { level })}>
              ${templates.icon(context, { item: { iconId: 'lion:portal:chevronLeft' }, level: 0 })}
              ${translations.levelBackBtn}
            </button>`
          : nothing}
        <ul ${part('list', { level })}>
          ${levelConfig.items.map(
            item => html`<li ${part('listitem', { item, level })}>
              ${templates.navItem(context, { item, level })}
              ${item.nextLevel
                ? templates.navLevel(context, {
                    levelConfig: item.nextLevel,
                    level: level + 1,
                    hasActiveChild: item.hasActiveChild,
                    isToggleTarget: !item.url,
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
        return html`<a ${part('anchor', { item, level })}
          >${templates.icon(context, { item, level })}<span>${item.name}</span>
        </a>`;
      }

      return html`<button ${part('invoker-for-level', { item, level })}>
        ${templates.icon(context, { item, level })}<span>${item.name}</span>
      </button>`;
    },
    level0(context, { levelConfig }) {
      const { data, part, templates } = context;

      return html`<div ${part('level', { level: 0 })}>
        <slot name="level-0-before"></slot>
        <button ${part('l1-invoker', { levelConfig })}>
          ${templates.icon(context, { level: 0, item: { iconId: data.iconIdL1Invoker } })}
        </button>
        <slot name="level-0-after"></slot>
      </div>`;
    },
    icon(context, { item, level }) {
      const { part } = context;

      return item?.iconId
        ? html`<lion-icon ${part('icon', { item, level })}></lion-icon>`
        : nothing;
    },
  }),
  scopedElements: () => ({
    'lion-icon': LionIcon,
  }),
};

/**
 * Multiple columns, no l1 toggle
 */
const desktopStyles = css`
  /** on larger screens, we don't want a back button */
  [data-part='level-back-btn'] {
    display: none;
  }

  [popovertarget='level-1'] {
    display: none;
  }

  [data-part='l1-invoker'] {
    height: 100%;
  }

  [data-part='root'] {
    --_width-l0: var(--size-11);
    --_width-l1: var(--size-13);
    height: 100vh;
    /** Make this the positioning parent of l0 and l1 */
    position: relative;
    width: var(--_width-l0);
    display: block;
    position: sticky;
    top: 0;
  }

  [data-part='root']:has([data-open][data-level]) {
    width: calc(var(--_width-l0) + var(--_width-l1));
  }

  [data-part='nav'] {
    height: 100%;
  }

  [data-part='l1-wrapper'] {
    height: 100%;
  }

  [data-part='level'] {
    overflow: scroll;
  }

  [data-part='level'][data-level='1'] {
    padding-top: var(--size-6);
    width: var(--_width-l0);
    height: 100%;
    border-right: 1px solid #ccc;
  }

  [data-part='level'][data-level='2'] {
    padding-top: var(--size-6);
    width: var(--_width-l1);
    left: var(--_width-l0);
    top: 0;
    padding-inline: var(--size-6);
    border-right: 1px solid #ccc;
    height: 100%;
  }

  [data-part='level'][data-level='3'] {
    position: relative;
    background-color: transparent;
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
  [data-part='invoker-for-level'][data-level='1'] {
    display: flex;
    flex-direction: column;
    align-items: center;
    /** buttons are not full width with display:flex */
    width: 100%;
  }

  [data-part='anchor'],
  [data-part='invoker-for-level'] {
    color: inherit;
    text-decoration: inherit;
    font-size: 14px;
    fill: #666666;
  }

  [data-part='anchor']:hover,
  [data-part='invoker-for-level']:hover {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }
`;

const mobileStyles = css`
  :host(:not([data-prevent-animations])) [popover]:popover-open {
    @starting-style {
      translate: var(--_width) 0;
    }
  }

  :host(:not([data-prevent-animations])) [popover]:popover-open {
    translate: 0 0;
  }

  :host(:not([data-prevent-animations])) [popover] {
    transition: translate 0.25s ease-out, overlay 0.25s ease-out allow-discrete,
      display 0.25s ease-out allow-discrete;
    translate: calc(-1 * var(--_width)) 0;
  }

  [data-level='1'][popover]::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  /* ----------------------------
   * part: root
   */

  [data-part='root'] {
    --_width: 400px;
    --_bg-color: white;
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
    /* position: fixed; */
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
`;

UIPortalMainNav.provideStylesAndMarkup({
  markup: baseUINavMarkup,
  styles: () => [sharedGlobalStyles, visibilityStyles, resetPopoverStyles, resetButtonStyles],
  layouts: () => ({
    mobile: {
      styles: mobileStyles,
      breakpoint: '0px',
      container: globalThis,
      templateContext: context => {
        const navData = {
          ...context.data.navData,
          hideToggle: false,
          shouldHandleScrollLock: true,
        };
        initNavData(navData, { shouldReset: true });
        context.closeMenu({ shouldPreventAnimations: true });
        return {
          ...context,
          data: { ...context.data, navData },
        };
      },
    },
    desktop: {
      styles: desktopStyles,
      breakpoint: '1024px',
      container: globalThis,
      templateContext: context => ({
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

customElements.define(tagName, UIPortalMainNav);
