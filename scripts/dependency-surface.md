# Dependency surface

Why `npm run lint:dependency-surface` weighs declared dependencies the way it does, and where those
criteria come from. Every number quoted here was read out of the primary source (the paper's own text,
the tool's own docs) rather than from a summary of it.

## The order the check uses, highest first

### 1. Packages that execute code at install time

Installing a package runs its lifecycle scripts with the installing user's permissions, before a single
line of it is reviewed. That is the best-evidenced vector there is:

- The review of 174 malicious packages in _Backstabber's Knife Collection_ concludes that "the poor
  handling of arbitrary code during install yields the most used infection vector. It is apparent that
  most malicious packages (56%) start their routines on installation."
- A 2026 benchmark study of malicious-package detectors is blunter: "Among 6,420 malicious packages,
  4,636 (72.21%) exploit installation scripts as attack vectors… because npm lifecycle hooks guarantee
  execution without sandboxing", and 21.2% of that set put the whole attack in `package.json` itself,
  where there is no obfuscated code for a static tool to flag.
- OWASP's npm cheat sheet makes it the second control after the lockfile: "Minimize attack surfaces by
  ignoring run-scripts", with an allowlist for the scripts a project does need.
- The classic case is already older than most of the ecosystem: `eslint-scope` "deployed its payload at
  installation time through an automatically executed postinstallation script" (USENIX Security 2019).

So the check reports, per declaration, the install-script packages its closure drags in — with a much
stronger signal than any count. It deliberately reports **statically**: a package with an `os`/`cpu`
restriction (`fsevents`, os: darwin) does not run its install script on a Linux or Windows install, and
reading that from the lock instead of from the machine keeps the output and the allowlist identical
between a developer's laptop and CI.

### 2. Two generations of one package inside one declaration

This is not a risk metric in itself; it is the _accidental_ kind. A declared range older than the copy
the rest of the tree resolves makes npm nest an entire second stack under one dependency — the repo has
lived through it with `@web/test-runner-commands` (^0.6.1 against the root's ^0.9.0), where the nested
0.6.6 stack carried `ip@1.1.9` and its high advisory. That is work you did not choose and would not
have accepted, so it is worth a warning even though nothing about the count is dangerous.

Generation means the major, or the minor for a 0.x release, because semver treats the minor as breaking
below 1.0.

### 3. Depth of the chain nobody chose

"Installing an average npm package introduces an implicit trust on 79 third-party packages and 39
maintainers, creating a surprisingly large attack surface" (USENIX Security 2019) — and the same study
concludes npm "suffers from single points of failure". Depth is how many of those unvetted packages sit
between you and something you never named. Measured across 10 ecosystems, npm's mean attack surface is
83.7 packages against a maximum of 785, and the study reads that as meaning "npm's extreme cases are
outliers" rather than a typical shape — so "deep" is a per-declaration property worth naming, not a
stable property of the ecosystem.

### 4. The count of packages — lowest weight, on purpose

Count is a weak proxy for risk, and the literature says so from more than one direction:

- Software reuse measured against vulnerability density shows "a weak-to-moderate correlation between a
  higher reuse ratio and a lower density of vulnerabilities", which the authors summarise as reuse being
  "neither a frightening werewolf introducing an excessive number of vulnerabilities nor a silver
  bullet" (ICSR 2019).
- Of 49 projects with production dependencies, "projects with production dependencies have a total of
  53,421 dependencies, of which only 497 [are] production" — under 1%. The installed tree is mostly
  build and test machinery, and counting it as exposure overstates the risk (ASE 2022).
- None of the risk-scoring tools below uses transitive count as its headline metric; they score
  behaviour (install scripts, network/filesystem access, ownership stability), known vulnerabilities,
  and maintainer/staleness signals.

So the 20-package budget here is an arbitrary budget, stated as arbitrary, that only ever reports at
`low` and never escalates a declaration by itself. Where a count _is_ evidence — a closure that carries
two generations of one package — the reason text says the count is a nesting accident rather than a
choice.

## What this check does not measure

- **Solo maintainers, staleness, deprecations.** Those need registry metadata (`maintainers`, publish
  times) that the lock does not carry. The evidence for maintainer concentration is strong — the 2019
  study could halve account-takeover risk by vetting ~140 maintainers, `event-stream` and `left-pad`
  were single-maintainer failures, and the xz backdoor was social engineering of a co-maintainer — so
  this is the next mode to add, with a cache, not a claim this check already covers.
- **Known vulnerabilities.** `npm audit`, OSV-Scanner and Dependabot already answer that; duplicating
  them here would be a second source of truth.

## Tools that score the same things

| Tool                                                                                                                     | What it measures                                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [OpenSSF Scorecard](https://github.com/ossf/scorecard/blob/main/docs/checks.md)                                          | ~18 heuristic checks per repository (Maintained, Pinned-Dependencies, Vulnerabilities, Code-Review…), risk-weighted into a 0-10 score. No check counts transitive dependencies; `Maintained` treats a single contributor as a negative signal ("try to recruit more maintainers"). |
| [Socket](https://docs.socket.dev/docs/socket-for-github)                                                                 | Static behavioural analysis of packages and their dependencies: install scripts, network/filesystem/shell access, unstable or new ownership, known malware, typosquats.                                                                                                            |
| [Snyk Risk Score](https://docs.snyk.io/manage-risk/prioritize-issues-for-fixing/risk-score)                              | Impact × likelihood of exploitability per issue, rather than any package count.                                                                                                                                                                                                    |
| [deps.dev](https://docs.deps.dev/api/v3alpha/) (Google Open Source Insights)                                             | Dependency graph per package, licenses, advisories, and OpenSSF Scorecard findings, as a free API.                                                                                                                                                                                 |
| [OSV-Scanner](https://github.com/google/osv-scanner)                                                                     | Matches a project's dependencies against the OSV.dev vulnerability database.                                                                                                                                                                                                       |
| [npm audit](https://docs.npmjs.com/auditing-package-dependencies-for-security-vulnerabilities/)                          | Vulnerability assessment of the installed tree, built into npm.                                                                                                                                                                                                                    |
| [GitHub dependency graph](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-graph-data) | Direct vs "indirect dependencies… also called transitive dependencies", which is the mechanism behind packages nobody chose.                                                                                                                                                       |

## What the standards require instead

- The SBOM minimum elements from Executive Order 14028 require a **Dependency Relationship** field —
  "Characterizing the relationship that an upstream component X is included in software Y", which
  "enables the representation of transitivity" — an inventory, not a count.
- [SLSA's Dependency Track](https://slsa.dev/spec/draft/dependency-track) defines per-ingestion
  provenance with an inventory level (`Dep L1: Inventoried`); it never mentions a number of packages.
- The OpenSSF [S2C2F framework](https://github.com/ossf/s2c2f/blob/main/specification/framework.md)
  requires Ingest, Scan, Inventory, Fix and Audit per artifact.

The common requirement is being able to answer "am I affected by X?" for every component — which is why
the accepted declarations here live in an explicit, reviewable `dependencySurface.allow` list with a
reason each, instead of a threshold nobody would meet.

## Sources

- Ohm, Plate, Sykosch, Meier. _Backstabber's Knife Collection: A Review of Open Source Software Supply
  Chain Attacks_, DIMVA 2020. <https://arxiv.org/abs/2005.09535>
- _How Effective Are NPM Malicious Package Detectors? A Large-Scale Empirical Study_, 2026.
  <https://arxiv.org/abs/2603.27549>
- OWASP. _NPM Security Cheat Sheet_.
  <https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html>
- Zimmermann, Staicu, Tenny, Pradel. _Small World with High Risks: A Study of Security Threats in the
  npm Ecosystem_, USENIX Security 2019. <https://www.usenix.org/system/files/sec19-zimmermann.pdf>
- Gkortzis, Feitosa, Spinellis. _A double-edged sword? Software reuse and potential security
  vulnerabilities_, ICSR 2019. <https://antonisgkortzis.github.io/files/GFS_ICSR_19.pdf>
- Latendresse, Mujahid, Costa, Shihab. _Not All Dependencies are Equal: An Empirical Study on Production
  Dependencies in NPM_, ASE 2022. <https://arxiv.org/abs/2207.14711>
- _How Deep Does Your Dependency Tree Go? An Empirical Study of Dependency Amplification Across 10
  Package Ecosystems_, 2025. <https://arxiv.org/abs/2512.14739>
- NTIA. _The Minimum Elements For a Software Bill of Materials (SBOM)_, 2021.
  <https://www.ntia.gov/sites/default/files/publications/sbom_minimum_elements_report_0.pdf>
