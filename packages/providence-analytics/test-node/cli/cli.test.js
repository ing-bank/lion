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

const { QueryService } = require('../../src/program/services/QueryService.js');

const providenceModule = require('../../src/program/providence.js');
const extendDocsModule = require('../../src/cli/generate-extend-docs-data.js');

const dummyAnalyzer = require('../../test-helpers/templates/analyzer-template.js');
const { cli } = require('../../src/cli/cli.js');
const { pathsArrayFromCs } = require('../../src/cli/cli-helpers.js');

const queryResults = [];
const rootDir = pathLib.resolve(__dirname, '../../');

describe('Providence CLI', () => {
  before(() => {
    suppressNonCriticalLogs();
    mockWriteToJson(queryResults);

    mockProject(
      {
        './src/OriginalComp.js': `export class OriginalComp {}`,
        './src/inbetween.js': `export { OriginalComp as InBetweenComp } from './OriginalComp.js'`,
        './index.js': `export { InBetweenComp as MyComp } from './src/inbetween.js'`,
      },
      {
        projectName: 'example-project',
        projectPath: '/mocked/path/example-project',
      },
    );
  });

  after(() => {
    restoreSuppressNonCriticalLogs();
    restoreWriteToJson();
    restoreMockedProjects();
  });

  let providenceStub;
  let qConfStub;
  beforeEach(() => {
    qConfStub = sinon.stub(QueryService, 'getQueryConfigFromAnalyzer').returns({ analyzer: {} });
    providenceStub = sinon.stub(providenceModule, 'providence');
  });

  afterEach(() => {
    providenceStub.restore();
    qConfStub.restore();
  });

  async function runCli(args, cwd) {
    process.argv = [...process.argv.slice(0, 2), ...args.split(' ')];
    await cli({ cwd, addProjectDependencyPaths: false });
  }

  const analyzCmd = 'analyze find-exports';

  it('creates a QueryConfig', async () => {
    await runCli('analyze find-exports -t /mocked/path/example-project');
    expect(qConfStub.called).to.be.true;
    expect(qConfStub.args[0][0]).to.equal('find-exports');
  });

  it('calls providence', async () => {
    await runCli(`${analyzCmd} -t /mocked/path/example-project`);
    expect(providenceStub.called).to.be.true;
  });

  describe('Global options', () => {
    it('"-e --extensions"', async () => {
      await runCli(`${analyzCmd} --extensions bla,blu`);
      expect(providenceStub.args[0][1].gatherFilesConfig.extensions).to.eql(['.bla', '.blu']);
    });

    describe('"-t", "--search-target-paths"', async () => {
      it('allows absolute paths', async () => {
        await runCli(`${analyzCmd} -t /mocked/path/example-project`, rootDir);
        expect(providenceStub.args[0][1].targetProjectPaths).to.eql([
          '/mocked/path/example-project',
        ]);
      });

      it('allows relative paths', async () => {
        await runCli(
          `${analyzCmd} -t ./test-helpers/project-mocks/importing-target-project`,
          rootDir,
        );
        expect(providenceStub.args[0][1].targetProjectPaths).to.eql([
          `${rootDir}/test-helpers/project-mocks/importing-target-project`,
        ]);

        await runCli(
          `${analyzCmd} -t test-helpers/project-mocks/importing-target-project`,
          rootDir,
        );
        expect(providenceStub.args[0][1].targetProjectPaths).to.eql([
          `${rootDir}/test-helpers/project-mocks/importing-target-project`,
        ]);
      });

      // TODO: globbing via cli-helpers doesn't work for some reason when run in this test
      it.skip('allows globs', async () => {
        await runCli(`${analyzCmd} -t test-helpers/*`, rootDir);
        expect(providenceStub.args[0][1].targetProjectPaths).to.eql([
          `${process.cwd()}/needed-for-test/pass-glob`,
        ]);
      });
    });

    it('"-r", "--reference-paths"', async () => {});
    it('"--search-target-collection"', async () => {});
    it('"--reference-collection"', async () => {});

    it.skip('"-R --verbose-report"', async () => {});
    it.skip('"-D", "--debug"', async () => {});
  });

  describe('Commands', () => {
    describe('Analyze', () => {
      it('calls providence', async () => {
        expect(typeof dummyAnalyzer.name).to.equal('string');
      });
      describe('Options', () => {
        it('"-o", "--prompt-optional-config"', async () => {});
        it('"-c", "--config"', async () => {});
      });
    });
    describe('Query', () => {});
    describe('Search', () => {});
    describe('Manage', () => {});
    describe('Extend docs', () => {
      let extendDocsStub;
      beforeEach(() => {
        extendDocsStub = sinon.stub(extendDocsModule, 'launchProvidenceWithExtendDocs').returns(
          new Promise(resolve => {
            resolve();
          }),
        );
      });

      afterEach(() => {
        extendDocsStub.restore();
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
          extensions: ['/xyz/x'],
          whitelist: [`${process.cwd()}/wl`],
          whitelistReference: [`${process.cwd()}/wlr`],
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
        `${process.cwd()}/test-helpers/project-mocks`,
        `${process.cwd()}/test-helpers/project-mocks-analyzer-outputs`,
      ]);
    });
  });
});
