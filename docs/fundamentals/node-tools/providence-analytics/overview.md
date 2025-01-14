# Node Tools >> Providence Analytics >> Overview ||10

```js script
import { html } from '@mdjs/mdjs-preview';
```

Providence is the 'All Seeing Eye' that generates usage statistics by analyzing code.
It measures the effectivity and popularity of your software.
With just a few commands you can measure the impact for (breaking) changes, making
your release process more stable and predictable.

For instance for a repo "lion-based-ui" that extends @lion/\* we can answer questions like:

- **Which subsets of my product are popular?**
  Which exports of reference project @lion/form-core are consumed by target project "lion-based-ui"?

- **How do sub classers consume/override my product?**
  Which classes / webcomponents inside target project "lion-based-ui" extend from reference project `@lion/\*`?
  Which of the methods within those classes are overridden?

- etc...

Providence uses abstract syntax trees (ASTs) to have the most advanced analysis possible.
It does this via the [oxc parser](https://oxc.rs/docs/guide/usage/parser.html), the quickest parser available today!

## Run

Providence expects an analyzer name that tells it what type of analysis to run:

```bash
npx providence-analytics analyze <analyzer-name>
```

By default Providence ships these analyzers:

- find-imports
- find-exports
- find-classes
- match-imports
- match-subclasses

Let's say we run `find-imports`:

```bash
npx providence-analytics analyze find-imports
```

Now it retrieves all relevant data about es module imports.
There are plenty of edge cases that it needs to take into account here;
you can have a look at the tests to get an idea about all different cases Providence handles for you.

## Projects

Providence uses the concept of projects. A project is a piece of software to analyze:
usually an npm artifact or a git (mono-)repository. What all projects have in common,
is a package.json. From it, the following project data is derived:

- the name
- the version
- the files it uses for scanning. One of the following strategies is usually followed:
  - exportmap entrypoints (by 'expanding' package.json "exports" on file system)
  - npm files (it reads package.json "files" | .npmignore)
  - the git files (it reads .gitignore)
  - a custom defined list

For a "find" analyzer, there is one project involved (the target project).

We can specify it like this (we override the default current working directory):

```bash
npx providence-analytics analyze find-imports -t /importing/project
```

For a "match" analyzer, there is also a reference project.
Here we match the exports of the reference project (-r) against the imports of the target project (-t).

```bash
npx providence-analytics analyze match-imports -t /importing/project -r /exporting/project
```

## Utils

Providence comes with many tools for deep traversal of identifiers,
the (babel like) traversal of ast trees in oxc and swc and more.
Also more generic utils for caching and performant globbing come delivered with Providence.

For a better understanding, check out the utils folders (tests and code).

## More

For more options, see:

```bash
npx providence-analytics --help
```
