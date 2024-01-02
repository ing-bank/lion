import { html, nothing, css, isServer } from 'lit';
import { LionIcon, icons as iconManager } from '@lion/ui/icon.js';
import { UIBaseElement } from '../shared/UIBaseElement.js';
import { updateNavData } from './updateNavData.js';
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
// This needs to be kept in client somehow when not imported via litel
// import './lionportal-UIMainNav-provider/lionportal-UIMainNav-provider.js';
import { designManager } from '../shared/designManager.js';

// function getIconIds(navData) {
//   const iconIds = [];
//   for (const item of navData?.items || []) {
//     if (item.iconId) {
//       iconIds.push(item.iconId);
//     }
//     if (item.iconActiveId) {
//       iconIds.push(item.iconActiveId);
//     }
//     if (item.nextLevel) {
//       iconIds.push(...getIconIds(item.nextLevel));
//     }
//   }
//   return iconIds;
// }

export class UIMainNavPartDirective extends UIPartDirective {
  setup(part, [context, name, localContext]) {
    const ctor = this.constructor;
    switch (name) {
      case 'root':
        ctor._setupRoot(part, { context, localContext });
        break;
      case 'nav':
        ctor._setupNav(part, { context, localContext });
        break;
      case 'l1-invoker':
        ctor._setupL1Invoker(part, { context, localContext });
        break;
      case 'level':
        ctor._setupLevel(part, { context, localContext });
        break;
      case 'level-back-btn':
        ctor._setupLevelBackBtn(part, { context, localContext });
        break;
      case 'list':
        ctor._setupList(part, { context, localContext });
        break;
      case 'listitem':
        ctor._setupListitem(part, { context, localContext });
        break;
      case 'anchor':
        ctor._setupAnchor(part, { context, localContext });
        break;
      case 'invoker-for-level':
        ctor._setupInvokerForLevel(part, { context, localContext });
        break;
      case 'icon':
        ctor._setupIcon(part, { context, localContext });
        break;
    }
  }

  update(part, [context, name, localContext]) {
    super.update(part, [context, name, localContext]);
    const ctor = this.constructor;
    switch (name) {
      case 'root':
        ctor._updateRoot(part, { context, localContext });
        break;
      case 'l1-invoker':
        ctor._updateL1Invoker(part, { context, localContext });
        break;
      case 'listitem':
        ctor._updateListItem(part, { context, localContext });
        break;
      case 'icon':
        ctor._updateIcon(part, { context, localContext });
        break;
    }
  }

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
    return Array.from(host.__controllers)?.find(ctrl => ctrl.invoker === invoker);
  }

  static _setupRoot({ element }, { context }) {
    element.setAttribute('data-part', 'root');
    context.registerRef('root', element);
  }

  static _updateRoot({ element }, { context }) {
    if (context.data.hasL1Open) {
      element.setAttribute('data-has-l1-open', '');
    } else {
      element.removeAttribute?.('data-has-l1-open');
    }
  }

  static _setupNav({ element }, { context }) {
    assertNav(element);
    element.setAttribute('data-part', 'nav');
    context.registerRef('nav', element);
  }

  static _setupL1Invoker({ element }, { context }) {
    assertButton(element);
    element.setAttribute('data-part', 'l1-invoker');
    element.setAttribute('aria-label', context.translations.l1Invoker);
    context.registerRef('l1-invoker', element);
  }

  static _updateL1Invoker({ element, options }, { context, localContext }) {
    if (localContext.levelConfig.hideToggle) {
      element.setAttribute('hidden', '');
      if (!isServer) {
        const toggleCtrl = this.getVisibilityToggleCtrlForInvoker({
          host: options.host,
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

  static _setupLevel({ element, options }, { context, localContext }) {
    const { level, isToggleTarget, levelConfig } = localContext;

    this.setLevel(element, level);
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

  static _setupLevelBackBtn({ element }, { context, localContext }) {
    assertButton(element);
    this.setLevel(element, localContext.level);
    element.setAttribute('data-part', 'level-back-btn');
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
    element.setAttribute('data-part', 'invoker-for-level');
    element.setAttribute('popovertarget', `level-${localContext.level + 1}`);
    element.setAttribute('type', 'button');
    context.registerRef(`invoker-for-level-l${localContext.level + 1}`, element);
    if (isServer) return;

    // For invokers >= l1 we want to set them to get `active` state.
    element.addEventListener('click', async event => {
      const isLeftMouseClick = event.button === 0;
      if (!isLeftMouseClick) return;
      // Every state update should change navData and trigger a re-render
      updateNavData(context.data.navData, {
        // activePath: localContext.item.nextLevel.items[0].url,
        acitiveItem: localContext.item,
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
}

/**
 * @typedef {{name: string; url: string; active?:boolean; iconId?: string; items?: NavItemData[]}} NavItem
 */
export class UIMainNav extends UIBaseElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
  };

  static _partDirective = UIMainNavPartDirective;

  constructor() {
    super();
    /**
     * @type {NavLevel}
     */
    this.navData = [];
    this._iconSvgs = {};
  }

  /**
   * What data do we feed to our templates?
   */
  get templateContext() {
    return {
      ...super.templateContext,
      data: {
        navData: this.navData,
        iconIdL1Invoker: 'lion:portal:menu',
        iconSvgs: this._iconSvgs,
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
          for (const ctrl of Array.from(this.__controllers || [])) {
            if (ctrl instanceof VisibilityToggleCtrl) {
              ctrl.hide();
            }
          }
          if (shouldPreventAnimations) {
            this.removeAttribute('data-prevent-animations');
          }
        },
        updateNavData: updateNavData,
      },
    };
  }

  /**
   *
   */
  static templates = {
    main(context) {
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
    navLevel0(context, { levelConfig }) {
      const { data, part, templates } = context;

      return html`<div ${part('level', { level: 0 })}>
        <slot name="level-0-before"></slot>
        <button ${part('l1-invoker', { levelConfig })}>
          ${templates.icon(context, { level: 0, item: { iconId: data.iconIdL1Invoker } })}
        </button>
        <slot name="level-0-after"></slot>
      </div>`;
    },
    icon() {
      // Should be implemented in extension layer in opinionated way (like via LionIcon)
      // By default, we don't use web component composition, to allow for ssr renderable markup (scoped elements not supported yet)
      return nothing;
    },
  };

  static styles = [sharedGlobalStyles, visibilityStyles, resetPopoverStyles, resetButtonStyles];
}
// export const tagName = 'ui-main-nav';

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
//       const { data, templates, part } = context;

//       return html`
//         <div ${part('root')}>
//           <nav ${part('nav')}>
//             ${templates.level0?.(context, { levelConfig: data.navData })}
//             ${templates.navLevel(context, {
//               levelConfig: data.navData,
//               level: 1,
//               isToggleTarget: true,
//             })}
//           </nav>
//         </div>
//       `;
//     },
//     navLevel(context, { levelConfig, level, isToggleTarget, hasActiveChild }) {
//       const { templates, part, translations } = context;
//       const hasBackButton = isToggleTarget && level > 1;

//       return html`<div ${part('level', { levelConfig, level, isToggleTarget, hasActiveChild })}>
//         ${hasBackButton
//           ? html`<button ${part('level-back-btn', { level })}>
//               ${templates.icon(context, { item: { iconId: 'lion:portal:chevronLeft' }, level: 0 })}
//               ${translations.levelBackBtn}
//             </button>`
//           : nothing}
//         <ul ${part('list', { level })}>
//           ${levelConfig.items.map(
//             item => html`<li ${part('listitem', { item, level })}>
//               ${templates.navItem(context, { item, level })}
//               ${item.nextLevel
//                 ? templates.navLevel(context, {
//                     levelConfig: item.nextLevel,
//                     level: level + 1,
//                     hasActiveChild: item.hasActiveChild,
//                     isToggleTarget: !item.url,
//                   })
//                 : nothing}
//             </li>`,
//           )}
//         </ul>
//       </div>`;
//     },
//     navItem(context, { item, level }) {
//       const { part, templates } = context;

//       if (item.url) {
//         return html`<a ${part('anchor', { item, level })}
//           >${templates.icon(context, { item, level })}<span>${item.name}</span>
//         </a>`;
//       }

//       return html`<button ${part('invoker-for-level', { item, level })}>
//         ${templates.icon(context, { item, level })}<span>${item.name}</span>
//       </button>`;
//     },
//     level0(context, { levelConfig }) {
//       const { data, part, templates } = context;

//       return html`<div ${part('level', { level: 0 })}>
//         <slot name="level-0-before"></slot>
//         <button ${part('l1-invoker', { levelConfig })}>
//           ${templates.icon(context, { level: 0, item: { iconId: data.iconIdL1Invoker } })}
//         </button>
//         <slot name="level-0-after"></slot>
//       </div>`;
//     },
//     icon(context, { item, level }) {
//       const { part } = context;

//       return item?.iconId
//         ? html`<lion-icon ${part('icon', { item, level })}></lion-icon>`
//         : nothing;
//     },
//   }),
//   scopedElements: () => ({
//     'lion-icon': LionIcon,
//   }),
// };

// This seems to be the only way to make it compatible with lit astro integration atm
// UIMainNav.provideDesign(designManager.getDesignFor('UIMainNav'));

// customElements.define(tagName, UIMainNav);
