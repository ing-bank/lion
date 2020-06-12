const puppeteer = require('puppeteer');
const looksSame = require('looks-same');
const { join } = require('path');
const mkdirp = require('mkdirp-promise');
const fs = require('fs');
const { promisify } = require('es6-promisify');
const minimist = require('minimist');
const { mdjsTransformer } = require('@mdjs/core');
const { createConfig, startServer } = require('es-dev-server');
const nodePath = require('path');

const access = promisify(fs.access);
const compareSnapshots = promisify(looksSame);
const createSnapshotsDiff = promisify(looksSame.createDiff);
const args = minimist(process.argv);

const DIFF_FOLDER_PREFIX = '.diff';
const CURRENT_FOLDER_PREFIX = '.current';
const ROOT = 'screenshots';

// eslint-disable-next-line no-unused-vars
function log(line) {
  // console.info(line);
}

/**
 * @param {string} root
 * @param {string} id
 * @param {string} selector
 * @return {{file: string, folder: string, path: string}}
 */
async function buildPath({ root, id, selector }) {
  log(`Building path for ${id} - ${selector}`);

  const [title, file] = id.split('--');
  const [category, component] = title.split('-');

  const extension = '.png';

  const paths = {
    file,
    folder: join(root, category, component),
    path: join(root, category, component, file + extension),
  };

  log(`Path is ${paths.path}`);

  return paths;
}

const PATHS = {
  root: ROOT,
  diffRoot: join(ROOT, DIFF_FOLDER_PREFIX),
  currentRoot: join(ROOT, CURRENT_FOLDER_PREFIX),
};

async function start() {
  const config = createConfig({
    nodeResolve: true,
    preserveSymlinks: true,
    rootDir: nodePath.join(__dirname, '../../storybook-static/'),
    responseTransformers: [mdjsTransformer],
  });
  try {
    return await startServer(config);
  } catch (e) {
    return start();
  }
}

const serverPromise = start();

const browserPromise = puppeteer.launch();

process.on('beforeExit', () => {
  browserPromise.then(browser => browser.close());
  serverPromise.then(server => server.close());
});

async function getPage(path) {
  const browser = await browserPromise;
  const server = await serverPromise;
  const url = `http://127.0.0.1:${server.server.address().port}${path}`;
  log(`Creating a page for ${url}`);
  const page = await browser.newPage();

  // eslint-disable-next-line no-unused-vars
  page.on('console', msg => {
    if (msg._type !== 'debug') {
      console[msg._type](`PAGE console.${msg._type}:`, msg._text);
    }
  });

  await page.goto(url);
  await page.waitFor(1000);

  log(`Page has been created`);

  return page;
}

async function getStoryPage(id) {
  return getPage(`/iframe.html?id=${id}&viewMode=story`);
}

async function getClip({ page, selector, endClipSelector }) {
  log(`Getting clip for ${selector}`);

  const clip = await page.evaluate(
    (sel, endSel) => {
      const el = document.querySelector(sel);

      if (!el) {
        throw new Error(`An el matching selector \`${sel}\` wasn't found`);
      }

      const range = document.createRange();

      range.setStartBefore(el);
      range.setEndAfter(endSel ? document.querySelector(endSel) : el);

      const rect = range.getBoundingClientRect();
      const margin = 8;

      const x = rect.left - margin < 0 ? 0 : rect.left - margin;
      const y = rect.top - margin < 0 ? 0 : rect.top - margin;

      return {
        x,
        y,
        width: rect.width + (rect.left - x) * 2,
        height: rect.height + (rect.top - y) * 2,
      };
    },
    selector,
    endClipSelector,
  );

  log(`Clip has been retrieved: ${JSON.stringify(clip)}`);

  return clip;
}

async function getSnapshot({ root, id, selector, page, clip }) {
  log(`Making a snapshot`);

  const { path, folder } = await buildPath({ root, id, selector });

  mkdirp(folder);

  await page.screenshot({ path, clip });

  log(`Snapshot was saved in ${path}`);

  return {
    path,
  };
}

async function getReference({ root, id, selector }) {
  log(`Searching for the reference`);

  const { path } = await buildPath({ root, id, selector });

  try {
    await access(path);

    log(`Reference is in ${path}`);

    return {
      path,
    };
  } catch (e) {
    log(e);
    log(`Reference was not found`);
    return {};
  }
}

const snapshotsCompareOptions = {
  highlightColor: '#ff00ff',
  tolerance: 0,
  ignoreCaret: true,
};

async function invalidateSnapshots({ diffRoot: root, id, selector, reference, current }) {
  const { path, folder } = await buildPath({ root, id, selector });

  mkdirp(folder);

  await createSnapshotsDiff({
    ...snapshotsCompareOptions,
    reference: reference.path,
    current: current.path,
    diff: path,
  });

  log(`Snapshot is invalid. Diff saved in ${path}`);

  return {
    path,
  };
}

async function validateSnapshot(suite) {
  const { current, reference } = suite;
  log(`Validating snapshot`);

  const { equal } = await compareSnapshots(current.path, reference.path, snapshotsCompareOptions);

  if (!equal) {
    const { path } = await invalidateSnapshots(suite);
    throw new Error(`Snapshots mismatch. Diff saved in ${path}`);
  } else {
    log(`Snapshot is valid`);
  }
}

let updateSnapshots = args['update-snapshots'] || process.env.UPDATE_SNAPSHOTS;

try {
  const avaConfig = JSON.parse(args._[2]);
  updateSnapshots = avaConfig.updateSnapshots;
} catch (e) {
  log('Could not parse config');
}

/**
 * @return {capture}
 */
function createCapture() {
  return async function capture({ url = '', selector = 'body', endClipSelector, page, id }) {
    const suite = {
      ...PATHS,
      url,
      id,
      selector,
      page,
      endClipSelector,
    };

    if (!suite.page) {
      suite.page = await getPage(url);
    }
    await page.waitFor(1000);
    suite.clip = await getClip(suite);

    if (updateSnapshots) {
      await getSnapshot(suite);
    } else {
      suite.current = await getSnapshot({ ...suite, root: suite.currentRoot });
      suite.reference = await getReference(suite);

      if (suite.reference) {
        await validateSnapshot(suite);
      } else {
        throw new Error('No reference snapshot was found.');
      }
    }
  };
}

exports.createCapture = createCapture;
exports.getPage = getPage;
exports.getStoryPage = getStoryPage;
