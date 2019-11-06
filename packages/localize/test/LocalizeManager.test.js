import { expect, oneEvent, aTimeout } from '@open-wc/testing';
import sinon from 'sinon';
import { fetchMock } from '@bundled-es-modules/fetch-mock';
import { setupFakeImport, resetFakeImport, fakeImport } from '../test-helpers.js';

import { LocalizeManager } from '../src/LocalizeManager.js';

// useful for IE11 where LTR and RTL symbols are put by Intl when rendering dates
function removeLtrRtl(str) {
  return str.replace(/(\u200E|\u200E)/g, '');
}

describe('LocalizeManager', () => {
  let manager;

  beforeEach(() => {
    // makes sure that between tests the localization is reset to default state
    document.documentElement.lang = 'en-GB';
  });

  afterEach(() => {
    manager.teardown();
  });

  afterEach(() => {
    fetchMock.restore();
    resetFakeImport();
  });

  it('initializes locale from <html> by default', () => {
    manager = new LocalizeManager();
    expect(manager.locale).to.equal('en-GB');
  });

  it('syncs locale back to <html> if changed', () => {
    manager = new LocalizeManager();
    manager.locale = 'nl-NL';
    expect(document.documentElement.lang).to.equal('nl-NL');
  });

  it('sets locale to "en-GB" by default if nothing is set on <html>', () => {
    document.documentElement.lang = '';
    manager = new LocalizeManager();
    expect(manager.locale).to.equal('en-GB');
    expect(document.documentElement.lang).to.equal('en-GB');
  });

  it('has teardown() method removing all side effects', () => {
    manager = new LocalizeManager();
    const disconnectObserverSpy = sinon.spy(manager._htmlLangAttributeObserver, 'disconnect');
    manager.teardown();
    expect(disconnectObserverSpy.callCount).to.equal(1);
  });

  describe('"localeChanged" event with detail.newLocale and detail.oldLocale', () => {
    it('fires "localeChanged" event if locale was changed via manager', async () => {
      manager = new LocalizeManager();
      setTimeout(() => {
        manager.locale = 'en-US';
      });
      const event = await oneEvent(manager, 'localeChanged');
      expect(event.detail.newLocale).to.equal('en-US');
      expect(event.detail.oldLocale).to.equal('en-GB');
    });

    it('fires "localeChanged" event if locale was changed via <html lang> attribute', async () => {
      manager = new LocalizeManager();
      setTimeout(() => {
        document.documentElement.lang = 'en-US';
      });
      const event = await oneEvent(manager, 'localeChanged');
      expect(event.detail.newLocale).to.equal('en-US');
      expect(event.detail.oldLocale).to.equal('en-GB');
    });

    it('does not fire "localeChanged" event if it was set to the same locale', () => {
      manager = new LocalizeManager();
      const eventSpy = sinon.spy();
      manager.addEventListener('localeChanged', eventSpy);
      manager.locale = 'en-US';
      manager.locale = 'en-US';
      expect(eventSpy.callCount).to.equal(1);
    });
  });

  describe('addData()', () => {
    it('allows to provide inline data', () => {
      manager = new LocalizeManager();

      manager.addData('en-GB', 'lion-hello', { greeting: 'Hi!' });

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'lion-hello': { greeting: 'Hi!' },
        },
      });

      manager.addData('en-GB', 'lion-goodbye', { farewell: 'Cheers!' });

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'lion-hello': { greeting: 'Hi!' },
          'lion-goodbye': { farewell: 'Cheers!' },
        },
      });

      manager.addData('nl-NL', 'lion-hello', { greeting: 'Hoi!' });
      manager.addData('nl-NL', 'lion-goodbye', { farewell: 'Doei!' });

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'lion-hello': { greeting: 'Hi!' },
          'lion-goodbye': { farewell: 'Cheers!' },
        },
        'nl-NL': {
          'lion-hello': { greeting: 'Hoi!' },
          'lion-goodbye': { farewell: 'Doei!' },
        },
      });
    });

    it('prevents mutating existing data for the same locale & namespace', () => {
      manager = new LocalizeManager();

      manager.addData('en-GB', 'lion-hello', { greeting: 'Hi!' });

      expect(() => {
        manager.addData('en-GB', 'lion-hello', { greeting: 'Hello!' });
      }).to.throw();

      expect(manager.__storage).to.deep.equal({
        'en-GB': { 'lion-hello': { greeting: 'Hi!' } },
      });
    });
  });

  describe('loading via dynamic imports', () => {
    it('loads a namespace via loadNamespace()', async () => {
      setupFakeImport('./my-component/en-GB.js', { default: { greeting: 'Hello!' } });

      manager = new LocalizeManager();

      await manager.loadNamespace({
        'my-component': locale => fakeImport(`./my-component/${locale}.js`),
      });

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'my-component': { greeting: 'Hello!' },
        },
      });
    });

    it('can load a namespace for a different locale', async () => {
      setupFakeImport('./my-component/nl-NL.js', { default: { greeting: 'Hello!' } });

      manager = new LocalizeManager();
      manager.locale = 'en-US';

      await manager.loadNamespace(
        {
          'my-component': locale => fakeImport(`./my-component/${locale}.js`),
        },
        { locale: 'nl-NL' },
      );

      expect(manager.__storage).to.deep.equal({
        'nl-NL': {
          'my-component': { greeting: 'Hello!' },
        },
      });
    });

    it('loads multiple namespaces via loadNamespaces()', async () => {
      setupFakeImport('./my-defaults/en-GB.js', { default: { submit: 'Submit' } });
      setupFakeImport('./my-send-button/en-GB.js', { default: { submit: 'Send' } });

      manager = new LocalizeManager();

      await manager.loadNamespaces([
        { 'my-defaults': locale => fakeImport(`./my-defaults/${locale}.js`) },
        { 'my-send-button': locale => fakeImport(`./my-send-button/${locale}.js`) },
      ]);

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'my-defaults': { submit: 'Submit' },
          'my-send-button': { submit: 'Send' },
        },
      });
    });

    it('can load multiple namespaces for a different locale', async () => {
      setupFakeImport('./my-defaults/nl-NL.js', { default: { submit: 'Submit' } });
      setupFakeImport('./my-send-button/nl-NL.js', { default: { submit: 'Send' } });

      manager = new LocalizeManager();
      manager.locale = 'en-US';

      await manager.loadNamespaces(
        [
          { 'my-defaults': locale => fakeImport(`./my-defaults/${locale}.js`) },
          { 'my-send-button': locale => fakeImport(`./my-send-button/${locale}.js`) },
        ],
        { locale: 'nl-NL' },
      );

      expect(manager.__storage).to.deep.equal({
        'nl-NL': {
          'my-defaults': { submit: 'Submit' },
          'my-send-button': { submit: 'Send' },
        },
      });
    });

    it('loads generic language file if locale file is not found', async () => {
      setupFakeImport('./my-component/en.js', { default: { greeting: 'Hello!' } });

      manager = new LocalizeManager();

      await manager.loadNamespace({
        'my-component': locale => fakeImport(`./my-component/${locale}.js`),
      });

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'my-component': { greeting: 'Hello!' },
        },
      });
    });

    it('throws if both locale and language files could not be loaded', async () => {
      manager = new LocalizeManager();

      try {
        await manager.loadNamespace({
          'my-component': locale => fakeImport(`./my-component/${locale}.js`),
        });
      } catch (e) {
        expect(e).to.be.instanceof(Error);
        expect(e.message).to.equal(
          'Data for namespace "my-component" and locale "en-GB" could not be loaded. ' +
            'Make sure you have data for locale "en-GB" (and/or generic language "en").',
        );
        return;
      }

      throw new Error('did not throw');
    });

    describe('fallback locale', () => {
      it('can load a fallback locale if current one can not be loaded', async () => {
        manager = new LocalizeManager({ fallbackLocale: 'en-GB' });
        manager.locale = 'nl-NL';

        setupFakeImport('./my-component/en-GB.js', { default: { greeting: 'Hello!' } });

        await manager.loadNamespace({
          'my-component': locale => fakeImport(`./my-component/${locale}.js`),
        });

        expect(manager.__storage).to.deep.equal({
          'nl-NL': {
            'my-component': { greeting: 'Hello!' },
          },
        });
      });

      it('can load fallback generic language file if fallback locale file is not found', async () => {
        manager = new LocalizeManager({ fallbackLocale: 'en-GB' });
        manager.locale = 'nl-NL';

        setupFakeImport('./my-component/en.js', { default: { greeting: 'Hello!' } });

        await manager.loadNamespace({
          'my-component': locale => fakeImport(`./my-component/${locale}.js`),
        });

        expect(manager.__storage).to.deep.equal({
          'nl-NL': {
            'my-component': { greeting: 'Hello!' },
          },
        });
      });

      it('throws if neither current locale nor fallback locale are found', async () => {
        manager = new LocalizeManager({ fallbackLocale: 'en-GB' });
        manager.locale = 'nl-NL';

        try {
          await manager.loadNamespace({
            'my-component': locale => fakeImport(`./my-component/${locale}.js`),
          });
        } catch (e) {
          expect(e).to.be.instanceof(Error);
          expect(e.message).to.equal(
            'Data for namespace "my-component" and current locale "nl-NL" or fallback locale "en-GB" could not be loaded. ' +
              'Make sure you have data either for locale "nl-NL" (and/or generic language "nl") or for fallback "en-GB" (and/or "en").',
          );
          return;
        }

        throw new Error('did not throw');
      });

      it('throws an error if the locale set by the user is not a full language locale', async () => {
        manager = new LocalizeManager();
        expect(() => {
          manager.locale = 'nl';
        }).to.throw(`
      Locale was set to nl.
      Language only locales are not allowed, please use the full language locale e.g. 'en-GB' instead of 'en'.
      See https://github.com/ing-bank/lion/issues/187 for more information.
    `);
      });

      it('does not throw an error if locale was set through the html lang attribute', async () => {
        manager = new LocalizeManager();
        expect(() => {
          document.documentElement.lang = 'nl';
        }).to.not.throw();
      });
    });
  });

  describe('loading using routes predefined via setupNamespaceLoader()', () => {
    it('loads a namespace via loadNamespace() using string route', async () => {
      fetchMock.get('./my-component/en-GB.json', { greeting: 'Hello!' });

      manager = new LocalizeManager();

      manager.setupNamespaceLoader('my-component', async locale => {
        const response = await fetch(`./my-component/${locale}.json`);
        return response.json();
      });

      await manager.loadNamespace('my-component');

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'my-component': { greeting: 'Hello!' },
        },
      });
    });

    it('loads multiple namespaces via loadNamespaces() using string routes', async () => {
      fetchMock.get('./my-defaults/en-GB.json', { submit: 'Submit' });
      fetchMock.get('./my-send-button/en-GB.json', { submit: 'Send' });

      manager = new LocalizeManager();

      manager.setupNamespaceLoader('my-defaults', async locale => {
        const response = await fetch(`./my-defaults/${locale}.json`);
        return response.json();
      });
      manager.setupNamespaceLoader('my-send-button', async locale => {
        const response = await fetch(`./my-send-button/${locale}.json`);
        return response.json();
      });

      await manager.loadNamespaces(['my-defaults', 'my-send-button']);

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'my-send-button': { submit: 'Send' },
          'my-defaults': { submit: 'Submit' },
        },
      });
    });

    it('loads a namespace via loadNamespace() using RegExp route', async () => {
      fetchMock.get('./my-component/en-GB.json', { greeting: 'Hello!' });

      manager = new LocalizeManager();

      manager.setupNamespaceLoader(/my-.+/, async (locale, namespace) => {
        const response = await fetch(`./${namespace}/${locale}.json`);
        return response.json();
      });

      await manager.loadNamespace('my-component');

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'my-component': { greeting: 'Hello!' },
        },
      });
    });

    it('loads multiple namespaces via loadNamespaces() using RegExp routes', async () => {
      fetchMock.get('./my-defaults/en-GB.json', { submit: 'Submit' });
      fetchMock.get('./my-send-button/en-GB.json', { submit: 'Send' });

      manager = new LocalizeManager();

      manager.setupNamespaceLoader(/my-.+/, async (locale, namespace) => {
        const response = await fetch(`./${namespace}/${locale}.json`);
        return response.json();
      });

      await manager.loadNamespaces(['my-defaults', 'my-send-button']);

      expect(manager.__storage).to.deep.equal({
        'en-GB': {
          'my-defaults': { submit: 'Submit' },
          'my-send-button': { submit: 'Send' },
        },
      });
    });
  });

  describe('{ autoLoadOnLocaleChange: true }', () => {
    it('loads namespaces automatically when locale is changed via manager', async () => {
      setupFakeImport('./my-component/en-GB.js', { default: { greeting: 'Hello!' } });
      setupFakeImport('./my-component/nl-NL.js', { default: { greeting: 'Hallo!' } });

      manager = new LocalizeManager({ autoLoadOnLocaleChange: true });

      await manager.loadNamespace({
        'my-component': locale => fakeImport(`./my-component/${locale}.js`, 25),
      });

      expect(manager.__storage).to.deep.equal({
        'en-GB': { 'my-component': { greeting: 'Hello!' } },
      });

      manager.locale = 'nl-NL';
      await manager.loadingComplete;

      expect(manager.__storage).to.deep.equal({
        'en-GB': { 'my-component': { greeting: 'Hello!' } },
        'nl-NL': { 'my-component': { greeting: 'Hallo!' } },
      });
    });

    it('loads namespaces automatically when locale is changed via <html lang> attribute', async () => {
      setupFakeImport('./my-component/en-GB.js', { default: { greeting: 'Hello!' } });
      setupFakeImport('./my-component/nl-NL.js', { default: { greeting: 'Hallo!' } });

      manager = new LocalizeManager({ autoLoadOnLocaleChange: true });

      await manager.loadNamespace({
        'my-component': locale => fakeImport(`./my-component/${locale}.js`, 25),
      });

      expect(manager.__storage).to.deep.equal({
        'en-GB': { 'my-component': { greeting: 'Hello!' } },
      });

      document.documentElement.lang = 'nl-NL';
      await aTimeout(); // wait for mutation observer to be called
      await manager.loadingComplete;

      expect(manager.__storage).to.deep.equal({
        'en-GB': { 'my-component': { greeting: 'Hello!' } },
        'nl-NL': { 'my-component': { greeting: 'Hallo!' } },
      });
    });
  });

  describe('loading extra features', () => {
    it('has a Promise "loadingComplete" that resolved once all pending loading is done', async () => {
      setupFakeImport('./my-component/en-GB.js', { default: { greeting: 'Hello!' } });
      manager = new LocalizeManager();

      manager.loadNamespace({
        'my-component': locale => fakeImport(`./my-component/${locale}.js`, 25),
      });
      expect(manager.__storage).to.deep.equal({});
      await manager.loadingComplete;
      expect(manager.__storage).to.deep.equal({
        'en-GB': { 'my-component': { greeting: 'Hello!' } },
      });
    });

    it('loads namespace only once for the same locale', async () => {
      let called = 0;
      const myNamespace = {
        'my-namespace': () => {
          called += 1;
          return Promise.resolve({ default: {} });
        },
      };
      manager = new LocalizeManager();

      await Promise.all([
        manager.loadNamespace(myNamespace),
        manager.loadNamespace(myNamespace),
        manager.loadNamespace(myNamespace),
      ]);

      expect(called).to.equal(1);
    });

    it('does not load inlined data', async () => {
      setupFakeImport('./my-component/en-GB.js', { default: { greeting: 'Loaded hello!' } });

      manager = new LocalizeManager();
      manager.addData('en-GB', 'my-component', { greeting: 'Hello!' });

      await manager.loadNamespace('my-component');

      expect(manager.__storage).to.deep.equal({
        'en-GB': { 'my-component': { greeting: 'Hello!' } },
      });

      let called = 0;
      await manager.loadNamespace({
        'my-component': locale => {
          called += 1;
          return fakeImport(`./my-component/${locale}.js`);
        },
      });

      expect(called).to.equal(0);
      expect(manager.__storage).to.deep.equal({
        'en-GB': { 'my-component': { greeting: 'Hello!' } },
      });
    });
  });

  describe('message()', () => {
    it('gets the message for the key in the format of "namespace:name"', () => {
      manager = new LocalizeManager();
      manager.addData('en-GB', 'my-ns', { greeting: 'Hello!' });
      expect(manager.msg('my-ns:greeting')).to.equal('Hello!');
    });

    it('supports nested names in the format of "namespace:path.to.deep.name"', () => {
      manager = new LocalizeManager();
      manager.addData('en-GB', 'my-ns', { 'login-section': { greeting: 'Hello!' } });
      expect(manager.msg('my-ns:login-section.greeting')).to.equal('Hello!');
    });

    it('supports variables', () => {
      manager = new LocalizeManager();
      manager.addData('en-GB', 'my-ns', { greeting: 'Hello {name}!' });
      expect(manager.msg('my-ns:greeting', { name: 'John' })).to.equal('Hello John!');
    });

    it('supports Intl MessageFormat proposal for messages', () => {
      manager = new LocalizeManager();
      manager.addData('en-GB', 'my-ns', {
        date: 'I was written on {today, date}.',
        number: 'You have {n, plural, =0 {no photos.} =1 {one photo.} other {# photos.}}',
      });
      const today = new Date('2018/04/30');
      expect(removeLtrRtl(manager.msg('my-ns:date', { today }))).to.equal(
        'I was written on 30 Apr 2018.',
      );
      expect(manager.msg('my-ns:number', { n: 0 })).to.equal('You have no photos.');
      expect(manager.msg('my-ns:number', { n: 1 })).to.equal('You have one photo.');
      expect(manager.msg('my-ns:number', { n: 2 })).to.equal('You have 2 photos.');
    });

    it('takes into account globally changed locale', () => {
      manager = new LocalizeManager();
      manager.locale = 'nl-NL';
      manager.addData('en-GB', 'my-ns', { greeting: 'Hi!' });
      manager.addData('nl-NL', 'my-ns', { greeting: 'Hey!' });
      expect(manager.msg('my-ns:greeting')).to.equal('Hey!');
    });

    it('allows to provide a different locale for specific call', () => {
      manager = new LocalizeManager();
      manager.addData('en-GB', 'my-ns', { greeting: 'Hi!' });
      manager.addData('nl-NL', 'my-ns', { greeting: 'Hey!' });
      expect(manager.msg('my-ns:greeting', null, { locale: 'nl-NL' })).to.equal('Hey!');
      manager.reset();
      manager.addData('en-GB', 'my-ns', { greeting: 'Hi {name}!' });
      manager.addData('nl-NL', 'my-ns', { greeting: 'Hey {name}!' });
      expect(manager.msg('my-ns:greeting', { name: 'John' }, { locale: 'nl-NL' })).to.equal(
        'Hey John!',
      );
    });

    it('allows to provide an ordered list of keys where the first resolved is used', () => {
      manager = new LocalizeManager();
      const keys = ['overridden-ns:greeting', 'default-ns:greeting'];
      expect(manager.msg(keys)).to.equal('');
      manager.addData('en-GB', 'default-ns', { greeting: 'Hi!' });
      expect(manager.msg(keys)).to.equal('Hi!');
      manager.addData('en-GB', 'overridden-ns', { greeting: 'Hello!' });
      expect(manager.msg(keys)).to.equal('Hello!');
    });

    it('throws a custom error when namespace prefix is missing', () => {
      manager = new LocalizeManager();
      const msgKey = 'greeting';
      manager.addData('en-GB', 'my-ns', { [msgKey]: 'Hello!' });
      expect(() => manager.msg(msgKey)).to.throw(
        `Namespace is missing in the key "${msgKey}". The format for keys is "namespace:name".`,
      );
    });
  });
});
