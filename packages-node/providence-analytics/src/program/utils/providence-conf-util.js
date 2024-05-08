import path from 'path';
import { pathToFileURL } from 'url';
import { fsAdapter } from './fs-adapter.js';

/**
 * @typedef {import('../../../types/index.js').ProvidenceCliConf} ProvidenceCliConf
 */

/**
 * @returns {Promise<{providenceConf:Partial<ProvidenceCliConf>;providenceConfRaw:string}|null>}
 */
async function getConf() {
  const confPathWithoutExtension = `${path.join(process.cwd(), 'providence.conf')}`;
  let confPathFound;
  try {
    if (fsAdapter.fs.existsSync(`${confPathWithoutExtension}.js`)) {
      confPathFound = `${confPathWithoutExtension}.js`;
    } else if (fsAdapter.fs.existsSync(`${confPathWithoutExtension}.mjs`)) {
      confPathFound = `${confPathWithoutExtension}.mjs`;
    }
  } catch (_) {
    throw new Error(
      `Please provide ${confPathWithoutExtension}.js or ${confPathWithoutExtension}.mjs`,
    );
  }
  if (!confPathFound) {
    return null;
  }
  const { href: configPathUrl } = pathToFileURL(confPathFound);
  const { default: providenceConf } = await import(configPathUrl);

  if (!providenceConf) {
    throw new Error(
      `providence.conf.js file should be in es module format (so it can be read by a browser).
      So use "export default {}" instead of "module.exports = {}"`,
    );
  }

  const providenceConfRaw = fsAdapter.fs.readFileSync(confPathFound, 'utf8');
  return { providenceConf, providenceConfRaw };
}

// Wrapped in object for stubbing
export const providenceConfUtil = { getConf };
