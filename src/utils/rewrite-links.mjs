import fs from 'node:fs/promises';
import { globby } from 'globby';

// Astro owns the site root (base '/') and the legacy rocket site lives under '/prev'. A branch
// preview publishes the same astro output under '/next-preview/<branch>' instead (see
// scripts/deploy-portal-preview.mjs), which is the ordinary build with a different
// ASTRO_BASE_URL - so this script has to serve both prefixes:
//
//   astro output (the site root, minus '/prev') -> prefix root-relative hrefs with the build base
//   rocket output (_site/prev)                  -> prefix root-relative href/src with '/prev'
//
// The astro pass only targets links astro did not author itself (markdown content carries absolute
// links), and it is a no-op when the portal owns the root, which is the production build.
const base = (process.env.ASTRO_BASE_URL || '/').replace(/\/$/, '');

// Get all HTML files from the astro output directory
const astroFiles = base
  ? await globby(['_site/**/*.html', '_site/*.html'], { ignore: ['_site/prev/**'] })
  : [];
// ... and from the Rocket output directory (_site/prev)
const rocketFiles = await globby(['_site/prev/**/*.html', '_site/prev/*.html']);

let DEBUG = false;

await Promise.all(
  astroFiles.map(async file => {
    const html = await fs.readFile(file, 'utf-8');
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

await Promise.all(
  rocketFiles.map(async file => {
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

console.log(
  `✓ Processed ${astroFiles.length} astro html file(s) and ${rocketFiles.length} rocket html file(s)`,
);
