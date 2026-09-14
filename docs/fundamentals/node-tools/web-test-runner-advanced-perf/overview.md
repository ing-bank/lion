---
parts:
  - Overview
  - Web Test Runner Advanced Perf
  - Node Tools
title: 'Web Test Runner Advanced Perf: Overview'
eleventyNavigation:
  key: Node Tools >> Web Test Runner Advanced Perf >> Overview
  title: Overview
  order: 50
  parent: Node Tools >> Web Test Runner Advanced Perf
---

# Web Test Runner Advanced Perf: Overview

`@lion/web-test-runner-advanced-perf` adds Chromium performance tracing and repeated statistical measurements to Web Test Runner.

## Installation

```bash
npm i -D @lion/web-test-runner-advanced-perf @web/test-runner-commands
```

Configure the plugin with a Playwright Chromium launcher. Statistical benchmarks are opt-in so normal test runs stay fast.

```js
import { playwrightLauncher } from '@web/test-runner-playwright';
import { advancedPerfPlugin } from '@lion/web-test-runner-advanced-perf';

export default {
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [advancedPerfPlugin({ statisticalBench: true, report: true })],
};
```

## Statistical Benchmarks

Use `runBenchmarks()` in a browser test to measure an operation repeatedly. Every fixture is created before its timing window. For `mode: 'paint'`, the duration starts immediately before `run()` and ends after the next paint.

```js
import { fixture, html } from '@open-wc/testing';
import { runBenchmarks } from '@lion/web-test-runner-advanced-perf/browser.js';
import '@lion/ui/define/lion-select-rich.js';

const result = await runBenchmarks(
  [
    {
      name: 'open-listbox',
      fixture: () => fixture(html`<lion-select-rich></lion-select-rich>`),
      run: async selectRich => {
        selectRich.opened = true;
        await selectRich.updateComplete;
      },
      cleanup: selectRich => selectRich.remove(),
    },
  ],
  { measure: { mode: 'paint' } },
);
```

`run` is optional, which is useful when fixture setup is the operation under test. Set `reuseFixture: true` to retain one fixture across samples; otherwise every warm-up and measured sample receives a fresh fixture. `reset()` runs after every sample, and `cleanup()` runs for every non-reused fixture.

The result contains statistics for each named benchmark:

```js
result.benchmarks['open-listbox'].mean;
result.benchmarks['open-listbox'].meanCI.high;
result.benchmarks['open-listbox'].relativeStandardDeviation;
```

`meanCI` is the 95% confidence interval for the measured mean. With two or more benchmarks, all pairs are compared in `result.comparisons`. Mark one benchmark with `baseline: true` to designate it as the baseline in the result.

### Measurement Modes

`callback` measures the period between `controls.start()` and `controls.stop()`, or uses the number returned by `run`.

`global` reads a numeric `globalThis.tachometerResult` written by `run`.

`performance` reads a named Performance Timeline entry. Specify `entryName` and `entryType`; `measure` entries use their duration and other entry types use their start time.

`paint` measures from the start of the benchmark operation to the next rendered frame. It requires Chromium.

### Reporting and Budgets

Set `report: true` in the plugin configuration or benchmark options to print a combined overview table after the test run. Keep pass/fail assertions in the test. For an interaction that must fit a 60 Hz frame, assert against the upper confidence bound:

```js
const frameBudget = 1000 / 60;
expect(result.benchmarks['open-listbox'].meanCI.high).to.be.below(frameBudget);
```

### Containerized Runs

The repository provides a resource-capped Podman command for comparable local and CI runs:

```bash
npm run test:statistical-bench:podman
```

It builds [Containerfile.statistical-bench](../../../../Containerfile.statistical-bench) with the pinned Node and Playwright Chromium versions, then runs the benchmark with two CPUs, 4 GiB of memory, a 512-process limit, 1 GiB of shared memory, and no network access. The image is built from the current working tree, so uncommitted changes are included.

On macOS, initialize Podman's Linux VM once with matching capacity before using the command:

```bash
podman machine init --cpus 2 --memory 4096
podman machine start
```

Container limits standardize the workload, not the underlying CPU. Use the same runner class for absolute budgets; use baseline-relative comparisons for results from different CPU architectures or busy hosts.

## Trace Commands

The plugin also accepts Web Test Runner commands for Chromium tracing:

- `perf:start` starts a DevTools timeline trace for the current test session.
- `perf:stop` stops the trace and returns forced-layout events and rendering metrics.
- `perf:measure-render` measures an animation-frame render interval, optionally forcing a reflow for diagnosis.
- `perf:get-lighthouse-metrics` returns browser performance metrics and a Lighthouse-style score.

The legacy aliases `advanced-perf:*`, `forced-layout-trace:*`, and `measure-render` are supported where applicable.
