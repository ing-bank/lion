import { writeFile } from 'node:fs/promises';
import { globby } from 'globby';
import matter from 'gray-matter';
import { processContentWithTitle } from '@rocket/core/title';

// since it's a one-time script, the path is just hardcoded
const paths = await globby('docs/components/**/*.md');

const getParts = parts => {
  if (parts.length !== 1) {
    return parts;
  }

  let delimiter = '>';
  if (parts[0].includes(':')) {
    delimiter = ':';
  }

  return parts[0].split(delimiter).map(part => part.trim());
};

const getTitle = title => {
  let delimiter = '>';
  if (title.includes(':')) {
    delimiter = ':';
  }

  return title.split(delimiter).map(part => part.trim())[1];
};

for (const path of paths) {
  const grayMatterFile = await matter.read(path);

  // save original values
  const { parts, eleventyNavigation, ...rest } = grayMatterFile.data;

  // merge them
  const newParts = getParts(parts);
  let newTitle = getTitle(eleventyNavigation.title);
  if (!newTitle) {
    newTitle = eleventyNavigation.title;
  }
  grayMatterFile.data = {
    ...rest,
    parts: newParts,
    eleventyNavigation: { ...eleventyNavigation, title: newTitle },
  };

  await writeFile(grayMatterFile.path, matter.stringify(grayMatterFile));
}
