import fs from 'fs';
import matter from 'gray-matter';
import { computeApiTablesByDocGroup, resolveDocGroup } from './lib/api-tables.mjs';

/**
 * @param {string} text
 */
function toSplitAndUpperCase(text) {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
}

/**
 * @param {string} text
 */
function clearAndUpper(text) {
  return text.replace(/-/, ' ').toUpperCase();
}

const customElementsJson = JSON.parse(
  fs.readFileSync('./packages/ui/custom-elements.json', 'utf8'),
);

const tablesByGroup = computeApiTablesByDocGroup({
  uiComponentsDir: './packages/ui/components',
  customElementsJson,
});

const componentDirs = fs
  .readdirSync('./packages/ui/components')
  .filter(d => !d.startsWith('_') && !d.startsWith('form-integrations'));

const writtenGroups = new Set();

for (const componentDir of componentDirs) {
  const { dir, isSystem } = resolveDocGroup(componentDir);
  const folder = isSystem ? 'fundamentals/systems' : 'components';
  const groupKey = `${folder}/${dir}`;

  // Several `packages/ui/components` dirs are remapped onto the same doc dir (e.g. `form-core`
  // and `validate-messages` both feed into `form`); only write each output file once.
  if (writtenGroups.has(groupKey)) continue;
  writtenGroups.add(groupKey);

  const apiTablesMd = tablesByGroup.get(groupKey);
  if (!apiTablesMd) continue;

  const titleFromDir = toSplitAndUpperCase(dir);
  const parts = ['API Table', titleFromDir];
  if (isSystem) {
    parts.push('Systems');
  }
  const title = `${titleFromDir}: API Table`;
  const eleventyNavigation = {
    key: parts.join(' >> '),
    title: 'API Table',
    order: 90,
    parent: parts.slice(1).reverse().join(' >> '),
  };

  const dirApiTableMd = matter.stringify(`# ${title}\n\n${apiTablesMd}`, {
    parts,
    title,
    eleventyNavigation,
  });

  try {
    fs.writeFileSync(`./docs/${folder}/${dir}/api-table.md`, dirApiTableMd);
  } catch (e) {
    console.error(`No api docs have been created, ${e}`);
  }
}
