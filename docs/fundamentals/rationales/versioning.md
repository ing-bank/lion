# Rationales >> Versioning Lion ||20

Since Lion is a monorepository where each package is published separately under the `@lion` scope, we have packages that depend on other packages.

For example, `@lion/dialog` has a dependency on `@lion/overlays`.

The way we now version those is with `^` carets, for example:

```json
{
  "dependencies": {
    "@lion/overlays": "^0.30.0"
  }
}
```

This means:

- For versions >= 1.0.0, get the latest minor of a certain major, major upgrades may contain breaking changes
- For versions < 1.0.0, get the latest patch of a certain minor, minor upgrades may contain breaking changes

See also, [Semantic Versioning](https://semver.org/).

In the past, we used to have fixed versioning, our rationale was as follows:

> Given there is a subclasser that consumes lion and publishes their own component set, each installation of a certain version of that component set must have the exact same versions of lion installed, so that the experience of the end user is consistent.

**However**, if semver is followed properly, users should never get the situation where they get diverging experiences, because that would only happen in a breaking change.
Additionally, fixing the versions led to other problems:

- Undedupable installations of the same package. If there are two installations of `@lion/ui/button` and one is installed as a dependency of another lion package, this installation will never be able to be deduped to another version, even if they.js're on the same minor. This is because the dependency is set to a fixed version, so NPM will see the two installations as incompatible and not dedupe them. For Lion, this can definitely lead to problems, especially with packages like `@lion/form-core`, `@lion/localize`, `@lion/overlays`, due to the singleton nature of some of the parts in those packages.
- Importing directly from lion as an end user when consuming a subclasser package that uses lion under the hood is dangerous. This is because you will need to always match, **exactly**, the version that is installed by the subclasser package. This means syncing your lion version with the subclasser's installed lion version every time you upgrade.
- Changesets will see (correctly) every bump in a `@lion` dependency as a semver-incompatible change for its `@lion` dependents and bump them as a result. This means a change to `@lion/core`, no matter how tiny, will bump almost every other `@lion` package "unnecessarily". This results in large changelogs that are mostly meaningless noise, hardly "human readable" which is the goal of changesets when used correctly.

Given all this, we changed our approach to versioning and went back to using `^` carets in our versions and **our new recommendation is to depend on `@lion` with `^` carets**. This should prevent majority of undedupable installation problems our users were having, allow importing from `@lion` directly, more safely, make our changelogs cleaner and reduce our publishing bloat.
