// eslint-disable-next-line import/no-extraneous-dependencies
import { LitElement, html, nothing } from 'lit';

const tagName = 'ui-portal-main-nav';

// TODO: apply https://web.dev/website-navigation/ (aria-current="page" etc.)

export class UiPortalMainNav extends LitElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
  };

  constructor() {
    super();
    this.navData = [];
  }

  render() {
    return html` <nav>${this._renderNavLevel({ children: this.navData })}</nav> `;
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

customElements.define(tagName, UiPortalMainNav);