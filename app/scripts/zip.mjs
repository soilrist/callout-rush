// Usage: npm run zip  — build the distribution zip → ../제출본/callout-rush-web.zip
// Do not touch dist (another check may be using it): build fresh in a temp folder and zip that.
// Output: `ZIP ok: <path> <bytes>` (exit 1 if over 1MB or on failure)
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
  if (size > 1024 * 1024) throw new Error(`zip ${size} bytes > 1MB`);
  console.log(`ZIP ok: ${out} ${size}`);
} catch (e) {
  console.error(e);
  process.exitCode = 1;
} finally {
  rmSync(work, { recursive: true, force: true });
}
