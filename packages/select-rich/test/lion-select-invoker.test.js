import { expect, fixture, html, defineCE } from '@open-wc/testing';
import { LionButton } from '@lion/button';
import { LionSelectInvoker } from '../src/LionSelectInvoker.js';

import '../lion-select-invoker.js';

describe('lion-select-invoker', () => {
  it('should behave as a button', async () => {
    const el = await fixture(html`
      <lion-select-invoker></lion-select-invoker>
    `);
    expect(el instanceof LionButton).to.be.true;
  });

  it('renders invoker info based on selectedElement child elements', async () => {
    const el = await fixture(html`
      <lion-select-invoker></lion-select-invoker>
    `);
    el.selectedElement = await fixture(`<div class="option"><h2>I am</h2><p>2 lines</p></div>`);
    await el.updateComplete;

    expect(el._contentWrapperNode).lightDom.to.equal(
      `
        <h2>I am</h2>
        <p>2 lines</p>
      `,
      {
        ignoreAttributes: ['class'], // ShadyCss automatically adds classes
      },
    );
  });

  it('renders invoker info based on selectedElement textContent', async () => {
    const el = await fixture(html`
      <lion-select-invoker></lion-select-invoker>
    `);
    el.selectedElement = await fixture(`<div class="option">just textContent</div>`);
    await el.updateComplete;

    expect(el._contentWrapperNode).lightDom.to.equal('just textContent');
  });

  it('has tabindex="0"', async () => {
    const el = await fixture(html`
      <lion-select-invoker></lion-select-invoker>
    `);
    expect(el.tabIndex).to.equal(0);
    expect(el.getAttribute('tabindex')).to.equal('0');
  });

  it('should not render after slot when singleOption is true', async () => {
    const el = await fixture(html`
      <lion-select-invoker .singleOption="${true}"></lion-select-invoker>
    `);

    expect(el.shadowRoot.querySelector('slot[name="after"]')).to.not.exist;
  });

  it('should render after slot when singleOption is not true', async () => {
    const el = await fixture(html`
      <lion-select-invoker></lion-select-invoker>
    `);

    expect(el.shadowRoot.querySelector('slot[name="after"]')).to.exist;
  });

  describe('Subclassers', () => {
    it('supports a custom _contentTemplate', async () => {
      const myTag = defineCE(
        class extends LionSelectInvoker {
          _contentTemplate() {
            if (this.selectedElement && this.selectedElement.textContent === 'cat') {
              return html`
                cat selected
              `;
            }
            return `no valid selection`;
          }
        },
      );
      const el = await fixture(`<${myTag}></${myTag}>`);

      el.selectedElement = await fixture(`<div class="option">cat</div>`);
      await el.updateComplete;
      expect(el._contentWrapperNode).lightDom.to.equal('cat selected');

      el.selectedElement = await fixture(`<div class="option">dog</div>`);
      await el.updateComplete;
      expect(el._contentWrapperNode).lightDom.to.equal('no valid selection');
    });
  });
});
