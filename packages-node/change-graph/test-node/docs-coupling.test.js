import assert from 'node:assert/strict';
import { docsGraph, affectedUnitsForDocs } from '../src/docs-coupling.js';

const declaration = {
  'component/checkbox-group': [
    'docs/components/checkbox-group/overview.md',
    'docs/components/checkbox-group/use-cases.md',
  ],
  'component/menu': ['docs/components/menu/overview.md'],
};

describe('docs-to-unit coupling', () => {
  it('turns the declaration into a unit-to-files graph', () => {
    const graph = docsGraph(declaration);
    assert.deepEqual([...graph.get('component/menu')], ['docs/components/menu/overview.md']);
  });

  it('marks the coupled units affected when a doc changes', () => {
    assert.deepEqual(
      affectedUnitsForDocs(declaration, ['docs/components/checkbox-group/use-cases.md']),
      ['component/checkbox-group'],
    );
  });

  it('marks every unit that declares the changed doc', () => {
    const shared = { a: ['docs/x.md'], b: ['docs/x.md'], c: ['docs/y.md'] };
    assert.deepEqual(affectedUnitsForDocs(shared, ['docs/x.md']), ['a', 'b']);
  });

  it('marks nothing when an unrelated file changes', () => {
    assert.deepEqual(
      affectedUnitsForDocs(declaration, ['packages/ui/components/menu/src/LionMenu.js']),
      [],
    );
  });

  it('normalises backslashes, so a Windows diff still matches', () => {
    assert.deepEqual(affectedUnitsForDocs(declaration, ['docs\\components\\menu\\overview.md']), [
      'component/menu',
    ]);
  });
});
