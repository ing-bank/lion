import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { readFile } from 'fs/promises';
import fs from 'node:fs/promises';
import os from 'node:os';
import chai from 'chai';
// eslint-disable-next-line import/no-unresolved
import chaiAsPromised from 'chai-as-promised';
import { prettify, bypassImportMap } from '@lion/nodejs-helpers';

import {
  // ERROR_CAN_NOT_RESOLVE_SOURCE,
  ERROR_CAN_NOT_ACCESS_PACKAGE_DIR,
} from '../../src/tasks/bypass-import-map.js';

// Register chai-as-promised plugin for async/await support.
chai.use(chaiAsPromised);
const { expect } = chai;

// create async version of exec
const asyncExec = promisify(exec);

describe('Bypass import map task', () => {
  const packageDir = 'test-node/fixtures/simple-import-map';
  const outputDirPath = path.resolve(packageDir);

  before(async () => {
    const ignoredDirs = ['node_modules', 'dist-types', 'scripts'];
    await bypassImportMap(packageDir, { ignoredDirs });
  });

  after(async () => {
    await asyncExec(`git checkout ${path.join(packageDir, 'components', 'icon')}`);
  });

  // TODO: Fails on windows with:
  // + expected - actual
  // -import i from '#icon/oj-icons/outline/arrows/arrow_circle_down_outline.svg.js';
  // +import i from '../../../../../components/icon/oj-icons/outline/arrows/arrow_circle_down_outline.svg.js';
  it('resolves imports for #icon/oj-icons/', async () => {
    // Given
    const expectedCodeArrowDown = `
      import i from '../../../../../components/icon/oj-icons/outline/arrows/arrow_circle_down_outline.svg.js';
      export default i;
    `;
    const expectedCodeArrowUp = `
      import i from '../../../../../components/icon/oj-icons/outline/arrows/arrow_circle_up_outline.svg.js';
      export default i;
    `;
    // When
    const adjustedCodeArrowDown = await readFile(
      path.join(outputDirPath, 'components/icon/icons/line/arrows/arrow-circle-down.svg.js'),
      'utf-8',
    );
    const adjustedCodeArrowUp = await readFile(
      path.join(outputDirPath, 'components/icon/icons/line/arrows/arrow-circle-up.svg.js'),
      'utf-8',
    );
    // Then
    if (process.platform !== 'win32') {
      // FIXME: skipping test for windows case
      expect(await prettify(adjustedCodeArrowDown)).to.equal(await prettify(expectedCodeArrowDown));
      expect(await prettify(adjustedCodeArrowUp)).to.equal(await prettify(expectedCodeArrowUp));
    }
  });

  // TODO: Fails on windows with:
  // + expected - actual
  // -import i from '#icon/oj-sun-icons/arrows/arrowCircleDownFilled.svg.js';
  // +import i from '../../../../../components/icon/oj-sun-icons/arrows/arrowCircleDownFilled.svg.js';
  it('resolves imports for #icon/oj-sun-icons/', async () => {
    // Given
    const expectedCodeArrowDown = `
      import i from '../../../../../components/icon/oj-sun-icons/arrows/arrowCircleDownFilled.svg.js';

      // @deprecated
      export default i;
    `;
    const expectedCodeArrowUp = `
      import i from '../../../../../components/icon/oj-sun-icons/arrows/arrowCircleUpFilled.svg.js';

      // @deprecated
      export default i;
    `;
    // When
    const adjustedCodeArrowDown = await readFile(
      path.join(
        outputDirPath,
        'components/icon/oj-icons/outline/arrows/arrow_circle_down_outline.svg.js',
      ),
      'utf-8',
    );
    const adjustedCodeArrowUp = await readFile(
      path.resolve(
        path.join(
          outputDirPath,
          'components/icon/oj-icons/outline/arrows/arrow_circle_up_outline.svg.js',
        ),
      ),
      'utf-8',
    );
    // Then
    if (process.platform !== 'win32') {
      // FIXME: skipping test for windows case
      expect(await prettify(adjustedCodeArrowDown)).to.equal(await prettify(expectedCodeArrowDown));
      expect(await prettify(adjustedCodeArrowUp)).to.equal(await prettify(expectedCodeArrowUp));
    }
  });
});

describe('Exceptions/error handling', () => {
  it('throws in case packageDir can not be accessed', async () => {
    // Given (packageDir does not exist on the filesystem, intentionally)
    const packageDir = 'test-node/fixtures/error-can-not-access-package-dir';
    // When
    await expect(
      bypassImportMap(packageDir),
      // Then
    ).to.be.rejectedWith(ERROR_CAN_NOT_ACCESS_PACKAGE_DIR);
  });
});

describe('Conditional import maps', () => {
  let packageDir;

  beforeEach(async () => {
    packageDir = await fs.mkdtemp(path.join(os.tmpdir(), 'lion-conditional-imports-'));
    await fs.mkdir(path.join(packageDir, 'components'));
    await fs.mkdir(path.join(packageDir, 'generated'));
    await fs.writeFile(path.join(packageDir, 'generated/phone.mjs'), 'export default {};');
    await fs.writeFile(path.join(packageDir, 'generated/phone.cjs'), 'module.exports = {};');
    await fs.writeFile(path.join(packageDir, 'generated/phone.d.ts'), 'export default {};');
  });

  afterEach(async () => {
    await fs.rm(packageDir, { recursive: true, force: true });
  });

  [
    {
      title: 'uses the ESM import target instead of types or require',
      key: '#awesome-phonenumber',
      source: '#awesome-phonenumber',
      target: {
        types: './generated/phone.d.ts',
        import: './generated/phone.mjs',
        require: './generated/phone.cjs',
        default: './generated/phone.cjs',
      },
    },
    {
      title: 'uses the default runtime target when there is no import condition',
      key: '#awesome-phonenumber',
      source: '#awesome-phonenumber',
      target: {
        types: './generated/phone.d.ts',
        default: './generated/phone.mjs',
      },
    },
    {
      title: 'preserves condition order when default precedes import',
      key: '#awesome-phonenumber',
      source: '#awesome-phonenumber',
      target: {
        default: './generated/phone.mjs',
        import: './generated/phone.cjs',
      },
    },
    {
      title: 'expands conditional wildcard targets',
      key: '#phone/*',
      source: '#phone/phone.mjs',
      target: {
        types: './types/*',
        import: './generated/*',
      },
    },
  ].forEach(({ title, key, source, target }) => {
    it(title, async () => {
      const manifest = JSON.stringify({ imports: { [key]: target } });
      await fs.writeFile(path.join(packageDir, 'package.json'), manifest);
      const sourcePath = path.join(packageDir, 'components/consumer.js');
      await fs.writeFile(sourcePath, `import phone from '${source}';\nexport default phone;`);

      await bypassImportMap(packageDir);

      expect(await fs.readFile(sourcePath, 'utf8')).to.equal(
        await prettify("import phone from '../generated/phone.mjs';\nexport default phone;"),
      );
      expect(await fs.readFile(path.join(packageDir, 'package.json'), 'utf8')).to.equal(manifest);
    });
  });

  it('rejects a conditional entry with no supported ESM runtime target', async () => {
    await fs.writeFile(
      path.join(packageDir, 'package.json'),
      JSON.stringify({
        imports: { '#awesome-phonenumber': { types: './generated/phone.d.ts' } },
      }),
    );

    await expect(bypassImportMap(packageDir)).to.be.rejectedWith(
      'Unsupported import map target for "#awesome-phonenumber": expected a string or an import/default string target',
    );
  });
});
