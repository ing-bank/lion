/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
// @ts-ignore
import { css as css2 } from 'lit';
import { css as css1 } from 'lit-element';
// // @ts-ignore
import { cssHybrid } from '../../packages/lit-hybrid/src/hybrid-lit/css-hybrid-tag.js';
import { queryParams } from '../utils/query-params.js';

/**
 * @param {string|object} output
 */
function debug(output) {
  const p = document.createElement('p');
  p.innerHTML = typeof output === 'string' ? output : JSON.stringify(output);
  document.body.appendChild(p);
}

(async () => {
  /**
   * @param {any} cssTag
   * @param {number} depth
   */
  // @ts-expect-error
  function generateCssLvl(cssTag, depth) {
    let tagToUse = cssTag;
    if (depth < 0) {
      return;
    } else if (depth === 0) {
      // Make sure that leaf nodes use css, so we measure effect of making that hybrid v1 compatible (2^depth times)
      // tagToUse = css;
    }
    // const x = tagToUse`.something { ${generateCssLvl(
    //   cssTag,
    //   depth - 1,
    // )} } .something-else { ${generateCssLvl(cssTag, depth - 1)} }`;
    // console.log({ x });
    return tagToUse`.x {color:blue;}`;
  }

  /**
   * @param {any} cssTag
   */
  function generateCss(cssTag, depth = 100) {
    generateCssLvl(cssTag, depth);
  }

  (async () => {
    const updateComplete = () => new Promise(r => requestAnimationFrame(r));

    const benchmark = queryParams.benchmark;
    const getTestStartName = (/** @type {string} */ name) => `${name}-start`;

    debug({ benchmark });

    const css2Perf = async () => {
      const test = 'css2';
      if (benchmark === test || !benchmark) {
        const start = getTestStartName(test);
        performance.mark(start);
        generateCss(css2);
        await updateComplete();
        performance.measure(test, start);
      }
    };
    await css2Perf();

    const css1Perf = async () => {
      const test = 'css1';
      if (benchmark === test || !benchmark) {
        const start = getTestStartName(test);
        performance.mark(start);
        generateCss(css1);
        await updateComplete();
        performance.measure(test, start);
      }
    };
    await css1Perf();

    const cssHybridPerf = async () => {
      const test = 'cssHybrid';
      if (benchmark === test || !benchmark) {
        const start = getTestStartName(test);
        performance.mark(start);
        generateCss(cssHybrid);
        await updateComplete();
        performance.measure(test, start);
      }
    };
    await cssHybridPerf();

    // Log
    performance
      .getEntriesByType('measure')
      .forEach(m => console.log(`${m.name}: ${m.duration.toFixed(3)}ms`));
  })();
})();
