# portal — the Astro portal (lion.js.org)

The site published at <https://lion.js.org> is rendered from the library's own `docs/` tree by this
Astro project. `prev-portal/` holds the frozen legacy rocket site that used to own the site root.

## Why it is not a workspace member

Same reasoning as `prev-portal/`: the toolchain is big, has a wide dependency tree of its own (astro,
`@astrojs/*`, vite, shiki, pagefind, the `.astro` integrations) and is only needed to build the
website, so it should not be part of the install that runs the library's tests, lint or releases.
Every `npm install` in this repo used to resolve and install it anyway.

Keeping the portal here, in a directory the `workspaces` globs deliberately do not cover, means:

- `npm install` / `npm ci` at the root no longer pulls the astro toolchain - so a compromised
  package in that tree cannot run scripts during the install of this repo;
- the versions the site is built with are pinned in this package's own lockfile;
- the site is still built on demand, on any machine, with the same command.

Do not add this directory to `workspaces`, and do not call it from a root install.

## Usage

```bash
npm install          # at the repo root: the library and its workspace links (see below)
cd portal
npm install          # installs the portal's own tree in portal/node_modules
npm run build        # writes <repo root>/_site (astro + the base-url link pass)
npm run dev          # astro dev server on the repo's docs tree
npm run sync         # regenerate the content collection types
npm run links        # only the link pass, over an existing _site
npm run preview      # publish a branch preview (see below)
```

Two things are shared with the repository, and both are why the root install is a prerequisite:

- **the pages and the library**: the content collections read `../docs` and the portal renders
  `@lion/ui` / `@lion/astro-lit` from this checkout through `file:` links. The demos in `docs/` and
  the sources under `packages/` import `lit`, `@lion/ui`, `@lion/astro-lit`'s own deps and so on, and
  those are resolved from the **repository's** `node_modules` - so run `npm install` at the root once
  (which is also what the tests and lint need). The astro toolchain itself is *not* part of that
  install: it lives here.

- **the output**: `outDir` is `../_site`, because that is the site root the root `deploy`
  (`gh-pages -d _site`) publishes and what the preview script stages.

`npm install` in this directory does not install the dependencies of the `file:`-linked workspace
packages (npm assumes the owning project does). The ones the portal needs at build time are therefore
declared in this package as well, with the same ranges as their owners: `@bundled-es-modules/message-format`,
`@popperjs/core`, `autosize`, `ibantools`, `singleton-manager` (from `@lion/ui`),
`@lit-labs/ssr`, `@webcomponents/template-shadowroot`, `parse5` (from `@lion/astro-lit`). When one of
those packages adds a runtime dependency, add it here too.

The lit/`@mdjs`/**`@lit-labs`** versions are pinned or overridden in this package to the ones the
published site is built with, and `postinstall` applies the repository's `patches/`
(`patch-package --patch-dir ../patches`): the `lit` and `@lit-labs/ssr` patches are required for
`astro build` to work at all, so the portal must not install without them.

## Preview a branch

```bash
cd portal
npm run preview                       # build HEAD, publish under /next-preview/<branch>/, print the url
npm run preview -- --no-push          # build and stage, do not publish
npm run preview -- --no-build         # reuse the _site/ that is already there
npm run preview -- --branch=feat/x    # preview another branch
npm run preview -- --target=local     # stage in ~/portal-previews, no push (tailnet only with --serve)
```

A preview is the ordinary build with another `ASTRO_BASE_URL`, so nothing else changes. The shared
GitHub Pages site is public: a preview url is unlisted but not access controlled; use
`--target=local` for content that may not be public.

## Notes

- The portal's tests live in the root test suite (`test/portal/*.test.js`), because that is where the
  web test runner config and the browser deps live. They cover portal components
  (`UIMainNav`, `OJPreview`) and are not part of the CI groups.
- `css-tree` is imported by the demo viewer's CSS modifier; it used to arrive hoisted through another
  dependency and is declared here now.
- `glob` work in this package uses `fsGlob` from `providence-analytics/utils.js` (a thin wrapper
  around native `fs.promises.glob`) instead of another glob dependency.
