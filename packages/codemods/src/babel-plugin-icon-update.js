const {
  createEnrichedP5AstForTemplate,
  createBabelTemplateLiteralFromP5Ast,
  findAndProcessAttrMatchInP5Ast,
  replaceAttrValueInP5Ast,
} = require('providence-analytics/src/program/utils/template-p5-ast-utils.js');

// Note that attrs are not same in parse5 and lit-html lingo
const attrMatchConfigs = [
  {
    attrName: 'icon-id',
    onAttrMatch: replaceAttrValueInP5Ast,
  },
  {
    attrName: '.iconId',
    onAttrMatch: replaceAttrValueInP5Ast,
  },
];

module.exports = () => {
  return {
    name: 'icon-update',
    visitor: {
      TaggedTemplateExpression(path, state) {
        if (path.node.tag.name !== 'html') {
          return;
        }

        // Enriches a parse5 html ast by adding meta info about attr types
        const enrichedP5Ast = createEnrichedP5AstForTemplate(path);

        // This manipulates enrichedTemplateLiteral
        findAndProcessAttrMatchInP5Ast(enrichedP5Ast, {
          attrMatchConfigs,
          tagName: 'lion-icon',
          ...state.opts,
        });

        // Now write back result to TaggedTemplateExpression
        const result = createBabelTemplateLiteralFromP5Ast(enrichedP5Ast);
        path.replaceWithSourceString(result);

        path.stop();
      },
    },
  };
};
