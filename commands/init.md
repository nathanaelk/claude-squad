---
description: Bootstrap this project for the Squad plugin — creates .squad/ state directories and seeds CLAUDE.md with the team roster. Idempotent — safe to run multiple times.
---

Initialize this project's squad state in the user's working directory.

The plugin itself is read-only (lives in the plugin cache). Per-project files (`.squad/`, the `CLAUDE.md` roster) must be created here, in the user's repo, so they can be committed and travel with the project.

Do these steps in order. **Never overwrite an existing file** — only create what's missing.

## 1. Create `.squad/` directories

If they don't already exist, create:
- `.squad/decisions/` (empty directory)
- `.squad/history/` (empty directory)

Use `Bash` with `mkdir -p .squad/decisions .squad/history`.

## 2. Seed `.squad/now.md` and `.squad/conventions.md`

Plugin templates live at `${CLAUDE_PLUGIN_ROOT}/templates/`. For each of these:

- `.squad/now.md` ← `${CLAUDE_PLUGIN_ROOT}/templates/now.md.tmpl`
- `.squad/conventions.md` ← `${CLAUDE_PLUGIN_ROOT}/templates/conventions.md.tmpl`

If the destination file already exists, **leave it alone** and note that in the output. Otherwise, read the template and write the destination.

## 3. Seed `CLAUDE.md` with the team roster

Read `${CLAUDE_PLUGIN_ROOT}/templates/CLAUDE.md.tmpl` — it contains the roster section bracketed by `<!-- squad-roster -->` and `<!-- /squad-roster -->` sentinels.

- If `CLAUDE.md` does not exist in the user's repo: write the template content as the new `CLAUDE.md`.
- If `CLAUDE.md` exists and already contains the `<!-- squad-roster -->` sentinel: leave it alone.
- If `CLAUDE.md` exists and does NOT contain the sentinel: append the entire template content (sentinels and all) to the end of `CLAUDE.md`, preceded by a blank line.

This lets users re-run `/squad:init` safely and preserves whatever they had in `CLAUDE.md` before.

## 4. Output

Print a short summary in this exact format:

```
## Squad initialized

Created:
- <list each file or directory you actually created>

Already present (left alone):
- <list each file you found existing and skipped>

Next:
- Talk to the lead, or run /squad:recommend-team to get team suggestions.
- Run /squad:new-agent <role> to add specialists.
- Commit .squad/ and CLAUDE.md so the team travels with the repo.
```

If everything already existed, say so explicitly: `Squad already initialized — nothing to do.`

That's it. Do not write essays. Do not run any other commands.
