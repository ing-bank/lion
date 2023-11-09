import { expect } from 'chai';
import { it } from 'mocha';
// @ts-ignore
import babelTraversePkg from '@babel/traverse';
import { swcTraverse } from '../../../src/program/utils/swc-traverse.js';
import { AstService } from '../../../src/program/core/AstService.js';

/**
 * @typedef {import('@swc/core').Module} SwcAstModule
 * @typedef {import('../../../types/index.js').SwcPath} SwcPath
 * @typedef {import('../../../types/index.js').SwcScope} SwcScope
 */

/**
 * @param {SwcAstModule} swcAst
 */
function gatherAllScopes(swcAst) {
  /** @type {SwcScope[]} */
  const swcScopes = [];
  swcTraverse(swcAst, {
    enter({ scope }) {
      if (!swcScopes.includes(scope)) {
        swcScopes.push(scope);
      }
    },
  });
  return swcScopes;
}

describe('swcTraverse', () => {
  describe('Visitor', () => {
    it('traverses an swc AST based on <Node.type> visitor', async () => {
      const code = `import x from 'y';`;
      const swcAst = await AstService._getSwcAst(code);

      let foundImportDeclarationPath;
      const visitor = {
        ImportDeclaration(/** @type {SwcPath} */ path) {
          foundImportDeclarationPath = path;
        },
      };
      swcTraverse(swcAst, visitor);

      expect(foundImportDeclarationPath).to.not.be.undefined;
    });

    it('supports "enter" as a generic arrival handler', async () => {
      const code = `import x from 'y';`;
      const swcAst = await AstService._getSwcAst(code);

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
      swcTraverse(swcAst, visitor);

      expect(foundTypes).to.eql([
        'Module',
        'ImportDeclaration',
        'ImportDefaultSpecifier',
        'Identifier',
        'StringLiteral',
      ]);
    });

    it('supports "enter" and "exit" as generic handlers inside <Node.type> handlers', async () => {
      const code = `import x from 'y';`;
      const swcAst = await AstService._getSwcAst(code);

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
      swcTraverse(swcAst, visitor);

      expect(visitedPaths[0].path).to.equal(visitedPaths[1].path);
      expect(visitedPaths[0].phase).to.equal('enter');
      expect(visitedPaths[1].phase).to.equal('exit');
    });

    it('supports "root" as alternative for Program', async () => {
      const code = `import x from 'y';`;
      const swcAst = await AstService._getSwcAst(code);

      let rootPath;
      const visitor = {
        /**
         * @param {any} path
         */
        root(path) {
          rootPath = path;
        },
      };
      swcTraverse(swcAst, visitor);

      // TODO: also add case for Script
      expect(rootPath.node.type).to.equal('Module');
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
        const swcAst = await AstService._getSwcAst(code);

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
        swcTraverse(swcAst, visitor, { needsAdvancedPaths: true });

        expect(declaratorPaths[0].scope.id).to.equal(0);
        expect(declaratorPaths[1].scope.id).to.equal(1);
        expect(declaratorPaths[2].scope.id).to.equal(2);

        expect(declaratorPaths[0].node.id.value).to.equal('globalScope');
        expect(Object.keys(declaratorPaths[0].scope.bindings)).to.eql([
          'globalScope',
          'alsoGlobalScope',
        ]);
        // 0 and 3 are the same scope
        expect(declaratorPaths[0].scope).to.equal(declaratorPaths[3].scope);
        // Scope bindings refer to Declarator nodes
        expect(declaratorPaths[0].scope.bindings.globalScope.identifier).to.equal(
          declaratorPaths[0].node,
        );
        expect(declaratorPaths[0].scope.bindings.alsoGlobalScope.identifier).to.equal(
          declaratorPaths[3].node,
        );

        expect(Object.keys(declaratorPaths[1].scope.bindings)).to.eql(['middleScope']);
        expect(Object.keys(declaratorPaths[2].scope.bindings)).to.eql(['deepestScope']);
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
        const swcAst = await AstService._getSwcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          FunctionDeclaration(/** @type {any} */ path) {
            declaratorPaths.push(path);
          },
        };
        swcTraverse(swcAst, visitor, { needsAdvancedPaths: true });
        const scopes = gatherAllScopes(swcAst);

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
        const swcAst = await AstService._getSwcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          VariableDeclarator(/** @type {any} */ path) {
            declaratorPaths.push(path);
          },
        };
        swcTraverse(swcAst, visitor, { needsAdvancedPaths: true });

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
        const swcAst = await AstService._getSwcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          VariableDeclarator(/** @type {any} */ path) {
            declaratorPaths.push(path);
          },
        };
        swcTraverse(swcAst, visitor, { needsAdvancedPaths: true });

        expect(declaratorPaths[0].node.id.value).to.equal('myCases');
        expect(declaratorPaths[1].node.id.value).to.equal('x');
        expect(declaratorPaths[0].scope.id).to.equal(0);
        expect(declaratorPaths[1].scope.id).to.equal(1);
      });

      it('creates scopes for ObjectExpression', async () => {
        const code = `
        export default {
          toString(dateObj, opt = {}) {},
        };
        `;
        const swcAst = await AstService._getSwcAst(code);

        /** @type {SwcPath[]} */
        const results = [];
        const visitor = {
          MethodProperty(/** @type {any} */ path) {
            results.push(path);
          },
        };
        swcTraverse(swcAst, visitor, { needsAdvancedPaths: true });

        expect(results[0].node.key.value).to.equal('toString');
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
        const swcAst = await AstService._getSwcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          VariableDeclarator(/** @type {any} */ path) {
            declaratorPaths.push(path);
          },
        };
        swcTraverse(swcAst, visitor, { needsAdvancedPaths: true });

        expect(declaratorPaths[0].node.id.value).to.equal('x');
        expect(declaratorPaths[1].node.id.value).to.equal('z');
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
        const swcAst = await AstService._getSwcAst(code);

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
        swcTraverse(swcAst, visitor, { needsAdvancedPaths: true });

        expect(Object.keys(declaratorPaths[0].scope.bindings)).to.eql([
          'globalScope',
          'alsoGlobalScope',
        ]);
        // Scope bindings refer to Declarator nodes
        expect(declaratorPaths[0].scope.bindings.globalScope.identifier).to.equal(
          declaratorPaths[0].node,
        );
        expect(declaratorPaths[0].scope.bindings.alsoGlobalScope.identifier).to.equal(
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
        const swcAst = await AstService._getSwcAst(code);

        /** @type {SwcPath[]} */
        const declaratorPaths = [];
        const visitor = {
          VariableDeclarator(/** @type {SwcPath} */ path) {
            declaratorPaths.push(path);
          },
        };
        swcTraverse(swcAst, visitor, { needsAdvancedPaths: true });

        expect(Object.keys(declaratorPaths[0].scope.bindings)).to.eql([
          'globalScope',
          'stillGlobalScope',
        ]);
        expect(Object.keys(declaratorPaths[1].scope.bindings)).to.eql(['middleScope']);
        expect(Object.keys(declaratorPaths[2].scope.bindings)).to.eql(['insideFnScope']);
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
      const swcAst = await AstService._getSwcAst(code);
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
      swcTraverse(swcAst, {
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
        expect(Object.keys(babelScopes[i].bindings)).to.eql(Object.keys(swcScopes[i].bindings));
        // expect(babelScopes[i].references).to.eql(swcResults[i].references);
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
  });
});
