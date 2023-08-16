import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import * as parse5 from 'parse5';
import { pipeline } from '@xenova/transformers';
import { traverseHtml } from '../shared/traverse-html.js';

const generateEmbeddings = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

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

const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

// helper function
const isNextHeading = node => headingTags.includes(node.tagName);

/**
 * @param {Object} p5Path
 */
function getTextUnderHeading(p5Path) {
  const startIndex = p5Path.parent.node.childNodes.indexOf(p5Path.node);
  const childrenToLoopOver = p5Path.parent.node.childNodes.slice(startIndex);
  const textForEmbedding = [];

  function getTextFromNodeAndChildren(node) {
    if (node.nodeName === '#text') {
      if (node.value.trim()) {
        textForEmbedding.push(node.value);
      }
    } else if (node.childNodes?.length) {
      node.childNodes.forEach(getTextFromNodeAndChildren);
    }
  }

  for (const childNode of childrenToLoopOver) {
    const isStartHeading = p5Path.node === childNode;
    if (!isStartHeading && isNextHeading(childNode)) {
      break;
    }
    getTextFromNodeAndChildren(childNode);
  }
  return textForEmbedding.join('\n');
}

// Loops over all html files of given dir
async function generateEmbeddingsForPortal({ cwd = path.join(process.cwd(), 'dummy-docs') } = {}) {
  const files = await globby(['./**/*.html'], { cwd });

  const fileObjects = files.map(file => ({
    content: fs.readFileSync(path.join(cwd, file), 'utf8'),
    filePath: file,
  }));

  const resultJson = { meta: {}, results: [] };

  const promisesToWaitFor = [];
  for (const { content, filePath } of fileObjects) {
    const ast = parse5.parseFragment(content);
    traverseHtml(ast, {
      // Results in selector 'h1|h2|h3|h4|h5|h6'
      async [headingTags.join('|')](p5Path) {
        // the next h1
        const text = getTextUnderHeading(p5Path);
        // get next sibling html elements until we find another h1
        const id = p5Path.node.attrs.find(attr => attr.name === 'id')?.value;
        const url = id ? filePath + '#' + id : filePath;
        const embeddingPromise = generateEmbeddings(text, {
          pooling: 'mean',
          normalize: true,
        });
        promisesToWaitFor.push(embeddingPromise);
        const embedding = Array.from((await embeddingPromise).data);
        resultJson.results.push({ url, text, embedding });
      },
    });
  }
  await Promise.all(promisesToWaitFor);
  fs.promises.writeFile('test.json', JSON.stringify(resultJson, null, 2));
}

generateEmbeddingsForPortal();
