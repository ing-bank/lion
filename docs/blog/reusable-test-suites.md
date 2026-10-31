---
title: Behaviour tests you inherit instead of copy
published: true
description: A layer built on Lion can run Lion's own behavioural suites against its own elements - about 3.6k assertions - so the behaviour stays in one place instead of a second copy that drifts. You hand a suite the elements to run against, and it runs the same tests we run.
date: 2026-10-30
tags: [javascript, testing, web-components]
cover_image: /blog/images/reusable-test-suites.png
cover_credits: "plate, scene and mark - Lion"
eleventyNavigation:
  key: Behaviour tests you inherit instead of copy
  title: Behaviour tests you inherit instead of copy
---

If you build a design system on top of Lion, you have a private `my-ui` with its own elements: your styling, your slot structure, your extra attributes. That part is yours and should stay yours. What was never really yours is the behaviour underneath - the accordion that opens on Enter and closes on Escape, the drawer that traps focus, the datepicker that refuses an invalid date. And until now you had two options for testing it.

Copy Lion's `test/` files into your repo, where they slowly drift, keep asserting Lion's markup, and rot the moment either side moves. Or ship without behaviour coverage, and find out from a screen reader user that your `h2` invoker does not announce the panel.

There is now a third option: **run our suites against your elements**.

```js
import { runAccordionSuite } from '@lion/ui/accordion-test-suites.js';

runAccordionSuite({
  classes: {
    host: MyAccordion, // your element; the suite registers it when it has no tag yet
    invoker: 'h2', // native elements are passed as their tag
    content: 'div',
  },
});
```

One import, one call per component, and the assertions are the ones we run on `lion-accordion` itself. That is **about 3.6k assertions** in the suite as a whole. You are not maintaining a second copy of the behaviour; you are executing the one Lion keeps.

## `classes` works like `scopedElements`

The keys are Lion's tag names without the `lion-` prefix. That is deliberate - it is the same mental model as `scopedElements`, so the mapping is one you already know rather than a new vocabulary to learn.

**Lion's own element is the default for every key.** A runner called with nothing runs against Lion itself, which is how our own test files now call it. You only name the roles you replace, and you can replace just the parts you actually swap out:

```js
runDrawerSuite({ classes: { invoker: MyButton } });
```

Every element a suite renders has a role: a component's public slots (`invoker`, `content`, `headline`, `option`, `tabs`, `fieldset`, and so on), plus `host` for the element under test, and `parent` / `child` / `portal` where a suite has to assemble its own subject. Native elements are passed as their tag string, custom elements as their class.

The whole thing is typed with one shared generic, `SuiteConfig<Roles, Options>`, exported from `@lion/ui/types/test-suites.js`. Each runner narrows it to the roles and options it actually has, so a typo in a role key fails your type check at your call site. **Not a silent test against the wrong element** - which is the failure mode you would never notice, because the test still passes.

## The suites assert through page objects, not through our markup

This is the part that makes it work for a system that looks nothing like Lion.

A suite does not reach into a `shadowRoot` and query our internal structure. It goes through a page object: `runDatepickerSuite` takes an `InputObject`, `runCalendarSuite` takes a `CalendarObject`. If your overlay or your calendar markup differs - and it will - you override those getters, and the suite stays ignorant of your DOM. Your override describes how to find the pieces; the assertions still belong to us.

The same discipline applies to accessibility. We assert the accessible **name**, not the mechanism that produces it. `aria-label` on the host, `aria-labelledby` pointing at a visually hidden span, a real `<label>` element - all pass, because what is checked is what a screen reader would announce. **A different but equally accessible solution is not a test failure.** That is the only way a suite can be shared without encoding one implementation's opinions.

## What it took on our side

We did not write a parallel product. We moved our own tests onto the contract and deleted what became redundant:

| | |
| --- | --- |
| suite files (`*suite.js`) | **59**, exported through **32** `*-test-suites.js` entry points |
| runners (`runXSuite`) | **53** |
| duplicate probe files removed | **29** `*-classes.test.js` files that only re-ran default behaviour |
| full Chromium set | **3662 passed / 0 failed** |

Those 29 deleted files are the point of the exercise in miniature. They existed to re-check that a subclass still behaved like its base - exactly the check a shared suite does properly, against the roles you actually substituted.

Each of the 53 runners has the same destructured signature: `classes: { role = LionElement } = {}`. No `cfg.x = ...` mutation anywhere. Uniformity is not aesthetic here; it is what lets a suite default any role and lets you override any role without reading that component's source first.

## Honest caveats

- **The API is additive.** Nothing that compiled before stops compiling. The older `klass` and `tagString` options still work - they are typed and marked `@deprecated` - and the docs describe `classes` only. We are moving our own suites over.
- **It is a test-time dependency, not a runtime one.** These entry points import the suite and its page objects; they do not change what your components ship.
- **Not everything is covered.** 53 runners is broad, not total. If a component you extend has no runner, the copy-or-nothing choice is still in front of you for that component - though the pattern is now proven enough to add one.
- **One measured exception in the browser matrix.** A focus test in `OverlayController` skips itself on Safari through Lion's own browser detection. We gate on Safari 16 (WebKit 16.4 in Playwright 1.35.1) as the oldest engine we claim, and that single skip is real, not papered over.
- **Suites can be wrong.** While folding the duplicate probes in, some suites turned out to encode assumptions only one browser satisfied, and had to be fixed. That is a good trade - one fix, inherited by every consumer - but it does mean the suite is a shared dependency with a shared bug surface, not a certificate.

## Where this stands

The contract is written down in `docs/guides/principles/test-suites.md`, and it is deliberately short: roles in, page-object overrides when your markup differs, assertions stay ours.

If you maintain a layer on Lion, the transferable lesson is not "share tests". It is that **the thing worth sharing is the assertion, not the test file**. A test file carries a fixture, a markup assumption and an import path; an assertion carries only the guarantee. Once you separate them, a downstream team can inherit the guarantee and keep their own fixture - and the copy that drifts disappears because there is nothing left to copy.
