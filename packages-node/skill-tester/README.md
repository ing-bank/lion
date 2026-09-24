# skill-tester

Scientifically sound evaluation of your AI skills and agents.

skill-tester runs a skill or agent against a set of **small, isolated scenarios**, on **any
OpenAI-compatible model** (OpenAI, DeepSeek, Azure OpenAI, Ollama, llama.cpp, vLLM, ...), and
scores every run with a single **quality score**. GitHub Copilot is not required.

It closes the loop with [`recursive-skill-improver`](../../packages/ui/skills/recursive-skill-improver/SKILL.md):
each run writes a markdown **run record** that lists failing checks as evidence, ready to be
turned into the next minimal skill improvement.

## Requirements

- Node.js 22.6+ (uses native TypeScript type stripping — no build step, no `tsx`).
- An OpenAI-compatible chat endpoint and an API key.

## Start

```bash
cd packages-node/skill-tester

# What would run?
npm run eval:list

# Run every lion-ui component + system scenario against DeepSeek
DEEPSEEK_API_KEY=... npm run eval -- --models deepseek-chat --samples 3

# A single component, against a local OpenAI-compatible server
npm run eval -- --models local-model --base-url http://localhost:8080/v1 \
  --api-key whatever --scenario button --kind component
```

Anything after `--` is passed to the CLI; `node src/cli.ts --help` shows every option.

## Provider configuration

The endpoint and credential are resolved **per model name**, so a run can mix providers.

| Model name    | Base URL (default)            | API key (default)  |
| ------------- | ----------------------------- | ------------------ |
| `deepseek-*`  | `https://api.deepseek.com/v1` | `DEEPSEEK_API_KEY` |
| anything else | `https://api.openai.com/v1`   | `OPENAI_API_KEY`   |

Overrides (highest precedence first): CLI flags → `SKILL_TESTER_*` → provider defaults.

| Variable                                 | Purpose                               |
| ---------------------------------------- | ------------------------------------- |
| `SKILL_TESTER_BASE_URL`                  | Base URL for every model (e.g. local) |
| `SKILL_TESTER_API_KEY`                   | API key for every model               |
| `DEEPSEEK_BASE_URL` / `DEEPSEEK_API_KEY` | DeepSeek-specific                     |
| `OPENAI_BASE_URL` / `OPENAI_API_KEY`     | OpenAI-specific / generic fallback    |
| `SKILL_TESTER_MODELS`                    | Comma-separated default model list    |

Run `--models deepseek-chat` (or set `SKILL_TESTER_MODELS`) to evaluate a DeepSeek model; the
harness posts to `POST {baseUrl}/chat/completions` with tool calling, exactly as the OpenAI API
specifies.

## How a run works

1. A sandbox (a real temp directory) is created from the scenario's starting files plus the
   skill/agent under test.
2. The skill (`SKILL.md` body) or agent (markdown body) becomes the **system prompt**; a skill's
   whole directory is also copied into the sandbox under `.skill/<name>/` so its `references/`
   links resolve.
3. The model runs an OpenAI-style **tool-calling loop** with sandboxed file tools — `read_file`,
   `write_file`, `edit_file`, `list_files`, `glob`, `search_files` — until it stops requesting
   tools or hits `--max-turns`.
4. The resulting sandbox is scored.

A failed tool call, an unknown tool, or a path escaping the sandbox is reported back to the model
as an error (and counted as an avoidable retry), never a crash.

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

## Layout

```text
src/
  cli.ts                     CLI entry point
  index.ts                   public API
  config.ts                  per-model endpoint/credential resolution
  skillTester.ts             orchestrator: sandboxes, runs, aggregation, reporting
  llm/openaiClient.ts        dependency-free OpenAI-compatible chat client
  llm/tools.ts               sandboxed file tools + JSON schemas
  llm/agentRunner.ts         provider-agnostic tool-calling agent loop
  scoring/qualityScore.ts    exact / normalized / similarity / check scoring
  scenarios/                 scenario model, lion-ui generators, manual scenarios
  report/runRecord.ts        markdown run record + JSON sidecar
  createProjectSandbox.ts    virtual file system -> real temp directory
  parseFrontmatter.ts        SKILL.md / agent frontmatter parsing
  fsGlob.ts                  glob helper
mock-repo/                   a mock Copilot agent + docs (kept for parity/testing)
test-node/                   node:test suite incl. mock OpenAI server
```
