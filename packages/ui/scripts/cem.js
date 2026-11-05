import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fsGlob } from 'providence-analytics/utils.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createModuleGraph } from '@thepassle/module-graph';
// eslint-disable-next-line import/no-extraneous-dependencies
import { create, ts } from '@custom-elements-manifest/analyzer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { litPlugin } from '@custom-elements-manifest/analyzer/src/features/framework-plugins/lit/lit.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { generateCustomData } from 'cem-plugin-vs-code-custom-data-generator';
// eslint-disable-next-line import/no-extraneous-dependencies
import { customElementJetBrainsPlugin } from 'custom-element-jet-brains-integration';

/**
 * Find all entrypoints for lion to create the CEM from
 */
const globs = await fsGlob('exports/**/*.js');

/**
 * Based on the entrypoints, create a module graph including @lion/ui dependency
 * We'll feed these modules to the CEM analyzer
 */
const moduleGraph = await createModuleGraph(globs, {
  exclude: [
    /** Don't include translations in the CEM */
    i => i.includes('/translations/'),
    /** Don't include SVGs in the CEM */
    i => i.endsWith('.svg.js'),
  ],
});

/**
 * @param {{name: string}} a
 * @param {{name: string}} b
 * @returns
 */
function sortName(a, b) {
  const nameA = a.name?.toUpperCase(); // ignore upper and lowercase
  const nameB = b.name?.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

/**
 * Create ts.sourceFiles from the modules in the module graph
 * to pass to the CEM analyzer
 */
const modules = [];
for (const [, module] of moduleGraph.modules) {
  modules.push(ts.createSourceFile(module.path, module.source, ts.ScriptTarget.ES2015, true));
}

/** Exclude information inherited from these mixins, they're generally not useful for public api */
const inheritanceDenyList = [
  'ScopedElementsMixin',
  'SyncUpdatableMixin',
  'LocalizeMixin',
  'SlotMixin',
];

const cem = create({
  modules,
  plugins: [
    ...litPlugin(),
    {
      packageLinkPhase({ customElementsManifest }) {
        for (const definition of customElementsManifest.modules) {
          for (const declaration of definition.declarations) {
            if (declaration.kind === 'class' && declaration?.members?.length) {
              /**
               * Filter out unwanted information from the docs
               */
              declaration.members = declaration.members
                .filter(
                  /** @param {{inheritedFrom: {name: string}}} member */ member =>
                    !inheritanceDenyList.includes(member.inheritedFrom?.name),
                )
                .sort(sortName);
              /**
               * Set privacy for members based on naming conventions
               */
              for (const m of declaration.members) {
                if (!m.privacy && !m.name?.startsWith('_') && !m.name?.startsWith('#')) {
                  m.privacy = 'public';
                } else if (m.name?.startsWith('#') || m.name?.startsWith('__')) {
                  m.privacy = 'private';
                } else if (!m.privacy && m.name?.startsWith('_')) {
                  m.privacy = 'protected';
                }
              }
            }
          }
        }

        // Slots are the one thing the analyzer does NOT inherit (members are), so a field would lose the
        // structure its base class renders. Copy a parent's slots onto the declaration that extends it,
        // marked with `inheritedFrom`: the field structure (label, input, prefix, suffix, before, after,
        // help-text, feedback) is annotated once on LionField and then belongs to every field, instead of
        // being repeated per component. The walk covers superclasses and mixins.
        const byName = new Map();
        for (const definition of customElementsManifest.modules) {
          for (const declaration of definition.declarations ?? []) {
            if (declaration.kind === 'class') byName.set(declaration.name, declaration);
          }
        }
        const inheritedSlots = (declaration, seen = new Set()) => {
          if (!declaration || seen.has(declaration.name)) return new Map();
          seen.add(declaration.name);
          const found = new Map((declaration.slots ?? []).map(slot => [slot.name, declaration.name]));
          const parents = [
            declaration.superclass?.name,
            ...(declaration.mixins ?? []).map(mixin => mixin.name),
          ];
          for (const parent of parents) {
            for (const [name, owner] of inheritedSlots(byName.get(parent), seen)) {
              if (!found.has(name)) found.set(name, owner);
            }
          }
          return found;
        };
        for (const definition of customElementsManifest.modules) {
          for (const declaration of definition.declarations ?? []) {
            if (declaration.kind !== 'class') continue;
            const own = new Set((declaration.slots ?? []).map(slot => slot.name));
            for (const [name, owner] of inheritedSlots(declaration)) {
              if (own.has(name) || owner === declaration.name) continue;
              declaration.slots = [...(declaration.slots ?? []), { name, inheritedFrom: { name: owner } }];
            }
            if (declaration.slots?.length) declaration.slots.sort(sortName);
          }
        }
      },
    },
    generateCustomData(),
    customElementJetBrainsPlugin(),
  ],
});

fs.writeFileSync('./custom-elements.json', JSON.stringify(cem, null, 2));
