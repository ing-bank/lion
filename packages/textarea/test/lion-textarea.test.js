import { expect, fixture, html } from '@open-wc/testing';

import '../lion-textarea.js';

function hasBrowserResizeSupport() {
  const textarea = document.createElement('textarea');
  return textarea.style.resize !== undefined;
}

describe('<lion-textarea>', () => {
  it(`can be used with the following declaration
  ~~~
  <lion-textarea></lion-textarea>
  ~~~`, async () => {
    const el = await fixture(`<lion-textarea></lion-textarea>`);
    expect(el.querySelector('textarea').nodeName).to.equal('TEXTAREA');
  });

  it('has .rows=2 and .maxRows=6', async () => {
    const el = await fixture(`<lion-textarea></lion-textarea>`);
    expect(el.rows).to.equal(2);
    expect(el.maxRows).to.equal(6);
  });

  it('has .rows=2 and rows="2" by default', async () => {
    const el = await fixture(`<lion-textarea>foo</lion-textarea>`);
    expect(el.rows).to.equal(2);
    expect(el.getAttribute('rows')).to.be.equal('2');
    expect(el.inputElement.rows).to.equal(2);
    expect(el.inputElement.getAttribute('rows')).to.be.equal('2');
  });

  it('sync rows down to the native textarea', async () => {
    const el = await fixture(`<lion-textarea rows="8">foo</lion-textarea>`);
    expect(el.rows).to.equal(8);
    expect(el.getAttribute('rows')).to.be.equal('8');
    expect(el.inputElement.rows).to.equal(8);
    expect(el.inputElement.getAttribute('rows')).to.be.equal('8');
  });

  it('disables user resize behavior', async () => {
    if (!hasBrowserResizeSupport()) {
      return;
    }

    const el = await fixture(`<lion-textarea></lion-textarea>`);
    const computedStyle = window.getComputedStyle(el.inputElement);
    expect(computedStyle.resize).to.equal('none');
  });

  it('supports initial modelValue', async () => {
    const el = await fixture(
      html`
        <lion-textarea .modelValue="${'From value attribute'}"></lion-textarea>
      `,
    );
    expect(el.querySelector('textarea').value).to.equal('From value attribute');
  });

  it('adjusts height based on content', async () => {
    const el = await fixture(`<lion-textarea></lion-textarea>`);
    const initialHeight = el.offsetHeight;
    el.modelValue = 'batman\nand\nrobin\nand\ncatwoman';
    await el.updateComplete;
    const hightWith5TextLines = el.offsetHeight;
    expect(hightWith5TextLines > initialHeight).to.equal(true);

    el.modelValue = 'batman';
    await el.updateComplete;
    const hightWith1Line = el.offsetHeight;
    expect(hightWith1Line < hightWith5TextLines).to.equal(true);
  });

  it(`starts growing when content is bigger than "rows"
    'and stops growing after property "maxRows" is reached`, async () => {
    const el = await fixture(`<lion-textarea></lion-textarea>`);
    return [1, 2, 3, 4, 5, 6, 7, 8].reduce(async (heightPromise, i) => {
      const oldHeight = await heightPromise;
      el.modelValue += '\n';
      await el.updateComplete;
      const newHeight = el.offsetHeight;

      if (i > el.maxRows) {
        // stop growing
        expect(newHeight).to.equal(oldHeight);
      } else if (i > el.rows) {
        // growing normally
        expect(newHeight >= oldHeight).to.equal(true);
      }

      return Promise.resolve(newHeight);
    }, Promise.resolve(0));
  });

  it('stops growing after property "maxRows" is reached when there was an initial value', async () => {
    const el = await fixture(
      html`
        <lion-textarea .modelValue="${'1\n2\n3'}"></lion-textarea>
      `,
    );

    return [4, 5, 6, 7, 8].reduce(async (heightPromise, i) => {
      const oldHeight = await heightPromise;
      el.modelValue += `\n`;
      await el.updateComplete;
      const newHeight = el.offsetHeight;

      if (i > el.maxRows) {
        // stop growing
        expect(newHeight).to.equal(oldHeight);
      } else if (i > el.rows) {
        // growing normally
        expect(newHeight >= oldHeight).to.equal(true);
      }

      return Promise.resolve(newHeight);
    }, Promise.resolve(0));
  });

  it('stops shrinking after property "rows" is reached', async () => {
    const el = await fixture(html`
      <lion-textarea rows="1" max-rows="3"></lion-textarea>
    `);
    expect(el.scrollHeight).to.be.equal(el.clientHeight);
    const oneRowHeight = el.clientHeight;

    el.rows = 3;
    el.resizeTextarea();
    await el.updateComplete;
    expect(oneRowHeight)
      .to.be.below(el.clientHeight)
      .and.to.be.below(el.scrollHeight);
  });
});
