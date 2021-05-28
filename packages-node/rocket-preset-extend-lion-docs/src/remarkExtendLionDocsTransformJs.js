/* eslint-disable no-param-reassign */
import babelPkg from '@babel/core';
import visit from 'unist-util-visit';

const { transformSync } = babelPkg;

/** @typedef {import('vfile').VFileOptions} VFileOptions */
/** @typedef {import('unist').Node} Node */

/**
 * @typedef {Object} CodeProperties
 * @property {string} [value]
 * @property {string} [lang]
 * @property {string} [meta]
 */

/** @typedef {Node & CodeProperties} CodeNode */

/**
 * @param {object} opts
 * @param {object} opts.extendDocsConfig
 * @returns
 */
export function remarkExtendLionDocsTransformJs({ extendDocsConfig }) {
  /**
   * @param {CodeNode} node
   */
  const visitor = node => {
    if (
      node.type === 'code' &&
      node.lang === 'js' &&
      (node.meta === 'story' || node.meta === 'preview-story' || node.meta === 'script') &&
      node.value
    ) {
      const processed = transformSync(node.value, {
        plugins: [['babel-plugin-extend-docs', extendDocsConfig]],
      });
      if (processed && processed.code) {
        node.value = processed.code;
      }
    }

    return node;
  };

  /**
   * @param {Node} tree
   */
  function transformer(tree) {
    // @ts-ignore
    visit(tree, visitor);
    return tree;
  }

  return transformer;
}
