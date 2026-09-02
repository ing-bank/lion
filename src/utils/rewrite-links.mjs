import fs from 'node:fs/promises';
import { globby } from 'globby';

// Get all HTML files from the Rocket output directory (_site/prev)
// Include both files in the root and in subdirectories
const files = await globby(['_site/prev/**/*.html', '_site/prev/*.html']);

let DEBUG = false;
await Promise.all(
  files.map(async file => {
    if (file.includes('_site/prev/index.html')) {
      console.log('Processing file:', file);
      DEBUG = true;
    }

    let html = await fs.readFile(file, 'utf-8');

    // Add /prev/ prefix to all href links that don't already have it
    // Match href="/..." but not href="/prev/..."
    html = html.replace(/href="(\/(?!prev)[^"]*)"/g, (match, p1) => {
      // Add /prev prefix
      let newPath = `/prev${p1}`;

      // Ensure directory paths have trailing slash (paths without file extension)
      // Don't add slash if it's a file with extension or already has a slash or is an anchor
      if (!newPath.includes('.') && !newPath.endsWith('/') && !newPath.includes('#') && !newPath.includes('?')) {
        newPath += '/';
      }

      if (DEBUG) {
        console.log('Rewriting href:', match, '->', `href="${newPath}"`);
      }
      return `href="${newPath}"`;
    });

    // Add /prev/ prefix to all src attributes that don't already have it
    // Match src="/..." but not src="/prev/..." or src="http..."
    html = html.replace(/src="(\/(?!prev)[^"]*)"/g, (match, p1) => {
      if (DEBUG) {
        console.log('Rewriting src:', match, '->', `src="/prev${p1}"`);
      }
      return `src="/prev${p1}"`;
    });

    await fs.writeFile(file, html);
  }),
);

console.log(`✓ Processed ${files.length} HTML files in _site/prev/`);

