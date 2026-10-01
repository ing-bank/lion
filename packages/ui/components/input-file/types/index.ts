import { LionInputFile } from '../src/LionInputFile.js';
import { LionSelectedFileList } from '../src/LionSelectedFileList.js';

declare global {
  interface HTMLElementTagNameMap {
    'lion-input-file': LionInputFile;
    'lion-selected-file-list': LionSelectedFileList;
  }
}

export * from './input-file.js';
export { LionInputFile, LionSelectedFileList };
