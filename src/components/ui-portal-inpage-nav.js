import { LitElement, html, nothing, css } from 'lit';
const tagName = 'ui-portal-inpage-nav';

function scrollInView(event) {
  const link = event.currentTarget;
  const id = (link?.hash || '').substr(1);
  const isFragment = link?.hasAttribute('href') && link?.getAttribute('href').startsWith('#');

  if (!link || !isFragment) {
    return;
  }

  // Scroll to the top
  if (link.hash === '') {
    event.preventDefault();
    window.scroll({ top: 0, behavior: 'smooth' });
    history.pushState(undefined, undefined, location.pathname);
  }

  // Scroll to an id
  if (id) {
    const target = document.getElementById(id);

    if (target) {
      event.preventDefault();
      window.scroll({ top: target.offsetTop, behavior: 'smooth' });
      history.pushState(undefined, undefined, `#${id}`);
    }
  }
}

export class UIPortalInpageNav extends LitElement {
  static properties = {
    navData: { type: Array, attribute: 'nav-data' },
  };

  static styles = [
    css`
      [data-part='nav'] {
        top: 0;
        position: sticky;
        padding-top: var(--size-9);
        margin-right: var(--size-9);
        margin-left: var(--size-9);
      }

      [data-part='list'] {
        list-style-type: none;
        margin: 0;
        padding: 0;
      }

      [data-part='anchor'] {
        color: inherit;
        text-decoration: inherit;
        font-size: 12px;
      }

      [data-part='anchor'][data-level='0'] {
        font-weight: bold;
      }

      [data-part='list'][data-level='1'] {
        margin-left: var(--size-1);
      }
    `,
  ];

  constructor() {
    super();
    this.navData = [];
  }

  render() {
    return html` <nav data-part="nav">${this._renderNavLevel({ children: this.navData })}</nav> `;
  }

  _renderNavLevel({ children, level = 0 }) {
    return html`<ul data-part="list" data-level="${level}">
      ${children.map(
        item =>
          html`<li data-part="listitem">
            <a data-part="anchor" data-level="${level}" @click="${scrollInView}" href="${item.url}"
              >${item.name}</a
            >
            ${item.children?.length
              ? this._renderNavLevel({ children: item.children, level: level + 1 })
              : nothing}
          </li>`,
      )}
    </ul>`;
  }
}

customElements.define(tagName, UIPortalInpageNav);
