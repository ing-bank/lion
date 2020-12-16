const fs = require('fs');
const pathLib = require('path');
const inquirer = require('inquirer');
const { default: traverse } = require('@babel/traverse');
const { InputDataService } = require('../program/services/InputDataService.js');
const { AstService } = require('../program/services/AstService.js');
const { LogService } = require('../program/services/LogService.js');
const JsdocCommentParser = require('../program/utils/jsdoc-comment-parser.js');

/**
 * @desc extracts name, defaultValue, optional, type, desc from JsdocCommentParser.parse method
 * result
 * @param {array} jsdoc
 * @returns {object}
 */
function getPropsFromParsedJsDoc(jsdoc) {
  const jsdocProps = jsdoc.filter(p => p.tagName === '@property');
  const options = jsdocProps.map(({ tagValue }) => {
    // eslint-disable-next-line no-unused-vars
    const [_, type, nameOptionalDefault, desc] = tagValue.match(/\{(.*)\}\s*([^\s]*)\s*(.*)/);
    let nameDefault = nameOptionalDefault;
    let optional = false;
    if (nameOptionalDefault.startsWith('[') && nameOptionalDefault.endsWith(']')) {
      optional = true;
      nameDefault = nameOptionalDefault.slice(1).slice(0, -1);
    }
    const [name, defaultValue] = nameDefault.split('=');
    return { name, defaultValue, optional, type, desc };
  });
  return options;
}

function getAnalyzerOptions(file) {
  const code = fs.readFileSync(file, 'utf8');
  const ast = AstService.getAst(code, 'babel', { filePath: file });

  let commentNode;
  traverse(ast, {
    // eslint-disable-next-line no-shadow
    VariableDeclaration(path) {
      if (!path.node.leadingComments) {
        return;
      }
      const decls = path.node.declarations || [];
      decls.forEach(decl => {
        if (decl && decl.id && decl.id.name === 'cfg') {
          [commentNode] = path.node.leadingComments;
        }
      });
    },
  });

  if (commentNode) {
    const jsdoc = JsdocCommentParser.parse(commentNode);
    return getPropsFromParsedJsDoc(jsdoc);
  }
  return undefined;
}

function gatherAnalyzers(dir, getConfigOptions) {
  return InputDataService.gatherFilesFromDir(dir, { depth: 0 }).map(file => {
    const analyzerObj = { file, name: pathLib.basename(file, '.js') };
    if (getConfigOptions) {
      analyzerObj.options = getAnalyzerOptions(file);
    }
    return analyzerObj;
  });
}

async function promptAnalyzerConfigMenu(
  analyzerName,
  promptOptionalConfig,
  dir = pathLib.resolve(__dirname, '../program/analyzers'),
) {
  const menuOptions = gatherAnalyzers(dir, true);
  const analyzer = menuOptions.find(o => o.name === analyzerName);
  if (!analyzer) {
    LogService.error(`[promptAnalyzerConfigMenu] analyzer "${analyzerName}" not found.`);
    process.exit(1);
  }
  let configAnswers;
  if (analyzer.options) {
    configAnswers = await inquirer.prompt(
      analyzer.options
        .filter(a => promptOptionalConfig || !a.optional)
        .map(a => ({
          name: a.name,
          message: a.description,
          ...(a.defaultValue ? { default: a.defaultValue } : {}),
        })),
    );

    Object.entries(configAnswers).forEach(([key, value]) => {
      const { type } = analyzer.options.find(o => o.name === key);
      if (type.toLowerCase() === 'boolean') {
        configAnswers[key] = value === 'false' ? false : Boolean(value);
      } else if (type.toLowerCase() === 'number') {
        configAnswers[key] = Number(value);
      } else if (type.toLowerCase() !== 'string') {
        if (value) {
          configAnswers[key] = JSON.parse(value);
        } else {
          // Make sure to not override predefined values with undefined ones
          delete configAnswers[key];
        }
      }
    });
  }

  return {
    analyzerConfig: configAnswers,
  };
}

async function promptAnalyzerMenu(dir = pathLib.resolve(__dirname, '../program/analyzers')) {
  const menuOptions = gatherAnalyzers(dir);
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'analyzerName',
      message: 'Which analyzer do you want to run?',
      choices: menuOptions.map(o => o.name),
    },
  ]);
  return {
    analyzerName: answers.analyzerName,
  };
}

module.exports = {
  promptAnalyzerMenu,
  promptAnalyzerConfigMenu,
};
