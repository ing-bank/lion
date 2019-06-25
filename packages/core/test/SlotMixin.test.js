import { expect, fixture, defineCE, html } from '@open-wc/testing';

import { SlotMixin } from '../src/SlotMixin.js';

describe('SlotMixin', () => {
  it('inserts provided element into lightdom and sets slot', async () => {
    const tag = defineCE(
      class extends SlotMixin(HTMLElement) {
        get slots() {
          return {
            ...super.slots,
            feedback: () => document.createElement('div'),
          };
        }
      },
    );
    const element = await fixture(`<${tag}></${tag}>`);
    expect(element.children[0].slot).to.equal('feedback');
  });

  it('does not override user provided slots', async () => {
    const tag = defineCE(
      class extends SlotMixin(HTMLElement) {
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
    expect(el.children[0].innerText).to.equal('user-content');
  });

  it('supports complex dom trees as element', async () => {
    const tag = defineCE(
      class extends SlotMixin(HTMLElement) {
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
    const element = await fixture(`<${tag}></${tag}>`);
    expect(element.children[0].slot).to.equal('feedback');
    expect(element.children[0].getAttribute('foo')).to.equal('bar');
    expect(element.children[0].children[0].innerText).to.equal('cat');
  });

  it('supports conditional slots', async () => {
    let renderSlot = true;
    const tag = defineCE(
      class extends SlotMixin(HTMLElement) {
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
    const elementSlot = await fixture(`<${tag}><${tag}>`);
    expect(elementSlot.querySelector('#someSlot')).to.exist;
    renderSlot = false;
    const elementNoSlot = await fixture(`<${tag}><${tag}>`);
    expect(elementNoSlot.querySelector('#someSlot')).to.not.exist;
  });

  it("allows to check which slots have been created via this._isPrivateSlot('slotname')", async () => {
    let renderSlot = true;
    const tag = defineCE(
      class extends SlotMixin(HTMLElement) {
        get slots() {
          return {
            ...super.slots,
            conditional: () => (renderSlot ? document.createElement('div') : undefined),
          };
        }

        didCreateConditionalSlot() {
          return this._isPrivateSlot('conditional');
        }
      },
    );
    const el = await fixture(`<${tag}><${tag}>`);
    expect(el.didCreateConditionalSlot()).to.be.true;
    const elUserSlot = await fixture(`<${tag}><p slot="conditional">foo</p><${tag}>`);
    expect(elUserSlot.didCreateConditionalSlot()).to.be.false;
    renderSlot = false;
    const elNoSlot = await fixture(`<${tag}><${tag}>`);
    expect(elNoSlot.didCreateConditionalSlot()).to.be.false;
  });

  it('allows to provide a TemplateResults as content', async () => {
    const tag = defineCE(
      class extends SlotMixin(HTMLElement) {
        get slots() {
          return {
            ...super.slots,
            lit: () =>
              html`
                <div>${'TemplateResult'}</div>
              `,
          };
        }
      },
    );
    const el = await fixture(`<${tag}><${tag}>`);
    expect(el.querySelector('[slot="lit"]').innerHTML).to.equal('<!---->TemplateResult<!---->');
  });
});
