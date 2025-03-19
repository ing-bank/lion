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

async function alignLitImportsAndFixLocalPaths() {
  const fileNames = await globby('dist-types/**', { cwd: packageRoot });

  for (const fileName of fileNames) {
    // eslint-disable-next-line no-await-in-loop
    const contents = await fs.promises.readFile(fileName, 'utf-8');
    const replaced1 = contents.replace(
      /(LitElement.*\}) from "lit-element\/lit-element\.js/g,
      '$1 from "lit',
    );

    // Now "unresolve" all paths that reference '../**/node_modules/**'
    // These are outside of the bundled repo and therefore break in consuming context
    // Also, they are resolved to their local context via the export map, this should be 'unwinded'

    const re = /"(..\/)*?node_modules\/@open-wc\/scoped-elements\/types\.js"/g;
    const replaced2 = replaced1.replace(re, '"@open-wc/scoped-elements/lit-element.js"');

    // For now, we did a quick and dirty fix with specific knowledge of this repo,
    // because we expect https://github.com/microsoft/TypeScript/issues/51622 to be solved in the future.

    fs.promises.writeFile(fileName, replaced2);
  }
}

alignLitImportsAndFixLocalPaths();
