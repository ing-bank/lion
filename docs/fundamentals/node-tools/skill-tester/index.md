---
parts:
  - Node Tools
title: skill-tester
eleventyNavigation:
  key: Node Tools >> skill-tester
  title: skill-tester
  order: 15
---

# skill-tester

Skill-tester measures whether an agent skill produces **working** code for small, isolated prompts.
It runs a model against one scenario at a time in a throwaway sandbox, then scores the result on two
independent axes:

- **convention** — deterministic, browser-free gates and checks (does it parse, does it import only
  through documented entrypoints, does it export the demanded class);
- **behaviour** — the produced file is executed in a real browser (`@web/test-runner` + Chromium)
  and asserted against what the prompt demanded.

The axes are reported separately on purpose: a run can score 100% on convention checks while the code
does not work at all, and that gap is the finding worth surfacing rather than blending away.

## Running it

```bash
# one scenario, one model, with behaviour
npm run eval -w packages-node/skill-tester -- \
  --models deepseek-v4-flash --scenario field/iban-field --samples 5 --behaviour
```

`--models` is required: the harness deliberately does not default to a model, because the subject
under test is the skill, not the model. Several models are a dimension, not a default.

Records are written to `packages-node/skill-tester/.tmp/skill-tester/reports/`.

## Reading results

**[Quality](/fundamentals/node-tools/skill-tester/quality/)** is generated from the results ledger
and holds the current numbers per scenario and model.

Two rules to keep in mind when reading any number from this harness:

- a single sample is never quoted — treat fewer than three samples as indicative only;
- a run that never modified the deliverable is _not attempted_, and an arm where the endpoint failed
  is `n/a`, never `0%`. Neither says anything about the skill.

## How the numbers stay honest

- The oracle may be derived from the library, but never from the skill — otherwise each version of
  the skill would be graded against itself.
- A scenario's behaviour test must assert what its own prompt demands. When it demanded a component
  shape the prompt never asked for, it failed correct answers across four models; the fix was to
  widen the assertion to the prompt's outcome and prove the check still discriminates with a
  negative control.
- The results ledger is keyed by skill revision, model and scenario, so re-running a scenario
  updates its row rather than adding a duplicate to the page.
