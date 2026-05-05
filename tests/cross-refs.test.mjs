import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { existsSync } from 'node:fs';
import { listFiles, readText, repoRoot } from './helpers.mjs';

// Slash commands in plugins are namespaced (e.g. /squad:new-agent). Stale
// references to the un-namespaced form would silently 404 at runtime; this
// test catches them.
const NAMESPACED = ['init', 'new-agent', 'recommend-team', 'team-status', 'sync'];

test('no un-namespaced slash command references survive in agents/ or commands/', async () => {
  const files = [
    ...(await listFiles(join(repoRoot, 'agents'))),
    ...(await listFiles(join(repoRoot, 'commands'))),
  ];

  const offenders = [];
  for (const file of files) {
    const raw = await readText(file);
    for (const cmd of NAMESPACED) {
      // Match `/cmd` not preceded by `squad:` and followed by a non-letter
      // (so we don't false-positive on `/initial`, `/syncing`, etc.).
      const re = new RegExp(`(?<!squad:)\\/${cmd}(?![a-zA-Z-])`, 'g');
      const matches = raw.match(re);
      if (matches) {
        offenders.push(`${file}: contains un-namespaced /${cmd}`);
      }
    }
  }

  assert.equal(offenders.length, 0, `found stale references:\n${offenders.join('\n')}`);
});

test('commands/init.md references templates that exist on disk', async () => {
  const initBody = await readText(join(repoRoot, 'commands', 'init.md'));
  for (const tmpl of ['now.md.tmpl', 'conventions.md.tmpl', 'CLAUDE.md.tmpl']) {
    assert.ok(initBody.includes(tmpl), `init.md must reference ${tmpl}`);
    assert.ok(
      existsSync(join(repoRoot, 'templates', tmpl)),
      `templates/${tmpl} must exist on disk`,
    );
  }
});

test('commands/new-agent.md references the per-project agent and history paths', async () => {
  const body = await readText(join(repoRoot, 'commands', 'new-agent.md'));
  assert.ok(body.includes('.claude/agents/'), 'new-agent.md must write to .claude/agents/');
  assert.ok(body.includes('.squad/history/'), 'new-agent.md must write to .squad/history/');
});
