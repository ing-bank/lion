# @lion/test-runner-screenreader

Web Test Runner plugin and commands for testing what a screen reader speaks, via
[Guidepup](https://www.guidepup.dev/). Private tooling: it exists to run the Lion
screen reader test flow, not to be published yet.

## Why this exists

About 15 years ago it was normal not to write unit tests for frontend code: a manual tester clicked
through all functionality before a release. In a frontend optimised for continuous delivery that is
unthinkable. Screen reader output is still in that era - it is hand-checked on the components
somebody happens to work on, so regressions reach the users who depend on it most.

This flow moves that check into the pipeline. The spoken output of a **real NVDA** (windows) and a
**real VoiceOver** (macos) becomes an assertion, one file per component, and both readers are
blocking gates; `virtual` stays for the fast local loop. What it found on its first component:
while typing, `<lion-input-iban>` is announced unformatted and **not** invalid (by design, no
nagging halfway through an IBAN), and on commit the invalid state plus the message are what a user
hears. Both are pinned now.

An empty spoken phrase log is a hard failure, never a pass.

## What the flow looks like

A component gets one screen reader test file next to its other tests:

```
packages/ui/components/input-iban/test/lion-input-iban.sr.test.js
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
    await sr.focus('lion-input-iban'); // real readers follow OS focus
    await sr.next(); // the virtual reader walks its own cursor
    await sr.expect({
      virtual: contains('textbox, IBAN, not disabled, not invalid'),
      // what each real reader actually said in CI
      nvda: contains('blank'),
      voiceover: contains('IBAN edit text'),
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
- Phrases are compared with runs of whitespace collapsed and empty entries
  dropped: readers pad their announcements (`"IBAN, edit, "` for NVDA) and
  guidepup's log can carry an empty phrase for "nothing said". Padding is not
  meaning, so the written expectation carries the words only.
- There is no update mode. A run passes or fails like any other test; on a
  mismatch the failure output shows the expected and heard phrase log, and the
  developer updates the expectation in the test.

## Running it

```bash
npm run test:sr                        # local, virtual reader (any OS)
npm run test:sr -- --files "packages/ui/components/input-iban/test/*.sr.test.js"
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

## Known limits

A server command has to answer within **20000ms**. That limit is hardcoded in
`@web/dev-server-core`'s `webSocketsPlugin` (a late answer fails the test with "Did not receive a
server response ... within 20000ms") and cannot be raised through the test runner config, so one
`sr.*` step has to fit in it. What makes a step slow:

- waiting for a reader to speak inside the command (that is why `sr.waitFor` defaults to 15s and
  why a reader that speaks slowly is a problem: VoiceOver's speech lags the command that caused it);
- typing or pressing **through** a reader that waits for the speech of every keystroke - VoiceOver
  typing an 18 character IBAN exceeded the limit, so its typing and pressing go through the
  browser's keyboard instead;
- an anchor that runs several reader commands: `sr.focus()` does one for VoiceOver (move the
  cursor, then ask for the announced item) plus a settle, and a third command pushed it over.

`npm run lint:sr-command-budget` keeps the numbers we control on the safe side: the budget and
hard limit constants, the wait default, literal wait timeouts in the tests, and the test timeout
versus the time the whole suite may take. Every command that runs past the budget is also reported
at runtime (`[sr-budget] sr-type took 16.4s ...`), which is the only way to catch a _reader_ that
got slower.

## Commands

| command                  | returns             | description                                     |
| ------------------------ | ------------------- | ----------------------------------------------- |
| `sr.focus(selector)`     | `void`              | anchor the reader on a control (see below)      |
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
| `containsLike(...texts)` | `SrPhraseList`      | each text has to be part of a spoken phrase     |

Note on VoiceOver: its cursor does not start inside the browser. The machine setup
leaves a mounted preferences volume in the Finder and VoiceOver reads that instead
(its log held `"guidepup-voiceover-preferences-macos-15 Volume"` for every phrase in
CI), so the flow puts the browser in front and selects its web content through the item
chooser once the reader is up - the recipe from guidepup's own Playwright example, with
the public commands. `screenreaderPlugin({ appId })` names the browser's macOS
application id (Playwright's webkit build by default).

Note on `sr.reset()`: it only clears the logs. A real reader is left running and is
not repositioned. VoiceOver has `keyboardCommands.moveToFirst`, NVDA has no such
command, and restarting NVDA between tests means start/stop bookkeeping on a reader
that throws on a double start ("NVDA is already running") and on stopping one that
is not running ("NVDA is not running"). The virtual reader restarts its document.

Because a real reader is not repositioned, a test says what it is about:
`sr.focus('lion-input-iban')` focuses the control a component delegates focus to
(its inner input, which Lion fields keep in the light DOM), and NVDA and VoiceOver
follow that OS focus. The virtual reader has its own cursor instead of OS focus, so
a test that needs it to walk to the control also calls `sr.next()`. Both are the
same two lines per test, and neither depends on where the reader was left after the
previous test.

`containsLike` exists for what a reader _decorates_: a live region announcement
arrives as `"polite: Error,, Please enter a valid IBAN."`, where the politeness and the
joined additions phrase are not what a user hears. The message itself is asserted with
`containsLike('Please enter a valid IBAN')`; use `contains` when the whole phrase is
the point.

Note on waits: `sr.waitFor()` defaults to 15s, below the 20s after which the browser
side gives up on a test runner command, so a phrase that never comes is reported as
that phrase and not as a transport error. `sr.waitFor()` matches on `includes`, so it
works with a decorated phrase.

Note on committing a value: a real reader leaves the page on `Tab` when the field is the
only focusable thing in it (the next stop is the browser chrome, and the log then holds
"localhost:8000 … Google Chrome for Testing, region"), and NVDA echoes every character it
types while typing. So a test fixture keeps a focusable neighbour next to the field, the
test types, presses `Tab` to commit (`FormatMixin` commits on change) and `Shift+Tab` to
come back to the field, and then re-anchors with `sr.focus()` + `sr.next()`. Waiting for
the typed value happens in the DOM, not in the reader's log.

Note on `sr.focus()`: for the virtual reader it gives the reader a fresh walk of the page
(the virtual reader has no OS focus to follow, so the `sr.next()` steps start from the
top again) and leaves the phrase log alone, so a test still asserts over everything that
was said before.

## License

MIT
