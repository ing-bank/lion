import { expect } from '@open-wc/testing';
import { normalizeDateTime } from '@lion/components/localize.js';

describe('normalizeDateTime', () => {
  it('returns a date with hours, minutes and seconds set to 0', () => {
    const date = normalizeDateTime(new Date('2000-11-29T12:34:56'));

    expect(date.getFullYear()).to.equal(2000);
    expect(date.getMonth()).to.equal(10);
    expect(date.getDate()).to.equal(29);
    // normalized parts
    expect(date.getHours()).to.equal(0);
    expect(date.getMinutes()).to.equal(0);
    expect(date.getSeconds()).to.equal(0);
  });
});
