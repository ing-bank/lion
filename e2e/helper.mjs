import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * Read the current file and fetch all dynamic import dependencies using regex.
 * TODO use AST instead of regex
 */
const fetchAllTestsDependencies = async (importMeta) => {
  const currentFile = (await fs.promises.readFile(fileURLToPath(importMeta.url))).toString();
  const importRegexp = /import\((.+)\)/gm;
  const matches = [...currentFile.matchAll(importRegexp)];
  const dependencies = matches.map(arrayItem => {
    const dependency = arrayItem[1];
    return dependency.replace(/['"]+/g, '');
  });  
  return dependencies;
};

/**
 * Generates importMap with all the dependencies in the tests in this file and returns importMap as a string
 */
const getImportMap = async (importMeta) => {
  const dependencies = await fetchAllTestsDependencies(importMeta);
  const importMapObject = {
    imports: {},
  };
  dependencies.forEach(dependency => {
    importMapObject.imports[dependency] = importMeta.resolve(dependency).split(process.env.PWD)[1];
  });
  return JSON.stringify(importMapObject);
};

export const goToPage = async (page, importMeta) => {
  await page.goto(`http://localhost:8005/?importMap=${await getImportMap(importMeta)}`);
};