// 사용: npm run zip  — 배포용 zip 을 만든다 → ../제출본/callout-rush-web.zip
// dist 는 건드리지 않는다(다른 검사가 쓰는 중일 수 있음): 임시 폴더에 새로 빌드해 묶는다.
// 출력: `ZIP ok: <경로> <바이트>` (1MB 넘거나 실패하면 exit 1)
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const app = resolve(fileURLToPath(new URL('..', import.meta.url)));
const out = resolve(app, '../제출본/callout-rush-web.zip');
const work = mkdtempSync(join(tmpdir(), 'callout-zip-'));
try {
  const pack = join(work, 'callout-rush');
  mkdirSync(pack);
  execFileSync(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--outDir', join(pack, 'dist'), '--emptyOutDir'], { cwd: app, stdio: 'pipe' });
  for (const f of ['serve.mjs', 'start.command', 'start.bat', 'README.txt']) cpSync(join(app, 'zip', f), join(pack, f));
  mkdirSync(resolve(app, '../제출본'), { recursive: true });
  rmSync(out, { force: true });
  execFileSync('zip', ['-r', '-X', out, 'callout-rush'], { cwd: work, stdio: 'pipe' });
  const size = statSync(out).size;
  if (size > 1024 * 1024) throw new Error(`zip ${size} 바이트 > 1MB`);
  console.log(`ZIP ok: ${out} ${size}`);
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}
