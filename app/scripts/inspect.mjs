// 사용: npm run inspect   — WebStorm 헤드리스 검사를 돌려 한 줄로 요약한다.
// 출력: `INSPECT ok: n errors, n warnings` (오류 등급이 있으면 exit 1)
//       `INSPECT SKIPPED: <이유>` (못 돌림, exit 0 — 통과가 아니다)
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const TIMEOUT_MS = 120_000;
const repo = resolve(process.cwd(), '..');
const script = process.env.WEBSTORM_INSPECT ?? '/Applications/WebStorm.app/Contents/bin/inspect.sh';
const profile = resolve(repo, '.idea/inspectionProfiles/Project_Default.xml');
const outDir = resolve(process.cwd(), '.inspect-out');

function skip(reason) {
  console.log(`INSPECT SKIPPED: ${reason}`);
  process.exit(0);
}

if (!existsSync(script)) skip('WebStorm inspect.sh not found');
if (!existsSync(profile)) skip('inspection profile missing');
const running = spawnSync('pgrep', ['-f', 'WebStorm.app/Contents/MacOS/webstorm']);
if (running.status === 0) skip('WebStorm window is open (close it first)');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const run = spawnSync(
  script,
  [repo, profile, outDir, '-v2', '-d', resolve(repo, 'app/src'), '-format', 'json'],
  { timeout: TIMEOUT_MS, encoding: 'utf8' },
);
if (run.error) skip(`could not run (${run.error.code ?? run.error.message}); limit ${TIMEOUT_MS / 1000}s`);
if (run.status !== 0) skip(`inspect.sh exit ${run.status} (license or startup dialog?)`);

let errors = 0;
let warnings = 0;
for (const name of readdirSync(outDir)) {
  if (!name.endsWith('.json') || name.startsWith('.') || name.endsWith('_aggregate.json')) continue;
  // 중복 코드 검사는 빌드 결과(dist)와 src 를 짝지어 잡음이 되므로 세지 않는다.
  if (name === 'DuplicatedCode.json') continue;
  const data = JSON.parse(readFileSync(resolve(outDir, name), 'utf8'));
  for (const p of data.problems ?? []) {
    const sev = p.problem_class?.severity ?? 'WARNING';
    if (sev === 'ERROR') errors += 1;
    else warnings += 1;
    console.log(`${sev} ${p.file?.replace('file://$PROJECT_DIR$/', '')}:${p.line} ${p.description ?? ''}`);
  }
}
console.log(`INSPECT ok: ${errors} errors, ${warnings} warnings`);
process.exit(errors > 0 ? 1 : 0);
