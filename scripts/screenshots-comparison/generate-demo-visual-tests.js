import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const THIS_FILE_PATH = fileURLToPath(import.meta.url);
const THIS_DIR = path.dirname(THIS_FILE_PATH);
const REPO_ROOT = path.resolve(THIS_DIR, '../..');
const STORIES_ROOT = path.join(REPO_ROOT, '_site-dev/components');
const TEST_OUTPUT_DIR = path.join(REPO_ROOT, '.tmp/generated-visual-tests');
const DEMO_SUITE_FILE = path.join(REPO_ROOT, '__docs-shared/demo-viewer/test/demo.suite.js');
const GENERATED_TEST_SUFFIX = '.generated.visual.test.js';
const IGNORED_FOLDER_NAMES = new Set(['design', 'android', 'ios']);

/**
 * @param {string} absolutePath
 * @returns {boolean}
 */
function hasIgnoredPathSegment(absolutePath) {
  const relativePath = path.relative(STORIES_ROOT, absolutePath);
  const segments = relativePath.split(path.sep).filter(Boolean);
  return segments.some(segment => IGNORED_FOLDER_NAMES.has(segment));
}

/**
 * @param {string} dirPath
 * @returns {Promise<string[]>}
 */
async function findStoryFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const absolutePath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        if (hasIgnoredPathSegment(absolutePath)) {
          return [];
        }
        return findStoryFiles(absolutePath);
      }
      if (
        entry.isFile() &&
        entry.name === '__mdjs-stories.js' &&
        !hasIgnoredPathSegment(absolutePath)
      ) {
        return [absolutePath];
      }
      return [];
    }),
  );

  return files.flat();
}

/**
 * @param {string} outputDir
 * @returns {Promise<void>}
 */
async function removePreviouslyGeneratedTests(outputDir) {
  await fs.mkdir(outputDir, { recursive: true });
  const entries = await fs.readdir(outputDir, { withFileTypes: true });
  const generatedFiles = entries.filter(
    entry => entry.isFile() && entry.name.endsWith(GENERATED_TEST_SUFFIX),
  );

  await Promise.all(
    generatedFiles.map(entry => fs.rm(path.join(outputDir, entry.name), { force: true })),
  );
}

/**
 * @param {string} storyAbsolutePath
 * @returns {string}
 */
function createOutputFileName(storyAbsolutePath) {
  const relativeStoryPath = path.relative(STORIES_ROOT, storyAbsolutePath);
  const withoutFileName = relativeStoryPath.replace(/[/\\]__mdjs-stories\.js$/, '');
  const slug = withoutFileName.length > 0 ? withoutFileName.replace(/[/\\]/g, '--') : 'root';
  return `${slug}${GENERATED_TEST_SUFFIX}`;
}

/**
 * @param {string} storyAbsolutePath
 * @returns {string}
 */
function createSuiteFileNamePart(storyAbsolutePath) {
  const relativeStoryPath = path.relative(STORIES_ROOT, storyAbsolutePath);
  const withoutFileName = relativeStoryPath.replace(/[/\\]__mdjs-stories\.js$/, '');
  const segments = withoutFileName.split(path.sep).filter(Boolean);

  if (segments.length === 0) {
    return 'root';
  }

  if (segments.length === 1) {
    return segments[0];
  }

  return `${segments[segments.length - 2]}--${segments[segments.length - 1]}`;
}

/**
 * @param {string} storyAbsolutePath
 * @returns {string}
 */
function createTestFileContent(storyAbsolutePath) {
  const relativeSuiteImportPath = path
    .relative(TEST_OUTPUT_DIR, DEMO_SUITE_FILE)
    .split(path.sep)
    .join('/');
  const relativeImportPath = path
    .relative(TEST_OUTPUT_DIR, storyAbsolutePath)
    .split(path.sep)
    .join('/');
  const fileNamePart = createSuiteFileNamePart(storyAbsolutePath);

  return `import { runVisualTestsForDemos } from '${relativeSuiteImportPath}';\nimport * as demos from '${relativeImportPath}';\n\nrunVisualTestsForDemos(demos, '${fileNamePart}');\n`;
}

async function main() {
  const rootEntries = await fs.readdir(STORIES_ROOT, { withFileTypes: true });
  const componentFolderPaths = rootEntries
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(STORIES_ROOT, entry.name));
  const storyFiles = (
    await Promise.all(
      componentFolderPaths.map(componentFolderPath => findStoryFiles(componentFolderPath)),
    )
  )
    .flat()
    .sort((a, b) => a.localeCompare(b));

  await removePreviouslyGeneratedTests(TEST_OUTPUT_DIR);

  await Promise.all(
    storyFiles.map(async storyFile => {
      const outputFileName = createOutputFileName(storyFile);
      const outputFilePath = path.join(TEST_OUTPUT_DIR, outputFileName);
      const content = createTestFileContent(storyFile);
      await fs.writeFile(outputFilePath, content, 'utf8');
    }),
  );

  console.log(
    `Generated ${storyFiles.length} visual test files in ${path.relative(
      REPO_ROOT,
      TEST_OUTPUT_DIR,
    )}`,
  );
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
