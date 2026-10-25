import { LitElement, html, nothing, css } from 'lit';
import { sharedGlobalStyle } from './shared/styles.js';

const tagName = 'ui-portal-inpage-nav';

export class UIPortalInpageNav extends LitElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
  };

  static styles = [
    sharedGlobalStyle,
    css`
      @media (max-width: 899px) {
        :host {
          display: none;
        }
      }

      [data-part='nav'] {
        position: sticky;
        top: 20px;
        margin-left: 20px;
        margin-top: 6rem;
        display: block;
      }

      [data-part='list'] {
        list-style-type: none;
        margin: 0;
        padding: 0 0 0 20px;
        border-left: 1px solid var(--primary-lines-color);
      }

      [data-part='anchor'] {
        color: inherit;
        text-decoration: inherit;
        font-size: 14px;
      }

      [data-part='anchor']:hover {
        text-decoration: underline;
      }

      h4 {
        font-weight: normal;
      }
    `,
  ];

  constructor() {
    super();
    this.navData = [];
  }

  // connectedCallback() {
  //   super.connectedCallback();

  //   if (window) {
  //     // only on the client
  //     window.setTimeout(() => {
  //       // remove the second navigation
  //       // its rendered twice due to lack of lit/ssr
  //       // https://github.com/lit/lit/issues/4472
  //       const $navs = (this.renderRoot || this.shadowRoot).querySelectorAll('[data-part="nav"]');
  //       if ($navs.length > 1) {
  //         $navs[1].remove();
  //       }
  //     });
  //   }
  // }

  render() {
    return html`
      <nav data-part="nav" aria-labelledby="inpage-nav-title">
        <h4 id="inpage-nav-title">Contents</h4>
        ${this._renderNavLevel({ children: this.navData })}
      </nav>
    `;
  }

  _renderNavLevel({ children, level = 0 }) {
    return html`
      <ul data-part="list" data-level="${level}">
        ${children.map(
          item =>
            html`<li data-part="listitem">
              <a data-part="anchor" data-level="${level}" href="#${item.url}">${item.name}</a>
              ${item.children?.length
                ? this._renderNavLevel({ children: item.children, level: level + 1 })
                : nothing}
            </li>`,
        )}
      </ul>
    `;
  }
}

customElements.define(tagName, UIPortalInpageNav);
