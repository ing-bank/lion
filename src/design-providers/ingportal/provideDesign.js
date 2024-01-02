import { html, nothing } from 'lit';
import { LionIcon } from '@lion/ui/icon.js';
import mobileStyles from './styles/mobile.css.js';
import desktopStyles from './styles/desktop.css.js';
import { addIconResolverForPortal } from './iconset-portal/addIconResolverForPortal.js';
import { UIMainNav } from '../../components/UIMainNav/UIMainNav.js';

export function provideDesign() {
  addIconResolverForPortal();

  UIMainNav.provideDesign({
    templates: existingTemplates => ({
      ...existingTemplates,
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
    dynamicLayouts: () => ({
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
          updateNavData(navData, { shouldReset: true });
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
}
