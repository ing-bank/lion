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
 * @param {string} pathStr C:\Example\path/like/this
 * @returns {string} /Example/path/like/this
 */
function toPosixPath(pathStr) {
  if (process.platform === 'win32') {
    return pathStr.replace(/^.:/, '').replace(/\\/g, '/');
  }
  return pathStr;
}

/**
 * @param {object} opts
 * @param {string} opts.gitHubUrl
 * @param {{inputPath:string}} opts.page
 * @param {string} opts.rootDir
 */
export function remarkUrlToLocal({ gitHubUrl, page, rootDir }) {
  const inputPath = toPosixPath(page.inputPath);

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
          const fullInputPath = inputPath[0] === '/' ? inputPath : path.join(rootDir, inputPath);
          const newPath = path.relative(path.dirname(fullInputPath), fullUrlPath);
          node.url = toPosixPath(newPath);
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
