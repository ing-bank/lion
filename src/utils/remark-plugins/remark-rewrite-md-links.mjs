import { visit } from 'unist-util-visit';
import path from 'path';

export function remarkRewriteMdLinks({ hasTrailingSlash = false } = {}) {
  return function (tree, file) {
    const currentDir = path.dirname(file.path);
    if (currentDir.includes('guides')) {
      console.debug({ currentDir });
    }

    visit(tree, 'link', node => {
      if (node.url && node.url.endsWith('.md')) {
        // Resolve relative to current file, then rewrite
        const resolvedUrl = path.resolve(currentDir, node.url);
        const relativePath = path.relative(currentDir, resolvedUrl);
        node.url = relativePath.replace(/\.md$/, hasTrailingSlash ? '/' : '');
      }
    });
  };
}
