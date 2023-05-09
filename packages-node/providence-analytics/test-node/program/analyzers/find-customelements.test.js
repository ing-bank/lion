import { expect } from 'chai';
import { it } from 'mocha';
import { providence } from '../../../src/program/providence.js';
import { QueryService } from '../../../src/program/core/QueryService.js';
import { setupAnalyzerTest } from '../../../test-helpers/setup-analyzer-test.js';
import { mockProject, getEntry } from '../../../test-helpers/mock-project-helpers.js';
import FindCustomelementsAnalyzer from '../../../src/program/analyzers/find-customelements.js';

/**
 * @typedef {import('../../../types/index.js').ProvidenceConfig} ProvidenceConfig
 */

setupAnalyzerTest();

describe('Analyzer "find-customelements"', async () => {
  const findCustomelementsQueryConfig = await QueryService.getQueryConfigFromAnalyzer(
    FindCustomelementsAnalyzer,
  );
  /** @type {Partial<ProvidenceConfig>} */
  const _providenceCfg = {
    targetProjectPaths: ['/fictional/project'], // defined in mockProject
  };

  it(`stores the tagName of a custom element`, async () => {
    mockProject([`customElements.define('custom-el', class extends HTMLElement {});`]);
    const queryResults = await providence(findCustomelementsQueryConfig, _providenceCfg);
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
    const queryResults = await providence(findCustomelementsQueryConfig, _providenceCfg);
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
    const queryResults = await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result[0].rootFile).to.eql({
      file: './src/CustomEl.js',
      specifier: 'CustomEl',
    });
  });

  it(`stores "[inline]" constructors`, async () => {
    mockProject([`customElements.define('custom-el', class extends HTMLElement {});`]);
    const queryResults = await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result[0].constructorIdentifier).to.equal('[inline]');
    expect(firstEntry.result[0].rootFile.specifier).to.equal('[inline]');
  });

  it(`stores "[current]" rootFile`, async () => {
    mockProject([`customElements.define('custom-el', class extends HTMLElement {});`]);
    const queryResults = await providence(findCustomelementsQueryConfig, _providenceCfg);
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
    const queryResults = await providence(findCustomelementsQueryConfig, _providenceCfg);
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
    const queryResults = await providence(findCustomelementsQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    const secondEntry = getEntry(queryResult, 1);
    expect(firstEntry.result.length).to.equal(2);
    expect(secondEntry.result.length).to.equal(1);
  });
});
