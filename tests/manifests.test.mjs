import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { readText, repoRoot } from './helpers.mjs';

const SEMVER = /^\d+\.\d+\.\d+(?:[-+].+)?$/;

test('plugin.json parses and has required fields', async () => {
  const raw = await readText(join(repoRoot, '.claude-plugin', 'plugin.json'));
  const m = JSON.parse(raw);
  assert.equal(m.name, 'squad');
  assert.match(m.version, SEMVER, 'version must be semver-shaped');
  assert.ok(m.description && m.description.length > 0, 'description required');
});

test('marketplace.json parses and lists the squad plugin', async () => {
  const raw = await readText(join(repoRoot, '.claude-plugin', 'marketplace.json'));
  const m = JSON.parse(raw);
  assert.equal(m.name, 'claude-squad');
  assert.ok(m.owner && m.owner.name, 'owner.name required');
  assert.ok(Array.isArray(m.plugins) && m.plugins.length >= 1, 'plugins must be a non-empty array');

  const squad = m.plugins.find((p) => p.name === 'squad');
  assert.ok(squad, 'marketplace must list a plugin named "squad"');
  assert.equal(squad.source, './', 'squad plugin source must be "./"');
});
