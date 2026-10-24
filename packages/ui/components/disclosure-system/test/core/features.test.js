import { expect } from '@open-wc/testing';
import { Disclosure, invariants } from '../../src/core/DisclosureCore.js';
import { features } from '../../src/core/registry.js';

/**
 * The features load lazily, only when the descriptor asks for them, and every one of them releases
 * what it took. These tests pin the descriptor→feature contract.
 */
describe('Disclosure features', () => {
  /** @type {HTMLElement} */
  let element;
  /** @type {HTMLDivElement} */
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

  it('loads only the always-on a11y feature for a descriptor that asks for none', async () => {
    const disclosure = new Disclosure({ element, content });
    await disclosure.show();
    expect(disclosure.resources.length).to.equal(1);
    expect(invariants(disclosure).projected).to.be.true;
  });

  it('exposes the feature contract so consumers can register their own', () => {
    expect(features.length).to.be.greaterThan(0);
    for (const feature of features) {
      expect(typeof feature.when).to.equal('function');
      expect(typeof feature.load).to.equal('function');
    }
  });

  it('locks and restores page scrolling through the scrollLock feature', async () => {
    const disclosure = new Disclosure({ element, content, descriptor: { scrollLock: true } });
    const overflowBefore = document.body.style.overflow;

    await disclosure.show();
    expect(document.body.style.overflow).to.equal('hidden');

    await disclosure.close();
    expect(document.body.style.overflow).to.equal(overflowBefore);
    expect(disclosure.resources).to.deep.equal([]);
  });

  it('uses the native anchor positioning route when the engine supports it', async () => {
    const supported =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      (CSS.supports('position-anchor: --a') || CSS.supports('anchor-name: --a'));

    const disclosure = new Disclosure({
      element,
      content,
      descriptor: { anchor: '--my-anchor', area: 'bottom' },
    });
    await disclosure.show();

    if (supported) {
      expect(content.style.positionAnchor).to.equal('--my-anchor');
      expect(content.style.positionArea).to.equal('bottom');
    }
    await disclosure.close();
    expect(content.style.positionAnchor).to.equal('');
    expect(content.style.positionArea).to.equal('');
  });

  it('does not put the positioning polyfill in the core: it is a dynamic import', async () => {
    const source = await fetch(
      new URL('../../src/core/features/position.js', import.meta.url).href,
    ).then(response => response.text());
    // no static import of the polyfill, only a dynamic one (the dev server rewrites the specifier)
    expect(source).to.not.include("from '@popperjs/core'");
    expect(source).to.include('popperjs');
    expect(source).to.include('import(');
    expect(source).to.include('supportsAnchorPositioning');
  });
});

describe('Disclosure context switching (same disclosure, different shape)', () => {
  it('swaps the features of an open disclosure without touching the DOM or the state', async () => {
    const element = document.createElement('div');
    const content = document.createElement('div');
    const text = document.createTextNode('menu items');
    content.appendChild(text);
    element.appendChild(content);
    document.body.appendChild(element);

    const disclosure = new Disclosure({ element, content, descriptor: { closedby: 'any' } });
    await disclosure.show();
    // the always-on a11y feature plus the esc feature the descriptor asked for
    expect(disclosure.resources.length).to.equal(2);

    // the same element, the same children, still open: only the features change
    await disclosure.setDescriptor({ closedby: 'none' });
    expect(disclosure.open).to.be.true;
    expect(disclosure.content).to.equal(content);
    expect(content.textContent).to.equal('menu items');
    // only the always-on a11y feature is left: the esc listener went with the old descriptor
    expect(disclosure.resources.length).to.equal(1);

    await disclosure.close();
    element.remove();
  });
});
