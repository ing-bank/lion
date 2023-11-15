import { expect } from 'chai';
import {
  parseCode,
  transformCode,
  prettify,
  makeDirSync,
  makeDir,
  byStringAscendingSort,
  camelToKebabCase,
  getExportSpecifiersByFile,
  asyncSerialForEach,
  asyncConcurrentForEach,
  // Tasks
  bypassImportMap,
  bypassExportMap,
} from '../src/index.js';

describe('Public API', () => {
  it('should expose the agreed public API', () => {
    expect(parseCode).to.be.a('function');
    expect(transformCode).to.be.a('function');
    expect(prettify).to.be.a('function');
    expect(makeDirSync).to.be.a('function');
    expect(makeDir).to.be.a('function');
    expect(byStringAscendingSort).to.be.a('function');
    expect(camelToKebabCase).to.be.a('function');
    expect(getExportSpecifiersByFile).to.be.a('function');
    expect(asyncSerialForEach).to.be.a('function');
    expect(asyncConcurrentForEach).to.be.a('function');
    expect(bypassImportMap).to.be.a('function');
    expect(bypassExportMap).to.be.a('function');
  });
});
