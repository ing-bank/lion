import { LionPagination } from '@lion/ui/pagination.js';
import { PaginationObject } from '@lion/ui/pagination-test-helpers.js';
import { runPaginationSuite } from '@lion/ui/pagination-test-suites.js';
import { html } from 'lit';

customElements.define('suite-pagination-button', class extends HTMLElement {});

class SuitePagination extends LionPagination {
  /**
   * @param {string} label
   * @param {number} pageNumber
   * @param {string} [namespace]
   * @returns {import('lit').TemplateResult}
   */
  _prevNextButtonTemplate(label, pageNumber, namespace = 'lion') {
    return html`
      <li>
        <suite-pagination-button
          data-navigation=${label}
          aria-label=${this.msgLit(`${namespace}-pagination:${label}`)}
          @click=${() => this.goto(pageNumber)}
        >
          ${this._prevNextIconTemplate(label)}
        </suite-pagination-button>
      </li>
    `;
  }

  /**
   * @param {string} label
   * @returns {import('lit').TemplateResult}
   */
  _disabledButtonTemplate(label) {
    return html`
      <li>
        <suite-pagination-button data-navigation=${label} disabled>
          ${this._prevNextIconTemplate(label)}
        </suite-pagination-button>
      </li>
    `;
  }
}

customElements.define('suite-pagination', SuitePagination);

class SuitePaginationObject extends PaginationObject {
  get previousButtonEl() {
    return /** @type {HTMLElement} */ (
      this.el.shadowRoot?.querySelector('[data-navigation="previous"]')
    );
  }

  get nextButtonEl() {
    return /** @type {HTMLElement} */ (
      this.el.shadowRoot?.querySelector('[data-navigation="next"]')
    );
  }
}

describe('pagination suite with custom navigation elements', () => {
  runPaginationSuite({
    classes: { host: SuitePagination },
    PaginationObject: SuitePaginationObject,
  });
});
