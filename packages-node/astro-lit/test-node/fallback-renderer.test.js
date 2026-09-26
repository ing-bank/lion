/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Unit tests for `FallbackRenderer`, the element renderer lit-ssr uses for
 * plain (non-custom) elements. Element directives receive a `FallbackRenderer`
 * as `part.element` on the server, so they can only read/write attributes if
 * these methods behave like the browser's.
 *
 * Two behaviors come from the local patch on `@lit-labs/ssr`
 * (see `patches/@lit-labs+ssr+*.patch`):
 *  - `setAttribute()` coerces values to strings (browsers do this too)
 *  - `getAttribute()` exists at all (upstream only ships `setAttribute`)
 */
import { expect } from 'chai';
import { FallbackRenderer } from '@lit-labs/ssr/lib/element-renderer.js';

/** @param {FallbackRenderer} renderer */
const renderAttributes = renderer => [...renderer.renderAttributes()].join('');

describe('lit-ssr: FallbackRenderer attribute handling', () => {
  it('coerces attribute values to strings (like a browser)', () => {
    const renderer = new FallbackRenderer('div');
    renderer.setAttribute('data-count', 42);

    expect(renderAttributes(renderer)).to.equal(' data-count="42"');
  });

  it('reads attributes back through getAttribute (lowercased)', () => {
    const renderer = new FallbackRenderer('div');
    renderer.setAttribute('DATA-ROLE', 'root');

    expect(renderer.getAttribute('data-role')).to.equal('root');
    expect(renderer.getAttribute('DATA-ROLE')).to.equal('root');
  });

  it('returns undefined for attributes that were never set', () => {
    const renderer = new FallbackRenderer('div');

    expect(renderer.getAttribute('data-nope')).to.equal(undefined);
  });

  it('round-trips a value through setAttribute/getAttribute', () => {
    const renderer = new FallbackRenderer('span');
    renderer.setAttribute('aria-label', 'hello');

    expect(renderer.getAttribute('aria-label')).to.equal('hello');
    expect(renderAttributes(renderer)).to.equal(' aria-label="hello"');
  });
});
