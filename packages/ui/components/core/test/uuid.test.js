import { expect } from '@open-wc/testing';
import sinon from 'sinon';
import { uuid } from '@lion/ui/core.js';

describe('uuid', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('returns ten base-36 characters of a random number', () => {
    sinon.stub(Math, 'random').returns(0.123456789);
    expect(uuid()).to.equal((0.123456789).toString(36).slice(2, 12));
    expect(uuid()).to.match(/^[0-9a-z]{10}$/);
  });

  it('prefixes the id with the given prefix and a dash', () => {
    expect(uuid('my-el')).to.match(/^my-el-[0-9a-z]{1,10}$/);
  });

  it('returns a different id per call', () => {
    expect(uuid()).not.to.equal(uuid());
  });
});
