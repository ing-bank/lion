# Node Tools >> Providence Analytics >> Analyzer ||20

Analyzers form the core of Providence. They contain predefined queries based on AST traversal/analysis.
A few examples are:

- find-imports
- find-exports
- match-imports

An analyzer will give back a [QueryResult](../../../fundamentals/node-tools/providence-analytics/QueryResult.md) that will be written to the file system by Providence.
All analyzers need to extend from the `Analyzer` base class, found in `src/program/analyzers/helpers`.

## Public api

Providence has the following configuration api:

- name (string)
- requiresReference (boolean)
  An analyzer will always need a targetProjectPath and can optionally have a referenceProjectPath.
  In the latter case, it needs to have `requiresReference: true` configured.

During AST traversal, the following api can be consulted

- `.targetData`
- `.referenceData`
- `.identifier`

## Phases

### Prepare phase

In this phase, all preparations will be done to run the analysis. Providence is designed to be performant and therefore will first look if it finds an already existing, cached result for the current setup.

### Traverse phase

The ASTs are created for all projects involved and the data are extracted into a QueryOutput. This output can optionally be post processed.

### Finalize phase

The data are normalized and written to the filesystem in JSON format.

## Targets and references

Every Analyzer needs a targetProjectPath. A targetProjectPath is a file path String that.

## Types

We can roughly distinguish two types of analyzers: those that require a reference and those that don't require a reference.

## Database

In order to share data across multiple machines, results are written to the filesystem in a
"machine agnostic" way. They can be shared through git and serve as a local database.

### Caching

In order to make caching possible, Providence creates an "identifier": a hash from the combination of project versions + Analyzer configuration. When an identifier already exists in the filesystem, the result can be read from cache. This increases performance and helps mitigate memory problems that can occur when handling large amounts of data in a batch.

## Analyzer helpers

Inside the folder './src/program/analyzers', a folder 'helpers' is found.
Helpers are created specifically for use within analyzers and have knowledge about
the context of the analyzer (knowledge about an AST and/or QueryResult structure).

Generic functionality (that can be applied in any context) can be found in './src/program/utils'.

## Post processors

Post processors are imported by analyzers and act on their outputs. They can be enabled via the configuration of an analyzer. They can be found in './src/program/analyzers/post-processors'. For instance: transform the output of analyzer 'find-imports' by sorting on specifier instead of the default (entry). Other than most configurations of analyzers, post processors act on the total result of all analyzed files instead of just one file/ ast entry.
