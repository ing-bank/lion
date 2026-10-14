# @lion/test-runner-screenreader

Web Test Runner plugin and commands for testing what a screen reader speaks, via
[Guidepup](https://www.guidepup.dev/). Private tooling: it exists to run the Lion
screen reader test flow, not to be published yet.

## What the flow looks like

A component gets one screen reader test file next to its other tests:

```
packages/ui/components/input-iban/test/lion-input-iban.sr.test.mjs
```

It is a normal Web Test Runner test file (`describe`, `it`, `fixture`), with the
expectations written inline in the test:

```js
import { expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import sr, { contains, exact } from '@lion/test-runner-screenreader/commands.js';
import '@lion/ui/define/lion-input-iban.js';

describe('<lion-input-iban> screen reader', () => {
  before(async () => {
    await sr.initialize();
  });

  after(async () => {
    await sr.stop();
  });

  beforeEach(async () => {
    await sr.reset();
  });

  it('announces the empty state', async () => {
    await fixture(html`
      <lion-input-iban>
        <label slot="label">IBAN</label>
      </lion-input-iban>
    `);
    await sr.next();
    await sr.expect({
      virtual: contains('IBAN', 'textbox'),
      nvda: contains('IBAN', 'edit'),
      voiceover: contains('IBAN', 'text field'),
    });
  });
});
```

Rules the flow enforces:

- An expectation has to describe **every** reader (`virtual`, `nvda`, `voiceover`).
  `virtual` keeps the suite runnable on any machine; `nvda` and `voiceover` are
  what CI blocks on.
- `--virtual` is refused when `CI` is set, so a virtual run can never pass as the
  real check.
- Input goes through the screen reader (`sr.press`, `sr.type`, `sr.next`). Setting
  a DOM property talks to the component but not to NVDA or VoiceOver, which only
  speak what their own keyboard input produced.
- Waiting is `sr.waitFor(phrase)`, never a fixed sleep.
- There is no update mode. A run passes or fails like any other test; on a
  mismatch the failure output shows the expected and heard phrase log, and the
  developer updates the expectation in the test.

## Running it

```bash
npm run test:sr                        # local, virtual reader (any OS)
npm run test:sr -- --files "packages/ui/components/input-iban/test/*.sr.test.mjs"
npm run test:sr -- --nvda              # windows + NVDA
npm run test:sr -- --voiceover         # macOS + VoiceOver
```

CI runs `--nvda` on `windows-latest` and `--voiceover` on `macos-15`, both with
`guidepup/setup-action`, and both are required. A real reader reads the focused OS
window, so those runs launch a non headless browser with
`__experimentalWindowFocus__`.

## Patched virtual reader (live regions in shadow roots)

`patches/@guidepup+virtual-screen-reader+0.33.0.patch` makes the virtual reader
announce live regions that live inside a shadow root, which is where Lion renders
validation messages. Upstream misses them in three coupled places:

- `observeDOM` observes the container subtree only, so a shadow root is never a
  mutation target's observed tree;
- `getElementFromNode` is `isElement(node) ? node : node.parentElement`, and a
  mutation whose target is a `ShadowRoot` has no `parentElement`, so the target
  resolves to `undefined`;
- `getLiveRegionAttributes` walks up with `parentElement` only, so it cannot reach
  the `aria-live` attribute on a shadow root's host element.

The patch observes shadow roots (including ones attached later, by wrapping
`attachShadow`), maps a `ShadowRoot` target to its host, and hops to the host
while walking up.

**Revisit this patch on every upgrade of `@guidepup/virtual-screen-reader`**: it is
a diff against 0.33.0's browser bundle, which is minified (hence a ~400 KB patch
file for three small edits), and it fails the build rather than degrading silently
because the root `postinstall` runs `patch-package --error-on-fail`. It should be
dropped as soon as the same behaviour lands upstream.

## Failure output

```
screen reader "nvda" did not speak what the test expects (mode: exact)

expected (4 phrases):
    [0] "IBAN"
    [1] "edit"
    [2] "NL17 INGB 0002 8226 08"
    [3] "empty"

heard (5 phrases):
    [0] "IBAN"
    [1] "edit"
    [2] "NL17 INGB 0002822608"
    [3] "empty"
    [4] "invalid"

first divergence at index 2:
    expected: "NL17 INGB 0002 8226 08"
    heard:    "NL17 INGB 0002822608"
```

The reporter prints the transcripts of a whole test file, including the runs that
passed.

## Commands

| command                  | returns             | description                                     |
| ------------------------ | ------------------- | ----------------------------------------------- |
| `sr.initialize()`        | `Promise<Reader>`   | start the reader bound to this run              |
| `sr.stop()`              | `Promise<void>`     | stop the reader                                 |
| `sr.reset()`             | `Promise<void>`     | clear the phrase log so a test sees one state   |
| `sr.phraseLog()`         | `Promise<string[]>` | every phrase spoken since the last reset        |
| `sr.itemText()`          | `Promise<string>`   | text of the item the reader is on               |
| `sr.waitFor(phrase)`     | `Promise<string[]>` | wait until a phrase shows up                    |
| `sr.expect(expectation)` | `Promise<void>`     | assert the spoken phrases, all readers required |
| `sr.press(key)`          | `Promise<void>`     | send a key through the reader                   |
| `sr.type(text)`          | `Promise<void>`     | type text through the reader                    |
| `sr.next(count?)`        | `Promise<void>`     | move to the next item                           |
| `sr.previous(count?)`    | `Promise<void>`     | move to the previous item                       |
| `sr.act()`               | `Promise<void>`     | activate the current item                       |
| `sr.interact()`          | `Promise<void>`     | start interacting with the current item         |
| `sr.stopInteracting()`   | `Promise<void>`     | stop interacting with the current item          |
| `exact(...phrases)`      | `SrPhraseList`      | phrase log has to match one to one              |
| `contains(...phrases)`   | `SrPhraseList`      | phrases have to appear in this order            |

Note on `sr.reset()`: the virtual reader restarts its document, while NVDA and
VoiceOver are stopped and started again, because Guidepup has no portable "go to
the start of the document" command. That is the price of every test observing one
state instead of the transcript of its neighbours.

## License

MIT
