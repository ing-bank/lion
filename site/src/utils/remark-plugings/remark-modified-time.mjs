import { execSync } from 'child_process';

export function remarkModifiedTime() {
  return function (tree, file) {
    const filepath = file.history[0];
    if (!filepath.includes('/blog')) {
      return;
    }

    const result = execSync(
      `git log --follow --format=%ad --date default "${filepath}" | tail -1 `,
    );
    file.data.astro.frontmatter.createdAt = result.toString();
  };
}
