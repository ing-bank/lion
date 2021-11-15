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
      expect(InputDataService.targetProjectPaths).to.equal(newPaths);
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

    it('"targetProjectPaths"', async () => {});

    it('"getReferenceProjectPaths"', async () => {});

    describe('"getMonoRepoPackages"', async () => {
      it('supports npm/yarn workspaces', async () => {
        mockProject({
          './package.json': JSON.stringify({
            workspaces: ['packages/*', 'another-folder/another-package'],
          }),
          './packages/pkg1/package.json': '{ "name": "package1" }',
          './packages/pkg2/package.json': '',
          './packages/pkg3/package.json': '{ "name": "@scope/pkg3" }',
          './another-folder/another-package/package.json':
            '{ "name": "@another-scope/another-package" }',
        });

        expect(InputDataService.getMonoRepoPackages('/fictional/project')).to.eql([
          { path: 'packages/pkg1/', name: 'package1' },
          { path: 'packages/pkg2/', name: 'pkg2' }, // fallback when no package.json
          { path: 'packages/pkg3/', name: '@scope/pkg3' },
          { path: 'another-folder/another-package/', name: '@another-scope/another-package' },
        ]);
      });

      it('supports lerna', async () => {
        mockProject({
          './package.json': JSON.stringify({}),
          './lerna.json': JSON.stringify({
            packages: ['packages/*', 'another-folder/another-package'],
          }),
          './packages/pkg1/package.json': '{ "name": "package1" }',
          './packages/pkg2/package.json': '',
          './packages/pkg3/package.json': '{ "name": "@scope/pkg3" }',
          './another-folder/another-package/package.json':
            '{ "name": "@another-scope/another-package" }',
        });

        expect(InputDataService.getMonoRepoPackages('/fictional/project')).to.eql([
          { path: 'packages/pkg1/', name: 'package1' },
          { path: 'packages/pkg2/', name: 'pkg2' }, // fallback when no package.json
          { path: 'packages/pkg3/', name: '@scope/pkg3' },
          { path: 'another-folder/another-package/', name: '@another-scope/another-package' },
        ]);
      });
    });

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

      it('allows passing excluded folders', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          extensions: ['.html', '.js'],
          allowlist: ['!nested/**'],
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
          allowlist: ['!index.js', '!**/*/index.js'],
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
          allowlist: ['!**/*.test.{html,js}'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/index.html',
          '/fictional/project/index.js',
          '/fictional/project/internal.js',
          '/fictional/project/nested/index.js',
        ]);
      });

      it('does not support non globs in "allowlist"', async () => {
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          extensions: ['.html', '.js'],
          allowlist: ['nested'],
        });
        expect(globOutput).to.eql([]);
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
          allowlist: ['*', 'added/**/*'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/added/file.js',
          '/fictional/project/root-lvl.js',
        ]);
      });

      it('allows deeper globs', async () => {
        mockProject({
          './root-lvl.js': '',
          './deeper/glob/structure/file.js': '',
          './deeper/glob/file.js': '',
          './deeper/file.js': '',
        });
        const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
          allowlist: ['deeper/**/*'],
        });
        expect(globOutput).to.eql([
          '/fictional/project/deeper/file.js',
          '/fictional/project/deeper/glob/file.js',
          '/fictional/project/deeper/glob/structure/file.js',
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

        it('filters npm "files" entries when allowlistMode is "npm"', async () => {
          mockProject({
            './docs/x.js': '',
            './src/y.js': '',
            './file.add.js': '',
            './omit.js': '',
            './package.json': JSON.stringify({
              files: ['*.add.js', 'docs', 'src'],
            }),
          });
          const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
            allowlistMode: 'npm',
          });
          expect(globOutput).to.eql([
            '/fictional/project/docs/x.js',
            '/fictional/project/file.add.js',
            '/fictional/project/src/y.js',
          ]);
        });

        it('filters .gitignore entries when allowlistMode is "git"', async () => {
          mockProject({
            './coverage/file.js': '',
            './storybook-static/index.js': '',
            './build/index.js': '',
            './shall/pass.js': '',
            './keep/it.js': '',
            '.gitignore': `
/coverage
# comment
/storybook-static/

build/
!keep/
            `,
          });
          const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
            allowlistMode: 'git',
          });
          expect(globOutput).to.eql([
            '/fictional/project/keep/it.js',
            '/fictional/project/shall/pass.js',
          ]);
        });

        it('filters no entries when allowlistMode is "all"', async () => {
          mockProject({
            './dist/bundle.js': '',
            './src/file.js': '',
            './package.json': JSON.stringify({
              files: ['dist', 'src'],
            }),
            '.gitignore': `
/dist
            `,
          });
          const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
            allowlistMode: 'all',
          });
          expect(globOutput).to.eql([
            '/fictional/project/dist/bundle.js',
            '/fictional/project/src/file.js',
          ]);
        });

        it('autodetects allowlistMode', async () => {
          mockProject({
            './dist/bundle.js': '',
            './package.json': JSON.stringify({
              files: ['dist'],
            }),
            '.gitignore': `
/dist
            `,
          });
          const globOutput = InputDataService.gatherFilesFromDir('/fictional/project');
          expect(globOutput).to.eql([
            // This means allowlistMode is 'git'
          ]);

          restoreOriginalInputDataPaths();
          restoreMockedProjects();

          mockProject({
            './dist/bundle.js': '',
            './package.json': JSON.stringify({
              files: ['dist'],
            }),
          });
          const globOutput2 = InputDataService.gatherFilesFromDir('/fictional/project');
          expect(globOutput2).to.eql([
            // This means allowlistMode is 'npm'
            '/fictional/project/dist/bundle.js',
          ]);
        });

        it('custom "allowlist" will take precedence over "allowlistMode"', async () => {
          mockProject({
            './dist/bundle.js': '', // generated by build step
            './src/a.js': '',
            './src/b.js': '',
            '.gitignore': '/dist', // Because we have a .gitignore, allowlistMode will be git
            './package.json': JSON.stringify({
              files: ['dist'], // This will not be considered by default, unless explicitly configured in allowlist
            }),
          });
          const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
            allowlist: ['dist/**'],
            allowlistMode: 'git', // for clarity, (would also be autodetected if not provided)
          });
          expect(globOutput).to.eql(['/fictional/project/dist/bundle.js']);
        });

        describe('Default allowlist', () => {
          it('merges default config filter with configured filter', async () => {
            mockProject({
              './node_modules/root-lvl.js': '',
              './bower_components/omitted/file.js': '',
              './added.js': '',
              './omit.js': '',
            });
            const globOutput = InputDataService.gatherFilesFromDir('/fictional/project', {
              allowlist: ['added*'],
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
              allowlist: ['!omit*'],
              omitDefaultAllowlist: true,
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
