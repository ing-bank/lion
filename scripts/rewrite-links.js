/**
 * Before we publish to npm, we want to rewrite all relative links inside markdown files to
 * absolute github paths, so that documentation hosted on npmjs.com never contains broken links.
 */

const fs = require('fs');
const path = require('path');

const rewriteLinksConfig = {
  repoBasePath: 'https://github.com/ing-bank/lion/blob/master/',
  assetBasePath: 'https://raw.githubusercontent.com/ing-bank/lion/master/',
  monorepoRootPath: path.resolve(__dirname, '../'),
};

const gatherFilesConfig = {
  extension: '.md',
  excludeFiles: ['CHANGELOG.md'],
  excludeFolders: ['node_modules', '.history'],
};

/**
 * Gets an array of files for given extension
 * @param {string} startPath - local filesystem path
 * @param {object} cfg - configuration object
 * @param {string} cfg.extension - file extension like '.md'
 * @param {string[]} cfg.excludeFiles - file names filtered out
 * @param {string[]} cfg.excludeFolders - folder names filtered out
 * @param {string[]} result - list of file paths
 * @returns {string[]} result list of file paths
 */
function gatherFilesFromDir(startPath, cfg = gatherFilesConfig, result = []) {
  const files = fs.readdirSync(startPath);
  files.forEach(file => {
    const filePath = path.join(startPath, file);
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
      const folderName = filePath.replace(/.*\/([^/]+)$/, '$1');
      if (!cfg.excludeFolders.includes(folderName)) {
        gatherFilesFromDir(filePath, cfg, result); // search recursively
      }
    } else if (filePath.endsWith(cfg.extension)) {
      const fileName = filePath.replace(/.*\/([^/]+)$/, '$1');
      if (!cfg.excludeFiles.includes(fileName)) {
        result.push(filePath);
      }
    }
  });
  return result;
}

/**
 * Rewrites all relative links of markdown content to absolute links.
 * Also includes images. See: https://github.com/tcort/markdown-link-extractor/blob/master/index.js
 * @param {string} mdContent - contents of .md file to parse
 * @param {string} filePath - local filesystem path of md file,
 * like '/path/to/lion/packages/my-component/docs/myClass.md'
 * @param {object} cfg - configurantion object
 * @param {string} cfg.repoBasePath - root repository url for the absolute result links
 * @param {string} cfg.assetBasePath - root asset url for the absolute result image url
 * @param {string} cfg.monorepoRootPath - local filesystem root path of the monorepo
 * @returns {string} adjusted contents of input md file (mdContent)
 */
function rewriteLinksInMdContent(mdContent, filePath, cfg = rewriteLinksConfig) {
  const rewrite =
    (/** @type {string} */ repoBasePath, /** @type {string} */ repoRootPath) =>
    (/** @type {string} */ href) => {
      const isRelativeUrlPattern = /^(\.\/|\.\.\/)/; // starts with './' or '../'
      if (!href.match(isRelativeUrlPattern)) {
        return href;
      }

      const fileFolder = filePath.replace(/(.*\/).*/g, '$1');
      const absoluteLocalPath = path.resolve(fileFolder, href);
      // relativeFromRootPath: for instance 'packages/my-component/docs/' when
      // filePath is 'path/to/repo/packages/my-component/docs/myDoc.md'
      const relativeFromRootPath = absoluteLocalPath.replace(repoRootPath, '').slice(1);
      // newRoot: https://github.com/ing-bank/lion/blob/master/packages/my-component/docs/

      return repoBasePath + relativeFromRootPath;
    };

  const mdLink = (
    /** @type {string} */ href,
    /** @type {string} */ title,
    /** @type {string} */ text,
  ) =>
    `[${text}](${rewrite(cfg.repoBasePath, cfg.monorepoRootPath)(href)}${title ? ` ${title}` : ''})`;

  // /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/
  const linkPattern = '!?\\[(.*)\\]\\(([^|\\s]*)( +(.*))?\\s*\\)'; // eslint-disable-line
  const linkReplaced = mdContent.replace(new RegExp(linkPattern, 'g'), (_, p1, p2, p3) =>
    mdLink(p2, p3, p1),
  );

  const imgSrcPattern = `src *= *['"](.*)['"]`;
  const imageReplaced = linkReplaced.replace(
    new RegExp(imgSrcPattern, 'g'),
    (_, p1) => `src="${rewrite(cfg.assetBasePath, cfg.monorepoRootPath)(p1)}`,
  );

  return imageReplaced;
}

/**
 * Main code
 */
function main({ dryRun } = { dryRun: false }) {
  /** @type {string[]} */
  const mdFilePaths = gatherFilesFromDir(process.cwd()); // [path.resolve(__dirname, '../', 'packages/field/README.md')];
  mdFilePaths.forEach(filePath => {
    const content = fs.readFileSync(filePath).toString();
    const rewrittenContent = rewriteLinksInMdContent(content, filePath);
    if (dryRun) {
      console.log(`== output for filePath '${filePath}' ===`); // eslint-disable-line no-console
      console.log(rewrittenContent); // eslint-disable-line no-console
    } else {
      fs.writeFileSync(filePath, rewrittenContent);
    }
  });
}
module.exports = main;
