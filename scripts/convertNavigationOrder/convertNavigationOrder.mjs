import { writeFile } from 'node:fs/promises';
import { globby } from 'globby';
import matter from 'gray-matter';
import { processContentWithTitle } from '@rocket/core/title';

/**
 * Reads a text and extracts a title from it
 * This is different from "extractTitle" from @rocket/core/title
 * because it also returns the line number where the title was found.
 *
 * @param {string} content The text where to extract the title from
 */
export function extractTitle(content) {
  let captureHeading = true;
  let i = 0;
  for (const line of content.split('\n')) {
    if (line.startsWith('```')) {
      captureHeading = !captureHeading;
    }
    if (captureHeading && line.startsWith('# ')) {
      return { title: line.substring(2), lineNumber: i };
    }
    i += 1;
  }

  return { title: null, lineNumber: -1 };
}

// since it's a one-time script, the path is just hardcoded
const paths = await globby('docs/fundamentals/**/*.md');

for (const path of paths) {
  const grayMatterFile = await matter.read(path);

  // save original values
  const { eleventyNavigation, ...rest } = grayMatterFile.data;
  // rocket values
  const { eleventyNavigation: rocketEleventyNavigation, ...rocketRest } = processContentWithTitle(grayMatterFile.content) || {};
  console.log(rocketEleventyNavigation);
  if (!rocketEleventyNavigation) {
    // not all pages need to change
    continue;
  }
  // merge them
  grayMatterFile.data = { ...rest, ...rocketRest, eleventyNavigation: { ...eleventyNavigation, ...rocketEleventyNavigation } };

  const { lineNumber } = extractTitle(grayMatterFile.content);
  const contentArray = grayMatterFile.content.split('\n');
  contentArray[lineNumber] = `# ${grayMatterFile.data.eleventyNavigation.title}`;
  grayMatterFile.content = contentArray.join('\n');

  await writeFile(grayMatterFile.path, matter.stringify(grayMatterFile));
}
