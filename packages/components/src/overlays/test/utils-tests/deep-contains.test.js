import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';

import { deepContains } from '@lion/components/overlays.js';

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
    const element = /** @type {HTMLElement} */ (
      await fixture(html`
        <div id="light">
          ${shadowElement}
          <button id="light-el-1"></button>
        </div>
      `)
    );
    const lightChildEl = /** @type {HTMLElement} */ (element.querySelector('#light-el-1'));

    expect(deepContains(element, element)).to.be.true;
    expect(deepContains(element, shadowElement)).to.be.true;
    expect(deepContains(element, shadowElementChild)).to.be.true;
    expect(deepContains(element, lightChildEl)).to.be.true;
    expect(deepContains(shadowElement, shadowElement)).to.be.true;
    expect(deepContains(shadowElement, shadowElementChild)).to.be.true;
    expect(deepContains(shadowRoot, shadowElementChild)).to.be.true;

    // Siblings
    expect(
      deepContains(
        /** @type {HTMLElement} */ (element.firstElementChild),
        /** @type {HTMLElement} */ (element.lastElementChild),
      ),
    ).to.be.false;
    // Unrelated
    expect(deepContains(lightChildEl, shadowElementChild)).to.be.false;
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
    const element = /** @type {HTMLElement} */ (
      await fixture(html`
        <div id="light">
          ${shadowElement} ${shadowElement2}
          <button id="light-el-1"></button>
        </div>
      `)
    );

    expect(deepContains(element, shadowElementChild)).to.be.true;
    expect(deepContains(shadowElement, shadowElementChild)).to.be.true;
    expect(deepContains(shadowRoot, shadowElementChild)).to.be.true;

    expect(deepContains(element, shadowElementChild2)).to.be.true;
    expect(deepContains(shadowElement2, shadowElementChild2)).to.be.true;
    expect(deepContains(shadowRoot2, shadowElementChild2)).to.be.true;
  });

  it('can detect containing elements inside multiple nested shadow roots', async () => {
    const shadowNestedElement = await fixture('<div id="shadow-nested"></div>');
    const shadowNestedRoot = shadowNestedElement.attachShadow({ mode: 'open' });
    shadowNestedRoot.innerHTML = `
      <button id="nested-el-1">Button</button>
      <a id="nested-el-2" href="#foo">Href</a>
      <input id="nested-el-3">
    `;

    const shadowElement = /** @type {HTMLElement} */ (await fixture('<div id="shadow"></div>'));
    const shadowRoot = shadowElement.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <button id="el-1">Button</button>

      <input id="el-3">
    `;
    shadowRoot.insertBefore(shadowNestedElement, shadowRoot.lastElementChild);

    const element = /** @type {HTMLElement} */ (
      await fixture(html`
        <div id="light">
          ${shadowElement}
          <button id="light-el-1"></button>
        </div>
      `)
    );

    const elementFirstChild = /** @type {HTMLElement} */ (element.firstElementChild);
    const elementFirstChildShadow = /** @type {ShadowRoot} */ (elementFirstChild.shadowRoot);
    const elementFirstChildShadowChildren = /** @type {HTMLElement[]} */ (
      Array.from(elementFirstChildShadow.children)
    );
    const elementFirstChildShadowChildShadow = /** @type {ShadowRoot} */ (
      elementFirstChildShadowChildren[1].shadowRoot
    );
    const elementFirstChildShadowChildShadowLastChild = /** @type {HTMLElement} */ (
      elementFirstChildShadowChildShadow.lastElementChild
    );

    expect(deepContains(element, elementFirstChild)).to.be.true;
    expect(deepContains(element, elementFirstChildShadow)).to.be.true;
    expect(deepContains(element, elementFirstChildShadowChildren[1])).to.be.true;
    expect(deepContains(element, elementFirstChildShadowChildShadow)).to.be.true;
    expect(deepContains(element, elementFirstChildShadowChildShadowLastChild)).to.be.true;
  });
});
