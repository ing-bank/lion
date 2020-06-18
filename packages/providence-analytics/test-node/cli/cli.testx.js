const sinon = require('sinon');
const pathLib = require('path');
const { expect } = require('chai');
const {
  mockProject,
  // restoreMockedProjects,
} = require('../../test-helpers/mock-project-helpers.js');
const {
  mockWriteToJson,
  restoreWriteToJson,
} = require('../../test-helpers/mock-report-service-helpers.js');
const {
  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
} = require('../../test-helpers/mock-log-service-helpers.js');

const { spawnProcess } = require('../../src/cli/cli-helpers.js');
const { QueryService } = require('../../src/program/services/QueryService.js');
const providenceModule = require('../../src/program/providence.js');
const dummyAnalyzer = require('../../test-helpers/templates/analyzer-template.js');

const queryResults = [];

describe('Providence CLI', () => {
  before(() => {
    suppressNonCriticalLogs();
    mockWriteToJson(queryResults);
  });

  after(() => {
    restoreSuppressNonCriticalLogs();
    restoreWriteToJson();
  });

  mockProject(
    {
      './src/OriginalComp.js': `export class OriginalComp {}`,
      './src/inbetween.js': `export { OriginalComp as InBetweenComp } from './OriginalComp.js'`,
      './index.js': `export { InBetweenComp as MyComp } from './src/inbetween.js'`,
    },
    {
      project: 'example-project',
      path: '/mocked/path',
    },
  );

  const rootDir = pathLib.resolve(__dirname, '../../');
  async function cli(args) {
    return spawnProcess(`node ./src/cli/index.js ${args}`, { cwd: rootDir });
  }

  async function cliAnalyze(args) {
    return spawnProcess(`node ./src/cli/index.js analyze find-exports ${args}`, { cwd: rootDir });
  }

  it('creates a QueryConfig', async () => {
    const stub = sinon.stub(QueryService, 'getQueryConfigFromAnalyzer');
    await cliAnalyze('-t "/mocked/path/example-project"');
    expect(stub.args[0]).to.equal('find-exports');
  });

  it('calls providence', async () => {
    const providenceStub = sinon.stub(providenceModule, 'providence');
    await cliAnalyze('-t "/mocked/path/example-project"');
    expect(providenceStub).to.have.been.called;
  });

  describe('Global options', () => {
    it('"-e --extensions"', async () => {
      const providenceStub = sinon.stub(providenceModule, 'providence');
      await cli('--extensions  ".bla, .blu"');
      expect(providenceStub.args[1].gatherFilesConfig.extensions).to.eql(['bla', 'blu']);
    });

    it('"-t", "--search-target-paths"', async () => {});
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
  });
});
