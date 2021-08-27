import sinon from 'sinon';
import { defineCE, expect, fixture } from '@open-wc/testing';
import { SlotMixin } from '../src/SlotMixin.js';
import { LitElement, ScopedElementsMixin, html } from '../index.js';

describe('SlotMixin', () => {
  it('inserts provided element into light dom and sets slot', async () => {
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
    const el = await fixture(`<${tag}><${tag}>`);
    const slottedEl = /** @type HTMLSpanElement */ (
      Array.from(el.children).find(elm => elm.slot === 'template')
    );
    expect(slottedEl.slot).to.equal('template');
    expect(slottedEl.tagName).to.equal('SPAN');
  });

  it('supports scoped elements', async () => {
    const scopedSpy = sinon.spy();
    class ScopedEl extends LitElement {
      connectedCallback() {
        super.connectedCallback();
        scopedSpy();
      }
    }

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

        connectedCallback() {
          super.connectedCallback();

          // Not rendered to shadowRoot, notScopedSpy should not be called
          const notScoped = document.createElement('not-scoped');
          this.appendChild(notScoped);
        }

        render() {
          return html`<slot name="template"></slot>`;
        }
      },
    );

    await fixture(`<${tag}><${tag}>`);
    expect(scopedSpy).to.have.been.called;
  });

  it('rerenders templates', async () => {
    class TestEl extends SlotMixin(LitElement) {
      static get properties() {
        return {
          prop: { type: Number },
          anotherProp: { type: Number },
        };
      }

      constructor() {
        super();
        this.prop = 1;
        this.anotherProp = 10;
      }

      get slots() {
        return {
          ...super.slots,
          template: () => html`<span>${this.prop}</span>`,
          anothertemplate: () => html`<span>${this.anotherProp}</span>`,
        };
      }

      render() {
        return html`<slot name="template"></slot><slot name="anothertemplate"></slot>`;
      }
    }
    const tag = defineCE(TestEl);
    const el = /** @type {TestEl} */ (await fixture(`<${tag}><${tag}>`));
    const slottedEl = /** @type HTMLSpanElement */ (
      Array.from(el.children).find(elm => elm.slot === 'template')
    );
    const anotherSlottedEl = /** @type HTMLSpanElement */ (
      Array.from(el.children).find(elm => elm.slot === 'anothertemplate')
    );

    expect(slottedEl.textContent).to.equal('1');
    expect(anotherSlottedEl.textContent).to.equal('10');

    el.prop = 2;
    await el.updateComplete;
    expect(slottedEl.textContent).to.equal('2');
    expect(anotherSlottedEl.textContent).to.equal('10');

    el.anotherProp = 20;
    await el.updateComplete;
    expect(slottedEl.textContent).to.equal('2');
    expect(anotherSlottedEl.textContent).to.equal('20');
  });
});
