import { dirname } from 'path';
import { fileURLToPath } from 'url';

/**
 * @param {string} importMetaUrl should be import.meta.url
 */
export function getCurrentDir(importMetaUrl) {
  return dirname(fileURLToPath(importMetaUrl));
}
