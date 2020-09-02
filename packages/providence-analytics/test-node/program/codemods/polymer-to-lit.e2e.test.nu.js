const { expect } = require('chai');
const path = require('path');
const fs = require('fs');
const { polymerToLitCodemod } = require('../../../src/program/codemods/polymer-to-lit.js');
const { formatJs } = require('../../../src/program/codemods/utils.js');

describe('Polymer components', () => {
  it('paper-input', () => {
    const htmlFrom = fs.readFileSync(path.resolve(__dirname, './assets/paper-input.html'), 'utf8');
    const { result } = polymerToLitCodemod(htmlFrom);
    // expect(result).to.equal(``);
  });
});
