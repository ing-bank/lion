import sinon from 'sinon';
import { defineCE, expect, fixture, unsafeStatic, html } from '@open-wc/testing';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { SlotMixin } from '@lion/ui/core.js';
import { LitElement } from 'lit';

/**
 * @typedef {import('../types/SlotMixinTypes.js').SlotHost} SlotHost
 */

const mockedRenderTarget = document.createElement('div');
function mockScopedRegistry() {
  const outputObj = { createElementCallCount: 0 };
  // @ts-expect-error wait for browser support
  ShadowRoot.prototype.createElement = () => {
    outputObj.createElementCallCount += 1;
    // Return an element that lit can use as render target
    return mockedRenderTarget;
  };
  // @ts-expect-error wait for browser support
  window.CustomElementRegistry = class {};
  return outputObj;
}

function unMockScopedRegistry() {
  // @ts-expect-error wait for browser support
  delete ShadowRoot.prototype.createElement;
  // @ts-expect-error wait for browser support
  delete window.CustomElementRegistry;
}

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

  it("supports default slot with ''", async () => {
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

  it('supports default slot in conjunction with named slots', async () => {
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
    const shouldReturn = false;
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        get slots() {
          return {
            ...super.slots,
            feedback: () => document.createElement('div'),
            'more-feedback': () => {
              if (shouldReturn) {
                return document.createElement('div');
              }
              return undefined;
            },
            'even-more-feedback': () => document.createElement('div'),
          };
        }
      },
    );
    const el = await fixture(`<${tag}><p slot="feedback">user-content</p></${tag}>`);
    expect(el.children[0].tagName).to.equal('P');
    expect(/** @type HTMLParagraphElement */ (el.children[0]).innerText).to.equal('user-content');

    expect(el.children[1].tagName).to.equal('DIV');
    expect(/** @type HTMLParagraphElement */ (el.children[1]).slot).to.equal('even-more-feedback');
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

  describe('Rerender', () => {
    it('supports rerender when SlotRerenderObject provided', async () => {
      const tag = defineCE(
        // @ts-expect-error
        class extends SlotMixin(LitElement) {
          static properties = { currentValue: Number };

          constructor() {
            super();
            this.currentValue = 0;
          }

          get slots() {
            return {
              ...super.slots,
              template: () => ({ template: html`<span>${this.currentValue}</span> ` }),
            };
          }

          render() {
            return html`<slot name="template"></slot>`;
          }

          get _templateNode() {
            return /** @type HTMLSpanElement */ (
              Array.from(this.children).find(elm => elm.slot === 'template')
            );
          }
        },
      );
      const el = /** @type {* & SlotHost} */ (await fixture(`<${tag}></${tag}>`));
      await el.updateComplete;

      expect(el._templateNode.slot).to.equal('template');
      expect(el._templateNode.textContent?.trim()).to.equal('0');

      el.currentValue = 1;
      await el.updateComplete;

      expect(el._templateNode.textContent?.trim()).to.equal('1');
    });

    it('keeps focus after rerender', async () => {
      const tag = defineCE(
        // @ts-expect-error
        class extends SlotMixin(LitElement) {
          static properties = { currentValue: Number };

          constructor() {
            super();
            this.currentValue = 0;
          }

          get slots() {
            return {
              ...super.slots,
              'focusable-node': () => ({
                template: html`<input /> `,
              }),
            };
          }

          render() {
            return html`<slot name="focusable-node"></slot>`;
          }

          get _focusableNode() {
            return /** @type HTMLSpanElement */ (
              Array.from(this.children).find(elm => elm.slot === 'focusable-node')
                ?.firstElementChild
            );
          }
        },
      );
      const el = /** @type {* & SlotHost} */ (await fixture(`<${tag}></${tag}>`));

      el._focusableNode.focus();
      expect(document.activeElement).to.equal(el._focusableNode);

      el.currentValue = 1;
      await el.updateComplete;

      expect(document.activeElement).to.equal(el._focusableNode);
    });

    it('keeps focus after rerendering complex shadow root into slot', async () => {
      const complexSlotTagName = defineCE(
        class extends LitElement {
          render() {
            return html`
              <input />
              <button>I will be focused</button>
            `;
          }

          get _buttonNode() {
            // @ts-expect-error
            return this.shadowRoot.querySelector('button');
          }
        },
      );

      const complexSlotTag = unsafeStatic(complexSlotTagName);

      const tagName = defineCE(
        // @ts-expect-error
        class extends SlotMixin(LitElement) {
          static properties = { currentValue: Number };

          constructor() {
            super();
            this.currentValue = 0;
          }

          get slots() {
            return {
              ...super.slots,
              'focusable-node': () => ({
                template: html`<${complexSlotTag}> </${complexSlotTag}> `,
              }),
            };
          }

          render() {
            return html`<slot name="focusable-node"></slot>`;
          }

          get _focusableNode() {
            return /** @type HTMLSpanElement */ (
              Array.from(this.children).find(elm => elm.slot === 'focusable-node')
                ?.firstElementChild
            );
          }
        },
      );
      const el = /** @type {* & SlotHost} */ (await fixture(`<${tagName}></${tagName}>`));

      el._focusableNode._buttonNode.focus();

      expect(el._focusableNode.shadowRoot.activeElement).to.equal(el._focusableNode._buttonNode);

      el.currentValue = 1;
      await el.updateComplete;

      expect(document.activeElement).to.equal(el._focusableNode);
      expect(el._focusableNode.shadowRoot.activeElement).to.equal(el._focusableNode._buttonNode);
    });
  });

  describe('SlotFunctionResult types', () => {
    it('supports complex dom trees as element (type "Element")', async () => {
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

    it('supports conditional slots (type "undefined")', async () => {
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

    it('supports templates (type "TemplateResult")', async () => {
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

    it('supports (deprecated) afterRender logic (type "{ template:TemplateResults; afterRender: Function}" )', async () => {
      let varThatProvesAfterRenderIsCalled = 'not called';

      const tag = defineCE(
        // @ts-expect-error
        class extends SlotMixin(LitElement) {
          static properties = { currentValue: Number };

          constructor() {
            super();
            this.currentValue = 0;
          }

          get slots() {
            return {
              ...super.slots,
              template: () => ({
                template: html`<span>${this.currentValue}</span>, `,
                afterRender: () => {
                  varThatProvesAfterRenderIsCalled = 'called';
                },
              }),
            };
          }

          render() {
            return html`<slot name="template"></slot>`;
          }

          get _templateNode() {
            return /** @type HTMLSpanElement */ (
              Array.from(this.children).find(elm => elm.slot === 'template')?.firstElementChild
            );
          }
        },
      );
      const el = /** @type {* & SlotHost} */ (await fixture(`<${tag}></${tag}>`));
      expect(el._templateNode.textContent).to.equal('0');

      el.currentValue = 1;
      await el.updateComplete;

      expect(varThatProvesAfterRenderIsCalled).to.equal('called');
      expect(el._templateNode.textContent).to.equal('1');
    });
  });

  describe('Scoped Registries', () => {
    it('supports scoped elements when polyfill loaded', async () => {
      const outputObj = mockScopedRegistry();

      class ScopedEl extends LitElement {}

      const tagName = defineCE(
        class extends ScopedElementsMixin(SlotMixin(LitElement)) {
          static get scopedElements() {
            return {
              // @ts-expect-error
              ...super.scopedElements,
              'scoped-elm': ScopedEl,
            };
          }

          get slots() {
            return {
              ...super.slots,
              template: () => html`<scoped-elm></scoped-elm>`,
            };
          }

          render() {
            return html`<slot name="template"></slot>`;
          }
        },
      );

      const tag = unsafeStatic(tagName);
      await fixture(html`<${tag}></${tag}>`);

      expect(outputObj.createElementCallCount).to.equal(1);

      unMockScopedRegistry();
    });

    it('does not scope elements when polyfill not loaded', async () => {
      class ScopedEl extends LitElement {}

      const tagName = defineCE(
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

      const renderTarget = document.createElement('div');
      const el = document.createElement(tagName);

      // We don't use fixture, so we limit the amount of calls to document.createElement
      const docSpy = sinon.spy(document, 'createElement');
      document.body.appendChild(renderTarget);
      renderTarget.appendChild(el);

      expect(docSpy.callCount).to.equal(2);

      document.body.removeChild(renderTarget);
      docSpy.restore();
    });
  });
});
