---
'providence-analytics': minor
---

Providence update to fix some issues with target/reference and to allow filtering target project dependencies.

#### Features

- Allow specifying target project dependencies via CLI using `--target-dependencies` flag:
  When `--target-dependencies` is applied without argument, it will act as boolean and include all dependencies for all search targets (node_modules and bower_components).
  When a regex is supplied like `--target-dependencies /^my-brand-/`, it will filter all packages that comply with the regex.

#### Bugfixes

- Use the correct gatherFilesConfig for references/targets
- Provide target/reference result match
- Edit `from-import-to-export` helper function to work without filesystem lookup. This will allow to supply target/reference result matches to `match-imports` analyzer
