/* eslint-disable no-shadow */
/* eslint-disable max-classes-per-file */
const fs = require('fs');
const pathLib = require('path');

const babel = require('@babel/core');
const babelParser = require('@babel/parser');
const babelGenerate = require('@babel/generator').default;
// const recast = require('recast');
const prettier = require('prettier');

const { gatherFilesFromDir } = require('./helpers/gather-files-from-dir.js');
const { parseToNodes } = require('./helpers/parse-to-nodes.js');
const { BrowserLitTemplate } = require('./helpers/BrowserLitTemplate.js');

// STATIC DATA
const builtInValidatorFunctions = [
  "isString",
  "equalsLength",
  "minLength",
  "maxLength",
  "minMaxLength",
  "isEmail",
  "isNumber",
  "minNumber",
  "maxNumber",
  "minMaxNumber",
  "isDate",
  "minDate",
  "maxDate",
  "isDateDisabled",
  "minMaxDate",
  "randomOk",
  "defaultOk",
];
const builtInValidators = builtInValidatorFunctions.map(v => `${v}Validator`);


const { types: t } = babel;

// TODO: change path to all packages later
const files = gatherFilesFromDir(pathLib.resolve(__dirname, './example-sources/migrate-validate-new-api'));
const asts = files.map(filePath => {
  const code = fs.readFileSync(filePath, 'utf8');
  const ast = babelParser.parse(code, {
    sourceType: 'unambiguous',
    plugins: [
      'importMeta',
      'dynamicImport',
    ],
  });
  return { ast, filePath };
});

// Round 1
let round1CompletedResolve;
const round1Completed = new Promise((resolve) => {
  round1CompletedResolve = resolve;
});

asts.forEach(({ ast }) => {
  // State per file
  const foundValidators = [];

  babel.traverse(ast, {
    ImportSpecifier(path) {
      if (path.node.imported.name && builtInValidators.includes(path.node.imported.name)) {
        foundValidators.push(path.node.imported.name);
      }
      // path.node.name = path.node.name.split('').reverse().join('');
    },
    Program: {
      exit(path) {
        // TODO: doing it in the 'regular' traverse should also work (unless we have dynamic imports)

        /**
         * @param {object} CallExpression path
         * @param {'error'|'warning'|'info'|'success'} type
         */
        function replaceValidatorsInCallExpression(path, type, foundValidators) {
          if (!foundValidators.includes(path.node.callee.name)) {
            return;
          }

          const oldName = path.node.callee.name;
          const oldArgs = path.node.arguments;

          let newName;
          const newArgs = [];
          if (oldName === "randomOkValidator") {
            newName = "DefaultSuccess";
          }
          newName = oldName.replace("Validator", "").replace(/^\w/, c => c.toUpperCase());

          if (oldArgs[0]) {
            newArgs.push(oldArgs[0]);
          }

          if (type === "error" && oldArgs[1]) {
            newArgs.push(oldArgs[1]);
          } else {
            // eslint-disable-next-line no-lonely-if
            if (!oldArgs[1]) {
              const obj = parseToNodes(`({ type : '${type}' })`, "ObjectExpression")[0];
              newArgs.push(obj);
            } else {
              // find out type of node
              // eslint-disable-next-line no-lonely-if
              if (oldArgs[1].type === "ObjectExpression") {
                const prop = parseToNodes(`({ type : '${type}' })`, "ObjectProperty")[0];
                oldArgs[1].properties.push(prop);
              } else if (path.node.arguments[1].type === "Identifier") {
                // const binding = path.scope.getBinding(path.node.arguments[1].name);
                // console.log('binding', binding);
                // const objectExpressionNode = binding.path.node.init;
                const { name } = path.node.arguments[1];
                // eslint-disable-next-line no-undef
                const argExpression = parseToNodes(`({ ...${name}, type: '${type}' })`)[0];
                newArgs[1] = argExpression.expression;
              }
            }
          }

          path.replaceWith(t.newExpression(t.Identifier(newName), newArgs));
        }

        // Step 2 of example source...

        // Stores all occurrences of lit-html templates including validators
        /**  @type {Map<TaggedTemplateExpressionPath, { partIndex: expression }>} */
        const tpLiteralPaths = new Map();

        // Rename things like minLengthValidator to new MinLength(param, {type: 'info'})
        path.traverse({
          TaggedTemplateExpression(path) {
            if (path.node.tag.name !== 'html') { // only lit-html
              return;
            }

            const literal = path.node.quasi;
            const propsToFind = [
              'errorValidators',
              'warningValidators',
              'infoValidators',
              'successValidators'
            ];

            propsToFind.forEach(prop => {
              literal.quasis.forEach((quasi, index) => {
                if (quasi.value.raw.replace('\\"', '"').endsWith(`.${prop}="`)) {
                  if (!tpLiteralPaths.get(path)) {
                    tpLiteralPaths.set(path, []);
                  }
                  // We store the quasi indexes, which corresponds to the expression index,
                  // which on its turn is mapped to the Part index of a TemplateResult
                  tpLiteralPaths.get(path).push({ index, prop });

                  // So we search in expression behind '.warningValidators="${'
                  const propPath = path.get('quasi').get('expressions');
                  const type = prop.replace('Validators', '');
                  propPath[index].traverse({
                    CallExpression: path => replaceValidatorsInCallExpression(path, type, foundValidators)
                  });
                }
              });
            });
          }
        });

        // Combine all validator occurrences into one...
        const arr = Array.from(tpLiteralPaths);

        const allPromises = Promise.all(arr.map(async ([tpLiteralPath, props]) => {
          const browserLitTemplate = new BrowserLitTemplate(tpLiteralPath);
          await browserLitTemplate.init();
          // For all indexes (expression and quasi(string) pairs) that should be altered, loop

          // Find the expressions that contained the `.errorValidators`, `.infoValidators` etc.
          // and merge them into one `.validators`.
          // As long as those expressions belong to the same element, try to merge them into
          // one array, delete all other props and stitch the strings (quasis) together. Also,
          // delete the moved expressions and quasis in the AST.

          // Sort all props by element
          const elements = new Map();

          props.forEach(({ index, prop }) => {
            console.log('browserLitTemplate._meta', browserLitTemplate._meta);
            const propertyPart = browserLitTemplate.templateResult.parts[index];
            const element = propertyPart.node;

            if (!elements.get(element)) {
              elements.set(element, []);
            }

            elements.get(element).push({ index, prop });
          });
        }))

        allPromises.then(() => {
          round1CompletedResolve();
        });
      }
    }
  });
});

(async () => {
  await round1Completed;
  // Round 2. Trace all locally defined custom Validators and change them,,,

  asts.forEach(({ ast, filePath }) => {
    const { code } = babelGenerate(ast, {
      retainLines: true,
      retainFunctionParens: true,
    });

    const fpath = filePath.replace('/example-sources/', '/example-output/');
    fs.mkdirSync(pathLib.dirname(fpath), { recursive: true });

    prettier.resolveConfigFile().then(filePath => {
      prettier.resolveConfig(filePath).then(options => {
        const formatted = prettier.format(code, { parser: 'babel', ...options });
        fs.writeFileSync(fpath, formatted);
      });
    });

  });
})();
