# Scoped custom element registry polyfill, spec 1.x (POC fixture)

`scoped-custom-element-registry.min.js` in this directory is a build of the **redesign** of
`@webcomponents/scoped-custom-element-registry` — the version that implements the current
("1.x") scoped custom element registries model, with `document.create*`/`importNode` taking a
`customElementRegistry` option and `customElementRegistry` readable on elements, documents and
shadow roots.

It is the code under review in [webcomponents/polyfills#668](https://github.com/webcomponents/polyfills/pull/668)
(branch `scoped-registry-redesign`), which is **not published to npm yet** — the published
`0.0.10` is still the older 0.x model. It lives here so the test matrix can run against the new
model in the meantime; delete it (and the `SCOPED_POLYFILL=v1` entry of
`web-test-runner.scoped-spec.config.mjs`) once the redesign ships.

## Regenerating it

```bash
node scripts/scoped-registry-polyfill.mjs            # rebuild from the pinned commit
node scripts/scoped-registry-polyfill.mjs --check    # verify the committed build is that commit
node scripts/scoped-registry-polyfill.mjs --latest   # move to the tip of the PR branch
```

The script caches a blobless clone in `.tmp/scoped-registry-polyfill` (gitignored), checks out the
pinned commit by default — `source.json` next to this README records which one — and builds a
standalone script with esbuild. It is pinned rather than "latest" on purpose: the PR branch moves
(it was at `8b60db65` when the current build was made and at `f60f443a` when this was written;
both pass the compatibility tests), and a test fixture that changes under you is not a fixture.

Why esbuild and not upstream's closure toolchain: esbuild does not rename properties, so the
polyfill's `Object.defineProperty(<obj>, 'name', …)` string keys survive; closure at
`ADVANCED_OPTIMIZATIONS` would need the upstream flagfile.

The file is a _script_ (it patches the DOM on load, guarded by
`window.CustomElementRegistryPolyfill.inUse`), which is why the test configs load it with a
`<script src>` tag rather than importing it.
