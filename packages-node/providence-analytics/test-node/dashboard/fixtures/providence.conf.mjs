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
    '@lion-targets': ['../../packages/input', '../../packages/listbox'],
    // ...
  },
  referenceCollections: {
    // Usually the references are different from the targets.
    // In this demo file, we test @lion usage amongst itself
    // Select via " providence analyze --reference-collection 'exampleCollection' "
    '@lion-references': ['../../packages/form-core'],
  },
};
