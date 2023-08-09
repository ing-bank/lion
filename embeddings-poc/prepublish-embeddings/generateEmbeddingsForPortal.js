import fs from 'fs';
import path from "path";
import { globby } from "globby";
import * as parse5 from 'parse5';
import { traverseHtml } from "../shared/traverse-html.js";

/**
    1. Loop over all html/md files
    2. Parse them in AST (with globby to fetch files, node to read…) https://astexplorer.net/ 
    3. Get contents of headings/paragraphs
    4. Create embedding 
    5. Store as
      {  
        url: <htmlUrl>#<headingName>,
        Embedding: Array
      }
 */

// helper function
const isNextHeading = node => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(node.tagName);

/**
 * @param {Object} p5Path
 */

function getTextUnderHeading(p5Path) {
  const startIndex = p5Path.parent.node.childNodes.indexOf(p5Path.node) + 1;
  const childrenToLoopOver = p5Path.parent.node.childNodes.slice(startIndex);

  console.log(childrenToLoopOver.map(n => n.nodeName));

  let textForEmbedding = '';

  function getTextFromNodeAndChildren(node) {
    if (node.nodeName === '#text') {
      console.log("node.value ---> ", node.value);
      console.log("node.value ---> ", node.value);
      textForEmbedding += node.value;
    } else if(node.childNodes?.length) {
      node.childNodes.forEach(getTextFromNodeAndChildren);
    }
  }

  for (const childNode of childrenToLoopOver) {
    if(isNextHeading(childNode)) {
      break;
    }
    getTextFromNodeAndChildren(childNode);
  }
  return textForEmbedding;
}

// Loops over all html files of given dir
async function generateEmbeddingsForPortal({ cwd = path.join(process.cwd(), 'dummy-docs') } = {}) {
  const files = await globby(["./**/*.html"], { cwd });

  const fileObjects = files.map((file) => ({
    content: fs.readFileSync(path.join(cwd, file), "utf8"),
    filePath: file,
  }));
  
  for (const { content, filePath } of fileObjects) {
    const ast = parse5.parseFragment(content);

    traverseHtml(ast, {
      h1(p5Path) {
        // the next h1
        const res = getTextUnderHeading(p5Path);
        console.log(">>>>>>>>>", res);
        // get next sibling html elements until we find another h1
      },
    });
  }

  console.log(files);
}



generateEmbeddingsForPortal();
