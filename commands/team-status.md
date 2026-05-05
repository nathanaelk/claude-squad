---
description: Show the current squad — who's on the team, what they've been doing, and what was last decided.
---

Show the team status. Format your response exactly like this:

```
## Squad Status

### Team (<count>)
<always list these three core agents shipped by the plugin first:>
- **lead** — architect and coordinator; plans, delegates, and decides.
- **scribe** — appends decisions to .squad/decisions/.
- **reviewer** — read-only code reviewer; runs after edits.
<then for each file in .claude/agents/ in the user's repo, list:>
- **<name>** — <one-line description from the agent's `description` field in frontmatter>

### Currently focused on
<contents of .squad/now.md, or "Nothing set. Run an update via the lead." if empty/missing>

### Last 5 decisions
<read .squad/decisions/, find the most recent entries across all date files, list:>
- <date> <time> — <title>

If no decisions logged: "No decisions logged yet."

### Agents with accumulated knowledge
<for each file in .squad/history/ that is non-empty (more than just a header):>
- <name> (<line count> lines of history)
```

Be concise. This is a status check, not a report.
