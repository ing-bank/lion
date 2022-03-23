/* eslint-disable import/no-extraneous-dependencies */
import { toMdast } from 'hast-util-to-mdast';
import { toMarkdown } from 'mdast-util-to-markdown';
import { sanitize } from 'hast-util-sanitize';
import { toHast } from 'mdast-util-to-hast';

/**
 * Plugin to serialize markdown as HTML.
 *
 * @type {import('unified').Plugin<[Options?]|void[], Root, string>}
 */
export async function unifiedToMarkdown(settings = {}) {
  const options = { ...settings };

  // eslint-disable-next-line no-use-before-define
  Object.assign(this, { Compiler: compiler });

  /**
   * @type {import('unified').CompilerFunction<Root, string>}
   */
  function compiler(node, file) {
    const hast = toHast(node, {
      allowDangerousHtml: true,
      handlers: options.handlers,
    });
    const mdAst = toMdast(hast);
    const result = toMarkdown(mdAst);

    if (file.extname) {
      // eslint-disable-next-line no-param-reassign
      file.extname = '.md';
    }

    // Add an eof eol.
    return node &&
      node.type &&
      node.type === 'root' &&
      result &&
      /[^\r\n]/.test(result.charAt(result.length - 1))
      ? `${result}\n`
      : result;
  }
}
