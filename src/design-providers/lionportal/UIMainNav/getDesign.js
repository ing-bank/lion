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

export function getDesignForUIMainNav() {
  return {
    styles: () => [sharedGlobalStyle, visibilityStyle, resetPopoverStyle, resetButtonStyle],
    templates: existingTemplates => ({
      ...existingTemplates,
      icon(context, { item, level }) {
        const { part } = context;
        return item?.iconId
          ? html`<lion-icon ${part('icon', { item, level })}></lion-icon>`
          : nothing;
      },
    }),
    scopedElements: existingScopedElements => ({
      ...existingScopedElements,
      'lion-icon': LionIcon,
    }),
    dynamicLayouts: () => ({
      mobile: {
        styles: [mobileStyle],
        breakpoint: '0px',
        container: globalThis,
        templateContext: context => {
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
  };
}
