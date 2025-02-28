import { writeFile } from 'node:fs/promises';
import { globby } from 'globby';
import matter from 'gray-matter';
import { extractTitle, parseTitle } from './rocketTitle.mjs'; // copied from @rocket/cli

// since it's a one-time script, the path is just hardcoded
const paths = await globby('docs/guides/**/*.md');

for (const path of paths) {
  /*
  how it should be
  found in TitleMetaPlugin
  parts: [ 'Use Cases', 'Button' ],
  title: 'Button: Use Cases',
  eleventyNavigation: {
    key: 'Button >> Use Cases',
    title: 'Use Cases',
    order: 20,
    parent: 'Button'
  }
   */
  const grayMatterFile = await matter.read(path);
  const { eleventyNavigation = { key: '', order: -1 } } = grayMatterFile.data;
  const { title, lineNumber } = extractTitle(grayMatterFile.content);
  if (!title || lineNumber < 0) {
    continue;
  }

  const parsedTitle = parseTitle(title);
  grayMatterFile.data.parts = parsedTitle.parts; // Button
  grayMatterFile.data.title = parsedTitle.title;

  if (!path.endsWith('index.md')) {
    eleventyNavigation.parent = parsedTitle.navigationParent;
  }
  eleventyNavigation.order = parsedTitle.order; // 20
  eleventyNavigation.key = parsedTitle.title; // Button: Use Cases
  eleventyNavigation.title = parsedTitle.navigationTitle; // Use Cases
  grayMatterFile.data.eleventyNavigation = eleventyNavigation;


  const contentArray = grayMatterFile.content.split('\n');
  contentArray[lineNumber] = `# ${parsedTitle.title}`;
  grayMatterFile.content = contentArray.join('\n');
  await writeFile(grayMatterFile.path, matter.stringify(grayMatterFile));
}
