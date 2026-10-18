import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { COMPONENT_SYNONYMS } from '../../../../scripts/lib/component-synonyms.mjs';
import {
  computeApiTablesByDocGroup,
  findClassDeclaration,
  listComponentClasses,
  listUiComponentDirs,
  resolveDocGroup,
} from '../../../../scripts/lib/api-tables.mjs';

/**
 * Generates the `lion-ui` agent skill (`packages/ui/skills/lion-ui`) from lion's own
 * documentation sources:
 *
 * - `docs/components/<name>/*.md`  -> `references/components/<name>.md`
 * - `docs/fundamentals/systems/<name>/*.md` -> `references/systems/<name>.md`
 * - `docs/guides/how-to/*.md` -> `references/guides/<name>.md` (one file per guide)
 * - `packages/ui/custom-elements.json` -> inlined "API Reference" section in each file above
 *
 * The generated reference files are committed (they are the skill's source of truth), so this
 * script does not depend on any gitignored build output (`docs/**\/api-table.md`) and recomputes
 * the API tables itself via the shared `scripts/lib/api-tables.mjs`.
 *
 * `SKILL.md` itself is hand-written; only the component/system index between the
 * `<!-- lion-ui:*:start/end -->` marker comments is rewritten here.
 *
 * Usage: `npm run skills:generate` (delegates to this script via `packages/ui/package.json`).
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../../../');

const docsRoot = path.join(repoRoot, 'docs');
const uiComponentsDir = path.join(repoRoot, 'packages/ui/components');
const customElementsJsonPath = path.join(repoRoot, 'packages/ui/custom-elements.json');
const skillDir = path.join(repoRoot, 'packages/ui/skills/lion-ui');
const referencesDir = path.join(skillDir, 'references');
const skillMdPath = path.join(skillDir, 'SKILL.md');

/** `docs/fundamentals/systems` folders that document cross-cutting `@lion/ui` APIs. */
const SYSTEM_DOC_DIRS = ['core', 'form', 'icon', 'localize', 'overlays'];

/**
 * `docs/guides/how-to` holds task-oriented pages, one standalone file per guide (unlike the
 * component/system docs, which are directories of pages merged into one reference).
 */
const guidesDocsDir = path.join(docsRoot, 'guides/how-to');

/**
 * @param {string} text kebab-case directory name, e.g. `input-amount`
 * @returns {string} Title Case, e.g. `Input Amount`
 */
function toTitleCase(text) {
  return text.replace(
    /(^|-)(\w)/g,
    (_m, sep, letter) => `${sep === '-' ? ' ' : ''}${letter.toUpperCase()}`,
  );
}

/**
 * Shifts the level of every ATX heading (`#`...`######`) in Markdown down by `levels`, skipping
 * headings that appear inside fenced code blocks. Used so merged/inlined content (which has its
 * own `# Title` headings) nests correctly under this file's single top-level `# <Component>`
 * heading — required by this repo's `single-h1`/`MD025` markdownlint rule.
 * @param {string} markdown
 * @param {number} levels
 * @returns {string}
 */
function shiftHeadings(markdown, levels) {
  let inFence = false;
  return markdown
    .split('\n')
    .map(line => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (!inFence && /^#{1,6}(\s|$)/.test(line)) {
        return '#'.repeat(levels) + line;
      }
      return line;
    })
    .join('\n');
}

/**
 * Reads every doc page in a `docs/components/<name>` or `docs/fundamentals/systems/<name>`
 * directory (skipping `index.md`, which is just an Eleventy nav redirect, and the
 * build-generated `api-table.md`, which is recomputed from the CEM instead), and concatenates
 * their bodies in the order defined by each page's `eleventyNavigation.order` frontmatter.
 * @param {string} dirPath
 * @returns {string}
 */
function mergeDocPages(dirPath) {
  const files = fs
    .readdirSync(dirPath)
    .filter(f => f.endsWith('.md') && f !== 'index.md' && f !== 'api-table.md');

  const pages = files.map(file => {
    const raw = fs.readFileSync(path.join(dirPath, file), 'utf8');
    const parsed = matter(raw);
    const order = parsed.data?.eleventyNavigation?.order ?? 999;
    return { order, content: parsed.content.trim() };
  });

  pages.sort((a, b) => a.order - b.order);

  // Each page's own `# Title` heading is shifted to `## Title` so it nests under this file's
  // single `# <Component>` heading instead of introducing additional top-level headings.
  return pages.map(p => shiftHeadings(p.content, 1)).join('\n\n---\n\n');
}

/**
 * @param {object} options
 * @param {'components' | 'systems'} options.kind
 * @param {string} options.name
 * @param {string} options.sourceDirPath absolute path to the `docs/...` source directory
 * @param {string | undefined} options.apiTableMd
 * @returns {string} the relative reference file path, e.g. `references/components/button.md`
 */
function writeReferenceFile({ kind, name, sourceDirPath, apiTableMd }) {
  const outDir = path.join(referencesDir, kind);
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${name}.md`);

  const relativeSource = path.relative(repoRoot, sourceDirPath);
  const body = mergeDocPages(sourceDirPath);
  const apiSection = apiTableMd ? `\n\n## API Reference\n\n${shiftHeadings(apiTableMd, 1)}\n` : '';

  const fileContent = [
    `# ${toTitleCase(name)}`,
    '',
    `> Generated by \`npm run skills:generate\` from \`${relativeSource}\` and \`packages/ui/custom-elements.json\`. Do not edit by hand — edit the source docs instead.`,
    '',
    body,
    apiSection,
  ].join('\n');

  // Merging independent doc pages/API tables (each already ending in their own trailing
  // whitespace) can introduce 3+ consecutive newlines; collapse to a single blank line so the
  // output satisfies this repo's `MD012/no-multiple-blanks` markdownlint rule.
  const normalizedContent = `${fileContent.replace(/\n{3,}/g, '\n\n').trimEnd()}\n`;

  fs.writeFileSync(outPath, normalizedContent);
  return path.relative(skillDir, outPath);
}

/**
 * Writes one reference file from a *single* doc page. Used for `docs/guides/how-to`, where each
 * file is a standalone page rather than a directory of pages to merge.
 * @param {object} options
 * @param {string} options.name
 * @param {string} options.sourceFilePath absolute path to the source `.md`
 * @returns {string} the relative reference file path, e.g. `references/guides/create-a-form.md`
 */
function writeSinglePageReferenceFile({ name, sourceFilePath }) {
  const outDir = path.join(referencesDir, 'guides');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${name}.md`);

  const relativeSource = path.relative(repoRoot, sourceFilePath);
  const parsed = matter(fs.readFileSync(sourceFilePath, 'utf8'));
  // The page's own `# Title` becomes `## Title` so the file keeps a single top-level heading.
  const body = shiftHeadings(parsed.content.trim(), 1);

  const fileContent = [
    `# ${toTitleCase(name)}`,
    '',
    `> Generated by \`npm run skills:generate\` from \`${relativeSource}\`. Do not edit by hand — edit the source doc instead.`,
    '',
    body,
    '',
  ].join('\n');

  fs.writeFileSync(outPath, `${fileContent.replace(/\n{3,}/g, '\n\n').trimEnd()}\n`);
  return path.relative(skillDir, outPath);
}

/**
 * Rewrites the auto-generated index section of `SKILL.md` between a pair of marker comments,
 * leaving the hand-written rest of the file untouched.
 * @param {string} markerName e.g. `components` or `systems`
 * @param {{ name: string, refPath: string }[]} entries
 */
function updateSkillMdIndex(markerName, entries) {
  const startMarker = `<!-- lion-ui:${markerName}:start -->`;
  const endMarker = `<!-- lion-ui:${markerName}:end -->`;

  const skillMd = fs.readFileSync(skillMdPath, 'utf8');
  const startIndex = skillMd.indexOf(startMarker);
  const endIndex = skillMd.indexOf(endMarker);

  if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
    throw new Error(
      `SKILL.md is missing the "${startMarker}" / "${endMarker}" marker comments. ` +
        'These must exist (even if empty between them) for generation to update the index.',
    );
  }

  const listMd = entries
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(
      e =>
        `- [\`${toTitleCase(e.name)}\`](${e.refPath})` +
          (e.synonyms?.length ? ` — ${e.synonyms.join(', ')}` : ''),
    )
    .join('\n');

  const before = skillMd.slice(0, startIndex + startMarker.length);
  const after = skillMd.slice(endIndex);
  fs.writeFileSync(skillMdPath, `${before}\n\n${listMd}\n\n${after}`);
}

/**
 * Writes `references/entrypoints.md`: every `@lion/ui` specifier that actually exists.
 *
 * Measured motivation: the most common failure in a full sweep was guessing an entrypoint from an
 * element or a concept name — `@lion/ui/checkbox.js`, `@lion/ui/option.js`, `@lion/ui/validate.js` —
 * none of which exists. Seven runs were zeroed by the import gate and five of six browser failures
 * were the same mistake, because a module that cannot resolve cannot load. A rule in the docs
 * discourages the guess (measured: it removed it in a re-run); this list removes the need for it.
 */
function writeEntrypointReference() {
  const exportsDir = path.join(path.resolve(skillDir, '../..'), 'exports');
  const specifiers = [];
  const walk = (dir, prefix = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), `${prefix}${entry.name}/`);
        continue;
      }
      specifiers.push(`@lion/ui/${prefix}${entry.name}`);
    }
  };
  if (fs.existsSync(exportsDir)) walk(exportsDir);
  specifiers.sort();

  const define = specifiers.filter(specifier => specifier.startsWith('@lion/ui/define/'));
  const classes = specifiers.filter(specifier => !specifier.startsWith('@lion/ui/define/'));

  fs.mkdirSync(referencesDir, { recursive: true });
  fs.writeFileSync(
    path.join(referencesDir, 'entrypoints.md'),
    [
      '# Entrypoints',
      '',
      '> Generated from `packages/ui/exports` by `npm run skills:generate`. Do not edit by hand.',
      '',
      `These ${specifiers.length} specifiers are the ones that exist. A specifier reasoned from an`,
      'element or a concept name will not be among them — `<lion-checkbox>` comes from `checkbox-group`,',
      'not from `checkbox` — and importing one that does not exist fails at load.',
      '',
      '## Importing a class',
      '',
      ...classes.map(specifier => `- \`${specifier}\``),
      '',
      '## Do not use these: global `define` entrypoints',
      '',
      'Listed because they exist on disk, not because the skill uses them. Registering a tag globally opts',
      "out of the host's scoped registry; register the class in `static scopedElements` instead.",
      '',
      ...define.map(specifier => `- \`${specifier}\``),
      '',
    ].join('\n'),
  );
  return specifiers.length;
}

/**
 * Points every form control's reference doc at the form guidance.
 *
 * A form and its controls have to share one DOM, and which component may keep a shadow root depends on
 * its role in that form — so the page a model reads before using a control has to carry the pointer.
 * The set of controls is derived from the repository's own form documentation rather than hand-listed:
 * "which components are form controls" is exactly the kind of list that rots.
 */
function linkFormControlsToFormGuide() {
  const formDocsDir = path.join(docsRoot, 'fundamentals/systems/form');
  if (!fs.existsSync(formDocsDir)) return 0;

  const mentioned = new Set();
  for (const file of fs.readdirSync(formDocsDir)) {
    if (!file.endsWith('.md')) continue;
    const text = fs.readFileSync(path.join(formDocsDir, file), 'utf-8');
    for (const match of text.matchAll(/lion-([a-z][a-z-]*)/g)) mentioned.add(match[1]);
  }

  const pointer =
    '> **Building a form?** Read [Create a form](../guides/create-a-form.md) first — the form and its\n' +
    '> controls have to share one (light) DOM, and which component may keep a shadow root follows from\n' +
    '> its role in that form.\n\n';

  let linked = 0;
  for (const name of mentioned) {
    const reference = path.join(referencesDir, 'components', `${name}.md`);
    if (!fs.existsSync(reference)) continue;
    const content = fs.readFileSync(reference, 'utf-8');
    if (content.includes('Create a form')) continue;
    fs.writeFileSync(reference, pointer + content);
    linked++;
  }
  return linked;
}


/**
 * Writes a per-component subclasser companion: the protected and private members (the subclasser
 * surface) the public-only slim took out of the consumption reference.
 *
 * The grill decision: an app developer composing the component gets the PUBLIC flow only, and the
 * protected/private members plus the extension points belong to the explicit subclasser flow. They are
 * therefore written to `<name>.subclasser.md`, reachable only when the task is EXPLICITLY about
 * subclassing, and deliberately not linked from the regular index. Self-built from the custom elements
 * manifest rather than the api-table renderer, because that renderer hides private members entirely.
 */
function writeSubclasserCompanions(uiComponentsDir, customElementsJson) {
  const byComponent = new Map();
  // The same mapping the api tables use: doc group -> component classes, so the remaps (e.g.
  // validate-messages -> form) and systems stay consistent between the reference and its companion.
  for (const componentDir of listUiComponentDirs(uiComponentsDir)) {
    const { dir, isSystem } = resolveDocGroup(componentDir);
    for (const className of listComponentClasses(uiComponentsDir, componentDir, isSystem)) {
      const declaration = findClassDeclaration(customElementsJson, className);
      if (!declaration) continue;
      const nonPublic = (declaration.members ?? []).filter(
        member => member.privacy && member.privacy !== 'public',
      );
      if (nonPublic.length === 0) continue;
      const list = byComponent.get(dir) ?? [];
      for (const member of nonPublic) list.push({ className, member });
      byComponent.set(dir, list);
    }
  }

  const outDir = path.join(referencesDir, 'components');
  fs.mkdirSync(outDir, { recursive: true });
  for (const [component, list] of byComponent) {
    const rows = list
      .map(({ className, member }) => {
        const type = member.type?.text ?? '';
        const description = (member.description ?? '').replace(/[|\n]/g, ' ').trim();
        return `| \`${className}\` | \`${member.name}\` | ${type} | ${description} |`;
      })
      .join('\n');
    const content = [
      `# ${toTitleCase(component)} — subclasser API`,
      '',
      '> Generated by `npm run skills:generate` from `packages/ui/custom-elements.json`. Do not edit by hand.',
      '',
      '> **Reach this file only when the task is EXPLICITLY about subclassing** — adding your own tag',
      '> name, branding/styling, or overriding a protected hook. The protected and private members below',
      '> (plus the extension points) are the subclasser surface: an app developer composing the component',
      '> in the regular consumption flow never needs them, which is why they are absent from the',
      '> consumption reference and why this companion is not linked from it.',
      '',
      '## Protected and private members',
      '',
      '| Class | Member | Type | Description |',
      '| --- | --- | --- | --- |',
      rows,
      '',
    ].join('\n');
    fs.writeFileSync(
      path.join(outDir, `${component}.subclasser.md`),
      `${content.replace(/\n{3,}/g, '\n\n').trimEnd()}\n`,
    );
  }
  return byComponent.size;
}

function main() {
  if (!fs.existsSync(customElementsJsonPath)) {
    throw new Error(
      `Missing ${path.relative(repoRoot, customElementsJsonPath)}. Run ` +
        '"npm run custom-elements-manifest" first (this also runs automatically on install).',
    );
  }
  if (!fs.existsSync(skillMdPath)) {
    throw new Error(
      `Missing ${path.relative(repoRoot, skillMdPath)}. SKILL.md is hand-written and must exist ` +
        'before generation can update its component/system index.',
    );
  }

  const customElementsJson = JSON.parse(fs.readFileSync(customElementsJsonPath, 'utf8'));
  const tablesByGroup = computeApiTablesByDocGroup({ uiComponentsDir, customElementsJson });

  // Clear previously generated reference files so removed components/systems don't linger.
  fs.rmSync(referencesDir, { recursive: true, force: true });

  const componentEntries = [];
  const componentsDocsDir = path.join(docsRoot, 'components');
  for (const name of fs.readdirSync(componentsDocsDir)) {
    const sourceDirPath = path.join(componentsDocsDir, name);
    if (!fs.statSync(sourceDirPath).isDirectory()) continue;

    const refPath = writeReferenceFile({
      kind: 'components',
      name,
      sourceDirPath,
      apiTableMd: tablesByGroup.get(`components/${name}`),
    });
    componentEntries.push({ name, refPath, synonyms: COMPONENT_SYNONYMS[name]?.synonyms });
  }

  const systemEntries = [];
  const systemsDocsDir = path.join(docsRoot, 'fundamentals/systems');
  for (const name of SYSTEM_DOC_DIRS) {
    const sourceDirPath = path.join(systemsDocsDir, name);
    if (!fs.existsSync(sourceDirPath)) {
      console.warn(
        `Skipping system "${name}": ${path.relative(repoRoot, sourceDirPath)} not found.`,
      );
      continue;
    }

    const refPath = writeReferenceFile({
      kind: 'systems',
      name,
      sourceDirPath,
      apiTableMd: tablesByGroup.get(`fundamentals/systems/${name}`),
    });
    systemEntries.push({ name, refPath });
  }

  const guideEntries = [];
  if (fs.existsSync(guidesDocsDir)) {
    for (const file of fs
      .readdirSync(guidesDocsDir)
      .filter(f => f.endsWith('.md') && f !== 'index.md')
      .sort()) {
      const name = file.replace(/\.md$/, '');
      const refPath = writeSinglePageReferenceFile({
        name,
        sourceFilePath: path.join(guidesDocsDir, file),
      });
      guideEntries.push({ name, refPath });
    }
  }

  updateSkillMdIndex('components', componentEntries);
  updateSkillMdIndex('systems', systemEntries);
  updateSkillMdIndex('guides', guideEntries);
  writeEntrypointReference();
  const formControlsLinked = linkFormControlsToFormGuide();
  const subclasserCompanions = writeSubclasserCompanions(uiComponentsDir, customElementsJson);

  console.log(
    `Generated ${componentEntries.length} component reference(s) (${formControlsLinked} form control(s) linked to the form guide), ${systemEntries.length} ` +
      `system reference(s), ${guideEntries.length} guide reference(s) and ${subclasserCompanions} subclasser companion(s) under ` +
      `${path.relative(repoRoot, referencesDir)}.`,
  );
}

main();
