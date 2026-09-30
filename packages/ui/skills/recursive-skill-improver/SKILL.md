---
name: recursive-skill-improver
description: Recursively benchmark and improve a Copilot skill by observing real task runs. Use whenever an agent working from a skill in this repo (e.g. `lion-ui`) wastes turns, searches source code it shouldn't have to, hallucinates or misuses an API, retries avoidably, or produces incomplete work. Run a fixed task repeatedly, turn each evidenced skill gap into a minimal, correctly-placed change, and continue until clean runs establish convergence or the agreed safety cap is reached.
compatibility: Requires the ability to run a coding agent against a fixed task and inspect its transcript/logs afterward. Has no dependency on a specific agent, orchestrator, or framework.
---

# Recursive skill improver

Improve a skill by observing real runs against it, not by guessing what an
agent might need. Keep the benchmark stable so differences between runs can be
attributed to skill changes rather than noise.

This skill is self-contained: it covers both running the benchmark loop and
turning evidence into a correctly-placed skill edit (see
[references/improvement-process.md](references/improvement-process.md) for the
detailed edit workflow).

## Campaign contract

Before the first run, establish these inputs with the user. Use the defaults
below when nothing more specific is given:

| Setting         | Default                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Task            | A concrete, representative task in this repo that exercises the skill under test (ask the user for one; there is no universal fixture) |
| Agent           | Whatever coding agent the user already runs the task with — this skill does not require a particular one                               |
| Target skill    | The skill directory to improve, e.g. `packages/ui/skills/lion-ui`                                                                      |
| Editable scope  | The target skill's directory only                                                                                                      |
| Per-run limit   | 15 minutes (adjust for task size)                                                                                                      |
| Run interaction | Non-interactive; never pause a run to ask whether to continue                                                                          |
| Convergence     | Two consecutive valid clean runs                                                                                                       |
| Campaign cap    | Eight valid runs or two hours, whichever comes first                                                                                   |
| Remote writes   | Forbidden unless the user explicitly approves them                                                                                     |

Ask for the task when none is given. Once the campaign starts, complete each
run automatically within its timebox.

## Preserve a controlled benchmark

1. Keep the task, model, agent, target repository revision, setup, and timebox
   fixed across comparable runs.
2. Run each attempt in a fresh clone or worktree of the target repository.
   Make the benchmark checkout remote-less when practical so the agent cannot
   push or open a pull request by accident.
3. Install the current candidate skill(s) into the fresh checkout before
   running the task. Record the exact skill-source commit.
4. Keep any package-registry credentials out of the checkout's tracked config;
   rely on the developer's existing local authentication instead of printing
   or copying secrets. Verify registry access with an actual lookup or
   install — a bare connectivity check can succeed while auth still fails.
5. Save stdout, stderr, debug logs, timestamps, and the resulting checkout for
   every attempt. Never rely only on the final response: the transcript is the
   evidence used to improve the skill.

If harness or setup behavior changes, restore comparability before
interpreting the next result.

## Run the task

Run the task the same way each time (same entry point, same flags, same
non-interactive mode), and enforce the agreed timebox — a timeout ends the
attempt; it does not authorize an extension or a request for user
confirmation.

Count an attempt as a **valid run** only when:

- setup completed sufficiently for the benchmark;
- the agent actually started implementing the task; and
- logs/transcripts for the run were captured.

Treat setup, installation, or logging failures as harness failures. Fix the
harness and repeat the same run number; do not count them as skill
performance.

## Analyze agent evidence

Read the run's transcript/logs and complete
[references/run-record.md](references/run-record.md). Flag every occurrence of
these behaviors:

- searching project, dependency, global, or external source code for an
  answer the skill should have provided directly;
- guessing, inventing, or misusing an import, API, property, event,
  configuration option, or convention;
- rereading large references when a targeted lookup would suffice;
- retrying lint, tests, coverage, setup, or implementation because guidance
  was missing or misleading;
- producing incomplete code, tests, or verification;
- spending time on unrelated investigation, late delegation, or scope
  expansion; and
- contradicting or bypassing applicable guidance in the skill.

Every source search driven by a question the skill should answer is
undesirable, even if it eventually found the correct code — record what
question caused it and whether the answer already existed in the skill.

Also record objective milestones:

- time to first product edit;
- time to first lint;
- time to first test run;
- time to green tests;
- time to the coverage threshold (if applicable);
- agent turns and tool calls;
- project-source search count;
- avoidable retry count; and
- whether the task reached a complete, verified state.

## Classify before editing

Follow [references/improvement-process.md](references/improvement-process.md)
for every proposed change. Classify the evidence first:

- **Knowledge gap**: required information is absent, incomplete, or wrong.
- **Navigation/performance gap**: correct information exists but is expensive
  or difficult to locate.
- **Adherence gap**: clear guidance already exists and the agent ignored it.
- **Harness gap**: setup, installation, logging, or run orchestration failed
  independently of skill content.

Change the skill only for a knowledge or navigation/performance gap with a
generalizable remedy. Do not duplicate increasingly forceful prose for an
adherence gap, and do not hide a harness defect inside the skill.

## Apply one generalized lesson

For each valid run:

1. Rank actionable findings by wasted time, recurrence, and impact on
   correctness.
2. Select the smallest high-value lesson that would have prevented the
   observed behavior.
3. Put it in the narrowest authoritative owner within the target skill.
   Prefer a specific reference file for topic-specific facts and the
   top-level `SKILL.md` only for cross-cutting rules.
4. Include exact imports, allowed values, binding forms, interaction
   mechanics, or commands when the failure shows that precision is necessary.
5. Avoid benchmark-specific names, values, and implementation details. The
   guidance must help a different task with the same underlying problem.
6. Check existing guidance and references to avoid contradiction or
   duplicate ownership.
7. Validate links, examples, formatting, and the focused diff.
8. Create one local commit for the lesson, including the run evidence and
   classification in the commit body. Do not push it without explicit
   approval.

When one root cause requires tightly coupled edits in two references, keep
them in the same lesson and commit. Do not bundle unrelated findings.

## Recurse

Start the next valid run from another fresh benchmark checkout with the newly
committed skill changes. Do not repair the previous run's implementation and
call that a new run.

A valid run is **clean** only when all of these hold:

- no project/dependency/global source search was needed to answer a question
  the skill should have answered;
- no hallucinated or incorrect API was attempted;
- no avoidable retry can be traced to missing or hard-to-find skill guidance;
- the requested implementation and its required verification completed
  within the timebox; and
- evidence review finds no actionable knowledge or navigation/performance gap
  in the target skill.

Stop when two consecutive valid runs are clean. Also stop at the agreed run
or elapsed-time cap, even when convergence has not been reached. A cap is a
safety boundary, not evidence of success.

## Report results

Report each valid run with:

- outcome and furthest completed milestone;
- elapsed time, turns, tool calls, searches, and retries;
- evidenced undesirable behaviors;
- classification of each finding;
- skill change and commit, or the reason no skill change was justified; and
- current clean-run streak and remaining campaign budget.

At campaign end, distinguish progress from speed. Fewer searches, fewer wrong
APIs, or more implementation completed within the timebox are improvements,
but they do not prove reduced implementation time. Claim faster
implementation only when repeated controlled runs finish and measured
completion milestones improve.
