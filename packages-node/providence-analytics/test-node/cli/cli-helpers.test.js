/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import sinon from 'sinon';
import pathLib from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
import { it } from 'mocha';
import {
  mockProject,
  restoreMockedProjects,
  mockTargetAndReferenceProject,
} from '../../test-helpers/mock-project-helpers.js';
import { _providenceModule } from '../../src/program/providence.js';
import { _cliHelpersModule } from '../../src/cli/cli-helpers.js';
import { toPosixPath } from '../../src/program/utils/to-posix-path.js';
import { memoizeConfig } from '../../src/program/utils/memoize.js';
import { getExtendDocsResults } from '../../src/cli/launch-providence-with-extend-docs.js';
import { AstService } from '../../src/index.js';
import { setupAnalyzerTest } from '../../test-helpers/setup-analyzer-test.js';

/**
 * @typedef {import('../../types/index.js').QueryResult} QueryResult
 */

const __dirname = pathLib.dirname(fileURLToPath(import.meta.url));

const { pathsArrayFromCs, pathsArrayFromCollectionName, appendProjectDependencyPaths } =
  _cliHelpersModule;

const externalCfgMock = {
  searchTargetCollections: {
    'lion-collection': [
      './providence-input-data/search-targets/example-project-a',
      './providence-input-data/search-targets/example-project-b',
      // ...etc
    ],
  },
  referenceCollections: {
    'lion-based-ui-collection': [
      './providence-input-data/references/lion-based-ui',
      './providence-input-data/references/lion-based-ui-labs',
    ],
  },
};

setupAnalyzerTest();

describe('CLI helpers', () => {
  const rootDir = toPosixPath(pathLib.resolve(__dirname, '../../'));

  describe('pathsArrayFromCs', () => {
    it('allows absolute paths', async () => {
      expect(pathsArrayFromCs('/mocked/path/example-project', rootDir)).to.eql([
        '/mocked/path/example-project',
      ]);
    });

    it('allows relative paths', async () => {
      expect(
        pathsArrayFromCs('./test-helpers/project-mocks/importing-target-project', rootDir),
      ).to.eql([`${rootDir}/test-helpers/project-mocks/importing-target-project`]);
      expect(
        pathsArrayFromCs('test-helpers/project-mocks/importing-target-project', rootDir),
      ).to.eql([`${rootDir}/test-helpers/project-mocks/importing-target-project`]);
    });

    it('allows globs', async () => {
      expect(pathsArrayFromCs('test-helpers/project-mocks*', rootDir)).to.eql([
        `${rootDir}/test-helpers/project-mocks`,
        `${rootDir}/test-helpers/project-mocks-analyzer-outputs`,
      ]);
    });

    it('allows multiple comma separated paths', async () => {
      const paths =
        'test-helpers/project-mocks*, ./test-helpers/project-mocks/importing-target-project,/mocked/path/example-project';
      expect(pathsArrayFromCs(paths, rootDir)).to.eql([
        `${rootDir}/test-helpers/project-mocks`,
        `${rootDir}/test-helpers/project-mocks-analyzer-outputs`,
        `${rootDir}/test-helpers/project-mocks/importing-target-project`,
        '/mocked/path/example-project',
      ]);
    });
  });

  describe('pathsArrayFromCollectionName', () => {
    it('gets collections from external target config', async () => {
      expect(
        pathsArrayFromCollectionName('lion-collection', 'search-target', externalCfgMock, rootDir),
      ).to.eql(
        externalCfgMock.searchTargetCollections['lion-collection'].map(p =>
          toPosixPath(pathLib.join(rootDir, p)),
        ),
      );
    });

    it('gets collections from external reference config', async () => {
      expect(
        pathsArrayFromCollectionName(
          'lion-based-ui-collection',
          'reference',
          externalCfgMock,
          rootDir,
        ),
      ).to.eql(
        externalCfgMock.referenceCollections['lion-based-ui-collection'].map(p =>
          toPosixPath(pathLib.join(rootDir, p)),
        ),
      );
    });
  });

  describe('appendProjectDependencyPaths', () => {
    beforeEach(() => {
      mockProject(
        {
          './src/OriginalComp.js': `export class OriginalComp {}`,
          './src/inbetween.js': `export { OriginalComp as InBetweenComp } from './OriginalComp.js'`,
          './index.js': `export { InBetweenComp as MyComp } from './src/inbetween.js'`,
          './node_modules/dependency-a/index.js': '',
          './bower_components/dependency-b/index.js': '',
          './node_modules/my-dependency/index.js': '',
        },
        {
          projectName: 'example-project',
          projectPath: '/mocked/path/example-project',
        },
      );
    });

    it('adds bower and node dependencies', async () => {
      const result = await appendProjectDependencyPaths(['/mocked/path/example-project']);
      expect(result).to.eql([
        '/mocked/path/example-project/node_modules/dependency-a',
        '/mocked/path/example-project/node_modules/my-dependency',
        '/mocked/path/example-project/bower_components/dependency-b',
        '/mocked/path/example-project',
      ]);
    });

    it('allows a regex filter', async () => {
      const result = await appendProjectDependencyPaths(
        ['/mocked/path/example-project'],
        '/^dependency-/',
      );
      expect(result).to.eql([
        '/mocked/path/example-project/node_modules/dependency-a',
        // in windows, it should not add '/mocked/path/example-project/node_modules/my-dependency',
        '/mocked/path/example-project/bower_components/dependency-b',
        '/mocked/path/example-project',
      ]);

      const result2 = await appendProjectDependencyPaths(['/mocked/path/example-project'], '/b$/');
      expect(result2).to.eql([
        '/mocked/path/example-project/bower_components/dependency-b',
        '/mocked/path/example-project',
      ]);
    });

    it('allows to filter out only npm or bower deps', async () => {
      const result = await appendProjectDependencyPaths(
        ['/mocked/path/example-project'],
        undefined,
        ['npm'],
      );
      expect(result).to.eql([
        '/mocked/path/example-project/node_modules/dependency-a',
        '/mocked/path/example-project/node_modules/my-dependency',
        '/mocked/path/example-project',
      ]);

      const result2 = await appendProjectDependencyPaths(
        ['/mocked/path/example-project'],
        undefined,
        ['bower'],
      );
      expect(result2).to.eql([
        '/mocked/path/example-project/bower_components/dependency-b',
        '/mocked/path/example-project',
      ]);
    });
  });

  describe('Extend docs', () => {
    afterEach(() => {
      restoreMockedProjects();
    });

    it('rewrites monorepo package paths when analysis is run from monorepo root', async () => {
      // This fails after InputDataService.addAstToProjectsData is memoized
      // (it does pass when run in isolation however, as a quick fix we disable memoization cache here...)
      memoizeConfig.isCacheDisabled = true;
      // Since we use the print method here, we need to force Babel, bc swc-to-babel output is not compatible
      // with @babel/generate
      const initialAstServiceFallbackToBabel = AstService.fallbackToBabel;
      AstService.fallbackToBabel = true;

      const theirProjectFiles = {
        './package.json': JSON.stringify({
          name: 'their-components',
          version: '1.0.0',
        }),
        './src/TheirButton.js': `export class TheirButton extends HTMLElement {}`,
        './src/TheirTooltip.js': `export class TheirTooltip extends HTMLElement {}`,
        './their-button.js': `
            import { TheirButton } from './src/TheirButton.js';

            customElements.define('their-button', TheirButton);
          `,
        './demo.js': `
          import { TheirTooltip } from './src/TheirTooltip.js';
          import './their-button.js';
        `,
      };

      const myProjectFiles = {
        './package.json': JSON.stringify({
          name: '@my/root',
          workspaces: ['packages/*', 'another-folder/my-tooltip'],
          dependencies: {
            'their-components': '1.0.0',
          },
        }),
        // Package 1: @my/button
        './packages/button/package.json': JSON.stringify({
          name: '@my/button',
        }),
        './packages/button/src/MyButton.js': `
            import { TheirButton } from 'their-components/src/TheirButton.js';

            export class MyButton extends TheirButton {}
            `,
        './packages/button/src/my-button.js': `
          import { MyButton } from './MyButton.js';

          customElements.define('my-button', MyButton);
        `,

        // Package 2: @my/tooltip
        './packages/tooltip/package.json': JSON.stringify({
          name: '@my/tooltip',
        }),
        './packages/tooltip/src/MyTooltip.js': `
          import { TheirTooltip } from 'their-components/src/TheirTooltip.js';

          export class MyTooltip extends TheirTooltip {}
          `,
      };

      const theirProject = {
        path: '/my-components/node_modules/their-components',
        name: 'their-components',
        files: Object.entries(theirProjectFiles).map(([file, code]) => ({ file, code })),
      };

      const myProject = {
        path: '/my-components',
        name: 'my-components',
        files: Object.entries(myProjectFiles).map(([file, code]) => ({ file, code })),
      };

      mockTargetAndReferenceProject(theirProject, myProject);

      const result = await getExtendDocsResults({
        referenceProjectPaths: [theirProject.path],
        prefixCfg: { from: 'their', to: 'my' },
        extensions: ['.js'],
        cwd: '/my-components',
      });

      expect(result).to.eql([
        {
          name: 'TheirButton',
          variable: {
            from: 'TheirButton',
            to: 'MyButton',
            paths: [
              {
                from: './src/TheirButton.js',
                to: '@my/button/src/MyButton.js', // rewritten from './packages/button/src/MyButton.js',
              },
              {
                from: 'their-components/src/TheirButton.js',
                to: '@my/button/src/MyButton.js', // rewritten from './packages/button/src/MyButton.js',
              },
            ],
          },
          tag: {
            from: 'their-button',
            to: 'my-button',
            paths: [
              {
                from: './their-button.js',
                to: '@my/button/src/my-button.js', // rewritten from './packages/button/src/MyButton.js',
              },
              {
                from: 'their-components/their-button.js',
                to: '@my/button/src/my-button.js', // rewritten from './packages/button/src/MyButton.js',
              },
            ],
          },
        },
        {
          name: 'TheirTooltip',
          variable: {
            from: 'TheirTooltip',
            to: 'MyTooltip',
            paths: [
              {
                from: './src/TheirTooltip.js',
                to: '@my/tooltip/src/MyTooltip.js', // './packages/tooltip/src/MyTooltip.js',
              },
              {
                from: 'their-components/src/TheirTooltip.js',
                to: '@my/tooltip/src/MyTooltip.js', // './packages/tooltip/src/MyTooltip.js',
              },
            ],
          },
        },
      ]);

      AstService.fallbackToBabel = initialAstServiceFallbackToBabel;
    });

    it('does not check for match compatibility (target and reference) in monorepo targets', async () => {
      // ===== REFERENCE AND TARGET PROJECTS =====

      const theirProjectFiles = {
        './package.json': JSON.stringify({
          name: 'their-components',
          version: '1.0.0',
        }),
        './src/TheirButton.js': `export class TheirButton extends HTMLElement {}`,
      };

      // This will be detected as being a monorepo
      const monoProjectFiles = {
        './package.json': JSON.stringify({
          name: '@mono/root',
          workspaces: ['packages/*'],
          dependencies: {
            'their-components': '1.0.0',
          },
        }),
        // Package: @mono/button
        './packages/button/package.json': JSON.stringify({
          name: '@mono/button',
        }),
      };

      // This will be detected as NOT being a monorepo
      const nonMonoProjectFiles = {
        './package.json': JSON.stringify({
          name: 'non-mono',
          dependencies: {
            'their-components': '1.0.0',
          },
        }),
      };

      const theirProject = {
        path: '/their-components',
        name: 'their-components',
        files: Object.entries(theirProjectFiles).map(([file, code]) => ({ file, code })),
      };

      const monoProject = {
        path: '/mono-components',
        name: 'mono-components',
        files: Object.entries(monoProjectFiles).map(([file, code]) => ({ file, code })),
      };

      const nonMonoProject = {
        path: '/non-mono-components',
        name: 'non-mono-components',
        files: Object.entries(nonMonoProjectFiles).map(([file, code]) => ({ file, code })),
      };

      // ===== TESTS =====

      const providenceStub = sinon.stub(_providenceModule, 'providence').returns(
        new Promise(resolve => {
          resolve([]);
        }),
      );

      // ===== mono =====

      mockTargetAndReferenceProject(theirProject, monoProject);
      await getExtendDocsResults({
        referenceProjectPaths: ['/their-components'],
        prefixCfg: { from: 'their', to: 'my' },
        extensions: ['.js'],
        cwd: '/mono-components',
      });

      expect(providenceStub.args[0][1].skipCheckMatchCompatibility).to.equal(true);
      providenceStub.resetHistory();
      restoreMockedProjects();

      // ===== non mono =====

      mockTargetAndReferenceProject(theirProject, nonMonoProject);
      await getExtendDocsResults({
        referenceProjectPaths: ['/their-components'],
        prefixCfg: { from: 'their', to: 'my' },
        extensions: ['.js'],
        cwd: '/non-mono-components',
      });
      expect(providenceStub.args[0][1].skipCheckMatchCompatibility).to.equal(false);

      providenceStub.restore();
    });
  });
});
