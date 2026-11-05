import { LionPagination } from '@lion/ui/pagination.js';
import { runPaginationSuite } from '@lion/ui/pagination-test-suites.js';
import { expect, fixture, waitUntil } from '@open-wc/testing';
import { html } from 'lit';

class DeferredLinkPagination extends LionPagination {
  /** @param {import('lit').PropertyValues} changedProperties */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.shadowRoot?.addEventListener(
      'click',
      event => {
        const button = event.target;
        if (button instanceof HTMLButtonElement && button.hasAttribute('aria-current')) {
          event.preventDefault();
          event.stopPropagation();
          const page = Number(button.textContent?.trim());
          setTimeout(() => this.goto(page));
        }
      },
      { capture: true },
    );
  }

  /**
   * @param {string} label
   * @param {number} pageNumber
   * @param {string} [namespace]
   * @returns {import('lit').TemplateResult}
   */
  _prevNextButtonTemplate(label, pageNumber, namespace = 'lion') {
    return html`
      <li>
        <a
          href="#page-${pageNumber}"
          aria-label=${this.msgLit(`${namespace}-pagination:${label}`)}
          @click=${(/** @type {MouseEvent} */ event) => {
            event.preventDefault();
            setTimeout(() => this.goto(pageNumber));
          }}
        >
          ${this._prevNextIconTemplate(label)}
        </a>
      </li>
    `;
  }
}

customElements.define('deferred-link-pagination', DeferredLinkPagination);

describe('pagination suite with deferred link navigation', () => {
  it('updates current only after the link click handler yields', async () => {
    const el = /** @type {DeferredLinkPagination} */ (
      await fixture(
        html`<deferred-link-pagination count="6" current="2"></deferred-link-pagination>`,
      )
    );
    const link = /** @type {HTMLAnchorElement} */ (el.shadowRoot?.querySelector('a'));
    link.click();
    expect(el.current).to.equal(2);
    await waitUntil(() => el.current === 1);
    expect(el.current).to.equal(1);
  });

  runPaginationSuite({ classes: { host: DeferredLinkPagination } });
});
