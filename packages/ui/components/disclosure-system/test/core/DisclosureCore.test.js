import { expect } from '@open-wc/testing';
import { Disclosure, invariants } from '../../src/core/DisclosureCore.js';

/**
 * Invariant tests for the clean disclosure layer. They describe the *state machine*, not timing: a
 * stale mirror must not resurrect a closed disclosure, the DOM must always agree with the state, and
 * every resource must be released when the disclosure is closed.
 */
describe('Disclosure (core)', () => {
  /** @type {HTMLElement} */
  let element;
  /** @type {HTMLElement} */
  let content;

  beforeEach(() => {
    element = document.createElement('div');
    content = document.createElement('div');
    element.appendChild(content);
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it('starts closed and holds nothing', () => {
    const disclosure = new Disclosure({ element, content });
    expect(disclosure.open).to.be.false;
    expect(disclosure.state).to.equal('closed');
    expect(disclosure.epoch).to.equal(0);
    expect(disclosure.resources).to.deep.equal([]);
    expect(invariants(disclosure).projected).to.be.true;
  });

  it('announces state changes with the platform events', async () => {
    const disclosure = new Disclosure({ element, content });
    /** @type {string[]} */
    const seen = [];
    element.addEventListener('beforetoggle', event => {
      seen.push(`before:${/** @type {any} */ (event).detail.newState}`);
    });
    element.addEventListener('toggle', event => {
      seen.push(`after:${/** @type {any} */ (event).detail.newState}`);
    });

    await disclosure.show();
    expect(disclosure.open).to.be.true;
    expect(disclosure.epoch).to.equal(1);
    expect(element.hasAttribute('open')).to.be.true;
    expect(invariants(disclosure).projected).to.be.true;

    await disclosure.close();
    expect(seen).to.deep.equal(['before:open', 'after:open', 'before:closed', 'after:closed']);
    expect(element.hasAttribute('open')).to.be.false;
    expect(content.hasAttribute('open')).to.be.false;
  });

  it('lets a beforetoggle listener cancel the transition', async () => {
    const disclosure = new Disclosure({ element, content });
    element.addEventListener('beforetoggle', event => event.preventDefault());
    await disclosure.show();
    expect(disclosure.open).to.be.false;
    expect(disclosure.state).to.equal('closed');
  });

  it('ignores a stale mirror instead of resurrecting a closed disclosure', async () => {
    const disclosure = new Disclosure({ element, content });
    await disclosure.show();
    const observedWhileOpen = disclosure.epoch;
    await disclosure.close();

    // the consumer update that was pending while it was open still carries `true`
    await disclosure.sync(true, observedWhileOpen);
    expect(disclosure.open).to.be.false;
    expect(disclosure.state).to.equal('closed');
  });

  it('honours a mirror that observed the current state', async () => {
    const disclosure = new Disclosure({ element, content });
    await disclosure.sync(true, disclosure.epoch);
    expect(disclosure.open).to.be.true;
  });

  it('loads the esc feature lazily and releases it on close', async () => {
    const disclosure = new Disclosure({ element, content, descriptor: { closedby: 'any' } });
    expect(disclosure.resources).to.deep.equal([]);

    await disclosure.show();
    // the always-on a11y feature plus the esc feature the descriptor asked for
    expect(disclosure.resources.length).to.equal(2);

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(disclosure.open).to.be.false;
    expect(disclosure.resources).to.deep.equal([]);
  });

  it('keeps a closedby="closest" disclosure open when Escape comes from outside', async () => {
    const outside = document.createElement('div');
    document.body.appendChild(outside);
    const disclosure = new Disclosure({ element, content, descriptor: { closedby: 'closest' } });
    await disclosure.show();

    outside.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(disclosure.open).to.be.true;

    content.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(disclosure.open).to.be.false;
    outside.remove();
  });

  it('releases everything on teardown', async () => {
    const disclosure = new Disclosure({ element, content, descriptor: { closedby: 'any' } });
    await disclosure.show();
    await disclosure.teardown();
    expect(disclosure.open).to.be.false;
    expect(disclosure.resources).to.deep.equal([]);
    expect(invariants(disclosure).projected).to.be.true;
  });
});
