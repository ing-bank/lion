import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.5.2';
import { getDotProduct } from './shared/getDotProduct.js';

const input1 = document.getElementById('input1');
const generateButton = document.getElementById('generate-button');
const output = document.getElementById('output');
const generateEmbeddings = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const siteData = await (await fetch('test.json')).json();

generateButton.disabled = false;

generateButton.addEventListener('click', async () => {
  output.innerText = '';
  generateButton.disabled = true;

  const output1 = await generateEmbeddings(input1.value, {
    pooling: 'mean',
    normalize: true,
  });

  const outputs = [];

  for (const result of siteData.results.slice(0, 500)) {
    const similarity = getDotProduct(output1.data, result.embedding);
    outputs.push({ url: result.url, similarity, text: result.text });
  }

  const top10 = outputs.sort((a, b) => b.similarity - a.similarity).slice(0, 10);

  output.innerText = JSON.stringify(top10, null, 2);
  generateButton.disabled = false;
});
