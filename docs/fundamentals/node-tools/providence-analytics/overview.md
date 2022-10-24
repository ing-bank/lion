# Node Tools >> Providence Analytics >> Overview ||10

```js script
import { html } from '@mdjs/mdjs-preview';
import { providenceFlowSvg, providenceInternalFlowSvg } from './assets/_mermaid.svg.js';
```

Providence is the 'All Seeing Eye' that generates usage statistics by analyzing code.
It measures the effectivity and popularity of your software.
With just a few commands you can measure the impact for (breaking) changes, making
your release process more stable and predictable.

Providence can be used as a dev dependency in a project for which metrics
can be generated via analyzers (see below).
For instance for a repo "lion-based-ui" that extends @lion/\* we can answer questions like:

- **Which subsets of my product are popular?**
  Which exports of reference project @lion/form-core are consumed by target project "lion-based-ui"?

- **How do sub classers consume/override my product?**
  Which classes / webcomponents inside target project "lion-based-ui" extend from reference project `@lion/\*`?
  Which of the methods within those classes are overridden?

- etc...

All the above results can be shown in a dashboard (see below), which allows to sort exports from reference project (@lion) based on popularity, category, consumer etc.
The dashboard allows to aggregate data from many target projects as well and will show you on a detailed (file) level how those components are being consumed by which projects.

## Setup

### Install providence

```bash
npm i --save-dev providence-analytics
```

### Add a providence script to package.json

```json
"scripts": {
  "providence:match-imports": "providence analyze match-imports -r 'node_modules/@lion/ui/*.js'",
}
```

> The example above illustrates how to run the "match-imports" analyzer for reference project 'lion-based-ui'. Note that it is possible to run other analyzers and configurations supported by providence as well. For a full overview of cli options, run `npx providence --help`. All supported analyzers will be viewed when running `npx providence analyze`

You are now ready to use providence in your project. All
data will be stored in json files in the folder `./providence-output`

![CLI](./assets/provicli.gif 'CLI')

## Setup: Dashboard

### Add "providence:dashboard" script to package.json

```js
...
"scripts": {
    ...
    "providence:dashboard": "providence dashboard"
}
```

### Add providence.conf.js

```js
export default {
  referenceCollections: {
    'lion-based-ui-collection': [
      './node_modules/lion-based-ui/packages/x',
      './node_modules/lion-based-ui/packages/y',
    ],
  },
};
```

Run `npm run providence:dashboard`

![dashboard](./assets/providash.gif 'dashboard')

## Setup: about result output

All output files will be stored in `./providence-output`.
This means they will be committed to git, so your colleagues don't have to
rerun the analysis (for large projects with many dependencies this can be time consuming)
and can directly start the dashboard usage metrics.
Also, note that the files serve as cache (they are stored with hashes based on project version and analyzer configuration). This means that an interrupted analysis can be
resumed later on.

## Conceptual overview

Providence performs queries on one or more search targets.
These search targets consist of one or more software projects (javascript/html repositories)

The diagram below shows how `providenceMain` function can be used from an external context.

```js story
export const providenceFlow = () => providenceFlowSvg;
```

## Flow inside providence

The diagram below depicts the flow inside the `providenceMain` function.
It uses:

- InputDataService
  Used to create a data structure based on a folder (for instance the search target or
  the references root). The structure creates entries for every file, which get enriched with code,
  ast results, query results etc. Returns `InputData` object.
- QueryService
  Requires a `queryConfig` and `InputData` object. It will perform a query (grep search or ast analysis)
  and returns a `QueryResult`.
  It also contains helpers for the creation of a `queryConfig`
- ReportService
  The result gets outputted to the user. Currently, a log to the console and/or a dump to a json file
  are available as output formats.

```js story
export const providenceInternalFlow = () => providenceInternalFlowSvg;
```

## Queries

Providence requires a queries as input.
Queries are defined as objects and can be of two types:

- feature-query
- ast-analyzer

A `QueryConfig` is required as input to run the `providenceMain` function.
This object specifies the type of query and contains the relevant meta
information that will later be outputted in the `QueryResult` (the JSON object that
the `providenceMain` function returns.)

## Analyzer Query

Analyzer queries are also created via `QueryConfig`s.

Analyzers can be described as predefined queries that use AST traversal.

Run:

```bash
providence analyze
```

Now you will get a list of all predefined analyzers:

- find-imports
- find-exports
- find-classes
- match-imports
- match-subclasses
- etc...

![Analyzer query](./assets/analyzer-query.gif 'Analyzer query')

<!--
## Running providence from its own repo

### How to add a new search target project

```bash
git submodule add <git-url> ./providence-input-data/search-targets/<project-name>
```

### How to add a reference project

By adding a reference project, you can automatically see how code in your reference project is
used across the search target projects.
Under the hood, this automatically creates a set of queries for you.

```bash
git submodule add <git-url> ./providence-input-data/references/<project-name>
```

### Updating submodules

Please run:

```bash
git submodule update --init --recursive
```

### Removing submodules

Please run:

```bash
sh ./rm-submodule.sh <path/to/submodule>
```
-->
