const { expect } = require('chai');
const pathLib = require('path');
const { InputDataService } = require('../../../src/program/services/InputDataService.js');
const {
  restoreMockedProjects,
  mockProject,
} = require('../../../test-helpers/mock-project-helpers.js');

function restoreOriginalInputDataPaths() {
  InputDataService.referenceProjectPaths = undefined;
  InputDataService.targetProjectPaths = undefined;
}

describe('InputDataService', () => {
  afterEach(() => {
    restoreOriginalInputDataPaths();
    restoreMockedProjects();
  });

  describe('Configuration', () => {
    it('allows to set referenceProjectPaths', async () => {
      const newPaths = ['/my/path', '/my/other/path'];
      InputDataService.referenceProjectPaths = newPaths;
      expect(InputDataService.referenceProjectPaths).to.equal(newPaths);
    });

    it('allows to set targetProjectPaths', async () => {
      const newPaths = ['/my/path', '/my/other/path'];
      InputDataService.targetProjectPaths = newPaths;
      expect(InputDataService.getTargetProjectPaths()).to.equal(newPaths);
    });
  });

  describe('Methods', () => {
    // TODO: mock file system...
    it('"createDataObject"', async () => {
      const projectPaths = [
        pathLib.resolve(__dirname, '../../../test-helpers/project-mocks/importing-target-project'),
      ];
      const inputDataPerProject = InputDataService.createDataObject(projectPaths);
      expect(Object.keys(inputDataPerProject[0].project)).to.eql([
        'path',
        'mainEntry',
        'name',
        'version',
        'commitHash',
      ]);
      expect(inputDataPerProject[0].project.name).to.equal('importing-target-project');
      expect(inputDataPerProject[0].project.mainEntry).to.equal(
        './target-src/match-imports/root-level-imports.js',
      );
      expect(
        inputDataPerProject[0].project.path.endsWith(
          '/test-helpers/project-mocks/importing-target-project',
        ),
      ).to.equal(true);

      expect(inputDataPerProject[0].entries.length).to.equal(6);
      expect(inputDataPerProject[0].entries[0].context.code).to.not.be.undefined;
      expect(inputDataPerProject[0].entries[0].file).to.equal(
        './target-src/find-customelements/multiple.js',
      );
    });

    it('mocked "createDataObject"', async () => {
      // By testing the output of our mocked method against the data of the real method, we
      // make sure the tests don't run sucessfully undeserved
    });

    it('"getTargetProjectPaths"', async () => {});

    it('"getReferenceProjectPaths"', async () => {});

    describe('"gatherFilesFromDir"', async () => {
      beforeEach(() => {
        mockProject({
          './index.js': '',
          './internal.js': '',
          './nested/index.js': '',
          './something.test.js': '',
          './index.html': '',
          './something.test.html': '',
        });
      });

      it('gathers a list of files', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project');
        expect(globOutput).to.eql([
          '/fictional/project/index.js',
          '/fictional/project/internal.js',
          '/fictional/project/nested/index.js',
          '/fictional/project/something.test.js',
        ]);
      });

      it('allows passing a depth which stops at nested depth', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', { depth: 0 });
        expect(globOutput).to.eql([
          '/fictional/project/index.js',
          '/fictional/project/internal.js',
          '/fictional/project/something.test.js',
        ]);
      });

      it('allows passing extensions', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          extensions: ['.html', '.js'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/index.html',
          '/fictional/project/index.js',
          '/fictional/project/internal.js',
          '/fictional/project/nested/index.js',
          '/fictional/project/something.test.html',
          '/fictional/project/something.test.js',
        ]);
      });

      it('allows passing excludeFolders', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          extensions: ['.html', '.js'],
          excludeFolders: ['nested'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/index.html',
          '/fictional/project/index.js',
          '/fictional/project/internal.js',
          '/fictional/project/something.test.html',
          '/fictional/project/something.test.js',
        ]);
      });

      it('allows passing excludeFiles', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          extensions: ['.html', '.js'],
          excludeFiles: ['index.js'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/index.html',
          '/fictional/project/internal.js',
          '/fictional/project/something.test.html',
          '/fictional/project/something.test.js',
        ]);
      });

      it('allows passing multiple exclude globs', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          extensions: ['.html', '.js'],
          exclude: '**/*.test.{html,js}',
        });
        expect(globOutput).to.eql([
          '/fictional/project/index.html',
          '/fictional/project/index.js',
          '/fictional/project/internal.js',
          '/fictional/project/nested/index.js',
        ]);
      });
    });
  });
});
