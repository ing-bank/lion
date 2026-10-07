---
'providence-analytics': minor
---

`providence-analytics` now ships TypeScript declarations, so the concepts and output structures
of the package are typed instead of `any`.

Every public entrypoint carries types:

| entrypoint | types |
| --- | --- |
| `providence-analytics` | the services: `providence`, `QueryService`, `LogService`, `InputDataService`, `AstService`, `ReportService` |
| `providence-analytics/types.js` | the model types: `AnalyzerQueryResult`, `QueryOutput`, `FindAnalyzerOutputFile`, `PathFromSystemRoot`, `GatherFilesConfig`, `AnalyzerName`, ... |
| `providence-analytics/cli.js` | the CLI module |
| `providence-analytics/utils.js` | the program utilities |
| `providence-analytics/analyzers.js` | the analyzers |

The declarations are emitted from the sources and the hand-written `types/` tree, and a consumer
that compiles them directly with `skipLibCheck: false` gets **0 errors** - the same bar the
`@lion/ui` declarations are held to.

Two declaration defects surfaced on the way and are fixed at the source rather than suppressed:
`QueryResult` is now generic over its `queryOutput` (which is what the match analyzers actually
return, so `AnalyzerQueryResult` no longer has to override an incompatible base member), and
`MemoizedFn` is declared as a callable type instead of the invalid `function` keyword, which the
emitted `memoize.d.ts` used to carry into every consumer.

Runtime behaviour is unchanged: 240 unit tests and 8 e2e tests pass as before.

The CLI no longer depends on `commander`. Its flags are parsed with the `parseArgs` helper of
`node:util`, which is what the package's own `comments.dependencies` already called for. Flag
names, short aliases, optional values, coercions and defaults are unchanged - including the
collection flags that resolve against `providence.conf.js` - and `--version`/`--help` still work.
`commander` leaves the dependency tree.
