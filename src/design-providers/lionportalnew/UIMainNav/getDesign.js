import { html, nothing } from 'lit';
import { LionIcon } from '@lion/ui/icon.js';
import mobileStyle from './style.mobile.css.js';
import desktopStyle from './style.desktop.css.js';
import {
  sharedGlobalStyle,
  visibilityStyle,
  resetPopoverStyle,
  resetButtonStyle,
} from '../../../components/shared/styles.js';
import logoSvg from '../assets/logo.svg.js';

export function getDesignForUIMainNav() {
  return {
    styles: () => [sharedGlobalStyle, visibilityStyle, resetPopoverStyle, resetButtonStyle],
    /**
     * We override the icon template, as we want to use LionIcon
     */
    templates: existingTemplates => ({
      ...existingTemplates,
      root(context) {
        const { data, templates, part } = context;

        return html`
          <div ${part('root')}>
            <nav ${part('nav')}>
              <div data-part="l0-and-1-wrapper">
                ${templates.navLevel0?.(context, { levelConfig: data.navData })}
                ${templates.navLevel(context, {
                  levelConfig: data.navData,
                  level: 1,
                  isToggleTarget: true,
                })}
              </div>
            </nav>
          </div>
        `;
      },
      navLevel0(context, { levelConfig }) {
        const { data, part, templates } = context;

        return html`<div ${part('level', { level: 0 })}>
          <button ${part('l1-invoker', { levelConfig })}>
            ${templates.icon(context, { level: 0, item: { iconId: data.iconIdL1Invoker } })}
          </button>
          <a data-part="logo" href="/">${logoSvg}</a>
        </div>`;
      },
      navItem(context, { item, level }) {
        const { part, templates } = context;
  
        if (item.url) {
          return html`<a ${part('anchor', { item, level })}><span>${item.name}</span>
          </a>`;
        }
  
        return html`<button ${part('invoker-for-level', { item, level })}>
          <span>${item.name}</span>
        </button>`;
      },
      icon(context, { item, level }) {
        const { part } = context;
        return item?.iconId
          ? html`<lion-icon ${part('icon', { item, level })}></lion-icon>`
          : nothing;
      },
    }),
    /**
     * We need to make sure that LionIcon is available in the scoped registry
     */
    scopedElements: () => ({
      'lion-icon': LionIcon,
    }),
    /**
     * For mobile and desktop, we use the same templates, but different styles.
     * The configuration for rendering our templates differs.
     */
    dynamicLayouts: () => ({
      mobile: {
        styles: [mobileStyle],
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
        styles: [desktopStyle],
        breakpoint: '1024px',
        container: globalThis,
        templateContextProcessor: context => ({
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
  };
}
