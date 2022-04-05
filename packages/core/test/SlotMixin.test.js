import sinon from 'sinon';
import { defineCE, expect, fixture } from '@open-wc/testing';
import { SlotMixin } from '../src/SlotMixin.js';
import { LitElement, ScopedElementsMixin, html } from '../index.js';

function mockScopedRegistry() {
  // @ts-expect-error wait for browser support
  ShadowRoot.prototype.createElement = () => {};
  // @ts-expect-error wait for browser support
  window.CustomElementRegistry = class {};
}

function unMockScopedRegistry() {
  // @ts-expect-error wait for browser support
  delete ShadowRoot.prototype.createElement;
  // @ts-expect-error wait for browser support
  delete window.CustomElementRegistry;
}

describe('SlotMixin', () => {
  it('inserts provided element into lightdom and sets slot', async () => {
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        get slots() {
          return {
            ...super.slots,
            feedback: () => document.createElement('div'),
          };
        }
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    expect(el.children[0].slot).to.equal('feedback');
  });

  it("supports unnamed slot with ''", async () => {
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        get slots() {
          return {
            ...super.slots,
            '': () => document.createElement('div'),
          };
        }
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    expect(el.children[0].slot).to.equal('');
    expect(el.children[0]).dom.to.equal('<div></div>');
  });

  it('supports unnamed slot in conjunction with named slots', async () => {
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        get slots() {
          return {
            ...super.slots,
            foo: () => document.createElement('a'),
            '': () => document.createElement('div'),
          };
        }
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    expect(el.children[0].slot).to.equal('foo');
    expect(el.children[1].slot).to.equal('');
    expect(el.children[0]).dom.to.equal('<a slot="foo"></a>');
    expect(el.children[1]).dom.to.equal('<div></div>');
  });

  it('does not override user provided slots', async () => {
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        get slots() {
          return {
            ...super.slots,
            feedback: () => document.createElement('div'),
          };
        }
      },
    );
    const el = await fixture(`<${tag}><p slot="feedback">user-content</p></${tag}>`);
    expect(el.children[0].tagName).to.equal('P');
    expect(/** @type HTMLParagraphElement */ (el.children[0]).innerText).to.equal('user-content');
  });

  it('does add when user provided slots are not direct children', async () => {
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        get slots() {
          return {
            ...super.slots,
            content: () => document.createElement('div'),
          };
        }
      },
    );
    const el = await fixture(`<${tag}><p><span slot="content">user-content</span></p></${tag}>`);
    const slot = /** @type HTMLDivElement */ (
      Array.from(el.children).find(elm => elm.slot === 'content')
    );
    expect(slot.tagName).to.equal('DIV');
    expect(slot.innerText).to.equal('');
  });

  it('supports complex dom trees as element', async () => {
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        constructor() {
          super();
          this.foo = 'bar';
        }

        get slots() {
          return {
            ...super.slots,
            feedback: () => {
              const el = document.createElement('div');
              el.setAttribute('foo', this.foo);
              const subEl = document.createElement('p');
              subEl.innerText = 'cat';
              el.appendChild(subEl);
              return el;
            },
          };
        }
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    expect(el.children[0].slot).to.equal('feedback');
    expect(el.children[0].getAttribute('foo')).to.equal('bar');
    expect(/** @type HTMLParagraphElement */ (el.children[0].children[0]).innerText).to.equal(
      'cat',
    );
  });

  it('supports conditional slots', async () => {
    let renderSlot = true;
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        get slots() {
          return {
            ...super.slots,
            conditional: () => {
              if (renderSlot) {
                const el = document.createElement('div');
                el.id = 'someSlot';
                return el;
              }
              return undefined;
            },
          };
        }
      },
    );
    const elSlot = await fixture(`<${tag}><${tag}>`);
    expect(elSlot.querySelector('#someSlot')).to.exist;
    renderSlot = false;
    const elNoSlot = await fixture(`<${tag}><${tag}>`);
    expect(elNoSlot.querySelector('#someSlot')).to.not.exist;
  });

  it("allows to check which slots have been created via this._isPrivateSlot('slotname')", async () => {
    let renderSlot = true;
    class SlotPrivateText extends SlotMixin(LitElement) {
      get slots() {
        return {
          ...super.slots,
          conditional: () => (renderSlot ? document.createElement('div') : undefined),
        };
      }

      didCreateConditionalSlot() {
        return this._isPrivateSlot('conditional');
      }
    }

    const tag = defineCE(SlotPrivateText);
    const el = /** @type {SlotPrivateText} */ (await fixture(`<${tag}><${tag}>`));
    expect(el.didCreateConditionalSlot()).to.be.true;
    const elUserSlot = /** @type {SlotPrivateText} */ (
      await fixture(`<${tag}><p slot="conditional">foo</p><${tag}>`)
    );
    expect(elUserSlot.didCreateConditionalSlot()).to.be.false;
    renderSlot = false;
    const elNoSlot = /** @type {SlotPrivateText} */ (await fixture(`<${tag}><${tag}>`));
    expect(elNoSlot.didCreateConditionalSlot()).to.be.false;
  });

  it('supports templates', async () => {
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        get slots() {
          return {
            ...super.slots,
            template: () => html`<span>text</span>`,
          };
        }

        render() {
          return html`<slot name="template"></slot>`;
        }
      },
    );
    const el = await fixture(`<${tag}></${tag}>`);
    const slot = /** @type HTMLSpanElement */ (
      Array.from(el.children).find(elm => elm.slot === 'template')
    );
    expect(slot.slot).to.equal('template');
    expect(slot.tagName).to.equal('SPAN');
  });

  it('supports scoped elements when polyfill loaded', async () => {
    mockScopedRegistry();

    class ScopedEl extends LitElement {}

    const tag = defineCE(
      class extends ScopedElementsMixin(SlotMixin(LitElement)) {
        static get scopedElements() {
          return {
            // @ts-expect-error
            ...super.scopedElements,
            'scoped-el': ScopedEl,
          };
        }

        get slots() {
          return {
            ...super.slots,
            template: () => html`<scoped-el></scoped-el>`,
          };
        }

        render() {
          return html`<slot name="template"></slot>`;
        }
      },
    );

    let error = '';
    try {
      // @ts-ignore
      await fixture(html`<${tag}></${tag}>`, { scopedElements: true });
    } catch (e) {
      // @ts-ignore
      error = e.toString();
    }
    // it throws when it uses our temp mock (error is browser specific, so we check overlapping part)
    expect(error).to.include('.importNode is not a function');

    unMockScopedRegistry();
  });

  it('does not scope elements when polyfill not loaded', async () => {
    class ScopedEl extends LitElement {}

    const tag = defineCE(
      class extends ScopedElementsMixin(SlotMixin(LitElement)) {
        static get scopedElements() {
          return {
            // @ts-expect-error
            ...super.scopedElements,
            'scoped-el': ScopedEl,
          };
        }

        get slots() {
          return {
            ...super.slots,
            template: () => html`<scoped-el></scoped-el>`,
          };
        }

        render() {
          return html`<slot name="template"></slot>`;
        }
      },
    );

    const docSpy = sinon.spy(document, 'createElement');
    await fixture(html`<${tag}></${tag}>`);
    // one for the fixture, one for the scoped slot
    expect(docSpy).to.have.been.calledTwice;
    docSpy.restore();
  });
});
