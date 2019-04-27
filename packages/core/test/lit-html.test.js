import { expect, fixture } from '@open-wc/testing';

import { html } from '../src/lit-html.js';

describe('lit-html', () => {
  it('binds values when parent has shadow root', async () => {
    class ComponentWithShadowDom extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }
    }
    customElements.define('component-with-shadow-dom', ComponentWithShadowDom);

    const myNumber = 10;
    const myFunction = () => {};
    const element = await fixture(html`
      <component-with-shadow-dom>
        <any-element .propNumber=${myNumber} .propFunction=${myFunction}></any-element>
      </component-with-shadow-dom>
    `);
    expect(element.children[0].propNumber).to.equal(myNumber);
    expect(element.children[0].propFunction).to.equal(myFunction);
  });
});
