import { glob } from 'glob'
import * as fs from 'fs';
import * as process from 'process';
import * as path from 'path';
import { fundamentalsEntries, allPages } from '../../content';
import { maxDepthForNonComponentsNavigation } from '../../../config.mjs';

const convertHeadingsToInPageNavData = (headings, urlPath) => {  
  return headings.map(header => {
    const anchor = header.slug;
    return {
      name: header.text,
      url: `/${urlPath}#${anchor}`
    };
  });
};

const parseEntries = async (entries) => {
  const contents = [];
  for (const componentEntry of entries) {
    const { Content, headings, remarkPluginFrontmatter } = await componentEntry.render();
    const order = remarkPluginFrontmatter.order;
    const slug = componentEntry.slug;
    const content = {Content, headings, order, slug};
    contents.push(content);
  }
  return contents;
};

export const getInPageNavData = (contentItems, urlPath) => {
  const inPageNavData = [];
  const parentDirToNavDataMap = new Map();
  const arePagesConcatenated = contentItems.length > 1;
  for (const contentItem of contentItems) {
    const headersH2 = contentItem.headings.filter(header => header.depth === 2);
    const parentDirName = path.dirname(contentItem.slug);
    if (headersH2.length !== 0) {      
      const entryInPageNavData = convertHeadingsToInPageNavData(headersH2, urlPath)[0];
      const headersH3 = contentItem.headings.filter(header => header.depth === 3);
      if (headersH3.length !== 0) {
        entryInPageNavData.children = convertHeadingsToInPageNavData(headersH3, urlPath);
      }
      inPageNavData.push(entryInPageNavData);
      parentDirToNavDataMap.set(parentDirName, entryInPageNavData);
    } else {
      const headersH3 = contentItem.headings.filter(header => header.depth === 3);
      if (headersH3.length !== 0) {
        const entryInPageNavData = parentDirToNavDataMap.get(parentDirName);
        if (entryInPageNavData) {
          entryInPageNavData.children = entryInPageNavData.children || [];
          entryInPageNavData.children = [...entryInPageNavData.children, ...convertHeadingsToInPageNavData(headersH3, urlPath)];
        }
      }
    }
  }
  return inPageNavData;
};

function getContentsWithParentDepth(contents, parentDepth) {
  return contents.filter(content => {
    const dirDepth = path.dirname(content.slug).split('/').length;
    return dirDepth >= parentDepth;
  });
}

function getSlugForParentDepth(slug, depth) {
  const slugParts = slug.split('/');
  const slugPartsForParentDepth = slugParts.slice(0, depth);
  return slugPartsForParentDepth.join('/');
}

function getUniqueParentDirs(contents, parentDepth) {
  const dirs = new Set();
  contents.forEach(content => {
    dirs.add(getSlugForParentDepth(content.slug, parentDepth));
  });
  return [...dirs];
}

function sortDirs(dirs, contents) {
  dirs.sort((a, b) => {
    const aDirOrder = contents.find(content => content.slug === path.join(a, 'dir-index')).order;
    const bDirOrder = contents.find(content => content.slug === path.join(b, 'dir-index')).order;    
    return aDirOrder < bDirOrder ? -1 : 1;
  });
}

function sortDirectoriesForParentDepth(contents, parentDepth) {

  const reducedContents = getContentsWithParentDepth(contents, parentDepth);

  const uniqueParentDirs = getUniqueParentDirs(reducedContents, parentDepth);

  sortDirs(uniqueParentDirs, reducedContents);
  contents.sort((a, b) => {
    const aParentDir = getSlugForParentDepth(a.slug, parentDepth);
    const bParentDir = getSlugForParentDepth(b.slug, parentDepth);
    if (uniqueParentDirs.indexOf(aParentDir) > uniqueParentDirs.indexOf(bParentDir)) {
      return 1;
    } else if (uniqueParentDirs.indexOf(aParentDir) < uniqueParentDirs.indexOf(bParentDir)) {
      return -1;
    } else {
      return 0;
    }    
  });  
}

function sortDirectories(contents) {
  let parentDepth = maxDepthForNonComponentsNavigation + 1;
  let hasParentWithDepth = contents.some(content => path.dirname(content.slug).split('/').length === parentDepth);

  while(hasParentWithDepth) {
    sortDirectoriesForParentDepth(contents, parentDepth);
    parentDepth++;
    hasParentWithDepth = contents.some(content => path.dirname(content.slug).split('/').length === parentDepth);
  }  
}

function sort(contents) {
  contents.sort((a, b) => {
    // Get paths with fewer depth first
    if (a.slug.split('/').length < b.slug.split('/').length) {
      return -1;
    } else if (a.slug.split('/').length > b.slug.split('/').length) {
      return 1;
    }
    // same depth
    else {
      // same parent
      if (path.dirname(a.slug) === path.dirname(b.slug)) {
        if (path.basename(a.slug) === 'dir-index') {
          return -1;
        } else if (path.basename(b.slug) === 'dir-index') {
          return 1;
        } else {
          return a.order < b.order ? -1 : 1;
        }
      }
    }
  });
}

export async function getPages(entries) {
  const contents = await parseEntries(entries);  
  sortDirectories(contents);
  sort(contents);
  return contents;
}

export const getPagesByDir = async (directoryPath) => {
  const entries = getEntriesByDir(directoryPath);
  return await getPages(entries);
};

const getEntriesByDir = (dirname) => {
  return allPages.filter(childEntry => {
    return childEntry.slug.startsWith(dirname)});
};

const getMdjsStories = (fullDirPath) => {
  return new Promise((resolve, reject) => {    
    glob(fullDirPath + '/**/__mdjs-stories--*.js', {}, (err, files)=>{
      const relativePaths = files.map(file => {
        return path.relative(fullDirPath, file);
      });
      resolve(relativePaths);
    })
  });  
};

/**
 * @param {boolean} isUrlPathADirectory `True` if the `urlPath` paramter is a url path to a directory with multiple md files.
 * `false` if the `urlPath` paramter is a url path to a single md file
 */
export async function getPathForMdjsStroriesFile(isUrlPathADirectory, urlPath) {
  if (!isUrlPathADirectory) {
    const mdjsStroriesFileDirectory = path.dirname(urlPath);
    return `/docs/${mdjsStroriesFileDirectory}/__mdjs-stories--${path.basename(urlPath)}.js`;
  } 
  if (urlPath) {
    let mdjsStoriesJsPath = '';
    const fullDirPath = path.join(process.cwd(), 'public/docs', urlPath);
    const files = await getMdjsStories(fullDirPath);
    let imports = '';
    files.forEach(file => {
      imports += `import('./${file}');\n`
    });
    if (imports) {
      mdjsStoriesJsPath = path.join(fullDirPath, '__mdjs-stories.js');
      fs.writeFileSync(mdjsStoriesJsPath, imports, 'utf8');
    }
    if (mdjsStoriesJsPath) {
      return '/docs' + mdjsStoriesJsPath.split('/docs')[1];
    }    
  }
  return null;
}