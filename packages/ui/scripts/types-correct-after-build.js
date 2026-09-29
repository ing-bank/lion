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
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { globby } from 'globby';
import { fileURLToPath } from 'url';

const packageRoot = fileURLToPath(new URL('../', import.meta.url));

async function alignLitImportsAndFixLocalPaths() {
  const fileNames = await globby('dist-types/**', { cwd: packageRoot });

  for (const fileName of fileNames) {
    const filePath = path.resolve(packageRoot, fileName);
    // eslint-disable-next-line no-await-in-loop
    const contents = await fs.promises.readFile(filePath, 'utf-8');
    let replaced = contents.replace(
      /(LitElement.*\}) from "lit-element\/lit-element\.js/g,
      '$1 from "lit',
    );

    // Now "unresolve" all paths that reference '../**/node_modules/**'
    // These are outside of the bundled repo and therefore break in consuming context
    // Also, they are resolved to their local context via the export map, this should be 'unwinded'
    const re = /"(..\/)*?node_modules\/@open-wc\/scoped-elements\/types\.js"/g;
    replaced = replaced.replace(re, '"@open-wc/scoped-elements/lit-element.js"');

    // eslint-disable-next-line no-await-in-loop
    await fs.promises.writeFile(filePath, replaced);
  }

  // Link define/*.d.ts to corresponding component types
  const defineFiles = await globby('dist-types/exports/define/*.d.ts', { cwd: packageRoot });
  for (const defineFile of defineFiles) {
    const baseName = path.basename(defineFile, '.d.ts'); // e.g. lion-radio or lion-input-tel-dropdown
    // Read source js file to see which component it imports
    const srcJsFile = path.resolve(packageRoot, 'exports/define', `${baseName}.js`);
    if (fs.existsSync(srcJsFile)) {
      // eslint-disable-next-line no-await-in-loop
      const srcJsContent = await fs.promises.readFile(srcJsFile, 'utf-8');
      const match = srcJsContent.match(/from '\.\.\/([^']+)\.js'/);
      if (match) {
        const compName = match[1];
        const typesIndexPath = path.resolve(packageRoot, 'components', compName, 'types/index.ts');
        if (fs.existsSync(typesIndexPath)) {
          const defineDtsPath = path.resolve(packageRoot, defineFile);
          // eslint-disable-next-line no-await-in-loop
          const currentDts = await fs.promises.readFile(defineDtsPath, 'utf-8');
          const importLine = `import '../../components/${compName}/types/index.js';\n`;
          if (!currentDts.includes(importLine)) {
            // eslint-disable-next-line no-await-in-loop
            await fs.promises.writeFile(defineDtsPath, `${importLine}${currentDts}`);
          }
        }
      }
    }
  }

  // Link exports/*.d.ts to corresponding component types
  const exportFiles = await globby('dist-types/exports/*.d.ts', { cwd: packageRoot });
  for (const exportFile of exportFiles) {
    const compName = path.basename(exportFile, '.d.ts');
    const typesIndexPath = path.resolve(packageRoot, 'components', compName, 'types/index.ts');
    if (fs.existsSync(typesIndexPath)) {
      const exportDtsPath = path.resolve(packageRoot, exportFile);
      // eslint-disable-next-line no-await-in-loop
      const currentDts = await fs.promises.readFile(exportDtsPath, 'utf-8');
      const importLine = `import '../components/${compName}/types/index.js';\n`;
      if (!currentDts.includes(importLine)) {
        // eslint-disable-next-line no-await-in-loop
        await fs.promises.writeFile(exportDtsPath, `${importLine}${currentDts}`);
      }
    }
  }
}

alignLitImportsAndFixLocalPaths();
