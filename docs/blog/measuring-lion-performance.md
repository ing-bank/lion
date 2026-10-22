---
title: Measuring (and fixing) Lion's performance — a feedback loop
published: false
description: Lion's overlays no longer force layout on first paint, and the PR that did it also shipped the measurement + CI guards that turn performance work into a compounding feedback loop.
date: 2026-10-22
tags: [javascript, performance, web-components]
eleventyNavigation:
  key: Measuring Lion performance
  title: Measuring Lion performance
---

Performance work in a component library has a hard problem: proving it helped. A refactor "feels" faster in demos, a reviewer asks "did it actually regress?", and the consensus is a debate instead of a measurement. This PR attacks that directly — it both **fixes a real forced-layout cost in every overlay** and **ships the instrumented loop that makes performance work measurable and guarded from now on**.

## The problem: forced layout on the render path

When an element constructs, any synchronous geometry read (`getBoundingClientRect`, `clientWidth`, `getComputedStyle`) before first paint is cheap on a quiet page but forces layout on a busy one — and for an element created during page load, that read sits squarely on the **First Contentful Paint (FCP)** path. Lion's overlays (dialog, menu, tooltip — the majority of UI) were doing exactly this: the width-alignment logic read the dropdown's box synchronously, and a handful of reads ran during setup.

We got tired of _saying_ "it's faster". So the PR does three things:

## 1. Remove the forced layout

- The **average overlay now forces `0` layout events during construction** (measured `3 → 0`). The dialog-setup `getComputedStyle` check is rAF-deferred — its fix only matters once the overlay is _shown_, and the content is `display:none` at construction, so a frame later is well before anyone opens it.
- The **select-rich dropdown-width regression** is fixed: the dropdown was `_arrowWidth` (28px) narrower than its invoker. Now equal, proven by a width assertion and a visual test.
- **select-rich construction: `13 → 2` forced-layout events** — the per-option re-reads (reset → measure → re-apply) are coalesced into a single `requestAnimationFrame` + `ResizeObserver` pass.
- Menu overflow fitting moved from a `setTimeout` debounce to a `ResizeObserver`, off the render path.

The one residual — select-rich's hidden-content width pre-size — is a deliberate trade: eliminating it would keep the closed dropdown laid out, causing an invoker-width snap on first paint. We judged the snap not worth it and documented the read instead of silently carrying it.

## 2. Make it measurable

The fix is proven against a **baseline worktree at the previous state**, not by assertion:

- `@lion-tools/smart-baseline` runs _any_ spec in the current worktree against a baseline worktree checked out at the previous revision (`git worktree add --detach`). Baselines are re-derived from git — no heavy artifact store, no repo pollution, at most the ref needed to reproduce a previously accepted baseline.
- `@lion-labs/test-runner-advanced-perf` distinguishes **forced** from **scheduled** layout (Chromium CDP) and exposes an FCP proxy — the number of forced-layout events during construction → first render.

That turns "did this help?" into a `git rev-parse` away.

## 3. Guard it

So a regression can't silently return:

- `lion/no-forced-layout-reads` runs at `error` — a synchronous geometry read can't be added without an explicit, justified disable.
- `fcp-construction.test.js` asserts construction limits in CI (Chromium), so reintroducing a read on the FCP path fails the build.

## The feedback loop

This is the part we're most excited about. Every future performance PR now reuses the same harness instead of re-inventing measurement — and because smart-baseline is **performance-agnostic**, the loop extends far beyond forced layout: FCP, paint, layout shift, INP, memory, bundle size. The result compounds: each perf improvement is proven, stays guarded, and raises the bar for the next.

On the roadmap: per-component paint budgets, CLS-on-open/close, INP budgets on common flows, repeated open/close leak tests, and a real-user web-vitals harness over the most common Lion components.

Performance work stops being a vibes conversation. It becomes a feedback loop.
