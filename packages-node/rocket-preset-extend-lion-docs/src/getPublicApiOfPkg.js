import path from 'path';
import { readFile } from 'fs/promises';
import { init, parse } from 'es-module-lexer';
import glob from 'glob';

await init;

/**
 *
 * @param {string} pkgJsonPath
 * @returns
 */
export async function getPublicApiOfPkg(pkgJsonPath) {
  const pkgPath = path.dirname(pkgJsonPath);
  const pkgJsonString = await readFile(pkgJsonPath, 'utf8');
  const pkgJson = JSON.parse(pkgJsonString);
  const { name, exports: pkgExports } = pkgJson;

  /**
   * @type {{ name: string, entryPoints: Array<{ entry: string, name: string, namePath: string, exports: string[], path: string }> }}
   */
  const publicApi = {
    name,
    entryPoints: [],
  };
  for (const pkgExportDefinition of Object.keys(pkgExports)) {
    const pkgExportPath =
      pkgExports[pkgExportDefinition].default ||
      pkgExports[pkgExportDefinition].module ||
      pkgExports[pkgExportDefinition];
    const entryPointFilePath = path.join(pkgPath, pkgExportPath);

    if (glob.hasMagic(entryPointFilePath)) {
      const globifiedEntryPointFilePath = entryPointFilePath.replace(/\*/, '**');
      for (const entryPointFile of glob.sync(globifiedEntryPointFilePath, { nodir: true })) {
        const fullPkgExportPath = path.join(pkgPath, pkgExportPath);
        const reg = new RegExp(`^${fullPkgExportPath.replace('*', '(.*)')}$`);
        const match = reg.exec(entryPointFile);
        if (match) {
          const pkgEntryPointPath = match[1];
          const pkgEntryPoint = `${name}/${pkgEntryPointPath}`;

          if (entryPointFile.endsWith('.js')) {
            const src = await readFile(entryPointFile, 'utf8');
            const [, exports] = parse(src);
            publicApi.entryPoints.push({
              entry: pkgExportDefinition,
              name: pkgEntryPoint,
              namePath: pkgEntryPointPath,
              exports,
              path: entryPointFile,
            });
          }
        }
      }
    } else {
      const pkgEntryPointPath = pkgExportDefinition === '.' ? '' : pkgExportDefinition;
      const pkgEntryPoint = pkgEntryPointPath ? `${name}/${pkgEntryPointPath}` : name;
      if (entryPointFilePath.endsWith('.js')) {
        const src = await readFile(entryPointFilePath, 'utf8');
        const [, exports] = parse(src);
        publicApi.entryPoints.push({
          entry: pkgExportDefinition,
          name: pkgEntryPoint,
          namePath: pkgEntryPointPath,
          exports,
          path: entryPointFilePath,
        });
      }
    }
  }
  return publicApi;
}
