import { LitElement, html, nothing, css } from 'lit';

const tagName = 'ui-portal-inpage-nav';

export class UIPortalInpageNav extends LitElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
  };

  static styles = [
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
        margin-top: 100px;
      }

      [data-part='list'] {
        list-style-type: none;
        margin: 0;
        padding: 0 0 0 20px;
        border-left: #d9d9d9 solid 1px;
      }

      [data-part='anchor'] {
        color: inherit;
        text-decoration: inherit;
        font-size: 14px;
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
