# Squad — a Claude Code plugin

A persistent team of specialist subagents for Claude Code. Three core roles ship in the box (`lead`, `scribe`, `reviewer`), plus an agent factory for spinning up specialists on demand. Inspired by [bradygaster/squad](https://github.com/bradygaster/squad), built natively on Claude Code primitives.

## What you get

- **3 core agents** — `lead` (plans and delegates), `scribe` (logs decisions), `reviewer` (read-only code review).
- **`/squad:new-agent`** — agent factory. Spin up a designer, marketer, mobile dev, devops, anything.
- **`/squad:recommend-team`** — looks at your project and suggests roles.
- **`/squad:team-status`** — who's on the team and what they've been doing.
- **`/squad:sync`** — end-of-session handoff that updates the team's "now" file.
- **`/squad:init`** — one-time bootstrap that creates `.squad/` and seeds your `CLAUDE.md`.

State lives in `.squad/` in your repo — decisions, conventions, per-agent history. Commit it; the team travels with the project.

## Install

```
/plugin marketplace add bradygaster/claude-squad
/plugin install squad@claude-squad
```

Then, in your project's working directory:

```
/squad:init
```

That's it. The first two commands install the plugin once per machine. `/squad:init` is per-project — it creates the `.squad/` state directory and adds a Team Roster section to your `CLAUDE.md` (or creates one if you don't have it). Re-running it is safe.

> **Why a separate init step?** Plugins install into a read-only cache, so the plugin itself can't be your project's state. `/squad:init` writes the per-project files into your actual repo so they can be committed.

## First five minutes

**Talk to the lead. Just describe what you want.**

```
You: We need to add Stripe checkout to the marketing site.

Lead: <plans, delegates to backend for the webhook handler and frontend for the
checkout button, runs them in parallel, then asks reviewer to check the diff,
then asks scribe to log "Chose Stripe Checkout (hosted) over Elements for v1">
```

**Ask for a team recommendation:**

```
/squad:recommend-team
```

(or, if the repo is empty: `/squad:recommend-team a kanban board for freelancers`)

**Add a specialist:**

```
/squad:new-agent designer Visual design system, component aesthetics, accessibility
```

**Check on the team:**

```
/squad:team-status
```

**End of session:**

```
/squad:sync working on the checkout flow next
```

## What lives where

| Lives in the plugin (read-only, in the cache) | Lives in your repo (you commit it) |
|---|---|
| `agents/lead.md`, `scribe.md`, `reviewer.md` | `.claude/agents/<name>.md` (specialists you create with `/squad:new-agent`) |
| `commands/*.md` (slash commands) | `.squad/decisions/YYYY-MM-DD.md` |
| `templates/*.tmpl` (used by `/squad:init`) | `.squad/history/<name>.md` |
|   | `.squad/now.md`, `.squad/conventions.md` |
|   | `CLAUDE.md` (with the squad roster section) |

The plugin ships the core team and the slash commands. Your repo holds the persistent memory.

## Updating

```
/plugin update squad@claude-squad
```

Plugin updates only touch the agents and commands. Your `.squad/` and `CLAUDE.md` are never modified by an update.

## Customizing per-project

- **Override a core agent.** Drop a file with the same name (`lead.md`, `scribe.md`, `reviewer.md`) into your project's `.claude/agents/`. Project-level agents take precedence over plugin agents.
- **Tighten autonomy.** Edit your project-level agent's frontmatter to remove `Bash`, `Write`, or `Edit` from the `tools:` list.
- **Change models per agent** with the `model:` field — `inherit`, `sonnet`, `opus`, `haiku`.
- **Add project-wide rules** in `.squad/conventions.md`. Every agent reads this at the start of work.

## How it differs from Squad (the original)

| Squad (Copilot) | This plugin (Claude Code) |
|---|---|
| `squad init` CLI | `/plugin install squad@claude-squad` + `/squad:init` |
| `.squad/team.md` | `CLAUDE.md` roster section + plugin's `agents/` |
| `.squad/agents/<name>/charter.md` | Plugin `agents/<name>.md` for core, `.claude/agents/<name>.md` for project specialists |
| `.squad/agents/<name>/history.md` | `.squad/history/<name>.md` |
| `.squad/decisions.md` | `.squad/decisions/YYYY-MM-DD.md` |
| `squad shell` | Just talk to Claude Code |
| `@AgentName` routing | `@agent-name` for project agents; `/squad:<command>` for slash commands |
| Built on Copilot | Built on Claude Code subagents and plugins |

## Reload after adding agents

After `/squad:new-agent`, run `/agents` to refresh the list — or just start a new session.

## Uninstall

```
/plugin uninstall squad@claude-squad
```

Your `.squad/` directory and `CLAUDE.md` stay where they are — they're your content. Re-installing the plugin and running `/squad:init` again will pick up exactly where you left off.

## License

MIT. Inspired by Squad's design; no code copied.
