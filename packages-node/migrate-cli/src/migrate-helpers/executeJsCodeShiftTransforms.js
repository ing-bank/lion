// @ts-ignore
import { run as jscodeshift } from 'jscodeshift/src/Runner.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { globby } from 'globby';
import { getJsBlocksFromMdFiles } from './getJsBlocksFromMdFiles.js';

/**
 * @typedef {import('../../types/index.js').WorkspaceMeta}WorkspaceMeta
 */

function captureLogs({
  shouldCaptureConsole = true,
  shouldCaptureStdout = false,
  shouldDebug = false,
}) {
  /**
   * @type {[any?, ...any[]][]}
   */
  const capturedLogs = [];
  const originalLogs = {};
  /**
   * @type {(() => void)[]}
   */
  const restoreLogFns = [];

  if (shouldCaptureConsole) {
    for (const logType of ['error', 'warn', 'info', 'log']) {
      originalLogs[logType] = console[logType];
      // eslint-disable-next-line no-param-reassign
      console[logType] = (/** @type {[any?, ...any[]]} */ ...args) => {
        capturedLogs.push(args);
        if (shouldDebug) {
          originalLogs[logType](...args);
        }
      };

      restoreLogFns.push(() => {
        // eslint-disable-next-line no-param-reassign
        console[logType] = originalLogs[logType];
      });
    }
  }

  const stdoutOriginalWrite = process.stdout.write;

  if (shouldCaptureStdout) {
    // https://github.com/facebook/jscodeshift/blob/51da1a5c4ba3707adb84416663634d4fc3141cbb/src/Runner.js#L42
    // @ts-ignore

    process.stdout.write = (...args) => {
      // @ts-ignore
      capturedLogs.push([args[0].toString()]);
      // if (shouldDebug) {
      //   stdoutOriginalWrite(...args);
      // }
    };
  }

  const restore = () => {
    for (const restoreLogFn of restoreLogFns) {
      restoreLogFn();
    }
    process.stdout.write = stdoutOriginalWrite;
  };

  return { capturedLogs, restore };
}

/**
 * @param {string} sourceFile
 */
function hasReservedMdName(sourceFile) {
  for (const fileNameInclude of ['CHANGELOG', 'README', 'CONTRIBUTING', 'MIGRATION']) {
    const fileName = path.basename(sourceFile, '.md');
    if (fileName.includes(fileNameInclude)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string | URL} inputDir
 * @param {string | URL} transformsFolder
 * @param {*} [jscsOptions]
 * @param {{customPaths?:string[]; shouldDebug?: boolean; workspaceMeta?:WorkspaceMeta}} extraOpts
 */
export async function executeJsCodeShiftTransforms(
  inputDir,
  transformsFolder,
  jscsOptions = {},
  { customPaths, shouldDebug = false, workspaceMeta } = {},
) {
  const excludePaths =
    workspaceMeta?.type === 'monorepo-root'
      ? workspaceMeta.workspacePackages.filter(w => w.type === 'monorepo-workspace').map(w => w.dir)
      : [];

  const transformsPath =
    transformsFolder instanceof URL ? fileURLToPath(transformsFolder) : transformsFolder;
  const inputDirPath = inputDir instanceof URL ? fileURLToPath(inputDir) : inputDir;
  const ignore = jscsOptions.ignore || ['**/node_modules/**', '**/bower_components/**'];

  /** @type {string[]} */
  let sourceFiles;
  if (!Array.isArray(customPaths)) {
    sourceFiles = (
      await globby([`**/*.{mjs,js,cjs,md,ts}`], {
        cwd: inputDirPath,
        ignore,
      })
    ).map(file => path.join(inputDirPath, file));
  } else {
    sourceFiles = customPaths;
  }

  const hiddenStorybookPath = `${inputDirPath}/.storybook`;
  // We skip hidden folders, except for storybook folder
  const hiddenStorybookConfigFiles = (
    await globby([`**/*.{mjs,js,cjs,md,ts}`], {
      cwd: hiddenStorybookPath,
    })
  ).map(file => path.join(hiddenStorybookPath, file));

  const jsSourceFiles = [];
  const mdSourceFiles = [];
  for (const sourceFile of [...sourceFiles, ...hiddenStorybookConfigFiles]) {
    if (sourceFile.endsWith('.md')) {
      if (hasReservedMdName(sourceFile)) {
        // eslint-disable-next-line no-continue
        continue;
      }
      mdSourceFiles.push(sourceFile);
    } else {
      if (sourceFile.endsWith('.ts') && !jscsOptions.includeTs) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // all other extensions are considered js
      jsSourceFiles.push(sourceFile);
    }
  }
  const { updateJsBlocksMdFiles, tmpBlockFilePaths } = await getJsBlocksFromMdFiles({
    mdFilePaths: mdSourceFiles,
  });

  const jsCodeShiftPaths = [...jsSourceFiles, ...tmpBlockFilePaths].filter(
    p => !excludePaths.find(ep => p.startsWith(ep)),
  );

  console.log(`🔎 Found ${jsCodeShiftPaths.length} files to transform`);

  let fullRes = {
    timeElapsed: '0',
    nochange: 0,
    error: 0,
    skip: 0,
    ok: 0,
  };

  const _transformFiles = await fs.promises.readdir(transformsPath);
  const transformFiles = jscsOptions.filterTransformFiles
    ? _transformFiles.filter(jscsOptions.filterTransformFiles)
    : _transformFiles;

  for (const transformFile of transformFiles) {
    const fullTransformFile = path.join(transformsPath, transformFile);

    // eslint-disable-next-line no-unused-vars

    const { restore } = captureLogs({
      shouldCaptureConsole: false,
      shouldCaptureStdout: false,
      shouldDebug,
    });

    const mergedOptions = {
      // dry: true,
      silent: false,
      verbose: 2,
      ...jscsOptions,
      ...(shouldDebug ? { runInBand: false } : {}),
    };

    const niceName = jscsOptions.niceTransformName
      ? jscsOptions.niceTransformName(transformFile)
      : transformFile;
    console.log(`🚀 Running jscodeshift mod "${niceName}"`);

    // eslint-disable-next-line no-await-in-loop
    const res = await jscodeshift(fullTransformFile, jsCodeShiftPaths, mergedOptions);

    restore();

    // capturedLogs.forEach((/** @type {string[]} */ args) => {
    //   const noChange = args[0].startsWith('\x1B[37m\x1B[43m NOC');
    //   const workerInfo = args[0].startsWith('Sending');
    //   // if (noChange || workerInfo) {

    //   // }
    // });

    fullRes = {
      timeElapsed: `${parseFloat(fullRes.timeElapsed) + parseFloat(res.timeElapsed)}`,
      nochange: fullRes.nochange + res.nochange,
      error: fullRes.error + res.error,
      skip: fullRes.skip + res.skip,
      ok: fullRes.ok + res.ok,
    };
  }

  await updateJsBlocksMdFiles();

  if (fullRes.error > 0) {
    console.log(`🛑 ${fullRes.error} files failed to update.`);
  }
  if (fullRes.skip > 0) {
    console.log(`⚠️ ${fullRes.skip} files got skipped.`);
  }
  if (fullRes.ok > 0) {
    console.log(`✅ ${fullRes.ok} files got updated successfully.`);
  }
}
