const path = require('path');
const fs = require('fs/promises');
const process = require('process');
// eslint-disable-next-line import/no-extraneous-dependencies
const findNodeModules = require('find-node-modules');
// eslint-disable-next-line import/no-extraneous-dependencies
const { init, parse } = require('es-module-lexer');

const sourceDocsPath = 'docs';
const contentDocsPath = 'contentDocs';
const publicDocsPath = 'publicDocs';
const rootPath = process.cwd();

async function processImportsForFile(source, filePath) {
  if (source !== '' && source.includes('import')) {
    let newSource = '';
    let lastPos = 0;
    await init;
    const [imports] = parse(source);
    for (const importObj of imports) {
      newSource += source.substring(lastPos, importObj.s);
      const importSrc = source.substring(importObj.s, importObj.e);

      if (importSrc.startsWith('.') || importSrc === 'import.meta') {
        // noop
      } else {
        const nodeModulesLocation = findNodeModules(filePath)[0];
        const nodeModulesLocation1 = path.join(filePath, nodeModulesLocation);
        const resolvedImportPath = require.resolve(importSrc, { paths: [nodeModulesLocation1] });
        const lastNodeModulesDirectoryIndex = resolvedImportPath.lastIndexOf('nodeModulesText');
        const nodeModulesPath = resolvedImportPath.substring(0, lastNodeModulesDirectoryIndex);
        const dependencyPath = resolvedImportPath.substring(lastNodeModulesDirectoryIndex);
        if (nodeModulesPath === rootPath) {
          newSource += dependencyPath;
        } else {
          newSource += resolvedImportPath.split(rootPath)[1];
        }
      }

      lastPos = importObj.e;
    }
    newSource += source.substring(lastPos, source.length);
    return newSource;
  }

  return source;
}

const createComponentMdFrontmatter = componentName => `---
component: ${componentName}
---\n\n`;

async function createInfoMd(componentDirectoryPath) {
  const componentName = path.basename(componentDirectoryPath);
  const infoMd = `---
component: ${componentName}
title: ${componentName} title
description: ${componentName} description    
---\n`;
  const infoMdFilePath = path.join(componentDirectoryPath, 'info.md');
  await fs.mkdir(componentDirectoryPath, { recursive: true });
  await fs.writeFile(infoMdFilePath, infoMd);
}

async function copyDocs(currentPath = '') {
  const files = await fs.readdir(path.join(sourceDocsPath, currentPath));

  for (const file of files) {
    const sourceDocsFilePath = path.join(sourceDocsPath, currentPath, file);
    const contentDocsFilePath = path.join(contentDocsPath, currentPath, file);
    const publicDocsFilePath = path.join(publicDocsPath, currentPath, file);
    const stats = await fs.lstat(sourceDocsFilePath);

    if (stats.isDirectory()) {
      if (currentPath === 'components') {
        await createInfoMd(contentDocsFilePath);
      }
      await copyDocs(path.join(currentPath, file));
    } else {
      await fs.mkdir(path.join(contentDocsPath, currentPath), { recursive: true });
      await fs.copyFile(sourceDocsFilePath, contentDocsFilePath);
      const fileContent = await fs.readFile(contentDocsFilePath, 'utf8');

      if (path.extname(file) === '.md') {
        const parentComponent = path.basename(currentPath);
        const updatedFileContent = `${createComponentMdFrontmatter(parentComponent)}${fileContent}`;
        await fs.writeFile(contentDocsFilePath, updatedFileContent);
      }
      if (path.extname(file) !== '.md') {
        await fs.mkdir(path.join(publicDocsPath, currentPath), { recursive: true });
        await fs.copyFile(sourceDocsFilePath, publicDocsFilePath);
      }
    }
  }
}

async function processImports(currentPath = '') {
  const files = await fs.readdir(path.join(publicDocsPath, currentPath));

  for (const file of files) {
    const publicDocsFilePath = path.join(publicDocsPath, currentPath, file);
    const stats = await fs.stat(publicDocsFilePath);

    if (stats.isDirectory()) {
      if (!file.startsWith('_')) {
        await processImports(path.join(currentPath, file));
      }
    } else {
      const fileContent = await fs.readFile(publicDocsFilePath, 'utf8');
      const fileExtName = path.extname(file);

      if (fileExtName === '.js' || fileExtName === '.mjs' || fileExtName === '.ts') {
        const parsedFile = await processImportsForFile(fileContent, publicDocsFilePath);
        await fs.writeFile(publicDocsFilePath, parsedFile.toString());
      }
    }
  }
}

module.exports = {
  copyDocs,
  processImports,
};
