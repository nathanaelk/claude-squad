// Shared helpers for the test suites.
//
// Exports:
//   repoRoot                  — absolute path to the plugin repo root
//   readFrontmatter(path)     — { data: object, body: string } for a markdown file
//   listFiles(dir, ext)       — sorted list of absolute paths
//   readText(path)            — convenience UTF-8 read
//   simulateInit(target, plg) — deterministic JS encoding of /squad:init's rules

import { readFile, readdir, mkdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, dirname, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const repoRoot = resolve(__dirname, '..');

export async function readText(path) {
  return await readFile(path, 'utf8');
}

export async function listFiles(dir, ext = '.md') {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(ext))
    .map((e) => join(dir, e.name))
    .sort();
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export async function readFrontmatter(path) {
  const raw = await readText(path);
  const m = raw.match(FRONTMATTER_RE);
  if (!m) {
    return { data: null, body: raw };
  }
  const data = YAML.parse(m[1]);
  return { data, body: m[2] };
}

// Deterministic JS implementation of the rules described in commands/init.md.
// Tests assert properties of this function. If the markdown spec drifts from
// this implementation, tests should be updated to keep them in lockstep.
export async function simulateInit(targetDir, pluginRoot) {
  const created = [];
  const skipped = [];

  async function ensureDir(p) {
    if (existsSync(p)) {
      skipped.push(p);
    } else {
      await mkdir(p, { recursive: true });
      created.push(p);
    }
  }

  async function copyIfMissing(src, dst) {
    if (existsSync(dst)) {
      skipped.push(dst);
      return;
    }
    const content = await readText(src);
    await mkdir(dirname(dst), { recursive: true });
    await writeFile(dst, content, 'utf8');
    created.push(dst);
  }

  // 1. Directories
  await ensureDir(join(targetDir, '.squad', 'decisions'));
  await ensureDir(join(targetDir, '.squad', 'history'));

  // 2. now.md and conventions.md (never overwrite)
  await copyIfMissing(
    join(pluginRoot, 'templates', 'now.md.tmpl'),
    join(targetDir, '.squad', 'now.md'),
  );
  await copyIfMissing(
    join(pluginRoot, 'templates', 'conventions.md.tmpl'),
    join(targetDir, '.squad', 'conventions.md'),
  );

  // 3. CLAUDE.md — three branches
  const tmplPath = join(pluginRoot, 'templates', 'CLAUDE.md.tmpl');
  const tmpl = await readText(tmplPath);
  const claudePath = join(targetDir, 'CLAUDE.md');
  if (!existsSync(claudePath)) {
    await writeFile(claudePath, tmpl, 'utf8');
    created.push(claudePath);
  } else {
    const existing = await readText(claudePath);
    if (existing.includes('<!-- squad-roster -->')) {
      skipped.push(claudePath);
    } else {
      const sep = existing.endsWith('\n') ? '\n' : '\n\n';
      await writeFile(claudePath, existing + sep + tmpl, 'utf8');
      created.push(claudePath + ' (appended)');
    }
  }

  return { created, skipped };
}

export async function pathExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

export { basename };
