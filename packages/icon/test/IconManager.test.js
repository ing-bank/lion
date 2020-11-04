import { nothing } from '@lion/core';
import { expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { IconManager } from '../src/IconManager.js';

/**
 * @typedef {import("lit-html").TemplateResult} TemplateResult
 */

describe('IconManager', () => {
  it('starts off with an empty map of resolvers', () => {
    const manager = new IconManager();
    expect(manager.__iconResolvers.size).to.equal(0);
  });

  it('allows adding an icon resolver', () => {
    const manager = new IconManager();
    /**
     * @param {string} iconset
     * @param {string} icon
     * @return {TemplateResult | Promise<TemplateResult> | nothing | Promise<nothing>}
     */
    // eslint-disable-next-line no-unused-vars
    const resolver = (iconset, icon) => {
      return nothing;
    };
    manager.addIconResolver('foo', resolver);

    expect(manager.__iconResolvers.get('foo')).to.equal(resolver);
  });

  it('does not allow adding a resolve for the same namespace twice', () => {
    const manager = new IconManager();
    manager.addIconResolver('foo', () => {});

    expect(() => manager.addIconResolver('foo', () => {})).to.throw();
  });

  it('can resolve an icon, specifying separate parameters', async () => {
    const manager = new IconManager();
    const fooResolver = stub();
    fooResolver.callsFake(() => 'my icon');
    const barResolver = stub();
    manager.addIconResolver('foo', fooResolver);
    manager.addIconResolver('bar', barResolver);

    const icon = await manager.resolveIcon('foo', 'lorem', 'ipsum');

    expect(fooResolver.callCount).to.equal(1);
    expect(barResolver.callCount).to.equal(0);
    expect(fooResolver.withArgs('lorem', 'ipsum').callCount).to.equal(1);
    expect(icon).to.equal('my icon');
  });

  it('throws when an incorrect namespace is given', async () => {
    const manager = new IconManager();
    const fooResolver = stub();
    fooResolver.callsFake(() => 'my icon');
    manager.addIconResolver('foo', fooResolver);

    expect(() => manager.resolveIcon('bar', 'lorem', 'ipsum')).to.throw();
  });

  it('can resolve an icon, specifying parameters as a single string', async () => {
    const manager = new IconManager();
    const fooResolver = stub();
    fooResolver.callsFake(() => 'my icon');
    manager.addIconResolver('foo', fooResolver);

    const icon = await manager.resolveIconForId('foo:lorem:ipsum');

    expect(fooResolver.callCount).to.equal(1);
    expect(fooResolver.withArgs('lorem', 'ipsum').callCount).to.equal(1);
    expect(icon).to.equal('my icon');
  });

  it('throws when an incorrectly formatted icon id is given', async () => {
    const manager = new IconManager();
    const fooResolver = stub();
    fooResolver.callsFake(() => 'my icon');
    manager.addIconResolver('foo', fooResolver);

    expect(() => manager.resolveIconForId('lorem:ipsum')).to.throw();
    expect(() => manager.resolveIconForId('lorem')).to.throw();
    expect(() => manager.resolveIconForId('foo:lorem:ipsum:bar')).to.throw();
  });
});
