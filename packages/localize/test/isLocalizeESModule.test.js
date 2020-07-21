import { expect } from '@open-wc/testing';

import isLocalizeESModule from '../src/isLocalizeESModule.js';

describe('isLocalizeESModule', () => {
  it('detects a module by finding the "default" key containing an object', () => {
    expect(isLocalizeESModule({ default: {} })).to.equal(true);
  });

  it('detects a real ES module with a default export', async () => {
    const mod = await import('./test-esmodule-default.js');
    expect(isLocalizeESModule(mod)).to.equal(true);
  });

  it('ignores if the "default" key is a string', () => {
    expect(isLocalizeESModule({ default: 'my string' })).to.equal(false);
  });

  it('ignores if there are extra keys to the "default" key', () => {
    // @ts-ignore
    expect(isLocalizeESModule({ default: {}, otherKey: 'other key' })).to.equal(false);
    // @ts-ignore
    expect(isLocalizeESModule({ default: {}, otherKey: {} })).to.equal(false);
  });

  it('ignores if there is no "default" key', () => {
    // @ts-ignore
    expect(isLocalizeESModule({ otherKey: 'other key' })).to.equal(false);
    // @ts-ignore
    expect(isLocalizeESModule({ otherKey: {} })).to.equal(false);
  });

  it('ignores if not an object', () => {
    // @ts-ignore
    expect(isLocalizeESModule(undefined)).to.equal(false);
  });
});
