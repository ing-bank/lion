const { expect } = require('chai');
const { bemAnalyzer } = require('../../src/tools/getBemSelectorParts.js');

describe('Bem Analyzer', () => {
  it('extracts all states', async () => {
    const pieceOfBem = `
      .block {
        color: blue;
      }

      .block--modifier1 {
        color: blue;
      }

      .block.block--modifier2 {
        color: blue;
      }

      [context] .block--modifier3 {
        color: blue;
      }
    `;

    const result = bemAnalyzer(pieceOfBem);
    expect(result.modifiers.map(m => m.selectorPart)).to.eql([
      '.block--modifier1',
      '.block--modifier2',
      '.block--modifier3',
    ]);
  });
});
