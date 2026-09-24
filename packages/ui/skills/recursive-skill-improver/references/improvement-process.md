# Improvement process

Turn a concrete failure or lesson from a run into a durable, correctly-placed
skill improvement.

The goal is not "add more words." It is to capture the lesson **once**, in the
**skill or reference that owns it**, in a form that changes future behavior —
without duplicating rules, leaking domain specifics across skills, or breaking
a skill's standalone use.

## When to use

- A run failed or was expensive because the skill lacked knowledge it should
  have provided.
- The same class of mistake has recurred, or is likely to recur, across runs.
- A post-mortem produced a lesson (e.g. "form controls must be created through
  a registrar, not by extending the base class directly", "validators import
  from the validation entry point, not the package root") and you want it
  enforced next time.
- You are reviewing or consolidating skills and found duplicated, drifting, or
  misplaced guidance.

The process itself is domain-agnostic. Lessons about APIs, conventions,
tooling, or process all follow the same steps; adapt the example formats
rather than assuming any particular structure exists.

## Hard boundaries

- **Only edit the target skill and its own reference files.** Do not change
  product/source code, tests, or run outputs as part of this workflow, and do
  not edit unrelated skills, agent configuration, or repository automation as
  a side effect of a benchmark run.
- **Never write without approval.** Present the improvement plan and get
  explicit user approval before editing any file (see
  [Get approval before writing](#get-approval-before-writing)).
- **Minimal diffs.** Add or adjust the smallest amount of guidance that
  prevents recurrence. Do not restructure a skill you were not asked to.
- **No duplication.** A rule lives in exactly one authoritative place.
  Everywhere else points to it.
- **No scope leakage.** Do not put one skill's specifics into another skill.
  Keep each skill valid when used on its own.
- **Do not weaken existing gates.** Strengthen or clarify; never delete an
  enforcement rule to make an example shorter.

## Core principle: one lesson, one owner, one voice

Every improvement answers three questions in order:

1. **What knowledge was missing?** (the lesson, stated as a rule)
2. **Which skill or reference owns that knowledge?** (the single authoritative
   home)
3. **How is it enforced there, and merely pointed to elsewhere?**
   (enforcement vs handoff)

If you cannot name a single owner, the lesson is probably two lessons —
split it.

## Step 1 — Diagnose the gap

**First, classify the failure type — not every failure is missing knowledge.**
For each failure, check whether the correct rule already exists in a skill
that was in play, then route accordingly:

| Failure type               | Test                                                                                                                                                | Correct response                                                                                                                                                                                                                                         |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Knowledge gap**          | No skill in play states the rule.                                                                                                                   | Proceed with the remaining steps: add the rule to its owner.                                                                                                                                                                                             |
| **Surfacing / timing gap** | The rule exists and is correct, but lives where it is read **too late** (e.g. below where the imports and call sites are already written).          | Do **not** restate the rule. Add a one-line imperative or pointer at the read-in-time location; the owner keeps the full detail.                                                                                                                         |
| **Adherence gap**          | The rule exists, is correct, **and** is surfaced in time, but the agent guessed or skipped it anyway (e.g. did not run lint before declaring done). | Content changes will not help — more prose causes drift without changing behavior. Do **not** pad the skill. Report it under **Out-of-scope findings** in the [Output](#output); the durable lever is a deterministic check, which is out of scope here. |

Only a **knowledge gap** warrants new rule content. For surfacing gaps, the
fix is placement, not words. For adherence gaps, resist editing the skill at
all. If several failures came from one run, triage each separately — they
often land in different rows.

Once classified, extract the **generalizable rule**, not the incident.

- State what the agent assumed vs what was true.
- Ask: what single sentence, present in the skill, would have prevented this?
- Strip the lesson down to its transferable form. "The lookup call returned
  nothing" → "instances must be created through the factory function."
- Collapse multiple symptoms with one root cause into **one** rule (e.g.
  several distinct empty/error responses that all reduce to "instance
  constructed directly" are one lesson, not many).

## Step 2 — Classify the knowledge

Pick the type; it drives placement and format.

| Type                                                         | Example                                                                   | Where it belongs                                                             |
| ------------------------------------------------------------ | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Enforcement rule** (must/never)                            | "Read a component's API reference before using an undocumented property"  | The most specific reference that owns the domain                             |
| **Reference detail** (facts, APIs, signatures, import paths) | "Validators import from the validation entry point, not the package root" | A `references/*.md` file, never the top-level `SKILL.md`                     |
| **Routing / handoff** (which reference to defer to)          | "When composing X, see the X reference"                                   | The top-level `SKILL.md`, as a one-line pointer                              |
| **Example / pattern**                                        | Sample usage snippet                                                      | Keep examples generic in the top-level file; specifics live in the reference |

## Step 3 — Locate the authoritative owner

Choose the home that is **most specific to the knowledge** and **read at the
moment the mistake happens**.

- Prefer a specific reference file over the top-level `SKILL.md` for domain
  facts and enforcement.
- Prefer a `references/<topic>.md` file over the top-level `SKILL.md` when the
  detail is long or lookup-style, and have the `SKILL.md` gate point to it.
- If several places could plausibly host it, pick the one that is loaded
  **before** the affected artifact is written — a gate only works if it is
  read in time.
- Check whether an owner already exists (a related gate, rule table, or
  reference). Extend it instead of adding a parallel section.

## Step 4 — Decide enforcement vs pointer

Once the owner is chosen:

- **In the owner:** write the full enforcement — the rule, why it matters,
  and how to comply.
- **Everywhere else:** at most a **one-line handoff** ("see the `<topic>`
  reference before …"). No restated MUST/NEVER language, no copied examples.
- This prevents drift: when the rule changes, only the owner is edited.

Test: if you find yourself writing the same imperative in two files, one of
them should become a pointer.

## Step 5 — Write the improvement so it changes behavior

Effective gates share a shape:

- **Imperative and unmissable:** "Before you use an undocumented property,
  read the component's API reference." State the trigger (when) and the
  action (what).
- **Grounded in a concrete failure:** name the actual symptom so the reader
  recognizes the risk. Keep these concrete examples in the owning reference
  only.
- **Checklist when multi-step:** a short "before you start" list beats a
  paragraph.
- **Audience-aware:** motivating the rule by its cost is fine, but do **not**
  reference benchmark mechanics (run counts, timeboxes, convergence) in a
  reference that can be used standalone. Keep skill content free of
  benchmark-specific vocabulary.
- **Scale sublinearly with the domain — one rule per class of mistake, not
  one block per instance.** Per-instance blocks multiply until the skill's
  size tracks the domain, loads on every run, and drowns the signal. Apply,
  in order:
  1. Name the underlying principle in the gate, not the case that failed —
     the general form covers every future instance.
  2. Leave instance-level facts (specific APIs, names, paths, values, config
     keys) in on-demand reference docs, and link to them.
  3. If the same class of failure recurs _despite_ a correct, in-time rule,
     the scalable lever is a deterministic check (lint rule, type, test,
     schema), not more prose — report it as an out-of-scope finding rather
     than growing the skill.

Match the surrounding skill's voice and formatting (heading style, bold-lead
conventions, table vs prose).

### Worked example

_Failure:_ a run wired up a form control by extending the base class directly
instead of going through the library's registration helper; validation never
fired because the base class alone does not wire up the validation manager.

1. **Classify:** no reference in play stated the requirement → knowledge gap.
2. **Generalize:** not "validation didn't run for this one control" but "form
   controls must be created through the registration helper, not by
   extending the base class directly."
3. **Owner:** the reference covering that component family (specialized, and
   loaded before any call site is written) — not the top-level `SKILL.md`.
4. **Enforcement in the owner** (in the existing setup section):

   ```md
   - **Register the control through the helper, never extend the base class
     directly.** Extending the base class type-checks and runs, but skips
     validation-manager wiring — validation silently never fires.
   ```

5. **Pointer elsewhere** (top-level `SKILL.md`, one line, no restated MUST):

   ```md
   When adding a new form control, see its reference and register it through
   the helper described there.
   ```

6. **Not done:** no per-component warning blocks; the specific registration
   signatures stay in the component's own reference file.

## Get approval before writing

Before editing any file, present the plan and wait for explicit approval. One
block per lesson:

- **Lesson** — the generalizable rule, one sentence.
- **Classification** — knowledge / surfacing / adherence gap, with the test
  that decided it.
- **Owner** — the file that will change, and why it is the most specific
  in-time home.
- **Diff sketch** — the exact text to add, plus any one-line pointers
  elsewhere.

If the user rejects a placement, re-run Step 3 rather than widening the diff.
Out-of-scope findings need no approval — they are reported, not applied.

## Step 7 — De-duplication and scope pass

Before finishing, verify:

- Enforcement vs pointer holds as decided in Step 4 — one authoritative home,
  pointers everywhere else.
- No specialized specifics (symbol names, import paths, domain terms) leaked
  into the top-level `SKILL.md`'s prose or examples.
- Examples in the top-level file stay generic (placeholder comments that
  point to the owning reference) rather than hard-coding one component's
  APIs.
- Each edited file still reads correctly if loaded **alone**, with no
  dangling references to concepts defined only elsewhere.

## Step 8 — Validate

Run the checks; do not rely on re-reading alone.

- **Duplication check** — grep the distinctive phrase of the new rule across
  the skill's directory; expect exactly one enforcement hit, and only
  pointers otherwise:

  ```bash
  grep -rn "<distinctive phrase>" path/to/skill/
  ```

- **Link check** — every relative `references/*` link in the edited files
  resolves:

  ```bash
  grep -rhoE "\]\(([^)]*references/[^)]+)\)" <edited-file> \
    | sed -E 's/.*\((.*)\)/\1/' | while read -r l; do
        [ -e "$(dirname <edited-file>)/$l" ] || echo "BROKEN: $l"; done
  ```

- **Diff check** — `git diff` shows only the intended files, additive and
  minimal, with no unrelated rewrites and no deleted gates.
- **Frontmatter check** — the frontmatter still parses and `description` is
  intact.
- Re-read each edited section top-to-bottom as if newly loaded.

## Output

Report, after the edits are applied:

- **Applied** — per lesson: rule, owner file, enforcement-or-pointer, one-line
  rationale.
- **Validation** — result of each Step 8 check.
- **Out-of-scope findings** — adherence gaps and recurring failures that need
  a deterministic check (lint rule, type, test, schema) instead of prose.
  State the lesson and the layer that should own it; do not apply them.
- **Not changed** — lessons deliberately dropped (already covered, not
  generalizable), with the reason.

## Anti-patterns

- **Copy-paste enforcement** into multiple files "to be safe" — guarantees
  drift.
- **Editing before approval**, or widening the diff when a placement is
  rejected instead of re-running Step 3.
- **Silently dropping an out-of-scope lesson** — adherence gaps still get
  reported, just not applied.
- **Re-documenting a rule that already exists** — when a failure happened
  _despite_ correct, in-time docs, adding the same rule again is treating an
  adherence gap as a knowledge gap. Fix surfacing, or route it to a
  deterministic check; do not duplicate.
- **Fixing the incident, not the rule** — guidance so specific it only covers
  the one case that failed.
- **Per-instance prose that grows with the domain** — adding a fresh warning
  block for each API/case instead of one generalizing rule, so the file's
  size tracks the domain rather than the number of distinct lessons.
- **Burying the gate** below where the agent has already started writing —
  it must be read in time.
- **Leaking specifics upward** into the top-level `SKILL.md`, breaking its
  neutrality and standalone use.
- **Benchmark-mechanics vocabulary** (run counts, timeboxes, convergence) in a
  reusable reference.
- **Deleting real examples/rules** to shorten a file instead of generalizing
  them.
