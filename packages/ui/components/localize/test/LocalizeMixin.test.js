import { LitElement } from 'lit';
import { isDirectiveResult } from 'lit/directive-helpers.js';

import {
  aTimeout,
  defineCE,
  expect,
  fixture,
  fixtureSync,
  html,
  nextFrame,
  unsafeStatic,
} from '@open-wc/testing';
import sinon from 'sinon';
import { LocalizeMixin, getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import {
  fakeImport,
  localizeTearDown,
  resetFakeImport,
  setupEmptyFakeImportsFor,
  setupFakeImport,
} from '@lion/ui/localize-test-helpers.js';

/**
 * @typedef {import('../types/LocalizeMixinTypes.js').LocalizeMixin} LocalizeMixinHost
 */

describe('LocalizeMixin', () => {
  const localizeManager = getLocalizeManager();

  afterEach(() => {
    resetFakeImport();
    localizeTearDown();
  });

  it('loads namespaces defined in "get localizeNamespaces()" when created before attached to DOM', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`),
    };

    const tagString = defineCE(
      class MyElement extends LocalizeMixin(LitElement) {
        static get localizeNamespaces() {
          return [myElementNs, ...super.localizeNamespaces];
        }
      },
    );
    const tag = unsafeStatic(tagString);

    setupEmptyFakeImportsFor(['my-element'], ['en-GB']);

    const loadNamespaceSpy = sinon.spy(localizeManager, 'loadNamespace');
    await fixture(html`<${tag}></${tag}>`);

    expect(loadNamespaceSpy.callCount).to.equal(1);
    expect(loadNamespaceSpy.calledWith(myElementNs)).to.be.true;

    loadNamespaceSpy.restore();
  });

  it('ignores duplicates in "get localizeNamespaces()" chain', async () => {
    const defaultNs = {
      /** @param {string} loc */
      default: loc => fakeImport(`./default/${loc}.js`),
    };
    const parentElementNs = {
      /** @param {string} loc */
      'parent-element': loc => fakeImport(`./parent-element/${loc}.js`),
    };
    const childElementNs = {
      /** @param {string} loc */
      'child-element': loc => fakeImport(`./child-element/${loc}.js`),
    };

    class ParentElement extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [parentElementNs, defaultNs, ...super.localizeNamespaces];
      }
    }

    const tagString = defineCE(
      class ChildElement extends LocalizeMixin(ParentElement) {
        static get localizeNamespaces() {
          return [childElementNs, defaultNs, ...super.localizeNamespaces];
        }
      },
    );
    const tag = unsafeStatic(tagString);

    setupEmptyFakeImportsFor(['default', 'parent-element', 'child-element'], ['en-GB']);

    const loadNamespaceSpy = sinon.spy(localizeManager, 'loadNamespace');

    await fixture(html`<${tag}></${tag}>`);
    expect(loadNamespaceSpy.callCount).to.equal(3);
    expect(loadNamespaceSpy.calledWith(childElementNs)).to.be.true;
    expect(loadNamespaceSpy.calledWith(defaultNs)).to.be.true;
    expect(loadNamespaceSpy.calledWith(parentElementNs)).to.be.true;

    loadNamespaceSpy.restore();
  });

  it('calls "onLocaleReady()" after namespaces were loaded for the first time (only if attached to DOM)', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`),
    };

    class MyElement extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      onLocaleReady() {}
    }
    const tagString = defineCE(MyElement);

    setupEmptyFakeImportsFor(['my-element'], ['en-GB']);

    const el = /** @type {MyElement} */ (document.createElement(tagString));
    const wrapper = await fixture('<div></div>');
    const onLocaleReadySpy = sinon.spy(el, 'onLocaleReady');

    await el.localizeNamespacesLoaded;
    expect(onLocaleReadySpy.callCount).to.equal(0);

    wrapper.appendChild(el);

    await el.localizeNamespacesLoaded;
    expect(onLocaleReadySpy.callCount).to.equal(1);
  });

  it('calls "onLocaleChanged(newLocale, oldLocale)" after locale was changed (only if attached to DOM)', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`),
    };

    class MyOtherElement extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }
    }

    const tagString = defineCE(MyOtherElement);

    setupEmptyFakeImportsFor(['my-element'], ['en-GB', 'nl-NL', 'ru-RU']);

    const el = /** @type {MyOtherElement} */ (document.createElement(tagString));
    const wrapper = await fixture('<div></div>');
    const onLocaleChangedSpy = sinon.spy(el, 'onLocaleChanged');

    await el.localizeNamespacesLoaded;

    localizeManager.locale = 'nl-NL';
    await el.localizeNamespacesLoaded;
    expect(onLocaleChangedSpy.callCount).to.equal(0);

    // Appending to DOM will result in onLocaleChanged to be invoked
    wrapper.appendChild(el);

    // Changing locale will result in onLocaleChanged to be invoked
    localizeManager.locale = 'ru-RU';
    await el.localizeNamespacesLoaded;
    expect(onLocaleChangedSpy.callCount).to.equal(2);
    expect(onLocaleChangedSpy.calledWithExactly('ru-RU', 'nl-NL')).to.be.true;
  });

  it('dispatches "localeChanged" after loader promises have resolved, allowing to call .msg() immediately', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`),
    };

    class MyOtherElement extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      /**
       * @param {string} newLocale
       * @param {string} oldLocale
       */
      onLocaleChanged(newLocale, oldLocale) {
        super.onLocaleChanged(newLocale, oldLocale);

        // Can call localizeManager.msg immediately, without having to await localizeManager.loadingComplete
        // This is because localeChanged event is fired only after awaiting loading
        // unless the user disables _autoLoadOnLocaleChange property
        this.foo = localizeManager.msg('my-element:foo');
      }
    }

    const tagString = defineCE(MyOtherElement);

    setupEmptyFakeImportsFor(['my-element'], ['en-GB', 'nl-NL', 'ru-RU']);

    const el = /** @type {MyOtherElement} */ (document.createElement(tagString));
    const wrapper = await fixture('<div></div>');
    wrapper.appendChild(el);

    localizeManager.locale = 'nl-NL';
    await el.localizeNamespacesLoaded;
    expect(el.foo).to.equal('bar-nl-NL');

    localizeManager.locale = 'ru-RU';
    await el.localizeNamespacesLoaded;
    expect(el.foo).to.equal('bar-ru-RU');
  });

  it('calls "onLocaleUpdated()" after both "onLocaleReady()" and "onLocaleChanged()"', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`),
    };

    class MyElement extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      onLocaleUpdated() {}
    }

    const tagString = defineCE(MyElement);

    setupEmptyFakeImportsFor(['my-element'], ['en-GB', 'nl-NL']);

    const el = /** @type {MyElement} */ (document.createElement(tagString));
    const wrapper = await fixture('<div></div>');
    const onLocaleUpdatedSpy = sinon.spy(el, 'onLocaleUpdated');

    wrapper.appendChild(el);
    await el.localizeNamespacesLoaded;
    expect(onLocaleUpdatedSpy.callCount).to.equal(1);

    localizeManager.locale = 'nl-NL';
    await el.localizeNamespacesLoaded;
    expect(onLocaleUpdatedSpy.callCount).to.equal(2);
  });

  it('should have the localizeNamespacesLoaded available within "onLocaleUpdated()"', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`),
    };
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

    class MyElement extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      async onLocaleUpdated() {
        super.onLocaleUpdated();
        this.label = localizeManager.msg('my-element:label');
      }
    }

    const tagString = defineCE(MyElement);
    const el = /** @type {MyElement} */ (document.createElement(tagString));
    el.connectedCallback();

    await nextFrame(); // needed as both are added to the micro task que
    expect(el.label).to.equal('one');

    localizeManager.locale = 'nl-NL';
    await el.localizeNamespacesLoaded;
    expect(el.label).to.equal('two');
  });

  it('calls "requestUpdate()" after locale was changed', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`),
    };

    class MyElement extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }
    }

    setupEmptyFakeImportsFor(['my-element'], ['en-GB']);

    const tagString = defineCE(MyElement);
    const el = /** @type {MyElement} */ (document.createElement(tagString));
    const updateSpy = sinon.spy(el, 'requestUpdate');

    el.connectedCallback();

    localizeManager.locale = 'nl-NL';
    await el.localizeNamespacesLoaded;

    // await next frame for requestUpdate to be fired
    await nextFrame();
    expect(updateSpy.callCount).to.equal(1);
  });

  it('has msgLit() which integrates with lit-html', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`),
    };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        greeting: 'Hi!',
      },
    });

    class MyElement extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }
    }

    const tagString = defineCE(MyElement);
    const el = /** @type {MyElement} */ (document.createElement(tagString));
    el.connectedCallback();
    const lionLocalizeMessageSpy = sinon.spy(localizeManager, 'msg');

    const messageDirective = el.msgLit('my-element:greeting');
    expect(lionLocalizeMessageSpy.callCount).to.equal(0);

    expect(isDirectiveResult(messageDirective)).to.be.true;

    await aTimeout(1); // wait for directive to "resolve"

    expect(lionLocalizeMessageSpy.callCount).to.equal(1);
    expect(lionLocalizeMessageSpy.calledWith('my-element:greeting')).to.be.true;

    const message = el.msgLit('my-element:greeting');
    expect(message).to.equal('Hi!');
    expect(typeof message).to.equal('string');
    expect(lionLocalizeMessageSpy.callCount).to.equal(2);
    expect(lionLocalizeMessageSpy.calledWith('my-element:greeting')).to.be.true;

    lionLocalizeMessageSpy.restore();
  });

  it('has a Promise "localizeNamespacesLoaded" which resolves once translations are available', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`, 25),
    };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        greeting: 'Hi!',
      },
    });

    class MyElement extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }
    }
    const tagString = defineCE(MyElement);
    const el = /** @type {MyElement} */ (document.createElement(tagString));

    const messageDirective = el.msgLit('my-element:greeting');
    expect(isDirectiveResult(messageDirective)).to.be.true;

    await el.localizeNamespacesLoaded;
    expect(el.msgLit('my-element:greeting')).to.equal('Hi!');
  });

  it('renders only once all translations have been loaded (if BaseElement supports it)', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`, 25),
    };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        greeting: 'Hi!',
      },
    });

    class MyLocalizedClass extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      render() {
        return html`<p>${this.msgLit('my-element:greeting')}</p>`;
      }
    }

    const tag = defineCE(MyLocalizedClass);
    const el = /** @type {MyLocalizedClass} */ (await fixtureSync(`<${tag}></${tag}>`));
    expect(el.shadowRoot).to.exist;
    if (el.shadowRoot) {
      expect(el.shadowRoot.children.length).to.equal(0);
      await el.updateComplete;
      const pTag = el.shadowRoot.querySelector('p');
      expect(pTag).to.exist;
      if (pTag) {
        expect(pTag.innerText).to.equal('Hi!');
      }
    }
  });

  it('re-render on locale change once all translations are loaded (if BaseElement supports it)', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`, 25),
    };
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

    class MyLocalizedClass extends LocalizeMixin(LitElement) {
      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      render() {
        return html`<p>${this.msgLit('my-element:greeting')}</p>`;
      }
    }

    const tagName = defineCE(MyLocalizedClass);
    const tag = unsafeStatic(tagName);
    const el = /** @type {MyLocalizedClass} */ (await fixture(html`<${tag}></${tag}>`));
    await el.updateComplete;

    expect(el.shadowRoot).to.exist;
    if (el.shadowRoot) {
      const p = /** @type {HTMLParagraphElement} */ (el.shadowRoot.querySelector('p'));
      expect(p.innerText).to.equal('Hi!');
      localizeManager.locale = 'en-US';
      expect(p.innerText).to.equal('Hi!');
      await el.localizeNamespacesLoaded;
      await nextFrame(); // needed because msgLit relies on until directive to re-render
      await el.updateComplete;
      expect(p.innerText).to.equal('Howdy!');
    }
  });

  it('it can still render async by setting "static get waitForLocalizeNamespaces() { return false; }" (if BaseElement supports it)', async () => {
    const myElementNs = {
      /** @param {string} locale */
      'my-element': locale => fakeImport(`./my-element/${locale}.js`, 50),
    };
    setupFakeImport('./my-element/en-GB.js', {
      default: {
        greeting: 'Hi!',
      },
    });

    class MyLocalizedClass extends LocalizeMixin(LitElement) {
      static get waitForLocalizeNamespaces() {
        return false;
      }

      static get localizeNamespaces() {
        return [myElementNs, ...super.localizeNamespaces];
      }

      render() {
        return html`<p>${this.msgLit('my-element:greeting')}</p>`;
      }
    }

    const tag = defineCE(MyLocalizedClass);

    const el = /** @type {MyLocalizedClass} */ (await fixture(`<${tag}></${tag}>`));
    await el.updateComplete;
    expect(el.shadowRoot).to.exist;
    if (el.shadowRoot) {
      const p = /** @type {HTMLParagraphElement} */ (el.shadowRoot.querySelector('p'));
      expect(p.innerText).to.equal('');
      await el.localizeNamespacesLoaded;
      await el.updateComplete;
      expect(p.innerText).to.equal('Hi!');
    }
  });
});
