---
title: What NVDA and VoiceOver actually say, asserted in CI
published: true
description: The spoken output of a real NVDA and a real VoiceOver is now a test assertion, one file per component next to the unit tests, with both readers blocking in CI. Virtual stays for the fast local loop, because a spec model cannot tell you what a user hears.
date: 2026-10-14
tags: [accessibility, testing, javascript]
cover_image: /blog/images/screenreader-ci.png
cover_credits: "plate, scene and mark - Lion"
eleventyNavigation:
  key: What NVDA and VoiceOver actually say, asserted in CI
  title: What NVDA and VoiceOver actually say, asserted in CI
---

About fifteen years ago it was normal not to write unit tests for frontend code. Every release, a manual tester clicked through all the functionality. In a frontend landscape built for continuous delivery that is unthinkable today.

Screen reader output is still that manual tester. We hand-check whether a component is announced correctly, on the components we happen to be working on, on a schedule that is whatever we remember. Too expensive to repeat per change, so a regression reaches the people who depend on the output most. Now the speech of a **real NVDA** on Windows and a **real VoiceOver** on macOS is a test assertion, one file per component, next to the unit tests. Both readers block in CI; `virtual` stays for the quick local loop.

An earlier proof of concept drove a dialog with a real reader, and it worked. What was missing was a flow a component author could use without knowing the tool, and gates that make it count.

## One extra file, next to the tests we already have

```
packages/ui/components/input-iban/test/lion-input-iban.sr.test.js
```

It is a normal Web Test Runner file - `describe`, `it`, `fixture` - with the expected speech inline:

```js
await sr.expect({
  virtual: contains('textbox, IBAN, FOO, not disabled, invalid'),
  nvda: contains('IBAN', 'edit', 'Please enter a valid IBAN'),
  voiceover: contains('IBAN', 'text field', 'Please enter a valid IBAN'),
});
```

```sh
npm run test:sr -- --virtual      # local, headless, no desktop reader needed
npm run test:sr -- --nvda        # the real thing on windows
npm run test:sr -- --voiceover   # the real thing on macos
```

One expectation describes **every** reader, so the local run and the two blocking CI runs are one artefact, not three drifting copies. The type is `Record<'virtual' | 'nvda' | 'voiceover', SrPhraseList>`, and the `packages/ui` type gate rejects a missing or unknown key (an `all:` key fails with `TS2353`).

The difference, in one table:

|                                          | before                                                        | after                                                   |
| ---------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| how an announcement is checked           | by hand, on the components someone happens to touch           | a file that runs with the suite                         |
| when                                     | whenever we remember                                          | on every change that can reach that component           |
| what a regression does                   | reaches users                                                 | fails the build                                         |
| the local loop                           | needs a desktop reader, or gets skipped                       | `--virtual`, headless                                   |

## Four layers, and only the last one answers the question

Between the markup and a user there are four layers, and only the last one answers "does this actually work?":

1. **DOM** - what we write. axe and `expect(el).to.be.accessible()` read this layer and stop: they prove a name, role or state is *exposed*, never what is *heard*.
2. **ARIA and the APG** - the ideal: what a reader supporting every attribute would announce. The APG itself says its examples carry an assistive technology support summary "when available".
3. **The AOM snapshot** - closer: the browser's accessibility tree proves the DOM-to-AOM translation went through, in that browser and engine only.
4. **The screen reader** - the truth. The AOM-to-speech step is the last one, and the only place the question can be answered.

`aria-controls` is the worked example, checked against [a11ysupport.io](https://a11ysupport.io/tech/aria/aria-controls_attribute) rather than folklore: the spec defines it, the APG uses it, Chromium exposes it in the AOM - and of the tested combinations JAWS, NVDA, Narrator, Orca and VoiceOver convey its *presence* as none. Only JAWS can jump to the controlled element, and the setting that could speak the attribute disappeared in JAWS 2020.

Our own runs show it from the other side: the virtual reader models the spec and announces "1 control" for a combobox, while NVDA announced "blank" and nothing about what the button controls. A spec model says what should happen; it cannot say what a user hears, which is why it is not a gate.

## What the real readers forced

Three things showed up only with a real reader on a real desktop:

- **VoiceOver cannot be driven through the reader's own typing API.** It types into whatever the OS focus is on, which drifted off the field. VoiceOver gets real keyboard events through the browser instead; NVDA and the virtual reader type and press through the reader.
- **Every command has to answer within 20 seconds.** That number is hardcoded in the websocket plugin of `@web/dev-server-core` - the only browser-to-node channel Web Test Runner has - and is not configurable. A `lint:sr-command-budget` check runs as part of `npm run lint`, so a test that would outlive the budget fails in review instead of in a macOS queue.
- **Restarting a reader per test is a trap.** NVDA has no portable "go to the top of the document" command, and a stop/start cycle mid-run leaves it dead.

The flow enforces the rest. Input goes through the reader - `sr.focus`, `sr.type`, `sr.press`, `sr.next`, with `sr.waitFor(phrase)` instead of sleeps - because NVDA and VoiceOver only speak what their own keyboard input produced; setting `modelValue` tests nothing. `sr.reset()` in `beforeEach` gives each test one state instead of its neighbour's transcript, and `sr.focus(selector)` anchors it, since the real readers follow OS focus. `contains(...)` is a state, `containsLike(...)` a live region announcement whose politeness prefix ("polite: Error,, ...") is packaging rather than something anyone hears.

There is no update mode. A run passes or fails, and a failure prints the expected and heard phrase logs plus the first divergence:

```
expected (4 phrases):
    [2] "NL17 INGB 0002 8226 08"
heard (5 phrases):
    ...
first divergence at index 2:
    expected: "NL17 INGB 0002 8226 08"
    heard:    "NL17 INGB 0002822608"
```

An empty phrase log is a hard failure, never a pass, and `--virtual` is refused when `CI` is set, so a virtual run cannot sneak in as the blocking check.

## One cheap selector, two expensive readers

`SR automation` has three jobs. `select` runs on Ubuntu and asks the change graph which `.sr.test.js` files this change can reach. `voiceover` on `macos-15` and `nvda` on `windows-latest` declare `needs: select`, so they only start when there is something to run, and receive exactly those files.

The selection is measured: touching `form-core/src/validate/ValidateMixin.js` - the worst case, a shared base - selects 29 of 53 units, 94 of 173 test files, instead of everything. Touching `input-iban/src/LionInputIban.js` selects 2 units: 12 test files with screen reader tests included. When a change reaches no component test, the workflow costs one ~60 second Ubuntu job instead of a roughly 7 minute macOS run plus a roughly 7 minute Windows run.

Each reader job sets up the machine and the reader assets with `npx @guidepup/setup@0.29.2 setup --ci` and `install`, then launches a non-headless browser with `__experimentalWindowFocus__`, because a real reader reads the focused OS window. `virtual` stays headless.

## What it found on the first component

It starts with `<lion-input-iban>`; the flow is component-agnostic. While typing, the field is announced unformatted and **not** invalid - by design, since `FormatMixin.formatOn` is `change` and we do not nag halfway through an IBAN. On commit, the invalid state and the message are what a user hears. Both are pinned now, which is the point: that was a decision, and only a test keeps it.

## Where this stands

This is in review, so the details are current rather than settled. What is verified: the virtual run passes (3 passed, 0 failed); the reader jobs are green on the run that first used the selection - both readers, all three input-iban tests (empty, filled, invalid) on each; the type gate is at 0 errors with the `.sr.test.js` file inside the `packages/ui` program; the plugin package's own mocha tests pass (15); and the default suite is untouched, since `*.sr.test.js` is invisible to the default `${dir}/**/*.test.js` glob - input-iban's 5 default files still run 49 tests.

Two honest caveats. The expected speech is hand-written per reader, so a new component is authoring work, not free coverage; the flow makes it cheap, not automatic. And VoiceOver's help banner occasionally steals an announcement - that is the one flaky step, the IBAN error, and it is what the log shows when it fails.

Underneath, the reader moves 0.24.1 to 0.36.1 and the virtual reader 0.24.2 to 0.33.0; the virtual bundle is resolved with `import.meta.resolve` instead of hardcoded `node_modules` paths, which moved between those versions. A local patch to the virtual reader at 0.33.0 makes it announce a live region rendered inside a shadow root, which is where Lion puts validation messages. Upstream misses it in three coupled places - the observer does not cross shadow boundaries, `getElementFromNode` resolves a `ShadowRoot` target to `undefined`, and the ancestor walk cannot leave a shadow root. The upstream issue and PR are open, and the patch should disappear with them; until then `patch-package --error-on-fail` fails the build rather than degrading silently.

If you maintain a design system, the transferable part is not the tooling. It is the ordering: we test the DOM heavily and the speech barely, while speech is the layer the people who need it actually receive.
