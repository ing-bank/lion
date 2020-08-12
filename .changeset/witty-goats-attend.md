---
'providence-analytics': minor
---

Custom '--allowlist' takes precedence over '--allowlist-mode'

#### Features

- Custom '--allowlist' takes precedence over '--allowlist-mode' when conflicting.
  For instance, when running CLI with '--allowlist-mode git --allowlist ./dist'
  (and .gitignore contained '/dist'), './dist' will still be analyzed.

#### Patches

- Align naming conventions between CLI and InputDataService.gatherFilesFromDir
