import { html, nothing, css } from 'lit';
import {
  sharedGlobalStyle,
  visibilityStyle,
  resetPopoverStyle,
  resetButtonStyle,
} from '../../../components/shared/styles.js';
import globalCarbonStyle from '../shared/style.global.css.js';

export function getDesignForUIMainNav() {
  return {
    styles: () => [
      sharedGlobalStyle,
      visibilityStyle,
      resetPopoverStyle,
      resetButtonStyle,
      globalCarbonStyle,
      // overrides to make it compatible with lion
      css`
        /* We use our own (accessible) show/hide mechanism */
        .cds--side-nav__menu {
          max-block-size: none;
          visibility: visible;
        }

        .cds--side-nav__submenu-title,
        .cds--side-nav__link-text {
          text-transform: capitalize;
        }

        [data-part='l0-before'],
        [data-part='l0-after'],
        [data-part='l0-before'] ::slotted(*),
        [data-part='l0-after'] ::slotted(*) {
          align-items: center;
          border-top: 1px solid #0000;
          color: #fff;
          display: flex;
          font-size: var(--cds-body-short-02-font-size, 1rem);
          font-weight: var(--cds-body-short-02-font-weight, 400);
          height: 3rem;
          left: 3rem;
          letter-spacing: var(--cds-body-short-02-letter-spacing, 0);
          line-height: var(--cds-body-short-02-line-height, 1.375);
          /* padding: 0 1rem; */
          text-decoration: none;
          transition: opacity 0.11s cubic-bezier(0.5, 0, 0.1, 1);
          white-space: nowrap;
          z-index: 3;
        }

        @media (min-width: 66rem) {
          [data-part='l0-before'],
          [data-part='l0-after'],
          [data-part='l0-before'] ::slotted(*),
          [data-part='l0-after'] ::slotted(*) {
            left: 0;
            max-width: 384px;
          }
        }

        [data-part='level'][data-level='0'] {
          gap: 1rem;
          text-transform: capitalize;
          background-color: #161616;
          border-bottom: 1px solid #393939;
          position: fixed;
          height: 48px;
          top: 0;
          width: 100vw;
          color: #fff;
          display: flex;
          align-items: center;
        }
      `,
    ],
    templates: () => ({
      root(context) {
        const { part, templates, data } = context;
        // Notice we got rid of tabindex="-1" and aria-label, because a11y will be handled by lion
        // Presentation however is done via all classes
        return html`<nav
          ${part('nav')}
          class="cds--side-nav__navigation LeftNav-module--side-nav--white--647c8 cds--side-nav cds--side-nav--expanded cds--side-nav--ux"
        >
          ${templates.navLevel0?.(context, { levelConfig: data.navData })}
          ${templates.navLevel(context, {
            levelConfig: data.navData,
            level: 1,
            isToggleTarget: true,
          })}
        </nav>`;
      },
      navLevel(context, localContext) {
        const { templates, part, translations } = context;
        const { levelConfig, level, isToggleTarget, hasActiveChild } = localContext;

        // Since the default navData is configured as popover, we override the VisibilityToggleCtrl cfg here....
        levelConfig.showVia = 'disclosure';

        // Sadly, class attribute can't be hydrated when it has dynamic content, so we, do .className
        return html` <div ${part('level', localContext)}>
          <ul
            ${part('list', { level })}
            .className="${level === 1
              ? 'cds--side-nav__items sidenav-list'
              : 'cds--side-nav__menu'}"
          >
            ${levelConfig.items.map(
              item => html`<li
                ${part('listitem', { item, level })}
                .className="${level === 1 ? 'cds--side-nav__item' : 'cds--side-nav__menu-item'}"
              >
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
          return html`<a ${part('anchor', { item, level })} class="cds--side-nav__link"
            ><span class="cds--side-nav__link-text">${item.name}</span>
          </a>`;
        }

        return html`<button
          ${part('invoker-for-level', { item, level })}
          class="cds--side-nav__submenu"
        >
          <span class="cds--side-nav__submenu-title">${item.name}</span> ${templates._chevron(
            context,
          )}
        </button>`;
      },
      navLevel0(context, { levelConfig }) {
        const { data, part, templates } = context;

        return html`<div ${part('level', { level: 0 })}>
          <div data-part="l0-before"><slot name="l0-before"></slot></div>

          <button
            ${part('l1-invoker', { levelConfig })}
            class="cds--header__action--menu Header-module--header-button--7135b cds--header__action cds--header__menu-trigger cds--header__menu-toggle cds--header__menu-toggle__hidden"
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              fill="currentColor"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 14.8H18V16H2zM2 11.2H18V12.399999999999999H2zM2 7.6H18V8.799999999999999H2zM2 4H18V5.2H2z"
              ></path>
            </svg>
          </button>

          <div data-part="l0-after"><slot name="l0-after"></slot></div>
        </div>`;
      },
      _chevron(context) {
        return html`<div
          class="cds--side-nav__icon cds--side-nav__icon--small cds--side-nav__submenu-chevron"
        >
          <svg
            focusable="false"
            preserveAspectRatio="xMidYMid meet"
            fill="currentColor"
            width="20"
            height="20"
            viewBox="0 0 32 32"
            aria-hidden="true"
            xmlns="http:www.w3.org/2000/svg"
          >
            <path d="M16 22L6 12 7.4 10.6 16 19.2 24.6 10.6 26 12z"></path>
          </svg>
        </div>`;
      },
    }),
    // dynamicLayouts: () => ({
    //   mobile: {
    //     breakpoint: '0px',
    //     container: globalThis,
    //     templateContextProcessor: context => {
    //       const navData = {
    //         ...context.data.navData,
    //         hideToggle: false,
    //         shouldHandleScrollLock: true,
    //       };
    //       context.fns.updateNavData(navData, { shouldReset: true });
    //       context.fns.closeMenu({ shouldPreventAnimations: true });
    //       return {
    //         ...context,
    //         data: { ...context.data, navData },
    //       };
    //     },
    //   },
    //   desktop: {
    //     breakpoint: '1024px',
    //     container: globalThis,
    //     templateContextProcessor: context => ({
    //       ...context,
    //       data: {
    //         ...context.data,
    //         navData: {
    //           ...context.data.navData,
    //           hideToggle: false,
    //         },
    //       },
    //     }),
    //   },
    // }),
  };
}
