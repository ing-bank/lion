// Renders the docs-site equivalent of the lion-ui skill index: every generated reference, its kind
// and its path inside the skills package, so finding where something is documented does not depend on
// reading the skill's own SKILL.md. Generated like quality.md, so it cannot drift from the references.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const refRoot = path.join(repoRoot, 'packages/ui/skills/lion-ui/references');
const outFile = path.join(
  repoRoot,
  'docs/fundamentals/node-tools/skill-tester/skill-index.md',
);

const kinds = { components: 'Component', systems: 'System', guides: 'Guide' };

const rows = [];
let subclasserCount = 0;
for (const [dir, kind] of Object.entries(kinds)) {
  const dirPath = path.join(refRoot, dir);
  if (!fs.existsSync(dirPath)) continue;
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).sort();
  subclasserCount += files.filter(f => f.endsWith('.subclasser.md')).length;
  for (const file of files) {
    if (file.endsWith('.subclasser.md')) continue;
    const name = file.replace(/\.md$/, '');
    rows.push(`| ${kind} | \`${name}\` | \`references/${dir}/${file}\` |`);
  }
}

const content = `---
parts:
  - Node Tools
title: 'skill-tester: skill index'
eleventyNavigation:
  key: Node Tools >> skill-tester skill index
  parent: Node Tools >> skill-tester
  title: Skill index
  order: 30
---

# The lion-ui skill: what it contains

> Generated from \`packages/ui/skills/lion-ui/references\` by \`npm run skill:index\`. Do not edit by hand.

The \`lion-ui\` skill routes an agent from \`SKILL.md\` into the reference it needs. This page is the
human- and machine-readable equivalent of that index: every generated reference, its kind, and its path
inside the skills package, so finding \`where something is documented\` does not depend on reading the
skill's own index.

## Two paths

The skill distinguishes two flows (the form guide has the detail):

- **consumption** - app developers compose \`@lion/ui\` components directly through their documented
  entrypoints; this is what the regular references (and the skill-tester scenarios) measure;
- **subclassing** - extending a component for your own tag names, branding or styling. That surface
  (protected/private members and extension points) lives in the \`*.subclasser.md\` companions
  (${subclasserCount} of them), reachable only when a task is explicitly about subclassing.

## References

| Kind | Reference | Path in \`packages/ui/skills/lion-ui\` |
| --- | --- | --- |
${rows.join('\n')}

The entrypoints list (\`references/entrypoints.md\`) is the authoritative set of \`@lion/ui\`
specifiers; anything not in it does not exist and must not be guessed.
`;
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, `${content.replace(/\n{3,}/g, '\n\n').trimEnd()}\n`);
console.log(
  `Wrote ${outFile} (${rows.length} references, ${subclasserCount} subclasser companions)`,
);
