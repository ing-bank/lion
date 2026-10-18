#!/usr/bin/env node
/**
 * Run the browser tests for only the component(s) you are working on.
 *
 * `npm run debug` runs the whole suite (171 test files, ~44 groups) even when you touched one
 * component. This script narrows the `--files` list so the agentic/feedback loop is ~1 test file
 * instead of the whole set, and skips the group glob in the wtr config while doing so.
 *
 * Usage:
 *   npm run debug:component -- accordion
 *   npm run debug:component -- accordion input-tel listbox
 *   npm run debug:component -- --changed            # components touched vs origin/master + worktree
 *   npm run debug:component -- --once accordion     # no watch mode (single run, for scripts/agents)
 *   npm run debug:component -- --browser=firefox accordion
 *
 * Component names are directories under packages/ui/components. `--changed` maps changed files to
 * those directories, so it also picks up packages/ui/test and shared test-utilities changes.
 */
import { spawn, execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { glob } from 'fs/promises';
import path from 'path';

const COMPONENTS_DIR = 'packages/ui/components';
const BROWSER_CONFIGS = {
  chrome: 'web-test-runner-chrome.config.mjs',
  firefox: 'web-test-runner-firefox.config.mjs',
  webkit: 'web-test-runner-webkit.config.mjs',
};

/* eslint-disable no-console */

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

function gitChangedFiles() {
  const args = ['diff', '--name-only', '--diff-filter=ACMR', 'origin/master...HEAD'];
  const files = new Set(
    execFileSync('git', args, { encoding: 'utf8' }).split('\n').filter(Boolean),
  );
  // also include not-yet-committed work
  for (const extra of [
    ['diff', '--name-only'],
    ['ls-files', '--others', '--exclude-standard'],
  ]) {
    execFileSync('git', extra, { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
      .forEach(file => files.add(file));
  }
  return [...files];
}

function componentsFromChangedFiles(changedFiles) {
  const components = new Set();
  for (const file of changedFiles) {
    const match = file.match(new RegExp(`^${COMPONENTS_DIR}/([^/]+)/`));
    if (match) {
      components.add(match[1]);
    }
  }
  return [...components];
}

async function testFilesForComponents(components) {
  const files = [];
  for (const component of components) {
    const componentDir = path.join(COMPONENTS_DIR, component);
    if (!existsSync(componentDir)) {
      fail(`Component '${component}' not found (${componentDir} does not exist).`);
    }
    for await (const file of glob(`${componentDir}/test/**/*.test.js`)) {
      files.push(file);
    }
  }
  return files.sort();
}

async function main() {
  const args = process.argv.slice(2);
  const once = args.includes('--once');
  const browserArg = args.find(arg => arg.startsWith('--browser='));
  const browser = browserArg ? browserArg.split('=')[1] : 'chrome';
  const useChanged = args.includes('--changed');
  const componentArgs = args.filter(arg => !arg.startsWith('--'));

  if (!BROWSER_CONFIGS[browser]) {
    fail(`Unknown browser '${browser}'. Use one of: ${Object.keys(BROWSER_CONFIGS).join(', ')}.`);
  }

  let components = componentArgs;
  if (useChanged) {
    const changed = componentsFromChangedFiles(gitChangedFiles());
    components = [...new Set([...components, ...changed])];
    if (components.length === 0) {
      console.log('No component changed vs origin/master - nothing to run.');
      process.exit(0);
    }
  }
  if (components.length === 0) {
    fail(
      `No component given.\n\nUsage: npm run debug:component -- <component> [component2 ...]\n` +
        `       npm run debug:component -- --changed\n\n` +
        `Components are directories in ${COMPONENTS_DIR}.`,
    );
  }

  const files = await testFilesForComponents(components);
  if (files.length === 0) {
    fail(
      `No test files found for: ${components.join(', ')} (looked in ${COMPONENTS_DIR}/<name>/test).`,
    );
  }

  const wtrArgs = [
    `--config`,
    BROWSER_CONFIGS[browser],
    ...(once ? [] : ['--watch']),
    ...files.flatMap(file => ['--files', file]),
  ];

  console.log(
    `Running ${files.length} test file(s) for ${components.join(', ')} (${browser}${
      once ? ', once' : ', watch'
    }):\n${files.map(file => `  ${file}`).join('\n')}\n`,
  );

  const wtrBin = path.join('node_modules', '@web/test-runner', 'dist', 'bin.js');
  const child = spawn(process.execPath, [wtrBin, ...wtrArgs], { stdio: 'inherit' });
  child.on('error', error => {
    fail(`Could not start web-test-runner (${wtrBin}): ${error.message}`);
  });
  child.on('exit', code => process.exit(code === null ? 1 : code));
}

main();
