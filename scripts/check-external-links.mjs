#!/usr/bin/env node
/**
 * 外链巡检脚本（VitePress 站点）
 *
 * 用法:
 *   node scripts/check-external-links.mjs [--sample N] [--strict]
 *
 *   --sample N   只抽查（按 URL 字母序）前 N 条，用于快速自测
 *   --strict     存在 FAIL 时 exit 1；默认报告型，恒 exit 0
 *
 * 行为:
 *   - 扫描 docs 下所有 .md（排除 .vitepress/dist、.obsidian、blogs/public）
 *   - 提取 http/https 外链（markdown 链接 + 裸链接），排除 localhost/127.0.0.1
 *   - 按 URL 去重并记录引用文件；并发 <=8 检查
 *   - 先 HEAD，405/403/501（或 HEAD 被服务器拒绝）退回 GET，只读响应头即中断 body
 *   - 超时 10s（AbortController）；重定向跟随后 2xx 算 OK；429 记 SKIP
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

// ---------- 配置 ----------

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_DIR = path.join(ROOT, 'docs');
const EXCLUDED_DIRS = ['docs/.vitepress/dist', 'docs/.obsidian', 'docs/blogs/public'];
const CONCURRENCY = 8;
const TIMEOUT_MS = 10_000;
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

// ---------- CLI 参数 ----------

function parseArgs(argv) {
  const opts = { sample: 0, strict: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--strict') opts.strict = true;
    else if (a === '--sample') {
      const n = Number(argv[++i]);
      if (!Number.isInteger(n) || n <= 0) {
        console.error('用法: --sample N (N 为正整数)');
        process.exit(2);
      }
      opts.sample = n;
    } else {
      console.error(`未知参数: ${a}`);
      console.error('用法: node scripts/check-external-links.mjs [--sample N] [--strict]');
      process.exit(2);
    }
  }
  return opts;
}

// ---------- 文件扫描 ----------

function toPosix(p) {
  return p.split(path.sep).join('/');
}

async function collectMarkdownFiles(dir, out = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = toPosix(path.relative(ROOT, full));
    if (e.isDirectory()) {
      if (EXCLUDED_DIRS.some((ex) => rel.toLowerCase() === ex.toLowerCase())) continue;
      await collectMarkdownFiles(full, out);
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
      out.push(full);
    }
  }
  return out;
}

// ---------- 链接提取 ----------

// 允许 () 出现在 URL 中，事后再修剪不配对的右括号（兼容 wiki 类 URL 与 [t](url) 形式）
const URL_RE = /https?:\/\/[^\s<>"'`\]}]+/g;

function count(str, ch) {
  let n = 0;
  for (const c of str) if (c === ch) n++;
  return n;
}

function cleanUrl(raw) {
  let u = raw;
  for (;;) {
    const before = u;
    u = u.replace(/[.,;:!?'"“”‘’`*_~\\]+$/, ''); // 常见句尾标点/markdown 残留
    while (u.endsWith(')') && count(u, '(') < count(u, ')')) u = u.slice(0, -1);
    if (u === before) break;
  }
  return u;
}

function extractUrls(text) {
  const found = new Set();
  for (const m of text.matchAll(URL_RE)) {
    const u = cleanUrl(m[0]);
    let parsed;
    try {
      parsed = new URL(u);
    } catch {
      continue; // 非法 URL 忽略
    }
    if (!/^https?:$/.test(parsed.protocol)) continue;
    if (LOCAL_HOSTS.has(parsed.hostname)) continue;
    found.add(u);
  }
  return found;
}

// ---------- 网络检查 ----------

async function request(url, method) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method,
      redirect: 'follow', // 重定向自动跟随，最终 2xx 即 OK
      signal: controller.signal,
      headers: {
        'user-agent': UA,
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8',
      },
    });
    try {
      await res.body?.cancel(); // 只需状态码/响应头，立即中断 body 下载
    } catch {}
    return res.status;
  } finally {
    clearTimeout(timer);
  }
}

function describeError(err) {
  if (err?.name === 'AbortError') return `timeout>${TIMEOUT_MS / 1000}s`;
  const code = err?.cause?.code || err?.code;
  if (code) return code; // ENOTFOUND / ECONNRESET / CERT_xxx 等
  const msg = err?.cause?.message || err?.message || String(err);
  return msg.replace(/\s+/g, ' ').slice(0, 60);
}

/** @returns {Promise<{verdict:'OK'|'FAIL'|'SKIP', detail:string}>} */
async function checkUrl(url) {
  let status;
  try {
    status = await request(url, 'HEAD');
  } catch (err) {
    if (err?.name === 'AbortError') return { verdict: 'FAIL', detail: describeError(err) };
    status = null; // 个别服务器直接掐断 HEAD 连接，退回 GET 再试
  }
  try {
    if (status === null || [403, 405, 501].includes(status)) {
      status = await request(url, 'GET');
    }
  } catch (err) {
    return { verdict: 'FAIL', detail: describeError(err) };
  }
  if (status === 429) return { verdict: 'SKIP', detail: '429 rate-limited' };
  if (status >= 200 && status < 400) return { verdict: 'OK', detail: String(status) };
  return { verdict: 'FAIL', detail: String(status) };
}

// ---------- 并发池 ----------

async function runPool(items, limit, worker) {
  let cursor = 0;
  const lanes = Array.from({ length: Math.min(limit, items.length) }, async () => {
    for (;;) {
      const idx = cursor++;
      if (idx >= items.length) return;
      await worker(items[idx], idx);
    }
  });
  await Promise.all(lanes);
}

// ---------- 主流程 ----------

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  const files = await collectMarkdownFiles(DOCS_DIR);
  /** @type {Map<string, Set<string>>} url -> 引用文件(repo 相对路径) */
  const refs = new Map();
  for (const file of files) {
    const rel = toPosix(path.relative(ROOT, file));
    const text = await readFile(file, 'utf8');
    for (const url of extractUrls(text)) {
      if (!refs.has(url)) refs.set(url, new Set());
      refs.get(url).add(rel);
    }
  }

  const allUrls = [...refs.keys()].sort();
  const urls = opts.sample > 0 ? allUrls.slice(0, opts.sample) : allUrls;

  console.log(
    `外链巡检: 扫描 ${files.length} 个 md 文件, 唯一外链 ${allUrls.length} 条, ` +
      `本次检查 ${urls.length} 条${opts.sample > 0 ? ` (--sample ${opts.sample})` : ''}`,
  );
  console.log(`并发 ${CONCURRENCY}, 超时 ${TIMEOUT_MS / 1000}s\n`);

  const results = new Array(urls.length);
  let done = 0;
  await runPool(urls, CONCURRENCY, async (url, idx) => {
    const r = await checkUrl(url);
    results[idx] = { url, ...r };
    const n = String(++done).padStart(String(urls.length).length);
    console.log(`[${n}/${urls.length}] ${r.verdict.padEnd(4)} ${r.detail.padEnd(14)} ${url}`);
  });

  const ok = results.filter((r) => r.verdict === 'OK');
  const fail = results.filter((r) => r.verdict === 'FAIL');
  const skip = results.filter((r) => r.verdict === 'SKIP');

  console.log('\n===== 汇总 =====');
  console.log(`检查 ${results.length} | OK ${ok.length} | FAIL ${fail.length} | SKIP ${skip.length}`);

  if (skip.length > 0) {
    console.log('\n----- SKIP -----');
    for (const r of skip) console.log(`  ${r.detail}  ${r.url}`);
  }

  if (fail.length > 0) {
    console.log('\n===== FAIL 明细 =====');
    const rows = fail.map((r) => {
      const fileList = [...refs.get(r.url)].sort();
      const top3 = fileList.slice(0, 3).join(', ') + (fileList.length > 3 ? ` (+${fileList.length - 3})` : '');
      return [r.detail, r.url, top3];
    });
    const w0 = Math.max(...rows.map((r) => r[0].length), '状态/错误'.length);
    const w1 = Math.max(...rows.map((r) => r[1].length), 'URL'.length);
    console.log(`${'状态/错误'.padEnd(w0)}  ${'URL'.padEnd(w1)}  引用文件(top3)`);
    console.log('-'.repeat(w0 + w1 + 20));
    for (const [a, b, c] of rows) console.log(`${a.padEnd(w0)}  ${b.padEnd(w1)}  ${c}`);
  }

  process.exit(opts.strict && fail.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('脚本异常:', err);
  process.exit(2);
});
