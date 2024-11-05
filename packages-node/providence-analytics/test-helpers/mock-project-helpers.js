import module from 'module';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import mockFs from 'mock-fs';

export const mock = mockFs;

/**
 * Makes sure that, whenever the main program (providence) calls
 * "InputDataService.createDataObject", it gives back a mocked response.
 * @param {string[]|object} files all the code that will be run trhough AST
 * @param {object} [cfg]
 * @param {string} [cfg.projectName='fictional-project']
 * @param {string} [cfg.projectPath='/fictional/project']
 * @param {string[]} [cfg.filePaths=`[/fictional/project/test-file-${i}.js]`] The indexes of the file
 * paths match with the indexes of the files
 * @param {object} existingMock config for mock-fs, so the previous config is not overridden
 */
function getMockObjectForProject(files, cfg = {}, existingMock = {}) {
  const projName = cfg.projectName || 'fictional-project';
  const projPath = cfg.projectPath || '/fictional/project';

  // Create obj structure for mock-fs
  /**
   * @param {object} files
   */
  // eslint-disable-next-line no-shadow
  function createFilesObjForFolder(files) {
    let projFilesObj = {};
    if (Array.isArray(files)) {
      projFilesObj = files.reduce((res, code, i) => {
        const fileName = (cfg.filePaths && cfg.filePaths[i]) || `./test-file-${i}.js`;
        const localFileName = path.resolve(projPath, fileName);
        res[localFileName] = code;
        return res;
      }, {});
    } else {
      Object.keys(files).forEach(f => {
        const localFileName = path.resolve(projPath, f);
        projFilesObj[localFileName] = files[f];
      });
    }
    return projFilesObj;
  }

  const optionalPackageJson = {};
  const hasPackageJson =
    (cfg.filePaths && cfg.filePaths.includes('./package.json')) || files['./package.json'];
  if (!hasPackageJson) {
    optionalPackageJson[projPath] = {
      'package.json': `{ "name": "${projName}" , "version": "${cfg.version || '0.1.0-mock'}" }`,
    };
  }

  const totalMock = {
    ...optionalPackageJson,
    ...existingMock, // can only add to mock-fs, not expand existing config?
    ...createFilesObjForFolder(files),
  };
  return totalMock;
}

/**
 * @param {string} resolvedPath
 * @param {string} dynamicImport
 * @returns {string}
 */
function getPackageRootFromNodeModulesPath(resolvedPath, dynamicImport) {
  const scope = dynamicImport.startsWith('@') ? dynamicImport.split('/')[0] : dynamicImport;
  const tailOfRootPath = `${path.sep}node_modules${path.sep}${scope}`;
  const lio = resolvedPath.lastIndexOf(tailOfRootPath);
  return resolvedPath.slice(0, lio + tailOfRootPath.length);
}

function incorporateDynamicImports(
  dynamicImports = [
    {
      name: 'oxc-parser',
      siblings: [
        '@oxc-parser',
        // '@oxc-resolver'
      ],
    },
    { name: '@babel/parser' },
    { name: '@swc/core' },
  ],
) {
  const require = module.createRequire(import.meta.url);
  const importablePaths = [];
  for (const dynamicImport of dynamicImports) {
    const resolvedPath = require.resolve(dynamicImport.name);
    const rootPath = getPackageRootFromNodeModulesPath(resolvedPath, dynamicImport.name);
    importablePaths.push(rootPath);
    for (const sibling of dynamicImport.siblings || []) {
      const siblingPath = `${rootPath.split(path.sep).slice(0, -1).join(path.sep)}${path.sep}${sibling}`;
      importablePaths.push(siblingPath);
    }
  }
  return importablePaths;
}
const importablePaths = incorporateDynamicImports();

/**
 * Makes sure that, whenever the main program (providence) calls
 * "InputDataService.createDataObject", it gives back a mocked response.
 * @param {string[]|object} files all the code that will be run trhough AST
 * @param {object} [cfg]
 * @param {string} [cfg.projectName='fictional-project']
 * @param {string} [cfg.projectPath='/fictional/project']
 * @param {string[]} [cfg.filePaths=`[/fictional/project/test-file-${i}.js]`] The indexes of the file
 * paths match with the indexes of the files
 * @param {object} existingMock config for mock-fs, so the previous config is not overridden
 */
export function mockProject(files, cfg = {}, existingMock = {}) {
  const obj = getMockObjectForProject(files, cfg, existingMock);
  mockFs({ ...obj, ...Object.fromEntries(importablePaths.map(p => [p, mockFs.load(p)])) });
  return obj;
}

export function restoreMockedProjects() {
  mockFs.restore();
}

export function getEntry(queryResult, index = 0) {
  return queryResult.queryOutput[index];
}

export function getEntries(queryResult) {
  return queryResult.queryOutput;
}

function createPackageJson({ filePaths, codeSnippets, projectName, refProjectName, refVersion }) {
  const targetHasPackageJson = filePaths.includes('./package.json');
  // Make target depend on ref
  if (targetHasPackageJson) {
    return;
  }
  const pkgJson = {
    name: projectName,
    version: '1.0.0',
  };
  if (refProjectName && refVersion) {
    pkgJson.dependencies = { [refProjectName]: refVersion };
  }
  codeSnippets.push(JSON.stringify(pkgJson));
  filePaths.push('./package.json');
}

/**
 * Requires two config objects (see match-imports and match-subclasses tests)
 * and based on those, will use mock-fs package to mock them in the file system.
 * All missing information (like target depending on ref, version numbers, project names
 * and paths will be auto generated when not specified.)
 * When a non imported ref dependency or a wrong version of a dev dependency needs to be
 * tested, please explicitly provide a ./package.json that does so.
 */
export function mockTargetAndReferenceProject(searchTargetProject, referenceProject) {
  const targetProjectName = searchTargetProject.name || 'fictional-target-project';
  const refProjectName = referenceProject.name || 'fictional-ref-project';

  const targetcodeSnippets = searchTargetProject.files.map(f => f.code);
  const targetFilePaths = searchTargetProject.files.map(f => f.file);
  const refVersion = referenceProject.version || '1.0.0';
  const refcodeSnippets = referenceProject.files.map(f => f.code);
  const refFilePaths = referenceProject.files.map(f => f.file);

  createPackageJson({
    filePaths: targetFilePaths,
    codeSnippets: targetcodeSnippets,
    projectName: targetProjectName,
    refProjectName,
    refVersion,
  });

  createPackageJson({
    filePaths: refFilePaths,
    codeSnippets: refcodeSnippets,
    projectName: refProjectName,
  });

  // Create target mock
  const targetMock = getMockObjectForProject(targetcodeSnippets, {
    filePaths: targetFilePaths,
    projectName: targetProjectName,
    projectPath: searchTargetProject.path || 'fictional/target/project',
  });

  // Append ref mock
  mockProject(
    referenceProject.files.map(f => f.code),
    {
      filePaths: referenceProject.files.map(f => f.file),
      projectName: refProjectName,
      projectPath: referenceProject.path || 'fictional/ref/project',
      version: refVersion,
    },
    targetMock,
  );
}
