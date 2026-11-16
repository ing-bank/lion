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

/**
 * Members that come from a deny-listed mixin but whose `inheritedFrom` the analyzer did not resolve -
 * it depends on the module graph, so the same source can produce `inheritedFrom: LocalizeMixin` on one
 * run and no `inheritedFrom` at all on another. Named explicitly so the rule above cannot be silently
 * defeated by a resolution difference (measured: `localizeNamespaces` surfaced as an own public member
 * on 12 components, which the api-table coverage gate caught).
 */
const deniedMemberNames = new Set(['localizeNamespaces']);

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
                    !inheritanceDenyList.includes(member.inheritedFrom?.name) &&
                    !deniedMemberNames.has(member.name),
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
        /**
         * Factory mixins - `export const FormControlMixin = superclass => class extends …` - are not
         * declarations, so the analyzer names them in `mixins: [...]` on every consumer but never emits an
         * entry for the mixin itself. A consumer then inherits from a name that has no entry, and the
         * extension surface - what a subclasser actually composes - is invisible to the docs.
         *
         * Emit them from the same source the analyzer read, carrying the `@slot` annotations, so the
         * propagation below can hand their slots to every consumer.
         */
        // The module graph's Map is not keyed by the path the analyzer reports on its manifest modules, so
        // index the sources by that path instead of trusting the key.
        const sourceByPath = new Map();
        for (const [, module] of moduleGraph.modules) {
          if (module?.path) sourceByPath.set(module.path, module.source);
        }
        /**
         * Emit one definition's factory mixin, if it has exactly one and it declares slots.
         *
         * The analyzer does emit the export, but as a `variable` (the exported value is a function), so the
         * entry exists and is ignored by everything that looks for classes: `byName` in the slot
         * propagation below, the docs, and the api-table coverage gates. Promote it, keeping its
         * description and adding the slots it declares.
         */
        const emitFactoryMixin = definition => {
          const source = sourceByPath.get(definition.path);
          if (!source) return;
          const factories = new Set(
            [
              ...source.matchAll(
                /export const (\w+) = (?:dedupeMixin\(\w+\)|(?:superclass|superClass|base)\s*=>)/g,
              ),
            ].map(m => m[1]),
          );
          // Only one factory per file can be attributed unambiguously.
          if (factories.size !== 1) return;
          const [name] = factories;
          const slots = [
            ...source.matchAll(/@slot\s+(?:'([^']+)'|"([^"]+)"|([\w-]+))\s+([^\n*]+)/g),
          ]
            .map(match => ({
              name: match[1] ?? match[2] ?? match[3],
              description: match[4].trim(),
            }))
            // A file can repeat a tag (the class JSDoc and the typedef above the implementation), so keep
            // the first occurrence per name.
            .filter(
              (slot, index, all) =>
                all.findIndex(candidate => candidate.name === slot.name) === index,
            );
          if (slots.length === 0) return;
          const existing = definition.declarations.find(d => d.name === name);
          if (existing) {
            existing.kind = 'class';
            existing.slots = slots;
          } else {
            definition.declarations.push({
              kind: 'class',
              name,
              description: `Mixin factory: \`${name}(superclass)\`.`,
              slots,
            });
          }
        };
        for (const definition of customElementsManifest.modules) emitFactoryMixin(definition);

        const byName = new Map();
        for (const definition of customElementsManifest.modules) {
          for (const declaration of definition.declarations ?? []) {
            if (declaration.kind === 'class') byName.set(declaration.name, declaration);
          }
        }
        const inheritedSlots = (declaration, seen = new Set()) => {
          if (!declaration || seen.has(declaration.name)) return new Map();
          seen.add(declaration.name);
          const found = new Map(
            (declaration.slots ?? []).map(slot => [slot.name, declaration.name]),
          );
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
          const classDeclarations = (definition.declarations ?? []).filter(d => d.kind === 'class');
          for (const declaration of classDeclarations) {
            const own = new Set((declaration.slots ?? []).map(slot => slot.name));
            for (const [name, owner] of inheritedSlots(declaration)) {
              if (!own.has(name) && owner !== declaration.name) {
                declaration.slots = [
                  ...(declaration.slots ?? []),
                  { name, inheritedFrom: { name: owner } },
                ];
              }
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
