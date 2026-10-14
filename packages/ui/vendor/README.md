# Vendored awesome-phonenumber

This temporary artifact replaces the registry dependency until the next upstream
awesome-phonenumber release incorporating the required metadata is available.

- Package: `awesome-phonenumber@7.9.0-tlouisse.libphonenumber-9.0.41`.
- Google libphonenumber: `v9.0.41`.
- Source: [tlouisse/awesome-phonenumber](https://github.com/tlouisse/awesome-phonenumber),
  commit `b4b6439136053624351f1c0fd8eb200ee867f37f`
  on branch `hu84jr-ing-phone-package-workflow`, based on upstream `9ff7ec8`.
- Artifact: `awesome-phonenumber-7.9.0-tlouisse.libphonenumber-9.0.41.tgz`.
- SHA-256: `855b0476ea7784457e8ec63d4824ff925eed0e339f72e8e05b7eea75a80ec018`.
- npm integrity:
  `sha512-v1ZQJG8WeBfH2PFjiZidVnBwXrD/IxNbUbeNVAXltkGdOtZiNN5n/Bllfp601GhkUPByZPvrPjHEj+gT9LnZIQ==`.
- [Verified packaging workflow](https://github.com/tlouisse/awesome-phonenumber/actions/runs/38529804810):
  Node 22/npm 10 and local Node 24/npm 11 produced byte-identical artifacts.

## Reproduce

In a separate checkout of the source repository:

```sh
git checkout b4b6439136053624351f1c0fd8eb200ee867f37f
yarn install --immutable
PACK_DESTINATION=/absolute/path/to/artifacts npm run pack
npm run pack:verify -- /absolute/path/to/artifacts/awesome-phonenumber-7.9.0-tlouisse.libphonenumber-9.0.41.tgz
shasum -a 256 /absolute/path/to/artifacts/awesome-phonenumber-7.9.0-tlouisse.libphonenumber-9.0.41.tgz
```

The source workflow rebuilds Google's metadata and verifies the installed tarball's
CommonJS, ESM, and TypeScript entrypoints. The artifact has no runtime dependencies.
It contains the upstream README and `LICENSE`, `LICENSE.libphonenumber`, and
`LICENSE.closure-library`; these notices also accompany the bundled installed
package in published Lion packages.

## Packaging and removal

The package-relative dependency is accompanied by `bundledDependencies` so consumers
receive the installed package, not an unresolved path into this repository.
The private root declares the same tarball as a development dependency so npm
hoists and installs it during `npm ci`; otherwise npm treats the workspace's
bundled dependency as already provided and skips installing it. Both declarations
must point to this exact artifact. The old docs package retains its registry version.
The temporary `prepack` helper verifies the checksum, installs only this artifact
in an isolated temporary prefix using offline npm, copies the npm-installed package
into the local bundle, and cleans up the temporary prefix. npm does not bundle
dependencies hoisted outside the workspace. The helper disables dependency scripts
and lockfile writes, cannot fetch network dependencies, and does not reinstall
Lion's other runtime dependencies.
Run `npm ci`, `npm run prepublishOnly --workspace @lion/ui`, and
`npm pack --workspace @lion/ui --pack-destination /absolute/path/to/artifacts`.
Install the resulting Lion tarball in a fresh consumer outside the checkout, with
`npm install --offline`, and verify the bundled phone package resolves and accepts
the French Guiana premium-rate example `+594890123456`.

When the next upstream awesome-phonenumber release incorporates this metadata,
restore the registry dependency, remove bundling and this vendor directory, update
the lockfile, remove the root development dependency, and retain the metadata
regression test. Remove the temporary `prepack` lifecycle and
`scripts/prepare-vendored-phone.js` helper too. See the root README for
the complete removal checklist.
