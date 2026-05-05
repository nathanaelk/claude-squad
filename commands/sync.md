---
description: Sync the team — update .squad/now.md with current focus, flush any pending learnings to history files, and surface anything important. Run at the end of a work session.
argument-hint: "[optional: what you're working on next]"
---

End-of-session sync. Do these in order:

1. **Update `.squad/now.md`** with the current team focus. If the user passed an argument as **$ARGUMENTS**, use that as the new focus. Otherwise, read git log for the last few commits, glance at uncommitted changes, and write a 2–3 line summary of what's in flight.

2. **Check that key learnings are captured.** Glance at `.squad/history/lead.md` and the most recent agent history files — if today's session produced something worth remembering and isn't in there, append it now.

3. **Surface anything dangling:**
   - Uncommitted changes? Note them.
   - TODO comments added today? Note them.
   - Tests that are failing or skipped? Note them.

4. **Output a short handoff note** in this format:

```
## Session sync — <date>

**Now focused on:** <updated .squad/now.md content>

**Captured to history:** <list which agents got new learnings, or "nothing new this session">

**Dangling items:**
- <item, or "none">

**Suggested next step:** <one sentence>
```

This is the last thing you say before the user walks away. Make it useful.
