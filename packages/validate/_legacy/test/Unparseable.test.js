import { expect } from '@open-wc/testing';
import { Unparseable } from '../../src/Unparseable.js';

describe('Unparseable', () => {
  it(`can be instantiated`, async () => {
    const instance = new Unparseable('my view value');
    expect(instance instanceof Unparseable).to.equal(true);
  });
  it(`contains a viewValue`, async () => {
    const instance = new Unparseable('my view value');
    expect(instance.viewValue).to.equal('my view value');
  });
  it(`contains a type`, async () => {
    const instance = new Unparseable('my view value');
    expect(instance.type).to.equal('unparseable');
  });
  it(`is serialized as an object`, async () => {
    const instance = new Unparseable('my view value');
    expect(instance.toString()).to.equal('{"type":"unparseable","viewValue":"my view value"}');
  });
});
