/**
 * `fs/promises` as its own module, because the import map maps specifiers to urls: a package that
 * writes `import { readFile } from 'fs/promises'` needs named exports, not a namespace object.
 */
import { promises } from './fs.js';

export const {
  readFile,
  writeFile,
  mkdir,
  readdir,
  stat,
  rm,
  copyFile,
  rename,
  mkdtemp,
  realpath,
  unlink,
  access,
} = promises;

export default promises;
