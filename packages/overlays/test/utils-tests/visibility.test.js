/* eslint-env mocha */
/* eslint-disable no-underscore-dangle, no-unused-expressions */
import { expect, fixture } from '@open-wc/testing';

import { isVisible } from '../../src/utils/is-visible.js';

describe('isVisible()', () => {
  it('returns true for static block elements', async () => {
    const element = await fixture(`<div style="width:10px; height:10px;"></div>`);

    expect(isVisible(element)).to.equal(true);
  });

  it('returns false for hidden static block elements', async () => {
    const element = await fixture(`<div style="width:10px; height:10px;" hidden></div>`);

    expect(isVisible(element)).to.equal(false);
  });

  it('returns true for relative block elements', async () => {
    const element = await fixture(
      `<div style="width:10px; height:10px; position:relative; top:10px; left:10px;"></div>`,
    );

    expect(isVisible(element)).to.equal(true);
  });

  it('returns false for hidden relative block elements', async () => {
    const element = await fixture(
      `<div style="width:10px; height:10px; position:relative; top:10px; left:10px;" hidden></div>`,
    );

    expect(isVisible(element)).to.equal(false);
  });

  it('returns true for absolute block elements', async () => {
    const element = await fixture(`
      <div style="width:10px; height:10px; position:absolute; top:10px; left:10px;"></div>
    `);

    expect(isVisible(element)).to.equal(true);
  });

  it('returns false for hidden absolute block elements', async () => {
    const element = await fixture(`
      <div style="width:10px; height:10px; position:absolute; top:10px; left:10px;" hidden></div>
    `);

    expect(isVisible(element)).to.equal(false);
  });

  it('returns true for relative block elements', async () => {
    const element = await fixture(`
      <div style="width:10px; height:10px; position:fixed;top:10px; left:10px;"></div>
    `);

    expect(isVisible(element)).to.equal(true);
  });

  it('returns true for relative block elements', async () => {
    const element = await fixture(`
      <div style="width:10px; height:10px; position:fixed;top:10px; left:10px;" hidden></div>
    `);

    expect(isVisible(element)).to.equal(false);
  });

  it('returns true for inline elements', async () => {
    const element = await fixture(`<span>Inline content</span>`);

    expect(isVisible(element)).to.equal(true);
  });

  it('returns true for inline elements without content', async () => {
    const element = await fixture(`<span></span>`);

    expect(isVisible(element)).to.equal(true);
  });

  it('returns true for static block elements with 0 dimensions', async () => {
    const element = await fixture(`<div style="width:0; height:0;"></div>`);

    expect(isVisible(element)).to.equal(true);
  });

  it('returns false for hidden inline elements', async () => {
    const element = await fixture(`<span hidden>Inline content</span>`);

    expect(isVisible(element)).to.equal(false);
  });

  it('returns false invisible elements', async () => {
    const element = await fixture(
      `<div style="width:10px; height:10px; visibility: hidden;"></div>`,
    );

    expect(isVisible(element)).to.equal(false);
  });

  it('returns false when hidden by parent', async () => {
    const element = await fixture(`
      <div hidden>
        <div id="target" style="width:10px; height:10px;"></div>
        <div></div>
      </div>
    `);

    const target = element.querySelector('#target');
    expect(isVisible(target)).to.equal(false);
  });

  it('returns false when invisible by parent', async () => {
    const element = await fixture(`
      <div style="visibility: hidden;">
        <div id="target" style="width:10px; height:10px;"></div>
        <div></div>
      </div>
    `);

    const target = element.querySelector('#target');
    expect(isVisible(target)).to.equal(false);
  });
});
