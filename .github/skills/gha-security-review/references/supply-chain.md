# Supply Chain: Third-Party Actions

## Overview

GitHub Actions workflows depend on third-party actions referenced by `uses:`. If these actions are not pinned to immutable references (full commit SHAs), attackers can compromise them via tag mutation, account takeover, or fork-and-replace attacks.

---

## Pinning: Tags vs. SHAs

### Vulnerable: Tag References

```yaml
# VULNERABLE: Tag can be moved to point to malicious commit
- uses: actions/checkout@v4 # Tag — mutable
- uses: actions/checkout@main # Branch — mutable
- uses: actions/checkout@latest # Tag — mutable
- uses: some-org/some-action@v1 # Tag — mutable
```

Tags are **mutable Git references**. The maintainer (or attacker with write access) can delete and recreate a tag pointing to a different commit. When the tag is updated, every workflow using that tag runs the new code.

### Safe: SHA Pinning

```yaml
# SAFE: Commit SHA is immutable
- uses: actions/checkout@8e5e7e5ab8b370d6c329ec480221332ada57f0ab # v4.1.7
- uses: actions/setup-node@1e60f620b9541d16bece96c5465dc8ee9832be0b # v4.0.3
```

SHAs are **immutable** — once a commit exists, its SHA cannot change. Pin to the full 40-character SHA and add a comment with the version for readability.

---

## Attack Vectors

### Tag Mutation Attack

1. Attacker compromises a popular action's repository (phishing, leaked credentials, insider)
2. Deletes the `v1` tag
3. Creates a new `v1` tag pointing to a malicious commit
4. Every workflow using `@v1` now runs the attacker's code

This is not theoretical — it's the primary supply chain risk for GitHub Actions.

### Account Takeover / Org Compromise

If an action author's GitHub account is compromised:

- All actions under that account can be backdoored
- Version tags can be silently updated
- Users won't notice unless they're pinned to SHAs

### Fork-and-Replace

1. Original action author deletes their repository
2. Attacker creates a fork with the same `owner/repo` name
3. Existing workflows that reference `owner/repo@tag` now pull from the attacker's fork

### Actions That curl | bash at Runtime

Some actions download and execute external scripts at runtime:

```yaml
# Action's action.yml — RISKY
runs:
  using: composite
  steps:
    - run: curl -sSfL https://example.com/install.sh | bash
      shell: bash
```

Even if you pin the action to a SHA, the external URL can change. The action itself is immutable, but its runtime dependencies are not.

---

## Detection Patterns

```bash
# Find all action references
grep -rn "uses:" .github/workflows/ | grep -v "#"

# Find unpinned actions (tags, branches)
grep -rn "uses:" .github/workflows/ | grep -v "@[0-9a-f]\{40\}" | grep -v "uses: \.\/"

# Find actions pinned to branch names
grep -rn "uses:" .github/workflows/ | grep -E "@(main|master|develop|latest)"

# Find actions from less-known orgs (not actions/ or github/)
grep -rn "uses:" .github/workflows/ | grep -v "actions/\|github/\|\./"

# Check if any actions curl at runtime
# (Requires reading the action's source — note this for manual review)
```

---

## Risk Assessment by Action Source

| Source                                                  | Risk     | Action                                                  |
| ------------------------------------------------------- | -------- | ------------------------------------------------------- |
| `actions/*` (GitHub official)                           | Low      | Pin to SHA (defense in depth)                           |
| `github/*` (GitHub org)                                 | Low      | Pin to SHA                                              |
| Major orgs (aws-actions, google-github-actions, docker) | Medium   | Pin to SHA                                              |
| Popular community actions (1k+ stars)                   | Medium   | Pin to SHA, review source                               |
| Less-known actions (under 100 stars)                    | High     | Pin to SHA, review source carefully, consider vendoring |
| Unknown / single-maintainer                             | Critical | Vendor locally or replace with inline `run:`            |

---

## The Fix: SHA Pinning with Version Comments

```yaml
steps:
  # Pin to SHA, comment with version for readability
  - uses: actions/checkout@8e5e7e5ab8b370d6c329ec480221332ada57f0ab # v4.1.7
  - uses: actions/setup-node@1e60f620b9541d16bece96c5465dc8ee9832be0b # v4.0.3
  - uses: actions/cache@0c45773b623bea8c8e75f6c82b208c3cf94ea4f9 # v4.0.2
```

### Automated Pinning

Tools that automatically pin and update action SHAs:

- **Dependabot** — GitHub native, updates action SHAs
- **Renovate** — Can pin and update actions
- **StepSecurity Secure Workflows** — Pins all actions to SHAs

### Vendoring Critical Actions

For high-security workflows, vendor the action locally:

```yaml
# Instead of: uses: some-org/critical-action@v1
# Copy the action into your repo:
- uses: ./.github/actions/critical-action
```

---

## Severity Guidelines

| Pattern                                                        | Severity     | Rationale                                                    |
| -------------------------------------------------------------- | ------------ | ------------------------------------------------------------ |
| Unpinned action from unknown org used in `pull_request_target` | **Critical** | Attacker could backdoor the action AND access secrets        |
| Unpinned action from known org in sensitive workflow           | **High**     | Tag mutation risk with secret exposure                       |
| Unpinned action from GitHub official (`actions/*`)             | **Medium**   | Low risk of compromise, but defense in depth                 |
| Action that curls external scripts at runtime                  | **High**     | Even SHA-pinned actions can be compromised via external deps |
| Local action (`./.github/actions/`)                            | **Low**      | Controlled by repo, only risky in pwn request context        |

---

## Exploitation Scenario Template

```
ATTACK: Supply Chain via [unpinned action / tag mutation / curl|bash]
ENTRY: Attacker compromises [action repo / account / external URL]
PAYLOAD: Malicious code in [action.yml / downloaded script]
TRIGGER: Workflow [file:line] uses [action@tag] without SHA pin
EXECUTION: Modified action runs with workflow permissions
IMPACT: [RCE with workflow permissions, secret theft, etc.]
```

---

## References

- [GitHub Docs: Security hardening — Using third-party actions](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions#using-third-party-actions)
- [GitHub Blog: Four tips to keep your GitHub Actions workflows secure](https://github.blog/security/supply-chain-security/four-tips-to-keep-your-github-actions-workflows-secure/)
