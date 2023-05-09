/* eslint-disable import/no-extraneous-dependencies */
import pathLib from 'path';
import { expect } from 'chai';
import { appendProjectDependencyPaths } from '../../src/cli/cli-helpers.js';
import { toPosixPath } from '../../src/program/utils/to-posix-path.js';
import { getCurrentDir } from '../../src/program/utils/get-current-dir.mjs';

/**
 * These tests are added on top of unit tests. See:
 * - https://github.com/ing-bank/lion/issues/1565
 * - https://github.com/ing-bank/lion/issues/1564
 */
describe('CLI helpers against filesystem', () => {
  describe('appendProjectDependencyPaths', () => {
    it('allows a regex filter', async () => {
      const targetFilePath = toPosixPath(
        pathLib.resolve(
          getCurrentDir(import.meta.url),
          '../../test-helpers/project-mocks/importing-target-project',
        ),
      );
      const result = await appendProjectDependencyPaths([targetFilePath], '/^dep-/');
      expect(result).to.eql([
        `${targetFilePath}/node_modules/dep-a`,
        // in windows, it should not add `${targetFilePath}/node_modules/my-dep-b`,
        targetFilePath,
      ]);
    });
  });
});
