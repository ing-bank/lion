import { expect } from 'chai';
import { it } from 'mocha';
import { providence } from '../../../src/program/providence.js';
import { QueryService } from '../../../src/program/core/QueryService.js';
import { mockProject, getEntry } from '../../../test-helpers/mock-project-helpers.js';
import { setupAnalyzerTest } from '../../../test-helpers/setup-analyzer-test.js';
import FindClassesAnalyzer from '../../../src/program/analyzers/find-classes.js';

/**
 * @typedef {import('../../../types/index.js').ProvidenceConfig} ProvidenceConfig
 */

/**
 * @param {{parser: 'oxc'|'swc'}} opts
 */
async function runFindClassesSuite({ parser }) {
  setupAnalyzerTest();
  const findClassesQueryConfig = await QueryService.getQueryConfigFromAnalyzer(FindClassesAnalyzer);

  // const queryResults = setupAnalyzerTest();
  /** @type {Partial<ProvidenceConfig>} */
  const _providenceCfg = {
    targetProjectPaths: ['/fictional/project'], // defined in mockProject
    parser,
  };
  describe(`Analyzer "find-classes" (${parser})`, async () => {
    it(`finds class definitions`, async () => {
      mockProject([`class EmptyClass {}`]);
      const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result).to.deep.equal([
        {
          name: 'EmptyClass',
          isMixin: false,
          members: {
            methods: [],
            props: [],
          },
        },
      ]);
    });

    it(`finds mixin definitions`, async () => {
      mockProject([`const m = superclass => class MyMixin extends superclass {}`]);
      const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result).to.deep.equal([
        {
          name: 'MyMixin',
          superClasses: [
            {
              isMixin: false,
              name: 'superclass',
              rootFile: { file: '[current]', specifier: 'superclass' },
            },
          ],
          isMixin: true,
          members: {
            methods: [],
            props: [],
          },
        },
      ]);
    });

    it(`stores superClasses`, async () => {
      mockProject({
        './index.js': `
        import { Mixin } from '@external/source';

        class OtherClass {}
        export class EmptyClass extends Mixin(OtherClass) {}
      `,
        './internal.js': '',
      });
      const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result[1].superClasses).to.deep.equal([
        {
          isMixin: true,
          name: 'Mixin',
          rootFile: { file: '@external/source', specifier: 'Mixin' },
        },
        {
          isMixin: false,
          name: 'OtherClass',
          rootFile: { file: '[current]', specifier: 'OtherClass' },
        },
      ]);
    });

    it(`handles multiple classes per file`, async () => {
      mockProject([
        ` const m = superclass => class MyMixin extends superclass {}
        class EmptyClass extends Mixin(OtherClass) {}`,
      ]);
      const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result.length).to.equal(2);
    });

    it(`handles nameless classes`, async () => {
      mockProject([`const x = class extends HTMLElement {};`]);
      const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);

      expect(firstEntry.result[0]).to.deep.equal({
        name: null,
        isMixin: true,
        superClasses: [
          {
            name: 'HTMLElement',
            isMixin: false,
            rootFile: {
              file: '[current]',
              specifier: 'HTMLElement',
            },
          },
        ],
        members: { props: [], methods: [] },
      });
    });

    describe('Edge cases', () => {
      it(`handles customElements.get retrieved from registry correctly`, async () => {
        mockProject([`class ExtendedOnTheFly extends customElements.get('on-the-fly') {}`]);
        const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
        const firstEntry = getEntry(queryResults[0]);

        expect(firstEntry.result[0].superClasses).to.deep.equal([
          {
            rootFile: { file: '[current]', specifier: null },
            customElementsGetRef: 'on-the-fly',
            name: null,
            isMixin: false,
          },
        ]);
      });

      it(`handles window.customElements.get retrieved from registry correctly`, async () => {
        mockProject([`class ExtendedOnTheFly extends window.customElements.get('on-the-fly') {}`]);
        const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
        const firstEntry = getEntry(queryResults[0]);

        expect(firstEntry.result[0].superClasses).to.deep.equal([
          {
            rootFile: { file: '[current]', specifier: null },
            customElementsGetRef: 'on-the-fly',
            name: null,
            isMixin: false,
          },
        ]);
      });

      it(`handles definitions inside ce definitions`, async () => {
        mockProject([`customElements.define('on-the-fly', class extends HTMLElement {});`]);
        const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
        const firstEntry = getEntry(queryResults[0]);

        expect(firstEntry.result[0]).to.deep.equal({
          name: null,
          // TODO: fix
          isMixin: true,
          superClasses: [
            {
              name: 'HTMLElement',
              isMixin: false,
              rootFile: {
                file: '[current]',
                specifier: 'HTMLElement',
              },
            },
          ],
          members: {
            props: [],
            methods: [],
          },
        });
      });
    });

    describe('Members', () => {
      it(`stores methods`, async () => {
        mockProject([
          `class MyClass {
          method() {}
          _protectedMethod() {}
          __privateMethod() {}
          $protectedMethod() {}
          $$privateMethod() {}
        }`,
        ]);
        const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
        const firstEntry = getEntry(queryResults[0]);
        expect(firstEntry.result[0].members.methods).to.deep.equal([
          {
            accessType: 'public',
            name: 'method',
          },
          {
            accessType: 'protected',
            name: '_protectedMethod',
          },
          {
            accessType: 'private',
            name: '__privateMethod',
          },
          {
            accessType: 'protected',
            name: '$protectedMethod',
          },
          {
            accessType: 'private',
            name: '$$privateMethod',
          },
        ]);
      });

      it(`stores props`, async () => {
        mockProject([
          `class MyClass {
          get getterSetter() {}
          set getterSetter(v) {}

          static get _staticGetterSetter() {}
          static set _staticGetterSetter(v) {}
        }`,
        ]);
        const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
        const firstEntry = getEntry(queryResults[0]);
        expect(firstEntry.result[0].members.props).to.deep.equal([
          {
            accessType: 'public',
            kind: ['get', 'set'],
            name: 'getterSetter',
          },
          {
            accessType: 'protected',
            kind: ['get', 'set'],
            name: '_staticGetterSetter',
            static: true,
          },
        ]);
      });

      it(`handles constructor as method as well`, async () => {
        mockProject([
          `class MyClass {
          constructor() {}
        }`,
        ]);
        const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
        const firstEntry = getEntry(queryResults[0]);
        expect(firstEntry.result[0].members.methods).to.deep.equal([
          {
            accessType: '[n/a]',
            name: 'constructor',
            isPartOfPlatformLifeCycle: true,
          },
        ]);
      });

      // Options below are disabled by default for now.
      // TODO: provide as options
      it.skip(`filters out platform members`, async () => {
        mockProject([
          `class MyClass {
          static get attributes() {}
          constructor() {}
          connectedCallback() {}
          disconnectedCallback() {}
        }`,
        ]);
        const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
        const firstEntry = getEntry(queryResults[0]);
        expect(firstEntry.result[0].members.methods.length).to.equal(0);
        expect(firstEntry.result[0].members.props.length).to.equal(0);
      });

      it.skip(`filters out LitElement members`, async () => {
        mockProject([
          `class MyClass {
          static get properties() {}
          static get styles() {}
          get updateComplete() {}
          requestUpdate() {}
          createRenderRoot() {}
          render() {}
          updated() {}
          firstUpdated() {}
          update() {}
          shouldUpdate() {}
        }`,
        ]);
        const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
        const firstEntry = getEntry(queryResults[0]);
        expect(firstEntry.result[0].members.methods.length).to.equal(0);
        expect(firstEntry.result[0].members.props.length).to.equal(0);
      });

      it.skip(`filters out Lion members`, async () => {
        mockProject([
          `class MyClass {
          static get localizeNamespaces() {}
          get slots() {}
          onLocaleUpdated() {}
        }`,
        ]);
        const queryResults = await providence(findClassesQueryConfig, _providenceCfg);
        const firstEntry = getEntry(queryResults[0]);
        expect(firstEntry.result[0].members.methods.length).to.equal(0);
        expect(firstEntry.result[0].members.props.length).to.equal(0);
      });
    });
  });
}

runFindClassesSuite({ parser: 'oxc' });
runFindClassesSuite({ parser: 'swc' });
