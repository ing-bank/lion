import { existsSync, mkdirSync } from 'fs';
// @ts-ignore
import { mkdir } from 'fs/promises';

/**
 * Makes a directory recursively & synchronously
 *
 * @param {string} dirPath
 */
export const makeDirSync = async dirPath => {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Makes a directory recursively & asynchronously
 *
 * @param {string} dirPath
 */
export const makeDir = async dirPath => mkdir(dirPath, { recursive: true });
