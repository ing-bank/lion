import { expect, html, fixture } from '@open-wc/testing';
import sinon from 'sinon';

import { LionProgressBar } from '../src/LionProgressBar.js';

customElements.define('lion-progress-bar', LionProgressBar);

const progressBar = html`<lion-progress-bar></lion-progress-bar>`;

describe('<lion-progress-bar>', () => {
  let el;

  beforeEach(async () => {
    el = await fixture(progressBar);
  });

  it('should set a default value for "max"', () => {
    expect(el.max).to.equal(100);
  });

  it('should convert negative values to 0', () => {
    el.value = -1;

    expect(el.value).to.equal(0);
  });

  it('should convert non-numeric values to numeric values', () => {
    el.value = '50';

    expect(el.value).to.equal(50);

    el.value = 'foo';

    expect(el.value).to.equal(0);
  });

  it('should set the value as a percentage of "max"', () => {
    el.value = 25;

    expect(el.value).to.equal(25);

    el.max = 50;
    el.value = 25;

    expect(el.value).to.equal(50);
  });

  it('should call "requestUpdate" when the value is set', () => {
    const spy = sinon.spy(el, 'requestUpdate');

    el.value = 10;

    expect(spy.called).to.be.true;
  });
});
