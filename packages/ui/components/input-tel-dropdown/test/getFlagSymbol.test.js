import { expect } from '@open-wc/testing';
import { getFlagSymbol } from '@lion/ui/input-tel-dropdown.js';

describe('getFlagSymbol', () => {
  it('returns the regional indicator symbols of a region code', () => {
    expect(getFlagSymbol('NL')).to.equal('\u{1F1F3}\u{1F1F1}');
  });

  it('accepts lower case region codes', () => {
    expect(getFlagSymbol('de')).to.equal('\u{1F1E9}\u{1F1EA}');
  });
});
