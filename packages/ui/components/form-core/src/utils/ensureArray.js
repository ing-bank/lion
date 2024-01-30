/**
 * @typedef {<T>(value: T|T[]) => T[]} EnsureArrayFn
 */

/**
 * @type {EnsureArrayFn}
 */
export function ensureArray(value) {
  return Array.isArray(value) ? value : [value];
}
