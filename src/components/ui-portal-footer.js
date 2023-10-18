// eslint-disable-next-line import/no-extraneous-dependencies
import { LitElement, html, nothing, css } from 'lit';

const tagName = 'ui-portal-footer';

export class UIPortalFooter extends LitElement {
  static properties = {
    footerData: { type: Array, attribute: 'footer-data' },
  };

  static styles = [
    css`
      footer > ul {
        display: flex;
        gap: 8em;
      }
    `,
  ];

  constructor() {
    super();
    this.footerData = [];
  }

  render() {
    return html` <footer>${this._renderNavLevel({ children: this.footerData })}</footer> `;
  }

  _renderNavLevel({ children }) {
    return html`<ul>
      ${children.map(
        item => html`<li>
          <a href="${item.url}">${item.name}</a>
          ${item.children?.length ? this._renderNavLevel({ children: item.children }) : nothing}
        </li>`,
      )}
    </ul>`;
  }
}

customElements.define(tagName, UIPortalFooter);
