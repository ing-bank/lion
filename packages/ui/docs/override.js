/**
 * This will override all md files within the folder to only contain [=> See Source <=](../path/to/source.md)
 */

import { writeFile } from 'fs/promises';
import glob from 'glob';

const allFiles = glob.sync('**/*.md', { nodir: true });
const files = allFiles;

for (const filePath of files) {
  const insert = 3 + filePath.match(/\//g).length;
  const srcPath = `${'../'.repeat(insert)}docs/${filePath}`;
  await writeFile(filePath, `[=> See Source <=](${srcPath})`);
}
