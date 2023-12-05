import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const packageNames = ['lit'];

for (const packageName of packageNames) {
  const location = path.resolve(process.cwd(), 'node_modules', packageName);

  const developmentFiles = await globby('**/development/**', { cwd: location });

  for (const file of developmentFiles) {
    const fullPath = `${process.cwd()}/node_modules/${packageName}/${file}`;
    const content = await fs.promises.readFile(fullPath, 'utf8');
    const overridePath = fullPath.replace('/development/', '/');
    fs.promises.writeFile(overridePath, content);
  }
}
