#!/usr/bin/env node
/**
 * Fetch the woodworking planner from its own repo, build it, and copy the
 * build into public/planner/app/ so the site serves it at /planner/app/.
 *
 *   npm run sync-planner                 # main branch
 *   PLANNER_REF=some-branch npm run sync-planner
 *   PLANNER_DIR=../Wood-Working-Renderer npm run sync-planner   # use a local checkout
 *
 * PLANNER_TOKEN (a GitHub token that can read the planner repo) is needed
 * only while that repo is private.
 */
import { execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO = process.env.PLANNER_REPO || 'https://github.com/lukedavis7496-rgb/Wood-Working-Renderer.git';
const REF = process.env.PLANNER_REF || 'main';
const root = resolve(import.meta.dirname, '..');
const out = join(root, 'public', 'planner', 'app');
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: 'inherit' });

let src = process.env.PLANNER_DIR ? resolve(process.env.PLANNER_DIR) : join(root, '.cache', 'planner');
if (!process.env.PLANNER_DIR) {
  rmSync(src, { recursive: true, force: true });
  mkdirSync(join(root, '.cache'), { recursive: true });
  console.log(`Cloning ${REPO} @ ${REF}`);
  const token = process.env.PLANNER_TOKEN;
  const url = token ? REPO.replace('https://github.com/', `https://x-access-token:${token}@github.com/`) : REPO;
  run(`git clone --depth 1 --branch ${REF} ${url} ${src}`, root);
}
console.log('Building the planner');
run('npm ci --no-audit --no-fund', src);
// The planner builds with relative paths (base: './'), so it works under any prefix.
run('npx vite build', src);

const dist = join(src, 'dist');
if (!existsSync(join(dist, 'index.html'))) throw new Error(`No planner build found in ${dist}`);
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(dist, out, { recursive: true });
console.log(`Planner copied to ${out}`);
