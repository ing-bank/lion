# Temporary source-built phone library

This **private** workspace builds `awesome-phonenumber@7.9.0-tlouisse.libphonenumber-9.0.41`
for Lion. It is not published and is not a runtime dependency of `@lion/ui`.
Only its generated library, declarations, licenses, checksums and provenance are
copied into `@lion/ui/generated/awesome-phonenumber`.

## Sources and licenses

- Fork: [tlouisse/awesome-phonenumber](https://github.com/tlouisse/awesome-phonenumber),
  commit `b4b6439136053624351f1c0fd8eb200ee867f37f`, MIT.
- Google: [libphonenumber v9.0.41](https://github.com/google/libphonenumber/tree/v9.0.41),
  commit `b68df884d42d5e9860fc1956a99ce6afae361100`, Apache-2.0.
- `upstream/awesome-phonenumber` retains the fork's handwritten wrapper,
  declarations, Closure inputs/options, rewrite and packaging scripts, Rollup
  config, README and licenses. Its compiled `lib/index.js` and `index-esm.mjs`
  are deliberately absent. The upstream manifest is archival, not a workspace
  dependency manifest; its scripts are not run as Lion lifecycle hooks.
- `upstream/libphonenumber/javascript` is the Google JavaScript source tree,
  including Google's checked-in metadata. We compile those sources, as the fork
  does; we do not regenerate Google's metadata from XML or Java.
- `source-checksums.json` pins every imported file byte-for-byte. Both the build
  and source-lint check verify the complete inventory. `provenance.json` pins the
  revisions, custom version and build-tool versions. Never regenerate checksums
  simply to silence a mismatch.
- `.gitattributes` disables newline conversion for these source snapshots so
  Windows checkouts retain their original bytes and valid checksums.
- MIT `LICENSE` and Apache-2.0 `LICENSE.libphonenumber` /
  `LICENSE.closure-library` are copied unchanged into the shipped library.

## Build

From the repository root:

```sh
npm ci
npm run build:phone --workspace @lion/ui
npm run types --workspace @lion/ui
npm run test:node --workspace @lion/ui
```

After dependencies are installed, builds are offline. Wireit tracks all source,
script, provenance and lockfile inputs and recreates missing outputs.
Root postinstall builds the phone assets before source-analysis tools run, so
browser tests after a fresh install do not depend on an earlier type check.
`npm pack --workspace @lion/ui` invokes UI types and the same build dependency
graph, so fresh packs also contain the emitted declarations. Prepack redirects
build logs to stderr to preserve `npm pack --json` output.
No committed distribution, tarball, remote clone, Yarn, Gulp, Ant or shell is
needed by the Lion build.

The adapter translates the fork's `build.sh` Closure flags to an argument array
and invokes the pinned compiler's Node CLI with explicit, sorted production
JavaScript inputs: Node expands the fork's
basename globs and excludes tests, demos and alternative metadata before invoking
Closure. This avoids Windows native compiler negative-glob differences that
otherwise include duplicate metadata namespaces. Explicit Closure library input
order and the position of the Google source group are preserved.
It uses native compiler binaries
on supported macOS/Linux/Windows platforms (installed by npm's optional
dependencies); otherwise the compiler requires **Java 21 or newer**.
Java 19 is insufficient for the Java compiler fallback. Do not omit optional
dependencies unless a compatible Java runtime is available.
The fork's Gulp task downloads Ant and lint tools, but its actual compilation
step does not use them. This adapter therefore does not download those tools.
The fork's `const`-to-`var` rewrite, Rollup CommonJS transform, default-export
removal and named ESM outro are preserved. The original Closure warnings remain
visible; they are not converted into silently successful compiler failures.

`build/awesome-phonenumber` is disposable compiler staging. `dist` and the UI
generated copy are ignored outputs. Builds never read an existing distribution.
The packaging regression recompiles twice and compares hashes, installs the
actual Lion tarball outside the checkout without overrides, verifies both Node
module formats and TypeScript versions, exercises Lion's lazy loader and
French Guiana premium-rate example `+594890123456`, and rejects altered sources.
It also bundles the installed loader with Rollup's browser resolver without an
import map, rejects unresolved imports, and executes the resulting ESM bundle.
The existing browser test runner independently exercises native web-component
behavior with the same package-private import.

## Maintenance and removal

Until a suitable upstream release exists, maintainers must review upstream
awesome-phonenumber and Google metadata releases explicitly.
`npm run lint:phone-number-up-to-date` verifies pinned source integrity/version
consistency; it does **not** assert that this fork is the latest registry release.
To update, import reviewed sources at explicit commits, update provenance and
checksums, then rebuild and rerun phone, packaging and type tests.

When an upstream release supplies the required metadata, restore the registry
dependency and imports, remove this workspace, the UI private import map,
generated assets and their `files` entry, `build:phone`/prepack integration and
helpers, the root postinstall phone-build step, and source-lint/exclusion entries
(including the snapshot newline rule). Adapt the packaging regression,
regenerate the root npm lock, retain the GF metadata regression, and run browser
phone/dropdown tests plus modern and legacy consumer type checks. See the root
README for the complete removal checklist.
