# publish-docs

A tool that copies and processes your documentation (in a monorepo) so it can be published/shipped with your package.

It will:

- copy files into your npm package (which is especially useful for mono repositories)
- processes all markdown files by replacing all relative links to full absolute urls to the commit sha on github
- have a document structure that is useable on github

## Installation

For a Mono Repository

1. Add dependency

   ```bash
   npm i -D publish-docs
   ```

2. Add to your `packages/[my-package]/package.json`:

   ```js
   "scripts": {
      "prepublishOnly": "publish-docs --github-url https://github.com/ing-bank/lion/ --git-root-dir ../../"
   }
   ```

3. Replace you `packages/[my-package]/README.md` with

   ```md
   # My Pkg

   [=> See Source <=](../../docs/deep/dir/overview.md)
   ```

## CLI flags

| name         | type   | description                                                                     |
| ------------ | ------ | ------------------------------------------------------------------------------- |
| github-url   | string | Defines which GitHub Urls should be generated for relative links (mandatory)    |
| project-dir  | string | The directory of you project/package. Defaults to the current working directory |
| git-root-dir | string | The directory of you git entry point. Defaults to the current working directory |
| copy-pattern | string | Pattern for which asset files to copy (relative to the git-root-dir)            |
| copy-target  | string | Copies all files into the target (e.g. flattening the directory structure)      |

Examples:

```txt
cd packages/my-pkg/
publish-docs --github-url https://github.com/ing-bank/lion/ --git-root-dir ../../
publish-docs --github-url https://github.com/ing-bank/lion/ --git-root-dir ../../ --copy-pattern docs/red/*.json
```

## More Files

Often it makes sense to have multiple documentation files. If you want to bring them along you can do so by adding more `[=> See Source <=]` hooks.

Bring the `overview.md` in a docs folder along.

👉 `packages/[my-package]/docs/overview.md`

```md
[=> See Source <=](../../docs/deep/dir/overview.md)
```

Add a `features.md`

👉 `packages/[my-package]/docs/features.md`

```md
[=> See Source <=](../../docs/deep/dir/features.md)
```

So you will end up with something like this in your package.

```txt
.
├── docs
│   ├── features.md
│   └── overview.md
├── src
│   ├── my-code.js
│   └── ...
├── package.json
└── README.md
```

Each of those md files will have a follow able link on github and will be replaced with the actual documentation before you publish it.

## Copying assets

On top of markdown documentation there are often the need to bring along accompanied assets.

For that a copy pattern can be provided.

Note: This pattern is relative to the `git-root-dir`

Therefore given the following tree

```txt
.
├── docs
│   ├── green
│   │   ├── green-data.json
│   │   └── overview.md
│   └── red
│       ├── overview.md
│       └── red-data.json
└── packages
   └── my-pkg       <-- executed here
         ├── docs
         │   └── overview.md
         └── README.md
```

we can copy `red-data.json` by providing the following pattern

```js
"prepublish": "publish-docs --github-url https://github.com/ing-bank/lion/ --git-root-dir ../../ --copy-pattern docs/red/*.json"
```
