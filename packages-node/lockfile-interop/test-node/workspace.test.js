/**
 * Proves `sync`, the reason pnpm-workspace.yaml does not have to be maintained by hand.
 *
 * pnpm cannot read two things npm keeps in package.json - the `workspaces` member list and the `overrides`
 * (different spelling, and pnpm silently ignores npm's field) - so the pnpm side is derived from the npm
 * side, which stays the source of truth because it produces the lock external tooling reads. `check` remains
 * the gate; `sync --write` is how a developer satisfies it. Keys pnpm alone reads (today
 * `onlyBuiltDependencies`) are preserved: there is nothing to derive them from.
 */
import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'chai';
import { check, renderPnpmWorkspace, syncPnpmWorkspace, workspaceIsInSync } from '../src/index.js';
import { withFixtureRepo } from './test-helpers.js';

/** @param {{ repoOverrides?: Record<string, unknown>, onlyBuiltDependencies?: string[] }} [options] */
async function withWorkspaceRepo(options, fn) {
  const {
    repoOverrides = { '@mdjs/mdjs-preview': { '.': '^0.6.0', '@lion/ui': '^0.15.0' } },
    onlyBuiltDependencies,
  } = options ?? {};
  return withFixtureRepo({ npmOverrides: repoOverrides }, repo => {
    fs.writeFileSync(
      path.join(repo.root, 'pnpm-workspace.yaml'),
      `packages:\n  - "pkgs/*"\n${onlyBuiltDependencies ? `onlyBuiltDependencies:\n${onlyBuiltDependencies.map(d => `  - ${d}`).join('\n')}\n` : ''}`,
    );
    return fn(repo);
  });
}

describe('sync', () => {
  it('derives the member list and every override from package.json', async () => {
    await withWorkspaceRepo({}, repo => {
      const result = syncPnpmWorkspace({ repoRoot: repo.root, write: true });
      expect(result.written).to.equal(true);
      expect(result.members).to.deep.equal(['pkgs/*']);
      expect(result.overrides).to.deep.equal(['@mdjs/mdjs-preview', '@mdjs/mdjs-preview>@lion/ui']);
      const written = fs.readFileSync(path.join(repo.root, 'pnpm-workspace.yaml'), 'utf8');
      expect(written).to.contain('"@mdjs/mdjs-preview>@lion/ui": ^0.15.0');
      expect(check({ repoRoot: repo.root }).ok).to.equal(true);
    });
  });

  it('keeps the keys pnpm alone reads', async () => {
    await withWorkspaceRepo({ onlyBuiltDependencies: ['rs-module-lexer'] }, repo => {
      syncPnpmWorkspace({ repoRoot: repo.root, write: true });
      const written = fs.readFileSync(path.join(repo.root, 'pnpm-workspace.yaml'), 'utf8');
      expect(written).to.contain('onlyBuiltDependencies:');
      expect(written).to.contain('rs-module-lexer');
    });
  });

  it('is idempotent, so a second run produces no diff', async () => {
    await withWorkspaceRepo({}, repo => {
      syncPnpmWorkspace({ repoRoot: repo.root, write: true });
      expect(renderPnpmWorkspace(repo.root).changed).to.equal(false);
      expect(syncPnpmWorkspace({ repoRoot: repo.root }).written).to.equal(false);
    });
  });

  it('reports without touching the file, which is how CI fails on a stale pnpm-workspace.yaml', async () => {
    await withWorkspaceRepo({}, repo => {
      const before = fs.readFileSync(path.join(repo.root, 'pnpm-workspace.yaml'), 'utf8');
      const result = syncPnpmWorkspace({ repoRoot: repo.root });
      expect(result.changed).to.equal(true);
      expect(result.written).to.equal(false);
      expect(fs.readFileSync(path.join(repo.root, 'pnpm-workspace.yaml'), 'utf8')).to.equal(before);
    });
  });

  it('tells a caller whether the overrides agree, without reading the lock', async () => {
    await withWorkspaceRepo({}, repo => {
      expect(workspaceIsInSync(repo.root)).to.equal(false);
      syncPnpmWorkspace({ repoRoot: repo.root, write: true });
      expect(workspaceIsInSync(repo.root)).to.equal(true);
    });
  });

  it('fails loudly when package.json is not there to derive from', async () => {
    await withFixtureRepo({}, repo => {
      fs.rmSync(path.join(repo.root, 'package.json'));
      expect(() => renderPnpmWorkspace(repo.root)).to.throw(/no package.json/);
    });
  });
});
