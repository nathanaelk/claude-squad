---
description: Spin up a new specialist agent (designer, marketer, mobile dev, anything). Generates the agent file in .claude/agents/ and a history file in .squad/history/.
argument-hint: "<role name> [optional: description of what they do]"
---

A new specialist needs to join the team. The role is: **$ARGUMENTS**

**Precondition:** if `.squad/` doesn't exist in the user's repo, stop and tell them to run `/squad:init` first. Don't create agent files without the squad state directory in place.

Do the following:

1. **Pick a short, lowercase, hyphen-separated agent name** based on the role. Examples: `frontend`, `backend`, `designer`, `marketer`, `mobile`, `devops`, `data`, `security`, `seo`, `copywriter`, `ml`, `qa`. Use the role name the user gave; only adjust for filename safety.

2. **Determine the right tool set** for this role using this rubric:
   - **Builder roles** (frontend, backend, mobile, ml, devops): `Read, Write, Edit, Bash, Glob, Grep, WebSearch, WebFetch`
   - **Research / non-code roles** (marketer, copywriter, seo, designer-without-code, data-analyst): `Read, Write, Edit, Glob, Grep, WebSearch, WebFetch` (no Bash)
   - **Read-only roles** (auditor, security-reviewer): `Read, Grep, Glob, Bash, WebSearch`
   - If unsure, ask the user one quick question.

3. **Pick a model:**
   - `inherit` for builder and analyst roles (most cases)
   - `haiku` for narrow, repetitive logging or formatting roles
   - `opus` only if the user explicitly asks for it

4. **Create `.claude/agents/<name>.md`** with this structure (fill in the bracketed parts based on the role):

```markdown
---
name: <name>
description: <one or two sentences. Start with "Use proactively for..." or "Use when..." so Claude auto-delegates correctly. Be specific about the role's domain.>
tools: <chosen tool list>
model: <chosen model>
---

You are the **<Role Title>** on this project's squad.

## On every invocation

1. Read `.squad/now.md` — know the current focus.
2. Read `.squad/conventions.md` — follow project rules.
3. Read your history at `.squad/history/<name>.md` — apply what you've already learned about this project.
4. Read `.squad/decisions/` (most recent file) — stay consistent with recent calls.

## Your domain

<2–4 bullets describing what this role owns. Be concrete to this project type. Example for a designer: "Visual design, component aesthetics, spacing/typography systems, design tokens, accessibility (color contrast, focus states).">

## Your job

<3–5 bullets on how this role works. Include domain-specific best practices. For builders, mention testing. For non-code roles, mention how their output integrates (e.g. "designer outputs to /design as markdown specs and reference images").>

## After meaningful work

- Append a one-paragraph learning to `.squad/history/<name>.md` — what you learned about this project that future-you should know.
- If you made a real decision, ask the scribe to log it.

## Style

<One or two sentences on voice. Builders: terse and technical. Marketers: punchy. Designers: visual-first. Match the role.>

## Autonomy

Full edit/commit/run authority within your domain. Coordinate with the lead before crossing into another specialist's territory.
```

5. **Create an empty `.squad/history/<name>.md`** with just a header: `# <Role Title> — Project History\n\n*Learnings will accumulate here as the agent works.*\n`

6. **Append a line to the team roster** in `CLAUDE.md` under the "Specialists" section, in the format: `- \`<name>\` — <short role description>`. If there's no Specialists section yet (only the placeholder), add one.

7. **Ask the scribe** to log a decision: "Added <name> to the team — <reason from user's request>."

8. **Confirm to the user** in two lines: who joined the team and how to invoke them (`@<name>` or natural language). Do not produce a long writeup.

Note: project-specific agents created in `.claude/agents/` are NOT namespaced under `squad:` — they're invoked by their plain name (`@designer`), unlike the plugin's slash commands.
