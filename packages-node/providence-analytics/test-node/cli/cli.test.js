const sinon = require('sinon');
const pathLib = require('path');
const { expect } = require('chai');
const commander = require('commander');
const {
  mockProject,
  restoreMockedProjects,
  mockTargetAndReferenceProject,
} = require('../../test-helpers/mock-project-helpers.js');
const {
  mockWriteToJson,
  restoreWriteToJson,
} = require('../../test-helpers/mock-report-service-helpers.js');
const {
  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
} = require('../../test-helpers/mock-log-service-helpers.js');
const { InputDataService } = require('../../src/program/services/InputDataService.js');
const { QueryService } = require('../../src/program/services/QueryService.js');
const providenceModule = require('../../src/program/providence.js');
const extendDocsModule = require('../../src/cli/launch-providence-with-extend-docs.js');
const cliHelpersModule = require('../../src/cli/cli-helpers.js');
const { cli } = require('../../src/cli/cli.js');
const promptAnalyzerModule = require('../../src/cli/prompt-analyzer-menu.js');
const { toPosixPath } = require('../../src/program/utils/to-posix-path.js');
const { getExtendDocsResults } = require('../../src/cli/launch-providence-with-extend-docs.js');

const {
  pathsArrayFromCs,
  pathsArrayFromCollectionName,
  appendProjectDependencyPaths,
} = cliHelpersModule;

const queryResults = [];

const rootDir = toPosixPath(pathLib.resolve(__dirname, '../../'));

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

async function runCli(args, cwd) {
  process.argv = [
    ...process.argv.slice(0, 2),
    ...args.split(' ').map(a => a.replace(/^("|')?(.*)("|')?$/, '$2')),
  ];
  await cli({ cwd });
}

describe('Providence CLI', () => {
  let providenceStub;
  let promptCfgStub;
  let iExtConfStub;
  let promptStub;
  let qConfStub;

  before(() => {
    // Prevent MaxListenersExceededWarning
    commander.setMaxListeners(100);

    mockWriteToJson(queryResults);
    suppressNonCriticalLogs();

    mockProject(
      {
        './src/OriginalComp.js': `export class OriginalComp {}`,
        './src/inbetween.js': `export { OriginalComp as InBetweenComp } from './OriginalComp.js'`,
        './index.js': `export { InBetweenComp as MyComp } from './src/inbetween.js'`,
        './node_modules/dependency-a/index.js': '',
        './bower_components/dependency-b/index.js': '',
      },
      {
        projectName: 'example-project',
        projectPath: '/mocked/path/example-project',
      },
    );

    providenceStub = sinon.stub(providenceModule, 'providence').returns(
      new Promise(resolve => {
        resolve();
      }),
    );

    promptCfgStub = sinon
      .stub(promptAnalyzerModule, 'promptAnalyzerConfigMenu')
      .returns({ analyzerConfig: { con: 'fig' } });

    iExtConfStub = sinon.stub(InputDataService, 'getExternalConfig').returns(externalCfgMock);

    promptStub = sinon
      .stub(promptAnalyzerModule, 'promptAnalyzerMenu')
      .returns({ analyzerName: 'mock-analyzer' });

    qConfStub = sinon.stub(QueryService, 'getQueryConfigFromAnalyzer').returns({
      analyzer: {
        name: 'mock-analyzer',
        requiresReference: true,
      },
    });
  });

  after(() => {
    commander.setMaxListeners(10);

    restoreSuppressNonCriticalLogs();
    restoreMockedProjects();
    restoreWriteToJson();

    providenceStub.restore();
    promptCfgStub.restore();
    iExtConfStub.restore();
    promptStub.restore();
    qConfStub.restore();
  });

  afterEach(() => {
    providenceStub.resetHistory();
    promptCfgStub.resetHistory();
    iExtConfStub.resetHistory();
    promptStub.resetHistory();
    qConfStub.resetHistory();
  });

  const analyzeCmd = 'analyze mock-analyzer';

  it('calls providence', async () => {
    await runCli(`${analyzeCmd} -t /mocked/path/example-project`);
    expect(providenceStub.called).to.be.true;
  });

  it('creates a QueryConfig', async () => {
    await runCli(`${analyzeCmd} -t /mocked/path/example-project`);
    expect(qConfStub.called).to.be.true;
    expect(qConfStub.args[0][0]).to.equal('mock-analyzer');
  });

  describe('Global options', () => {
    let pathsArrayFromCollectionStub;
    let pathsArrayFromCsStub;
    let appendProjectDependencyPathsStub;

    before(() => {
      pathsArrayFromCsStub = sinon
        .stub(cliHelpersModule, 'pathsArrayFromCs')
        .returns(['/mocked/path/example-project']);
      pathsArrayFromCollectionStub = sinon
        .stub(cliHelpersModule, 'pathsArrayFromCollectionName')
        .returns(['/mocked/path/example-project']);
      appendProjectDependencyPathsStub = sinon
        .stub(cliHelpersModule, 'appendProjectDependencyPaths')
        .returns([
          '/mocked/path/example-project',
          '/mocked/path/example-project/node_modules/mock-dep-a',
          '/mocked/path/example-project/bower_components/mock-dep-b',
        ]);
    });

    after(() => {
      pathsArrayFromCsStub.restore();
      pathsArrayFromCollectionStub.restore();
      appendProjectDependencyPathsStub.restore();
    });

    afterEach(() => {
      pathsArrayFromCsStub.resetHistory();
      pathsArrayFromCollectionStub.resetHistory();
      appendProjectDependencyPathsStub.resetHistory();
    });

    it('"-e --extensions"', async () => {
      await runCli(`${analyzeCmd} -e bla,blu`);
      expect(providenceStub.args[0][1].gatherFilesConfig.extensions).to.eql(['.bla', '.blu']);

      providenceStub.resetHistory();

      await runCli(`${analyzeCmd} --extensions bla,blu`);
      expect(providenceStub.args[0][1].gatherFilesConfig.extensions).to.eql(['.bla', '.blu']);
    });

    it('"-t --search-target-paths"', async () => {
      await runCli(`${analyzeCmd} -t /mocked/path/example-project`, rootDir);
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].targetProjectPaths).to.eql(['/mocked/path/example-project']);

      pathsArrayFromCsStub.resetHistory();
      providenceStub.resetHistory();

      await runCli(`${analyzeCmd} --search-target-paths /mocked/path/example-project`, rootDir);
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].targetProjectPaths).to.eql(['/mocked/path/example-project']);
    });

    it('"-r --reference-paths"', async () => {
      await runCli(`${analyzeCmd} -r /mocked/path/example-project`, rootDir);
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].referenceProjectPaths).to.eql([
        '/mocked/path/example-project',
      ]);

      pathsArrayFromCsStub.resetHistory();
      providenceStub.resetHistory();

      await runCli(`${analyzeCmd} --reference-paths /mocked/path/example-project`, rootDir);
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].referenceProjectPaths).to.eql([
        '/mocked/path/example-project',
      ]);
    });

    it('"--search-target-collection"', async () => {
      await runCli(`${analyzeCmd} --search-target-collection lion-collection`, rootDir);
      expect(pathsArrayFromCollectionStub.args[0][0]).to.equal('lion-collection');
      expect(providenceStub.args[0][1].targetProjectPaths).to.eql(['/mocked/path/example-project']);
    });

    it('"--reference-collection"', async () => {
      await runCli(`${analyzeCmd} --reference-collection lion-based-ui-collection`, rootDir);
      expect(pathsArrayFromCollectionStub.args[0][0]).to.equal('lion-based-ui-collection');
      expect(providenceStub.args[0][1].referenceProjectPaths).to.eql([
        '/mocked/path/example-project',
      ]);
    });

    it('"-a --allowlist"', async () => {
      await runCli(`${analyzeCmd} -a mocked/**/*,rocked/*`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfig.allowlist).to.eql([
        'mocked/**/*',
        'rocked/*',
      ]);

      providenceStub.resetHistory();

      await runCli(`${analyzeCmd} --allowlist mocked/**/*,rocked/*`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfig.allowlist).to.eql([
        'mocked/**/*',
        'rocked/*',
      ]);
    });

    it('"--allowlist-reference"', async () => {
      await runCli(`${analyzeCmd} --allowlist-reference mocked/**/*,rocked/*`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfigReference.allowlist).to.eql([
        'mocked/**/*',
        'rocked/*',
      ]);
    });

    it('--allowlist-mode', async () => {
      await runCli(`${analyzeCmd} --allowlist-mode git`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfig.allowlistMode).to.equal('git');
    });

    it('--allowlist-mode-reference', async () => {
      await runCli(`${analyzeCmd} --allowlist-mode-reference npm`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfigReference.allowlistMode).to.equal('npm');
    });

    it('"-D --debug"', async () => {
      await runCli(`${analyzeCmd} -D`, rootDir);
      expect(providenceStub.args[0][1].debugEnabled).to.equal(true);

      providenceStub.resetHistory();

      await runCli(`${analyzeCmd} --debug`, rootDir);
      expect(providenceStub.args[0][1].debugEnabled).to.equal(true);
    });

    it('--write-log-file"', async () => {
      await runCli(`${analyzeCmd} --write-log-file`, rootDir);
      expect(providenceStub.args[0][1].writeLogFile).to.equal(true);
    });

    it('--target-dependencies"', async () => {
      await runCli(`${analyzeCmd}`, rootDir);
      expect(appendProjectDependencyPathsStub.called).to.be.false;

      appendProjectDependencyPathsStub.resetHistory();
      providenceStub.resetHistory();

      await runCli(`${analyzeCmd} --target-dependencies`, rootDir);
      expect(appendProjectDependencyPathsStub.called).to.be.true;
      expect(providenceStub.args[0][1].targetProjectPaths).to.eql([
        '/mocked/path/example-project',
        '/mocked/path/example-project/node_modules/mock-dep-a',
        '/mocked/path/example-project/bower_components/mock-dep-b',
      ]);
    });

    it('--target-dependencies /^with-regex/"', async () => {
      await runCli(`${analyzeCmd} --target-dependencies /^mock-/`, rootDir);
      expect(appendProjectDependencyPathsStub.args[0][1]).to.equal('/^mock-/');
    });
  });

  describe('Commands', () => {
    describe('Analyze', () => {
      it('calls providence', async () => {
        await runCli(`${analyzeCmd}`, rootDir);
        expect(providenceStub.called).to.be.true;
      });

      describe('Options', () => {
        it('"-o --prompt-optional-config"', async () => {
          await runCli(`analyze -o`, rootDir);
          expect(promptStub.called).to.be.true;

          promptStub.resetHistory();

          await runCli(`analyze --prompt-optional-config`, rootDir);
          expect(promptStub.called).to.be.true;
        });

        it('"-c --config"', async () => {
          await runCli(`analyze mock-analyzer -c {"a":"2"}`, rootDir);
          expect(qConfStub.args[0][0]).to.equal('mock-analyzer');
          expect(qConfStub.args[0][1]).to.eql({ a: '2', metaConfig: undefined });

          qConfStub.resetHistory();

          await runCli(`analyze mock-analyzer --config {"a":"2"}`, rootDir);
          expect(qConfStub.args[0][0]).to.equal('mock-analyzer');
          expect(qConfStub.args[0][1]).to.eql({ a: '2', metaConfig: undefined });
        });

        it('calls "promptAnalyzerConfigMenu" without config given', async () => {
          await runCli(`analyze mock-analyzer`, rootDir);
          expect(promptCfgStub.called).to.be.true;
        });
      });
    });

    describe.skip('Query', () => {});
    describe.skip('Search', () => {});

    describe('Manage', () => {});

    describe('Extend docs', () => {
      let extendDocsStub;

      before(() => {
        extendDocsStub = sinon
          .stub(extendDocsModule, 'launchProvidenceWithExtendDocs')
          .returns(Promise.resolve());
      });

      after(() => {
        extendDocsStub.restore();
      });

      afterEach(() => {
        extendDocsStub.resetHistory();
      });

      it('allows configuration', async () => {
        await runCli(
          [
            'extend-docs',
            '-t /xyz',
            '-r /xyz/x',
            '--prefix-from pfrom --prefix-to pto',
            '--output-folder /outp',
            '--extensions bla',
            '--allowlist al --allowlist-reference alr',
          ].join(' '),
          rootDir,
        );
        expect(extendDocsStub.called).to.be.true;
        expect(extendDocsStub.args[0][0]).to.eql({
          referenceProjectPaths: ['/xyz/x'],
          prefixCfg: {
            from: 'pfrom',
            to: 'pto',
          },
          outputFolder: '/outp',
          extensions: ['.bla'],
          allowlist: ['al'],
          allowlistReference: ['alr'],
          cwd: undefined,
        });
      });
    });
  });
});

describe('CLI helpers', () => {
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
    before(() => {
      mockWriteToJson(queryResults);
      suppressNonCriticalLogs();

      mockProject(
        {
          './src/OriginalComp.js': `export class OriginalComp {}`,
          './src/inbetween.js': `export { OriginalComp as InBetweenComp } from './OriginalComp.js'`,
          './index.js': `export { InBetweenComp as MyComp } from './src/inbetween.js'`,
          './node_modules/dependency-a/index.js': '',
          './bower_components/dependency-b/index.js': '',
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
        '/mocked/path/example-project/bower_components/dependency-b',
        '/mocked/path/example-project',
      ]);
    });

    it('allows a regex filter', async () => {
      const result = await appendProjectDependencyPaths(['/mocked/path/example-project'], '/b$/');
      expect(result).to.eql([
        '/mocked/path/example-project/bower_components/dependency-b',
        '/mocked/path/example-project',
      ]);
    });

    it('allows to filter out only npm or bower deps', async () => {
      const result = await appendProjectDependencyPaths(['/mocked/path/example-project'], null, [
        'npm',
      ]);
      expect(result).to.eql([
        '/mocked/path/example-project/node_modules/dependency-a',
        '/mocked/path/example-project',
      ]);

      const result2 = await appendProjectDependencyPaths(['/mocked/path/example-project'], null, [
        'bower',
      ]);
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
        path: '/their-components',
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
        referenceProjectPaths: ['/their-components'],
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

      const providenceStub = sinon.stub(providenceModule, 'providence').returns(
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
