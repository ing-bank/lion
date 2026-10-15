import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

function matches(pattern, file) {
  const expression = pattern
    .split('*')
    .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${expression}$`).test(file);
}

export async function expandClosureInputs(flags, cwd, readDirectory = fs.readdir) {
  const normalized = flags.map(flag => flag.replaceAll('\\', '/'));
  const exclusions = normalized
    .filter(flag => flag.startsWith('--js=!'))
    .map(flag => flag.slice('--js=!'.length));
  const expanded = [];
  for (const flag of normalized.filter(value => !value.startsWith('--js=!'))) {
    if (!flag.startsWith('--js=') || !flag.includes('*')) {
      expanded.push(flag);
    } else {
      const pattern = flag.slice('--js='.length);
      const directory = path.posix.dirname(pattern);
      // The pinned fork uses basename wildcards only, never recursive directory globs.
      assert(!directory.includes('*'), `Unsupported Closure directory glob: ${pattern}`);
      const files = (await readDirectory(path.resolve(cwd, directory)))
        .sort()
        .map(file => `${directory}/${file}`)
        .filter(
          file => matches(pattern, file) && !exclusions.some(exclude => matches(exclude, file)),
        );
      assert(files.length > 0, `No Closure inputs matched: ${pattern}`);
      expanded.push(...files.map(file => `--js=${file}`));
    }
  }
  return expanded;
}
