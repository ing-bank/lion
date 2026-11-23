# Staged npm publishing

The Changesets action still opens and updates the **Version Packages** pull request. When that PR is merged to `master`, the release workflow considers only public workspace manifests whose version changed between the push's previous commit and `HEAD`. It stages those exact versions; it never scans every workspace version as a release candidate.

The workflow uses Node.js `24.x`, which currently bundles npm CLI `11.19.1` with `npm stage` support. Because `npm stage` is not workspace-aware, the script invokes it with one explicit package directory at a time. npm runs that package's normal publish lifecycle (`prepublishOnly`, `prepack`, `prepare`, `postpack`, `publish`, and `postpublish`). Packages are staged sequentially. The script checks the public registry for an already-published version and uses `npm stage list` to skip an exact version already staged. Registry, authentication, malformed-response, and stage failures fail the workflow; they are not treated as successful releases.

## npm credential setup

The release job currently uses the existing `NEW_NPM_TOKEN_TEST` repository Actions secret as `NODE_AUTH_TOKEN`; it can remain in place for now.

No new token is required for staged publishing if the existing token has publish access to every package in the release. npm allows `npm stage publish` with any token type. For a least-privilege setup, you can later replace it with a granular access token that has **read-write-stage-only** permission for every publishable Lion package (currently `@lion/ajax`, `@lion/ui`, `@lion/nodejs-helpers`, `singleton-manager`, `babel-plugin-extend-docs`, `providence-analytics`, `publish-docs`, `remark-extend`, and `rocket-preset-extend-lion-docs`). Configure package-level access for these packages; organization access alone does not grant package publish permission. Do not enable the 2FA bypass. Keep npm package access set to public where required by `.changeset/config.json` and package `publishConfig`.

The token needs sufficient read access for `npm stage list`, which is needed to recover safely after a partial workflow failure. npm's short-lived trusted-publisher OIDC tokens cannot run `npm stage list`; switching this workflow to OIDC without replacing that recovery check would make partial reruns unsafe.

This token-based workflow does not produce the provenance attestations that npm generates automatically for trusted-publisher OIDC publishing. If provenance becomes a release requirement, first plan a per-package OIDC rollout and a supported idempotency strategy; do not simply replace the current token.

To configure trusted publishing for a future OIDC migration, add a GitHub Actions trusted publisher separately in each package's npm settings: repository `ing-bank/lion`, workflow file `.github/workflows/release.yml`, and the matching environment if one is introduced. Grant the connection only **stage publish** permission, not direct `npm publish`. The workflow would also need `id-token: write`. Because OIDC cannot list stages, do not replace the current token with OIDC until a supported, tested way to identify already-staged versions is available.

## Reviewing a staged release

After a successful workflow, review each package and version under npm's **Staged Packages** page. A maintainer must approve with 2FA before the version becomes available to users; approval is available on npmjs.com or with `npm stage approve <stage-id>`. Reject unwanted packages with `npm stage reject <stage-id>`, also with 2FA as required by npm.

No Git tag or GitHub release is created by the staging workflow. If a stage was accepted but a later package failed, rerun the failed workflow: versions already staged with the expected tag are skipped, and remaining versions are retried. If a version is staged with a different tag, the workflow stops and reports the stage ID; reject that stage before rerunning. Inspect the original failed job if an npm lifecycle hook failed after npm accepted the stage, because npm may have staged the version before returning the hook error.

## Local tests

The package's tests run through the repository's existing Mocha-based `npm run test:node` workspace command. To run just these tests:

```sh
npm run test:node --workspace staged-publish
```
