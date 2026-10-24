# Benchmark run record

Complete this record from the run's transcript and captured artifacts. Use
`n/a` when a milestone was never reached; do not infer missing values.

> **In this repository:** `packages-node/skill-tester` emits this record for a whole sweep — one file
> per invocation, under its `.tmp/skill-tester/reports/`. Sections marked as emitted are produced by
> the harness; prefer its values over hand-read ones. A sweep that was not run with an axis enabled
> simply omits that section.

## Run identity

Emitted by the harness.

| Field                      | Value                                |
| -------------------------- | ------------------------------------ |
| Run number                 |                                      |
| Valid run                  | yes / no                             |
| Invalid reason             | not attempted / endpoint failure / — |
| Task                       |                                      |
| Agent                      |                                      |
| Target repository revision |                                      |
| Skill-source revision      |                                      |
| Models                     |                                      |
| Samples per scenario       |                                      |
| Start time                 |                                      |
| End time                   |                                      |
| Duration                   |                                      |
| Exit reason                | completed / timeout / failure        |

**What "valid" means, and why you must not infer it from the score.** A run is valid only if the
model actually attempted the task and the endpoint answered. The harness distinguishes three
outcomes that a bare score cannot:

- **not attempted** — the deliverable came back byte-identical to the starter. Excluded from the
  score, reported as an attempt rate. This is _not_ a knowledge gap and must never be turned into a
  skill edit: the model described an answer instead of writing it.
- **to redo** — a transient endpoint failure (429/5xx, network). Excluded from the score and listed
  under _Runs to redo_. Nothing about the skill can be concluded from it.
- **n/a** — no comparable run at all (every run had to be redone). There is no score; `0%` would be a
  lie.

Only a run that attempted the task _and_ was scored is a valid run for the convergence count.

## Quality score

Emitted by the harness.

Two independent axes, reported separately and never blended:

- **convention** — deterministic, browser-free: does it parse, does it import only through
  entrypoints that exist, did it change the deliverable, are its imports used.
- **behaviour** — the produced code was executed in a real browser and asserted against what the
  prompt demanded.

The gap between them is the finding. A run can score 100% on convention while the code does not work
at all — measured, and the reason both axes exist.

Read each cell with its sample count: **fewer than three samples is indicative only**, and a single
sample is never quoted. A converged claim rests on runs at n ≥ 3.

## Behaviour (real browser)

Emitted by the harness when the sweep ran with behaviour enabled.

Per run: pass/fail and, on failure, the assertion that failed with its message. A behaviour failure
names what the produced code did _not_ do — read it before assuming the model misunderstood the task.

## Measured milestones

Values marked as emitted come from the harness.

| Metric                                    | Value                                        |
| ----------------------------------------- | -------------------------------------------- |
| Time to first product edit                | _n/a (not instrumented)_                     |
| Time to first lint                        | _n/a (not instrumented)_                     |
| Time to first test run                    | _n/a (not instrumented)_                     |
| Time to green tests                       | _n/a (not instrumented)_                     |
| Time to coverage threshold                | _n/a (not instrumented)_                     |
| Agent turns                               | _emitted: total / mean_                      |
| Agent tool calls                          | _emitted: total / mean_                      |
| Project/dependency/global source searches |                                              |
| Avoidable retries                         | _emitted: tool errors_                       |
| Tokens                                    | _emitted: total, and the input/output split_ |
| Full task lifecycle completed             | yes / no                                     |

## Undesirable behaviors

Emitted by the harness, with the same classification vocabulary.

For every behavior, cite the relevant transcript location or artifact.

| Evidence | Triggering question or failure | Impact | Classification                               |
| -------- | ------------------------------ | ------ | -------------------------------------------- |
|          |                                |        | knowledge / navigation / adherence / harness |

One classification rule the harness enforces: a run that never wrote the deliverable is classified
**not attempted**, never `knowledge / navigation`. Attributing a no-op to the skill is the fastest way
to "improve" a skill that was never at fault.

## Runs to redo

Emitted by the harness, only when there is something to redo.

Runs excluded because the endpoint failed: scenario, model, sample, reason and the endpoint's message.
Re-run them before drawing any conclusion from the sweep — an arm with redo runs has no comparable
result for those samples.

## Improvement decision

The improver's own output — this part is not emitted.

| Field                                  | Value |
| -------------------------------------- | ----- |
| Highest-value actionable finding       |       |
| Authoritative owning skill/reference   |       |
| Generalized lesson                     |       |
| Why existing guidance was insufficient |       |
| Validation performed                   |       |
| Local commit                           |       |
| If no change, why not                  |       |

## Convergence

Check every condition:

- [ ] No source search was needed to answer a question the skill should have
      answered.
- [ ] No hallucinated or incorrect API was attempted.
- [ ] No avoidable retry resulted from skill guidance.
- [ ] Implementation and required verification completed within the timebox.
- [ ] No actionable knowledge or navigation gap remains.

Emitted by the harness. Attempt rate: how many runs modified the deliverable.

Run result: **clean / not clean**

Consecutive clean valid runs: **0 / 1 / 2**

Two caveats the harness makes explicit: runs marked _not attempted_ or _to redo_ are not valid runs
and do not count toward this number, and a sweep in which every run had to be redone is reported as
`n/a` rather than as a failure.
