---
title: The docs site moves to the root and rocket retires
published: true
description: Astro now owns the site root while the legacy rocket output lives under /prev - and the portal got the fixes that came with the move.
date: 2026-10-20
tags: [documentation, portal, javascript]
cover_image: /blog/images/portal-at-the-root.png
cover_credits: "plate, scene and mark - Lion"
eleventyNavigation:
  key: The docs site moves to the root and rocket retires
  title: The docs site moves to the root and rocket retires
---

For a long time the Lion documentation had two front doors, with the older one in front. The rocket site answered at `/`, and the Astro portal we have been building lived beside it under `/next`. That was the right arrangement while the portal was a candidate: you can compare the two, and nobody's bookmarks break. It stops being right the moment the portal is simply the site.

So we swapped them. Astro now builds the root, and the full rocket output - every page of the old documentation, unchanged - is published under `/prev`. The old site is a frozen archive at a URL that says so.

## What the swap actually is

Config, in both directions:

```
astro.config.mjs    base: '/'          outDir: '_site'
rocket.config.mjs   pathPrefix: '/prev/'   outputDir: '_site/prev'
package.json        build = build:astro -> build:rocket -> build:update-links
```

The order matters and is now explicit. Astro writes `_site`, rocket writes `_site/prev` inside it, and a third step rewrites root-relative links in both outputs so they survive the prefixes they are published under. The old build ended with a `mv` of Astro's `dist` into `_site/next`; that step is gone, because the output is already where it belongs.

## The output directory is load bearing

`outputDir: '_site/prev'` looks like tidying. It is an interlock.

`RocketCli` deletes exactly its `outputDir` before it writes - not "cleans the site directory", but removes the path you configured. Rocket's default is `cwd/_site`. With Astro now emitting into `_site`, a rocket build left on its default would have deleted the portal it was supposed to sit next to, then written the legacy site in its place, and exited successfully. The build would have looked fine and the deploy would have shipped one site instead of two.

This is the kind of thing you only find by reading the tool rather than running it, because running it produces a green build and a wrong tree. Pointing rocket at `_site/prev` makes its destructive step land on its own output.

## Joins that break at exactly one of the two bases

The portal is published at two prefixes: the site root in production, and a per-branch preview path when we want to look at a change before it ships. Astro hands you `import.meta.env.BASE_URL` as given, which means `/` at the root and `/next-preview/<branch>` - no trailing slash - for a preview.

That asymmetry is a trap, because the two obvious join idioms are each correct for exactly one of them:

- `` `${BASE_URL}x` `` is right at the root (`/x`) and wrong for a preview (`/next-preview/<branch>x`).
- `` `${BASE_URL}/x` `` is right for a preview and, at the root, emits `//x` - a protocol-relative URL pointing at a host called `x`.

We hit both while rebasing this work. Every join is now `` `${base}/x` `` with one `const base = import.meta.env.BASE_URL.replace(/\/$/, '')` per file, an idiom the docs detail layout already used. We checked the built output at both bases: no protocol-relative `href` anywhere at the root, and every link inside the preview prefix.

## Links that pointed at the building we moved out of

Three links in the portal's own chrome were rocket assets all along: the footer's Slack link and the two PDF links in the docs. They resolved because the rocket site owned the root. Once Astro owns the site and rocket moves to `/prev`, they break - so they now point at `/prev` explicitly, and the link rewriter knows which tree it is walking: Astro's output gets the build base, rocket's output gets `/prev`.

## The mobile menu, measured

While the move was open we also fixed the mobile fly-out, which was slightly too narrow for the labels it had to hold. It goes from `min(20rem, 88vw)` to `min(22rem, 90vw)`, measured with Playwright against the built site at a 390px viewport. The exit stopped animating at the same time: the panel used to slide back out over its entry duration, and collapsing a level re-read that duration from a rule matching both states, so going back was slower than going in; now only entry animates.

## Retiring the build

The rocket site has not been buildable from a clean install for a while, and the reasons are dependency-shaped: a package that the config imports is declared in neither the manifest nor the lock, and the pinned release of the launch preset imports a symbol the pinned CLI no longer exports. The failure is at config load, which means it is not a build you can patch - it is a build that never starts.

We tried the obvious thing first, pinning the CLI back to the line the config was written against. That broke CI: re-resolving the lock dropped a nested `lit-element` entry that the UI package's type gate depends on, and the install is arranged so that exactly one copy of `lit` is hoisted. With that tree the whole pipeline did work - but only that tree, and only by hand.

So the cheaper path won: retire the rocket *build* instead of moving it. The last rocket tree is published as-is under `/prev` and frozen there. `npm run build:portal` is Astro plus the link rewrite, `predeploy` runs it, and the `@rocket/*` toolchain leaves the manifest and the lock.

The deploy had one more trap. `gh-pages` deletes everything in the branch that is not in the directory you hand it, so the first Astro-only deploy would have silently removed `/prev` and the `/next` redirect along with it. It now runs with `--add`, so publishing the portal adds to what is there instead of replacing the site with the part of it we just built.

## The fixes that came with the move

Several defects were only visible once the portal was the site rather than a preview:

- **`/components` names its cards again.** When docs titles stopped repeating their parent, every card in the grid read "Overview". The grid now builds each title from the folder name through the same `humanise` helper the docs breadcrumb uses, so `checkbox-group` is "Checkbox Group" and the breadcrumb is untouched.
- **One accent for both themes.** Light mode painted its accent brown while dark used the yellow, so the same page had two identities depending on a preference. Every accent role now resolves to the same value, and where the yellow cannot be ink the element gets an outline or an almost-black chip instead. The choice is read by a blocking inline script before first paint and written to `data-theme`, so navigating between pages does not repaint the wrong canvas.
- **The mobile menu reaches every page.** It used to open one panel per level; now levels unfold in place. The interesting part was that a top-level row's transformation lived in a client-only template processor, so the server and the client rendered the row differently, lit replaced the parts on hydration, and the toggle ended up bound to elements no longer in the document.
- **One copy of `lit`.** The install carried several; `@lit-labs/ssr-client`'s hydration support patches exactly one `LitElement`, and when it had patched a copy the element did not extend, the island rendered a second copy of its template beside the server-rendered shadow root - a duplicated table of contents on some page loads.
- **Light mode finished.** `/search` never linked the theme stylesheet, so it had no `color-scheme` at all and every `light-dark()` pair resolved light. Code token colours were still hard-coded for the dark palette, sidebar labels and the docs back-link along with them. The worst was the search modal: a hard-coded dark dialog with a near-black title, invisible in light mode - and invisible to a static crawl, because the dialog is closed. The switch also gained an always-visible **Auto** as a third option, instead of two radios plus a reset that only appeared once you had pinned something.

## What is still open

A crawl of the served root finds broken targets, and they are all pre-existing markdown-relative links in the docs themselves - document rot the move neither created nor fixes. Shiki emits a second, lowercase variant of one token that our overrides do not match, so one code block renders black-on-black in dark mode. `/simulator` still does not link the theme stylesheet, because it declares its own light theme and pulls stylesheets from query parameters.

And `npm run build:rocket` still fails, on purpose. `/prev` is an archive, not a build target.
