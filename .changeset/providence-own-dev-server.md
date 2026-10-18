---
'providence-analytics': minor
---

Serve the dashboard with our own dev server, exported as `miniDevServer`, and drop `@web/dev-server`

The dashboard only used a small part of `@web/dev-server` (wds): serve static files, rewrite bare
module specifiers for the browser and run the dashboard middleware. `miniDevServer`
(`src/program/utils/mini-dev-server.js`, exported from `providence-analytics/utils.js`) does exactly
that in ~250 lines on top of node's `http`, so `@web/dev-server` and `@web/dev-server-core` are no
longer needed - together with the ~195 entry dependency tree they brought in.

`miniDevServer` is a drop-in for the wds config subset we use: `rootDir`, `appIndex`, `nodeResolve`,
`moduleDirs`, `middleware`, `open`, `port`, `hostname` (and the legacy `host` alias). `watch` is
accepted and ignored. It follows wds's shape as well: `createServer(config)`,
`startDevServer({ config })` with `start()`/`stop()`/`url`/`server`, plus `createTestServer(config)`
returning `{ host, server }`. `createDashboardServerConfig()` therefore keeps returning a wds shaped
config, and the dashboard tests use `miniDevServer.createTestServer()` instead of the wds test
helpers.

Bare specifiers are resolved with `oxc-resolver` (the same resolver the analysis uses) and rewritten
through the AST (parsed with `oxc-parser`), so specifier-like text in comments or strings is left
alone. `/node_modules/<name>/<file>` is resolved back per request, which makes hoisted, nested and
symlinked installs all work.
