/**
 * TS build uses jsdoc and TS files with "import { LitElement } from 'lit'"
 * - jsdoc compiles into "import { LitElement } from 'lit-element/lit-element.js'"
 * - TS output remains unchanged
 *
 * These different imports (although they should both ultimately resolve to "{ LitElement } from 'lit-element/lit-element.js'")
 * are incompatible (not considered the same class), which leads to errors for Subclassers.
 *
 * This script will make sure everything stays "import { LitElement } from 'lit'"
 * See: https://github.com/microsoft/TypeScript/issues/51622
 */

import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { globby } from 'globby';
import { fileURLToPath } from 'url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));

async function alignLitImports() {
  const fileNames = await globby([`${packageRoot}/dist-types`]);
  for (const fileName of fileNames) {
    // eslint-disable-next-line no-await-in-loop
    const contents = await fs.promises.readFile(fileName, 'utf-8');
    const replaced = contents.replace(
      /(LitElement.*\}) from "lit-element\/lit-element\.js/g,
      '$1 from "lit',
    );
    fs.promises.writeFile(fileName, replaced);
  }
}

alignLitImports();
