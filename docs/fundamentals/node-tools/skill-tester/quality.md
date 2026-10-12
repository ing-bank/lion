---
parts:
  - Node Tools
title: 'skill-tester: quality'
eleventyNavigation:
  key: Node Tools >> skill-tester quality
  parent: Node Tools >> skill-tester
  title: Quality
  order: 20
---

# skill-tester: quality

> Generated from `packages-node/skill-tester/results/ledger.json` by `npm run eval:docs -w packages-node/skill-tester`. Do not edit by hand.

Scores are the skill-tester convention checks plus behaviour in a real browser, on small isolated scenarios. They say whether the skill produced working code for **these** prompts, not how good the skill is in general.

Ledger updated: 2026-10-12T17:22:34.689Z

## field/iban-field (component)

| Model               | Mean       | Min    | Max    | sd  | n   | Behaviour | Attempts | Redo | Tokens/run |
| ------------------- | ---------- | ------ | ------ | --- | --- | --------- | -------- | ---- | ---------- |
| `deepseek-v4-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3   | 3/3       | 3/3      | 0    | 55,255     |

A `n/a` row means every run had to be redone because the endpoint failed — not a score of zero. "Attempts" is how many runs actually modified the deliverable; a run that never wrote anything is recorded as _not attempted_ rather than as a wrong answer.
