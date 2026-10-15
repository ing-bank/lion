import fs from 'node:fs/promises';
import { globby } from 'globby';

// Prefix relative hrefs with the portal base, so a build that is nested in a folder
// ('/next-preview/<branch>' for a branch preview, see scripts/deploy-portal-preview.mjs) keeps
// working. Must run with the same ASTRO_BASE_URL the astro build ran with.
//
// The portal owns the site root in production (base '/'), which makes this a no-op there: astro
// prefixes the urls it generates itself, and only markdown content carries absolute links that
// need this second pass. The legacy rocket site under /prev is published as a frozen archive and
// is not built any more.
const base = (process.env.ASTRO_BASE_URL || '/').replace(/\/$/, '');

// Get all HTML files from the astro output directory ('_site/prev' would be a leftover of an old
// full build, when the rocket site still lived there)
const files = base
  ? await globby(['_site/**/*.html', '_site/*.html'], { ignore: ['_site/prev/**'] })
  : [];

let DEBUG = false;

await Promise.all(
  files.map(async file => {
    if (file === '_site/index.html') {
      DEBUG = true;
    }

    const html = await fs.readFile(file, 'utf-8');
    const updatedHtml = html.replace(/href="(\/[^"]*)"/g, (match, p1) => {
      // Leave urls that already live under the build base alone, and never touch links that
      // point at the production site: a preview sits next to it, not instead of it.
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

console.log(`✓ Processed ${files.length} html file(s) for base '${base}'`);
