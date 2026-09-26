/**
 * @license
 * Copyright 2026 ING Bank N.V.
 * SPDX-License-Identifier: MIT
 *
 * Shared fixtures for the Astro integration tests.
 *
 * Only what `astro-lit.test.js` needs: an element directive, so one test can
 * show that directives run through the container renderer. The lit-ssr
 * behaviour behind it is pinned by the `@lion/lit-ssr-patch-tests` package,
 * which owns the full set of element-directive fixtures.
 */
import { Directive, directive } from 'lit/directive.js';

/**
 * Records how many times the element directive below actually ran, so a test
 * can prove that it executed during server rendering instead of being skipped.
 */
export const invocationLog = [];

export function resetInvocationLog() {
  invocationLog.length = 0;
}

/**
 * Models Lion's `UIPartDirective`: attached to an element part, it marks the
 * element (`data-part`) and registers it as a "ref" on the context. Both the
 * attribute write and the registration must happen on the server for the
 * rendered DOM to come out correctly.
 */
export class PartDirective extends Directive {
  update(elementPart, [context, name]) {
    invocationLog.push(`part:${name}`);
    elementPart.element.setAttribute('data-part', name);
    context.refs[name] = elementPart.element;
    return undefined;
  }

  render() {}
}
export const part = directive(PartDirective);
