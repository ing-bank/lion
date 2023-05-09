/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-extraneous-dependencies */
import sinon from 'sinon';
import { expect } from 'chai';
import { it } from 'mocha';
import commander from 'commander';
import { mockProject } from '../../test-helpers/mock-project-helpers.js';
import { InputDataService } from '../../src/program/core/InputDataService.js';
import { QueryService } from '../../src/program/core/QueryService.js';
import { _providenceModule } from '../../src/program/providence.js';
import { _cliHelpersModule } from '../../src/cli/cli-helpers.js';
import { cli } from '../../src/cli/cli.js';
import { _promptAnalyzerMenuModule } from '../../src/cli/prompt-analyzer-menu.js';
import { memoizeConfig } from '../../src/program/utils/memoize.js';
import { _extendDocsModule } from '../../src/cli/launch-providence-with-extend-docs.js';
import { dashboardServer } from '../../src/dashboard/server.js';
import { setupAnalyzerTest } from '../../test-helpers/setup-analyzer-test.js';

/**
 * @typedef {import('../../types/index.js').QueryResult} QueryResult
 */

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

/**
 * @param {string} args
 * @param {string} cwd
 */
async function runCli(args, cwd) {
  const argv = [
    ...process.argv.slice(0, 2),
    ...args.split(' ').map(a => a.replace(/^("|')?(.*)("|')?$/, '$2')),
  ];
  await cli({ argv, cwd });
}

describe('Providence CLI', () => {
  const rootDir = '/mocked/path/example-project';

  /** @type {sinon.SinonStub} */
  let providenceStub;
  /** @type {sinon.SinonStub} */
  let promptCfgStub;
  /** @type {sinon.SinonStub} */
  let iExtConfStub;
  /** @type {sinon.SinonStub} */
  let promptStub;
  /** @type {sinon.SinonStub} */
  let qConfStub;

  before(() => {
    // Prevent MaxListenersExceededWarning
    commander.setMaxListeners(100);

    /** @type {sinon.SinonStub} */
    providenceStub = sinon.stub(_providenceModule, 'providence').returns(Promise.resolve());

    /** @type {sinon.SinonStub} */
    promptCfgStub = sinon
      .stub(_promptAnalyzerMenuModule, 'promptAnalyzerConfigMenu')
      .returns(Promise.resolve({ analyzerConfig: { con: 'fig' } }));

    /** @type {sinon.SinonStub} */
    iExtConfStub = sinon.stub(InputDataService, 'getExternalConfig').returns(externalCfgMock);

    /** @type {sinon.SinonStub} */
    promptStub = sinon
      .stub(_promptAnalyzerMenuModule, 'promptAnalyzerMenu')
      .returns(Promise.resolve({ analyzerName: 'match-analyzer-mock' }));

    /** @type {sinon.SinonStub} */
    qConfStub = sinon.stub(QueryService, 'getQueryConfigFromAnalyzer').returns(
      // @ts-expect-error
      Promise.resolve({
        analyzer: {
          name: 'match-analyzer-mock',
          requiresReference: true,
        },
      }),
    );
  });

  after(() => {
    commander.setMaxListeners(10);

    providenceStub.restore();
    promptCfgStub.restore();
    iExtConfStub.restore();
    promptStub.restore();
    qConfStub.restore();
  });

  beforeEach(() => {
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
    memoizeConfig.isCacheDisabled = true;
  });

  afterEach(() => {
    providenceStub.resetHistory();
    promptCfgStub.resetHistory();
    iExtConfStub.resetHistory();
    promptStub.resetHistory();
    qConfStub.resetHistory();
  });

  const analyzeCmd = 'analyze match-analyzer-mock';

  it('calls providence', async () => {
    await runCli(`${analyzeCmd} -t /mocked/path/example-project`, rootDir);
    expect(providenceStub.called).to.be.true;
  });

  it('creates a QueryConfig', async () => {
    await runCli(`${analyzeCmd} -t /mocked/path/example-project`, rootDir);
    expect(qConfStub.called).to.be.true;
    expect(qConfStub.args[0][0]).to.equal('match-analyzer-mock');
  });

  describe('Global options', () => {
    const anyCmdThatAcceptsGlobalOpts = 'analyze match-analyzer-mock';

    /** @type {sinon.SinonStub} */
    let pathsArrayFromCollectionStub;
    /** @type {sinon.SinonStub} */
    let pathsArrayFromCsStub;
    /** @type {sinon.SinonStub} */
    let appendProjectDependencyPathsStub;

    before(() => {
      pathsArrayFromCsStub = sinon
        .stub(_cliHelpersModule, 'pathsArrayFromCs')
        .returns(['/mocked/path/example-project']);
      pathsArrayFromCollectionStub = sinon
        .stub(_cliHelpersModule, 'pathsArrayFromCollectionName')
        .returns(['/mocked/path/example-project']);
      appendProjectDependencyPathsStub = sinon
        .stub(_cliHelpersModule, 'appendProjectDependencyPaths')
        .returns(
          Promise.resolve([
            '/mocked/path/example-project',
            '/mocked/path/example-project/node_modules/mock-dep-a',
            '/mocked/path/example-project/bower_components/mock-dep-b',
          ]),
        );
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
      await runCli(`${anyCmdThatAcceptsGlobalOpts} -e bla,blu`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfig.extensions).to.eql(['.bla', '.blu']);

      providenceStub.resetHistory();

      await runCli(`${anyCmdThatAcceptsGlobalOpts} --extensions bla,blu`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfig.extensions).to.eql(['.bla', '.blu']);
    });

    it('"-t --search-target-paths"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} -t /mocked/path/example-project`, rootDir);
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].targetProjectPaths).to.eql(['/mocked/path/example-project']);

      pathsArrayFromCsStub.resetHistory();
      providenceStub.resetHistory();

      await runCli(
        `${anyCmdThatAcceptsGlobalOpts} --search-target-paths /mocked/path/example-project`,
        rootDir,
      );
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].targetProjectPaths).to.eql(['/mocked/path/example-project']);
    });

    it('"-r --reference-paths"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} -r /mocked/path/example-project`, rootDir);
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].referenceProjectPaths).to.eql([
        '/mocked/path/example-project',
      ]);

      pathsArrayFromCsStub.resetHistory();
      providenceStub.resetHistory();

      await runCli(
        `${anyCmdThatAcceptsGlobalOpts} --reference-paths /mocked/path/example-project`,
        rootDir,
      );
      expect(pathsArrayFromCsStub.args[0][0]).to.equal('/mocked/path/example-project');
      expect(providenceStub.args[0][1].referenceProjectPaths).to.eql([
        '/mocked/path/example-project',
      ]);
    });

    it('"--search-target-collection"', async () => {
      await runCli(
        `${anyCmdThatAcceptsGlobalOpts} --search-target-collection lion-collection`,
        rootDir,
      );
      expect(pathsArrayFromCollectionStub.args[0][0]).to.equal('lion-collection');
      expect(providenceStub.args[0][1].targetProjectPaths).to.eql(['/mocked/path/example-project']);
    });

    it('"--reference-collection"', async () => {
      await runCli(
        `${anyCmdThatAcceptsGlobalOpts} --reference-collection lion-based-ui-collection`,
        rootDir,
      );
      expect(pathsArrayFromCollectionStub.args[0][0]).to.equal('lion-based-ui-collection');
      expect(providenceStub.args[0][1].referenceProjectPaths).to.eql([
        '/mocked/path/example-project',
      ]);
    });

    it('"-a --allowlist"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} -a mocked/**/*,rocked/*`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfig.allowlist).to.eql([
        'mocked/**/*',
        'rocked/*',
      ]);

      providenceStub.resetHistory();

      await runCli(`${anyCmdThatAcceptsGlobalOpts} --allowlist mocked/**/*,rocked/*`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfig.allowlist).to.eql([
        'mocked/**/*',
        'rocked/*',
      ]);
    });

    it('"--allowlist-reference"', async () => {
      await runCli(
        `${anyCmdThatAcceptsGlobalOpts} --allowlist-reference mocked/**/*,rocked/*`,
        rootDir,
      );
      expect(providenceStub.args[0][1].gatherFilesConfigReference.allowlist).to.eql([
        'mocked/**/*',
        'rocked/*',
      ]);
    });

    it('"--allowlist-mode"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} --allowlist-mode git`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfig.allowlistMode).to.equal('git');
    });

    it('"--allowlist-mode-reference"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} --allowlist-mode-reference npm`, rootDir);
      expect(providenceStub.args[0][1].gatherFilesConfigReference.allowlistMode).to.equal('npm');
    });

    it('"-D --debug"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} -D`, rootDir);
      expect(providenceStub.args[0][1].debugEnabled).to.equal(true);

      providenceStub.resetHistory();

      await runCli(`${anyCmdThatAcceptsGlobalOpts} --debug`, rootDir);
      expect(providenceStub.args[0][1].debugEnabled).to.equal(true);
    });

    it('"--write-log-file"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} --write-log-file`, rootDir);
      expect(providenceStub.args[0][1].writeLogFile).to.equal(true);
    });

    it('"--target-dependencies"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts}`, rootDir);
      expect(appendProjectDependencyPathsStub.called).to.be.false;

      appendProjectDependencyPathsStub.resetHistory();
      providenceStub.resetHistory();

      await runCli(`${anyCmdThatAcceptsGlobalOpts} --target-dependencies`, rootDir);
      expect(appendProjectDependencyPathsStub.called).to.be.true;
      expect(providenceStub.args[0][1].targetProjectPaths).to.eql([
        '/mocked/path/example-project',
        '/mocked/path/example-project/node_modules/mock-dep-a',
        '/mocked/path/example-project/bower_components/mock-dep-b',
      ]);
    });

    it('"--target-dependencies /^with-regex/"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} --target-dependencies /^mock-/`, rootDir);
      expect(appendProjectDependencyPathsStub.args[0][1]).to.equal('/^mock-/');
    });

    it('"--skip-check-match-compatibility"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} --skip-check-match-compatibility`, rootDir);
      expect(providenceStub.args[0][1].skipCheckMatchCompatibility).to.equal(true);
    });

    it('"--fallback-to-babel"', async () => {
      await runCli(`${anyCmdThatAcceptsGlobalOpts} --fallback-to-babel`, rootDir);
      expect(providenceStub.args[0][1].fallbackToBabel).to.equal(true);
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
          await runCli(`analyze match-analyzer-mock -c {"a":"2"}`, rootDir);
          expect(qConfStub.args[0][0]).to.equal('match-analyzer-mock');
          expect(qConfStub.args[0][1]).to.eql({ a: '2', metaConfig: {} });

          qConfStub.resetHistory();

          await runCli(`analyze match-analyzer-mock --config {"a":"2"}`, rootDir);
          expect(qConfStub.args[0][0]).to.equal('match-analyzer-mock');
          expect(qConfStub.args[0][1]).to.eql({ a: '2', metaConfig: {} });
        });

        it('calls "promptAnalyzerConfigMenu" without config given', async () => {
          await runCli(`analyze match-analyzer-mock`, rootDir);
          expect(promptCfgStub.called).to.be.true;
        });
      });
    });

    describe.skip('Query', () => {});
    describe.skip('Search', () => {});

    describe('Manage', () => {});

    describe('Dashboard', () => {
      /** @type {sinon.SinonStub} */
      const startStub = sinon.stub(dashboardServer, 'start');
      it('spawns a dashboard', async () => {
        runCli(`dashboard`, rootDir);
        expect(startStub.called).to.be.true;
      });
    });

    describe('Extend docs', () => {
      /** @type {sinon.SinonStub} */
      let extendDocsStub;

      before(() => {
        extendDocsStub = sinon
          .stub(_extendDocsModule, 'launchProvidenceWithExtendDocs')
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
          cwd: '/mocked/path/example-project',
          skipCheckMatchCompatibility: true,
        });
      });
    });
  });
});
