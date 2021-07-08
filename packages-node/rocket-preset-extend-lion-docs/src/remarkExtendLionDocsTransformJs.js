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
 * @param {string} value
 * @param {string} from
 * @param {string} to
 */
function replaceTag(value, from, to) {
  return value
    .replace(new RegExp(`<${from}(?=\\s|>)`, 'g'), `<${to}`) // positive lookahead for '>' or ' ' after the tagName
    .replace(new RegExp(`/${from}>`, 'g'), `/${to}>`);
}

/**
 * @param {string} value
 * @param {{changes: Array<{ tag: { from: string, to: string }}> }} config
 * @returns {string} value with replaced tags
 */
function replaceTags(value, config) {
  let newValue = value;
  if (config && config.changes) {
    for (const change of config.changes) {
      if (change.tag) {
        const { from, to } = change.tag;
        newValue = replaceTag(newValue, from, to);
      }
    }
  }
  return newValue;
}

/**
 * @param {object} opts
 * @param {{changes: Array<{ tag: { from: string, to: string }}> }} opts.extendDocsConfig
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

    if (
      node.type === 'code' &&
      node.lang === 'html' &&
      (node.meta === 'story' || node.meta === 'preview-story' || node.meta === 'script') &&
      node.value
    ) {
      node.value = replaceTags(node.value, extendDocsConfig);
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
