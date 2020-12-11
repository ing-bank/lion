const { expect } = require('chai');
const sinon = require('sinon');
const babel = require('@babel/core');
const babelPluginIconUpdate = require('../src/babel-plugin-icon-update.js');
const { formatHtml } = require('../../providence-analytics/src/program/utils/formatting-utils.js');

function executeBabel(input, options) {
  const result = babel.transform(input, {
    plugins: [[babelPluginIconUpdate, options]],
  });
  return result.code;
}

const oldToNewMap = {
  'brand:set:icon': 'brand:newSetName:newIconName',
  'brand2:set2:icon2': 'brand2:newSetName2:newIconName2',
};

describe('babel-plugin-icon-update', () => {
  it('replaces icon-id attributes', () => {
    const code = `
      function render() {
        return html\`<lion-icon icon-id="brand:set:icon"></lion-icon>\`;
      }`;
    const output = `
      function render() {
        return html\`<lion-icon icon-id="brand:newSetName:newIconName"></lion-icon>\`;
      }`;
    const result = executeBabel(code, { oldToNewMap });
    expect(formatHtml(result)).to.equal(formatHtml(output));
  });

  it('supports template literal expressions', () => {
    const code = `
      function render() {
        return html\`<lion-icon icon-id="\${'brand:set:icon'}"></lion-icon>\`;
      }`;
    const output = `
      function render() {
        return html\`<lion-icon icon-id="\${'brand:newSetName:newIconName'}"></lion-icon>\`;
      }`;
    const result = executeBabel(code, { oldToNewMap });
    expect(formatHtml(result)).to.equal(formatHtml(output));
  });

  it('replaces .iconId properties', () => {
    const code = `
      function render() {
        return html\`<lion-icon .iconId="\${'brand:set:icon'}"></lion-icon>\`;
      }`;
    const output = `
      function render() {
        return html\`<lion-icon .iconId="\${'brand:newSetName:newIconName'}"></lion-icon>\`;
      }`;
    const result = executeBabel(code, { oldToNewMap });
    expect(formatHtml(result)).to.equal(formatHtml(output));
  });

  // Technically possible, but not part of first release
  it.skip('supports Identifier expressions', () => {
    const code = `
      const myIcon = 'brand:set:icon';
      function render() {
        return html\`<lion-icon icon-id="\${myIcon}"></lion-icon>\`;
      }`;
    const output = `
      const myIcon = 'brand:newSetName:newIconName';
      function render() {
        return html\`<lion-icon icon-id="\${myIcon}"></lion-icon>\`;
      }`;
    const result = executeBabel(code, { oldToNewMap });
    expect(formatHtml(result)).to.equal(formatHtml(output));
  });

  it('notifies about non template literal expressions', () => {
    sinon.spy(console, 'warn');
    const code = `
      function render() {
        return html\`<lion-icon icon-id="brand:set:\${'bla'}"></lion-icon>\`;
      }`;
    const output = `
      function render() {
        return html\`<lion-icon icon-id="brand:set:\${'bla'}"></lion-icon>\`;
      }`;
    const result = executeBabel(code, { oldToNewMap });
    expect(formatHtml(result)).to.equal(formatHtml(output));
    expect(console.warn.args[0][0]).to.eql(`Please manually update: icon-id="brand:set:\${'bla'}"`);
  });

  it('works in larger templates', () => {
    const code = `
      function render() {
        return html\`
          <div>
            <lion-icon icon-id="brand:set:icon"></lion-icon>
          </div>
          <span>
            <lion-icon icon-id="brand2:set2:icon2"></lion-icon>
          </span>
        \`;
      }`;
    const output = `
      function render() {
        return html\`
          <div>
            <lion-icon icon-id="brand:newSetName:newIconName"></lion-icon>
          </div>
          <span>
            <lion-icon icon-id="brand2:newSetName2:newIconName2"></lion-icon>
          </span>
        \`;
      }`;
    const result = executeBabel(code, { oldToNewMap });
    expect(formatHtml(result)).to.equal(formatHtml(output));
  });

  it('works with multiple templates in a page', () => {
    const code = `
      function render() {
        return html\`
          <lion-icon icon-id="brand:set:icon"></lion-icon>
        \`;
      }

      function render2() {
        return html\`
          <lion-icon icon-id="brand:set:icon"></lion-icon>
        \`;
      }`;
    const output = `
    function render() {
      return html\`
        <lion-icon icon-id="brand:newSetName:newIconName"></lion-icon>
      \`;
    }

    function render2() {
      return html\`
        <lion-icon icon-id="brand:newSetName:newIconName"></lion-icon>
      \`;
    }`;
    const result = executeBabel(code, { oldToNewMap });
    expect(formatHtml(result)).to.equal(formatHtml(output));
  });

  it('works for icon extensions', () => {
    const code = `
      function render() {
        return html\`<my-icon icon-id="brand:set:icon"></my-icon>\`;
      }`;
    const output = `
      function render() {
        return html\`<my-icon icon-id="brand:newSetName:newIconName"></my-icon>\`;
      }`;
    const result = executeBabel(code, { tagName: 'my-icon', oldToNewMap });
    expect(formatHtml(result)).to.equal(formatHtml(output));
  });
});
