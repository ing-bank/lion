import path from 'node:path';
import util from 'node:util';
import fs from 'node:fs';

import { createImportMap, getPackageJson } from '../node/createImportMap.js';

/**
 * @typedef {{
 *  destination: string;
 *  package: string;
 *  deps?: string[];
 * }} CliOptions
 */

/**
 * getParsedCliOptions
 * @param {{argv:string[]; version?:string; options: any }} opts
 * @returns {object}
 */
function getParsedCliOptions({ argv, options }) {
  // TODO: use zod for types
  const finalOptions = {
    // We get an error if we don't provide at least one boolean type
    __obligatedBoolean: { type: 'boolean' },
    ...options,
  };

  const result = util.parseArgs({ allowPositionals: true, args: argv, options: finalOptions });

  const cliOptions = {};
  for (const [key, value] of Object.entries(result.values)) {
    if (value === undefined || key === '__obligatedBoolean') continue;

    if (typeof options[key].parser === 'function') {
      cliOptions[key] = options[key].parser(value);
    } else {
      cliOptions[key] = value;
    }
  }

  return cliOptions;
}

async function generateAssets() {
  const cliOptions = /** @type {CliOptions} */ (
    getParsedCliOptions({
      argv: process.argv,
      options: {
        /**
         * Where should we put the generated/found assets (import map and customelements.js)?
         * Example: --destination ./docs/public
         */
        destination: { type: 'string' },
        /**
         * For what package should we create the import map and get the customelements.json?
         * Example: --package ./lion-playground
         */
        package: { type: 'string' },
        /**
         * What dependencies should we include in the import map?
         * N.B. this should be defined as a comma separated list enclosed in quotes
         * Example: --deps @lion/ui|lit
         * (this allows us to edit these dependencies in the playground, which is ideal for debugging)
         */
        deps: {
          type: 'string',
          parser: (/** @type {string} */ val) => val.split('|'),
        },
      },
    })
  );

  if (!cliOptions.destination) {
    throw new Error('Please provide a destination for the generated assets');
  }
  await fs.promises.mkdir(cliOptions.destination, { recursive: true });

  if (!cliOptions.package || !fs.existsSync(cliOptions.package)) {
    throw new Error('Please provide a valid package to generate the assets for');
  }

  const packagePath = path.resolve(cliOptions.package);
  const customElementsJsonPath = path.resolve(packagePath, 'custom-elements.json');
  if (!fs.existsSync(customElementsJsonPath)) {
    throw new Error(
      `The custom elements json file does not exist at ${customElementsJsonPath}. Please run the build script first.`,
    );
  }
  const customElementsJson = JSON.parse(await fs.promises.readFile(customElementsJsonPath, 'utf8'));
  const packageName = (await getPackageJson(packagePath))?.name;
  const ceManifestObject = {
    packageName,
    packagePath,
    customElementsJson,
  };

  writeJsonAsJsFile(ceManifestObject, {
    fileName: 'ceManifestObject.js',
    destination: cliOptions.destination,
  });

  // This is a write run, so we can use the write runner to generate the import map
  const importMap = await createImportMap([cliOptions.package], {
    packagesToTraceDepsFor: cliOptions.deps,
  });

  writeJsonAsJsFile(importMap, {
    fileName: 'importMapPerPackage.js',
    destination: cliOptions.destination,
  });

  /**
   * @param {object} jsonFile
   * @param {{ fileName: string; destination: string }} opts'
   * @returns {Promise<void>}
   */
  async function writeJsonAsJsFile(jsonFile, { fileName, destination }) {
    const jsonSerialized = JSON.stringify(jsonFile, null, 2);
    return fs.promises.writeFile(
      path.resolve(destination, fileName),
      `export default ${jsonSerialized};`,
      'utf8',
    );
  }
}

generateAssets();
