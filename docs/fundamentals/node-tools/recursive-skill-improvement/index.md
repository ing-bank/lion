---
parts:
  - Node Tools
title: recursive-skill-improvement
eleventyNavigation:
  key: Node Tools >> recursive-skill-improvement
  title: recursive-skill-improvement
  order: 16
---

# recursive-skill-improvement

`recursive-skill-improvement` keeps the `lion-ui` skill honest as the product it describes keeps
changing. It runs realistic consumer scenarios against models, scores every run with deterministic
checks **plus a real-browser behaviour tier** (Chromium), records each measurement in a ledger, and
drives the recursive improvement loop from that ledger — so a documentation change becomes a
measurable event instead of an opinion.

It exists because Lion is a living product: components gain APIs, docs gain pages, and a skill written
last quarter quietly stops matching the library. Improvement here means the skill is regenerated from
its source docs and re-measured against the library, not patched by hand and hoped over.

![a man holding a clamshell phone to his ear, printed as a two-tone halftone plate: ink dots on paper at a regular screen, framed by a thin ink keyline — the face, the furrowed brow and the glare are all that survive the screen, which is the point](./assets/recursive-skill-improvement-hero.png 'The reference photograph as a halftone plate: the 415px source is printed, not enlarged, and the screen makes its resolution a deliberate part of the style')

## The system, the task and the protocol

Three names, one thing each, and they must not be read as rivals:

- the **system** is `recursive-skill-improvement` — this package, its docs and its CLI together, the
  total product;
- the **task** `improve` is a subcommand of that CLI: it runs the loop
  (measure → attribute → correct → regenerate → rerun) and reports the actionable findings;
- the **protocol** is the skill `recursive-skill-improver` — the hand-written description of that loop
  (`packages/ui/skills/recursive-skill-improver`), consumed by the `improve` task.

## Tasks

The CLI exposes four tasks as the **first positional argument**
(`recursive-skill-improvement <task> [flags]`); with no task argument the current behaviour is
unchanged, because `eval` is the default. `retire` is deliberately **not** a task: a withdrawn model
is data (`RATES[…].retired`), not an action.

| Task | What it does | Command |
| --- | --- | --- |
| `eval` | the atom: one scenario × model, scored (the default) | `npm run eval -w packages-node/recursive-skill-improvement -- --models <model>` |
| `sweep` | the whole round: measure, then publish the ledger and this results page (equivalent to `eval --docs`) | `npm run eval -w packages-node/recursive-skill-improvement -- sweep --models <model> --samples 3 --behaviour` |
| `improve` | the failing set, attributed: measure, then classify every failure and report the exact check and its `file:line` | `npm run eval -w packages-node/recursive-skill-improvement -- improve --models <model>` |
| `report` | render/print the ledger as the results page; no runs, no model needed | `npm run eval -w packages-node/recursive-skill-improvement -- report` |

**`sweep` = the whole round; `improve` = the failing set, attributed.**

`improve` cannot edit docs — that is human/agent work. It runs, attributes each failure to one of
`{docs-gap | harness-defect | model-behaviour}`, prints the exact check and its `file:line`, and names
the coupled scenario(s) that must be re-run at n>=3, so it **sets the correction up**. Correcting the
doc, regenerating (`npm run skills:generate`) and gating (`npm run skills:check`) stay in the
human/agent loop — `skills:check` is a gate, not a task.

`node src/cli.ts --help` lists the tasks and the flags; the flags are unchanged and still compose with
every task.

## Why measurement, and why two axes

A skill can produce code that parses, imports only from documented entrypoints and exports the demanded
class — and still not work. The two axes are therefore reported separately and never blended:

| Axis | What it is | What a failure means |
| --- | --- | --- |
| **convention** | deterministic, browser-free gates and checks: does it parse, does it import only through documented entrypoints, does it export the demanded class | the code violates a rule the docs state |
| **behaviour** | the produced file is executed in a real browser (`@web/test-runner` + Chromium) and asserted against what the prompt demanded | the code loads but does not do the job |

A cell can hold 100% on convention and 0/3 on behaviour. That gap is the finding worth publishing, not
an artefact to average away.

## How it works: measure → attribute → correct → regenerate → rerun

| Step | What happens | Where |
| --- | --- | --- |
| measure | scenarios × samples × model, behaviour enabled | `npm run eval -w packages-node/recursive-skill-improvement` |
| attribute | each failure is classified: skill gap, measurement gap (a defect in the tool), or not attempted | the run record's evidence table, and the `improve` task's findings |
| correct | a skill gap produces an edit to the **source doc**, never to the generated skill | `docs/**` |
| regenerate | the skill is rebuilt from those sources | `npm run skills:generate` |
| gate | the generated skill is diff-checked and the skill tests pass | `npm run skills:check` |
| rerun | the coupled use cases are re-measured at n>=3, serially | the scenarios the docs are coupled to |

![recursive skill improvement - the recursive ring, with the ledger as its backbone](./assets/recursive-skill-improvement.png 'the loop itself, drawn: five stations in a ring - measure, attribute, correct, regenerate, rerun - joined by one band that is the ledger, each station carrying a revision stamp; the machinery is ink, the paper is the plate, and the caption is set as type by us')

A correction is only finished after **regenerate + gate + rerun on n>=3**; an edit without a re-run is a
proposal, not a fix. The worked example — a guessed entrypoint that zeroed seven runs — is written up in
`packages-node/recursive-skill-improvement/docs/self-improvement-loop.md`.

## The mechanisms that keep the numbers honest

- **The ledger is keyed by (skill revision, model, scenario, provider).** A revision is the git tree
  hash of the skill directory, so an unrelated commit does not invalidate stored results. `provider`
  plus its derived `subject` (`model` or `agent`) means an **agent** measurement and a **model**
  measurement with the same model name can never collide and are never averaged.
- **`n=0` means not attempted, never 0%.** A run that never modified the deliverable, or an arm whose
  endpoint failed, is recorded as `n/a` and excluded from the score. Only `n>=3` is quoted; a single
  sample is never cited.
- **Retired models are marked, not deleted.** `RATES[…].retired` stamps the rows of a withdrawn model
  id: the history stays visible with a `†` and is excluded from the headline number, so a retired model
  is never counted beside a current measurement. The ledger currently carries 264 such rows.
- **A correction owes a re-run.** `npm run skills:generate`, `npm run skills:check`, then the coupled use
  cases at n>=3, serially. If the skill hash tilted, every cell on the old revision is stale and is said
  to be stale.
- **Docs are coupled to use cases.** `packages-node/recursive-skill-improvement/scenario-docs.json` plus
  `packages-node/change-graph/src/docs-coupling.js` make a docs change deterministically *affected* for
  the scenarios derived from those docs — a soft, optionalDep-style edge, so it can never become a build
  requirement.
- **Failing checks name the fault** instead of staying vague: the **import-policy gate**, the
  **syntax gate**, `importsResolve` (a missing relative import), `namedExportsExist` (a binding the
  entrypoint does not export), and a check that rejects **placeholder specifiers** (an import from
  `<something>` a model copied from an example).

## The numbers

Scenarios: **47** — 35 component, 5 system, 2 integration, 2 use-case, 1 form, 1 field, 1 repair.
Ledger: **909 rows**. Newest revision: `b9cf47ea`.

| Revision | Cells measured at n=3 | Samples | Prefix score | Behaviour |
| --- | --- | --- | --- | --- |
| `ea05f86b` | 18 (the live `deepseek-v4-1-flash` cells) | 54 | **18 of 18 cells at 100%** | 34/39 assertions |
| `b9cf47ea` (newest) | 4 (the form-doc-coupled cells) | 12 | **4 of 4 cells at 100%** | 3/3 on the three behaviour-enabled cells |

The four coupled cells on the newest revision, re-measured after the skill revision tilted:

| Scenario | n | Mean | Behaviour |
| --- | --- | --- | --- |
| `component/form` | 3 | 100% | 3/3 |
| `form/iban-in-form` | 3 | 100% | 3/3 |
| `repair/iban-field` | 3 | 100% | 3/3 |
| `system/form` | 3 | 100% | not run (0/0) |

The harness measuring itself: **137/137** tests in `packages-node/recursive-skill-improvement`, and **40/40** in
`packages-node/change-graph`.

Live results per scenario and model are generated from the ledger into
[recursive-skill-improvement: quality](/fundamentals/node-tools/recursive-skill-improvement/quality/),
and the generated lion-ui references are indexed at
[recursive-skill-improvement: skill index](/fundamentals/node-tools/recursive-skill-improvement/skill-index/).

## What the docs are worth: the omission experiment

The same scenarios were run **without** the skill in the harness: **79.4% on the static checks but 0/18
behaviour** — the code looked documented and did not work. With the skill, the same arm scored **100%
and 9/9 behaviour**. That is the evidence that the documentation, and not the model's prior, is what
carries the behaviour tier.

## Faults the tool found in its own work

The loop is only credible if it turns on its author too. Four examples from real runs:

- a docs typo we wrote ourselves — a menu-item class in the API table under a spelling the library does
  not export (the real one is `LionMenuitem`, in the `menu` module);
- **15 invented entrypoint specifiers the skill itself taught** — the model copied them faithfully;
- a **comment-blind check** that failed correct code because the rule it wanted was commented out;
- **placeholder imports in `SKILL.md`** — a literal `<lion-validate>` example that a model imported
  verbatim, which neither `importsResolve` nor `namedExportsExist` could see, because a placeholder is
  not a resolvable specifier at all. That gap is now a check.

## What is not measured yet

- Cells are historical **per revision**. After the tilt to `b9cf47ea`, the ledger carries fresh `n=0`
  markers for every scenario except the four coupled ones: those 43 scenarios must be re-measured before
  any of their numbers are quoted.
- The **agent** subject is a separate row (`provider: claude-code`), and there is currently one such
  cell. It is never mixed into the model columns.
- Behaviour is not run for every cell: scenario prompts that do not demand a runnable outcome report
  `0/0` rather than a pass rate.
- The retired model's rows are history by definition; they are not evidence about the current skill.

## The name

The package, the docs directory and the CLI all carry one name: `recursive-skill-improvement`. It is
the name of the **total product**, spelled out rather than abbreviated: no `rsi`, no initialism that
would have to be expanded on first use. The name states the job — the loop is recursive (each
correction is re-measured against the regenerated skill), and the goal is improvement, not a verdict on
one snapshot. The commands inside it are **subcommands** (tasks), not a second product: `improve` is the
task that runs the loop, and the hand-written `recursive-skill-improver` skill is the protocol it
follows.

Two earlier candidates and the abbreviation were considered and set aside:

| Candidate | The argument for it | Why it was not chosen |
| --- | --- | --- |
| `recursive-skill-improvement` | the total product: the recursive loop, its ledger and the docs coupling, named in full | chosen |
| `skill-steward` | custodianship of a living document: measure, attribute, regenerate, re-measure | used as a provisional product label; it named the role, not the loop, and sat beside a near-identical package name |
| `skill-vitals` | the ledger is the skill's vitals — published per revision, retired rows included | reads as measurement only, and the loop is half the product |
| `rsi` (abbreviation) | shorter to type | an initialism is not a name a reader can place without a glossary |

## Running it

```bash
# one scenario, one model, with behaviour
npm run eval -w packages-node/recursive-skill-improvement -- \
  --models <model> --scenario component/form --samples 3 --behaviour

# a sweep that publishes the ledger and this results page
npm run eval -w packages-node/recursive-skill-improvement -- \
  sweep --models <model> --samples 3 --behaviour

# measure and report the cells below 100%, with the failing check and its file:line
npm run eval -w packages-node/recursive-skill-improvement -- \
  improve --models <model> --samples 3
```

`--models` has no default on purpose: the subject under test is the skill, and a model is a dimension,
not an assumption. Regenerate and gate before quoting anything:

```bash
npm run skills:generate && npm run skills:check
```
