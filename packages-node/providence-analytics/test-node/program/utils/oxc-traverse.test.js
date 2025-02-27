import { expect } from 'chai';
import { it } from 'mocha';

import babelTraversePkg from '@babel/traverse';
import { nameOf } from '../../../src/program/utils/ast-normalizations.js';
import { oxcTraverse } from '../../../src/program/utils/oxc-traverse.js';
import { AstService } from '../../../src/program/core/AstService.js';
// @ts-ignore

/**
 * @typedef {import('@swc/core').Module} SwcAstModule
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import('../../../types/index.js').SwcScope} SwcScope
 */

/**
 * @param {SwcAstModule} oxcAst
 */
function gatherAllScopes(oxcAst) {
  /** @type {SwcScope[]} */
  const swcScopes = [];
  oxcTraverse(oxcAst, {
    enter({ scope }) {
      if (!swcScopes.includes(scope)) {
        swcScopes.push(scope);
      }
    },
  });
  return swcScopes;
}

describe('oxcTraverse', () => {
  describe('Visitor', () => {
    it('traverses an oxc AST based on <Node.type> visitor', async () => {
      const code = `import x from 'y';`;
      const oxcAst = await AstService._getOxcAst(code);

      let foundImportDeclarationPath;
      const visitor = {
        ImportDeclaration(/** @type {SwcPath} */ path) {
          foundImportDeclarationPath = path;
        },
      };
      oxcTraverse(oxcAst, visitor);

      expect(foundImportDeclarationPath).to.not.be.undefined;
    });

    it('supports "enter" as a generic arrival handler', async () => {
      const code = `import x from 'y';`;
      const oxcAst = await AstService._getOxcAst(code);

      /** @type {string[]} */
      const foundTypes = [];
      const visitor = {
        /**
         * @param {any} path
         */
        enter(path) {
          foundTypes.push(path.node.type);
        },
      };
      oxcTraverse(oxcAst, visitor);

      expect(foundTypes).to.deep.equal([
        // 'Module',
        'Program',
        'ImportDeclaration',
        'ImportDefaultSpecifier',
        'Identifier',
        'Literal',
      ]);
    });

    it('supports "enter" and "exit" as generic handlers inside <Node.type> handlers', async () => {
      const code = `import x from 'y';`;
      const oxcAst = await AstService._getOxcAst(code);

      /** @type {string[]} */
      const visitedPaths = [];
      const visitor = {
        /**
         * @param {any} path
         */
        ImportDeclaration: {
          enter(path) {
            visitedPaths.push({ path, phase: 'enter' });
          },
          exit(path) {
            visitedPaths.push({ path, phase: 'exit' });
          },
        },
      };
      oxcTraverse(oxcAst, visitor);

      expect(visitedPaths[0].path).to.equal(visitedPaths[1].path);
      expect(visitedPaths[0].phase).to.equal('enter');
      expect(visitedPaths[1].phase).to.equal('exit');
    });

    it('supports "root" as alternative for Program', async () => {
      const code = `import x from 'y';`;
      const oxcAst = await AstService._getOxcAst(code);

      let rootPath;
      const visitor = {
        /**
         * @param {any} path
         */
        root(path) {
          rootPath = path;
        },
      };
      oxcTraverse(oxcAst, visitor);

      // TODO: also add case for Script
      expect(rootPath.node.type).to.equal('Program');
    });

    it('does not fail on object prototype built-ins (like "toString")', async () => {
      const code = `const { toString } = x;`;
      const oxcAst = await AstService._getOxcAst(code);

      expect(oxcTraverse(oxcAst, {})).to.not.throw;
    });
  });

  describe.skip('Paths', () => {
    it(`adds {
      node: SwcNode;
      parent: SwcNode;
      stop: function;
      scope: SwcScope;
      parentPath: SwcPath;
    }`, async () => {});

    it('supports getPathFromNode', async () => {});
  });

  describe('Scopes', () => {
    describe('Lexical scoping', () => {
      it('creates scopes for blocks', async () => {
        const code = `
        const globalScope = 0;
        {
          const middleScope = 1;
          {
            const deepestScope = 2;
          }  
        }
        const alsoGlobalScope = 3;    
      `;
        const oxcAst = await AstService._getOxcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          /**
           * @param {any} path
           */
          VariableDeclarator(path) {
            declaratorPaths.push(path);
          },
        };
        oxcTraverse(oxcAst, visitor, { needsAdvancedPaths: true });

        expect(declaratorPaths[0].scope.id).to.equal(0);
        expect(declaratorPaths[1].scope.id).to.equal(1);
        expect(declaratorPaths[2].scope.id).to.equal(2);

        expect(nameOf(declaratorPaths[0].node.id)).to.equal('globalScope');
        expect(Object.keys(declaratorPaths[0].scope.bindings)).to.deep.equal([
          'globalScope',
          'alsoGlobalScope',
        ]);
        // 0 and 3 are the same scope
        expect(declaratorPaths[0].scope).to.equal(declaratorPaths[3].scope);
        // Scope bindings refer to Declarator nodes
        expect(declaratorPaths[0].scope.bindings.globalScope.path.node).to.equal(
          declaratorPaths[0].node,
        );
        expect(declaratorPaths[0].scope.bindings.alsoGlobalScope.path.node).to.equal(
          declaratorPaths[3].node,
        );

        expect(Object.keys(declaratorPaths[1].scope.bindings)).to.deep.equal(['middleScope']);
        expect(Object.keys(declaratorPaths[2].scope.bindings)).to.deep.equal(['deepestScope']);
      });

      it('creates scopes for nested FunctionDeclaration', async () => {
        const code = `
        function globalFn() {
          function middleScope() {
            function deepestScope() {

            }
          }
        }
      `;
        const oxcAst = await AstService._getOxcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          FunctionDeclaration(/** @type {any} */ path) {
            declaratorPaths.push(path);
          },
        };
        oxcTraverse(oxcAst, visitor, { needsAdvancedPaths: true });
        const scopes = gatherAllScopes(oxcAst);

        expect(scopes[1].path?.node).to.equal(declaratorPaths[0].node);
        expect(scopes[2].path?.node).to.equal(declaratorPaths[1].node);
        expect(scopes[3].path?.node).to.equal(declaratorPaths[2].node);
      });

      it('creates scopes for ClassDeclaration', async () => {
        const code = `
        class X extends HTMLElement {
          constructor() {
            var x = 1;
          }

          method() {
            window.alert('hi');
          }
        }
      `;
        const oxcAst = await AstService._getOxcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          VariableDeclarator(/** @type {any} */ path) {
            declaratorPaths.push(path);
          },
        };
        oxcTraverse(oxcAst, visitor, { needsAdvancedPaths: true });

        expect(declaratorPaths[0].scope.id).to.equal(2);
      });

      it('creates scopes SwitchStatement', async () => {
        const code = `
        const myCases = { a: true };
        switch (myCases) {
          case myCases.a:
            const x = 1;
            break;
          default:
        }`;
        const oxcAst = await AstService._getOxcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          VariableDeclarator(/** @type {any} */ path) {
            declaratorPaths.push(path);
          },
        };
        oxcTraverse(oxcAst, visitor, { needsAdvancedPaths: true });

        expect(nameOf(declaratorPaths[0].node.id)).to.equal('myCases');
        expect(nameOf(declaratorPaths[1].node.id)).to.equal('x');
        expect(declaratorPaths[0].scope.id).to.equal(0);
        expect(declaratorPaths[1].scope.id).to.equal(1);
      });

      it('creates scopes for ObjectExpression', async () => {
        const code = `
        export default {
          toString(dateObj, opt = {}) {},
        };
        `;
        const oxcAst = await AstService._getOxcAst(code);

        /** @type {SwcPath[]} */
        const results = [];
        const visitor = {
          // MethodProperty for swc...
          ObjectProperty(/** @type {any} */ path) {
            results.push(path);
          },
        };
        oxcTraverse(oxcAst, visitor, { needsAdvancedPaths: true });

        expect(nameOf(results[0].node.key)).to.equal('toString');
        expect(results[0].scope.id).to.equal(0);
      });

      it('works for KeyValueProperty', async () => {
        const code = `
        export const x = {
          y:() => {
            const z = 1;
          },
        };
        `;
        const oxcAst = await AstService._getOxcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          VariableDeclarator(/** @type {any} */ path) {
            declaratorPaths.push(path);
          },
        };
        oxcTraverse(oxcAst, visitor, { needsAdvancedPaths: true });

        expect(nameOf(declaratorPaths[0].node.id)).to.equal('x');
        expect(nameOf(declaratorPaths[1].node.id)).to.equal('z');
        expect(declaratorPaths[0].scope.id).to.equal(0);
        expect(declaratorPaths[1].scope.id).to.equal(1);
      });
    });

    describe('Bindings', () => {
      it('binds const and lets to block scope', async () => {
        const code = `
        const globalScope = 0;
        {
          let middleScope = 1;
          {
            const deepestScope = 2;
          }  
        }
        let alsoGlobalScope = 3;    
      `;
        const oxcAst = await AstService._getOxcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          VariableDeclarator(/** @type {SwcPath} */ path) {
            declaratorPaths.push(path);
          },
          FunctionDeclaration(/** @type {SwcPath} */ path) {
            declaratorPaths.push(path);
          },
        };
        oxcTraverse(oxcAst, visitor, { needsAdvancedPaths: true });

        expect(Object.keys(declaratorPaths[0].scope.bindings)).to.deep.equal([
          'globalScope',
          'alsoGlobalScope',
        ]);
        // Scope bindings refer to Declarator nodes
        expect(declaratorPaths[0].scope.bindings.globalScope.path.node).to.equal(
          declaratorPaths[0].node,
        );
        expect(declaratorPaths[0].scope.bindings.alsoGlobalScope.path.node).to.equal(
          declaratorPaths[3].node,
        );
      });

      it('binds vars to function scope', async () => {
        const code = `
        var globalScope = 0;
        {
          var stillGlobalScope = 1;
          function middleScope() {
            var insideFnScope = 2;
          }  
        }
      `;
        const oxcAst = await AstService._getOxcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          VariableDeclarator(/** @type {SwcPath} */ path) {
            declaratorPaths.push(path);
          },
        };
        oxcTraverse(oxcAst, visitor, { needsAdvancedPaths: true });

        expect(Object.keys(declaratorPaths[0].scope.bindings)).to.deep.equal([
          'globalScope',
          'stillGlobalScope',
        ]);
        expect(Object.keys(declaratorPaths[1].scope.bindings)).to.deep.equal(['middleScope']);
        expect(Object.keys(declaratorPaths[2].scope.bindings)).to.deep.equal(['insideFnScope']);
      });
    });

    describe.skip('References', () => {});
  });

  describe('Babel compatibility', () => {
    const babelTraverse = babelTraversePkg.default;

    /**
     * @param {string} code
     */
    async function compareScopeResultsWithBabel(code) {
      const oxcAst = await AstService._getOxcAst(code);
      const babelAst = await AstService._getBabelAst(code);

      /**
       * @type {any[]}
       */
      const babelScopes = [];
      babelTraverse(babelAst, {
        // @ts-ignore
        enter({ scope }) {
          if (!babelScopes.includes(scope)) {
            babelScopes.push(scope);
          }
        },
      });

      /** @type {SwcScope[]} */
      const swcScopes = [];
      oxcTraverse(oxcAst, {
        enter({ scope }) {
          if (!swcScopes.includes(scope)) {
            swcScopes.push(scope);
          }
        },
      });

      const babelRootScopeIdOffset = babelScopes[0].uid;

      expect(babelScopes.length).to.equal(swcScopes.length);
      for (let i = 0; i < babelScopes.length; i += 1) {
        expect(babelScopes[i].uid - babelRootScopeIdOffset).to.equal(swcScopes[i].id);

        const babelEntries = Object.entries(babelScopes[i].bindings);
        const swcEntries = Object.entries(swcScopes[i].bindings);
        for (const [j, [bindingKey, binding]] of babelEntries.entries()) {
          expect(bindingKey).to.equal(swcEntries[j][0]);
          expect(binding.path.node.type).to.equal(swcEntries[j][1]?.path?.node.type);
        }

        // expect(Object.keys(babelScopes[i].bindings)).to.deep.equal(
        //   Object.keys(swcScopes[i].bindings),
        // );
        // expect(babelScopes[i].references).to.deep.equal(swcResults[i].references);
      }
    }

    it('handles all kinds of lexical scopes and bindings in a similar way', async () => {
      const code = `
      const globalScope = 0;
      function fn() {
        let middleScope = 2;
        function fn() {
          var parentScope = 3;
        }
      }
      const alsoGlobalScope = 4;

      {
        const myCases = { a: true };
        {
          switch (myCases) {
            case myCases.a:
              const x = 1;
              break;
            default:
          };
        }
      }

      class Q {
        constructor() {

        }
      }
    `;

      await compareScopeResultsWithBabel(code);
    });

    it('handles all kinds of lexical scopes and bindings in a similar way 2', async () => {
      const code = `
        import { LionComp } from 'ref/LionComp.js';

        export class WolfComp extends LionComp {}
    `;

      await compareScopeResultsWithBabel(code);
    });
  });
});
