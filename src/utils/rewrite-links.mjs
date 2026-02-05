import fs from 'node:fs/promises';
import { glob } from 'tinyglobby';

// Get all HTML files from the output directory
const files = await glob(`./dist/**/*.html`);

let DEBUG = false;
await Promise.all(
  files.map(async file => {
    if (file.includes('next/index.html')) {
      console.log('Processing file:', file);
      DEBUG = true;
    }

    let html = await fs.readFile(file, 'utf-8');
    const updatedHtml = html.replace(/href="(\/(?!next)[^"]*)"/g, (match, p1) => {
      if (DEBUG) {
        console.log('***', match, p1);
      }

      return `href="/next${p1}"`;
    });
    await fs.writeFile(file, updatedHtml);
  }),
);
