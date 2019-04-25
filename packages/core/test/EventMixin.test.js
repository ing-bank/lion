/* eslint-env mocha */
/* eslint-disable no-unused-expressions, class-methods-use-this */
import { expect, fixture, html, defineCE } from '@open-wc/testing';
import { LionLitElement } from '../src/LionLitElement.js';

import { EventMixin } from '../src/EventMixin.js';

describe('EventMixin', () => {
  before(() => {
    class EventMixinSub extends LionLitElement {
      static get properties() {
        return {
          value: {
            type: 'String',
            asAttribute: 'value',
          },
        };
      }

      _requestUpdate(propName) {
        super._requestUpdate();
        if (propName === 'value') {
          this.dispatchEvent(new CustomEvent('value-changed', { bubbles: true, composed: true }));
        }
      }
    }
    customElements.define('event-mixin-sub', EventMixinSub);

    /* global  */
    class EventMixinTag extends EventMixin(LionLitElement) {
      get events() {
        return {
          ...super.events,
          _onSelfClick: [() => this, 'click'],
          _onButton1Click: [() => this.$id('button1'), 'click'],
          _onSub1Click: [() => this.$id('sub1'), 'click'],
          _onSub1Input: [() => this.$id('sub1'), 'value-changed'],
        };
      }

      // eslint-disable-next-line class-methods-use-this
      render() {
        return html`
          <button id="button1">with click event</button>
          <event-mixin-sub type="text" id="sub1"></event-mixin-sub>
          <button id="button3">no event</button>
        `;
      }

      constructor() {
        super();
        this.button1ClickCount = 0;
        this.sub1ValueChangeCount = 0;
        this.selfClick = 0;
      }

      _onButton1Click() {
        this.button1ClickCount += 1;
      }

      _onSub1Click() {
        this.$id('sub1').value = 'you clicked me';
      }

      _onSub1Input() {
        this.sub1ValueChangeCount += 1;
      }

      _onSelfClick() {
        this.selfClick += 1;
      }
    }
    customElements.define('event-mixin', EventMixinTag);
  });

  it('can adding an event that gets triggered', async () => {
    const element = await fixture(`<event-mixin></event-mixin>`);
    element.$id('button1').click();
    expect(element.button1ClickCount).to.equal(1);
  });

  it('can add events to itself', async () => {
    const element = await fixture(`<event-mixin></event-mixin>`);
    element.click();
    expect(element.selfClick).to.equal(1);
  });

  it('can add events to window', async () => {
    const tag = defineCE(
      class extends EventMixin(HTMLElement) {
        get events() {
          return {
            _onMyCustomEvent: [() => window, 'my-custom-event'],
          };
        }

        _onMyCustomEvent() {
          this.fired = true;
        }
      },
    );

    const element = await fixture(`<${tag}></${tag}>`);
    expect(element.fired).to.equal(undefined);

    window.dispatchEvent(new Event('my-custom-event'));
    await element.updateComplete;
    expect(element.fired).to.equal(true);

    // this will clear it's state on window
    delete window.__eventMixinProcessed; // eslint-disable-line no-underscore-dangle
  });

  it('supports multiple different events for a single node', async () => {
    const element = await fixture(`<event-mixin></event-mixin>`);
    element.$id('sub1').click();
    await element.updateComplete;
    expect(element.$id('sub1').value).to.equal('you clicked me');

    element.$id('sub1').value = 'new';
    await element.updateComplete;
    expect(element.$id('sub1').value).to.equal('new');
    expect(element.sub1ValueChangeCount).to.equal(2);
  });

  it('supports multiple different events with a single function', async () => {
    class MultiEvents extends EventMixin(HTMLElement) {
      get events() {
        return {
          doIt: [() => this.lightDomInput, ['click', 'change']],
        };
      }

      constructor() {
        super();
        this.doItCounter = 0;
      }

      doIt() {
        this.doItCounter += 1;
      }

      connectedCallback() {
        this.lightDomInput = this.querySelector('input');
        this.__registerEvents(); // eslint-disable-line
      }
    }
    customElements.define('multi-events', MultiEvents);
    const element = await fixture(`<multi-events><input /></multi-events>`);

    expect(element.doItCounter).to.equal(0);

    element.lightDomInput.click();
    element.lightDomInput.value = 'foo';
    element.lightDomInput.dispatchEvent(new Event('change'));

    await element.updateComplete;
    expect(element.doItCounter).to.equal(2);
  });

  it('supports multiple functions per event for a single node', async () => {
    class MultiFunctions extends EventMixin(HTMLElement) {
      get events() {
        return {
          _onClick: [() => this.lightDomButton, 'click'],
          _loggging: [() => this.lightDomButton, 'click'],
        };
      }

      _onClick() {
        this.clicked = true;
      }

      _loggging() {
        this.logged = true;
      }

      connectedCallback() {
        this.lightDomButton = this.querySelector('button');
        this.__registerEvents(); // eslint-disable-line
      }
    }
    customElements.define('multi-functions', MultiFunctions);

    const element = await fixture(`<multi-functions><button>click</button></multi-functions>`);
    expect(element.clicked).to.equal(undefined);
    expect(element.logged).to.equal(undefined);

    element.lightDomButton.click();
    await element.updateComplete;
    expect(element.clicked).to.equal(true);
    expect(element.logged).to.equal(true);
  });

  it('will not add same event/function multiple times to a node', async () => {
    const element = await fixture(`<event-mixin></event-mixin>`);
    element.__registerEvents(); // eslint-disable-line
    element.__registerEvents(); // eslint-disable-line
    expect(element.__eventsCache.length).to.equal(4); // eslint-disable-line
  });

  it('will cleanup events', async () => {
    // we can't test this properly as according to spec there is no way to get
    // a list of attached event listeners
    // in dev tools you can use getEventListeners but that is not available globally
    // so we are at least testing our implementation
    const element = await fixture(`<event-mixin></event-mixin>`);
    element.__unregisterEvents(); // eslint-disable-line
    expect(element.__eventsCache.length).to.equal(0); // eslint-disable-line
  });

  it('reregisters events if dom node is moved', async () => {
    const tag = defineCE(
      class extends EventMixin(HTMLElement) {
        get events() {
          return {
            _onClick: [() => this.querySelector('button'), 'click'],
          };
        }

        constructor() {
          super();
          this.myCallCount = 0;
        }

        _onClick() {
          this.myCallCount += 1;
        }
      },
    );
    const el = await fixture(`<${tag}><button>click</button></${tag}>`);
    el.querySelector('button').click();
    expect(el.myCallCount).to.equal(1);

    const wrapper = await fixture(`<div></div>`);
    wrapper.appendChild(el);
    el.querySelector('button').click();
    expect(el.myCallCount).to.equal(2);
  });
});
