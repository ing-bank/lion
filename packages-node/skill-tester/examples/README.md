# Examples

Runnable examples for `skill-tester`. Each one evaluates the real `lion-ui` skill against a real
model and writes a run record to `packages-node/skill-tester/.tmp/skill-tester/reports/`.

```bash
cd packages-node/skill-tester

# OpenAI (the reference OpenAI-compatible endpoint)
OPENAI_API_KEY=... npm run eval:openai -- --models gpt-5-mini --samples 3

# Runware — one OpenAI-compatible endpoint serving many Western models
RUNWARE_API_KEY=... npm run eval:runware -- --models openai-gpt-5-mini --limit 3

# Any local OpenAI-compatible server
npm run eval:local -- --models my-model --base-url http://localhost:8080/v1

# GitHub Copilot (optional dependency)
npm install @github/copilot-sdk
npm run eval:copilot -- --models <copilot-model> --limit 1
```

`presets.mjs` holds the presets (`openai`, `runware`, `local`, `copilot`); `run.mjs` is a thin
example of the **library API** (`runSkillTester` + `loadLionUiScenarios`). The presets are examples
only — the library never assumes a vendor, and no model is pinned. Pass `--models` to pick a model,
or point `--base-url` at anything that speaks the OpenAI API.

The equivalent CLI one-liners (no example script needed):

```bash
# anything OpenAI-compatible; only the base URL and key differ
npm run eval -- --models gpt-5-mini --api-key "$OPENAI_API_KEY"
npm run eval -- --models openai-gpt-5-mini --base-url https://api.runware.ai/v1 --api-key "$RUNWARE_API_KEY"
npm run eval -- --models my-model --base-url http://localhost:8080/v1
npm run eval -- --provider copilot --models <copilot-model>
```

Both forms accept the same filters: `--kind component|system|integration`, `--scenario <substring>`,
`--limit <n>`, `--samples <n>`, `--max-turns <n>`, `--pass-threshold <n>`.
