---
parts:
  - Node Tools
title: skill-steward
eleventyNavigation:
  key: Node Tools >> skill-steward
  title: skill-steward
  order: 16
---

# skill-steward

`skill-steward` keeps the `lion-ui` skill honest as the product it describes keeps changing. It runs
realistic consumer scenarios against models, scores every run with deterministic checks **plus a
real-browser behaviour tier** (Chromium), records each measurement in a ledger, and drives the
recursive improvement loop from that ledger — so a documentation change becomes a measurable event
instead of an opinion.

It exists because Lion is a living product: components gain APIs, docs gain pages, and a skill written
last quarter quietly stops matching the library. Stewardship here means the skill is regenerated from
its source docs and re-measured against the library, not patched by hand and hoped over.

![skill-steward - a particular set of skills](./assets/skill-steward.png 'A particular set of skills: the machinery is ink, the figure is a photograph, and the claim is set as type by us')

The technical package is still `packages-node/skill-tester`; `skill-steward` is the product name the
work is documented under (see [The name](#the-name)).

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
| measure | scenarios × samples × model, behaviour enabled | `npm run eval -w packages-node/skill-tester` |
| attribute | each failure is classified: skill gap, measurement gap (a defect in the tool), or not attempted | the run record's evidence table |
| correct | a skill gap produces an edit to the **source doc**, never to the generated skill | `docs/**` |
| regenerate | the skill is rebuilt from those sources | `npm run skills:generate` |
| gate | the generated skill is diff-checked and the skill tests pass | `npm run skills:check` |
| rerun | the coupled use cases are re-measured at n>=3, serially | the scenarios the docs are coupled to |

A correction is only finished after **regenerate + gate + rerun on n>=3**; an edit without a re-run is a
proposal, not a fix. The worked example — a guessed entrypoint that zeroed seven runs — is written up in
`packages-node/skill-tester/docs/self-improvement-loop.md`.

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
- **Docs are coupled to use cases.** `packages-node/skill-tester/scenario-docs.json` plus
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

The harness measuring itself: **137/137** tests in `packages-node/skill-tester`, and **40/40** in
`packages-node/change-graph`.

Live results per scenario and model are generated from the ledger into
[skill-tester: quality](/fundamentals/node-tools/skill-tester/quality/).

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

The package is `packages-node/skill-tester` and stays that way — the harness itself is the tester. The
product is `skill-steward`: the job is not only to test the skill but to keep it true as the library
grows, which is what the loop, the ledger and the docs coupling are for. Two alternatives were
considered and set aside:

| Candidate | The argument for it | Why it was not chosen |
| --- | --- | --- |
| `skill-steward` | custodianship of a living document: measure, attribute, regenerate, re-measure | chosen |
| `skill-vitals` | the ledger is the skill's vitals — published per revision, retired rows included | reads as measurement only, and the loop is half the product |
| `skill-fitness` | scores are a fitness signal for a recursive improvement loop | suggests a single scalar, which is exactly what the two axes refuse to be |

## Running it

```bash
# one scenario, one model, with behaviour
npm run eval -w packages-node/skill-tester -- \
  --models <model> --scenario component/form --samples 3 --behaviour

# a sweep that publishes the ledger and this results page
npm run eval -w packages-node/skill-tester -- \
  --models <model> --samples 3 --behaviour --docs
```

`--models` has no default on purpose: the subject under test is the skill, and a model is a dimension,
not an assumption. Regenerate and gate before quoting anything:

```bash
npm run skills:generate && npm run skills:check
```
