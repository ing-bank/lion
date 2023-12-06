const path = require('path');
const fs = require('fs/promises');
const process = require('process');
// eslint-disable-next-line import/no-extraneous-dependencies
const imageExtensions = require('image-extensions');
// eslint-disable-next-line import/no-extraneous-dependencies
const findNodeModules = require('find-node-modules');
// eslint-disable-next-line import/no-extraneous-dependencies
const { init, parse } = require('es-module-lexer');
const childProcess = require('child_process');

const sourceDocsPath = 'docs';
const contentPathForDocs = 'src/content';
const contentDocsPath = `${contentPathForDocs}/docs`;
const publicPathForDocs = 'public';
const publicDocsPath = `${publicPathForDocs}/docs`;
const rootPath = process.cwd();
const isDistBuild = process.env.PROD === 'true';

async function processImportsForFile(filePath) {
  if (filePath.includes('__mdjs-stories')) {
    return;
  }
  const source = await fs.readFile(filePath, 'utf8');
  if (source === '' || !source.includes('import')) {
    return;
  }
  const fileExtName = path.extname(filePath);
  if (fileExtName !== '.js' && fileExtName !== '.mjs' && fileExtName !== '.ts') {
    return;
  }
  let newSource = '';
  let lastPos = 0;
  await init;
  const [imports] = parse(source);
  for (const importObj of imports) {
    newSource += source.substring(lastPos, importObj.s);
    const importSrc = source.substring(importObj.s, importObj.e);
    const isDynamicImport = importObj.d > -1;

    if (
      importSrc.startsWith('.') ||
      importSrc.startsWith('/') ||
      isDynamicImport ||
      importSrc.startsWith('import.')
    ) {
      newSource += importSrc;
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
  await fs.writeFile(filePath, newSource);
}

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

function getFrontmatter(text) {
  const result = {};
  if (!text.startsWith('---')) {
    return result;
  }
  const frontmatterRegex = /---\n(.+?)\n---/gs;
  const match = text.matchAll(frontmatterRegex);
  const matchResult = [...match]?.[0]?.[1] || '';
  if (matchResult) {
    matchResult.split('\n').forEach(pair => {
      const pairArr = pair.split(':');
      const key = pairArr[0].trim();
      const value = pairArr[1].trim();
      result[key] = value;
    });
  }
  return result;
}

function getContent(text) {
  if (Object.keys(getFrontmatter(text)).length === 0) {
    return text;
  }
  const frontmatterRegex = /---\n(.+?)\n---\n(.*)/gs;
  const match = text.matchAll(frontmatterRegex);
  return [...match]?.[0]?.[2] || text;
}

function frontmatterToString(frontmatter) {
  const prefix = '---\n';
  let result = prefix;
  Object.keys(frontmatter).forEach(key => {
    result += `${key}: ${frontmatter[key]}\n`;
  });
  if (result === prefix) {
    return '';
  }
  return `${result}---\n\n`;
}

function addFrontmatter(fileContent, key, value) {
  const frontmatter = getFrontmatter(fileContent);
  const content = getContent(fileContent);
  if (value) {
    frontmatter[key] = value;
  }
  return frontmatterToString(frontmatter) + content;
}

function getOrder(fileContent) {
  const orderRegexp = /#.+\|\|(\d+)/gm;
  const match = fileContent.matchAll(orderRegexp);
  return [...match]?.[0]?.[1];
}

async function copyDocs(currentPath = '') {
  const files = await fs.readdir(path.join(sourceDocsPath, currentPath));

  for (const file of files) {
    const sourceDocsFilePath = path.join(sourceDocsPath, currentPath, file);
    const contentDocsFilePath =
      file === 'index.md'
        ? path.join(contentDocsPath, currentPath, 'index-copy.md')
        : path.join(contentDocsPath, currentPath, file);
    const publicDocsFilePath = path.join(publicDocsPath, currentPath, file);
    const stats = await fs.lstat(sourceDocsFilePath);

    if (stats.isDirectory()) {
      if (currentPath === 'components') {
        await createInfoMd(contentDocsFilePath);
      }
      await copyDocs(path.join(currentPath, file));
    } else {
      if (
        (path.extname(file) === '.md' && sourceDocsFilePath !== `${sourceDocsPath}/index.md`) ||
        imageExtensions.includes(path.extname(file).split('.')[1])
      ) {
        await fs.mkdir(path.join(contentDocsPath, currentPath), { recursive: true });
        await fs.copyFile(sourceDocsFilePath, contentDocsFilePath);
        if (path.extname(file) === '.md') {
          const fileContent = await fs.readFile(contentDocsFilePath, 'utf8');
          let updatedFileContent = fileContent;
          if (contentDocsFilePath.includes('/components')) {
            const parentComponent = path.basename(currentPath);
            updatedFileContent = addFrontmatter(fileContent, 'component', parentComponent);
          }
          const order = getOrder(fileContent);
          updatedFileContent = addFrontmatter(updatedFileContent, 'order', order);
          await fs.writeFile(contentDocsFilePath, updatedFileContent);
        }
      }
      if (path.extname(file) !== '.md') {
        await fs.mkdir(path.join(publicDocsPath, currentPath), { recursive: true });
        await fs.copyFile(sourceDocsFilePath, publicDocsFilePath);
      }
    }
  }
}

async function copyDocsByFileArray(files) {
  for (const file of files) {
    const currentPath = path.dirname(file);
    const contentDocsFilePath = path.join(contentPathForDocs, file);
    const publicDocsFilePath = path.join(publicPathForDocs, file);
    if (path.extname(file) === '.md' && file !== 'index.md') {
      await fs.mkdir(path.join(contentPathForDocs, currentPath), { recursive: true });
      await fs.copyFile(file, contentDocsFilePath);

      if (file.includes('/components')) {
        const fileContent = await fs.readFile(contentDocsFilePath, 'utf8');
        const parentComponent = path.basename(currentPath);
        let updatedFileContent = fileContent;
        updatedFileContent = addFrontmatter(fileContent, 'component', parentComponent);
        const order = getOrder(fileContent);
        updatedFileContent = addFrontmatter(updatedFileContent, 'order', order);
        await fs.writeFile(contentDocsFilePath, updatedFileContent);
      }
    }
    if (path.extname(file) !== '.md') {
      await fs.mkdir(path.join(publicPathForDocs, currentPath), { recursive: true });
      await fs.copyFile(file, publicDocsFilePath);
      await processImportsForFile(publicDocsFilePath);
    }
  }
}

async function processImports(currentPath = '') {
  if (isDistBuild) {
    return;
  }
  const files = await fs.readdir(path.join(publicDocsPath, currentPath));

  for (const file of files) {
    const publicDocsFilePath = path.join(publicDocsPath, currentPath, file);
    const stats = await fs.stat(publicDocsFilePath);

    if (stats.isDirectory()) {
      if (!file.startsWith('_')) {
        await processImports(path.join(currentPath, file));
      }
    } else {
      await processImportsForFile(publicDocsFilePath);
    }
  }
}

async function watch() {
  const diffStr = childProcess.execSync('git diff --name-only "docs"').toString();
  const diffArr = diffStr.split('\n').filter(value => value);
  if (diffArr.length) {
    // eslint-disable-next-line no-console
    console.log('Files have been changed: ', diffArr);
  }
  await copyDocsByFileArray(diffArr);
}

module.exports = {
  copyDocs,
  processImports,
  watch,
};
