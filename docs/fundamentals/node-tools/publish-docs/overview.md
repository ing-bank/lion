# Node Tools >> Publish Docs >> Overview ||10

A tool that copies and processes your documentation (in a monorepo) so it can be published/shipped with your package.

It will:

- copy files into your npm package (which is especially useful for mono repositories)
- processes all markdown files by replacing all relative links to full absolute urls to the commit sha on GitHub
- have a document structure that is useable on GitHub

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

| name         | type   | description                                                                                  |
| ------------ | ------ | -------------------------------------------------------------------------------------------- |
| github-url   | string | Defines which GitHub Urls should be generated for relative links (mandatory)                 |
| project-dir  | string | The directory of your project/package. Defaults to the current working directory             |
| git-root-dir | string | The directory of your git entry point. Defaults to the current working directory             |
| copy-dir     | string | Allows to copies the content of a folder into the copy-target (relative to the git-root-dir) |
| copy-target  | string | Copies all files into the target (e.g. flattening the directory structure)                   |

Examples:

```
cd packages/my-pkg/
publish-docs --github-url https://github.com/ing-bank/lion/ --git-root-dir ../../
publish-docs --github-url https://github.com/ing-bank/lion/ --git-root-dir ../../ --copy-dir docs/my-components/assets
```

## More Files

Often it makes sense to have multiple documentation files. If you want to bring them along you can do so by adding more `[=> See Source <=]` hooks.

Bring the `overview.md` in a docs folder along.

👉 `packages/[my-package]/docs/overview.md`

```md
[=> See Source <=](../../docs/deep/dir/overview.md)
```

Add a `use-cases.md`

👉 `packages/[my-package]/docs/use-cases.md`

```md
[=> See Source <=](../../docs/deep/dir/use-cases.md)
```

So you will end up with something like this in your package.

```
.
├── docs
│   ├── use-cases.md
│   └── overview.md
├── src
│   ├── my-code.js
│   └── ...
├── package.json
└── README.md
```

Each of those md files will have a followable link on GitHub and will be replaced with the actual documentation before you publish it.

## Copying assets

On top of markdown documentation, there is often the need to bring along accompanying assets.

For that, a copy dir can be provided.

Note: This pattern is relative to the `git-root-dir`

Therefore given the following tree

```
.
├── docs
│   ├── green
│   │   ├── green-data.json
│   │   └── overview.md
│   └── red
│       ├── assets
│       │   ├── more
│       │   │   └── red-data.json
│       │   └── red-data.json
│       └── overview.md
└── packages
   └── my-pkg       <-- executed here
         ├── docs
         │   └── overview.md
         └── README.md
```

we can copy the red assets folder by providing the following copy-dir

```js
"prepublish": "publish-docs --github-url https://github.com/ing-bank/lion/ --git-root-dir ../../ --copy-dir docs/red/assets"
```

The published package will look like this

```
├── docs
│   ├── assets
│   │   ├── more
│   │   │   └── red-data.json
│   │   └── red-data.json
│   └── overview.md
└── README.md
```
