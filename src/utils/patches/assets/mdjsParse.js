import { visit } from 'unist-util-visit';
import { remove } from 'unist-util-remove';

/** @typedef {import('vfile').VFileOptions} VFileOptions */
/** @typedef {import('unist').Node} Node */

export function mdjsParse() {
  /**
   * @param {Node} tree
   * @param {VFileOptions} file
   */
  function transformer(tree, file) {
    let jsCode = '';
    visit(
      tree,
      'code',
      /** @param {Node & {[key: string]: unknown;}} node */ node => {
        if (node.lang === 'js' && node.meta === 'script') {
          jsCode += node.value;
        }
        if (node.lang === 'js' && node.meta === 'client') {
          jsCode += node.value;
        }
      },
    );
    // we can only return/modify the tree but jsCode should not be part of the tree
    // so we attach it globally to the file.data
    // eslint-disable-next-line no-param-reassign
    if (!file.data) {
      file.data = {};
    }
    file.data.jsCode = jsCode;

    /**
     * @param {Node} node
     */
    const removeFunction = node => {
      const _node = /** @type {Node & {[key: string]: unknown;}} */ (node);
      return (
        _node.type === 'code' &&
        _node.lang === 'js' &&
        (_node.meta === 'script' || _node.meta === 'client')
      );
    };
    remove(tree, removeFunction);

    return tree;
  }

  return transformer;
}
