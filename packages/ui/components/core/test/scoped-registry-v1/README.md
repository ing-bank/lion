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

Provenance, so the file can be regenerated rather than trusted:

```bash
git clone --depth 1 --branch scoped-registry-redesign https://github.com/webcomponents/polyfills.git
cd polyfills/packages/scoped-custom-element-registry
# source commit at the time of copying: 8b60db656b898cc72958b531bf9a2d89d392f41a
# The upstream build uses tsc + google-closure-compiler (see package.json "wireit").
# esbuild produces an equivalent standalone script, without property mangling, which
# keeps the polyfill's `Object.defineProperty(<obj>, 'name', ...)` string keys intact:
esbuild src/scoped-custom-element-registry.ts --format=esm --target=es2020 --minify \
  --outfile=packages/ui/components/core/test/scoped-registry-v1/scoped-custom-element-registry.min.js
```

The file is a _script_ (it patches the DOM on load, guarded by
`window.CustomElementRegistryPolyfill.inUse`), which is why the test configs load it with a
`<script src>` tag rather than importing it.
