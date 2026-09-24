import fs from 'fs';
import path from 'path';
import { customElementsManifestToMarkdown } from '@custom-elements-manifest/to-markdown';

/**
 * Shared Custom Elements Manifest -> Markdown API table logic.
 *
 * This is used by:
 * - `scripts/create-api-tables.mjs` (writes `docs/**\/api-table.md` used by the Rocket docs site)
 * - `packages/ui/scripts/skills-generation/generate-skills.mjs` (inlines the same tables into the
 *   `lion-ui` agent skill, so the skill is self-contained and doesn't depend on gitignored build output)
 *
 * Keeping this in one place means both consumers agree on which classes belong to which
 * doc "folder" (component vs. system) and render identical API tables.
 */

/** Directories in `packages/ui/components` whose docs live under `docs/fundamentals/systems`. */
export const SYSTEMS_DIRS = ['core', 'form-core', 'localize', 'overlays'];

/** Component directories whose classes are documented under a different doc directory. */
export const COMPONENT_DIR_REMAP = [{ componentDir: 'validate-messages', portalDir: 'form' }];

const CEM_TO_MARKDOWN_OPTIONS = {
  private: 'hidden',
  headingOffset: 0,
  omitSections: ['main-heading', 'super-class', 'static-fields', 'static-methods', 'mixins'],
};

/**
 * @param {string} uiComponentsDir absolute path to `packages/ui/components`
 * @returns {string[]} directory names, excluding private (`_`-prefixed) and non-documented dirs
 */
export function listUiComponentDirs(uiComponentsDir) {
  return fs
    .readdirSync(uiComponentsDir)
    .filter(d => !d.startsWith('_') && !['form-integrations', 'helpers'].includes(d));
}

/**
 * Resolves the output "doc dir name" and whether it belongs under `fundamentals/systems`,
 * mirroring the remapping rules in the original `create-api-tables.mjs` script.
 * @param {string} componentDir
 * @returns {{ dir: string, isSystem: boolean }}
 */
export function resolveDocGroup(componentDir) {
  const isSystem = SYSTEMS_DIRS.includes(componentDir);
  let dir = componentDir;
  for (const remap of COMPONENT_DIR_REMAP) {
    if (dir === remap.componentDir) {
      dir = remap.portalDir;
    }
  }
  if (dir === 'form-core') {
    dir = 'form';
  }
  return { dir, isSystem };
}

/**
 * Lists the exported class names for a component that should get an API table.
 * @param {string} uiComponentsDir absolute path to `packages/ui/components`
 * @param {string} componentDir
 * @param {boolean} isSystem when true, `Manager`/`Mixin` classes are included too
 * @returns {string[]}
 */
export function listComponentClasses(uiComponentsDir, componentDir, isSystem) {
  const srcDir = path.join(uiComponentsDir, componentDir, 'src');
  if (!fs.existsSync(srcDir)) {
    return [];
  }
  return fs
    .readdirSync(srcDir)
    .filter(f => {
      if (isSystem) {
        return f.endsWith('.js');
      }
      return f.endsWith('.js') && !f.endsWith('Manager.js') && !f.endsWith('Mixin.js');
    })
    .map(f => f.replace('.js', ''));
}

/**
 * @param {object} customElementsJson parsed `custom-elements.json`
 * @param {string} className
 * @returns {object | undefined} the matching class declaration, if any
 */
export function findClassDeclaration(customElementsJson, className) {
  for (const mod of customElementsJson.modules) {
    for (const declaration of mod.declarations) {
      if (declaration.name === className && declaration.kind === 'class') {
        return declaration;
      }
    }
  }
  return undefined;
}

/**
 * Renders an API table (attributes/properties/methods/events) in Markdown for one class.
 * @param {object} declaration a class declaration from `custom-elements.json`
 * @returns {string}
 */
export function classDeclarationToMarkdown(declaration) {
  return customElementsManifestToMarkdown(
    { modules: [{ declarations: [declaration] }] },
    CEM_TO_MARKDOWN_OPTIONS,
  );
}

/**
 * Builds a map of `<folder>/<dir>` (e.g. `components/button`, `fundamentals/systems/form`) to the
 * concatenated API table Markdown for every documented class in that group.
 * @param {object} options
 * @param {string} options.uiComponentsDir absolute path to `packages/ui/components`
 * @param {object} options.customElementsJson parsed `custom-elements.json`
 * @returns {Map<string, string>}
 */
export function computeApiTablesByDocGroup({ uiComponentsDir, customElementsJson }) {
  const tablesByGroup = new Map();

  for (const componentDir of listUiComponentDirs(uiComponentsDir)) {
    const { dir, isSystem } = resolveDocGroup(componentDir);
    const classes = listComponentClasses(uiComponentsDir, componentDir, isSystem);
    const folder = isSystem ? 'fundamentals/systems' : 'components';
    const groupKey = `${folder}/${dir}`;

    for (const className of classes) {
      const declaration = findClassDeclaration(customElementsJson, className);
      if (!declaration) continue;
      const md = classDeclarationToMarkdown(declaration);
      const existing = tablesByGroup.get(groupKey);
      tablesByGroup.set(groupKey, existing ? `${existing}\n\n${md}` : md);
    }
  }

  return tablesByGroup;
}
