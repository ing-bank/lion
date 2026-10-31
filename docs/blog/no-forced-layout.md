---
title: Zero forced layouts in the render path
published: true
description: Opening a Lion overlay no longer forces a layout during construction and first render - 3 forced-layout events down to 0, measured against a baseline worktree of the previous state. select-rich drops from 13 to 2, and the harness that proves both numbers now ships with the fix.
date: 2026-09-11
tags: [javascript, performance, web-components]
cover_image: /blog/images/no-forced-layout.png
cover_credits: "plate, scene and mark - Lion"
eleventyNavigation:
  key: Zero forced layouts in the render path
  title: Zero forced layouts in the render path
---

Opening an overlay - a dialog, a menu, a tooltip - is the single most common thing a Lion app does, and until now every one of them forced the browser to lay out the page during construction and first render. A forced layout is what happens when JavaScript reads a geometric value (an element's width, its position, a computed style) right after it has changed something the browser has not yet re-laid-out. The browser cannot answer the question from a stale cache, so it stops and runs layout synchronously, on the main thread, in the middle of your render - exactly the moment you least want to pay for it.

We took that read out of the render path. On top of the fix we built a measurement harness, so the next perf change is provable instead of asserted.

## The numbers

Measured against a **baseline worktree of the previous state**: the same spec runs against the current worktree and against a worktree at the base commit, and the forced-layout events are counted on each. Forced-layout events during construction / first render, before and after:

| operation                       | before | after |
| ------------------------------- | ------ | ----- |
| plain overlay (average)         | 3      | **0** |
| OverlayController + content-width | 3    | 2     |
| select-rich                     | 13     | 2     |
| **total**                       | **19** | **4** |

The average overlay is now clean: **3 to 0**. select-rich, the heaviest of the set, is **13 to 2**. The remaining two are a single forced-layout cycle - one `UpdateLayoutTree` plus one `Layout` - and we explain below why we left them rather than claiming a rounder zero.

The overlay operations themselves (median forced-layout events over 5 runs) are largely unchanged, which is the honest part:

| operation            | before | after |
| -------------------- | ------ | ----- |
| select-rich-add-option | 4    | 2     |
| align-reference-width  | 2    | 2     |
| local-show (popper)    | 6    | 6     |
| local-hide             | 2    | 2     |
| body-size-show         | 2    | 2     |
| global show/hide       | 0    | 0     |

Most of the win is on the construction/first-render path, not on every operation.

## What changed

Four things, each small:

- **`OverlayController`** ran `getComputedStyle(contentNode).position` during dialog setup. That read only matters once the overlay is shown - at construction the content is `display: none` and has no layout box anyway - so we defer it with `requestAnimationFrame`. One forced style/layout-tree read leaves every overlay's first-render path.
- **Reference-width handling** re-read the wrapper to learn the box. The `ResizeObserver` already delivers `borderBoxSize`, so we use that instead of reading again - one less forced read on the reactive resize path.
- **`LionSelectRich`** re-read its options on every option change (`reset → measure → re-apply`). `_alignInvokerWidth` now coalesces those reads into a single `requestAnimationFrame` (cancelled on teardown), so the repeated per-option reads collapse to one scheduled pass.
- **`MoreButtonMenuMixin`** fitted overflow with a `setTimeout` debounce plus a `window` resize listener. A `ResizeObserver` drives it now, with its initial callback off the render path.

The distinction that matters throughout is **forced** versus **scheduled**. Deferring a read to a frame callback does not make it free; it moves it off the critical path between a write and the browser's own layout, which is where the synchronous stall comes from.

## The dropdown-width regression

While measuring we found a real bug: the select-rich dropdown was rendering `_arrowWidth` - 28px - **narrower than its invoker**. The width handling that produced the fix also produced this. It is fixed now, and it is proven two ways: a width assertion (the dropdown and the invoker measure equal) and a visual test.

One consequence worth naming: the visual gate still reports the dropdown screenshot as differing from the *master* baseline, because the change alters the rendered width. That is a baseline-update decision, not a layout regression - the width assertion passes. We would rather flag it than quietly re-approve a screenshot.

## The part we actually want to keep

A fix decays. A harness compounds. The second half of this work is instrumentation, and it is deliberately agnostic about what it measures:

1. **Measure** - `@lion-tools/smart-baseline` runs *any* spec in the current worktree against a baseline worktree at the previous state. Baselines are derived from git, so there is no heavy artifact store and nothing polluting the repo.
2. **Trace** - the advanced perf test runner now distinguishes forced from scheduled layout over the Chromium CDP, and exposes an FCP proxy that counts forced-layout events between construction and first render.
3. **Guard** - a new `no-forced-layout-reads` lint rule plus a construction spec assert construction limits, so a reintroduced FCP read fails CI - statically, by the lint, and at runtime, by the spec.

Because the baseline comparison is performance-agnostic, the loop is not limited to forced layout. FCP, paint, memory, bundle weight - anything you can express as a spec and a number goes through the same compare-and-guard pipeline. That is the point: the next perf change should not begin by reinventing measurement.

## Honest residuals

- **select-rich stays at 2** (one forced-layout cycle). It is the hidden-content width pre-size: the closed dropdown lives in a `display: none` dialog with no layout box, so a `ResizeObserver` has nothing to report and the width genuinely must be read. Removing the read would mean keeping the closed content laid out, which produces an invoker width snap on first paint. We judged the snap not worth it and left the read, documented, rather than pretending the number is zero.
- **Popper positioning and `requestToKeepBodySize`** are untouched paths, out of scope here, and their counts are unchanged. They are candidates for the same treatment, not oversights.
- **The visual baseline** still needs an update decision for the select-rich dropdown, as above.

## Where this stands

This is **still in review** at the time of writing - none of it is merged yet. What the change ships as: the overlay render path with zero forced layouts on the common case, select-rich down to a single cycle, the dropdown-width bug fixed, and the measurement loop that makes all of it checkable against a baseline worktree rather than taken on faith.

If you take one transferable lesson: a forced layout is a read that arrives a moment too late to be cheap, and the fix is almost never a cache - it is to schedule the read instead of forcing it. The second lesson is that you cannot tell which reads those are by reading the code; you find them by counting them, before and after, against a baseline you can re-derive.
