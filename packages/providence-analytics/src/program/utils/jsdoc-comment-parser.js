/* eslint-disable */

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 Ryo Maruyama
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// From: https://github.com/esdoc/esdoc/blob/master/src/Parser/CommentParser.js

/**
 * Doc Comment Parser class.
 *
 * @example
 * for (let comment of node.leadingComments) {
 *   let tags = CommentParser.parse(comment);
 *   console.log(tags);
 * }
 */
class JsdocCommentParser {
  /**
   * parse comment to tags.
   * @param {ASTNode} commentNode - comment node.
   * @param {string} commentNode.value - comment body.
   * @param {string} commentNode.type - CommentBlock or CommentLine.
   * @returns {Tag[]} parsed comment.
   */
  static parse(commentNode) {
    if (!this.isESDoc(commentNode)) return [];

    let comment = commentNode.value;

    // TODO: refactor
    comment = comment.replace(/\r\n/gm, '\n'); // for windows
    comment = comment.replace(/^[\t ]*/gm, ''); // remove line head space
    comment = comment.replace(/^\*[\t ]?/, ''); // remove first '*'
    comment = comment.replace(/[\t ]$/, ''); // remove last space
    comment = comment.replace(/^\*[\t ]?/gm, ''); // remove line head '*'
    if (comment.charAt(0) !== '@') comment = `@desc ${comment}`; // auto insert @desc
    comment = comment.replace(/[\t ]*$/, ''); // remove tail space.
    comment = comment.replace(/```[\s\S]*?```/g, match => match.replace(/@/g, '\\ESCAPED_AT\\')); // escape code in descriptions
    comment = comment.replace(/^[\t ]*(@\w+)$/gm, '$1 \\TRUE'); // auto insert tag text to non-text tag (e.g. @interface)
    comment = comment.replace(/^[\t ]*(@\w+)[\t ](.*)/gm, '\\Z$1\\Z$2'); // insert separator (\\Z@tag\\Ztext)
    const lines = comment.split('\\Z');

    let tagName = '';
    let tagValue = '';
    const tags = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.charAt(0) === '@') {
        tagName = line;
        const nextLine = lines[i + 1];
        if (nextLine.charAt(0) === '@') {
          tagValue = '';
        } else {
          tagValue = nextLine;
          i++;
        }
        tagValue = tagValue
          .replace('\\TRUE', '')
          .replace(/\\ESCAPED_AT\\/g, '@')
          .replace(/^\n/, '')
          .replace(/\n*$/, '');
        tags.push({ tagName, tagValue });
      }
    }
    return tags;
  }

  /**
   * parse node to tags.
   * @param {ASTNode} node - node.
   * @returns {{tags: Tag[], commentNode: CommentNode}} parsed comment.
   */
  static parseFromNode(node) {
    if (!node.leadingComments) node.leadingComments = [{ type: 'CommentBlock', value: '' }];
    const commentNode = node.leadingComments[node.leadingComments.length - 1];
    const tags = this.parse(commentNode);

    return { tags, commentNode };
  }

  /**
   * judge doc comment or not.
   * @param {ASTNode} commentNode - comment node.
   * @returns {boolean} if true, this comment node is doc comment.
   */
  static isESDoc(commentNode) {
    if (commentNode.type !== 'CommentBlock') return false;
    return commentNode.value.charAt(0) === '*';
  }

  /**
   * build comment from tags
   * @param {Tag[]} tags
   * @returns {string} block comment value.
   */
  static buildComment(tags) {
    return tags.reduce((comment, tag) => {
      const line = tag.tagValue.replace(/\n/g, '\n * ');
      return `${comment} * ${tag.tagName} \n * ${line} \n`;
    }, '*\n');
  }
}

module.exports = JsdocCommentParser;
