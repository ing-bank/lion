import { LitElement, css, html } from '@lion/core';

export class LionBreadcrumb extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --lion-breadcrumb-separator: '/';
        }

        nav.breadcrumb ol {
          margin: 0;
          padding-left: 0;
          list-style: none;
        }

        nav.breadcrumb li {
          display: inline;
        }

        nav.breadcrumb li + li::before {
          display: inline-block;
          margin: 0 0.25em;
          height: 0.8em;
          content: var(--lion-breadcrumb-separator);
        }

        nav.breadcrumb [aria-current='page'] {
          text-decoration: none;
        }
      `,
    ];
  }

  render() {
    return html`
      <nav aria-label="Breadcrumb" class="breadcrumb">
        <ol>
          ${Array.from(this.children).map((child, i, row) => {
            if (i + 1 === row.length && child.getAttribute('href')) {
              child.setAttribute('aria-current', 'page');
            }
            return html`<li>${child}</li>`;
          })}
        </ol>
      </nav>
    `;
  }
}
