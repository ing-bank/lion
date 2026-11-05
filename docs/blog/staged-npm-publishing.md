---
title: Adding a human approval step to Lion's npm releases
published: false
description: How Lion keeps its Changesets release flow while preparing npm releases for review before they become available to users.
date: 2026-10-20
tags: [npm, releases, changesets]
eleventyNavigation:
  key: Adding a human approval step to Lion's npm releases
  title: Adding a human approval step to Lion's npm releases
---

Publishing a new version of a library is a consequential step: as soon as it is
published, consumers can install it. We wanted a chance to inspect a release
before that happens, without replacing the release workflow that Lion
contributors already use.

This post describes the staged-publishing implementation prepared for Lion.
It will take effect after the workflow change is merged and the required npm
package permissions are in place.

## Keep the release process contributors know

Lion uses [Changesets](https://github.com/changesets/changesets) to collect
release notes and version bumps. Contributors add changesets with their
changes; Changesets then creates or updates a **Version Packages** pull
request. That pull request is still the point where maintainers review the
combined versions and changelogs.

We kept this flow. The release workflow continues to use
[`changesets/action`](https://github.com/changesets/action), and the custom
release command replaces only the final publishing behavior. When the
Version Packages pull request is merged, the workflow stages the resulting
package versions instead of making them immediately available.

## Stage only the versions in this release

npm's [`npm stage`](https://docs.npmjs.com/cli/v11/commands/npm-stage) command
does not automatically understand a monorepo's workspace release plan. To
avoid treating every package in Lion as a release candidate, our script
compares package manifests in the current push with their previous versions.
It selects only public workspace packages whose version changed in that push.
An old version elsewhere in the repository will not be staged just because it
exists.

The script then handles one package directory at a time. For each selected
version, it checks the public registry first and asks npm for existing stages.
Already-published versions are skipped, and an exact version that is already
staged with the expected tag is not staged twice. If the registry or stage
query fails, the release fails visibly rather than assuming everything is
fine. This makes a rerun after a partial failure useful: successful stages
remain untouched while the remaining packages can be retried.

Staging still runs npm's package lifecycle scripts. That matters for Lion
packages that build or prepare files as part of publishing: a review step
should not silently change what goes into the package.

## A release is not published until it is approved

After the workflow completes, maintainers review the staged package versions
on npm. They can approve a stage, which makes the version available to users,
or reject it. npm requires a maintainer's two-factor authentication for these
actions. The workflow therefore prepares the release, but does not make the
final publication decision.

This distinction also affects GitHub. The staging workflow does not create
Git tags or GitHub releases: those would suggest that the package is already
published, when it is still awaiting approval. Changesets remains responsible
for the version pull request, while npm's staged-package review is the final
gate before availability.

## Deliberate operational trade-offs

The workflow uses the existing npm credential, provided it has permission to
stage the packages and inspect their stages. A narrower stage-only token can
be considered separately. npm's short-lived trusted-publisher OIDC tokens
can stage packages, but cannot run the `npm stage list` command used for safe
recovery. We therefore do not switch to OIDC without first replacing that
recovery check with a supported, tested alternative. Token-based staging also
does not produce the provenance attestations that npm creates for trusted
publishing; provenance remains a separate rollout decision.

There is a package-by-package setup requirement on npm: trusted publishing, if
introduced later, must be configured for each package and restricted to stage
publishing rather than direct publication. Likewise, the workflow's staging
credential must have the required package-level access. These are operational
prerequisites, not changes that the workflow can make on npm's behalf.

The result is a small change at the publication boundary. Contributors keep
the Changesets workflow, builds still run through npm's lifecycle, and
maintainers get a deliberate review point before a version reaches consumers.
