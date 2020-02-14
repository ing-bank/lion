import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import { browserDetection } from '@lion/core';
import { getAriaElementsInRightDomOrder } from '../../src/utils/getAriaElementsInRightDomOrder.js';

describe('getAriaElementsInRightDomOrder', () => {
  it('orders by putting preceding siblings and local parents first', async () => {
    const el = await fixture(html`
      <div>
        <div id="a"></div>
        <div></div>
        <div id="b">
          <div></div>
          <div id="b-child"></div>
        </div>
        <div></div>
        <div id="c"></div>
        <div></div>
      </div>
    `);
    // eslint-disable-next-line no-unused-vars
    const [a, _1, b, _2, bChild, _3, c, _4] = el.querySelectorAll('div');
    const unorderedNodes = [bChild, c, a, b];
    const result = getAriaElementsInRightDomOrder(unorderedNodes);
    expect(result).to.eql([a, b, bChild, c]);
  });

  it('can order reversely', async () => {
    const el = await fixture(html`
      <div>
        <div id="a"></div>
        <div></div>
        <div id="b">
          <div></div>
          <div id="b-child"></div>
        </div>
        <div></div>
        <div id="c"></div>
        <div></div>
      </div>
    `);
    // eslint-disable-next-line no-unused-vars
    const [a, _1, b, _2, bChild, _3, c, _4] = el.querySelectorAll('div');
    const unorderedNodes = [bChild, c, a, b];
    const result = getAriaElementsInRightDomOrder(unorderedNodes, { reverse: true });
    expect(result).to.eql([c, bChild, b, a]);
  });

  it('orders in reverse for IE11', async () => {
    const browserDetectionStub = sinon.stub(browserDetection, 'isIE11').value(true);
    const el = await fixture(html`
      <div>
        <div id="a"></div>
        <div></div>
        <div id="b">
          <div></div>
          <div id="b-child"></div>
        </div>
        <div></div>
        <div id="c"></div>
        <div></div>
      </div>
    `);
    // eslint-disable-next-line no-unused-vars
    const [a, _1, b, _2, bChild, _3, c, _4] = el.querySelectorAll('div');
    const unorderedNodes = [bChild, c, a, b];
    const result = getAriaElementsInRightDomOrder(unorderedNodes);
    expect(result).to.eql([c, bChild, b, a]);
    browserDetectionStub.restore();
  });
});
