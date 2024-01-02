import { html, nothing, css, isServer } from 'lit';
import { UIBaseElement } from '../shared/UIBaseElement.js';

// export const tagName = 'ui-page-layout';
export class UIPageLayout extends UIBaseElement {
  static templates = {
    main(context) {
      return html`
        <div class="ui-portal-grid">
          <div class="ui-portal-grid__nav">
            <header>
              <slot name="main-nav"></slot>
            </header>
          </div>
          <main class="ui-portal-grid__main">
            <div class="ui-portal-container">
              <slot></slot>
            </div>
          </main>
          <div class="ui-portal-grid__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      `;
    },
  };
  // static styles = [
  //   css`
  //     /* Improve Page speed */
  //     /* https://css-tricks.com/almanac/properties/c/content-visibility/ */
  //     img {
  //       content-visibility: auto;
  //     }

  //     .ui-portal-grid {
  //       display: grid;
  //       grid-template-columns: min-content 1fr;
  //       /* grid-template-rows: 80vh 20vh; */
  //       grid-template-areas:
  //         'nav main'
  //         'nav footer';
  //     }
  //     .ui-portal-grid__nav {
  //       grid-area: nav;
  //     }
  //     .ui-portal-grid__main {
  //       grid-area: main;
  //     }
  //     .ui-portal-grid__footer {
  //       grid-area: footer;
  //     }
  //     .ui-portal-collection {
  //       display: grid;
  //       grid-template-columns: repeat(auto-fit, minmax(200px, 300px));
  //     }
  //     .ui-portal-card {
  //       display: flex;
  //       flex-direction: column;
  //       padding: 1rem;
  //       border-radius: 0.5rem;
  //     }
  //     .ui-portal-container {
  //       padding: var(--size-6);
  //     }
  //   `,
  // ];
}
// UIPageLayout.provideDesign(designManager.getDesignFor('UIPageLayout'));

// customElements.define(tagName, UIPageLayout);
