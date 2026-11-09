---
'@lion/lockfile-interop': patch
'change-graph': patch
---

Ship the CLI bin executable (mode `100755`) in the published tarball, like the other `packages-node` CLIs.

A bin target committed as `100644` is chmodded by `npm install`/`npm ci` when npm links it into
`node_modules/.bin`. The working tree is dirty afterwards, which aborted the `git checkout
changeset-release/master` of the Release job with "Your local changes to the following files would be
overwritten by checkout" and failed the release run.
