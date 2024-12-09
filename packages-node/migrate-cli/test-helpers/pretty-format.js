// @ts-ignore
import prettier from 'prettier';

/**
 *
 * @param {string} text
 * @param {{format?:string|boolean;removeEndNewLine?:boolean;printWidth?:number;arrowParens?:'always'|'avoid'}} opts
 * @returns
 */
export async function prettyFormat(
  text,
  { format = 'html', removeEndNewLine = false, printWidth = 100, arrowParens = 'always' } = {},
) {
  let useFormat = format;
  switch (format) {
    case 'html':
      useFormat = 'html';
      break;
    case 'js':
    case 'babel':
      useFormat = 'babel';
      break;
    case 'md':
    case 'markdown':
      useFormat = 'markdown';
      break;
    default:
      useFormat = false;
  }

  if (useFormat === false) {
    return text;
  }

  let formatted = await prettier.format(text, {
    parser: useFormat,
    printWidth,
    arrowParens,
    singleQuote: true,
  });
  // remove all empty lines for html
  if (useFormat === 'html') {
    formatted = formatted
      .split('\n')
      .filter((/** @type {string|undefined} */ line) => line?.trim())
      .join('\n');
  }

  // remove end newline
  if (removeEndNewLine) {
    if (formatted.charAt(formatted.length - 1) === '\n') {
      formatted = formatted.substring(0, formatted.length - 1);
    }
  }

  return formatted;
}
