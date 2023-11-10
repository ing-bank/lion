import path from 'path';
import slash from 'slash';

/** @typedef {import('vfile').VFileOptions} VFileOptions */
/** @typedef {import('unist').Node} Node */
/** @typedef {import('../types/code.js').Story} Story */

/**
 * @typedef {Object} simulationSettings
 * @property {string} [simulatorUrl]
 */

/**
 * @typedef {Object} rocketConfig
 * @property {string} [pathPrefix]
 */

/**
 * @param {object} options
 * @param {string} [options.rootNodeQueryCode]
 * @param {simulationSettings} [options.simulationSettings]
 * @param {rocketConfig} [options.rocketConfig]
 * @returns
 */
export function mdjsSetupCode({
  rootNodeQueryCode = 'document',
  simulationSettings = {},
  rocketConfig = {},
} = {}) {
  if (rocketConfig && rocketConfig.pathPrefix) {
    if (simulationSettings && simulationSettings.simulatorUrl) {
      const { simulatorUrl } = simulationSettings;
      if (simulatorUrl[0] === '/' && !simulatorUrl.startsWith(rocketConfig.pathPrefix)) {
        simulationSettings.simulatorUrl = slash(
          path.join(rocketConfig.pathPrefix, simulationSettings.simulatorUrl),
        );
      }
    }
  }

  /**
   * @param {Node} tree
   * @param {VFileOptions} file
   */
  async function transformer(tree, file) {
    if (!file.data) {
      file.data = {};
    }
    const { stories, jsCode } = file.data;
    file.data.setupJsCode = jsCode;

    if (Array.isArray(stories) && stories.length > 0) {
      const storiesCode = stories.map(/** @param {Story} story */ story => story.code).join('\n');

      const invokeStoriesCode = [];
      for (const story of stories) {
        invokeStoriesCode.push(`{ key: '${story.key}', story: ${story.key} }`);
      }

      file.data.setupJsCode = [
        '/** script code **/',
        jsCode,
        '/** stories code **/',
        storiesCode,
        '/** stories setup code **/',
        `const rootNode = ${rootNodeQueryCode};`,
        `const stories = [${invokeStoriesCode.join(', ')}];`,
        'let needsMdjsElements = false;',
        `for (const story of stories) {`,
        // eslint-disable-next-line no-template-curly-in-string
        '  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);',
        '  if (storyEl) {',
        `    storyEl.story = story.story;`,
        `    storyEl.key = story.key;`,
        `    needsMdjsElements = true;`,
        `    Object.assign(storyEl, ${JSON.stringify(simulationSettings)});`,
        '  }',
        `};`,
      ].join('\n');
    }

    return tree;
  }

  return transformer;
}
