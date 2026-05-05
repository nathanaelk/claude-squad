import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { readText, repoRoot } from './helpers.mjs';

test('CLAUDE.md.tmpl has both squad-roster sentinels', async () => {
  const body = await readText(join(repoRoot, 'templates', 'CLAUDE.md.tmpl'));
  assert.ok(body.includes('<!-- squad-roster -->'), 'open sentinel required');
  assert.ok(body.includes('<!-- /squad-roster -->'), 'close sentinel required');
});

test('now.md.tmpl is non-empty and starts with a markdown heading', async () => {
  const body = await readText(join(repoRoot, 'templates', 'now.md.tmpl'));
  assert.ok(body.length > 0);
  assert.ok(body.trimStart().startsWith('# '), 'should begin with an H1');
});

test('conventions.md.tmpl is non-empty', async () => {
  const body = await readText(join(repoRoot, 'templates', 'conventions.md.tmpl'));
  assert.ok(body.trim().length > 0);
});
