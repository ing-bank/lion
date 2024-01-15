import { html, nothing } from 'lit';
import style from './style.css.js';
import pageContentStyle from './pageContentStyle.css.js';

import { visibilityStyle } from '../../../components/shared/styles.js';
import globalCarbonStyle from '../shared/style.global.css.js';

export function getDesignForUIPageLayout() {
  return {
    styles: () => [globalCarbonStyle, visibilityStyle, style],
    lightStyles: () => [pageContentStyle],
    templates: existingTemplates => ({
      ...existingTemplates,
      utilsBottom(context) {
        const { part } = context;

        return html`<div ${part('utils-bottom')} class="Utils-module--container--9e8a4">
          <a
            ${part('back-to-top-link')}
            class="BackToTopBtn-module--button--12d77"
            aria-label="${context.data.backToTopLinkText}"
          >
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              fill="currentColor"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16 14L6 24 7.4 25.4 16 16.8 24.6 25.4 26 24zM4 8H28V10H4z"></path>
            </svg>
          </a>
        </div>`;
      },
      skipLink(context) {
        const { translations, part } = context;

        return html`
          <a
            class="cds--skip-to-content Header-module--skip-to-content--2b66e"
            ${part('skip-link')}
          >
            ${translations?.skipToMainContent}
          </a>
        `;
      },
      // headerItems(context) {
      //   const { part } = context;

      //   return html`
      //     <div ${part('header-items')}>
      //       <a class="Header-module--headerName--d3517" href="/"><slot name="logo"></slot></a>
      //     </div>
      //   `;
      // },
    }),
  };
}
