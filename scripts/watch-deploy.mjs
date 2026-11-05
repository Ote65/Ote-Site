#!/usr/bin/env node
/**
 * 本地保存即上线：监听站点源码，防抖后自动 build + wrangler deploy。
 *
 *   npm run watch:deploy      # 常驻，保存文件后约 1 秒自动发布
 *
 * 只监听会影响产物的文件。node_modules 与 dist 由 .gitignore 排除。
 */
import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WATCH_PATHS = [
  'src',
  'public',
  'index.html',
  'worker.js',
  'wrangler.toml',
  'vite.config.ts',
];
const WRANGLER = 'wrangler@4.157.0';
const DEBOUNCE_MS = 1000;

let timer = null;
let running = false;
let pending = false;

const log = (msg) => console.log(`[watch] ${new Date().toLocaleTimeString()} ${msg}`);

function run(cmd, args) {
  return new Promise((ok, fail) => {
    const child = spawn(cmd, args, { cwd: ROOT, stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) ok();
      else fail(new Error(`${cmd} ${args.join(' ')} 退出码 ${code}`));
    });
  });
}

async function buildAndDeploy() {
  if (running) {
    pending = true;
    return;
  }
  running = true;
  try {
    log('构建中…');
    await run('npm', ['run', 'build']);
    log('部署中…');
    await run('npx', ['-y', WRANGLER, 'deploy']);
    log('已上线');
  } catch (error) {
    log(`失败：${error.message}`);
  } finally {
    running = false;
    if (pending) {
      pending = false;
      schedule();
    }
  }
}

function schedule() {
  clearTimeout(timer);
  timer = setTimeout(buildAndDeploy, DEBOUNCE_MS);
}

for (const path of WATCH_PATHS) {
  try {
    watch(resolve(ROOT, path), { recursive: true }, (_event, file) => {
      if (!file || file.includes('node_modules')) return;
      log(`改动 ${file}`);
      schedule();
    });
    log(`监听 ${path}`);
  } catch (error) {
    log(`跳过 ${path}：${error.message}`);
  }
}

log('就绪，保存文件后自动发布。按 Ctrl+C 退出。');
