# Visual regression tests

This workflow compares visual test screenshots from the current branch with a baseline generated from a target branch. It creates an isolated worktree for the target, stores baselines there, and prepares any changed screenshots for review.

## Usage

1. Generate the baseline with `npm run screenshots-comparison:update-baseline`.
2. Generate and prepare visual diffs with `npm run screenshots-comparison:generate-screenshots-diff`.

Both commands target `master` by default. Pass `--target-branch=<branch>` directly to the underlying script to use another branch.

## Visual tests

The visual runner discovers `*.visual.test.js` files beneath `packages`. Add visual tests alongside the component tests they cover.

## Generated output

The target worktree is created under `.tmp/worktree/<target>-origin`. Baseline screenshots are stored in `.tmp/screenshots` within that worktree. When visual differences are found, review-ready images are written to `screenshots-for-review` and committed on a new local branch.
