import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import sinon from 'sinon';
import { browserDetection } from '@lion/ui/core.js';
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
          <div id="b-child2"></div>
        </div>
        <div></div>
        <div id="c"></div>
        <div></div>
      </div>
    `);
    // eslint-disable-next-line no-unused-vars
    const [a, _1, b, _2, bChild, child2, _3, c, _4] = Array.from(el.querySelectorAll('div'));
    const unorderedNodes = [bChild, c, a, b, child2];
    const result = getAriaElementsInRightDomOrder(unorderedNodes);
    expect(result).to.eql([a, b, bChild, child2, c]);
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
    const [a, _1, b, _2, bChild, _3, c, _4] = Array.from(el.querySelectorAll('div'));
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
    const [a, _1, b, _2, bChild, _3, c, _4] = Array.from(el.querySelectorAll('div'));
    const unorderedNodes = [bChild, c, a, b];
    const result = getAriaElementsInRightDomOrder(unorderedNodes);
    expect(result).to.eql([c, bChild, b, a]);
    browserDetectionStub.restore();
  });
});
