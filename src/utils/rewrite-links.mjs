import fs from 'node:fs/promises';
import { globby } from 'globby';

// Prefix relative hrefs with the portal base, so a build that is nested in a folder
// ('/next' in production, '/next-preview/<branch>' for a branch preview) keeps working.
// Must run with the same ASTRO_BASE_URL the astro build ran with.
const base = process.env.ASTRO_BASE_URL || '/next';

// Get all HTML files from the output directory
const files = await globby(`./dist/**/*.html`);

let DEBUG = false;
await Promise.all(
  files.map(async file => {
    if (file.includes('next/index.html')) {
      console.log('Processing file:', file);
      DEBUG = true;
    }

    let html = await fs.readFile(file, 'utf-8');
    const updatedHtml = html.replace(/href="(\/[^"]*)"/g, (match, p1) => {
      // Leave urls that already live under the build base alone, and never touch links that
      // point at the production portal: a preview sits next to it, not instead of it.
      if (p1 === base || p1.startsWith(`${base}/`) || p1.startsWith('/next')) {
        return match;
      }

      if (DEBUG) {
        console.log('***', match, p1);
      }

      return `href="${base}${p1}"`;
    });
    await fs.writeFile(file, updatedHtml);
  }),
);
