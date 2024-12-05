import { expect } from 'chai';
import path from 'path';
import { pathToFileURL } from 'url';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { executeJsCodeShiftTransforms } from '../../src/migrate-helpers/executeJsCodeShiftTransforms.js';
import {
  createTempProjectFixture,
  restoreTempProjectFixture,
} from '../../test-helpers/mock-helpers.js';

describe('executeJsCodeShiftTransforms', () => {
  after(() => {
    restoreTempProjectFixture();
  });

  it('logs only a summary at the end', async () => {
    /**
     * @type {string[]}
     */
    const logs = [];
    const originalLog = console.log;
    console.log = msg => {
      logs.push(msg);
    };
    const fixture = './fixtures/02a-executeJsCodeShiftTransforms-success/';

    await mkdir(new URL(`${fixture}src/`, import.meta.url), { recursive: true });
    await writeFile(
      new URL(`${fixture}src/index.js`, import.meta.url),
      `export const updated = false;`,
    );
    await writeFile(
      new URL(`${fixture}src/another.js`, import.meta.url),
      `export const updated = false;`,
    );

    const originalContent1 = await readFile(
      new URL(`${fixture}src/index.js`, import.meta.url),
      'utf8',
    );
    const originalContent2 = await readFile(
      new URL(`${fixture}src/another.js`, import.meta.url),
      'utf8',
    );

    await executeJsCodeShiftTransforms(
      new URL(`${fixture}src`, import.meta.url),
      new URL(`${fixture}transforms`, import.meta.url),
    );

    const transformedContent1 = await readFile(
      new URL(`${fixture}src/index.js`, import.meta.url),
      'utf8',
    );
    const transformedContent2 = await readFile(
      new URL(`${fixture}src/another.js`, import.meta.url),
      'utf8',
    );

    // restore content
    await writeFile(new URL(`${fixture}src/index.js`, import.meta.url), originalContent1);
    await writeFile(new URL(`${fixture}src/another.js`, import.meta.url), originalContent2);

    expect(transformedContent1).to.equal('export const updated = true;');
    expect(transformedContent2).to.equal('export const updated = true;');

    expect(logs).to.include('🔎 Found 2 files to transform');
    expect(logs).to.include('🚀 Running jscodeshift mod "write"');
    expect(logs).to.include('✅ 2 files got updated successfully.');

    console.log = originalLog;
  });

  it('supports mdjs (.md|.mdx) files as well', async () => {
    const projMockWithStringifiedJson = {
      'transforms/write_-_cjs-export.cjs': `module.exports = async function transformerWrapper(file, api, options) {
        return \`export const filePath = '\${file.path}';\n\`;
      };`,
      'src/code/index.js': `export const updated = false;`,
      'src/stories/index.md': [
        '# Title\n\nParagraph\n',
        '```js',
        'export const updated = false;',
        '```',
        '\n## Second Title\n\nParagraph\n',
        '```js',
        'export const updated2 = false;',
        '```',
      ].join('\n'),
      'src/stories2/index.mdx': [
        '# Title2\n\nParagraph\n',
        '```js',
        'export const updated = false;',
        '```',
        '\n## Second Title2\n\nParagraph\n',
        '```js',
        'export const updated2 = false;',
        '```',
      ].join('\n'),
    };

    const projectPath = await createTempProjectFixture(projMockWithStringifiedJson, {
      projectName: 'proj-with-md-files',
    });

    await executeJsCodeShiftTransforms(
      new URL(pathToFileURL(`${projectPath}/src`), import.meta.url),
      new URL(pathToFileURL(`${projectPath}/transforms`), import.meta.url),
    );
    expect(
      await readFile(
        new URL(pathToFileURL(`${projectPath}/src/stories/index.md`), import.meta.url),
        'utf8',
      ),
    ).to.equal(
      [
        '# Title\n\nParagraph\n',
        '```js',
        `export const filePath = '${process.cwd()}${path.sep}_tmp-md-blocks${path.sep}h-549707620-index-0.js';`,
        '```',
        '\n## Second Title\n\nParagraph\n',
        '```js',
        `export const filePath = '${process.cwd()}${path.sep}_tmp-md-blocks${path.sep}h-549707620-index-1.js';`,
        '```',
      ].join('\n'),
    );

    expect(
      await readFile(
        new URL(pathToFileURL(`${projectPath}/src/stories2/index.mdx`), import.meta.url),
        'utf8',
      ),
    ).to.equal(
      [
        '# Title2\n\nParagraph\n',
        '```js',
        `export const filePath = '${process.cwd()}${path.sep}_tmp-md-blocks${path.sep}h1054506434-index-0.js';`,
        '```',
        '\n## Second Title2\n\nParagraph\n',
        '```js',
        `export const filePath = '${process.cwd()}${path.sep}_tmp-md-blocks${path.sep}h1054506434-index-1.js';`,
        '```',
      ].join('\n'),
    );
  });

  it('also works with hidden .storybook folder', async () => {
    const projMockWithStringifiedJson = {
      'transforms/write_-_cjs-export.cjs': `module.exports = async function transformerWrapper(file, api, options) {
        return 'export const updated = true';
      };`,
      '.storybook/index.js': `export const updated = false;`,
      '.storybook/index.md': [
        '# Title\n\nParagraph\n',
        '```js',
        'export const updated = false```',
        '\n## Second Title\n\nParagraph\n',
        '```js',
        'export const updated = false;```',
      ].join('\n'),
    };

    const projectPath = await createTempProjectFixture(projMockWithStringifiedJson, {
      projectName: 'proj-with-hidden-storybook-folder',
    });

    await executeJsCodeShiftTransforms(
      new URL(pathToFileURL(`${projectPath}/.storybook`), import.meta.url),
      new URL(pathToFileURL(`${projectPath}/transforms`), import.meta.url),
    );

    expect(
      await readFile(
        new URL(pathToFileURL(`${projectPath}/.storybook/index.js`), import.meta.url),
        'utf8',
      ),
    ).to.equal('export const updated = true');

    expect(
      await readFile(
        new URL(pathToFileURL(`${projectPath}/.storybook/index.md`), import.meta.url),
        'utf8',
      ),
    ).to.equal(
      [
        '# Title\n\nParagraph\n',
        '```js',
        'export const updated = true```',
        '\n## Second Title\n\nParagraph\n',
        '```js',
        'export const updated = true```',
      ].join('\n'),
    );
  });

  it("does not work with .md files containing ['CHANGELOG', 'README', 'CONTRIBUTING', 'MIGRATION']", async () => {
    const projMockWithStringifiedJson = {
      'transforms/write_-_cjs-export.cjs': `module.exports = async function transformerWrapper(file, api, options) {
        return 'export const updated = true';
      };`,
      'src/my-CHANGELOG-x.md': '```js\nexport const updated = false;\n```',
      'src/my-README-x.md': '```js\nexport const updated = false;\n```',
      'src/my-CONTRIBUTING-x.md': '```js\nexport const updated = false;\n```',
      'src/my-MIGRATION-x.md': '```js\nexport const updated = false;\n```',
      'src/my-updated-x.js': `export const updated = false;`,
    };

    const projectPath = await createTempProjectFixture(projMockWithStringifiedJson, {
      projectName: 'proj-with-reserved-md-filenames',
    });

    await executeJsCodeShiftTransforms(
      new URL(pathToFileURL(`${projectPath}/src`), import.meta.url),
      new URL(pathToFileURL(`${projectPath}/transforms`), import.meta.url),
    );

    expect(
      await readFile(
        new URL(pathToFileURL(`${projectPath}/src/my-updated-x.js`), import.meta.url),
        'utf8',
      ),
    ).to.equal('export const updated = true');

    for (const fileNameInclude of ['CHANGELOG', 'README', 'CONTRIBUTING', 'MIGRATION']) {
      expect(
        await readFile(
          new URL(pathToFileURL(`${projectPath}/src/my-${fileNameInclude}-x.md`), import.meta.url),
          'utf8',
        ),
      ).to.equal('```js\nexport const updated = false;\n```');
    }
  });
});
