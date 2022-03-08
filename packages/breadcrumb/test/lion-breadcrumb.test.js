import { html, css } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import '../lion-breadcrumb.js';
import { LionBreadcrumb } from '../src/LionBreadcrumb.js';

const basicBreadcrumb = html`
  <lion-breadcrumb>
    <a href="../../">Home</a>
    <a href="../../">Menu</a>
    <a href="../">Current</a>
  </lion-breadcrumb>
`;

if (!customElements.get('custom-breadcrumb')) {
  customElements.define(
    'custom-breadcrumb',
    // @ts-ignore
    class extends LionBreadcrumb {
      static get styles() {
        return [
          ...super.styles,
          // @ts-ignore
          css`
            :host {
              --lion-breadcrumb-separator: '→';
            }
          `,
        ];
      }
    },
  );
}

const customSeparatorBreadcrumb = html`
  <custom-breadcrumb>
    <a href="../../../">Home</a>
    <a href="../../">Category</a>
    <a href="../">Sub Category</a>
    <span>Product</span>
  </custom-breadcrumb>
`;

describe('LionBreadcrumb', () => {
  it('should not render a separator for the first item', async () => {
    const el = await fixture(basicBreadcrumb);
    // @ts-ignore
    const { firstElementChild } = el.shadowRoot.querySelector('ol');

    expect(
      window.getComputedStyle(firstElementChild, '::before').getPropertyValue('content'),
    ).to.be.equal('none');
  });

  it('should be able to override the separator', async () => {
    const el = await fixture(customSeparatorBreadcrumb);
    // @ts-ignore
    const { lastElementChild } = el.shadowRoot.querySelector('ol');

    expect(
      window.getComputedStyle(lastElementChild, '::before').getPropertyValue('content'),
    ).to.be.equal('"→"');
  });

  it('should set the `aria-current="page"` to the last node anchor when `href` is passed', async () => {
    const el = await fixture(basicBreadcrumb);

    const lastChildAnchorElement =
      // @ts-ignore
      el.shadowRoot.querySelector('ol').lastElementChild.firstElementChild;

    expect(lastChildAnchorElement).to.have.attribute('aria-current', 'page');
  });

  it('should not set the `aria-current="page"` to the last node does not have href', async () => {
    const el = await fixture(customSeparatorBreadcrumb);

    const lastChildAnchorElement =
      // @ts-ignore
      el.shadowRoot.querySelector('ol').lastElementChild.firstElementChild;

    expect(lastChildAnchorElement).to.not.have.attribute('aria-current', 'page');
  });

  it('passes the a11y audit', async () => {
    const el = await fixture(basicBreadcrumb);

    await expect(el).shadowDom.to.be.accessible();
  });
});
