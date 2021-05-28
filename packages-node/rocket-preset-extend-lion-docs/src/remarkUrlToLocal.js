/* eslint-disable no-param-reassign */
import path from 'path';
import visit from 'unist-util-visit';

/** @typedef {import('vfile').VFileOptions} VFileOptions */
/** @typedef {import('unist').Node} Node */

/**
 * @typedef {Object} UrlProperty
 * @property {string} url
 */

/** @typedef {Node & UrlProperty} UrlNode */

/**
 * @param {object} opts
 * @param {string} opts.gitHubUrl
 * @param {object} opts.page
 * @param {string} opts.page.inputPath
 * @param {string} opts.rootDir
 * @returns
 */
export function remarkUrlToLocal({ gitHubUrl, page, rootDir }) {
  /**
   * @param {UrlNode} node
   */
  const visitor = node => {
    if (node.type === 'link' || node.type === 'image') {
      if (node.url.startsWith(gitHubUrl)) {
        const urlPart = node.url.substring(gitHubUrl.length);
        const urlParts = urlPart.split('/');

        if (urlParts[0] === 'blob') {
          urlParts.shift();
          urlParts.shift();
          const fullUrlPath = path.join(rootDir, urlParts.join('/'));
          const fullInputPath =
            page.inputPath[0] === '/' ? page.inputPath : path.join(rootDir, page.inputPath);
          const newPath = path.relative(path.dirname(fullInputPath), fullUrlPath);
          node.url = newPath;
        }
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
