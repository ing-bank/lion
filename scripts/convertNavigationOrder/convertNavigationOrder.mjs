import { writeFile } from 'node:fs/promises';
import { globby } from 'globby';
import matter from 'gray-matter';
import { processContentWithTitle } from '@rocket/core/title';

// since it's a one-time script, the path is just hardcoded
const paths = await globby('docs/fundamentals/**/*.md');

for (const path of paths) {
  const grayMatterFile = await matter.read(path);

  // save original values
  const { eleventyNavigation, ...rest } = grayMatterFile.data;
  // rocket values
  const { eleventyNavigation: rocketEleventyNavigation, ...rocketRest } =
    processContentWithTitle(grayMatterFile.content) || {};
  if (!rocketEleventyNavigation) {
    // not all pages need to change
    continue;
  }
  // merge them
  grayMatterFile.data = {
    ...rest,
    ...rocketRest,
    eleventyNavigation: { ...eleventyNavigation, ...rocketEleventyNavigation },
  };

  await writeFile(grayMatterFile.path, matter.stringify(grayMatterFile));
}
