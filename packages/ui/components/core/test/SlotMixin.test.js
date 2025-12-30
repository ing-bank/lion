import { defineCE, expect, fixture, fixtureSync, unsafeStatic, html } from '@open-wc/testing';
import { SlotMixin } from '@lion/ui/core.js';
import { LitElement } from 'lit';
import sinon from 'sinon';
import { moveUserProvidedDefaultSlottablesToTarget } from '../src/SlotMixin.js';

import { ScopedElementsMixin, supportsScopedRegistry } from '../src/ScopedElementsMixin.js';
import { isActiveElement } from '../test-helpers/isActiveElement.js';

/**
 * @typedef {import('../types/SlotMixinTypes.js').SlotHost} SlotHost
 */

describe('SlotMixin', () => {
  it('throws an error when used without a shadowRoot', async () => {
    const tag = defineCE(
      class extends SlotMixin(LitElement) {
        createRenderRoot() {
          return this;
        }

        get slots() {
          return {
            ...super.slots,
            feedback: () => html`<div></div>`,
          };
        }
      },
    );

    const el = document.createElement(tag);
    let thrownError;
    try {
      // Manually trigger the slot mixin connection to test the error
      el._connectSlotMixin();
    } catch (e) {
      thrownError = e;
    }
    expect(thrownError).to.be.an.instanceOf(Error);
    expect(thrownError.message).to.include(
      '[SlotMixin] SlotMixin requires a shadowRoot to render slots.',
    );
  });

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

  it('should move default slots to target', async () => {
    const target = document.createElement('div');
    const source = document.createElement('div');
    /**
     * Exmple of usage:
     * get slots() {
     *   return {
     *     _nothing: () => ({
     *       template: html`${nothing}`,
     *       renderAsDirectHostChild: true,
     *     }),
     *   }
     * }
     */
    const variableNothing = `
      <!--_start_slot_lit-el-->
      <!-- {lit-el} -->
      <!--_end_slot_lit-el-->`;

    /**
     * Exmple of usage:
     * get slots() {
     *   return {
     *     '': () => ({
     *       template: html`<div>text<div>`,
     *       renderAsDirectHostChild: true,
     *     }),
     *   }
     * }
     */
    const defaultSlottableProvidedViaSlotsGetter = `
      <!--_start_slot_-->
      <div>text</div>
      <!--_end_slot_-->
    `;

    /**
     * Exmple of usage:
     * get slots() {
     *   return {
     *     label: () => ({
     *       template: html`<div>text<div>`,
     *       renderAsDirectHostChild: true,
     *     }),
     *   }
     * }
     */
    const namedSlottable = `
      <!--_start_slot_label-->
      <div slot="label">text</div>
      <!--_end_slot_label-->
    `;

    /**
     * Here we assume .test1, .test2 and .test3 are the ones provided as content projection f.e.:
     * <my-comp>
     *  <div class="test1"><div>
     *  <div class="test2"><div>
     *  <div class="test3"><div>
     * </my-comp>
     *
     * And the rest of content is added via `slots` getter by SlotMixin
     * The function should move only content projection and ignore the rest
     * */

    source.innerHTML = `
      <div class="test1"></div>
      ${variableNothing}
      <div class="test2"></div>
      ${defaultSlottableProvidedViaSlotsGetter}
      <div class="test3"></div>
      ${namedSlottable}
    `;

    moveUserProvidedDefaultSlottablesToTarget(source, target);
    expect(target.children.length).to.equal(3);
    const test1Element = target.querySelector('.test1');
    const test2Element = target.querySelector('.test2');
    const test3Element = target.querySelector('.test3');
    expect(test1Element?.parentElement === target).to.equal(true);
    expect(test2Element?.parentElement === target).to.equal(true);
    expect(test3Element?.parentElement === target).to.equal(true);
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
                renderAsDirectHostChild: false,
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
      expect(isActiveElement(el._focusableNode)).to.be.true;

      el.currentValue = 1;
      await el.updateComplete;

      expect(isActiveElement(el._focusableNode)).to.be.true;
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

      expect(isActiveElement(el._focusableNode._buttonNode, { deep: true })).to.be.true;

      el.currentValue = 1;
      await el.updateComplete;

      expect(isActiveElement(el._focusableNode)).to.be.true;
      expect(isActiveElement(el._focusableNode._buttonNode, { deep: true })).to.be.true;
    });

    it('allows for rerendering complex shadow root into slot as a direct child', async () => {
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
                renderAsDirectHostChild: true,
              }),
            };
          }

          render() {
            return html`<slot name="focusable-node"></slot>`;
          }

          get _focusableNode() {
            return /** @type HTMLSpanElement */ (
              Array.from(this.children).find(elm => elm.slot === 'focusable-node')
            );
          }
        },
      );
      const el = /** @type {* & SlotHost} */ (await fixture(`<${tagName}></${tagName}>`));

      el._focusableNode._buttonNode.focus();

      expect(isActiveElement(el._focusableNode._buttonNode, { deep: true })).to.be.true;

      el.currentValue = 1;
      await el.updateComplete;

      expect(isActiveElement(el._focusableNode)).to.be.true;
      expect(isActiveElement(el._focusableNode._buttonNode, { deep: true })).to.be.true;
    });

    it('allows for switching template root in slot as a direct child', async () => {
      const tagName = defineCE(
        // @ts-expect-error
        class extends SlotMixin(LitElement) {
          static properties = { isSwitched: Boolean };

          constructor() {
            super();
            this.isSwitched = false;
          }

          get slots() {
            return {
              ...super.slots,
              'my-root-switcher-node': () => ({
                template: this.isSwitched
                  ? html`<div id="is-switched"></div>`
                  : html`<span id="is-not-switched"> </span> `,
                renderAsDirectHostChild: true,
              }),
            };
          }

          render() {
            return html`<slot name="my-root-switcher-node"></slot>`;
          }

          get _myRootSwitcherNode() {
            return /** @type HTMLSpanElement */ (
              Array.from(this.children).find(elm => elm.slot === 'my-root-switcher-node')
            );
          }
        },
      );
      const el = /** @type {* & SlotHost} */ (await fixture(`<${tagName}></${tagName}>`));

      expect(el._myRootSwitcherNode.id).to.equal('is-not-switched');
      expect(el.innerHTML).to.equal(
        `<!--_start_slot_my-root-switcher-node_--><!----><span id="is-not-switched" slot="my-root-switcher-node"> </span> <!--_end_slot_my-root-switcher-node_-->`,
      );

      el.isSwitched = true;
      await el.updateComplete;

      expect(el._myRootSwitcherNode.id).to.equal('is-switched');
      expect(el.innerHTML).to.equal(
        `<!--_start_slot_my-root-switcher-node_--><!----><div id="is-switched" slot="my-root-switcher-node"></div><!--_end_slot_my-root-switcher-node_-->`,
      );
    });

    describe('firstRenderOnConnected (for backwards compatibility)', () => {
      it('does render on connected when firstRenderOnConnected:true', async () => {
        // Start with elem that does not render on connectedCallback
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
                  firstRenderOnConnected: true,
                  template: html`<span>${this.currentValue}</span> `,
                }),
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
        const el = /** @type {* & SlotHost} */ (fixtureSync(`<${tag}></${tag}>`));
        expect(el._templateNode.slot).to.equal('template');
        expect(el._templateNode.textContent?.trim()).to.equal('0');
      });

      it('does not render on connected when firstRenderOnConnected:false', async () => {
        // Start with elem that does not render on connectedCallback
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
        const el = /** @type {* & SlotHost} */ (fixtureSync(`<${tag}></${tag}>`));
        expect(el._templateNode).to.be.undefined;
        await el.updateComplete;
        expect(el._templateNode.slot).to.equal('template');
        expect(el._templateNode.textContent?.trim()).to.equal('0');
      });
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
    it('supports scoped elements when scoped registries supported (or polyfill loaded)', async () => {
      if (!supportsScopedRegistry()) return;

      // @ts-expect-error
      const createElSpy = sinon.spy(ShadowRoot.prototype, 'createElement');

      class ScopedEl extends LitElement {}

      const tagName = defineCE(
        // @ts-ignore
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

      expect(createElSpy.callCount).to.equal(1);

      createElSpy.restore();
    });

    it('does not scope elements when scoped registries not supported (or polyfill not loaded)', async () => {
      if (supportsScopedRegistry()) return;

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
