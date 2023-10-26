/* eslint-disable @typescript-eslint/ban-ts-comment */
/** @typedef {import('../types/code.js').Story} Story */
/** @typedef {import('../types/code.js').StoryTypes} StoryTypes */
/** @typedef {(name: string) => string} TagFunction */
/** @typedef {import('unist').Node} UnistNode */
/** @typedef {import('unist').Parent} UnistParent */
/** @typedef {import('vfile').VFileOptions} VFileOptions */

import { visit } from 'unist-util-visit';
import { init, parse } from 'es-module-lexer';

/**
 * @typedef {object} MDJSNodeProperties
 * @property {string} value
 * @property {'js'|'ts'|'html'} lang
 * @property {'script'|'story'|'preview-story'} meta
 */

/** @typedef {UnistNode & MDJSNodeProperties} MDJSNode */

/**
 * @param {string} code
 * @param {{type: StoryTypes}} options
 * @returns {Story}
 */
function extractStoryData(code, { type = 'js' } = { type: 'js' }) {
  const parsed = parse(code);
  const key = parsed[1][0];
  const name = key;
  return { key, name, code, type };
}

/**
 * @param {string} name
 */
function defaultStoryTag(name) {
  return `<mdjs-story mdjs-story-name="${name}"></mdjs-story>`;
}

/**
 * @param {string} name
 */
function defaultPreviewStoryTag(name) {
  return `<mdjs-preview mdjs-story-name="${name}">[[CODE SLOT]]</mdjs-preview>`;
}

/**
 * @param {object} arg
 * @param {TagFunction} [arg.storyTag]
 * @param {TagFunction} [arg.previewStoryTag]
 * @param {number} [arg.counter]
 */
export function mdjsStoryParse({
  storyTag = defaultStoryTag,
  previewStoryTag = defaultPreviewStoryTag,
} = {}) {
  /**
   * @param {Node} tree
   * @param {VFileOptions} file
   */
  async function transformer(tree, file) {
    /** @type {Story[]} */
    const stories = [];
    let htmlIndex = 0;

    /**
     * @param {UnistNode} _node
     * @param {number} index
     * @param {UnistParent} parent
     */
    const nodeCodeVisitor = (_node, index, parent) => {
      let node = /** @type {UnistNode & {[key: string]: unknown}} */ (_node);
      if (node.lang === 'js' && node.meta === 'story' && typeof node.value === 'string') {
        const storyData = extractStoryData(node.value);
        node.type = 'html';
        node.value = storyTag(storyData.name);
        stories.push(storyData);
      }
      if (node.lang === 'js' && node.meta === 'preview-story' && typeof node.value === 'string') {
        const storyData = extractStoryData(node.value);
        const newValue = previewStoryTag(storyData.name);
        if (newValue.includes('[[CODE SLOT]]')) {
          const tagParts = newValue.split('[[CODE SLOT]]');

          const inside = [node];
          let skipAmount = 1;

          const next = /** @type {UnistNode & {[key: string]: unknown}} */ (
            parent.children[index + 1]
          );
          if (next && next.type === 'code' && next.meta === 'story-code') {
            inside.push(next);
            skipAmount += 1;

            const next2 = /** @type {UnistNode & {[key: string]: unknown}} */ (
              parent.children[index + 2]
            );
            if (next2 && next2.type === 'code' && next2.meta === 'story-code') {
              inside.push(next2);
              skipAmount += 1;
            }
          }

          node = {
            type: 'root',
            children: [
              { type: 'html', value: tagParts[0] },
              { type: 'text', value: '\n\n' },
              ...inside,
              { type: 'text', value: '\n\n' },
              { type: 'html', value: tagParts[1] },
            ],
          };
          parent.children.splice(index, skipAmount, node);
        } else {
          node.type = 'html';
          node.value = previewStoryTag(storyData.name);
        }

        stories.push(storyData);
      }

      if (node.lang === 'html' && node.meta === 'story') {
        const storyData = extractStoryData(
          `export const HtmlStory${htmlIndex} = () => html\`${node.value}\`;`,
          { type: 'html' },
        );
        node.type = 'html';
        node.value = storyTag(storyData.name);
        stories.push(storyData);
        htmlIndex += 1;
      }
      if (node.lang === 'html' && node.meta === 'preview-story') {
        const storyData = extractStoryData(
          `export const HtmlStory${htmlIndex} = () => html\`${node.value}\`;`,
          { type: 'html' },
        );

        const newValue = previewStoryTag(storyData.name);
        if (newValue.includes('[[CODE SLOT]]')) {
          const tagParts = newValue.split('[[CODE SLOT]]');
          const inside = [node];
          let skipAmount = 1;
          const next = /** @type {UnistNode & {[key: string]: unknown}} */ (
            parent.children[index + 1]
          );
          if (next && next.type === 'code' && next.meta === 'story-code') {
            inside.push(next);
            skipAmount += 1;

            const next2 = /** @type {UnistNode & {[key: string]: unknown}} */ (
              parent.children[index + 2]
            );
            if (next2 && next2.type === 'code' && next2.meta === 'story-code') {
              inside.push(next2);
              skipAmount += 1;
            }
          }

          node = {
            type: 'root',
            children: [
              { type: 'html', value: tagParts[0] },
              { type: 'text', value: '\n\n' },
              ...inside,
              { type: 'text', value: '\n\n' },
              { type: 'html', value: tagParts[1] },
            ],
          };
          parent.children.splice(index, skipAmount, node);
        } else {
          node.type = 'html';
          node.value = previewStoryTag(storyData.name);
        }

        stories.push(storyData);
        htmlIndex += 1;
      }
    };

    // unifiedjs expects node changes to be made on the given node...
    await init;
    // @ts-ignore
    visit(tree, 'code', nodeCodeVisitor);
    // we can only return/modify the tree but stories should not be part of the tree
    // so we attach it globally to the file.data
    if (!file.data) {
      file.data = {};
    }
    file.data.stories = stories;

    return tree;
  }

  return transformer;
  /* eslint-enable no-param-reassign */
}
