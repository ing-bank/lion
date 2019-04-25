/* eslint-env mocha */
import { expect, fixture, html } from '@open-wc/testing';

import '../lion-textarea.js';

describe('<lion-textarea>', () => {
  it(`can be used with the following declaration
  ~~~
  <lion-textarea></lion-textarea>
  ~~~`, async () => {
    const el = await fixture(`<lion-textarea></lion-textarea>`);
    expect(el.querySelector('textarea').nodeName).to.equal('TEXTAREA');
  });

  it('has a default minRows of 2 and maxRows of 10', async () => {
    const el = await fixture(`<lion-textarea></lion-textarea>`);
    expect(el.rows).to.equal(2);
    expect(el.maxRows).to.equal(6);
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
    const hightWith4TextLines = el.offsetHeight;
    expect(hightWith4TextLines > initialHeight).to.equal(true);

    el.modelValue = 'batman';
    await el.updateComplete;
    const hightWith1Line = el.offsetHeight;
    expect(hightWith1Line < hightWith4TextLines).to.equal(true);
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

  it('stops shrinking after property "rows" is reached', async () => {
    const el = await fixture(`<lion-textarea></lion-textarea>`);
    el.rows = 1;
    el.maxRows = 3;
    await el.updateComplete;

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
