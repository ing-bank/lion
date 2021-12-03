const lionScopedPackagePaths = [
  '../../packages/accordion',
  '../../packages/ajax',
  '../../packages/button',
  '../../packages/calendar',
  '../../packages/checkbox-group',
  '../../packages/collapsible',
  '../../packages/combobox',
  '../../packages/core',
  '../../packages/dialog',
  '../../packages/fieldset',
  '../../packages/form',
  '../../packages/form-core',
  '../../packages/form-integrations',
  '../../packages/helpers',
  '../../packages/icon',
  '../../packages/input',
  '../../packages/input-amount',
  '../../packages/input-date',
  '../../packages/input-datepicker',
  '../../packages/input-email',
  '../../packages/input-iban',
  '../../packages/input-range',
  '../../packages/input-stepper',
  '../../packages/listbox',
  '../../packages/localize',
  '../../packages/overlays',
  '../../packages/pagination',
  '../../packages/progress-indicator',
  '../../packages/radio-group',
  '../../packages/select',
  '../../packages/select-rich',
  '../../packages/steps',
  '../../packages/switch',
  '../../packages/tabs',
  '../../packages/textarea',
  '../../packages/tooltip',
  '../../packages/validate-messages',
];

export default {
  metaConfig: {
    categoryConfig: [
      {
        // This is the name found in package.json
        project: '@lion/overlays',
        majorVersion: 1,
        // These conditions will be run on overy filePath
        categories: {
          overlays: localFilePath => {
            const names = ['dialog', 'tooltip'];
            const fromPackages = names.some(p => localFilePath.startsWith(`./packages/${p}`));
            const fromRoot =
              names.some(p => localFilePath.startsWith(`./ui-${p}`)) ||
              localFilePath.startsWith('./overlays.js');
            return fromPackages || fromRoot;
          },
          // etc...
        },
      },
    ],
  },
  // By predefening groups, we can do a query for programs/collections...
  // Select via " providence analyze --search-target-collection 'exampleCollection' "
  searchTargetCollections: {
    '@lion-targets': [  '../../packages/input','../../packages/listbox'],
    // ...
  },
  referenceCollections: {
    // Usually the references are different from the targets.
    // In this demo file, we test @lion usage amongst itself
    // Select via " providence analyze --reference-collection 'exampleCollection' "
    '@lion-references': ['../../packages/form-core'],
  },
};
