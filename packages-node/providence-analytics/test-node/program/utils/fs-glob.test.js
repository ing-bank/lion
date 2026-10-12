import { expect } from 'chai';
import { it } from 'mocha';

import { fsGlob } from '#utils/fs-glob.js';
import { mockProject, restoreMockedProjects } from '#test-helpers/mock-project-helpers.js';

describe('fsGlob', () => {
  afterEach(() => {
    restoreMockedProjects();
  });

  it('matches glob patterns relative to cwd', async () => {
    mockProject({
      './src/a.js': 'a',
      './src/b.js': 'b',
      './src/sub/c.js': 'c',
      './README.md': 'readme',
    });

    const results = await fsGlob('src/**/*.js', { cwd: '/fictional/project' });
    expect(results).to.deep.equal(['src/a.js', 'src/b.js', 'src/sub/c.js']);
  });

  it('returns absolute paths when "absolute" is true', async () => {
    mockProject({ './src/a.js': 'a' });

    const results = await fsGlob('src/*.js', { cwd: '/fictional/project', absolute: true });
    expect(results).to.deep.equal(['/fictional/project/src/a.js']);
  });

  it('excludes directories by default (onlyFiles defaults to true)', async () => {
    mockProject({ './src/a.js': 'a', './src/sub/c.js': 'c' });

    const results = await fsGlob('src/*', { cwd: '/fictional/project' });
    expect(results).to.deep.equal(['src/a.js']);
  });

  it('includes directories when "onlyFiles" is false', async () => {
    mockProject({ './src/a.js': 'a', './src/sub/c.js': 'c' });

    const results = await fsGlob('src/*', { cwd: '/fictional/project', onlyFiles: false });
    expect(results).to.deep.equal(['src/a.js', 'src/sub']);
  });

  it('only returns directories when "onlyDirectories" is true', async () => {
    mockProject({ './src/a.js': 'a', './src/sub/c.js': 'c' });

    const results = await fsGlob('src/*', { cwd: '/fictional/project', onlyDirectories: true });
    expect(results).to.deep.equal(['src/sub']);
  });

  it('subtracts negation patterns (e.g. "!src/sub/**")', async () => {
    mockProject({ './src/a.js': 'a', './src/sub/c.js': 'c' });

    const results = await fsGlob(['src/**/*.js', '!src/sub/**'], { cwd: '/fictional/project' });
    expect(results).to.deep.equal(['src/a.js']);
  });

  it('resolves non-glob (literal) paths by checking their existence', async () => {
    mockProject({ './src/a.js': 'a' });

    const results = await fsGlob(['src/a.js', 'src/does-not-exist.js'], {
      cwd: '/fictional/project',
    });
    expect(results).to.deep.equal(['src/a.js']);
  });
});
