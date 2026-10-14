import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { expect } from 'chai';
import {
  buildImportGraph,
  collectReachable,
  collectReferenceInputs,
  collectUnitFiles,
  decodeValues,
  encodeValues,
  findAffectedUnits,
  getExitCode,
  getModuleRequests,
  hashFiles,
  invertGraph,
  reachesProperty,
  resolveReferenceTrace,
  selectRecordedEntries,
} from './index.js';

const refs = value => [...value.matchAll(/var\((--[\w-]+)\)/g)].map(match => match[1]);

describe('change-graph', () => {
  let root;
  before(async () => {
    root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'change-graph-')));
    const write = async (file, content) => {
      await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true });
      await fs.writeFile(path.join(root, file), content);
    };
    await write(
      'package.json',
      JSON.stringify({
        name: 'fixture',
        type: 'module',
        imports: { '#shared/*': './shared/*' },
        exports: { './*': './exports/*' },
      }),
    );
    await write(
      'components/a/A.js',
      "import '#shared/util.js'; import 'fixture/lib.js'; import 'lit';",
    );
    await write('components/b/B.js', "export * from '../a/A.js'; await import('./lazy.js');");
    await write('components/b/lazy.js', 'export default 1;');
    await write('components/c/C.js', 'export default 2;');
    await write('shared/util.js', 'export default 3;');
    await write('exports/lib.js', 'export default 4;');
  });
  after(() => fs.rm(root, { recursive: true, force: true }));

  it('extracts static, re-export and literal dynamic requests', () => {
    expect(
      getModuleRequests(
        'x.ts',
        "import a from 'x'; export * from './z.js'; export {q} from './w.js'; import('./d.js'); import(v);",
      ).sort(),
    ).to.deep.equal(['./d.js', './w.js', './z.js', 'x']);
  });

  it('resolves import aliases and self-references and stops at external packages', async () => {
    const graph = await buildImportGraph({ root });
    const deps = file => [...graph.get(path.join(root, file))].map(f => path.relative(root, f));
    expect(deps('components/a/A.js').sort()).to.deep.equal(['exports/lib.js', 'shared/util.js']);
    expect(deps('components/b/B.js').sort()).to.deep.equal([
      'components/a/A.js',
      'components/b/lazy.js',
    ]);
  });

  it('flags every unit that can reach a changed file', async () => {
    const graph = await buildImportGraph({ root });
    const unitOf = file => /components\/([^/]+)\//.exec(path.relative(root, file))?.[1] ?? null;
    const units = collectUnitFiles(graph, unitOf);
    expect(findAffectedUnits(units, [path.join(root, 'shared/util.js')]).sort()).to.deep.equal([
      'a',
      'b',
    ]);
    expect(findAffectedUnits(units, [path.join(root, 'components/c/C.js')])).to.deep.equal(['c']);
    expect(collectReachable(graph, path.join(root, 'components/c/C.js')).size).to.equal(1);
    expect([...invertGraph(graph).get(path.join(root, 'shared/util.js'))]).to.have.length(1);
  });

  it('hashes file contents, not paths alone', async () => {
    const file = path.join(root, 'shared/util.js');
    const before = await hashFiles([file], { root });
    await fs.writeFile(file, 'export default 99;');
    expect(await hashFiles([file], { root })).to.not.equal(before);
  });

  describe('reference tree', () => {
    const node = (selector, property, value, source) => ({ selector, property, value, source });
    const graph = new Map([
      ['--c', [node(':host', '--c', 'var(--a)', 'c.js')]],
      [
        '--a',
        [
          node('html[t=x]', '--a', 'var(--b)', 'x.css'),
          node('html[t=y]', '--a', 'var(--b)', 'y.css'),
        ],
      ],
      ['--b', [node('html', '--b', '#fff', 'g.css')]],
    ]);

    it('traces base -> alias -> component per selector', () => {
      const trace = resolveReferenceTrace(graph, '--c', ':host', { getReferences: refs });
      expect(trace[0].property).to.equal('--c');
      expect(trace.map(n => n.selector)).to.include.members(['html[t=x]', 'html[t=y]', 'html']);
    });

    it('detects reachability of a property predicate', () => {
      expect(
        reachesProperty(graph, ['--c'], { getReferences: refs, predicate: p => p === '--b' }),
      ).to.equal(true);
      expect(
        reachesProperty(graph, ['--b'], { getReferences: refs, predicate: p => p === '--c' }),
      ).to.equal(false);
    });

    it('collects scope-keyed inputs and filters by scope', () => {
      const inputs = collectReferenceInputs({
        graph,
        seeds: [{ property: '--c', scope: { theme: 'x' } }],
        getReferences: refs,
        accept: (n, { theme }) =>
          !n.source.endsWith('.css') || n.source.startsWith(theme) || n.source === 'g.css',
      });
      expect(inputs.map(i => [i.theme, i.source])).to.deep.equal([
        ['x', 'c.js'],
        ['x', 'g.css'],
        ['x', 'x.css'],
      ]);
    });
  });

  it('records selected entries and computes exit codes', () => {
    const next = { a: { h: 2 }, b: { h: 2 } };
    expect(selectRecordedEntries(next, { a: { h: 1 }, b: { h: 1 } }, ['a'], 'now')).to.deep.equal({
      a: { h: 2, verifiedAt: 'now' },
      b: { h: 1 },
    });
    expect(getExitCode({ stale: [1] })).to.equal(1);
    expect(getExitCode({ stale: [1], record: true })).to.equal(0);
    expect(decodeValues(encodeValues([1, 'a']))).to.deep.equal([1, 'a']);
  });
});
