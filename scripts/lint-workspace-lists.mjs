#!/usr/bin/env node
/**
 * Keep package.json's `workspaces` and pnpm-workspace.yaml's `packages` the same list.
 *
 * Both are needed (npm reads the first, pnpm the second) and they cannot be derived from one another
 * without a package manager, so a drift between them is silent: pnpm installs one set of projects, npm
 * links another. Text-parsed on purpose - CI runs this before any install, and js-yaml is a transitive dep.
 */
import { readFileSync } from 'node:fs';

/* eslint-disable no-console */

const globsOf = source =>
  [...source.matchAll(/^\s{2}-\s+['"]?([^'"\n]+?)['"]?\s*$/gm)].map(m => m[1].trim());

const yamlGlobs = globsOf(
  readFileSync('pnpm-workspace.yaml', 'utf8').split('patchedDependencies')[0],
);
const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const npmGlobs = (manifest.workspaces ?? []).map(entry => String(entry).replace(/\/\*$/, '/*'));

const normalise = globs =>
  [...new Set(globs.map(g => g.replace(/^['"]|['"]$/g, '').trim()))].sort();
const a = normalise(yamlGlobs);
const b = normalise(npmGlobs);

if (a.join('|') !== b.join('|')) {
  console.error('workspace lists differ:');
  console.error('  pnpm-workspace.yaml packages:', a.join(', '));
  console.error('  package.json workspaces    :', b.join(', '));
  process.exit(1);
}
console.log(`workspace lists agree (${a.length} patterns): ${a.join(', ')}`);
