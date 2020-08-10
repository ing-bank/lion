# Project mocks

The number of project-mocks is kept to a minimum:

- one target project: "./importing-target-project"
- one reference project: "./importing-target-project/node_modules/exporting-ref-project"

Whenever new Analyzers are added, please make sure the needed ingredients for a proper
end to end test are added to one of the above projects (or both).

Be sure to update 'test-helpers/project-mocks-analyzer-output'.
This can be done by running `yarn test:node:e2e --generate-e2e-mode` once.
