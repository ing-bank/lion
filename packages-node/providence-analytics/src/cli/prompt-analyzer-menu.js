import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import traverse from '@babel/traverse';
import { InputDataService } from '../program/core/InputDataService.js';
import { AstService } from '../program/core/AstService.js';
import { LogService } from '../program/core/LogService.js';
import JsdocCommentParser from '../program/utils/jsdoc-comment-parser.js';
import { getCurrentDir } from '../program/utils/get-current-dir.js';

/**
 * @typedef {import('../../types/index.js').TargetDepsObj} TargetDepsObj
 * @typedef {import('../../types/index.js').TargetOrRefCollectionsObj} TargetOrRefCollectionsObj
 * @typedef {import('../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../types/index.js').AnalyzerName} AnalyzerName
 */

/**
 * Extracts name, defaultValue, optional, type, desc from JsdocCommentParser.parse method
 * result
 * @param {{tagName:string;tagValue:string}[]} jsdoc
 * @returns {{ name:string, defaultValue:string, optional:boolean, type:string, desc:string }[]}
 */
function getPropsFromParsedJsDoc(jsdoc) {
  const jsdocProps = jsdoc.filter(p => p.tagName === '@property');
  const options = jsdocProps.map(({ tagValue }) => {
    // eslint-disable-next-line no-unused-vars
    const [_, type, nameOptionalDefault, desc] = tagValue.match(/\{(.*)\}\s*([^\s]*)\s*(.*)/) || [];
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

/**
 * @param {PathFromSystemRoot} file
 */
function getAnalyzerOptions(file) {
  const code = fs.readFileSync(file, 'utf8');
  const babelAst = AstService.getAst(code, 'swc-to-babel', { filePath: file });

  let commentNode;
  traverse.default(babelAst, {
    // eslint-disable-next-line no-shadow
    VariableDeclaration(astPath) {
      const { node } = astPath;
      if (!node.leadingComments) {
        return;
      }
      node.declarations.forEach(decl => {
        // @ts-expect-error
        if (decl?.id?.name === 'cfg') {
          // eslint-disable-next-line prefer-destructuring
          commentNode = node.leadingComments?.[0];
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

/**
 * @param {PathFromSystemRoot} dir
 * @param {boolean} [shouldGetOptions]
 */
function gatherAnalyzers(dir, shouldGetOptions) {
  return InputDataService.gatherFilesFromDir(dir, { depth: 0 }).map(file => {
    const analyzerObj = { file, name: path.basename(file, '.js') };
    if (shouldGetOptions) {
      analyzerObj.options = getAnalyzerOptions(file);
    }
    return analyzerObj;
  });
}

/**
 *
 * @param {AnalyzerName} analyzerName
 * @param {*} promptOptionalConfig
 * @param {PathFromSystemRoot} [dir]
 * @returns
 */
export async function promptAnalyzerConfigMenu(
  analyzerName,
  promptOptionalConfig,
  dir = /** @type {PathFromSystemRoot} */ (
    path.resolve(getCurrentDir(import.meta.url), '../program/analyzers')
  ),
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

export async function promptAnalyzerMenu(
  dir = /** @type {PathFromSystemRoot} */ (
    path.resolve(getCurrentDir(import.meta.url), '../program/analyzers')
  ),
) {
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

export const _promptAnalyzerMenuModule = {
  promptAnalyzerMenu,
  promptAnalyzerConfigMenu,
};
