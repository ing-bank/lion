/**
 * Proves override parity, the one dependency declaration that cannot live in a single file.
 *
 * npm reads `overrides` from package.json (nested object form, `"."` for the package itself), pnpm reads its
 * own flat `parent>child` form from pnpm-workspace.yaml and ignores npm's field. Measured on this repo:
 * without the mirror pnpm resolved `@mdjs/mdjs-preview` to 0.5.9 while the committed npm lock installs 0.6.0
 * for that edge, and `patches/@mdjs+mdjs-preview+0.6.0.patch` stopped applying.
 *
 * So the two committed files have to spell the same thing, and pnpm-workspace.yaml has to be in the commit -
 * a checkout without it installs whatever pnpm resolves without the overrides.
 */
import { execFileSync } from 'node:child_process';
import { expect } from 'chai';
import { check, flattenNpmOverrides, overridesDrift, readPnpmOverridesText } from '../src/index.js';
import { withFixtureRepo } from './test-helpers.js';

describe('override parity', () => {
  it("reads npm's nested form as the pnpm selectors it means", () => {
    const flat = flattenNpmOverrides({
      '@mdjs/mdjs-preview': { '.': '^0.6.0', '@lion/ui': '^0.15.0' },
      lit: '$lit',
      'pug-code-gen': '3.0.3',
    });
    expect([...flat]).to.deep.equal([
      ['@mdjs/mdjs-preview', '^0.6.0'],
      ['@mdjs/mdjs-preview>@lion/ui', '^0.15.0'],
      ['lit', '$lit'],
      ['pug-code-gen', '3.0.3'],
    ]);
  });

  it('accepts the two spellings when they carry the same selectors', async () => {
    await withFixtureRepo(
      {
        npmOverrides: {
          '@mdjs/mdjs-preview': { '.': '^0.6.0', '@lion/ui': '^0.15.0' },
          lit: '$lit',
        },
        pnpmOverrides: {
          '@mdjs/mdjs-preview': '^0.6.0',
          '@mdjs/mdjs-preview>@lion/ui': '^0.15.0',
          lit: '$lit',
        },
      },
      repo => {
        const result = check({ repoRoot: repo.root });
        expect(result.overrides).to.deep.equal([]);
        expect(result.ok).to.equal(true);
      },
    );
  });

  it('reports an override only one of the two files declares', async () => {
    await withFixtureRepo(
      {
        npmOverrides: { '@mdjs/mdjs-preview': { '.': '^0.6.0', '@lion/ui': '^0.15.0' } },
        pnpmOverrides: { '@mdjs/mdjs-preview': '^0.6.0' },
      },
      repo => {
        const result = check({ repoRoot: repo.root });
        expect(result.ok).to.equal(false);
        expect(result.overrides).to.deep.equal([
          { selector: '@mdjs/mdjs-preview>@lion/ui', npm: '^0.15.0', pnpm: null },
        ]);
      },
    );
  });

  it('reports an override the two files spell at different specs', async () => {
    await withFixtureRepo(
      {
        npmOverrides: { '@mdjs/mdjs-preview': '^0.6.0' },
        pnpmOverrides: { '@mdjs/mdjs-preview': '0.5.9' },
      },
      repo => {
        const result = check({ repoRoot: repo.root });
        expect(result.ok).to.equal(false);
        expect(result.overrides).to.deep.equal([
          { selector: '@mdjs/mdjs-preview', npm: '^0.6.0', pnpm: '0.5.9' },
        ]);
      },
    );
  });

  it('is a hard failure when the repo installs with pnpm but has no pnpm-workspace.yaml', async () => {
    await withFixtureRepo({ withPnpmWorkspace: false, npmOverrides: { lit: '$lit' } }, repo => {
      const result = check({ repoRoot: repo.root });
      expect(result.noPnpmWorkspace).to.equal(true);
      expect(result.ok).to.equal(false);
    });
  });

  it('fails while pnpm-workspace.yaml is not in the commit', async () => {
    await withFixtureRepo(
      { npmOverrides: { lit: '$lit' }, pnpmOverrides: { lit: '$lit' } },
      repo => {
        execFileSync('git', ['init', '-q'], { cwd: repo.root });
        const untracked = check({ repoRoot: repo.root });
        expect(untracked.pnpmWorkspaceUntracked).to.equal(true);
        expect(untracked.ok).to.equal(false);

        execFileSync('git', ['add', 'pnpm-workspace.yaml', 'package.json'], { cwd: repo.root });
        const tracked = check({ repoRoot: repo.root });
        expect(tracked.pnpmWorkspaceUntracked).to.equal(false);
        expect(tracked.ok).to.equal(true);
      },
    );
  });

  it("refuses npm's nested spelling inside pnpm-workspace.yaml instead of comparing nonsense", () => {
    expect(() =>
      readPnpmOverridesText('overrides:\n  "@mdjs/mdjs-preview":\n    ".": "^0.6.0"\n'),
    ).to.throw(/not a string/);
  });

  it('reports both directions of a missing selector', () => {
    expect(
      overridesDrift(new Map([['lit', '$lit']]), new Map([['astro', '^6.0.8']])),
    ).to.deep.equal([
      { selector: 'astro', npm: null, pnpm: '^6.0.8' },
      { selector: 'lit', npm: '$lit', pnpm: null },
    ]);
  });
});
