import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { globby } from 'globby';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createModuleGraph } from '@thepassle/module-graph';
// eslint-disable-next-line import/no-extraneous-dependencies
import { create, ts } from '@custom-elements-manifest/analyzer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { litPlugin } from '@custom-elements-manifest/analyzer/src/features/framework-plugins/lit/lit.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { generateCustomData } from 'cem-plugin-vs-code-custom-data-generator';

/**
 * Find all entrypoints for lion to create the CEM from
 */
const globs = await globby('./exports/**/*.js');

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
    generateCustomData(),
    {
      packageLinkPhase({ customElementsManifest }) {
        for (const definition of customElementsManifest.modules) {
          for (const declaration of definition.declarations) {
            if (declaration.kind === 'class' && declaration?.members?.length) {
              /**
               * Filter out unwanted information from the docs
               */
              declaration.members = declaration.members.filter(
                member => !inheritanceDenyList.includes(member.inheritedFrom?.name),
              );

              /**
               * Set privacy for members based on naming conventions
               */
              for (const m of declaration.members) {
                if (!m.privacy && !m.name?.startsWith('_') && !m.name?.startsWith('#')) {
                  m.privacy = 'public';
                } else if (!m.privacy && m.name?.startsWith('_')) {
                  m.privacy = 'protected';
                } else if (m.name?.startsWith('#') || m.name?.startsWith('__')) {
                  m.privacy = 'private';
                }
              }
            }
          }
        }
      },
    },
  ],
});

fs.writeFileSync('./custom-elements.json', JSON.stringify(cem, null, 2));
