import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripDocNoise } from '../../../scripts/lib/strip-doc-noise.mjs';

test('stripDocNoise rewrites every mdjs-preview import shape to lit', () => {
  const cases = [
    ["import { html } from '@mdjs/mdjs-preview';", "import { html } from 'lit';"],
    [
      "import { LitElement, html } from '@mdjs/mdjs-preview';",
      "import { LitElement, html } from 'lit';",
    ],
    [
      "import { html, render, LitElement } from '@mdjs/mdjs-preview';",
      "import { html, render, LitElement } from 'lit';",
    ],
    [
      "import { html as previewHtml } from '@mdjs/mdjs-preview';",
      "import { html as previewHtml } from 'lit';",
    ],
    ["import { html, css } from '@mdjs/mdjs-preview';", "import { html, css } from 'lit';"],
    ["import { css, html } from '@mdjs/mdjs-preview';", "import { css, html } from 'lit';"],
  ];
  for (const [input, expected] of cases) {
    assert.equal(stripDocNoise(input), expected, input);
  }
});

test('stripDocNoise removes mdjs-only bindings and relative demo modules', () => {
  assert.equal(
    stripDocNoise("import { html, preview } from '@mdjs/mdjs-preview';"),
    "import { html } from 'lit';",
  );
  assert.equal(stripDocNoise("import { preview } from '@mdjs/mdjs-preview';"), '');
  assert.equal(stripDocNoise("import './src/demoStyle.js';"), '');
  assert.equal(stripDocNoise("import { listboxData } from '../listbox/src/listboxData.js';"), '');
  assert.equal(stripDocNoise("import './my-app.js';"), "import './my-app.js';");
});

test('stripDocNoise unwraps mdjs-preview elements and collapses blank runs', () => {
  // The wrapper is removed; surrounding blank lines are the page's, not the transform's business.
  assert.equal(stripDocNoise('<mdjs-preview>\nsome code\n</mdjs-preview>').trim(), 'some code');
});

test('stripDocNoise keeps a lit directive that the kept body uses, from the module that exports it', () => {
  // `repeat` is not exported from the `lit` root; dropping it left `repeat(` in the kept code without an import.
  assert.equal(
    stripDocNoise("import { LitElement, html, repeat } from '@mdjs/mdjs-preview';"),
    "import { LitElement, html } from 'lit';\nimport { repeat } from 'lit/directives/repeat.js';",
  );
  assert.equal(
    stripDocNoise("import { repeat as r } from '@mdjs/mdjs-preview';"),
    "import { repeat as r } from 'lit/directives/repeat.js';",
  );
});
