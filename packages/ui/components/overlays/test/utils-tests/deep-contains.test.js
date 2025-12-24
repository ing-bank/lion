import { describe, it } from 'vitest';
import { html } from 'lit';
import { fixture } from '@open-wc/testing-helpers';
import { deepContains } from '@lion/ui/overlays.js';
import { expect } from '../../../../test-helpers.js';

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
          <button id="light-el-1">Button</button>
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
          <button id="light-el-1">Button</button>
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
          <button id="light-el-1">Button</button>
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

  it('returns true if the element, which is located in ShadowsRoot, contains a target element, located in the LightDom', async () => {
    const mainElement = /** @type {HTMLElement} */ (await fixture('<div id="main"></div>'));
    mainElement.innerHTML = `      
      <div slot="content" id="light-el-content">
        <input type="text" id="light-el-input-1"></input>
      </div>
      <div slot="content" id="light-el-content">
        <input type="text" id="light-el-input-2"></input>
      </div>
    `;
    const shadowRoot = mainElement.attachShadow({ mode: 'open' });
    shadowRoot.innerHTML = `
      <div id="dialog-wrapper">
        <div id="dialog-header">
          Header          
        </div>  
        <div id="dialog-content">
          <slot name="content" id="shadow-el-content"></slot>
        </div>  
      </div>      
    `;
    const inputElement = /** @type {HTMLElement} */ (
      mainElement.querySelector('#light-el-input-2')
    );
    const dialogWrapperElement = /** @type {HTMLElement} */ (
      shadowRoot.querySelector('#dialog-wrapper')
    );
    expect(deepContains(dialogWrapperElement, inputElement)).to.be.true;
  });

  it(`returns true if the element, which is located in ShadowRoot, contains a target element, located in the ShadowRoot element of the LightDom element  `, async () => {
    /**
     * The DOM for the `main` element looks as follows:
     *
     * <div id="main">
     *   #shadow-root
     *     <div id="dialog-wrapper">                                        // dialogWrapperElement
     *       <div id="dialog-header">
     *         Header
     *       </div>
     *       <div id="dialog-content">
     *         <slot name="content" id="shadow-el-content"></slot>
     *       </div>
     *     </div>
     *   <div slot="content" id="light-el-content">
     *     <div id="conent-wrapper">
     *       #shadow-root
     *         <div id="conent-wrapper-sub">
     *           #shadow-root
     *             <input type="type" id="content-input"></input>           //inputElement
     *         </div>
     *     </div>
     *   </div>
     * </div>
     */
    const mainElement = /** @type {HTMLElement} */ (await fixture('<div id="main"></div>'));
    mainElement.innerHTML = `      
      <div slot="content" id="light-el-content">
        <div id="content-wrapper"></div>
      </div>
      <div slot="content" id="light-el-content">
        <div id="content-wrapper"></div>
      </div>
    `;
    const contentWrapper = /** @type {HTMLElement} */ (
      mainElement.querySelector('#content-wrapper')
    );
    const contentWrapperShadowRoot = contentWrapper.attachShadow({ mode: 'open' });
    contentWrapperShadowRoot.innerHTML = `
      <div id="conent-wrapper-sub"></div>
    `;
    const contentWrapperSub = /** @type {HTMLElement} */ (
      contentWrapperShadowRoot.querySelector('#conent-wrapper-sub')
    );
    const contentWrapperSubShadowRoot = contentWrapperSub.attachShadow({ mode: 'open' });
    contentWrapperSubShadowRoot.innerHTML = `
      <input type="type" id="content-input"></input>
    `;
    const inputElement = /** @type {HTMLElement} */ (
      contentWrapperSubShadowRoot.querySelector('#content-input')
    );
    const mainElementShadowRoot = mainElement.attachShadow({ mode: 'open' });
    mainElementShadowRoot.innerHTML = `
      <div id="dialog-wrapper">
        <div id="dialog-header">
          Header          
        </div>  
        <div id="dialog-content">
          <slot name="content" id="shadow-el-content"></slot>
        </div>  
      </div>      
    `;
    const dialogWrapperElement = /** @type {HTMLElement} */ (
      mainElementShadowRoot.querySelector('#dialog-wrapper')
    );
    expect(deepContains(dialogWrapperElement, inputElement)).to.be.true;
  });
});
