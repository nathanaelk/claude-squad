import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join, basename } from 'node:path';
import { listFiles, readFrontmatter, repoRoot } from './helpers.mjs';

test('every agent has valid frontmatter with required fields', async () => {
  const files = await listFiles(join(repoRoot, 'agents'));
  assert.ok(files.length > 0, 'agents/ must contain at least one file');

  for (const file of files) {
    const { data } = await readFrontmatter(file);
    const name = basename(file, '.md');
    assert.ok(data, `${name}: frontmatter must parse`);
    assert.equal(data.name, name, `${name}: frontmatter name must match filename`);
    assert.ok(typeof data.description === 'string' && data.description.length > 0, `${name}: description required`);
    assert.ok('tools' in data, `${name}: tools field required`);
    assert.ok('model' in data, `${name}: model field required`);
  }
});

test('every command has valid frontmatter with a description', async () => {
  const files = await listFiles(join(repoRoot, 'commands'));
  assert.ok(files.length > 0, 'commands/ must contain at least one file');

  for (const file of files) {
    const { data } = await readFrontmatter(file);
    const name = basename(file, '.md');
    assert.ok(data, `${name}: frontmatter must parse`);
    assert.ok(typeof data.description === 'string' && data.description.length > 0, `${name}: description required`);
  }
});

test('all three core agents are present', async () => {
  const files = (await listFiles(join(repoRoot, 'agents'))).map((f) => basename(f, '.md'));
  for (const required of ['lead', 'scribe', 'reviewer']) {
    assert.ok(files.includes(required), `agents/ must contain ${required}.md`);
  }
});

test('all five expected commands are present', async () => {
  const files = (await listFiles(join(repoRoot, 'commands'))).map((f) => basename(f, '.md'));
  for (const required of ['init', 'new-agent', 'recommend-team', 'team-status', 'sync']) {
    assert.ok(files.includes(required), `commands/ must contain ${required}.md`);
  }
});
