import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import mockFs from 'mock-fs';
import mockRequire from 'mock-require';

/**
 * @typedef {import('./types.js').MockBridgeOpts} MockBridgeOpts
 */

/**
 * @param {object} obj
 */
export function mock(obj) {
  mockFs(obj);

  Object.entries(obj).forEach(([key, value]) => {
    if (key.endsWith('.json')) {
      mockRequire(key, JSON.parse(value));
    } else {
      mockRequire(key, value);
    }
  });
}

mock.restore = () => {
  mockFs.restore();
  mockRequire.stopAll();
};

/**
 * TODO: remove this method if mock-fs works as expected
 * @param {{[path:string]: string }} projectMock
 * @param {{ projectName:string }} opts
 */
export async function createTempProjectFixture(projectMock, { projectName }) {
  const projectPath = fileURLToPath(new URL(`./_temp-fixtures/${projectName}`, import.meta.url));

  const pendingWrites = [];
  for (const [localPath, content] of Object.entries(projectMock)) {
    const finalPath = path.join(projectPath, localPath);
    await fs.promises.mkdir(path.dirname(finalPath), { recursive: true });
    pendingWrites.push(fs.promises.writeFile(finalPath, content));
  }

  await Promise.all(pendingWrites);
  return projectPath;
}

/**
 * @param {string} [projectName]
 */
export async function restoreTempProjectFixture(projectName) {
  const pathToClean = fileURLToPath(
    new URL(`./_temp-fixtures${projectName ? `/${projectName}` : ''}`, import.meta.url),
  )
    .toString()
    .replace(/^file:\/\//, '');
  await fs.promises.rm(pathToClean, { recursive: true });
}
