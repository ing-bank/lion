import pathLib from 'path';
import fs from 'fs';

/**
 * @returns {Promise<object|null>}
 */
export async function getProvidenceConf() {
  const confPathWithoutExtension = `${pathLib.join(process.cwd(), 'providence.conf')}`;
  let confPathFound;
  try {
    if (fs.existsSync(`${confPathWithoutExtension}.js`)) {
      confPathFound = `${confPathWithoutExtension}.js`;
    } else if (fs.existsSync(`${confPathWithoutExtension}.mjs`)) {
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

  const { default: providenceConf } = await import(confPathFound);

  if (!providenceConf) {
    throw new Error(
      `providence.conf.js file should be in es module format (so it can be read by a browser).
      So use "export default {}" instead of "module.exports = {}"`,
    );
  }

  const providenceConfRaw = fs.readFileSync(confPathFound, 'utf8');

  return { providenceConf, providenceConfRaw };
}
