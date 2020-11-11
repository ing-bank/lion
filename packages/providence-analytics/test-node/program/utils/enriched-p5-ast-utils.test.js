const { expect } = require('chai');
const babelParser = require('@babel/parser');
const { default: traverse } = require('@babel/traverse');
const { traverseHtml } = require('../../../src/program/utils/traverse-html.js');
const {
  createEnrichedP5AstForTemplate,
  createBabelTemplateLiteralFromP5Ast,
  findAndProcessAttrMatchInP5Ast,
  replaceAttrValueInP5Ast,
} = require('../../../src/program/utils/template-p5-ast-utils.js');

function getTplExpression(code) {
  const ast = babelParser.parse(code, {
    sourceType: 'module',
    plugins: ['importMeta', 'dynamicImport', 'classProperties'],
  });
  let tplExpressionPath;
  traverse(ast, {
    TaggedTemplateExpression(path) {
      tplExpressionPath = path;
      path.stop();
    },
  });
  return tplExpressionPath;
}

describe('createEnrichedP5AstForTemplate', () => {
  describe('Default output', () => {
    it('provides a parse5 ast (enriched)', async () => {});
    // it('provides a write method', async () => {});
    it('stores the Babel TemplateLiteralExpression', async () => {});
  });

  describe('Attribute meta', () => {
    it('connects babel expression to parse5 attrs', async () => {
      const tpl =
        // eslint-disable-next-line no-template-curly-in-string
        'html`<el-x .prop="${0}" test="c"></el-x>${1}<el-y .prop="${2}"></el-y>`';
      const tplExpressionPath = getTplExpression(tpl);
      const enrichedP5Ast = createEnrichedP5AstForTemplate(tplExpressionPath);
      let foundAttrX;
      let foundAttrY;
      traverseHtml(enrichedP5Ast, {
        // eslint-disable-next-line object-shorthand
        'el-x'(p5Path) {
          foundAttrX = p5Path.node.attrs.find(a => a.name === '.prop');
        },
        // eslint-disable-next-line object-shorthand
        'el-y'(p5Path) {
          foundAttrY = p5Path.node.attrs.find(a => a.name === '.prop');
        },
      });
      expect(foundAttrX.expression).to.equal(tplExpressionPath.node.quasi.expressions[0]);
      expect(foundAttrY.expression).to.equal(tplExpressionPath.node.quasi.expressions[2]);
    });

    describe('Types', () => {
      it('adds type (property|attribute|boolean|event) meta info to attributes', async () => {
        const templateLiteral = getTplExpression(
          // eslint-disable-next-line no-template-curly-in-string
          'html`<el-x .prop="${identifier}" ?bool="${identifier}" @event="${identifier}" attr="a"></el-x>`',
        );
        const enrichedP5Ast = createEnrichedP5AstForTemplate(templateLiteral);
        // eslint-disable-next-line one-var
        let foundProp, foundAttr, foundBool, foundEvent;
        traverseHtml(enrichedP5Ast, {
          // eslint-disable-next-line object-shorthand
          'el-x'(p5Path) {
            foundProp = p5Path.node.attrs.find(a => a.name === '.prop');
            foundAttr = p5Path.node.attrs.find(a => a.name === 'attr');
            foundBool = p5Path.node.attrs.find(a => a.name === '?bool');
            foundEvent = p5Path.node.attrs.find(a => a.name === '@event');
          },
        });
        expect(foundAttr.type).to.equal('attribute');
        expect(foundProp.type).to.equal('property');
        expect(foundBool.type).to.equal('boolean');
        expect(foundEvent.type).to.equal('event');
      });

      // TODO: changing order makes parse5 fail on attr="a" successor (preciding name will be concatted)
      // 'html`<el-x .prop="${identifier}" attr="a" ?bool="${identifier}" @event="${identifier}" ></el-x>`
      // gives { name: 'attr="a" ?bool='}.
      // In astexplorer.net everything works fine (parse5 v6) => check if updating to v6 fixes the problem
      it.skip('adds type (property|attribute|boolean|event) meta info to attributes, regardless of order', async () => {
        const templateLiteral = getTplExpression(
          // eslint-disable-next-line no-template-curly-in-string
          'html`<el-x @event="${identifier}" attr="a" ?bool="${identifier}" .prop="${identifier}"></el-x>`',
        );
        const enrichedP5Ast = createEnrichedP5AstForTemplate(templateLiteral);
        // eslint-disable-next-line one-var
        let foundProp, foundAttr, foundBool, foundEvent;
        traverseHtml(enrichedP5Ast, {
          // eslint-disable-next-line object-shorthand
          'el-x'(p5Path) {
            foundProp = p5Path.node.attrs.find(a => a.name === '.prop');
            foundAttr = p5Path.node.attrs.find(a => a.name === 'attr');
            foundBool = p5Path.node.attrs.find(a => a.name === '?bool');
            foundEvent = p5Path.node.attrs.find(a => a.name === '@event');
          },
        });
        expect(foundAttr.type).to.equal('attribute');
        expect(foundProp.type).to.equal('property');
        expect(foundBool.type).to.equal('boolean');
        expect(foundEvent.type).to.equal('event');
      });
    });
  });

  describe('Tag meta', () => {
    it('adds "tagMeta" object when tagMap provided', async () => {
      const templateLiteral = getTplExpression('html`<el-x></el-x><el-y></el-y>`');
      const tagMap = new Map();
      tagMap.set('el-x', {
        classIdentifier: 'ElX',
        rootFile: './src/ElX.js',
      });
      const enrichedP5Ast = createEnrichedP5AstForTemplate(templateLiteral, tagMap);
      let foundTagMetaX;
      let foundTagMetaY;
      traverseHtml(enrichedP5Ast, {
        // eslint-disable-next-line object-shorthand
        'el-x'(p5Path) {
          foundTagMetaX = p5Path.node.tagMeta;
        },
        // eslint-disable-next-line object-shorthand
        'el-y'(p5Path) {
          foundTagMetaY = p5Path.node.tagMeta;
        },
      });
      expect(foundTagMetaX).to.eql({
        classIdentifier: 'ElX',
        rootFile: './src/ElX.js',
        // FindClassesAnalyzerResult?
      });
      expect(foundTagMetaY).to.be.undefined;
    });
  });

  describe('Convert back to TemplateLiteralExpression string', () => {
    it('preserves output string for a templateLiteralExpression', async () => {
      const literal =
        // eslint-disable-next-line no-template-curly-in-string
        'html`<el-x .prop="${identifier}" ?bool="${identifier}" @event="${identifier}" attr="a"></el-x>`';
      const templateLiteral = getTplExpression(literal);
      const enrichedP5Ast = createEnrichedP5AstForTemplate(templateLiteral);
      const result = createBabelTemplateLiteralFromP5Ast(enrichedP5Ast);
      expect(result).to.equal(literal);
    });

    describe.only('Transforms', () => {
      const attrMatchConfigs = [
        {
          attrName: '.prop',
          onAttrMatch: replaceAttrValueInP5Ast,
        },
        {
          attrName: 'attr',
          onAttrMatch: replaceAttrValueInP5Ast,
        },
      ];
      const oldToNewMap = {
        prop: 'replacedProp',
        a: 'replacedA',
      };

      it('outputs string for a transformed parse5 ast', async () => {
        const from =
          // eslint-disable-next-line no-template-curly-in-string
          'html`<el-x .prop="${\'prop\'}" ?bool="${identifier}" @event="${identifier}" attr="a"></el-x>`';
        const templateLiteral = getTplExpression(from);
        const enrichedP5Ast = createEnrichedP5AstForTemplate(templateLiteral);
        findAndProcessAttrMatchInP5Ast(enrichedP5Ast, {
          oldToNewMap,
          attrMatchConfigs,
          tagName: 'el-x',
        });
        const result = createBabelTemplateLiteralFromP5Ast(enrichedP5Ast);
        const to =
          // eslint-disable-next-line no-template-curly-in-string
          'html`<el-x .prop="${\'replacedProp\'}" ?bool="${identifier}" @event="${identifier}" attr="replacedA"></el-x>`';
        expect(result).to.equal(to);
      });

      it.only('tracks multiple expressions in attr', async () => {
        const from =
          // eslint-disable-next-line no-template-curly-in-string
          "html`<el-x a=\"before${'expr1'}middle${'expr2'}after\" b=\"${'exprBegin'}smth\" b=\"smth${'exprAfter'}\"></el-x>`";
        const templateLiteral = getTplExpression(from);
        const enrichedP5Ast = createEnrichedP5AstForTemplate(templateLiteral);
        const result = createBabelTemplateLiteralFromP5Ast(enrichedP5Ast);
        // We can't transform these (yet)
        expect(result).to.equal(from);
      });
    });
  });
});
