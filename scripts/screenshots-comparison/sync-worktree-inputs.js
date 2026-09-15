import fs from 'fs/promises';
import path from 'path';
import { parseArgs } from 'util';
import { getWorkTreeRelativePath } from './util.mjs';
import { now, printAndLog, repoRoot } from './step-utils.js';

const { values } = parseArgs({
  options: {
    'target-branch': {
      type: 'string',
      default: 'master',
    },
  },
});

const targetBranch = values['target-branch'];
const worktreeRelativePath = getWorkTreeRelativePath(targetBranch);

const copyTargets = [
  'web-test-runner.config.mjs',
  'web-test-runner.visual.config.mjs',
  'scripts/screenshots-comparison',
];

const screenshotsComparisonScriptPrefix = 'screenshots-comparison:';
const visualTestSuffix = '.visual.test.js';

async function pathType(filePath) {
  const stats = await fs.stat(filePath);
  if (stats.isDirectory()) {
    return 'directory';
  }
  if (stats.isFile()) {
    return 'file';
  }
  throw new Error(`Unsupported path type: ${filePath}`);
}

async function copyWithOverride(fromPath, toPath) {
  const sourceType = await pathType(fromPath);

  await fs.mkdir(path.dirname(toPath), { recursive: true });

  if (sourceType === 'directory') {
    await fs.rm(toPath, { recursive: true, force: true });
    await fs.cp(fromPath, toPath, { recursive: true, force: true });
    return;
  }

  await fs.cp(fromPath, toPath, { force: true });
}

async function copyVisualTests({ repoRootPath, worktreePath }) {
  const sourceBasePath = path.join(repoRootPath, 'packages');
  const destinationBasePath = path.join(worktreePath, 'packages');

  const queue = [sourceBasePath];
  let copiedFiles = 0;

  while (queue.length > 0) {
    const currentPath = queue.pop();
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        queue.push(entryPath);
      } else if (entry.isFile() && entry.name.endsWith(visualTestSuffix)) {
        const relativePathFromBase = path.relative(sourceBasePath, entryPath);
        const destinationPath = path.join(destinationBasePath, relativePathFromBase);

        await copyWithOverride(entryPath, destinationPath);
        copiedFiles += 1;
      }
    }
  }

  return copiedFiles;
}

async function readPackageJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

async function syncScreenshotsComparisonScripts({ rootPackagePath, worktreePackagePath }) {
  const rootPackageJson = await readPackageJson(rootPackagePath);
  const worktreePackageJson = await readPackageJson(worktreePackagePath);

  const rootScripts = rootPackageJson.scripts ?? {};
  const worktreeScripts = worktreePackageJson.scripts ?? {};

  const rootScreenshotsScripts = Object.fromEntries(
    Object.entries(rootScripts).filter(([scriptName]) =>
      scriptName.startsWith(screenshotsComparisonScriptPrefix),
    ),
  );

  const syncedWorktreeScripts = {
    ...Object.fromEntries(
      Object.entries(worktreeScripts).filter(
        ([scriptName]) => !scriptName.startsWith(screenshotsComparisonScriptPrefix),
      ),
    ),
    ...rootScreenshotsScripts,
  };

  worktreePackageJson.scripts = syncedWorktreeScripts;

  await fs.writeFile(worktreePackagePath, `${JSON.stringify(worktreePackageJson, null, 2)}\n`);

  return Object.keys(rootScreenshotsScripts).length;
}

async function main() {
  printAndLog(`[${now()}] screenshots-comparison:sync-worktree-inputs runner`);

  const worktreePath = path.join(repoRoot, worktreeRelativePath);

  await fs.access(worktreePath).catch(() => {
    throw new Error(
      `Worktree path not found: ${worktreeRelativePath}. Run screenshots baseline setup first.`,
    );
  });

  for (const relativePath of copyTargets) {
    const sourcePath = path.join(repoRoot, relativePath);
    const destinationPath = path.join(worktreePath, relativePath);

    await fs.access(sourcePath).catch(() => {
      throw new Error(`Source path not found: ${relativePath}`);
    });

    await copyWithOverride(sourcePath, destinationPath);
    printAndLog(`Copied ${relativePath} -> ${path.join(worktreeRelativePath, relativePath)}`);
  }

  const copiedVisualTestsCount = await copyVisualTests({
    repoRootPath: repoRoot,
    worktreePath,
  });
  printAndLog(
    `Copied ${copiedVisualTestsCount} *${visualTestSuffix} files from packages -> ${path.join(
      worktreeRelativePath,
      'packages',
    )}`,
  );

  const rootPackagePath = path.join(repoRoot, 'package.json');
  const worktreePackagePath = path.join(worktreePath, 'package.json');

  const syncedScriptsCount = await syncScreenshotsComparisonScripts({
    rootPackagePath,
    worktreePackagePath,
  });
  printAndLog(
    `Synced ${syncedScriptsCount} ${screenshotsComparisonScriptPrefix}* scripts in ${path.join(
      worktreeRelativePath,
      'package.json',
    )}`,
  );

  printAndLog(`[${now()}] All copy steps completed successfully.`);
}

main().catch(error => {
  printAndLog(`[${now()}] FAILED: ${error.message}`);
  process.exitCode = 1;
});
