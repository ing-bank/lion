import { html, nothing } from 'lit';
import style from './style.css.js';
import { sharedGlobalStyle, visibilityStyle } from '../../../components/shared/styles.js';

export function getDesignForUIPageLayout() {
  return {
    styles: () => [sharedGlobalStyle, visibilityStyle, style],
    templates: existingTemplates => ({
      ...existingTemplates,
      root(context) {
        const { templates, part } = context;

        return html`
          <div ${part('root')}>
            <header ${part('header')}>
              ${templates.skipLink(context)}
              <slot name="main-nav"></slot>
            </header>
            <div data-part="main-and-footer-wrapper">
              <div data-part="main-wrapper">
                <slot ${part('aside-slot')} name="aside"></slot>
                <main ${part('main')}>
                  <div data-part="container">
                    <slot></slot>
                  </div>
                </main>
              </div>
              ${templates.utilsBottom(context)}
              <footer ${part('footer')}>
                <slot name="footer"></slot>
              </footer>
            </div>
          </div>
        `;
      },
    }),
  };
}
