import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import prettier from 'prettier';

import { PublishDocs } from '../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @typedef {import('../index').PublishDocsOptions} PublishDocsOptions */

/**
 * @param {string} inPath
 * @param {Partial<PublishDocsOptions>} options
 */
export async function execute(inPath, options = {}) {
  const srcRootDir = path.join(__dirname, inPath.split('/').join(path.sep));
  const projectDir = path.join(path.dirname(srcRootDir), '__output');
  if (options.gitRootDir) {
    // eslint-disable-next-line no-param-reassign
    options.gitRootDir = path.join(__dirname, options.gitRootDir.split('/').join(path.sep));
  }
  await fs.emptyDir(projectDir);
  await fs.copy(srcRootDir, projectDir);

  const cli = new PublishDocs({ projectDir, ...options });
  await cli.execute();

  return {
    /**
     * @param {string} filePath
     * @param {object} options
     * @param {boolean} [options.formatHtml]
     */
    readOutput: async (filePath, { formatHtml = false } = {}) => {
      const textBuffer = await fs.readFile(
        path.join(projectDir, filePath.split('/').join(path.sep)),
      );
      let text = textBuffer.toString();
      if (formatHtml) {
        text = prettier.format(text, { parser: 'html', printWidth: 100 });
      }
      text = text.trim();
      return text;
    },
  };
}
