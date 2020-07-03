const { expect } = require('chai');
const { providence } = require('../../../src/program/providence.js');
const { QueryService } = require('../../../src/program/services/QueryService.js');
const {
  mockProject,
  restoreMockedProjects,
  getEntry,
} = require('../../../test-helpers/mock-project-helpers.js');
const {
  mockWriteToJson,
  restoreWriteToJson,
} = require('../../../test-helpers/mock-report-service-helpers.js');
const {
  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
} = require('../../../test-helpers/mock-log-service-helpers.js');

const findCustomelementsQueryConfig = QueryService.getQueryConfigFromAnalyzer(
  'find-customelements',
);
const _providenceCfg = {
  targetProjectPaths: ['/fictional/project'], // defined in mockProject
};

describe('Analyzer "find-customelements"', () => {
  const queryResults = [];

  const cacheDisabledInitialValue = QueryService.cacheDisabled;

  before(() => {
    QueryService.cacheDisabled = true;
  });

  after(() => {
    QueryService.cacheDisabled = cacheDisabledInitialValue;
  });

  beforeEach(() => {
    suppressNonCriticalLogs();
    mockWriteToJson(queryResults);
  });

  afterEach(() => {
    restoreSuppressNonCriticalLogs();
    restoreMockedProjects();
    restoreWriteToJson(queryResults);
  });

  it(`stores the tagName of a custom element`, async () => {
    mockProject([`customElements.define('custom-el', class extends HTMLElement {});`]);
    await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result[0].tagName).to.equal('custom-el');
  });

  it(`allows different notations for defining a custom element`, async () => {
    mockProject([
      `customElements.define('custom-el1', class extends HTMLElement {});`,
      `window.customElements.define('custom-el2', class extends HTMLElement {});`,
      `(() => {
        window.customElements.define('custom-el3', class extends HTMLElement {});
      })();`,
    ]);
    await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    const secondEntry = getEntry(queryResult, 1);
    const thirdEntry = getEntry(queryResult, 2);
    expect(firstEntry.result[0].tagName).to.equal('custom-el1');
    expect(secondEntry.result[0].tagName).to.equal('custom-el2');
    expect(thirdEntry.result[0].tagName).to.equal('custom-el3');
  });

  it(`stores the rootFile of a custom element`, async () => {
    mockProject({
      './src/CustomEl.js': `export class CustomEl extends HTMLElement {}`,
      './custom-el.js': `
        import { CustomEl } from './src/CustomEl.js';
        customElements.define('custom-el', CustomEl);
      `,
    });
    await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result[0].rootFile).to.eql({
      file: './src/CustomEl.js',
      specifier: 'CustomEl',
    });
  });

  it(`stores "[inline]" constructors`, async () => {
    mockProject([`customElements.define('custom-el', class extends HTMLElement {});`]);
    await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result[0].constructorIdentifier).to.equal('[inline]');
    expect(firstEntry.result[0].rootFile.specifier).to.equal('[inline]');
  });

  it(`stores "[current]" rootFile`, async () => {
    mockProject([`customElements.define('custom-el', class extends HTMLElement {});`]);
    await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result[0].rootFile.file).to.equal('[current]');
  });

  it(`stores the locally exported specifier in the rootFile `, async () => {
    mockProject({
      './src/CustomEl.js': `export class CustomEl extends HTMLElement {}`,
      './custom-el.js': `
        import { CustomEl } from './src/CustomEl.js';
        customElements.define('custom-el', CustomEl);
      `,
    });
    await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result[0].constructorIdentifier).to.equal('CustomEl');
    expect(firstEntry.result[0].rootFile.specifier).to.equal('CustomEl');
  });

  it(`finds all occurrences of custom elements`, async () => {
    mockProject([
      `
      customElements.define('tag-1', class extends HTMLElement {});
      customElements.define('tag-2', class extends HTMLElement {});
      `,
      `
      customElements.define('tag-3', class extends HTMLElement {});
      `,
    ]);
    await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    const secondEntry = getEntry(queryResult, 1);
    expect(firstEntry.result.length).to.equal(2);
    expect(secondEntry.result.length).to.equal(1);
  });
});
