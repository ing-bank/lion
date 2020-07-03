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
      expect(inputDataPerProject[0].entries.length).to.equal(11);
      expect(inputDataPerProject[0].entries[0].context.code).to.not.be.undefined;
      expect(inputDataPerProject[0].entries[0].file).to.equal(
        './node_modules/exporting-ref-project/index.js',
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
          './nested/nested-two/index.test.js': '',
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
          '/fictional/project/nested/nested-two/index.test.js',
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
          '/fictional/project/nested/nested-two/index.test.js',
          '/fictional/project/something.test.html',
          '/fictional/project/something.test.js',
        ]);
      });

      it('allows passing excludeFolders', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          extensions: ['.html', '.js'],
          filter: ['!nested/**'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/index.html',
          '/fictional/project/index.js',
          '/fictional/project/internal.js',
          '/fictional/project/something.test.html',
          '/fictional/project/something.test.js',
        ]);
      });

      it('allows passing excluded files', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          extensions: ['.html', '.js'],
          filter: ['!index.js', '!**/*/index.js'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/index.html',
          '/fictional/project/internal.js',
          '/fictional/project/nested/nested-two/index.test.js',
          '/fictional/project/something.test.html',
          '/fictional/project/something.test.js',
        ]);
      });

      it('allows passing exclude globs', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          extensions: ['.html', '.js'],
          filter: ['!**/*.test.{html,js}'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/index.html',
          '/fictional/project/index.js',
          '/fictional/project/internal.js',
          '/fictional/project/nested/index.js',
        ]);
      });

      it('omits node_modules and bower_components at root level by default', async () => {
        mockProject({
          './index.js': '',
          './node_modules/pkg/x.js': '',
          './bower_components/pkg/y.js': '',
          './nested/node_modules/pkg/x.js': '',
          './nested/bower_components/pkg/y.js': '',
        });

        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project');
        expect(globOutput).to.eql([
          '/fictional/project/index.js',
          '/fictional/project/nested/bower_components/pkg/y.js',
          '/fictional/project/nested/node_modules/pkg/x.js',
        ]);
      });

      it('allows to add root level files', async () => {
        mockProject({
          './root-lvl.js': '',
          './omitted/file.js': '',
          './added/file.js': '',
        });
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          filter: ['*', 'added/**/*'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/added/file.js',
          '/fictional/project/root-lvl.js',
        ]);
      });

      describe('Default config', () => {
        it('omits config files by default', async () => {
          mockProject({
            './index.js': '',
            './karma.conf.js': '',
            './commitlint.config.js': '',
            './some-pkg/commitlint.config.js': '',
            './some-other-pkg/commitlint.conf.js': '',
          });

          const globOutput = InputDataService.gatherFilesFromDir('/fictional/project');
          expect(globOutput).to.eql(['/fictional/project/index.js']);
        });

        it('omits hidden files by default', async () => {
          mockProject({
            './.blablarc.js': '',
            './index.js': '',
          });

          const globOutput = InputDataService.gatherFilesFromDir('/fictional/project');
          expect(globOutput).to.eql(['/fictional/project/index.js']);
        });

        it('filters npm files entries', async () => {
          mockProject({
            './docs/x.js': '',
            './src/y.js': '',
            './file.add.js': '',
            './omit.js': '',
            './package.json': JSON.stringify({
              files: ['*.add.js', 'docs', 'src'],
            }),
          });
          const globOutput = InputDataService.gatherFilesFromDir('/fictional/project');
          expect(globOutput).to.eql([
            '/fictional/project/docs/x.js',
            '/fictional/project/file.add.js',
            '/fictional/project/src/y.js',
          ]);
        });

        it('filters .gitignore entries', async () => {
          mockProject({
            './coverage/file.js': '',
            './storybook-static/index.js': '',
            './build/index.js': '',
            '.gitignore': `
/coverage
# comment
/storybook-static/

build/
            `,
          });
          const globOutput = InputDataService.gatherFilesFromDir('/fictional/project');
          expect(globOutput).to.eql([]);
        });

        describe('Default filter', () => {
          it('merges default config filter with configured filter', async () => {
            mockProject({
              './node_modules/root-lvl.js': '',
              './bower_components/omitted/file.js': '',
              './added.js': '',
              './omit.js': '',
            });
            const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
              filter: ['added*'],
            });
            expect(globOutput).to.eql(['/fictional/project/added.js']);
          });

          it('allows to omit default config filter', async () => {
            mockProject({
              './node_modules/root-lvl.js': '',
              './bower_components/omitted/file.js': '',
              './xyz.conf.js': '',
              './abc.config.js': '',
              './added.js': '',
              './omit.js': '',
            });
            const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
              filter: ['!omit*'],
              omitDefaultFilter: true,
            });
            expect(globOutput).to.eql([
              '/fictional/project/abc.config.js',
              '/fictional/project/added.js',
              '/fictional/project/bower_components/omitted/file.js',
              '/fictional/project/node_modules/root-lvl.js',
              '/fictional/project/xyz.conf.js',
            ]);
          });
        });
      });
    });
  });
});
