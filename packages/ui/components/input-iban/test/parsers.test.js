import { expect } from '@open-wc/testing';

import { parseIBAN } from '@lion/ui/input-iban.js';

describe('parseIBAN', () => {
  it('parses formatted value by trimming spaces and making uppercase', () => {
    expect(parseIBAN(' nl17 InGB 0002 8226 08 ')).to.equal('NL17INGB0002822608');
  });
});
