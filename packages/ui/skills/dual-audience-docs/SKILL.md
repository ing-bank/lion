---
name: dual-audience-docs
description: Write and structure lion documentation so one source page serves both the human reader of the docs portal and the agent that gets a skill generated from it. Use when creating or editing a page under docs/components/<name>/ or docs/fundamentals/systems/<name>/, when changing a page's eleventyNavigation order, headings or demo blocks, or when checking whether a generated reference under packages/ui/skills/lion-ui/references/ will work for an agent.
compatibility: Applies to lion's docs/ tree and packages/ui/scripts/skills-generation/generate-skills.mjs. Plain Markdown; needs no tools beyond the repo's npm scripts.
---

# Dual-audience docs

One source page feeds two readers. A human reads the docs portal, in navigation order, with the demos
running. An agent reads a generated reference file, top to bottom, with the demo noise stripped, and it
only ever sees this skill's `description` before it opens anything. A page that is good for one reader
should not be bad for the other, so write the source for both and let the generator do the adapting.

Test each page with one question per reader:

- **Human:** can a developer who landed here from search find the answer, understand why, and copy a
  working example?
- **Agent:** can a competent agent act without asking back? That is: can it name the import, the
  property and its exact values, and the event to listen for, for each task, without searching the
  source?

Complete-but-verbose belongs in the docs. The skill's job is to make the concrete part findable and
correct; the portal can carry the rest. The rule behind this is from Anthropic's skill guidance:
"Only add context Claude doesn't already have." (See [references/sources.md](references/sources.md).)

## What the generator does to your page

These facts are from `generate-skills.mjs` and are what your page becomes:

1. **Pages are merged in `order`.** `mergeDocPages` reads each page's `eleventyNavigation.order`
   (default `999`) and sorts by it. It skips `index.md`, `api-table.md`, `extensions.md` and
   `migration.md`. Guides under `docs/guides/how-to/` are not merged; each becomes its own file.
2. **Headings shift down.** Your page's `# Title` becomes `##`, and its `##` sections become `###`
   under `## Use Cases` (see `packages/ui/skills/lion-ui/references/components/combobox.md` after a
   regeneration).
3. **Demo noise is stripped.** `stripDocNoise` rewrites `@mdjs/mdjs-preview` imports to `lit` and drops
   the `mdjs-preview` wrappers. It keeps only the bindings `html`, `css`, `svg`, `nothing`, `render` and
   `LitElement`. It also removes **relative imports that reach into `./src/`**.
4. **Global define imports are rewritten** to the consumer form (`import { LionX } from '@lion/ui/x.js'`).
5. **Nothing reorders by use.** `order` is the only sort key. The portal and the generated skill
   therefore show the same sequence today.

Point 3 has consequences you must design for. A helper that a demo imports from `./src/` is removed from
the generated code, but the code that calls it stays. The skill then reads `levenshtein(oVal, tVal)` with
no `levenshtein` in scope. The same happens to any binding outside the kept list: `repeat` imported from
`@mdjs/mdjs-preview` is dropped from the generated `lit` import while `repeat(` is still used below it.

## The rule: human-first pages, agent-usable references

Keep the portal order human-first: overview first (`order: 10`), then use cases (`order: 20`). Do not
reorder pages to suit the agent, because that changes the human navigation.

An agent reads the generated file top-down, though, and its most useful content is the task sections. The
target is to have the generator emit use cases before the overview for the agent, since an agent looking
for "how do I require an option match" wants the task sections first. That priority is **not implemented**
yet: the generator sorts by `order` only. Until it is, make both orders work:

- The definition appears **once**. Put it in the overview; the use-case page should start at its first
  task.
- **Every task section is self-contained**: its own import, its own markup, the one property it is
  about. An agent that reads only that section must still get working code.
- The overview's feature list gives **exact values** (allowed values, defaults), so the reference works
  even when read first.

### Worked example: `combobox`

Source: `docs/components/combobox/overview.md` (`order: 10`) and `use-cases.md` (`order: 20`).

| Order | Human portal (nav) | Agent reference, today | Agent reference, target |
| ----- | ------------------ | ---------------------- | ----------------------- |
| 1     | Overview           | Overview               | Use Cases               |
| 2     | Use Cases          | Use Cases              | Overview                |
| 3     | API table          | API Reference          | API Reference           |

Both can hold because the two orders answer different questions. The portal order is navigation. The
reference order is what a model reads first. A page with one definition and self-contained sections works
in either order.

What the source does today, checked against the generated reference, and the fix for each:

- **The definition is repeated.** Both `overview.md` and `use-cases.md` open with "A combobox is a widget
  made up of the combination of two distinct elements" (it appears twice in the generated file). Keep it
  in the overview; start the use-case page at `## Require option match`.
- **Demo helpers leak.** `use-cases.md` imports `levenshtein` from `./src/levenshtein.js` and calls it in
  the Match Mode example. The generated Match Mode section calls `levenshtein(...)` with no import. Write
  the matching function inline in the example, or name it in prose as a dependency.
- **A link to a dropped page survives.** The overview ends with `[...show more](./extensions.md)`. The
  generator excludes `extensions.md`, so the link in the reference goes nowhere.
- **Imports the generator keeps must be exact.** An `@lion/ui/…` import in an example survives into the
  reference, so it must be the real one (`import { LionCombobox } from '@lion/ui/combobox.js';`), checked
  against `references/entrypoints.md`.

## Section by section

Each `##` in a use-case page is **one task or one property**, phrased as the task or property: "Require
option match", "Disabled option", "Server interaction". Under it, in this order:

1. One sentence on what the property does and its default, with the allowed values written out.
2. The smallest markup that shows it. Vary only the one property the section is about.
3. One sentence on the failure mode a reader would hit first, if there is one.

Example (from the `Require option match` section, shortened):

```html
<lion-combobox name="search" label="Search" .requireOptionMatch="${false}">
  <lion-option .choiceValue="${'Amsterdam'}">Amsterdam</lion-option>
  <lion-option .choiceValue="${'Berlin'}">Berlin</lion-option>
</lion-combobox>
```

Prose says: `requireOptionMatch` defaults to `true`; set it to `false` to make the textbox leading, as in a
search input. The agent gets the property, the default, the value and the markup from one section.

## Degrees of freedom

Match the detail to how fragile the behaviour is, as the best-practices guidance says (see `references/sources.md`):

- **Concepts and choices: text.** Explain when to use one pattern over another ("use `requireOptionMatch`
  only when the value must be one of the options"). An agent can adapt this.
- **Patterns: a parameterised template.** Show the markup with the varying property in a placeholder
  position, as in the example above.
- **Glue that must be exact: exact code.** Imports, entrypoints, attribute and property names, event
  names, and allowed values. These have one correct spelling. A near miss fails at load time.

## Checklist (apply per page before you finish)

- [ ] One `# Title` per page. The generator turns it into `##`.
- [ ] Each `##` is a single task or property, phrased as one.
- [ ] Every element name and entrypoint you mention exists in `references/entrypoints.md` (for lion, the
      list generated from `packages/ui/exports`).
- [ ] No example depends on a `./src/` helper, `lazyRender`, or demo-only data. Inline it or name it.
- [ ] Every binding an example uses is in the generator's kept list (`html`, `css`, `svg`, `nothing`,
      `render`, `LitElement`). For a list, use `html` with `.map()`, not `repeat`, which is dropped.
- [ ] Each property names its default and its allowed values.
- [ ] The definition of the component appears once across overview and use cases.
- [ ] No link targets a page the generator drops (`extensions.md`, `migration.md`, `api-table.md`,
      `index.md`).
- [ ] `order` is the human navigation position. Do not set it to suit the agent.
- [ ] Run `npm run skills:generate`, then read `packages/ui/skills/lion-ui/references/<kind>/<name>.md`
      as the agent would. Can you name the import, the property and its value for each task without
      guessing? If not, fix the source page, then regenerate.

## Numbers a reviewer can check

These are the limits this skill uses. Check them mechanically, not by feel:

- `SKILL.md` body under 500 lines: `wc -l packages/ui/skills/dual-audience-docs/SKILL.md`.
- References one level deep: every reference is linked directly from `SKILL.md` as `references/<file>.md`,
  and no reference file links to another. Check with
  `grep -n '](' packages/ui/skills/dual-audience-docs/references/*.md`; it must print no link to another
  reference file.
- Generated output is not hand-edited: after `npm run skills:generate`,
  `git diff --exit-code -- packages/ui/skills/lion-ui` must be clean for files you did not change in
  `docs/`.
- The description states both what the skill does and when to use it.

## Sources

The quotes behind these rules are in [references/sources.md](references/sources.md): Anthropic's skill
authoring best practices, the context-engineering article, the Agent Skills launch article, and
"Building effective agents".
