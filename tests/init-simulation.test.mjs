import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, rm, writeFile, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { simulateInit, repoRoot, readText } from './helpers.mjs';

let baseTmp;

before(async () => {
  baseTmp = await mkdtemp(join(tmpdir(), 'squad-init-'));
});

after(async () => {
  if (baseTmp) await rm(baseTmp, { recursive: true, force: true });
});

async function freshDir(name) {
  const d = join(baseTmp, name);
  await mkdir(d, { recursive: true });
  return d;
}

test('init in an empty dir creates all expected files', async () => {
  const dir = await freshDir('case-empty');
  await simulateInit(dir, repoRoot);

  assert.ok(existsSync(join(dir, '.squad', 'decisions')), '.squad/decisions exists');
  assert.ok(existsSync(join(dir, '.squad', 'history')), '.squad/history exists');
  assert.ok(existsSync(join(dir, '.squad', 'now.md')), '.squad/now.md exists');
  assert.ok(existsSync(join(dir, '.squad', 'conventions.md')), '.squad/conventions.md exists');
  assert.ok(existsSync(join(dir, 'CLAUDE.md')), 'CLAUDE.md exists');

  const claudeContent = await readText(join(dir, 'CLAUDE.md'));
  assert.ok(claudeContent.includes('<!-- squad-roster -->'));
});

test('init is idempotent (second run modifies nothing)', async () => {
  const dir = await freshDir('case-idempotent');
  await simulateInit(dir, repoRoot);

  const targets = [
    join(dir, '.squad', 'now.md'),
    join(dir, '.squad', 'conventions.md'),
    join(dir, 'CLAUDE.md'),
  ];
  const before = await Promise.all(targets.map(async (p) => ({
    content: await readFile(p, 'utf8'),
    mtime: (await stat(p)).mtimeMs,
  })));

  await simulateInit(dir, repoRoot);

  const after = await Promise.all(targets.map(async (p) => ({
    content: await readFile(p, 'utf8'),
    mtime: (await stat(p)).mtimeMs,
  })));

  for (let i = 0; i < targets.length; i++) {
    assert.equal(after[i].content, before[i].content, `${targets[i]} content changed`);
    assert.equal(after[i].mtime, before[i].mtime, `${targets[i]} was rewritten`);
  }
});

test('init appends roster to a CLAUDE.md without the sentinel', async () => {
  const dir = await freshDir('case-append');
  const original = '# My Project\n\nSome existing content.\n';
  await writeFile(join(dir, 'CLAUDE.md'), original, 'utf8');

  await simulateInit(dir, repoRoot);

  const after = await readText(join(dir, 'CLAUDE.md'));
  assert.ok(after.startsWith(original), 'original content preserved');
  assert.ok(after.includes('<!-- squad-roster -->'), 'roster appended');
  assert.ok(after.includes('<!-- /squad-roster -->'), 'roster close sentinel present');
});

test('init leaves a CLAUDE.md with the sentinel byte-identical', async () => {
  const dir = await freshDir('case-already-rostered');
  const original = '# Project\n\n<!-- squad-roster -->\n## Custom roster\n<!-- /squad-roster -->\n';
  await writeFile(join(dir, 'CLAUDE.md'), original, 'utf8');

  await simulateInit(dir, repoRoot);

  const after = await readText(join(dir, 'CLAUDE.md'));
  assert.equal(after, original);
});

test('init preserves an existing .squad/now.md', async () => {
  const dir = await freshDir('case-preserve-now');
  await mkdir(join(dir, '.squad'), { recursive: true });
  const custom = '# Current Focus\n\nShipping checkout.\n';
  await writeFile(join(dir, '.squad', 'now.md'), custom, 'utf8');

  await simulateInit(dir, repoRoot);

  const after = await readText(join(dir, '.squad', 'now.md'));
  assert.equal(after, custom);
});
