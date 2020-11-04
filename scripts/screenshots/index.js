/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const { chromium } = require('playwright');
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
const compareScreenshots = promisify(looksSame);
const createScreenshotsDiff = promisify(looksSame.createDiff);
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

  const [, category, component, file] = /(\w*)-(.*)--(.*)$/g.exec(id);

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
  console.log('⚠️ Screenshots tests are made with builded storybook');
  try {
    return await startServer(config);
  } catch (e) {
    return start();
  }
}

const serverPromise = start();

const browserPromise = chromium.launch({
  ignoreDefaultArgs: ['--hide-scrollbars'],
});

process.on('beforeExit', () => {
  browserPromise.then(browser => browser.close());
  serverPromise.then(server => server.close());
});

async function getPage(path, cdp) {
  const browser = await browserPromise;
  const server = await serverPromise;
  const url = `http://127.0.0.1:${server.server.address().port}${path}`;
  log(`Creating a page for ${url}`);
  const page = await browser.newPage();

  if (cdp) {
    const client = await page.context().newCDPSession(page);
    await client.send(cdp.command, cdp.parameters);
  }

  // eslint-disable-next-line no-unused-vars
  page.on('console', msg => {
    if (msg._type !== 'debug') {
      if (msg._type === 'warning') {
        console.warn(`PAGE console.warn:`, msg._text);
      } else {
        console[msg._type](`PAGE console.${msg._type}:`, msg._text);
      }
    }
  });

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  log(`Page has been created`);

  return page;
}

async function getStoryPage(id, cdp) {
  return getPage(`/iframe.html?id=${id}&viewMode=story`, cdp);
}

async function getClip({ page, selector, endClipSelector }) {
  log(`Getting clip for ${selector}`);

  const clip = await page.evaluate(
    ([sel, endSel]) => {
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
    [selector, endClipSelector],
  );

  log(`Clip has been retrieved: ${JSON.stringify(clip)}`);

  return clip;
}

async function getScreenshot({ root, id, selector, page, clip }) {
  log(`Making a screenshot`);

  const { path, folder } = await buildPath({ root, id, selector });

  mkdirp(folder);

  // Remove caret from screenshots to avoid caret diff
  await page.evaluate(() => {
    document.body.style.caretColor = 'transparent';
  });

  await page.screenshot({ path, clip });

  log(`Screenshot was saved in ${path}`);

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

const screenshotsCompareOptions = {
  highlightColor: '#ff00ff',
  tolerance: 0,
};

async function invalidateScreenshots({ diffRoot: root, id, selector, reference, current }) {
  const { path, folder } = await buildPath({ root, id, selector });

  mkdirp(folder);

  await createScreenshotsDiff({
    ...screenshotsCompareOptions,
    reference: reference.path,
    current: current.path,
    diff: path,
  });

  log(`Screenshot is invalid. Diff saved in ${path}`);

  return {
    path,
  };
}

async function validateScreenshot(suite) {
  const { current, reference } = suite;
  log(`Validating screenshot`);

  if (!reference.path) {
    throw new Error('No reference screenshot was found.');
  }
  const { equal } = await compareScreenshots(
    current.path,
    reference.path,
    screenshotsCompareOptions,
  );

  if (!equal) {
    const { path } = await invalidateScreenshots(suite);
    throw new Error(`Screenshots mismatch. Diff saved in ${path}`);
  } else {
    log(`Screenshot is valid`);
  }
}

let updateScreenshots = args['update-screenshots'] || process.env.UPDATE_SCREENSHOTS;

try {
  const avaConfig = JSON.parse(args._[2]);
  updateScreenshots = avaConfig.updateScreenshots;
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
    if (selector) {
      await page.waitForSelector(selector);
    }
    if (endClipSelector) {
      await page.waitForSelector(endClipSelector);
    }
    await page.evaluate(
      async ([sel, endClipSel]) => {
        if (sel) {
          const el = document.querySelector(sel);
          if (el && el.updateComplete) {
            await el.updateComplete;
          }
        }
        if (endClipSel) {
          const el = document.querySelector(endClipSel);
          if (el && el.updateComplete) {
            await el.updateComplete;
          }
        }
      },
      [selector, endClipSelector],
    );
    suite.clip = await getClip(suite);

    if (updateScreenshots) {
      await getScreenshot(suite);
    } else {
      suite.current = await getScreenshot({ ...suite, root: suite.currentRoot });
      suite.reference = await getReference(suite);

      if (suite.reference) {
        await validateScreenshot(suite);
      } else {
        throw new Error('No reference screenshot was found.');
      }
    }
  };
}

exports.createCapture = createCapture;
exports.getPage = getPage;
exports.getStoryPage = getStoryPage;
