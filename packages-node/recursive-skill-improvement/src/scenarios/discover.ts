/**
 * Repository discovery for the scenario registry: which components, systems and tags exist. Kept apart
 * from `index.ts` so the use-case derivation (`useCases.ts`) can use it without an import cycle.
 */
import fs from 'node:fs';
import path from 'node:path';
import { NON_VISUAL_COMPONENT_DIRS } from './lionUi.ts';

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
 * Tag -> class name, from the same manifest. The generated behaviour test registers the class in
 * the host's `scopedElements` mapping, so it needs the class name, not just the tag.
 */
export function discoverTagClasses(repoRoot: string): Record<string, string> {
  const manifestPath = path.join(repoRoot, 'packages/ui/custom-elements.json');
  if (!fs.existsSync(manifestPath)) return {};
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as {
    modules?: {
      declarations?: { customElement?: boolean; tagName?: string; name?: string }[];
    }[];
  };
  const map: Record<string, string> = {};
  for (const module of manifest.modules ?? []) {
    for (const declaration of module.declarations ?? []) {
      // Some entries carry a backtick/quoted tag (e.g. "`lion-input-range`"), so normalize.
      const tagName = (declaration.tagName ?? '').replace(/^[`'"]+|[`'"]+$/g, '').trim();
      if (tagName && declaration.name) map[tagName] = declaration.name;
    }
  }
  return map;
}
