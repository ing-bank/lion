# Changelog `migrate-cli`
All notable changes to this project will be documented in this file. 

## 0.1.0 - 2024-10-29

### Initial commit

- feat: added `cli` to run migrations
- feat: export `MigrateCli`: class using `Commander` to provide a intuitive and adaptable CLI
- feat: export `UpgradeCommandBase`: extendable command implementing upgrade behaviour
- feat: export `executeJsCodeShiftTransforms`: function that runs `jscodeshift` on a codebase
- test: added unit tests for classes
- test: WIP e2e testing of CLI
- test: WIP unit tests for `executeJsCodeShiftTransforms`
- chore: added README
