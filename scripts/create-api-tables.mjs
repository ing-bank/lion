import fs from 'fs';
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';

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

/**
 * Function to convert code into HTML markup
 * @param {string} code 
 */
function codeToHtml(code) {
  return code
      // Escape HTML characters
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      // Preserve line breaks and spaces (for indentation)
      .replace(/\n/g, '<br>')
      .replace(/ {2}/g, '&nbsp;');
}

/**
 * @param {string} input 
 */
function stripBackticks(input) {
  // This regex matches a backtick followed by <pre> or </pre> followed by a backtick
  return input.replace(/(`<pre>|<\/pre>`)/gm, (_, t) => t.replace(/`/, ''));
}

const systemsTable = ['core', 'form-core', 'localize', 'overlays'];
const mappingTable = [{ componentDir: 'validate-messages', portalDir: 'form' }];

const componentDirs = fs
  .readdirSync('./packages/ui/components')
  .filter(d => !d.startsWith('_') && !d.startsWith('form-integrations'));

const customElementsJson = JSON.parse(
  fs.readFileSync('./packages/ui/custom-elements.json', 'utf8'),
);

for (let dir of componentDirs) {
  const isSystem = systemsTable.includes(dir);
  const classes = fs
    .readdirSync(`./packages/ui/components/${dir}/src/`)
    .filter(f => {
      if (isSystem) {
        return f.endsWith('.js')
      }
      return f.endsWith('.js') && !f.endsWith('Manager.js') && !f.endsWith('Mixin.js')
    })
    .map(f => f.replace('.js', ''));

  for (const component of mappingTable) {
    if (dir === component.componentDir) {
      dir = component.portalDir;
    }
  }
  if (dir === 'form-core') {
    dir = 'form';
  }

  const folderHeading = isSystem ? 'Systems >> ' : '';
  let dirApiTableMd = `# ${folderHeading}${toSplitAndUpperCase(dir)} >> API Table ||90`;

  for (const c of classes) {
    for (const mod of customElementsJson.modules) {
      for (const declaration of mod.declarations) {
        if (declaration.name === c && declaration.kind === 'class') {

          declaration.members = declaration.members.map(member => {
            if (typeof member.default === 'string' && /\r?\n/.test(member.default)) {
              member.default = `<pre><code>${codeToHtml(member.default)}</code></pre>`;
            }
            return member;
          })

          const md = customElementsManifestToMarkdown(
            {
              modules: [
                {
                  declarations: [declaration],
                },
              ],
            },
            {
              private: 'hidden',
              headingOffset: 0,
              omitSections: [
                'main-heading',
                'super-class',
                'static-fields',
                'static-methods',
                'mixins',
              ],
            },
          );
          dirApiTableMd = `${dirApiTableMd} \n\n${stripBackticks(md)}`;
        }
      }
    }
  }

  const folder = isSystem ? 'fundamentals/systems' : 'components';
  try {
    fs.writeFileSync(`./docs/${folder}/${dir}/api-table.md`, dirApiTableMd);
  } catch (e) {
    console.error(`No api docs have been created, ${e}`);
  }
}
