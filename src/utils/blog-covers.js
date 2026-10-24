/*
 * Blog cover illustrations are inlined, never loaded through <img> or a CSS background.
 *
 * The artwork (public/blog/images/<slug>.svg) carries no colour of its own: every shape is a
 * `.illo-*` class and the palette comes from the custom properties that `.lion-illo` declares in
 * public/styles/blog.css. An SVG pulled in as an image is a separate document, so neither the
 * page's CSS nor the theme reaches it and the cover would freeze at whatever hex the file contains.
 * Raw-importing the same file and rendering it inline keeps it a normal part of the DOM.
 *
 * The files stay in public/ so their URLs keep working wherever a plain path is needed (the
 * `cover_image` frontmatter, link unfurls); this module is only the inline path.
 */
const coverSources = import.meta.glob('../../public/blog/images/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * @param {string} [coverPath] value of a post's `cover_image` frontmatter
 * @returns {string|null} the SVG source to render inline, or null when there is nothing to inline
 */
export function inlineCover(coverPath) {
  if (!coverPath || !coverPath.endsWith('.svg')) {
    return null;
  }
  const file = coverPath.split('/').pop();
  const key = Object.keys(coverSources).find(path => path.endsWith(`/${file}`));
  return key ? coverSources[key] : null;
}
