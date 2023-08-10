// @ts-ignore
import prettier from 'prettier';

/** @typedef {import('prettier').Options } PrettierOptions */

export const ERROR_UNSUPPORTED_FILE_EXTENSION = 'Unsupported file extension';

/**
 * Removes empty(whitespace only) lines from given string `text`
 * @example removeEmptyLines('my\n\n\ntext\n\n') == 'my\ntext'
 * @param {string} text
 * @returns {string}
 */
const removeEmptyLines = text => {
  // @ts-ignore
  const byNonEmptyLines = line => !!line?.trim();
  return text.split('\n').filter(byNonEmptyLines).join('\n');
};

/**
 * Get prettier `parser` for given `fileExtension`
 * @example getPrettierParser('md') == 'markdown'
 * @param {string} fileExtension
 * @returns {string}
 * @throws ERROR_UNSUPPORTED_FILE_EXTENSION
 */
const getPrettierParser = fileExtension => {
  // See more parser options here: https://prettier.io/docs/en/options.html#parser
  const FILE_EXTENSION_TO_PARSER = {
    js: 'babel',
    cjs: 'babel',
    mjs: 'babel',
    md: 'markdown',
    html: 'html',
    json: 'json',
    css: 'css',
    yaml: 'yaml',
    yml: 'yaml',
  };
  const parser = FILE_EXTENSION_TO_PARSER[fileExtension];
  if (!parser) {
    throw new Error(ERROR_UNSUPPORTED_FILE_EXTENSION);
  }
  return parser;
};

/**
 * Prettifies text using the prettier.
 * - Supported file extensions are: js | cjs | mjs | md | html | json | css | yaml | yml
 * @example
 *   prettify('some js code');
 *   prettify('<html>some html</html>', 'html');
 *   prettify('some-markdown', 'md', {printWidth: 120});
 * @param {string} text
 * @param {string} fileExtension ['js']
 * @param {PrettierOptions} [options] [{ printWidth = 100, singleQuote = true }]
 * @see {@link https://prettier.io/docs/en/options.html}
 * @returns {string}
 * @throws ERROR_UNSUPPORTED_FILE_EXTENSION
 */
export const prettify = (text, fileExtension = 'js', options = {}) => {
  const parser = getPrettierParser(fileExtension);
  const textToFormat = parser === 'html' ? removeEmptyLines(text) : text;
  /** @type PrettierOptions */
  const prettierOptions = {
    parser,
    printWidth: 100,
    singleQuote: true,
    ...options,
  };
  return prettier.format(textToFormat, prettierOptions);
};
