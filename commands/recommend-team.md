---
description: Analyze the current project and recommend a team structure. Suggests which specialists to add based on what the project actually is.
argument-hint: "[optional: description of what you're building, if the repo is empty]"
---

Recommend a team structure for this project.

## Step 1: Understand the project

Inspect what's actually here, in this order. Stop as soon as you have a clear picture:

1. `README.md` — read it if it exists.
2. `package.json`, `pyproject.toml`, `Cargo.toml`, `go.mod`, `Gemfile`, `pom.xml`, `*.csproj` — language and framework signals.
3. Top-level directory layout — `src/`, `app/`, `pages/`, `api/`, `mobile/`, `infra/`, `docs/`, `design/` are all signals.
4. `.squad/now.md` — what the team said they're focused on.
5. If the repo is mostly empty AND the user passed an argument, use the argument as the project description: **$ARGUMENTS**
6. If the repo is mostly empty AND no argument was passed, ask the user one question: "What are you building?" — then stop and wait.

## Step 2: Recommend roles

Recommend 3–6 specialists max. More than that is noise. Use this matrix as a starting point — adapt to what you found:

| Project type | Recommended specialists |
|---|---|
| Web app (full-stack) | frontend, backend, designer, qa |
| API / backend service | backend, qa, devops |
| Mobile app | mobile, backend, designer, qa |
| Data / ML project | data, ml, backend |
| Marketing site / landing page | frontend, designer, copywriter, seo |
| CLI tool / library | (just lead + reviewer is often enough — flag this) |
| Game | gameplay, art, audio, qa |
| Browser extension | frontend, backend (if server), security |

Always-on (already on the team): `lead`, `scribe`, `reviewer`. Don't re-recommend these.

## Step 3: Output

Format your response as:

```
## Recommended team for <project description in 5–8 words>

Based on <one sentence — what you observed in the repo or what the user said>.

### Add these specialists:
1. **<name>** — <one line on why this project needs them>
2. **<name>** — <one line>
...

### Skip (probably not needed):
- <role> — <one line on why not, only if there's a role the user might expect but you don't recommend>

### To create them:
Run these commands one at a time, or say "create all of them":

/squad:new-agent <name1> <short description>
/squad:new-agent <name2> <short description>
...
```

Keep it tight. The user asked for a recommendation, not an essay. If they say "create all of them," fire `/squad:new-agent` for each one in sequence.
