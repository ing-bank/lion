/**
 * Scenario discovery + aggregation.
 *
 * Reads the lion repository layout to build the default scenario set:
 * `packages/ui/components/*` -> one scenario per component,
 * `docs/fundamentals/systems/*` -> one scenario per system,
 * plus the hand-authored scenarios in `manual.ts`.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createLionUiScenarios, NON_VISUAL_COMPONENT_DIRS } from './lionUi.ts';
import { manualScenarios } from './manual.ts';
import type { TestScenario } from './types.ts';

export { NON_VISUAL_COMPONENT_DIRS, SYSTEM_NAMES, defineEntrypointFor } from './lionUi.ts';
export type { LionUiScenarioContext } from './lionUi.ts';
export { manualScenarios } from './manual.ts';
export type { TestScenario, ScenarioCheck } from './types.ts';

export function discoverComponentNames(repoRoot: string): string[] {
  const componentsDir = path.join(repoRoot, 'packages/ui/components');
  return fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => !NON_VISUAL_COMPONENT_DIRS.includes(name))
    .sort();
}

export function discoverSystemNames(repoRoot: string): string[] {
  const systemsDir = path.join(repoRoot, 'docs/fundamentals/systems');
  return fs
    .readdirSync(systemsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

/** Custom-element tag names declared in the custom elements manifest (used for tag assertions). */
export function discoverKnownTags(repoRoot: string): string[] {
  const manifestPath = path.join(repoRoot, 'packages/ui/custom-elements.json');
  if (!fs.existsSync(manifestPath)) return [];
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as {
    modules?: { declarations?: { customElement?: boolean; tagName?: string }[] }[];
  };
  const tags = new Set<string>();
  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      // Some entries carry a backtick/quoted tag (e.g. "`lion-input-range`"), so normalize.
      const tagName = (declaration.tagName ?? '').replace(/^[`'"]+|[`'"]+$/g, '').trim();
      if (tagName) tags.add(tagName);
    }
  }
  return [...tags].sort();
}

/**
 * Names that ship a side-effect `define` entrypoint (`@lion/ui/define/lion-<name>.js`), which the
 * `lion-ui` skill tells you to prefer when you only need the custom element registered.
 */
export function discoverDefineEntrypoints(repoRoot: string): string[] {
  const defineDir = path.join(repoRoot, 'packages/ui/exports/define');
  if (!fs.existsSync(defineDir)) return [];
  return fs
    .readdirSync(defineDir)
    .filter(entry => entry.startsWith('lion-') && entry.endsWith('.js'))
    .map(entry => entry.slice('lion-'.length, -'.js'.length))
    .sort();
}

export function loadLionUiScenarios({
  repoRoot,
  components = discoverComponentNames(repoRoot),
  systems = discoverSystemNames(repoRoot),
  includeManual = true,
}: {
  repoRoot: string;
  components?: string[];
  systems?: string[];
  includeManual?: boolean;
}): TestScenario[] {
  const generated = createLionUiScenarios({
    components,
    systems,
    knownTags: discoverKnownTags(repoRoot),
    defineEntrypoints: discoverDefineEntrypoints(repoRoot),
  });
  return includeManual ? [...generated, ...manualScenarios] : generated;
}
