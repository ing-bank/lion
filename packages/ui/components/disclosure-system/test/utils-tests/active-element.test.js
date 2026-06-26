import { expect, fixture, defineCE } from '@open-wc/testing';
import { LitElement, html } from 'lit';
import { getDeepActiveElement } from '@lion/ui/overlays.js';

describe('getDeepActiveElement()', () => {
  it('handles document level active elements', async () => {
    const element = await fixture(`
      <div>
        <button id="el-1">Button</button>
        <a id="el-2" href="#foo">Href</a>
        <input id="el-3">
      </div>
    `);

    const el1 = /** @type {HTMLElement} */ (element.querySelector('#el-1'));
    const el2 = /** @type {HTMLElement} */ (element.querySelector('#el-2'));
    const el3 = /** @type {HTMLElement} */ (element.querySelector('#el-3'));

    el1.focus();
    expect(getDeepActiveElement()).to.eql(el1);

    el2.focus();
    expect(getDeepActiveElement()).to.eql(el2);

    el3.focus();
    expect(getDeepActiveElement()).to.eql(el3);
  });

  it('handles active element inside shadowroots', async () => {
    const elNestedTag = defineCE(
      class extends LitElement {
        render() {
          return html`
            <div id="el-b-1" tabindex="0">Button</div>
            <a id="el-b-2" href="#foo">Href</a>
          `;
        }
      },
    );

    const elTag = defineCE(
      class extends LitElement {
        render() {
          const elNested = document.createElement(elNestedTag);
          return html`
            <button id="el-a-1">Button</button>
            <input id="el-a-2" />
            ${elNested}
          `;
        }
      },
    );

    const element = await fixture(`
      <div>
        <${elTag}></${elTag}>
        <button id="el-1">Button</button>
      </div>
    `);

    const elTagEl = /** @type {HTMLElement} */ (element.querySelector(elTag));
    const elA = /** @type {ShadowRoot} */ (elTagEl.shadowRoot);
    const elNestedTagEl = /** @type {HTMLElement} */ (elA.querySelector(elNestedTag));
    const elB = /** @type {ShadowRoot} */ (elNestedTagEl.shadowRoot);

    const elA1 = /** @type {HTMLElement} */ (elA.querySelector('#el-a-1'));
    const elA2 = /** @type {HTMLElement} */ (elA.querySelector('#el-a-2'));
    const elB1 = /** @type {HTMLElement} */ (elB.querySelector('#el-b-1'));
    const elB2 = /** @type {HTMLElement} */ (elB.querySelector('#el-b-1'));
    const el1 = /** @type {HTMLElement} */ (element.querySelector('#el-1'));

    elA1.focus();
    expect(getDeepActiveElement()).to.eql(elA1);

    elA2.focus();
    expect(getDeepActiveElement()).to.eql(elA2);

    elB1.focus();
    expect(getDeepActiveElement()).to.eql(elB1);

    elB2.focus();
    expect(getDeepActiveElement()).to.eql(elB2);

    el1.focus();
    expect(getDeepActiveElement()).to.eql(el1);
  });
});
