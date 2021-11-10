import { defineCE, expect, fixture, html, unsafeStatic } from '@open-wc/testing';
import sinon from 'sinon';
import { LitElement } from '../index.js';
import { DelegateMixin } from '../src/DelegateMixin.js';

describe('DelegateMixin', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('delegates events', async () => {
    const tag = defineCE(
      class extends DelegateMixin(LitElement) {
        get delegations() {
          return {
            ...super.delegations,
            target: () => this.shadowRoot?.getElementById('button1'),
            events: ['click'],
          };
        }

        render() {
          return html`<button id="button1">with delegation</button>`;
        }
      },
    );
    const element = await fixture(`<${tag}></${tag}>`);
    const cb = sinon.spy();
    element.addEventListener('click', cb);
    element.shadowRoot?.getElementById('button1')?.click();
    expect(cb.callCount).to.equal(1);
  });

  it('delegates events before delegation target is attached to DOM', async () => {
    const tag = defineCE(
      class extends DelegateMixin(LitElement) {
        get delegations() {
          return {
            ...super.delegations,
            target: () => this.shadowRoot?.getElementById('button1'),
            events: ['click'],
          };
        }

        render() {
          return html`<button id="button1">with delegation</button>`;
        }
      },
    );
    const element = /** @type {LitElement} */ (document.createElement(tag));
    const cb = sinon.spy();
    element.addEventListener('click', cb);
    document.body.appendChild(element);
    await element.updateComplete;
    element.shadowRoot?.getElementById('button1')?.click();
    expect(cb.callCount).to.equal(1);

    // cleanup
    document.body.removeChild(element);
  });

  it('delegates if light and shadow dom is used at the same time', async () => {
    const tag = defineCE(
      class extends DelegateMixin(LitElement) {
        get delegations() {
          return {
            ...super.delegations,
            target: () => Array.from(this.children).find(child => child.slot === 'button'),
            events: ['click'],
            methods: ['click'],
          };
        }

        render() {
          return html`
            <span>Outside</span>
            <slot name="button2"></slot>
          `;
        }
      },
    );

    const element = await fixture(`<${tag}><button slot="button">click me</button></${tag}>`);
    const cb = sinon.spy();
    element.addEventListener('click', cb);
    const childEl = /** @type {HTMLElement} */ (
      Array.from(element.children)?.find(child => child.slot === 'button')
    );
    childEl?.click();
    expect(cb.callCount).to.equal(1);
  });

  it('will still support other events', async () => {
    class FooDelegate extends DelegateMixin(LitElement) {
      get delegations() {
        return {
          ...super.delegations,
          target: () => this.shadowRoot?.getElementById('button1'),
          events: ['click'],
        };
      }

      render() {
        return html`<button id="button1">with delegation</button>`;
      }

      foo() {
        this.dispatchEvent(new CustomEvent('foo-event', { bubbles: true, composed: true }));
      }
    }

    const tag = defineCE(FooDelegate);
    const element = /** @type {FooDelegate} */ (await fixture(`<${tag}></${tag}>`));
    const cb = sinon.spy();
    element.addEventListener('foo-event', cb);
    element.foo();
    expect(cb.callCount).to.equal(1);
  });

  it('will call delegated methods', async () => {
    const tag = defineCE(
      class extends DelegateMixin(LitElement) {
        get delegations() {
          return {
            ...super.delegations,
            target: () => this.shadowRoot?.getElementById('button1'),
            methods: ['click'],
          };
        }

        render() {
          return html`<button id="button1">with delegation</button>`;
        }
      },
    );
    const element = /** @type {HTMLElement} */ (await fixture(`<${tag}></${tag}>`));
    const cb = sinon.spy();
    element.shadowRoot?.getElementById('button1')?.addEventListener('click', cb);
    element.click();
    expect(cb.callCount).to.equal(1);
  });

  it('supports arguments for delegated methods', async () => {
    class DelegateArgumentSub extends LitElement {
      constructor() {
        super();
        this.foo = { a: 'a', b: 'b' };
      }

      /**
       * @param {?} a
       * @param {?} b
       */
      setFooAandB(a, b) {
        this.foo.a = a;
        this.foo.b = b;
      }
    }
    customElements.define('delegate-argument-sub', DelegateArgumentSub);

    class DelegateArgumentParent extends DelegateMixin(LitElement) {
      get delegations() {
        return {
          ...super.delegations,
          target: () => this.shadowRoot?.getElementById('sub'),
          methods: ['setFooAandB'],
        };
      }

      render() {
        return html`<delegate-argument-sub id="sub"></delegate-argument-sub>`;
      }
    }
    const tag = defineCE(DelegateArgumentParent);

    const element = /** @type {DelegateArgumentParent} */ (await fixture(`<${tag}></${tag}>`));

    // @ts-ignore because this method, even though it doesn't exist on the parent, gets delegated through delegations to the child, where it does exist!
    element.setFooAandB('newA', 'newB');

    const sub = /** @type {DelegateArgumentSub} */ (element.shadowRoot?.getElementById('sub'));
    expect(sub.foo.a).to.equal('newA');
    expect(sub.foo.b).to.equal('newB');
  });

  it('will set delegated properties', async () => {
    class PropDelegate extends DelegateMixin(LitElement) {
      get delegations() {
        return {
          ...super.delegations,
          target: () => this.shadowRoot?.getElementById('button1'),
          properties: ['disabled'],
        };
      }

      render() {
        return html`<button id="button1">with delegation</button>`;
      }
    }
    const tag = defineCE(PropDelegate);
    const element = /** @type {PropDelegate} */ (await fixture(`<${tag}></${tag}>`));

    // @ts-ignore ignoring this one, because disabled is delegated through target so it indeed does not inherently exist on the div element
    element.disabled = true;

    await element.updateComplete;

    /** @typedef {Object.<string,boolean>} Btn */
    /** @typedef {Btn & HTMLElement} DelegatedBtn */
    const btn = /** @type {DelegatedBtn} */ (element.shadowRoot?.getElementById('button1'));
    expect(btn?.disabled).to.equal(true);
    expect(btn?.hasAttribute('disabled')).to.equal(true);
  });

  it('delegates properties before delegation target is attached to DOM', async () => {
    const tag = defineCE(
      class extends DelegateMixin(LitElement) {
        get delegations() {
          return {
            ...super.delegations,
            target: () => this.shadowRoot?.getElementById('button1'),
            properties: ['disabled'],
          };
        }

        render() {
          return html`<button id="button1">with delegation</button>`;
        }
      },
    );
    /** @typedef {Object.<string,boolean>} Btn */
    /** @typedef {Btn & LitElement} DelegatedEl */
    const element = /** @type {DelegatedEl} */ (document.createElement(tag));

    element.disabled = true;
    document.body.appendChild(element);
    await element.updateComplete;

    /** @typedef {Btn & HTMLElement} DelegatedBtn */
    const btn = /** @type {DelegatedBtn} */ (element.shadowRoot?.getElementById('button1'));

    expect(btn?.disabled).to.equal(true);
    // cleanup
    document.body.removeChild(element);
  });

  it('will delegate setAttribute', async () => {
    const tag = defineCE(
      class extends DelegateMixin(LitElement) {
        get delegations() {
          return {
            ...super.delegations,
            target: () => this.shadowRoot?.getElementById('button1'),
            attributes: ['disabled'],
          };
        }

        render() {
          return html`<button id="button1">with delegation</button>`;
        }
      },
    );
    const element = /** @type {LitElement} */ (await fixture(`<${tag}></${tag}>`));
    element.setAttribute('disabled', '');
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).to.equal(false);
    expect(element.shadowRoot?.getElementById('button1')?.hasAttribute('disabled')).to.equal(true);
  });

  it('will read inital attributes', async () => {
    const tag = defineCE(
      class extends DelegateMixin(LitElement) {
        get delegations() {
          return {
            ...super.delegations,
            target: () => this.shadowRoot?.getElementById('button1'),
            attributes: ['disabled'],
          };
        }

        render() {
          return html`<button id="button1">with delegation</button>`;
        }
      },
    );
    const element = await fixture(`<${tag} disabled></${tag}>`);
    expect(element.hasAttribute('disabled')).to.equal(false);
    expect(element.shadowRoot?.getElementById('button1')?.hasAttribute('disabled')).to.equal(true);
  });

  it('will delegate removeAttribute', async () => {
    const tag = defineCE(
      class extends DelegateMixin(LitElement) {
        get delegations() {
          return {
            ...super.delegations,
            target: () => this.shadowRoot?.getElementById('button1'),
            attributes: ['disabled'],
          };
        }

        render() {
          return html`<button id="button1">with delegation</button>`;
        }
      },
    );
    const element = /** @type {LitElement} */ (await fixture(`<${tag} disabled></${tag}>`));
    element.removeAttribute('disabled');
    await element.updateComplete;
    expect(element.hasAttribute('disabled')).to.equal(false);
    expect(element.shadowRoot?.getElementById('button1')?.hasAttribute('disabled')).to.equal(false);
  });

  it('respects user defined values for delegated attributes and properties', async () => {
    class ScheduledElement extends DelegateMixin(LitElement) {
      get delegations() {
        return {
          ...super.delegations,
          // this just means itś config is set to the queue when called before connectedCallback
          target: () => this.scheduledElement,
          attributes: ['type'],
          properties: ['type'],
        };
      }

      get scheduledElement() {
        return this.querySelector('input');
      }

      constructor() {
        super();
        this.type = 'email'; // 1. here we set the delegated prop and it should be scheduled
      }

      connectedCallback() {
        // 2. this is where we add teh delegation target (so after 1)
        this.appendChild(document.createElement('input'));
        super.connectedCallback(); // let the DelegateMixin do its work
      }
    }

    const tag = defineCE(ScheduledElement);
    const tagName = unsafeStatic(tag);

    // Here, the Application Developerd tries to set the type via attribute
    const elementAttr = /** @type {ScheduledElement} */ (
      await fixture(`<${tag} type="radio"></${tag}>`)
    );
    expect(elementAttr.scheduledElement?.type).to.equal('radio');
    // Here, the Application Developer tries to set the type via property
    const elementProp = /** @type {ScheduledElement} */ (
      await fixture(html`<${tagName} .type=${'radio'}></${tagName}>`)
    );
    expect(elementProp.scheduledElement?.type).to.equal('radio');
  });

  it(`uses attribute value as a fallback for delegated property getter
    when property not set by user and delegationTarget not ready`, async () => {
    class FallbackEl extends DelegateMixin(LitElement) {
      get delegations() {
        return {
          ...super.delegations,
          target: () => this.delegatedEl,
          properties: ['type'],
          attributes: ['type'],
        };
      }

      get delegatedEl() {
        // returns null, so we can test that "cached" attr is used as fallback
        return null;
      }
    }
    const tag = defineCE(FallbackEl);
    const element = /** @type {FallbackEl} */ (await fixture(`<${tag} type="radio"></${tag}>`));
    expect(element.delegatedEl).to.equal(null);
    // @ts-ignore ignoring this one, because type is delegated through target so it indeed does not inherently exist on the div element
    expect(element.type).to.equal('radio'); // value retrieved from host instead of delegatedTarget
  });

  it('works with connectedCallback', async () => {
    class ConnectedElement extends DelegateMixin(LitElement) {
      get delegations() {
        return {
          ...super.delegations,
          target: () => this.querySelector('div'),
          properties: ['foo'],
        };
      }
    }
    const tag = await defineCE(ConnectedElement);
    const element = /** @type {ConnectedElement} */ (await fixture(`<${tag}><div></div></${tag}>`));

    // @ts-ignore ignoring this one, because foo is delegated through target so it indeed does not inherently exist on the div element
    element.foo = 'new';
    // @ts-ignore ignoring this one, because foo is delegated through target so it indeed does not inherently exist on the div element
    expect(element.querySelector('div')?.foo).to.equal('new');
  });

  it('works with shadow dom', async () => {
    class A extends DelegateMixin(LitElement) {
      get delegations() {
        return {
          ...super.delegations,
          target: () => this.shadowRoot?.querySelector('div'),
          properties: ['foo'],
        };
      }

      render() {
        return html`<div></div>`;
      }
    }
    const tag = await defineCE(A);
    const element = await fixture(`<${tag}></${tag}>`);

    // @ts-ignore ignoring this one, because foo is delegated through target so it indeed does not inherently exist on the div element
    element.foo = 'new';
    // @ts-ignore ignoring this one, because foo is delegated through target so it indeed does not inherently exist on the div element
    expect(element.shadowRoot?.querySelector('div')?.foo).to.equal('new');
  });

  it('works with light dom', async () => {
    class A extends DelegateMixin(LitElement) {
      get delegations() {
        return {
          ...super.delegations,
          target: () => this.querySelector('div'),
          properties: ['foo'],
        };
      }

      createRenderRoot() {
        return this;
      }

      render() {
        return html`<div></div>`;
      }
    }

    const tag = await defineCE(A);
    const element = await fixture(`<${tag}></${tag}>`);
    // @ts-ignore ignoring this one, because foo is delegated through target so it indeed does not inherently exist on the div element
    element.foo = 'new';
    // @ts-ignore ignoring this one, because foo is delegated through target so it indeed does not inherently exist on the div element
    expect(element.querySelector('div')?.foo).to.equal('new');
  });
});
