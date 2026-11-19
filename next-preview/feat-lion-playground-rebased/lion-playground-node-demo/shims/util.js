/**
 * `util` — formatting and inspection, plus `parseArgs` so a CLI-shaped package can parse argv.
 * The pieces that are pure computation are faithful; the ones that need Node internals
 * (`getCallSites`, `debuglog`) are absent and reported as uncovered.
 */

/**
 * @param {unknown} value
 * @returns {string}
 */
export function inspect(value, options = {}) {
  const seen = new WeakSet();
  const seenOptions = /** @type {{depth?: number}} */ (options);
  const depthLimit = seenOptions.depth ?? 2;
  const walk = (input, depth) => {
    if (input === null) return 'null';
    if (input === undefined) return 'undefined';
    const type = typeof input;
    if (type === 'string') return `'${input}'`;
    if (type === 'number' || type === 'boolean' || type === 'bigint') return String(input);
    if (type === 'function') return `[Function: ${input.name || 'anonymous'}]`;
    if (type === 'symbol') return String(input);
    if (input instanceof Error) return `${input.name}: ${input.message}`;
    if (input instanceof Date) return input.toISOString();
    if (input instanceof RegExp) return String(input);
    if (depth > depthLimit) return Array.isArray(input) ? '[Array]' : '[Object]';
    if (seen.has(input)) return '[Circular]';
    seen.add(input);
    if (Array.isArray(input)) {
      return `[ ${input.map(entry => walk(entry, depth + 1)).join(', ')} ]`;
    }
    const entries = Object.entries(input).map(
      ([key, entry]) => `${key}: ${walk(entry, depth + 1)}`,
    );
    return `{ ${entries.join(', ')} }`;
  };
  return walk(value, 0);
}

/**
 * @param {string} template
 * @param {...unknown} args
 * @returns {string}
 */
export function format(template, ...args) {
  if (typeof template !== 'string') return [template, ...args].map(entry => inspect(entry)).join(' ');
  let index = 0;
  const replaced = template.replace(/%[sdifjoO%]/g, match => {
    if (match === '%%') return '%';
    if (index >= args.length) return match;
    const value = args[index];
    index += 1;
    switch (match) {
      case '%s':
        return String(value);
      case '%d':
      case '%i':
        return String(Number(value));
      case '%f':
        return String(Number.parseFloat(String(value)));
      case '%j':
        try {
          return JSON.stringify(value);
        } catch {
          return '[Circular]';
        }
      default:
        return inspect(value);
    }
  });
  const rest = args.slice(index);
  return rest.length ? `${replaced} ${rest.map(entry => inspect(entry)).join(' ')}` : replaced;
}

export function formatWithOptions(_options, template, ...args) {
  return format(template, ...args);
}

/**
 * @param {(callback: Function) => void} fn
 * @returns {() => Promise<unknown>}
 */
export function promisify(fn) {
  if (typeof fn !== 'function') throw new TypeError('The "original" argument must be a function');
  const promisified = (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (error, ...values) => (error ? reject(error) : resolve(values.length > 1 ? values : values[0])));
    });
  return Object.assign(promisified, { __promisify__: true });
}

export function callbackify(fn) {
  return (...args) => {
    const callback = args.pop();
    fn(...args).then(
      value => queueMicrotask(() => callback(null, value)),
      error => queueMicrotask(() => callback(error)),
    );
  };
}

/** @type {{isDate(d: unknown): boolean, isRegExp(r: unknown): boolean, isNativeError(e: unknown): boolean, isPromise(p: unknown): boolean, isArrayBufferView(v: unknown): boolean}} */
export const types = {
  isDate: value => value instanceof Date,
  isRegExp: value => value instanceof RegExp,
  isNativeError: value => value instanceof Error,
  isPromise: value => !!value && typeof (/** @type {any} */ (value).then) === 'function',
  isArrayBufferView: value => ArrayBuffer.isView(value),
};

/**
 * @param {Function} constructor
 * @param {Function} superConstructor
 */
export function inherits(constructor, superConstructor) {
  Object.setPrototypeOf(constructor.prototype, superConstructor.prototype);
}

/** @param {string} message @param {string} code */
export function deprecate(fn, code) {
  return Object.assign(fn, { __deprecated: code });
}

/**
 * A structural comparison, enough for config/object assertions in tests.
 * @param {unknown} a @param {unknown} b
 * @returns {boolean}
 */
export function isDeepStrictEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every(key =>
    isDeepStrictEqual(
      /** @type {Record<string, unknown>} */ (a)[key],
      /** @type {Record<string, unknown>} */ (b)[key],
    ),
  );
}

/**
 * `node:util`'s `parseArgs`, for CLIs that read argv. Supports boolean/string options, short aliases
 * and `--no-` negation; `multiple`, `default` and `strict` are not implemented.
 * @param {{args?: string[], options?: Record<string, {type?: string, short?: string, multiple?: boolean, default?: unknown}>, allowPositionals?: boolean, strict?: boolean}} config
 * @returns {{values: Record<string, unknown>, positionals: string[]}}
 */
export function parseArgs(config = {}) {
  const args = config.args ?? [];
  const definitions = config.options ?? {};
  const byShort = new Map();
  const byLong = new Map();
  for (const [name, definition] of Object.entries(definitions)) {
    byLong.set(name, { name, ...definition });
    if (definition.short) byShort.set(definition.short, { name, ...definition });
  }
  const values = {};
  const positionals = [];
  const assign = (definition, inlineValue, next) => {
    if (definition.type === 'boolean') {
      values[definition.name] = inlineValue === undefined ? true : inlineValue !== 'false';
      return false;
    }
    if (inlineValue !== undefined) {
      values[definition.name] = inlineValue;
      return false;
    }
    if (next === undefined) throw new Error(`Option --${definition.name} requires a value`);
    values[definition.name] = next;
    return true;
  };
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--') {
      positionals.push(...args.slice(index + 1));
      break;
    }
    if (arg.startsWith('--')) {
      const [rawName, inlineValue] = arg.slice(2).split('=');
      const negated = rawName.startsWith('no-');
      const definition = byLong.get(negated ? rawName.slice(3) : rawName);
      if (!definition) {
        positionals.push(arg);
        continue;
      }
      if (negated && definition.type === 'boolean') {
        values[definition.name] = false;
        continue;
      }
      if (assign(definition, inlineValue, args[index + 1])) index += 1;
      continue;
    }
    if (arg.startsWith('-') && arg.length === 2) {
      const definition = byShort.get(arg[1]);
      if (definition && assign(definition, undefined, args[index + 1])) index += 1;
      else positionals.push(arg);
      continue;
    }
    positionals.push(arg);
  }
  for (const [name, definition] of Object.entries(definitions)) {
    // N.B. the key, not `definition.name`: the raw config objects have no `name` property, and using
    // the latter writes a `values[undefined]` entry.
    if (!(name in values) && 'default' in definition) {
      values[name] = definition.default;
    }
  }
  return { values, positionals };
}

export const TextEncoder = globalThis.TextEncoder;
export const TextDecoder = globalThis.TextDecoder;
export const promisifySymbol = Symbol.for('nodejs.util.promisify.custom');

export default {
  inspect,
  format,
  formatWithOptions,
  promisify,
  callbackify,
  types,
  inherits,
  deprecate,
  isDeepStrictEqual,
  parseArgs,
  TextEncoder,
  TextDecoder,
  promisifySymbol,
};
