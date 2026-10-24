# skill-tester

Scientifically sound evaluation of your AI skills and agents.

skill-tester runs a skill or agent against a set of **small, isolated scenarios**, on **any
OpenAI-compatible model** (OpenAI, Azure OpenAI, Anthropic or Google models behind a gateway,
Ollama, llama.cpp, vLLM, ...) **or on GitHub Copilot**, and scores every run with a single
**quality score**. The provider is chosen explicitly and no model is assumed.

It closes the loop with [`recursive-skill-improver`](../../packages/ui/skills/recursive-skill-improver/SKILL.md):
each run writes a markdown **run record** that lists failing checks as evidence, ready to be
turned into the next minimal skill improvement.

## Requirements

- Node.js 22.6+ (uses native TypeScript type stripping — no build step, no `tsx`).
- One of:
  - an OpenAI-compatible chat endpoint (and an API key, if the endpoint requires one); or
  - GitHub Copilot, which additionally needs the optional
    `@github/copilot-sdk` (`npm install @github/copilot-sdk`).

## Start

```bash
cd packages-node/skill-tester

# What would run?
npm run eval:list

# Every lion-ui component + system, on any OpenAI-compatible endpoint (OpenAI shown here)
npm run eval -- --models gpt-5-mini --api-key "$OPENAI_API_KEY" --samples 3

# A local OpenAI-compatible server, one component
npm run eval -- --models my-local-model --base-url http://localhost:8080/v1 \
  --scenario button --kind component

# GitHub Copilot instead of an HTTP endpoint
npm install @github/copilot-sdk
npm run eval -- --provider copilot --models <copilot-model>
```

See [`examples/`](examples/README.md) for ready-made presets (`openai`, `runware`, `local`,
`copilot`) and a worked example of the library API.

Anything after `--` is passed to the CLI; `node src/cli.ts --help` shows every option.
`--models` (or `SKILL_TESTER_MODELS`) is required — skill-tester never picks a model for you.

## Providers

Selected explicitly with `--provider` / `SKILL_TESTER_PROVIDER`; never guessed from the model name.

| Provider  | What it talks to                                        | Needs                                     |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| `openai`  | Any OpenAI-compatible `POST {baseUrl}/chat/completions` | a base URL (has a default) and a key      |
| `copilot` | GitHub Copilot, via `@github/copilot-sdk`               | the optional SDK installed + Copilot auth |

`openai` is the default. Endpoint and credential resolution (first match wins):

| Setting             | CLI          | Environment                                                                       |
| ------------------- | ------------ | --------------------------------------------------------------------------------- |
| Provider            | `--provider` | `SKILL_TESTER_PROVIDER`                                                           |
| Base URL (`openai`) | `--base-url` | `SKILL_TESTER_BASE_URL`, then `OPENAI_BASE_URL`, then `https://api.openai.com/v1` |
| API key (`openai`)  | `--api-key`  | `SKILL_TESTER_API_KEY`, then `OPENAI_API_KEY`                                     |
| Models              | `--models`   | `SKILL_TESTER_MODELS`                                                             |

The model is passed through untouched — nothing is inferred from its name, and there is no default
model. Point `--base-url` at anything that speaks the OpenAI API: OpenAI, Azure OpenAI, a gateway
serving Anthropic/Google models, Runware, a local llama.cpp/Ollama/vLLM server, ...

GitHub Copilot is optional by design: `@github/copilot-sdk` is declared as an **optional peer
dependency**, so the `openai` path needs no Copilot install. Selecting `--provider copilot` without
it fails with an actionable message naming the install command.

## How a run works

1. A sandbox (a real temp directory) is created from the scenario's starting files plus the
   skill/agent under test.
2. The skill (`SKILL.md` body) or agent (markdown body) becomes the **system prompt**; a skill's
   whole directory is also copied into the sandbox under `.skill/<name>/` so its `references/`
   links resolve.
3. Depending on the provider: **`openai`** runs an OpenAI-style tool-calling loop with sandboxed
   file tools — `read_file`, `write_file`, `edit_file`, `list_files`, `glob`, `search_files` —
   until the model stops requesting tools or hits `--max-turns`; **`copilot`** hands the same
   system prompt and sandbox (as its working directory) to a GitHub Copilot custom agent, which
   uses its own tools and loop.
4. The resulting sandbox is scored.

A failed tool call, an unknown tool, or a path escaping the sandbox is reported back to the model
as an error (and counted as an avoidable retry), never a crash. The `copilot` provider counts
avoidable retries from its post-tool-use hook.

## Quality score

A single number that is meaningful without pretending model output matches a golden file
byte-for-byte. Each indicator contributes to a weighted average:

| Level            | Source                                                           | Weight               |
| ---------------- | ---------------------------------------------------------------- | -------------------- |
| Exact match      | transformed file equals the expectation after trimming           | 1.0 per file         |
| Normalized match | equal once whitespace/blank lines are ignored                    | 0.95 per file        |
| Similarity       | line-level similarity (partial credit for near-correct output)   | ≤ 0.9 per file       |
| Objective check  | `contains` / `notContains` / `matches` / `notMatches` / `exists` | `weight` (default 1) |

The report keeps the full breakdown (`scoreScenario`), aggregates with mean/min/max/std-dev, and
writes both a JSON sidecar and a markdown run record.

## Scenarios

Scenarios are small and isolated on purpose: a failing run points at **one component or system**,
not a whole application.

- **Generated** — one per `@lion/ui` component (from `packages/ui/components/*`) and one per
  system (from `docs/fundamentals/systems/*`). Each asks for a minimal usage example in a single
  file and asserts the conventions `lion-ui` teaches:
  - import from the correct `@lion/ui/<name>.js` entrypoint;
  - never import a component from `@lion/*` directly;
  - never import core Lit utilities from bare `lit`;
  - use the component's real custom-element tag (asserted only when
    `packages/ui/custom-elements.json` confirms the tag).
- **Hand-authored** (`src/scenarios/manual.ts`) — richer tasks, including golden-file scenarios
  that exercise the exact/normalized/similarity scoring path.

Everything is data: add a scenario object to get another isolated test run. Per-component and
per-system scenarios are derived from the repository layout, so new components are covered
automatically.

## Run records and `recursive-skill-improver`

Every run writes `./.tmp/skill-tester/reports/<timestamp>-<skill>.md` (and `.json`). The markdown
record uses the shape of `recursive-skill-improver`'s `references/run-record.md`:

- run identity (model, samples, revision, threshold);
- quality score per model and per scenario;
- measured milestones (turns, tool calls, avoidable retries, turn-cap hits, tokens);
- **evidence** — one row per failed check or golden mismatch, classified;
- the convergence checklist.

That record is the hand-off: point `recursive-skill-improver` at a skill, run a fixed set of
scenarios repeatedly, and turn the failing-check evidence into minimal, correctly-placed edits.

## Testing

```bash
npm test          # node --test "test-node/*.test.ts"
```

The suite includes an end-to-end run against a local mock OpenAI-compatible server
(`test-node/mockOpenAi.ts`) that exercises the real loop — tool calling, sandbox file writes,
scoring, and failure reporting — without network access or credentials.

## Roadmap

- **Measure token usage as a first-class metric.** Run records already capture `Total tokens` per
  run; what is missing is aggregation and reporting per scenario and per model, so a skill change
  can be judged on cost as well as on score. (Requested but deliberately deferred — core scoring
  correctness comes first.)

## Layout

```text
src/
  cli.ts                     CLI entry point
  index.ts                   public API
  config.ts                  provider + endpoint/credential resolution
  skillTester.ts             orchestrator: sandboxes, runs, aggregation, reporting
  llm/openaiClient.ts        dependency-free OpenAI-compatible chat client
  llm/tools.ts               sandboxed file tools + JSON schemas
  llm/agentRunner.ts         OpenAI-compatible tool-calling agent loop
  llm/copilotRunner.ts       GitHub Copilot provider (lazy, optional dependency)
  scoring/qualityScore.ts    exact / normalized / similarity / check scoring
  scenarios/                 scenario model, lion-ui generators, manual scenarios
  report/runRecord.ts        markdown run record + JSON sidecar
  createProjectSandbox.ts    virtual file system -> real temp directory
  parseFrontmatter.ts        SKILL.md / agent frontmatter parsing
  fsGlob.ts                  glob helper
mock-repo/                   a mock Copilot agent + docs (kept for parity/testing)
test-node/                   node:test suite incl. mock OpenAI server
```
