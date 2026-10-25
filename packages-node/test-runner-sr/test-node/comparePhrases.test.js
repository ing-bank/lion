import { expect } from 'chai';
import { comparePhrases, formatMismatch } from '../src/comparePhrases.js';

/**
 * @typedef {import('../types/index.js').SrPhraseList} SrPhraseList
 */

describe('comparePhrases', () => {
  describe('exact', () => {
    it('passes when the spoken phrases match one to one', () => {
      expect(comparePhrases({ mode: 'exact', phrases: ['IBAN', 'edit'] }, ['IBAN', 'edit'])).to.eql(
        {
          ok: true,
          index: -1,
        },
      );
    });

    it('reports the first phrase that differs', () => {
      const result = comparePhrases(
        { mode: 'exact', phrases: ['IBAN', 'edit', 'NL17 INGB 0002 8226 08'] },
        ['IBAN', 'edit', 'NL17 INGB 0002822608'],
      );
      expect(result.ok).to.be.false;
      expect(result.index).to.equal(2);
      expect(result.expectedPhrase).to.equal('NL17 INGB 0002 8226 08');
      expect(result.heardPhrase).to.equal('NL17 INGB 0002822608');
    });

    it('reports a missing phrase when the reader stopped early', () => {
      const result = comparePhrases({ mode: 'exact', phrases: ['IBAN', 'edit'] }, ['IBAN']);
      expect(result.ok).to.be.false;
      expect(result.index).to.equal(1);
      expect(result.expectedPhrase).to.equal('edit');
      expect(result.heardPhrase).to.equal(undefined);
    });

    it('reports extra phrases the reader spoke', () => {
      const result = comparePhrases({ mode: 'exact', phrases: ['IBAN'] }, ['IBAN', 'edit']);
      expect(result.ok).to.be.false;
      expect(result.index).to.equal(1);
      expect(result.heardPhrase).to.equal('edit');
    });
  });

  describe('contains', () => {
    it('passes when the phrases appear in order with other phrases in between', () => {
      const result = comparePhrases({ mode: 'contains', phrases: ['IBAN', 'empty'] }, [
        'Application',
        'IBAN',
        'edit',
        'required',
        'empty',
      ]);
      expect(result.ok).to.be.true;
    });

    it('fails when the order is wrong', () => {
      const result = comparePhrases({ mode: 'contains', phrases: ['empty', 'IBAN'] }, [
        'IBAN',
        'empty',
      ]);
      expect(result.ok).to.be.false;
      expect(result.expectedPhrase).to.equal('IBAN');
      expect(result.index).to.equal(2);
    });

    it('fails when a phrase is missing', () => {
      const result = comparePhrases({ mode: 'contains', phrases: ['IBAN', 'invalid'] }, [
        'IBAN',
        'edit',
      ]);
      expect(result.ok).to.be.false;
      expect(result.expectedPhrase).to.equal('invalid');
      expect(result.index).to.equal(1);
    });
  });

  describe('containsLike', () => {
    it('matches a phrase inside a spoken phrase', () => {
      const expected = /** @type {SrPhraseList} */ ({
        mode: 'containsLike',
        phrases: ['Please enter a valid IBAN'],
      });
      const heard = ['polite: Error,, Please enter a valid IBAN.', 'textbox, IBAN'];
      expect(comparePhrases(expected, heard).ok).to.equal(true);
    });

    it('keeps the order of the expected phrases', () => {
      const expected = /** @type {SrPhraseList} */ ({
        mode: 'containsLike',
        phrases: ['textbox', 'invalid'],
      });
      const heard = ['textbox, IBAN, FOO', 'not disabled, invalid'];
      expect(comparePhrases(expected, heard).ok).to.equal(true);
      expect(comparePhrases(expected, [...heard].reverse()).ok).to.equal(false);
    });

    it('fails when the text is not spoken at all', () => {
      const expected = /** @type {SrPhraseList} */ ({
        mode: 'containsLike',
        phrases: ['Please enter a valid IBAN'],
      });
      const comparison = comparePhrases(expected, ['textbox, IBAN']);
      expect(comparison.ok).to.equal(false);
      expect(comparison.expectedPhrase).to.equal('Please enter a valid IBAN');
    });
  });

  describe('normalisation', () => {
    it('ignores the whitespace a reader pads an announcement with', () => {
      const result = comparePhrases({ mode: 'contains', phrases: ['IBAN, edit,'] }, [
        'IBAN, edit, ',
      ]);
      expect(result.ok).to.be.true;
    });

    it('collapses runs of whitespace inside a phrase', () => {
      const result = comparePhrases({ mode: 'exact', phrases: ['textbox,  IBAN'] }, [
        'textbox,\n      IBAN',
      ]);
      expect(result.ok).to.be.true;
    });

    it('drops empty entries from the heard log', () => {
      const result = comparePhrases({ mode: 'exact', phrases: ['IBAN'] }, ['IBAN', '', '   ']);
      expect(result.ok).to.be.true;
    });
  });

  describe('formatMismatch', () => {
    it('shows the expected log, the heard log and the first divergence', () => {
      const expected = /** @type {SrPhraseList} */ ({
        mode: 'exact',
        phrases: ['IBAN', 'edit', 'NL17 INGB 0002 8226 08'],
      });
      const heard = ['IBAN', 'edit', 'NL17 INGB 0002822608'];
      const message = formatMismatch({
        reader: 'nvda',
        expected,
        heard,
        comparison: comparePhrases(expected, heard),
      });
      expect(message).to.include('screen reader "nvda" did not speak what the test expects');
      expect(message).to.include('[2] "NL17 INGB 0002 8226 08"');
      expect(message).to.include('first divergence at index 2');
    });

    it('says so when nothing was spoken at all', () => {
      const expected = /** @type {SrPhraseList} */ ({ mode: 'exact', phrases: ['IBAN'] });
      const message = formatMismatch({
        reader: 'voiceover',
        expected,
        heard: [],
        comparison: comparePhrases(expected, []),
      });
      expect(message).to.include('(nothing spoken)');
    });
  });
});
