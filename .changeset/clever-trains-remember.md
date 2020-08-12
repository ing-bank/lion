---
'providence-analytics': minor
---

Allowlist modes

#### Features

- Allowlist mode: autodetects whether analyzed repository is a "git" or "npm" (published artifact) repository.
  Via the cli `--allowlist-mode 'npm|git|all'` and `--allowlist-mode-reference 'npm|git|all'` can be
  configured to override the autodetected mode.

#### Bugfixes

- Clean output extend-docs: strings like '[no-dependency]' will not end up in aggregated result
