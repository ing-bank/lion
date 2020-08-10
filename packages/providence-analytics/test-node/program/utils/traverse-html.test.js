const { expect } = require('chai');
const parse5 = require('parse5');
const traverseHtml = require('../../../src/program/utils/traverse-html.js');

function getId(p5Path) {
  return p5Path.node.attrs.find(a => a.name === 'id').value;
}

describe('traverseHtml', () => {
  it(`finds different tag names`, async () => {
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

    const ast = parse5.parseFragment(htmlCode);
    const foundDivs = [];
    const foundSpans = [];
    const foundMyTags = [];

    traverseHtml(ast, {
      div(p5Path) {
        foundDivs.push(getId(p5Path));
      },
      span(p5Path) {
        foundSpans.push(getId(p5Path));
      },
      // eslint-disable-next-line object-shorthand
      'my-tag'(p5Path) {
        foundMyTags.push(getId(p5Path));
      },
    });

    expect(foundDivs).to.eql(['a-lvl1', 'b']);
    expect(foundSpans).to.eql(['a-lvl2']);
    expect(foundMyTags).to.eql(['a-lvl3']);
  });

  it(`traverses different levels in DOM order`, async () => {
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

    const ast = parse5.parseFragment(htmlCode);
    const callOrder = [];
    const processObj = {
      span(p5Path) {
        callOrder.push(`span#${getId(p5Path)}`);
      },
      div(p5Path) {
        callOrder.push(`div#${getId(p5Path)}`);
      },
      // eslint-disable-next-line object-shorthand
      'my-tag'(p5Path) {
        callOrder.push(`my-tag#${getId(p5Path)}`);
      },
    };
    traverseHtml(ast, processObj);

    // call order based on dom tree
    expect(callOrder).to.eql(['div#a-lvl1', 'span#a-lvl2', 'my-tag#a-lvl3', 'div#b']);
  });

  it(`allows to stop traversal (for performance)`, async () => {
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

    const ast = parse5.parseFragment(htmlCode);
    const callOrder = [];
    const processObj = {
      div(p5Path) {
        callOrder.push(`div#${getId(p5Path)}`);
        p5Path.stop();
      },
      span(p5Path) {
        callOrder.push(`span#${getId(p5Path)}`);
      },
      // eslint-disable-next-line object-shorthand
      'my-tag'(p5Path) {
        callOrder.push(`my-tag#${getId(p5Path)}`);
      },
    };
    traverseHtml(ast, processObj);

    expect(callOrder).to.eql(['div#a-lvl1']);
  });

  it(`allows to traverse within a path`, async () => {
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

    const ast = parse5.parseFragment(htmlCode);
    const callOrder = [];
    const processObj = {
      // eslint-disable-next-line object-shorthand
      'my-tag'(p5Path) {
        callOrder.push(`my-tag#${getId(p5Path)}`);
        p5Path.traverseHtml({
          // eslint-disable-next-line object-shorthand, no-shadow
          'not-found'(p5Path) {
            callOrder.push(`not-found#${getId(p5Path)}`);
          },
        });
      },
    };
    traverseHtml(ast, processObj);

    expect(callOrder).to.eql(['my-tag#a-lvl3', 'not-found#a-lvl4']);
  });
});
