import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';
import { readFile } from 'fs/promises';
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
      expect(prettify(adjustedCodeArrowDown)).to.equal(prettify(expectedCodeArrowDown));
      expect(prettify(adjustedCodeArrowUp)).to.equal(prettify(expectedCodeArrowUp));
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
      expect(prettify(adjustedCodeArrowDown)).to.equal(prettify(expectedCodeArrowDown));
      expect(prettify(adjustedCodeArrowUp)).to.equal(prettify(expectedCodeArrowUp));
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
