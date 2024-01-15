import { html, nothing, css } from 'lit';
import { UIPartDirective } from '../shared/UIPartDirective.js';
import { UIBaseElement } from '../shared/UIBaseElement.js';

export class UIPortalFooterContent extends UIBaseElement {
  static tagName = 'ui-portal-footer-content';

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

  get templateContext() {
    return {
      ...super.templateContext,
      data: {
        footerData: this.footerData,
      },
    };
  }

  static templates = {
    root(context) {
      const { templates, data } = context;

      return html`
        <div data-part="root">${templates.navLevel(context, { children: data.footerData })}</div>
      `;
    },
    navLevel(context, { children }) {
      const { templates } = context;

      return html`<ul role="list">
        ${children.map(
          item => html`<li>
            <a href="${item.url}">${item.name}</a>
            ${item.children?.length
              ? templates.navLevel(context, { children: item.children })
              : nothing}
          </li>`,
        )}
      </ul>`;
    },
  };
}
