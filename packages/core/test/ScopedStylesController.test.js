import { expect, fixture } from '@open-wc/testing';
// import { html as _html } from 'lit/static-html.js';
import { LitElement, css, html } from '../index.js';
import { ScopedStylesController } from '../src/ScopedStylesController.js';

describe('ScopedStylesMixin', () => {
  class Scoped extends LitElement {
    /**
     * @param {import('lit').CSSResult} scope
     * @returns {import('lit').CSSResultGroup}
     */
    static scopedStyles(scope) {
      return css`
        .${scope} .test {
          color: #fff000;
        }
      `;
    }

    constructor() {
      super();
      this.scopedStylesController = new ScopedStylesController(this);
    }

    render() {
      return html` <p class="test">Some Text</p> `;
    }

    createRenderRoot() {
      return this;
    }
  }

  before(() => {
    customElements.define('scoped-el', Scoped);
  });

  it('contains the scoped css class for the slotted input style', async () => {
    const el = /** @type {Scoped & ScopedStylesController} */ (
      await fixture(html`<scoped-el></scoped-el>`)
    );
    expect(el.classList.contains(el.scopedStylesController.scopedClass)).to.equal(true);
  });

  it('adds a style tag as the first child which contains a class selector to the element', async () => {
    const el = /** @type {Scoped & ScopedStylesController} */ (
      await fixture(html` <scoped-el></scoped-el> `)
    );
    expect(el.children[0].tagName).to.equal('STYLE');
    expect(el.children[0].innerHTML).to.contain(el.scopedStylesController.scopedClass);
  });

  it('the scoped styles are applied correctly to the DOM elements', async () => {
    const el = /** @type {Scoped & ScopedStylesController} */ (
      await fixture(html`<scoped-el></scoped-el>`)
    );
    const testText = /** @type {HTMLElement} */ (el.querySelector('.test'));
    const cl = Array.from(el.classList);
    expect(cl.find(item => item.startsWith('scoped-el-'))).to.not.be.undefined;
    expect(getComputedStyle(testText).getPropertyValue('color')).to.equal('rgb(255, 240, 0)');
  });

  it('does cleanup of the style tag when moving or deleting the el', async () => {
    const wrapper = await fixture(`
      <div></div>
    `);
    const wrapper2 = await fixture(`
      <div></div>
    `);
    const el = document.createElement('scoped-el');
    wrapper.appendChild(el);
    wrapper2.appendChild(el);
    expect(el.children[1]).to.be.undefined;
  });
});
