import { writeFile } from 'node:fs/promises';
import { glob } from 'tinyglobby';
import matter from 'gray-matter';
import { processContentWithTitle } from '@rocket/core/title';

const getTitleLineNumber = content => {
  let captureHeading = true;
  let lineNumber = 0;
  for (const line of content.split('\n')) {
    if (line.startsWith('```')) {
      captureHeading = !captureHeading;
    }
    if (captureHeading && line.startsWith('# ')) {
      return lineNumber;
    }
    lineNumber += 1;
  }
};

// since it's a one-time script, the path is just hardcoded
const paths = await glob('docs/components/**/*.md');

for (const path of paths) {
  const grayMatterFile = await matter.read(path);

  // save original values
  const { eleventyNavigation, ...rest } = grayMatterFile.data;
  // rocket values
  const { eleventyNavigation: rocketEleventyNavigation, ...rocketRest } =
    processContentWithTitle(grayMatterFile.content) || {};
  const titleLineNumber = getTitleLineNumber(grayMatterFile.content);
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
  const contentArray = grayMatterFile.content.split('\n');
  console.log(grayMatterFile.content, contentArray, titleLineNumber);
  contentArray[titleLineNumber] = `# ${grayMatterFile.data.title}`;
  grayMatterFile.content = contentArray.join('\n');
  console.log(grayMatterFile.content);

  await writeFile(grayMatterFile.path, matter.stringify(grayMatterFile));
}
