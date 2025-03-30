/* eslint-disable import/no-extraneous-dependencies */
const visit = require('unist-util-visit');
// @ts-ignore
const { init } = require('es-module-lexer');

let mdjsSandboxWcLoaded = false;

function mdjsSandbox({ selector = 'mdjs-sandbox' }) {
  const jsLibrary = '';

  // @ts-ignore
  const nodeCodeVisitor = tree => (node, index, parent) => {
    const codeSnippetsWithSyntaxHighlights = node;
    if (node.lang === 'js' && node.meta === selector) {
      if (mdjsSandboxWcLoaded === false) {
        mdjsSandboxWcLoaded = true;

        tree.children.push({
          type: 'script',
          depth: 1,
          value: `console.log('Hello world')`,
        });
      }
      parent.children.splice(index, 1, {
        type: 'root',
        children: [
          { type: 'html', value: `<${node.meta}>` },
          { type: 'text', value: '\n\n' },
          codeSnippetsWithSyntaxHighlights,
          { type: 'text', value: '\n\n' },
          { type: 'html', value: `</${node.meta}>` },
        ],
      });
    }
  };

  // @ts-ignore
  async function transformer(tree, file) {
    // unifiedjs expects node changes to be made on the given node...
    await init;
    // @ts-ignore
    visit(tree, 'code', nodeCodeVisitor(tree));

    // @ts-ignore
    /* eslint-disable no-param-reassign */
    file.data.jsLibrary = jsLibrary;

    // file.data.jsCode = `
    //   import('./mdjs-sandbox.wc.js')
    // `;

    return tree;
  }

  return transformer;
}

module.exports = {
  mdjsSandbox,
};
