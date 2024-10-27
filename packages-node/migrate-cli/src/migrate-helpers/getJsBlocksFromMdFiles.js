/* eslint-disable no-await-in-loop */
import fs from 'fs';
import path from 'path';

/**
 * @typedef {{jsBody:string; index:number; tmpBlockFilePath:string; mdFilePath:string}} BlockResult
 */

const TMP_DIR = `${process.cwd()}/_tmp-md-blocks`;

/**
 * @param {string|object} inputValue
 * @returns {number}
 */
export function getHash(inputValue) {
  if (typeof inputValue === 'object') {
    // eslint-disable-next-line no-param-reassign
    inputValue = JSON.stringify(inputValue);
  }
  return inputValue.split('').reduce(
    (prevHash, currVal) =>
      // eslint-disable-next-line no-bitwise
      ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
    0,
  );
}

/**
 * Call this when all codemods have run on extracted tmpBlockFilePaths
 *
 * @example
 * ```js
 * const { updateJsBlocksMdFiles } = await getJsBlocksFromMdFile({ mdFilePaths: ['/my/stories.md','/my/other-stories.md',] });
 * for (const mdFilePath of mdFilePaths) {
 *   await runCodemodsOnMdFile(mdFilePath);
 * }
 * await updateJsBlocksMdFiles();
 * ```
 * @param {BlockResult[]} blockResultsAllMdFiles
 * @param {string} tmpDir
 */
async function updateJsBlocksMdFiles(blockResultsAllMdFiles, tmpDir) {
  /** @type {{mdFilePath: string; blocks: BlockResult[]}[]} */
  const blockResultsOrderedByMdFile = [];
  for (const blockResult of blockResultsAllMdFiles) {
    const found = blockResultsOrderedByMdFile.find(e => e.mdFilePath === blockResult.mdFilePath);
    if (found) {
      found.blocks.push(blockResult);
    } else {
      blockResultsOrderedByMdFile.push({
        mdFilePath: blockResult.mdFilePath,
        blocks: [blockResult],
      });
    }
  }

  for (const file of blockResultsOrderedByMdFile) {
    if (!file.blocks?.length) {
      // eslint-disable-next-line no-continue
      continue;
    }
    let contentMdFile = await fs.promises.readFile(file.mdFilePath, 'utf-8');
    let shouldWrite = false;
    for (const block of file.blocks) {
      const newContent = await fs.promises.readFile(block.tmpBlockFilePath, 'utf-8');
      if (newContent !== block.jsBody) {
        shouldWrite = true;
        contentMdFile = contentMdFile.replace(block.jsBody, `${newContent}`);
      }
    }
    if (shouldWrite) {
      await fs.promises.writeFile(file.mdFilePath, contentMdFile);
    }
  }
  // clean up temp folder
  await fs.promises.rm(tmpDir, { recursive: true, force: true });
}

/**
 * Extracts js code examples, writes them to fs, so they are ready to be processed by codemods.
 * Returns a function to call when all codemods have run on extracted tmpBlockFilePaths
 *
 * @example
 * ```js
 * const { updateJsBlocksMdFiles } = await getJsBlocksFromMdFile({ mdFilePaths: ['/my/stories.md','/my/other-stories.md',] });
 * for (const mdFilePath of mdFilePaths) {
 *   await runCodemodsOnMdFile(mdFilePath);
 * }
 * await updateJsBlocksMdFiles();
 * ```
 *
 * @param {{mdFilePaths:string[]; tmpDir?:string}} opts
 * @returns {Promise<{updateJsBlocksMdFiles:function; tmpBlockFilePaths:string[]}>}
 */
export async function getJsBlocksFromMdFiles({ mdFilePaths, tmpDir = TMP_DIR }) {
  /** @type {BlockResult[]} */
  const blockResultsAllMdFiles = [];
  const tmpBlockFilePaths = [];
  await fs.promises.mkdir(tmpDir, { recursive: true });

  for (const mdFilePath of mdFilePaths) {
    const mdContent = await fs.promises.readFile(mdFilePath, 'utf-8');
    const re = /(```js)(.*\n)((.|\n)*?)(```)/;
    const allBlocks = mdContent.match(new RegExp(re, 'g')) || [];
    const pendingWritePromises = [];
    for (let i = 0; i < allBlocks.length; i += 1) {
      const block = allBlocks[i];
      const [, , , jsBody] = block.match(re) || [];
      const fileName = `h${getHash(mdFilePath.replace(process.cwd(), ''))}-${path.basename(
        mdFilePath,
        path.extname(mdFilePath),
      )}-${i}.js`;
      const tmpBlockFilePath = path.join(tmpDir, fileName);
      tmpBlockFilePaths.push(tmpBlockFilePath);
      const pendingWrite = fs.promises.writeFile(tmpBlockFilePath, jsBody);
      pendingWritePromises.push(pendingWrite);
      blockResultsAllMdFiles.push({ jsBody, index: i, tmpBlockFilePath, mdFilePath });
    }
    await Promise.all(pendingWritePromises);
  }

  return {
    tmpBlockFilePaths,
    updateJsBlocksMdFiles: () => updateJsBlocksMdFiles(blockResultsAllMdFiles, tmpDir),
  };
}
