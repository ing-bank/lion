// eslint-disable-next-line import/no-extraneous-dependencies
const mockFs = require('mock-fs');
const path = require('path');

/**
 * @desc Makes sure that, whenever the main program (providence) calls
 * "InputDataService.createDataObject", it gives back a mocked response.
 * @param {string[]|object} files all the code that will be run trhough AST
 * @param {object} [cfg]
 * @param {string} [cfg.project='fictional-project']
 * @param {string} [cfg.projectPath='/fictional/project']
 * @param {string[]} [cfg.filePath=`/fictional/project/test-file-${i}.js`] The indexes of the file
 * paths match with the indexes of the files
 * @param {object} existingMock config for mock-fs, so the previous config is not overridden
 */
function mockProject(files, cfg = {}, existingMock = {}) {
  const projName = cfg.projectName || 'fictional-project';
  const projPath = cfg.projectPath || '/fictional/project';

  // Create obj structure for mock-fs
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
    ...existingMock, // can only add to mock-fs, not expand existing config?
    ...optionalPackageJson,
    ...createFilesObjForFolder(files),
  };

  mockFs(totalMock);
  return totalMock;
}

function restoreMockedProjects() {
  mockFs.restore();
}

function getEntry(queryResult, index = 0) {
  return queryResult.queryOutput[index];
}

function getEntries(queryResult) {
  return queryResult.queryOutput;
}

/**
 * Requires two config objects (see match-imports and match-subclasses tests)
 * and based on those, will use mock-fs package to mock them in the file system.
 * All missing information (like target depending on ref, version numbers, project names
 * and paths will be auto generated when not specified.)
 * When a non imported ref dependency or a wrong version of a dev dependency needs to be
 * tested, please explicitly provide a ./package.json that does so.
 */
function mockTargetAndReferenceProject(searchTargetProject, referenceProject) {
  const targetProjectName = searchTargetProject.name || 'fictional-target-project';
  const refProjectName = referenceProject.name || 'fictional-ref-project';

  const targetcodeSnippets = searchTargetProject.files.map(f => f.code);
  const targetFilePaths = searchTargetProject.files.map(f => f.file);
  const refVersion = referenceProject.version || '1.0.0';

  const targetHasPackageJson = targetFilePaths.includes('./package.json');
  // Make target depend on ref
  if (!targetHasPackageJson) {
    targetcodeSnippets.push(`{
      "name": "${targetProjectName}" ,
      "version": "1.0.0",
      "dependencies": {
        "${refProjectName}": "${refVersion}"
      }
    }`);
    targetFilePaths.push('./package.json');
  }

  // Create target mock
  const targetMock = mockProject(targetcodeSnippets, {
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

module.exports = {
  mockProject,
  restoreMockedProjects,
  getEntry,
  getEntries,
  mockTargetAndReferenceProject,
};
