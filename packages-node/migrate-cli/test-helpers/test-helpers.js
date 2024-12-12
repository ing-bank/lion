import path, { basename } from 'path';
import { existsSync, readFileSync } from 'fs';
import { rm, writeFile, mkdir, rename } from 'fs/promises';
import { fileURLToPath, pathToFileURL } from 'url';
// @ts-ignore
import fsExtraPkg from 'fs-extra';
// @ts-ignore
import * as chai from 'chai';
// @ts-ignore
import { applyTransform } from 'jscodeshift/dist/testUtils.js';
// eslint-disable-next-line import/no-relative-packages
import { prettyFormat } from './pretty-format.js';
import { MigrateCli } from '../src/MigrateCli.js';

const { copy, move, remove } = fsExtraPkg;

/**
 * @param {string} cwd
 * @param {{cliArgv:string[];cliOptions?:{inputDir?:string;outputDir?:string;outputDevDir?:string};testOptions:{captureLogs?:boolean}}} opts
 * @param {string} dir
 */
export async function setupTestCli(cwd, { cliArgv = [], cliOptions = {}, testOptions = {} }, dir) {
  const resolvedCwd = cwd.startsWith('/') ? cwd : path.join(dir, cwd.split('/').join(path.sep));
  const useOptions = { ...cliOptions, cwd: resolvedCwd };
  if (useOptions.inputDir) {
    useOptions.inputDir = path.join(dir, useOptions.inputDir.split('/').join(path.sep));
  }
  useOptions.outputDir = path.join(resolvedCwd, '__output');
  useOptions.outputDevDir = path.join(resolvedCwd, '__output-dev');

  /** @type {string[]} */
  const capturedLogs = [];
  const origConsole = console;
  if (testOptions.captureLogs) {
    console.log = msg => {
      capturedLogs.push(msg);
    };
    console.error = msg => {
      capturedLogs.push(msg);
    };
  }

  const cli = new MigrateCli({
    argv: [
      process.argv[0],
      fileURLToPath(new URL(pathToFileURL('../src/cli.js'), import.meta.url)),
      ...cliArgv,
    ],
  });
  const configFiles = [
    path.join('config', 'ing-web-cli.config.js'),
    path.join('config', 'ing-web-cli.config.mjs'),
    'ing-web-cli.config.js',
    'ing-web-cli.config.mjs',
  ];
  for (const configFile of configFiles) {
    const configFilePath = path.join(resolvedCwd, configFile);
    if (existsSync(configFilePath)) {
      cli.options.configFile = configFilePath;
      break;
    }
  }
  cli.setOptions(useOptions);

  /**
   * @param {string} toInspect
   * @param {{format?:string}} opts
   */
  async function readOutput(toInspect, { format = 'auto' } = {}) {
    // @ts-expect-error
    const filePath = path.join(cli.options.outputDir, toInspect);
    if (!existsSync(filePath)) {
      throw new Error(`Rendering to ${toInspect} did not happen\nFull path: ${filePath}`);
    }
    let text = readFileSync(filePath).toString();

    const useFormat = format === 'auto' ? toInspect.split('.').pop() : format;
    if (useFormat) {
      text = await prettyFormat(text, { format: useFormat, removeEndNewLine: true });
    }
    return text;
  }

  /**
   * @param {string} toInspect
   * @param {{format?:string}} opts
   */
  async function readDevOutput(toInspect, { format = 'auto' } = {}) {
    // @ts-expect-error
    const filePath = path.join(cli.options.outputDevDir, toInspect);
    if (!existsSync(filePath)) {
      throw new Error(`Rendering to ${toInspect} did not happen\nFull path: ${filePath}`);
    }
    let text = readFileSync(filePath).toString();

    const useFormat = format === 'auto' ? toInspect.split('.').pop() : format;
    if (useFormat) {
      text = await prettyFormat(text, { format: useFormat, removeEndNewLine: true });
    }
    return text;
  }

  /**
   * @param {string} toInspect
   * @param {{format?:string|boolean}} opts
   */
  async function readSource(toInspect, { format = 'auto' } = {}) {
    const filePath = path.join(cli.options.inputDir, toInspect);
    let text = readFileSync(filePath).toString();
    const useFormat = format === 'auto' ? toInspect.split('.').pop() : format;
    if (useFormat) {
      text = await prettyFormat(text, { format: useFormat, removeEndNewLine: true });
    }
    return text.replace(/\r/g, ''); // Convert Windows EOL to POSIX EOL to be consistent with test assertions.
  }

  /**
   * @param {string} toInspect
   * @param {string} text
   * @param {{format?:string}} opts
   */
  async function writeSource(toInspect, text, { format = 'auto' } = {}) {
    let formattedText = text;
    const filePath = path.join(cli.options.inputDir, toInspect);
    const dirName = path.dirname(filePath);
    if (!existsSync(dirName)) {
      await mkdir(dirName, { recursive: true });
    }

    const useFormat = format === 'auto' ? toInspect.split('.').pop() : format;
    if (useFormat) {
      formattedText = await prettyFormat(text, { format: useFormat });
    }
    await writeFile(filePath, formattedText);
  }

  /**
   * @param {string} toInspect
   */
  async function deleteSource(toInspect) {
    const filePath = path.join(cli.options.inputDir, toInspect);
    await rm(filePath, { force: true, recursive: true });
  }

  /**
   * @param {string} fromRelativePath
   * @param {string} toRelativePath
   */
  async function renameSource(fromRelativePath, toRelativePath) {
    const fromPath = path.join(cli.options.inputDir, fromRelativePath);
    const toPath = path.join(cli.options.inputDir, toRelativePath);
    await rename(fromPath, toPath);
  }

  /**
   * @param {string} toInspect
   */
  function sourceExists(toInspect) {
    const filePath = path.join(cli.options.inputDir, toInspect);
    return existsSync(filePath);
  }

  async function cleanup() {
    await cli.stop({ hard: false });

    if (testOptions.captureLogs) {
      console.log = origConsole.log;
      console.error = origConsole.error;
    }
  }

  async function start() {
    await cli.start();
    await cleanup();
  }

  async function restoreSource({ keepBackup = false } = {}) {
    const backupDir = path.join(
      cli.options.inputDir,
      '..',
      `${basename(cli.options.inputDir)}-__backup`,
    );
    if (existsSync(backupDir)) {
      await remove(cli.options.inputDir);
      if (keepBackup === false) {
        await move(backupDir, cli.options.inputDir);
      } else {
        await copy(backupDir, cli.options.inputDir);
      }
    }
  }

  async function backupOrRestoreSource() {
    const backupDir = path.join(
      cli.options.inputDir,
      '..',
      `${basename(cli.options.inputDir)}-__backup`,
    );
    if (existsSync(backupDir)) {
      await restoreSource({ keepBackup: true });
    } else {
      await copy(cli.options.inputDir, backupDir);
    }
  }

  return {
    readOutput,
    readDevOutput,
    readSource,
    writeSource,
    deleteSource,
    cleanup,
    start,
    cli,
    sourceExists,
    renameSource,
    backupOrRestoreSource,
    restoreSource,
    capturedLogs,
  };
}

/**
 * @param {string} importMetaUrl
 */
export function prepareTestCli(importMetaUrl) {
  const dir = path.dirname(fileURLToPath(importMetaUrl));
  return (
    /** @type {string} */ cwd,
    /** @type {{cliArgv:string[];cliOptions?:{inputDir?:string;outputDir?:string;outputDevDir?:string; _upgradeTaskUrl?:string;};testOptions:{captureLogs?:boolean}}} */ options,
  ) => setupTestCli(cwd, options, dir);
}

/**
 * @param {function} method
 * @param {{errorMatch?: RegExp; errorMessage?: string}} opts
 */
export async function expectThrowsAsync(method, { errorMatch, errorMessage } = {}) {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  chai.expect(error).to.be.an('Error', 'No error was thrown');
  if (errorMatch) {
    // @ts-ignore
    chai.expect(error.message).to.match(errorMatch);
  }
  if (errorMessage) {
    // @ts-ignore
    chai.expect(error.message).to.equal(errorMessage);
  }
}

/**
 * @param {*} module
 * @param {object} options
 * @param {{source:string}} input
 * @param {string} expectedOutput
 * @param {object} testOptions
 * @returns
 */
export async function runInlineTest(module, options, input, expectedOutput, testOptions) {
  const output = applyTransform(module, options, input, testOptions);
  chai
    .expect(await prettyFormat(output, { format: 'js' }))
    .to.equal(await prettyFormat(expectedOutput, { format: 'js' }));
  return output;
}

/**
 * @param {{transform:(file:{source:string; path:string}, api:{jscodeshift:import('jscodeshift')}, options?:any) => string, transformOptions?:object, testOptions?: object}} config
 */
export function createCompare({ transform, transformOptions = {}, testOptions = {} }) {
  /**
   * @param {{options?:object, from:string, to:string}} config
   */
  return function compare({ options = transformOptions, from, to }) {
    runInlineTest(transform, options, { source: from }, to, testOptions);
  };
}

/**
 * @param {function} fn
 */
export function createCompareFromFn(fn) {
  return createCompare({
    transform: {
      parser: 'babel',
      /**
       * @param {{ source: import('jscodeshift').File }} file
       * @param {{ jscodeshift: import('jscodeshift') }} api
       */
      default: (file, api) => {
        const j = api.jscodeshift;
        const root = j(file.source);
        fn({ root, j });
        return root.toSource();
      },
    },
  });
}
