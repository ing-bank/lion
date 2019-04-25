/* eslint-env mocha */
/* eslint-disable no-underscore-dangle, class-methods-use-this, no-unused-expressions */
import {
  expect,
  fixture,
  fixtureSync,
  nextFrame,
  aTimeout,
  defineCE,
  html,
} from '@open-wc/testing';
import sinon from 'sinon';
import { isDirective } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import {
  setupEmptyFakeImportsFor,
  resetFakeImport,
  fakeImport,
  setupFakeImport,
} from './test-utils.js';

import { localize } from '../src/localize.js';

import { LocalizeMixin } from '../src/LocalizeMixin.js';

const reset = () => {
  resetFakeImport();
  // makes sure that between tests the localization is reset to default state
  document.documentElement.lang = 'en-GB';
  localize.reset();
};

describe('LocalizeMixin', () => {
  reset();
  afterEach(async () => {
    reset();
  });

  it('loads namespaces defined in "get localizeNamespaces()" when created before attached to DOM', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`) };

    class MyElement extends LocalizeMixin(class {}) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      requestUpdate() {}
    }

    setupEmptyFakeImportsFor(['my-element'], ['en-GB']);

    const loadNamespaceSpy = sinon.spy(localize, 'loadNamespace');

    new MyElement(); // eslint-disable-line no-new
    expect(loadNamespaceSpy.callCount).to.equal(1);
    expect(loadNamespaceSpy.calledWith(myElementNs)).to.be.true;

    loadNamespaceSpy.restore();
  });

  it('ignores duplicates in "get localizeNamespaces()" chain', async () => {
    const defaultNs = { default: loc => fakeImport(`./default/${loc}.js`) };
    const parentElementNs = { 'parent-element': loc => fakeImport(`./parent-element/${loc}.js`) };
    const childElementNs = { 'child-element': loc => fakeImport(`./child-element/${loc}.js`) };

    class ParentElement extends LocalizeMixin(class {}) {
      static get localizeNamespaces() {
        return [parentElementNs, defaultNs, ...super.localizeNamespaces];
      }
    }

    class ChildElement extends LocalizeMixin(ParentElement) {
      static get localizeNamespaces() {
        return [childElementNs, defaultNs, ...super.localizeNamespaces];
      }
    }

    setupEmptyFakeImportsFor(['default', 'parent-element', 'child-element'], ['en-GB']);

    const loadNamespaceSpy = sinon.spy(localize, 'loadNamespace');

    new ChildElement(); // eslint-disable-line no-new
    expect(loadNamespaceSpy.callCount).to.equal(3);
    expect(loadNamespaceSpy.calledWith(childElementNs)).to.be.true;
    expect(loadNamespaceSpy.calledWith(defaultNs)).to.be.true;
    expect(loadNamespaceSpy.calledWith(parentElementNs)).to.be.true;

    loadNamespaceSpy.restore();
  });

  it('calls "onLocaleReady()" after namespaces were loaded for the first time (only if attached to DOM)', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`) };

    class MyElement extends LocalizeMixin(class {}) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      requestUpdate() {}

      onLocaleReady() {}
    }

    setupEmptyFakeImportsFor(['my-element'], ['en-GB']);

    const element = new MyElement();
    const onLocaleReadySpy = sinon.spy(element, 'onLocaleReady');

    await localize.loadingComplete;
    expect(onLocaleReadySpy.callCount).to.equal(0);

    element.connectedCallback();

    await localize.loadingComplete;
    expect(onLocaleReadySpy.callCount).to.equal(1);
  });

  it('calls "onLocaleChanged(newLocale, oldLocale)" after locale was changed (only if attached to DOM)', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`) };

    class MyElement extends LocalizeMixin(class {}) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      requestUpdate() {}

      onLocaleChanged() {}
    }

    setupEmptyFakeImportsFor(['my-element'], ['en-GB', 'nl-NL', 'ru-RU']);

    const element = new MyElement();
    const onLocaleChangedSpy = sinon.spy(element, 'onLocaleChanged');

    await localize.loadingComplete;

    localize.locale = 'nl-NL';
    await localize.loadingComplete;
    expect(onLocaleChangedSpy.callCount).to.equal(0);

    element.connectedCallback();

    localize.locale = 'ru-RU';
    await localize.loadingComplete;
    expect(onLocaleChangedSpy.callCount).to.equal(1);
    expect(onLocaleChangedSpy.calledWith('ru-RU', 'nl-NL')).to.be.true;
  });

  it('calls "onLocaleUpdated()" after both "onLocaleReady()" and "onLocaleChanged()"', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`) };

    class MyElement extends LocalizeMixin(class {}) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      requestUpdate() {}

      onLocaleUpdated() {}
    }

    setupEmptyFakeImportsFor(['my-element'], ['en-GB', 'nl-NL']);

    const el = new MyElement();
    const onLocaleUpdatedSpy = sinon.spy(el, 'onLocaleUpdated');

    el.connectedCallback();
    await el.localizeNamespacesLoaded;
    expect(onLocaleUpdatedSpy.callCount).to.equal(1);

    localize.locale = 'nl-NL';
    expect(onLocaleUpdatedSpy.callCount).to.equal(2);
  });

  it('should have the localizeNamespacesLoaded avaliable within "onLocaleUpdated()"', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`) };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        label: 'one',
      },
    });
    setupFakeImport('./my-element/nl-NL.js', {
      default: {
        label: 'two',
      },
    });
    class MyElement extends LocalizeMixin(class {}) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      requestUpdate() {}

      async onLocaleUpdated() {
        super.onLocaleUpdated();
        await this.localizeNamespacesLoaded;
        this.label = localize.msg('my-element:label');
      }
    }

    const el = new MyElement();
    el.connectedCallback();

    await el.localizeNamespacesLoaded;
    await nextFrame(); // needed as both are added to the micro task que
    expect(el.label).to.equal('one');

    localize.locale = 'nl-NL';
    await el.localizeNamespacesLoaded;
    expect(el.label).to.equal('two');
  });

  it('calls "requestUpdate()" after locale was changed', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`) };

    class MyElement extends LocalizeMixin(class {}) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      requestUpdate() {}
    }

    setupEmptyFakeImportsFor(['my-element'], ['en-GB']);

    const el = new MyElement();
    const updateSpy = sinon.spy(el, 'requestUpdate');

    el.connectedCallback();
    await el.localizeNamespacesLoaded;

    localize.locale = 'nl-NL';
    expect(updateSpy.callCount).to.equal(1);
  });

  it('has msg() which integrates with lit-html', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`) };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        greeting: 'Hi!',
      },
    });

    class MyElement extends LocalizeMixin(class {}) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }
    }

    const element = new MyElement();
    const lionLocalizeMessageSpy = sinon.spy(localize, 'msg');

    const messageDirective = element.msgLit('my-element:greeting');
    expect(lionLocalizeMessageSpy.callCount).to.equal(0);

    expect(isDirective(messageDirective)).to.be.true;

    await aTimeout(1); // wait for directive to "resolve"

    expect(lionLocalizeMessageSpy.callCount).to.equal(1);
    expect(lionLocalizeMessageSpy.calledWith('my-element:greeting')).to.be.true;

    const message = element.msgLit('my-element:greeting');
    expect(message).to.equal('Hi!');
    expect(typeof message).to.equal('string');
    expect(lionLocalizeMessageSpy.callCount).to.equal(2);
    expect(lionLocalizeMessageSpy.calledWith('my-element:greeting')).to.be.true;

    lionLocalizeMessageSpy.restore();
  });

  it('has a Promise "localizeNamespacesLoaded" which resolves once tranlations are available', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`, 25) };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        greeting: 'Hi!',
      },
    });

    class MyElement extends LocalizeMixin(class {}) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      requestUpdate() {}
    }
    const el = new MyElement();

    const messageDirective = el.msgLit('my-element:greeting');
    expect(isDirective(messageDirective)).to.be.true;

    await el.localizeNamespacesLoaded;
    expect(el.msgLit('my-element:greeting')).to.equal('Hi!');
  });

  it('renders only once all translations have been loaded (if BaseElement supports it)', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`, 25) };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        greeting: 'Hi!',
      },
    });

    const tag = defineCE(
      class extends LocalizeMixin(LionLitElement) {
        static get localizeNamespaces() {
          return [myElementNs, ...super.localizeNamespaces];
        }

        render() {
          return html`
            <p>${this.msgLit('my-element:greeting')}</p>
          `;
        }
      },
    );

    const el = await fixtureSync(`<${tag}></${tag}>`);
    expect(el.shadowRoot.children.length).to.equal(0);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('p').innerText).to.equal('Hi!');
  });

  it('rerender on locale change once all translations are loaded (if BaseElement supports it)', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`, 25) };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        greeting: 'Hi!',
      },
    });
    setupFakeImport('./my-element/en-US.js', {
      default: {
        greeting: 'Howdy!',
      },
    });

    // eslint-disable-next-line max-len
    const tag = defineCE(
      class TestPromise extends LocalizeMixin(LionLitElement) {
        static get localizeNamespaces() {
          return [myElementNs, ...super.localizeNamespaces];
        }

        render() {
          return html`
            <p>${this.msgLit('my-element:greeting')}</p>
          `;
        }
      },
    );

    const el = await fixture(`<${tag}></${tag}>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('p').innerText).to.equal('Hi!');

    localize.locale = 'en-US';
    expect(el.shadowRoot.querySelector('p').innerText).to.equal('Hi!');
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('p').innerText).to.equal('Howdy!');
  });

  it('it can still render async by setting "static get waitForLocalizeNamespaces() { return false; }" (if BaseElement supports it)', async () => {
    const myElementNs = { 'my-element': locale => fakeImport(`./my-element/${locale}.js`, 50) };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        greeting: 'Hi!',
      },
    });

    const tag = defineCE(
      class extends LocalizeMixin(LionLitElement) {
        static get waitForLocalizeNamespaces() {
          return false;
        }

        static get localizeNamespaces() {
          return [myElementNs, ...super.localizeNamespaces];
        }

        render() {
          return html`
            <p>${this.msgLit('my-element:greeting')}</p>
          `;
        }
      },
    );

    const el = await fixture(`<${tag}></${tag}>`);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('p').innerText).to.equal('');
    await el.localizeNamespacesLoaded;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector('p').innerText).to.equal('Hi!');
  });
});
