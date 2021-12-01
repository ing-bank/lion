const { expect } = require('chai');
const { providence } = require('../../../src/program/providence.js');
const { QueryService } = require('../../../src/program/core/QueryService.js');
const { setupAnalyzerTest } = require('../../../test-helpers/setup-analyzer-test.js');
const { mockProject, getEntry } = require('../../../test-helpers/mock-project-helpers.js');

const findClassesQueryConfig = QueryService.getQueryConfigFromAnalyzer('find-classes');

describe('Analyzer "find-classes"', () => {
  const queryResults = setupAnalyzerTest();
  const _providenceCfg = {
    targetProjectPaths: ['/fictional/project'], // defined in mockProject
  };

  it(`finds class definitions`, async () => {
    mockProject([`class EmptyClass {}`]);
    await providence(findClassesQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result).to.eql([
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
    await providence(findClassesQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result).to.eql([
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
    await providence(findClassesQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result[1].superClasses).to.eql([
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
    await providence(findClassesQueryConfig, _providenceCfg);
    const queryResult = queryResults[0];
    const firstEntry = getEntry(queryResult);
    expect(firstEntry.result.length).to.equal(2);
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
      await providence(findClassesQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].members.methods).to.eql([
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
      await providence(findClassesQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].members.props).to.eql([
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
      await providence(findClassesQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
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
      await providence(findClassesQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
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
      await providence(findClassesQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].members.methods.length).to.equal(0);
      expect(firstEntry.result[0].members.props.length).to.equal(0);
    });
  });
});
