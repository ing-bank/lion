// @ts-check
/**
 * JSON written as an array of lines, concatenated, instead of `JSON.stringify(value, null, 2)`.
 *
 * Two reasons for the notation: the source reads like the file it produces (one array entry per JSON
 * line, so a diff in the code matches a diff in the lock), and from `level` down the arrays are only
 * built once per level instead of being re-indented by the serializer. Output is still plain, stable
 * 2-space JSON that `JSON.parse` accepts.
 */

/** @param {number} level @returns {string} */
const pad = level => '  '.repeat(level);

/**
 * @param {unknown} value
 * @param {number} [level]
 * @returns {string[]} the lines of `value`, indented `level` deep
 */
export function toJsonLines(value, level = 0) {
  /** @type {string[]} */
  const lines = [];
  if (value === null || typeof value !== 'object') {
    lines.push(JSON.stringify(value));
    return lines;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      lines.push('[]');
      return lines;
    }
    lines.push('[');
    value.forEach((item, index) => {
      const comma = index === value.length - 1 ? '' : ',';
      const itemLines = toJsonLines(item, level + 1);
      // an array item carries its own indentation: the scalar branch and the object branch's opening
      // brace are written flush left, because a nested object gets its indent from its key
      itemLines[0] = `${pad(level + 1)}${itemLines[0]}`;
      itemLines[itemLines.length - 1] = `${itemLines[itemLines.length - 1]}${comma}`;
      // Not `push(...itemLines)`: a large child line list exceeds the argument limit and throws
      // `RangeError: Maximum call stack size exceeded`, which is how a real repo's lockfile fails.
      for (const line of itemLines) lines.push(line);
    });
    lines.push(`${pad(level)}]`);
    return lines;
  }

  const entries = Object.entries(value);
  if (entries.length === 0) {
    lines.push('{}');
    return lines;
  }
  lines.push('{');
  entries.forEach(([key, child], index) => {
    const comma = index === entries.length - 1 ? '' : ',';
    const childLines = toJsonLines(child, level + 1);
    childLines[0] = `${pad(level + 1)}${JSON.stringify(key)}: ${childLines[0]}`;
    childLines[childLines.length - 1] = `${childLines[childLines.length - 1]}${comma}`;
    // See the array branch: spreading a large line list overflows the argument limit.
    for (const line of childLines) lines.push(line);
  });
  lines.push(`${pad(level)}}`);
  return lines;
}

/**
 * @param {unknown} value
 * @returns {string} the JSON document, newline terminated
 */
export function stringifyJson(value) {
  return [...toJsonLines(value), ''].join('\n');
}
