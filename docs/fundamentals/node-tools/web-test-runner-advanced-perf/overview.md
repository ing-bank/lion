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

`@lion-labs/web-test-runner-advanced-perf` adds Chromium performance tracing and repeated statistical measurements to Web Test Runner.

The statistical benchmark API is inspired by [Tachometer](https://github.com/Polymer/tachometer); it is an independent, Web Test Runner-focused implementation and is not a replacement for Tachometer.

## Chrome Metrics and Paint Timing

The plugin uses Chrome's [DevTools Protocol](https://en.wikipedia.org/wiki/Chrome_DevTools#Chrome_DevTools_Protocol) and [Performance Timeline](https://developer.mozilla.org/docs/Web/API/Performance_API/Performance_data) to collect browser performance data during a test. `perf:get-lighthouse-metrics` returns Chrome DevTools metrics and a Lighthouse-style summary calculated from browser entries:

- First Contentful Paint (FCP) is the time until the browser first renders page content.
- Largest Contentful Paint (LCP) is the time until the largest visible content element is rendered.
- Cumulative Layout Shift (CLS) sums layout shifts that did not follow recent user input.
- Total Blocking Time (TBT) sums the time beyond 50 ms for each long task.
- Speed Index is approximated from FCP and LCP; it is a useful relative signal, not a full Lighthouse page-load audit.

These are [Core Web Vitals](https://en.wikipedia.org/wiki/Core_Web_Vitals)-style page metrics. They complement, rather than replace, the component benchmark: they reveal page-level loading, rendering, layout stability, and main-thread blocking, while `runBenchmarks()` measures a specific component operation.

`mode: 'paint'` measures from immediately before the benchmark fixture is created until two nested [`requestAnimationFrame()`](https://developer.mozilla.org/docs/Web/API/Window/requestAnimationFrame) callbacks complete. The first callback waits for the browser's next rendering opportunity; the second ensures the operation has crossed a paint boundary. This is frame timing, not a `PerformancePaintTiming` entry: Paint Timing entries only describe initial page paints such as `first-paint` and `first-contentful-paint`.

## Installation

```bash
npm i -D @lion-labs/web-test-runner-advanced-perf @web/test-runner-commands
```

Configure a dedicated Web Test Runner file with Playwright Chromium. It discovers only `*.statistical-bench.js` files, keeping normal test runs fast.

```js
import { litSsrPlugin } from '@lit-labs/testing/web-test-runner-ssr-plugin.js';
import { playwrightLauncher } from '@web/test-runner-playwright';
import { advancedPerfPlugin } from '@lion-labs/web-test-runner-advanced-perf';

export default {
  browsers: [playwrightLauncher({ product: 'chromium' })],
  nodeResolve: true,
  groups: [
    {
      name: 'statistical-benchmarks',
      files: 'packages/ui/components/**/test/**/*.statistical-bench.js',
    },
  ],
  plugins: [litSsrPlugin(), advancedPerfPlugin({ report: true, statisticalBench: true })],
  testFramework: {
    config: { timeout: '5000' },
  },
};
```

## Statistical Benchmarks

Use `runBenchmarks()` in a browser test to measure an operation repeatedly. For `mode: 'paint'`, the duration starts immediately before the fixture is created and ends after the next paint.

```js
import { fixture, html, expect } from '@open-wc/testing';
import { runBenchmarks } from '@lion-labs/web-test-runner-advanced-perf/browser.js';

const frameBudget = 1000 / 60;

describe('<my-component> statistical benchmarks', () => {
  it('measures component rendering', async () => {
    const result = await runBenchmarks(
      [
        {
          name: 'component-render',
          fixture: () => fixture(html`<my-component></my-component>`),
          cleanup: component => component.remove(),
        },
      ],
      { measure: { mode: 'paint' } },
    );

    expect(result.benchmarks['component-render'].meanCI.high).to.be.below(frameBudget);
  });
});
```

`run` is optional, as in this fixture-rendering benchmark. Add it to measure work performed after fixture creation. Set `reuseFixture: true` to retain one fixture across samples; otherwise every warm-up and measured sample receives a fresh fixture. `reset()` runs after every sample, and `cleanup()` runs for every non-reused fixture.

The result contains statistics for each named benchmark:

```js
result.benchmarks['component-render'].mean;
result.benchmarks['component-render'].meanCI.high;
result.benchmarks['component-render'].relativeStandardDeviation;
```

### Results and Terminology

A [benchmark](<https://en.wikipedia.org/wiki/Benchmark_(computing)>) is a repeatable measurement of one operation. A [sample](<https://en.wikipedia.org/wiki/Sample_(statistics)>) is one measured execution; the default run discards five warm-up samples and retains 50 measured samples. A [confidence interval](https://en.wikipedia.org/wiki/Confidence_interval) gives a range around an estimated value. This plugin uses a 95% Student-$t$ confidence interval because browser timings are sampled and have finite variance.

`runBenchmarks()` returns `Promise<BenchmarkResult>`:

- `baseline`: the name of the benchmark marked `baseline: true`, or `undefined` when none is marked.
- `benchmarks`: a record keyed by benchmark name. Each value is `BenchmarkStatistics` for that benchmark's measured samples.
- `comparisons`: a nested record keyed as `comparisons[candidate][baseline]`. It contains a `BenchmarkDifference` for every distinct pair; positive values mean the candidate is slower than the baseline.
- `enabled`: `true` when the server plugin was configured with `statisticalBench: true`; otherwise the helper throws before returning a result.
- `report`: whether this run contributes its benchmark statistics to the combined overview table printed when the test server stops.
- `resolved`: `true` after the server completed every configured warm-up and measured sample.
- `supported`: `true` for the supported Playwright Chromium session; the helper throws when it is `false`.
- `timedOut`: `false` for a completed result. It is reserved for a runner that ends without a completed measurement.

Every `BenchmarkStatistics` value contains:

- `mean`: the [arithmetic mean](https://en.wikipedia.org/wiki/Arithmetic_mean) duration in milliseconds.
- `meanCI.low` and `meanCI.high`: lower and upper bounds, in milliseconds, of the 95% confidence interval for `mean`.
- `relativeStandardDeviation`: the [coefficient of variation](https://en.wikipedia.org/wiki/Coefficient_of_variation), $\sigma / \mu$, expressed as a ratio. Lower values indicate more stable samples.
- `size`: the integer number of measured samples, excluding warm-ups.
- `standardDeviation`: the sample [standard deviation](https://en.wikipedia.org/wiki/Standard_deviation), $\sigma$, in milliseconds.
- `variance`: the sample [variance](https://en.wikipedia.org/wiki/Variance), $\sigma^2$, in squared milliseconds.

Every `BenchmarkDifference` value contains two 95% confidence intervals for `candidate - baseline`:

- `absolute.low` and `absolute.high`: the difference in milliseconds.
- `relative.low` and `relative.high`: the difference relative to the baseline mean, as a ratio. For example, `0.10` means the candidate is estimated to be 10% slower.

Mark one benchmark with `baseline: true` when interpreting comparisons against a reference implementation.

### Measurement Modes

`callback` measures the period between `controls.start()` and `controls.stop()`, or uses the number returned by `run`.

`global` reads a numeric `globalThis.tachometerResult` written by `run`.

`performance` reads a named Performance Timeline entry. Specify `entryName` and `entryType`; `measure` entries use their duration and other entry types use their start time.

`paint` measures from immediately before fixture creation through a completed paint boundary. It requires Chromium.

### Reporting and Budgets

Set `report: true` in the plugin configuration or benchmark options to print a combined overview table after the test run. Keep pass/fail assertions in the test. For an interaction that must fit a 60 Hz frame, assert against the upper confidence bound:

```js
const frameBudget = 1000 / 60;
expect(result.benchmarks['component-render'].meanCI.high).to.be.below(frameBudget);
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
