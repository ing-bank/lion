import fs from 'fs/promises';
import path from 'path';
import { SCREENSHOTS_FOR_REVIEW_DIR, TMP_SCREENSHOTS_DIR } from './step-utils.js';

/**
 * First copy <worktreeRelativePath>/<TMP_SCREENSHOTS_DIR> to
 * <worktreeRelativePath>/<SCREENSHOTS_FOR_REVIEW_DIR>.
 * Then, for each browser directory in the review directory:
 * - Create folders only for complete groups: baseline + failed(new) + failed(diff).
 * - Also create folders for failed-only screenshots when baseline and diff are missing.
 * - Move baseline to "-original", failed(new) to "-new", failed(diff) unchanged.
 * - Delete unmatched files from baseline and failed.
 * - Remove empty baseline and failed directories.
 */

/**
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function isDirectory(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * @param {string} directory
 * @returns {Promise<string[]>}
 */
async function getDirectFileNames(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries.filter(entry => entry.isFile()).map(entry => entry.name);
}

/**
 * @param {string[]} fileNames
 * @returns {Map<string, string>}
 */
function toFileByStemMap(fileNames) {
  return new Map(fileNames.map(fileName => [path.parse(fileName).name, fileName]));
}

/**
 * @param {string} directory
 * @returns {Promise<boolean>}
 */
async function hasAnyEntries(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries.length > 0;
}

/**
 * @param {string} fileName
 * @param {string} suffix
 * @returns {string}
 */
function withSuffixBeforeExtension(fileName, suffix) {
  const parsed = path.parse(fileName);
  return `${parsed.name}${suffix}${parsed.ext}`;
}

/**
 * @param {string} directory
 * @returns {Promise<void>}
 */
async function removeDirectoryIfEmpty(directory) {
  if (!(await isDirectory(directory))) {
    return;
  }

  const entries = await fs.readdir(directory, { withFileTypes: true });
  if (entries.length === 0) {
    await fs.rmdir(directory);
    console.log(`Removed empty directory ${directory}`);
  }
}

/**
 * @param {string} directory
 * @returns {Promise<void>}
 */
async function removeDirectoryIfExists(directory) {
  if (!(await isDirectory(directory))) {
    return;
  }

  await fs.rm(directory, { recursive: true, force: true });
  console.log(`Removed directory ${directory}`);
}

/**
 * @param {string} worktreeRelativePath
 * @returns {Promise<void>}
 */
export async function prepareScreenshotsForReview(worktreeRelativePath) {
  const screenshots = path.join(process.cwd(), worktreeRelativePath, TMP_SCREENSHOTS_DIR);
  const screenshotsForReview = path.join(
    process.cwd(),
    worktreeRelativePath,
    SCREENSHOTS_FOR_REVIEW_DIR,
  );

  await fs.rm(screenshotsForReview, { recursive: true, force: true });

  if (!(await isDirectory(screenshots))) {
    throw new Error(`Directory not found: ${screenshots}`);
  }

  const sourceHasEntries = await hasAnyEntries(screenshots);
  if (!sourceHasEntries) {
    console.warn('Warning: baseline is empty. Generate the baseline.');
    return;
  }

  await fs.cp(screenshots, screenshotsForReview, { recursive: true, force: true });
  console.log(`Copied ${screenshots} -> ${screenshotsForReview}`);

  if (!(await isDirectory(screenshotsForReview))) {
    throw new Error(`Directory not found: ${screenshotsForReview}`);
  }

  const rootEntries = await fs.readdir(screenshotsForReview, { withFileTypes: true });
  const browserDirectories = rootEntries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  if (browserDirectories.length === 0) {
    console.log(`No browser directories found in ${screenshotsForReview}`);
    return;
  }

  let movedFilesCount = 0;

  for (const directoryName of browserDirectories) {
    const browserDirectory = path.join(screenshotsForReview, directoryName);
    const failedDirectory = path.join(browserDirectory, 'failed');
    const failedProcessingDirectory = path.join(browserDirectory, '.failed-processing');
    const baselineDirectory = path.join(browserDirectory, 'baseline');

    const hasBaseline = await isDirectory(baselineDirectory);
    const hasFailedDirectory = await isDirectory(failedDirectory);

    await fs.rm(failedProcessingDirectory, { recursive: true, force: true });
    if (hasFailedDirectory) {
      await fs.cp(failedDirectory, failedProcessingDirectory, { recursive: true, force: true });
      await fs.rm(failedDirectory, { recursive: true, force: true });
      console.log(`Removed directory ${failedDirectory}`);
    }

    const hasFailed = await isDirectory(failedProcessingDirectory);

    let movedBaselineCount = 0;
    let movedFailedNewCount = 0;
    let movedFailedDiffCount = 0;
    let movedFailedOnlyCount = 0;
    let deletedUnmatchedCount = 0;

    const baselineFiles = hasBaseline ? await getDirectFileNames(baselineDirectory) : [];
    const failedFiles = hasFailed ? await getDirectFileNames(failedProcessingDirectory) : [];

    if (!hasBaseline) {
      console.log(`Skipping baseline for ${directoryName}: missing baseline/ directory`);
    }

    if (!hasFailed) {
      console.log(`Skipping failed for ${directoryName}: missing failed/ directory`);
    }

    const baselineByStem = toFileByStemMap(baselineFiles);
    const failedNewByStem = new Map();
    const failedDiffByStem = new Map();

    for (const failedFileName of failedFiles) {
      const parsed = path.parse(failedFileName);
      if (parsed.name.endsWith('-diff')) {
        const stemWithoutDiff = parsed.name.slice(0, -'-diff'.length);
        failedDiffByStem.set(stemWithoutDiff, failedFileName);
      } else {
        failedNewByStem.set(parsed.name, failedFileName);
      }
    }

    const completeStems = new Set();
    for (const stem of baselineByStem.keys()) {
      if (failedNewByStem.has(stem) && failedDiffByStem.has(stem)) {
        completeStems.add(stem);
      }
    }

    for (const stem of completeStems) {
      const baselineFileName = baselineByStem.get(stem);
      const failedNewFileName = failedNewByStem.get(stem);
      const failedDiffFileName = failedDiffByStem.get(stem);

      if (!baselineFileName || !failedNewFileName || !failedDiffFileName) {
        console.log(`Skipping ${directoryName}/${stem}: incomplete screenshot set`);
      } else {
        const parentDirectory = path.join(browserDirectory, stem);
        await fs.mkdir(parentDirectory, { recursive: true });

        const baselineSourcePath = path.join(baselineDirectory, baselineFileName);
        const baselineTargetPath = path.join(
          parentDirectory,
          withSuffixBeforeExtension(baselineFileName, '-original'),
        );
        await fs.rename(baselineSourcePath, baselineTargetPath);
        movedFilesCount += 1;
        movedBaselineCount += 1;

        const failedNewSourcePath = path.join(failedProcessingDirectory, failedNewFileName);
        const failedNewTargetPath = path.join(
          parentDirectory,
          withSuffixBeforeExtension(failedNewFileName, '-new'),
        );
        await fs.rename(failedNewSourcePath, failedNewTargetPath);
        movedFilesCount += 1;
        movedFailedNewCount += 1;

        const failedDiffSourcePath = path.join(failedProcessingDirectory, failedDiffFileName);
        const failedDiffTargetPath = path.join(parentDirectory, failedDiffFileName);
        await fs.rename(failedDiffSourcePath, failedDiffTargetPath);
        movedFilesCount += 1;
        movedFailedDiffCount += 1;
      }
    }

    const failedOnlyStems = new Set();
    for (const stem of failedNewByStem.keys()) {
      if (!baselineByStem.has(stem) && !failedDiffByStem.has(stem)) {
        failedOnlyStems.add(stem);
      }
    }

    for (const stem of failedOnlyStems) {
      const failedOnlyFileName = failedNewByStem.get(stem);
      if (failedOnlyFileName) {
        const parentDirectory = path.join(browserDirectory, stem);
        await fs.mkdir(parentDirectory, { recursive: true });

        const failedOnlySourcePath = path.join(failedProcessingDirectory, failedOnlyFileName);
        const failedOnlyTargetPath = path.join(parentDirectory, failedOnlyFileName);
        await fs.rename(failedOnlySourcePath, failedOnlyTargetPath);
        movedFilesCount += 1;
        movedFailedOnlyCount += 1;
      }
    }

    if (hasBaseline) {
      const remainingBaselineFiles = await getDirectFileNames(baselineDirectory);
      for (const remainingFileName of remainingBaselineFiles) {
        const remainingPath = path.join(baselineDirectory, remainingFileName);
        await fs.unlink(remainingPath);
        deletedUnmatchedCount += 1;
        console.log(`Deleted unmatched ${remainingPath}`);
      }
    }

    if (hasFailed) {
      const remainingFailedFiles = await getDirectFileNames(failedProcessingDirectory);
      for (const remainingFileName of remainingFailedFiles) {
        const remainingPath = path.join(failedProcessingDirectory, remainingFileName);
        await fs.unlink(remainingPath);
        deletedUnmatchedCount += 1;
        console.log(`Deleted unmatched ${remainingPath}`);
      }
    }

    await removeDirectoryIfEmpty(baselineDirectory);
    await removeDirectoryIfExists(failedProcessingDirectory);

    console.log(
      `${directoryName}: baselineMoved=${movedBaselineCount}, failedNewMoved=${movedFailedNewCount}, failedDiffMoved=${movedFailedDiffCount}, failedOnlyMoved=${movedFailedOnlyCount}, unmatchedDeleted=${deletedUnmatchedCount}`,
    );
  }

  console.log(`Done. ${movedFilesCount} file(s) moved.`);
}
