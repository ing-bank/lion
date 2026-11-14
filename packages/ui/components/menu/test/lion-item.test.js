import { expect, fixture, html } from '@open-wc/testing';
import '@lion/ui/define/lion-item.js';
import '@lion/ui/define/lion-menuitem.js';

describe('lion-item', () => {
  it('gets role="listitem" by default', async () => {
    const el = await fixture(html`<lion-item>Item</lion-item>`);
    expect(el.getAttribute('role')).to.equal('listitem');
  });

  it('gets the role of its [type]', async () => {
    const el = await fixture(html`<lion-item type="treeitem">Item</lion-item>`);
    expect(el.getAttribute('role')).to.equal('treeitem');
  });

  it('puts the role on its [slot=invoker] instead of itself', async () => {
    const el = await fixture(html`
      <lion-item>
        <button slot="invoker">Item</button>
        <div>sub items</div>
      </lion-item>
    `);
    const invoker = /** @type {HTMLElement} */ (el.querySelector('[slot=invoker]'));
    expect(invoker.getAttribute('role')).to.equal('listitem');
    expect(el.hasAttribute('role')).to.be.false;
  });
});

describe('lion-menuitem', () => {
  it('gets role="menuitem" by default', async () => {
    const el = await fixture(html`<lion-menuitem>Item</lion-menuitem>`);
    expect(el.getAttribute('role')).to.equal('menuitem');
  });

  it('gets role="menuitemcheckbox" and "menuitemradio" for [type] checkbox and radio', async () => {
    const checkbox = await fixture(html`<lion-menuitem type="checkbox">Item</lion-menuitem>`);
    const radio = await fixture(html`<lion-menuitem type="radio">Item</lion-menuitem>`);
    expect(checkbox.getAttribute('role')).to.equal('menuitemcheckbox');
    expect(radio.getAttribute('role')).to.equal('menuitemradio');
  });
});
