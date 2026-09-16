import fs from 'fs/promises';
import path from 'path';
import { parseArgs } from 'util';
import {
  SCREENSHOTS_FOR_REVIEW_DIR,
  TMP_SCREENSHOTS_DIR,
  now,
  printAndLog,
  runStep,
} from './step-utils.js';
import { commitScreenshots } from './commit-screenshots.js';
import { getWorkTreeRelativePath, parseTargetBranch } from './util.mjs';
import { prepareScreenshotsForReview } from './prepare-screenshots-for-review.js';

/**
 * @param {string} directoryPath
 * @returns {Promise<boolean>}
 */
async function isDirectory(directoryPath) {
  try {
    const stat = await fs.stat(directoryPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * @param {string} worktreeRelativePath
 * @returns {Promise<void>}
 */
async function cleanupBeforeVisualRun(worktreeRelativePath) {
  const worktreeRoot = path.join(process.cwd(), worktreeRelativePath);
  const screenshotsRoot = path.join(worktreeRoot, TMP_SCREENSHOTS_DIR);
  const screenshotsForReviewDirectory = path.join(worktreeRoot, SCREENSHOTS_FOR_REVIEW_DIR);

  await fs.rm(screenshotsForReviewDirectory, { recursive: true, force: true });
  printAndLog(`Removed directory ${screenshotsForReviewDirectory}`);

  if (!(await isDirectory(screenshotsRoot))) {
    return;
  }

  const browserEntries = await fs.readdir(screenshotsRoot, { withFileTypes: true });
  for (const entry of browserEntries) {
    if (entry.isDirectory()) {
      const failedDirectory = path.join(screenshotsRoot, entry.name, 'failed');
      if (await isDirectory(failedDirectory)) {
        await fs.rm(failedDirectory, { recursive: true, force: true });
        printAndLog(`Removed directory ${failedDirectory}`);
      }
    }
  }
}

async function main() {
  printAndLog(`[${now()}] screenshots-comparison:run-visual-and-prepare runner`);

  const { values } = parseArgs({
    options: {
      'target-branch': {
        type: 'string',
      },
    },
  });

  const targetBranch = parseTargetBranch(values['target-branch']);
  const worktreeRelativePath = getWorkTreeRelativePath(targetBranch);

  // Note, we really need to use syntax like `--key=value` and not `--key value` because `web-test-runner` fails otherwise
  const visualCommand = `web-test-runner --config web-test-runner.visual.config.mjs --target-branch=${targetBranch} --chromium`;

  await runStep({
    name: 'screenshots-comparison:verify-target-branch',
    command: `git fetch origin --quiet && git ls-remote --exit-code --heads origin ${targetBranch}`,
  });

  await cleanupBeforeVisualRun(worktreeRelativePath);

  const visualTestsResult = await runStep({
    name: 'run-visual-tests',
    command: visualCommand,
    continueOnFail: true,
  });

  if (visualTestsResult.continued) {
    printAndLog(
      `[${now()}] run-visual-tests failed most likely because there are visual differences. Continuing with screenshots preparation.`,
    );

    await prepareScreenshotsForReview(worktreeRelativePath).catch(error => {
      console.error(error.message);
      process.exit(1);
    });

    await commitScreenshots(targetBranch, worktreeRelativePath).catch(error => {
      console.error(error.message);
      process.exit(1);
    });
  } else {
    printAndLog(
      `[${now()}] No visual changes detected. Checking ${SCREENSHOTS_FOR_REVIEW_DIR} for stale committed screenshots to remove.`,
    );

    await commitScreenshots(targetBranch, worktreeRelativePath).catch(error => {
      console.error(error.message);
      process.exit(1);
    });
  }

  printAndLog(`[${now()}] All steps completed successfully.`);
}

main().catch(error => {
  printAndLog(`[${now()}] FAILED: ${error.message}`);
  process.exitCode = 1;
});
