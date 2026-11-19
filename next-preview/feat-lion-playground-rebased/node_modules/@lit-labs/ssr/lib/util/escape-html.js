/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const replacements = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    // Note &apos; was not defined in the HTML4 spec, and is not supported by very
    // old browsers like IE8, so a codepoint entity is used instead.
    "'": '&#39;',
};
const replacer = (char) => replacements[char];
/**
 * Replaces characters which have special meaning in HTML (&<>"') with escaped
 * HTML entities ("&amp;", "&lt;", etc.).
 */
export const escapeHtml = (str) => str.replace(/[&<>"']/g, replacer);
//# sourceMappingURL=escape-html.js.map