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

`Rev` is the skill revision the row was measured against — the git tree hash of the skill directory, so it changes when the skill does and not when an unrelated commit lands. A scenario can hold rows from more than one revision; they are listed newest first, and only rows on the same revision are comparable.

Ledger updated: 2026-11-13T08:24:35.092Z

## Live picture

23 live cell(s) — newest measured (n>0) row per model × scenario × provider, retired models excluded: **19 at 100%**, 4 below 100%. 44 further cell(s) belong to a withdrawn model (`deepseek-v4-flash`) and are marked † as history below; they do not count in the headline.

## component/accordion (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 65,624 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 64,719 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 46,903 | $0.01 | `3df6d83` |

## component/accordion-run (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 63,975 | $0.01 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 68,551 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 50,015 | $0.01 | `3df6d83` |

## component/button (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 84,082 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 55,942 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 55,493 | $0.01 | `3df6d83` |

## component/calendar (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 67,661 | $0.03 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 119,557 | $0.06 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **93.3%** | 80.0% | 100.0% | 0.1 | 3 | 2/3 | 3/3 | 0 | 140,841 | $0.03 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 132,468 | $0.03 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 59,488 | $0.01 | `3df6d83` |

## component/checkbox-group (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 85,249 | $0.04 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 116,263 | $0.06 | `578381a` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 107,996 | $0.06 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 1/3 | 3/3 | 0 | 57,884 | no published rate | `d17f055` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 1¹ | 1/1 | 1/1 | 0 | 63,657 | $0.01 | `7f45d90` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 135,993 | $0.03 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 199,779 | $0.05 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 108,015 | $0.03 | `166718c` |
| `deepseek-v4-flash` † | **0.0%** | 0.0% | 0.0% | 0.0 | 3 | 0/3 | 3/3 | 0 | 122,821 | $0.03 | `3df6d83` |

## component/collapsible (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 66,454 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 74,925 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 32,634 | $0.0077 | `3df6d83` |

## component/combobox (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 162,680 | $0.04 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 130,634 | $0.03 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 181,004 | $0.04 | `3df6d83` |

## component/dialog (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 78,277 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 71,299 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 58,044 | $0.01 | `3df6d83` |

## component/drawer (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 61,796 | $0.01 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 62,874 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 89,477 | $0.02 | `3df6d83` |

## component/fieldset (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 170,201 | $0.04 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 109,924 | $0.03 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 71,997 | $0.02 | `3df6d83` |

## component/form (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 1/3 | 3/3 | 0 | 165,677 | $0.08 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 5 | 5/5 | 5/5 | 0 | 192,304 | $0.15 | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | **96.7%** | 90.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 280,659 | $0.13 | `709dd6c` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 292,299 | $0.15 | `578381a` |
| `deepseek-v4-1-flash` | **96.7%** | 90.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 208,605 | $0.10 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 295,076 | $0.07 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 77,343 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 51,641 | $0.01 | `166718c` |
| `deepseek-v4-flash` † | **66.7%** | 0.0% | 100.0% | 0.5 | 3 | 2/3 | 3/3 | 0 | 101,664 | $0.02 | `3df6d83` |

## component/input (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 61,898 | $0.01 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 67,165 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 87,861 | $0.02 | `3df6d83` |

## component/input-amount (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 73,909 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 80,109 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 60,356 | $0.01 | `3df6d83` |

## component/input-amount-dropdown (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 110,852 | $0.03 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 114,450 | $0.03 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 64,624 | $0.02 | `3df6d83` |

## component/input-date (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 87,115 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 57,578 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 43,116 | $0.01 | `3df6d83` |

## component/input-datepicker (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 58,096 | $0.03 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 209,890 | $0.10 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 118,791 | $0.03 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 86,079 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **66.7%**² | 0.0% | 100.0% | 0.5 | 3 | 2/3 | 2/3 | 0 | 50,569 | $0.01 | `3df6d83` |

## component/input-email (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 142,211 | $0.07 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 164,748 | $0.08 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **93.3%** | 80.0% | 100.0% | 0.1 | 3 | 2/3 | 3/3 | 0 | 114,642 | $0.03 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 48,776 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 63,173 | $0.01 | `3df6d83` |

## component/input-file (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 80,238 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 97,144 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 46,193 | $0.01 | `3df6d83` |

## component/input-iban (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 95,168 | $0.05 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | **80.0%** | 80.0% | 80.0% | 0.0 | 3 | 0/3 | 3/3 | 0 | 222,247 | no published rate | `7f45d90` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 73,175 | $0.04 | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 68,656 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 76,093 | $0.02 | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 69,094 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 44,978 | $0.01 | `3df6d83` |

## component/input-range (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 82,238 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 64,409 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 44,384 | $0.01 | `3df6d83` |

## component/input-stepper (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **93.3%** | 80.0% | 100.0% | 0.1 | 3 | 2/3 | 3/3 | 0 | 95,218 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 69,803 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 49,674 | $0.01 | `3df6d83` |

## component/input-tel (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 155,068 | $0.04 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 97,688 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 64,600 | $0.02 | `3df6d83` |

## component/input-tel-dropdown (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 119,810 | $0.03 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 118,614 | $0.03 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 51,555 | $0.01 | `3df6d83` |

## component/listbox (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 90,429 | $0.04 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 114,522 | $0.05 | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 74,913 | $0.04 | `709dd6c` |
| `deepseek-v4-1-flash` | **96.7%** | 90.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 134,574 | $0.07 | `578381a` |
| `deepseek-v4-1-flash` | **96.7%** | 90.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 63,098 | $0.03 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **93.3%** | 80.0% | 100.0% | 0.1 | 3 | 2/3 | 3/3 | 0 | 215,554 | $0.05 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 159,893 | $0.04 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 89,251 | $0.02 | `166718c` |
| `deepseek-v4-flash` † | **66.7%** | 0.0% | 100.0% | 0.5 | 3 | 2/3 | 3/3 | 0 | 95,408 | $0.02 | `3df6d83` |

## component/menu (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 107,281 | $0.05 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | **97.2%** | 91.7% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 68,314 | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 5 | 5/5 | 5/5 | 0 | 77,180 | $0.06 | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 90,418 | $0.04 | `ca785a4` |
| `deepseek-v4-1-flash` | **66.7%** | 0.0% | 100.0% | 0.5 | 3 | 0/3 | 3/3 | 0 | 93,050 | $0.05 | `709dd6c` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 0/3 | 3/3 | 0 | 157,390 | $0.08 | `578381a` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 261,082 | $0.13 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | **96.7%** | 90.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 90,002 | no published rate | `d17f055` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 1¹ | 1/1 | 1/1 | 0 | 144,862 | $0.02 | `7f45d90` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 305,297 | $0.07 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 5 | — | 5/5 | 0 | 101,294 | $0.04 | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 114,353 | $0.03 | `3f8ac1e` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 3 | — | 0/3 | 0 | 65,507 | $0.02 | `166718c` |

## component/pagination (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 82,110 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 43,977 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 41,471 | $0.0097 | `3df6d83` |

## component/progress-indicator (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 76,413 | $0.04 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | **83.3%** | 83.3% | 83.3% | 0.0 | 3 | 0/3 | 3/3 | 0 | 19,143 | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 5 | 4/5 | 5/5 | 0 | 80,020 | $0.06 | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 83,547 | $0.04 | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 2/3 | 3/3 | 0 | 88,966 | $0.05 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | **93.3%** | 80.0% | 100.0% | 0.1 | 3 | 0/3 | 3/3 | 0 | 21,369 | no published rate | `d17f055` |
| `deepseek-v4-1-flash` | **80.0%** | 80.0% | 80.0% | 0.0 | 1¹ | 0/1 | 1/1 | 0 | 53,748 | $0.0090 | `7f45d90` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **80.0%** | 80.0% | 80.0% | 0.0 | 3 | 0/3 | 3/3 | 0 | 52,867 | $0.01 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 46,279 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 30,757 | $0.0074 | `3df6d83` |

## component/radio-group (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 68,076 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 108,957 | $0.03 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 51,445 | $0.01 | `3df6d83` |

## component/select (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 119,182 | $0.03 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 77,732 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 32,418 | $0.0077 | `3df6d83` |

## component/select-rich (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 71,668 | $0.03 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 138,319 | $0.07 | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 147,298 | $0.03 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 86,778 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 79,454 | $0.02 | `3df6d83` |

## component/steps (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 94,184 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 57,390 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 39,474 | $0.0094 | `3df6d83` |

## component/switch (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 52,817 | $0.01 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 2¹ | 2/2 | 2/2 | 1 | 63,438 | $0.0098 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 45,720 | $0.01 | `3df6d83` |

## component/tabs (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 50,882 | $0.02 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 74,873 | $0.04 | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 60,873 | $0.01 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 2¹ | 2/2 | 2/2 | 1 | 70,484 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 47,073 | $0.01 | `3df6d83` |

## component/textarea (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 65,550 | $0.03 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 87,945 | $0.05 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **93.3%** | 80.0% | 100.0% | 0.1 | 3 | 2/3 | 3/3 | 0 | 87,292 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 63,566 | $0.01 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 51,308 | $0.01 | `3df6d83` |

## component/tooltip (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 101,550 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 1¹ | 1/1 | 1/1 | 2 | 29,516 | $0.0023 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 44,822 | $0.01 | `3df6d83` |

## field/iban-field (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 58,145 | $0.01 | `3df6d83` |

## form/iban-in-form (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 80,401 | $0.04 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 83,122 | $0.04 | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 126,820 | $0.06 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | **97.0%** | 90.9% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 100,501 | $0.05 | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 96,163 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 194,609 | $0.04 | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 83,674 | $0.02 | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 138,730 | $0.03 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 93,782 | $0.02 | `451cadf` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 106,622 | $0.02 | `9d07772` |

## integration/mortgage-calculator (integration)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |

## integration/native-form-to-lion-form (integration)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 164,727 | $0.04 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 121,338 | $0.03 | `3f8ac1e` |
| `deepseek-v4-flash` † | **71.4%** | 71.4% | 71.4% | 0.0 | 3 | — | 3/3 | 0 | 181,768 | $0.04 | `3df6d83` |

## repair/iban-field (repair)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 57,088 | $0.03 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 78,633 | $0.04 | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | **96.7%** | 90.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 136,114 | $0.07 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 118,948 | $0.06 | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 231,179 | $0.05 | `cfa84f5` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 141,057 | $0.03 | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **99.5%** | 98.5% | 100.0% | 0.0 | 3 | 3/3 | 3/3 | 0 | 157,597 | $0.04 | `3f8ac1e` |
| `deepseek-v4-flash` † | **92.8%** | 92.8% | 92.8% | 0.0 | 3 | 3/3 | 3/3 | 0 | 135,732 | $0.03 | `3df6d83` |

## system/core (system)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 324,804 | $0.08 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 101,397 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 96,593 | $0.02 | `3df6d83` |

## system/form (system)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 119,346 | $0.06 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | **92.6%** | 88.9% | 100.0% | 0.1 | 3 | — | 3/3 | 0 | 53,960 | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 111,479 | $0.05 | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | **66.7%** | 0.0% | 100.0% | 0.5 | 3 | — | 3/3 | 0 | 141,856 | $0.07 | `578381a` |
| `deepseek-v4-1-flash` | **95.2%** | 85.7% | 100.0% | 0.1 | 3 | — | 3/3 | 0 | 162,371 | $0.08 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | **95.2%** | 85.7% | 100.0% | 0.1 | 3 | — | 3/3 | 0 | 63,562 | no published rate | `d17f055` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 1¹ | — | 1/1 | 0 | 234,631 | $0.04 | `7f45d90` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 236,392 | $0.06 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 259,030 | $0.06 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 220,707 | $0.05 | `166718c` |
| `deepseek-v4-flash` † | **33.3%** | 0.0% | 100.0% | 0.5 | 3 | — | 3/3 | 0 | 147,312 | $0.03 | `3df6d83` |

## system/icon (system)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 82,673 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 68,568 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 32,003 | $0.0078 | `3df6d83` |

## system/localize (system)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 73,224 | $0.02 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 74,789 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 55,027 | $0.01 | `3df6d83` |

## system/overlays (system)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 170,277 | $0.08 | `ea05f86` |
| `deepseek-v4-1-flash` | **88.9%** | 88.9% | 88.9% | 0.0 | 3 | — | 3/3 | 0 | 171,128 | $0.08 | `45a6365` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | **85.7%** | 85.7% | 85.7% | 0.0 | 3 | — | 3/3 | 0 | 107,752 | $0.05 | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `f50d5ca` |
| `deepseek-v4-flash` † | **85.7%** | 85.7% | 85.7% | 0.0 | 3 | — | 3/3 | 0 | 129,311 | $0.03 | `cfa84f5` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `1b90deb` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `5e6fda9` |
| `deepseek-v4-flash` † | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `3a54364` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 94,007 | $0.02 | `3f8ac1e` |
| `deepseek-v4-flash` † | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 64,491 | $0.01 | `3df6d83` |

## use-case/combobox--narrow-a-long-list-by-typing (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 118,988 | $0.06 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 1¹ | — | 1/1 | 0 | 125,625 | $0.02 | `f50d5ca` |

## use-case/combobox--suggest-while-you-type (component)

| Model | Mean | Min | Max | sd | n | Behaviour | Attempts | Redo | Tokens/run | Cost | Rev |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 3 | — | 3/3 | 0 | 119,797 | $0.06 | `ea05f86` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `45a6365` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `ca785a4` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `709dd6c` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `578381a` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `e4bdf4f` |
| `anthropic-claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `d17f055` |
| `claude-haiku-4-5` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | no published rate | `7f45d90` |
| `deepseek-v4-1-flash` | n/a | n/a | n/a | n/a | 0 (n/a) | — | n/a | n/a | n/a | n/a — recorded before the token split | `7f45d90` |
| `deepseek-v4-1-flash` | **100.0%** | 100.0% | 100.0% | 0.0 | 1¹ | — | 1/1 | 0 | 81,531 | $0.01 | `f50d5ca` |

¹ fewer than 3 samples: indicative only.

² the mean covers only the runs that modified the deliverable — see Attempts.

A row also prints `n/a` when no run modified the deliverable: an untouched file is *not attempted*, which says nothing about the skill and must not read as a score of zero.

A `n/a` row means every run had to be redone because the endpoint failed — not a score of zero. "Attempts" is how many runs actually modified the deliverable; a run that never wrote anything is recorded as *not attempted* rather than as a wrong answer.

† a withdrawn model id (`retired` on its rate): its rows are history and are excluded from the "Live picture" above, so a retired model can never be counted beside a current measurement. The rows stay listed so a past measurement is not lost.

## Rates used for the cost column

USD per 1M tokens, as read from the sources below. Input and output are priced
separately; cached input is not discounted here, so a published cost is an upper bound.

| Model | Input /1M | Output /1M | Source | Confidence | Read |
| --- | --- | --- | --- | --- | --- |
| `anthropic-claude-haiku-4-5` | — | — | no published rate found | — | — |
| `claude-haiku-4-5` | — | — | no published rate found | — | — |
| `deepseek-v4-1-flash` | $0.15 | $0.6 | <https://llmgateway.io/providers/runware> | aggregator | 2026-10-12 |
| `deepseek-v4-flash` † | $0.076 | $0.153 | <https://llmgateway.io/providers/runware> | aggregator | 2026-10-12 |

- `deepseek-v4-1-flash`: runware publishes no schema for this slug; the input rate matches runware.ai/pricing
- `deepseek-v4-flash`: runware publishes no schema for this slug; deepseek retire this id and serve it at the V4.1 Flash price
