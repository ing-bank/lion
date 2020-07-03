[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Local configuration

```js script
export default {
  title: 'Providence/LocalConfiguration',
};
```

The file `providence.conf.js` is read by providence cli and by the dashboard to get all
default configurations.

## Meta data

### Category info

Based on the filePath of a result, a category can be added.
For example:

```js
  metaConfig: {
    categoryConfig: [
      {
        // This is the name found in package.json
        project: '@lion/root',
        // These conditions will be run on overy filePath
        categories: {
          core: p => p.startsWith('./packages/core'),
          utils: p => p.startsWith('./packages/ajax') || p.startsWith('./packages/localize'),
          overlays: p =>
            p.startsWith('./packages/overlays') ||
            p.startsWith('./packages/dialog') ||
            p.startsWith('./packages/tooltip'),
          ...
        },
      },
    ],
  },
```

> N.B. category info is regarded as subjective, therefore it's advised to move this away from
> Analyzers (and thus file-system cache). Categories can be added realtime in the dashboard.

## Project paths

### referenceCollections

A list of file system paths. They can be defined relative from the current project root (`process.cwd()`) or they can be full paths.
When a [MatchAnalyzer]('./Analyzer.md') like `match-imports` or `match-subclasses` is used,
the default reference(s) can be configured here. For instance: ['/path/to/@lion/form']

An example:

```js
  referenceCollections: {
    // Our products
    'lion-based-ui': [
      './providence-input-data/references/lion-based-ui',
      './providence-input-data/references/lion-based-ui-labs',
    ],
    ...
  }
```

### searchTargetCollections

A list of file system paths. They can be defined relative from the current project root
(`process.cwd()`) or they can be full paths.
When not defined, the current project will be the search target (this is most common when
providence is used as a dev dependency)
