const sinon = require('sinon');
const pathLib = require('path');
const { expect } = require('chai');
const {
  mockProject,
  restoreMockedProjects,
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
const extendDocsModule = require('../../src/cli/generate-extend-docs-data.js');
const cliHelpersModule = require('../../src/cli/cli-helpers.js');
const { cli } = require('../../src/cli/cli.js');
const promptAnalyzerModule = require('../../src/cli/prompt-analyzer-menu.js');

const {
  pathsArrayFromCs,
  pathsArrayFromCollectionName,
  appendProjectDependencyPaths,
} = cliHelpersModule;

const queryResults = [];
const rootDir = pathLib.resolve(__dirname, '../../');

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
  process.argv = [...process.argv.slice(0, 2), ...args.split(' ')];
  await cli({ cwd });
}

describe('Providence CLI', () => {
  let providenceStub;
  let promptCfgStub;
  let iExtConfStub;
  let promptStub;
  let qConfStub;

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

    it('"-w --whitelist"', async () => {
      await runCli(`${analyzeCmd} -w /mocked/path/example-project`, rootDir);
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].gatherFilesConfig.filter).to.eql([
        '/mocked/path/example-project',
      ]);

      pathsArrayFromCsStub.resetHistory();
      providenceStub.resetHistory();

      await runCli(`${analyzeCmd} --whitelist /mocked/path/example-project`, rootDir);
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].gatherFilesConfig.filter).to.eql([
        '/mocked/path/example-project',
      ]);
    });

    it('"--whitelist-reference"', async () => {
      await runCli(`${analyzeCmd} --whitelist-reference /mocked/path/example-project`, rootDir);
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].gatherFilesConfigReference.filter).to.eql([
        '/mocked/path/example-project',
      ]);
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

    it('--include-target-deps"', async () => {
      await runCli(`${analyzeCmd}`, rootDir);
      expect(appendProjectDependencyPathsStub.called).to.be.false;

      appendProjectDependencyPathsStub.resetHistory();
      providenceStub.resetHistory();

      await runCli(`${analyzeCmd} --include-target-deps`, rootDir);
      expect(appendProjectDependencyPathsStub.called).to.be.true;
      expect(providenceStub.args[0][1].targetProjectPaths).to.eql([
        '/mocked/path/example-project',
        '/mocked/path/example-project/node_modules/mock-dep-a',
        '/mocked/path/example-project/bower_components/mock-dep-b',
      ]);
    });

    it('--target-deps-filter"', async () => {
      await runCli(`${analyzeCmd} --include-target-deps --target-deps-filter ^mock-`, rootDir);
      expect(appendProjectDependencyPathsStub.args[0][1]).to.equal('^mock-');
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
            '--whitelist wl --whitelist-reference wlr',
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
          whitelist: [`${rootDir}/wl`],
          whitelistReference: [`${rootDir}/wlr`],
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
          pathLib.join(rootDir, p),
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
          pathLib.join(rootDir, p),
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
      const result = await appendProjectDependencyPaths(['/mocked/path/example-project'], 'b$');
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
});
