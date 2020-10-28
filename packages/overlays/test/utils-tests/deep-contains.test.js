import { expect, fixture } from '@open-wc/testing';
import { html } from '@lion/core';

import { deepContains } from '../../src/utils/deep-contains.js';

describe('deepContains()', () => {
  it('returns true if element contains a target element with a shadow boundary in between', async () => {
    const shadowElement = /** @type {HTMLElement} */ (await fixture('<div id="shadow"></div>'));
    const shadowRoot = shadowElement.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <button id="el-1">Button</button>
      <a id="el-2" href="#foo">Href</a>
      <input id="el-3">
    `;
    const shadowElementChild = /** @type {HTMLElement} */ (shadowRoot.querySelector('#el-1'));
    const element = /** @type {HTMLElement} */ (await fixture(html`
      <div id="light">
        ${shadowElement}
        <button id="light-el-1"></button>
      </div>
    `));
    const lightEl = /** @type {HTMLElement} */ (element.querySelector('#light-el-1'));

    expect(deepContains(element, shadowElement)).to.be.true;
    expect(deepContains(element, shadowElementChild)).to.be.true;
    expect(deepContains(element, lightEl)).to.be.true;
    expect(deepContains(shadowElement, shadowElement)).to.be.true;
    expect(deepContains(shadowElement, shadowElementChild)).to.be.true;
    expect(deepContains(shadowRoot, shadowElementChild)).to.be.true;
  });

  it('returns true if element contains a target element with a shadow boundary in between, for multiple shadowroots', async () => {
    const shadowElement = /** @type {HTMLElement} */ (await fixture('<div id="shadow"></div>'));
    const shadowRoot = shadowElement.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <button id="el-1">Button</button>
      <a id="el-2" href="#foo">Href</a>
      <input id="el-3">
    `;

    const shadowElement2 = /** @type {HTMLElement} */ (await fixture('<div id="shadow2"></div>'));
    const shadowRoot2 = shadowElement2.attachShadow({ mode: 'open' });
    shadowRoot2.innerHTML = `
      <button id="el-1">Button</button>
      <a id="el-2" href="#foo">Href</a>
      <input id="el-3">
    `;

    const shadowElementChild = /** @type {HTMLElement} */ (shadowRoot.querySelector('#el-2'));
    const shadowElementChild2 = /** @type {HTMLElement} */ (shadowRoot2.querySelector('#el-2'));
    const element = /** @type {HTMLElement} */ (await fixture(html`
      <div id="light">
        ${shadowElement} ${shadowElement2}
        <button id="light-el-1"></button>
      </div>
    `));

    expect(deepContains(element, shadowElementChild)).to.be.true;
    expect(deepContains(shadowElement, shadowElementChild)).to.be.true;
    expect(deepContains(shadowRoot, shadowElementChild)).to.be.true;

    expect(deepContains(element, shadowElementChild2)).to.be.true;
    expect(deepContains(shadowElement2, shadowElementChild2)).to.be.true;
    expect(deepContains(shadowRoot2, shadowElementChild2)).to.be.true;
  });
});
