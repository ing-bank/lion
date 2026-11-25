# Sources

The guidance in `SKILL.md` is drawn from the four sources below. Each quote was checked against the
page text on the date this file was written. Where a phrase is a heading rather than a sentence, it is
marked as such. Quotes are verbatim; any ellipsis is marked `…`.

## 1. Skill authoring best practices

<https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices>

- Heading "Concise is key" (Core principles).
- "The context window is a public good. Your Skill shares the context window with everything else…"
- "Default assumption: Claude is already very smart" (heading), then: "Only add context Claude doesn't
  already have. Challenge each piece of information:"
- "At startup, only the metadata (name and description) from all Skills is pre-loaded."
- "Match the level of specificity to the task's fragility and variability."
- Degrees of freedom levels:
  - "**High freedom** (text-based instructions):"
  - "**Medium freedom** (pseudocode or scripts with parameters):"
  - "**Low freedom** (specific scripts, few or no parameters):"
- "Keep the `SKILL.md` body under 500 lines for optimal performance."
- "**Keep references one level deep from `SKILL.md`**. All reference files should link directly from
  `SKILL.md` to ensure Claude reads complete files when needed."
- The description "should include both what the Skill does and when to use it."
- Checklist item: "File references are one level deep"

## 2. Effective context engineering for AI agents

<https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>

- "…find the smallest set of high-signal tokens…"
- "The right altitude is the Goldilocks zone between two common failure modes." The two failure modes
  are hardcoding "complex, brittle logic in their prompts" at one extreme, and "vague, high-level
  guidance" at the other.
- "…you should be striving for the minimal set of information that fully outlines your expected
  behavior. (Note that minimal does not necessarily mean short; you still need to give the agent
  sufficient information up front to ensure it adheres to the desired behavior.)"

## 3. Equipping agents for the real world with Agent Skills

<https://www.anthropic.com/research/equipping-agents-for-the-real-world-with-agent-skills>

- "Building a skill for an agent is like putting together an onboarding guide for a new hire."
- "This metadata is the first level of progressive disclosure: it provides just enough information for
  Claude to know when each skill should be used…"

## 4. Building effective agents

<https://www.anthropic.com/research/building-effective-agents>

- "Carefully craft your agent-computer interface (ACI) through thorough tool documentation and testing."

## Notes on wording

- The context-engineering article says "find the smallest set of high-signal tokens", not "the smallest
  possible set". Quote it as the article reads.
- "Concise is key" is a heading on the best-practices page, not a sentence in its body.
