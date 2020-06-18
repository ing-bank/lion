// This file is read by dashboard and cli and needs to be present under process.cwd()
// It mainly serves as an example and it allows to run the dashboard locally
// from within this repo.

const providenceConfig = {
  metaConfig: {
    categoryConfig: [
      {
        // This is the name found in package.json
        project: 'lion-based-ui',
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
  // Select via " providence analyze -t 'exampleCollection' "
  searchTargetCollections: {
    exampleCollection: [
      './providence-input-data/search-targets/example-project-a',
      './providence-input-data/search-targets/example-project-b',
    ],
    // ...
  },
  referenceCollections: {
    // Our products
    'lion-based-ui': [
      './providence-input-data/references/lion-based-ui',
      './providence-input-data/references/lion-based-ui-labs',
    ],
  },
};

module.exports = providenceConfig;
