const { expect } = require('chai');
const { default: traverse } = require('@babel/traverse');
const {
  trackDownIdentifier,
  trackDownIdentifierFromScope,
} = require('../../../../src/program/analyzers/helpers/track-down-identifier.js');
const { AstService } = require('../../../../src/program/services/AstService.js');

const {
  mockProject,
  restoreMockedProjects,
} = require('../../../../test-helpers/mock-project-helpers.js');

describe('trackdownIdentifier', () => {
  afterEach(() => {
    restoreMockedProjects();
  });

  it(`tracks down identifier to root file (file that declares identifier)`, async () => {
    mockProject(
      {
        './src/declarationOfMyClass.js': `
        export class MyClass extends HTMLElement {}
      `,
        './currentFile.js': `
        import { MyClass } from './src/declarationOfMyClass';
      `,
      },
      {
        projectName: 'my-project',
        projectPath: '/my/project',
      },
    );

    // Let's say we want to track down 'MyClass' in the code above
    const source = './src/declarationOfMyClass';
    const identifierName = 'MyClass';
    const currentFilePath = '/my/project/currentFile.js';
    const rootPath = '/my/project';

    const rootFile = await trackDownIdentifier(source, identifierName, currentFilePath, rootPath);
    expect(rootFile).to.eql({
      file: './src/declarationOfMyClass.js',
      specifier: 'MyClass',
    });
  });

  it(`tracks down transitive and renamed identifiers`, async () => {
    mockProject(
      {
        './src/declarationOfMyClass.js': `
        export class MyClass extends HTMLElement {}
      `,
        './src/renamed.js': `
        export { MyClass as MyRenamedClass } from './declarationOfMyClass.js';
      `,
        './currentFile.js': `
        import { MyRenamedClass } from './src/renamed';
      `,
      },
      {
        projectName: 'my-project',
        projectPath: '/my/project',
      },
    );

    // Let's say we want to track down 'MyClass' in the code above
    const source = './src/renamed';
    const identifierName = 'MyRenamedClass';
    const currentFilePath = '/my/project/currentFile.js';
    const rootPath = '/my/project';

    const rootFile = await trackDownIdentifier(source, identifierName, currentFilePath, rootPath);
    expect(rootFile).to.eql({
      file: './src/declarationOfMyClass.js',
      specifier: 'MyClass',
    });
  });

  it(`tracks down default identifiers`, async () => {
    mockProject(
      {
        './src/declarationOfMyClass.js': `
        export default class MyClass extends HTMLElement {}
      `,
        './src/renamed.js': `
        import MyClassDefaultReexport from './declarationOfMyClass.js';

        export default MyClassDefaultReexport;
      `,
        './currentFile.js': `
        import MyClassDefaultImport from './src/renamed';
      `,
      },
      {
        projectName: 'my-project',
        projectPath: '/my/project',
      },
    );

    // Let's say we want to track down 'MyClass' in the code above
    const source = './src/renamed';
    const identifierName = '[default]';
    const currentFilePath = '/my/project/currentFile.js';
    const rootPath = '/my/project';

    const rootFile = await trackDownIdentifier(source, identifierName, currentFilePath, rootPath);
    expect(rootFile).to.eql({
      file: './src/declarationOfMyClass.js',
      specifier: '[default]',
    });
  });

  it(`does not track down external sources`, async () => {
    mockProject(
      {
        './currentFile.js': `
        import MyClassDefaultImport from '@external/source';
      `,
      },
      {
        projectName: 'my-project',
        projectPath: '/my/project',
      },
    );

    // Let's say we want to track down 'MyClass' in the code above
    const source = '@external/source';
    const identifierName = '[default]';
    const currentFilePath = '/my/project/currentFile.js';
    const rootPath = '/my/project';

    const rootFile = await trackDownIdentifier(source, identifierName, currentFilePath, rootPath);
    expect(rootFile).to.eql({
      file: '@external/source',
      specifier: '[default]',
    });
  });

  it(`tracks down locally declared, reexported identifiers (without a source defined)`, async () => {
    mockProject(
      {
        './src/declarationOfMyNumber.js': `
        const myNumber = 3;

        export { myNumber };
      `,
        './currentFile.js': `
        import { myNumber } from './src/declarationOfMyNumber.js';
      `,
      },
      {
        projectName: 'my-project',
        projectPath: '/my/project',
      },
    );

    // Let's say we want to track down 'MyClass' in the code above
    const source = './src/declarationOfMyNumber.js';
    const identifierName = 'myNumber';
    const currentFilePath = '/my/project/currentFile.js';
    const rootPath = '/my/project';

    const rootFile = await trackDownIdentifier(source, identifierName, currentFilePath, rootPath);
    expect(rootFile).to.eql({
      file: './src/declarationOfMyNumber.js',
      specifier: 'myNumber',
    });
  });

  it(`works with multiple re-exports in a file`, async () => {
    mockProject(
      {
        './packages/accordion/IngAccordionContent.js': `export class IngAccordionContent { }`,
        './packages/accordion/IngAccordionInvokerButton.js': `export class IngAccordionInvokerButton { }`,
        './packages/accordion/index.js': `
      export { IngAccordionContent } from './IngAccordionContent.js';
      export { IngAccordionInvokerButton } from './IngAccordionInvokerButton.js';`,
      },
      {
        projectName: 'my-project',
        projectPath: '/my/project',
      },
    );

    // Let's say we want to track down 'IngAccordionInvokerButton' in the code above
    const source = './IngAccordionContent.js';
    const identifierName = 'IngAccordionContent';
    const currentFilePath = '/my/project/packages/accordion/index.js';
    const rootPath = '/my/project';

    const rootFile = await trackDownIdentifier(source, identifierName, currentFilePath, rootPath);
    expect(rootFile).to.eql({
      file: './packages/accordion/IngAccordionContent.js',
      specifier: 'IngAccordionContent',
    });

    // Let's say we want to track down 'IngAccordionInvokerButton' in the code above
    const source2 = './IngAccordionInvokerButton.js';
    const identifierName2 = 'IngAccordionInvokerButton';
    const currentFilePath2 = '/my/project/packages/accordion/index.js';
    const rootPath2 = '/my/project';

    const rootFile2 = await trackDownIdentifier(
      source2,
      identifierName2,
      currentFilePath2,
      rootPath2,
    );
    expect(rootFile2).to.eql({
      file: './packages/accordion/IngAccordionInvokerButton.js',
      specifier: 'IngAccordionInvokerButton',
    });
  });

  // TODO: improve perf
  describe.skip('Caching', () => {});
});

describe('trackDownIdentifierFromScope', () => {
  it(`gives back [current] if currentFilePath contains declaration`, async () => {
    const projectFiles = {
      './src/declarationOfMyClass.js': `
          export class MyClass extends HTMLElement {}
      `,
    };

    mockProject(projectFiles, { projectName: 'my-project', projectPath: '/my/project' });
    const ast = AstService._getBabelAst(projectFiles['./src/declarationOfMyClass.js']);

    // Let's say we want to track down 'MyClass' in the code above
    const identifierNameInScope = 'MyClass';
    const fullCurrentFilePath = '/my/project//src/declarationOfMyClass.js';
    const projectPath = '/my/project';
    let astPath;

    traverse(ast, {
      ClassDeclaration(path) {
        astPath = path;
      },
    });

    const rootFile = await trackDownIdentifierFromScope(
      astPath,
      identifierNameInScope,
      fullCurrentFilePath,
      projectPath,
    );
    expect(rootFile).to.eql({
      file: '[current]',
      specifier: 'MyClass',
    });
  });

  it(`tracks down re-exported identifiers`, async () => {
    const projectFiles = {
      './src/declarationOfMyClass.js': `
          export class MyClass extends HTMLElement {}
      `,
      './re-export.js': `
        // Other than with import, no binding is created for MyClass by Babel(?)
        // This means 'path.scope.getBinding('MyClass')' returns undefined
        // and we have to find a different way to retrieve this value
        export { MyClass } from './src/declarationOfMyClass.js';
      `,
      './imported.js': `
        import { MyClass } from './re-export.js';
    `,
    };

    mockProject(projectFiles, { projectName: 'my-project', projectPath: '/my/project' });
    const ast = AstService._getBabelAst(projectFiles['./imported.js']);

    // Let's say we want to track down 'MyClass' in the code above
    const identifierNameInScope = 'MyClass';
    const fullCurrentFilePath = '/my/project/internal.js';
    const projectPath = '/my/project';
    let astPath;

    traverse(ast, {
      ImportDeclaration(path) {
        astPath = path;
      },
    });

    const rootFile = await trackDownIdentifierFromScope(
      astPath,
      identifierNameInScope,
      fullCurrentFilePath,
      projectPath,
    );
    expect(rootFile).to.eql({
      file: './src/declarationOfMyClass.js',
      specifier: 'MyClass',
    });
  });

  it(`tracks down extended classes from a reexport`, async () => {
    const projectFiles = {
      './src/classes.js': `
          export class El1 extends HTMLElement {}
          export class El2 extends HTMLElement {}
      `,
      './imported.js': `
        export { El1, El2 } from './src/classes.js';

        export class ExtendedEl1 extends El1 {}
        `,
    };

    mockProject(projectFiles, { projectName: 'my-project', projectPath: '/my/project' });
    const ast = AstService._getBabelAst(projectFiles['./imported.js']);

    // Let's say we want to track down 'MyClass' in the code above
    const identifierNameInScope = 'El1';
    const fullCurrentFilePath = '/my/project/internal.js';
    const projectPath = '/my/project';
    let astPath;

    traverse(ast, {
      ClassDeclaration(path) {
        astPath = path;
      },
    });

    const rootFile = await trackDownIdentifierFromScope(
      astPath,
      identifierNameInScope,
      fullCurrentFilePath,
      projectPath,
    );
    expect(rootFile).to.eql({
      file: './src/classes.js',
      specifier: 'El1',
    });
  });
});
