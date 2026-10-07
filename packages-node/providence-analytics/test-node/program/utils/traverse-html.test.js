import { expect } from 'chai';
import { it } from 'mocha';
import * as parse5 from 'parse5';
import { traverseHtml } from '../../../src/program/utils/traverse-html.js';

/**
 * @typedef {{ name: string; value: string }} P5Attr
 * @typedef {import('../../../src/program/utils/traverse-html.js').HtmlAstPath} HtmlAstPath
 */

/**
 * @param {{ node: unknown }} p5Path
 */
function getId(p5Path) {
  const { attrs } = /** @type {{ attrs: P5Attr[] }} */ (p5Path.node);
  return /** @type {P5Attr} */ (attrs.find(a => a.name === 'id')).value;
}

describe('traverseHtml', () => {
  it('finds different tag names', async () => {
    const htmlCode = `
      <div id="a-lvl1">
        <span id="a-lvl2">
          <my-tag id="a-lvl3">
            <not-found></notfound>
          </my-tag>
        </span>
      </div>
      <div id="b"></div>
    `;

    const ast = /** @type {Parameters<typeof traverseHtml>[0]} */ (
      /** @type {unknown} */ (parse5.parseFragment(htmlCode))
    );
    /** @type {string[]} */
    const foundDivs = [];
    /** @type {string[]} */
    const foundSpans = [];
    /** @type {string[]} */
    const foundMyTags = [];

    traverseHtml(ast, {
      div(/** @type {HtmlAstPath} */ p5Path) {
        foundDivs.push(getId(p5Path));
      },
      span(/** @type {HtmlAstPath} */ p5Path) {
        foundSpans.push(getId(p5Path));
      },
      // eslint-disable-next-line object-shorthand
      'my-tag'(/** @type {HtmlAstPath} */ p5Path) {
        foundMyTags.push(getId(p5Path));
      },
    });

    expect(foundDivs).to.deep.equal(['a-lvl1', 'b']);
    expect(foundSpans).to.deep.equal(['a-lvl2']);
    expect(foundMyTags).to.deep.equal(['a-lvl3']);
  });

  it('traverses different levels in DOM order', async () => {
    const htmlCode = `
      <div id="a-lvl1">
        <span id="a-lvl2">
          <my-tag id="a-lvl3">
            <not-found></notfound>
          </my-tag>
        </span>
      </div>
      <div id="b"></div>
    `;

    const ast = /** @type {Parameters<typeof traverseHtml>[0]} */ (
      /** @type {unknown} */ (parse5.parseFragment(htmlCode))
    );
    /** @type {string[]} */
    const callOrder = [];
    const processObj = {
      span(/** @type {HtmlAstPath} */ p5Path) {
        callOrder.push(`span#${getId(p5Path)}`);
      },
      div(/** @type {HtmlAstPath} */ p5Path) {
        callOrder.push(`div#${getId(p5Path)}`);
      },
      // eslint-disable-next-line object-shorthand
      'my-tag'(/** @type {HtmlAstPath} */ p5Path) {
        callOrder.push(`my-tag#${getId(p5Path)}`);
      },
    };
    traverseHtml(ast, processObj);

    // call order based on dom tree
    expect(callOrder).to.deep.equal(['div#a-lvl1', 'span#a-lvl2', 'my-tag#a-lvl3', 'div#b']);
  });

  it('allows to stop traversal (for performance)', async () => {
    const htmlCode = `
      <div id="a-lvl1">
        <span id="a-lvl2">
          <my-tag id="a-lvl3">
            <not-found></notfound>
          </my-tag>
        </span>
      </div>
      <div id="b"></div>
    `;

    const ast = /** @type {Parameters<typeof traverseHtml>[0]} */ (
      /** @type {unknown} */ (parse5.parseFragment(htmlCode))
    );
    /** @type {string[]} */
    const callOrder = [];
    const processObj = {
      div(/** @type {HtmlAstPath} */ p5Path) {
        callOrder.push(`div#${getId(p5Path)}`);
        p5Path.stop();
      },
      span(/** @type {HtmlAstPath} */ p5Path) {
        callOrder.push(`span#${getId(p5Path)}`);
      },
      // eslint-disable-next-line object-shorthand
      'my-tag'(/** @type {HtmlAstPath} */ p5Path) {
        callOrder.push(`my-tag#${getId(p5Path)}`);
      },
    };
    traverseHtml(ast, processObj);

    expect(callOrder).to.deep.equal(['div#a-lvl1']);
  });

  it('allows to traverse within a path', async () => {
    const htmlCode = `
      <div id="a-lvl1">
        <span id="a-lvl2">
          <my-tag id="a-lvl3">
            <not-found id="a-lvl4"></notfound>
          </my-tag>
        </span>
      </div>
      <div id="b"></div>
    `;

    const ast = /** @type {Parameters<typeof traverseHtml>[0]} */ (
      /** @type {unknown} */ (parse5.parseFragment(htmlCode))
    );
    /** @type {string[]} */
    const callOrder = [];
    const processObj = {
      // eslint-disable-next-line object-shorthand
      'my-tag'(/** @type {HtmlAstPath} */ p5Path) {
        callOrder.push(`my-tag#${getId(p5Path)}`);
        p5Path.traverseHtml({
          // eslint-disable-next-line object-shorthand, no-shadow
          'not-found'(/** @type {HtmlAstPath} */ p5Path) {
            callOrder.push(`not-found#${getId(p5Path)}`);
          },
        });
      },
    };
    traverseHtml(ast, processObj);

    expect(callOrder).to.deep.equal(['my-tag#a-lvl3', 'not-found#a-lvl4']);
  });
});
