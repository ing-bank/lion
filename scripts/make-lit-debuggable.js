import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const packageNames = ['@lit/reactive-element', '@lit-labs/ssr'];

function fuzzyCheckForMinifiedCode(content) {
  const lines = content.split('\n');
  return lines.length < 10;
}

for (const packageName of packageNames) {
  const location = path.resolve(process.cwd(), 'node_modules', packageName);

  const developmentFiles = await globby('**/development/**', { cwd: location });

  for (const file of developmentFiles) {
    const fullPath = `${process.cwd()}/node_modules/${packageName}/${file}`;
    const content = await fs.promises.readFile(fullPath, 'utf8');

    // Only override if the file is minified
    if (fuzzyCheckForMinifiedCode(content)) {
      const overridePath = fullPath.replace('/development/', '/');
      fs.promises.writeFile(overridePath, content);
    }
  }
}
