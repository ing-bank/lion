/**
 * Proves the JSON notation used for every file this package writes.
 *
 * The notation exists so a change in the source reads like the change in the lock: JSON is authored as an
 * array of lines and concatenated, instead of hiding the layout inside `JSON.stringify(value, null, 2)`.
 * What must hold is that the output stays byte-identical to what the built-in serializer would produce —
 * external tooling reads these files with `JSON.parse`, and a lock that no longer round-trips is a broken
 * lock.
 */
import { expect } from 'chai';
import { stringifyJson, toJsonLines } from '../src/index.js';

const sample = {
  name: 'fixture',
  version: '1.0.0',
  private: true,
  packages: {
    '': { name: 'fixture', dependencies: { chalk: '^4.1.2', 'ansi-styles': '^3.2.1' } },
    'node_modules/chalk': { version: '4.1.2', integrity: 'sha512-x', link: false },
    'pkgs/lib-a': { resolved: 'pkgs/lib-a', link: true },
  },
  empty: {},
  list: ['a', 1, true, null],
  emptyList: [],
};

describe('json notation', () => {
  it('is byte-identical to JSON.stringify with two-space indentation', () => {
    expect(stringifyJson(sample)).to.equal(`${JSON.stringify(sample, null, 2)}\n`);
  });

  it('round-trips through JSON.parse', () => {
    expect(JSON.parse(stringifyJson(sample))).to.deep.equal(sample);
  });

  it('keeps the lines an array, so the source reads like the file', () => {
    const lines = toJsonLines(sample);
    expect(lines[0]).to.equal('{');
    expect(lines[1]).to.equal('  "name": "fixture",');
    expect(lines[lines.length - 1]).to.equal('}');
    expect(lines.every(line => typeof line === 'string')).to.equal(true);
  });

  it('has no trailing whitespace and ends with a single newline', () => {
    const text = stringifyJson(sample);
    expect(text.endsWith('\n')).to.equal(true);
    expect(text.endsWith('\n\n')).to.equal(false);
    expect(text.split('\n').every(line => line === line.trimEnd())).to.equal(true);
  });

  it('serialises empty objects and arrays without breaking the layout', () => {
    expect(stringifyJson({ a: {}, b: [] })).to.equal('{\n  "a": {},\n  "b": []\n}\n');
  });

  it('is stable across calls, so regenerating a file produces no diff', () => {
    expect(stringifyJson(sample)).to.equal(stringifyJson(sample));
  });
});
