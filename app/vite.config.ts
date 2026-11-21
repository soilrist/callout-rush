import { defineConfig, type Plugin } from 'vite';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

function listFiles(dir: string, root: string): string[] {
  return readdirSync(dir).sort().flatMap((n) => {
    const p = resolve(dir, n);
    return statSync(p).isDirectory() ? listFiles(p, root) : [`./${p.slice(root.length + 1)}`];
  });
}

/** 빌드가 끝나면 dist/sw.js 의 자리표시를 "저장할 파일 목록 + 버전" 으로 바꾼다 (버전 = 목록과 파일 이름의 해시 → 내용이 바뀌면 새 버전). */
function precache(): Plugin {
  let outDir = 'dist';
  return {
    name: 'callout-precache',
    apply: 'build',
    configResolved(c) { outDir = resolve(c.root, c.build.outDir); },
    closeBundle() {
      const files = ['./', ...listFiles(outDir, outDir).filter((f) => f !== './sw.js')];
      const path = resolve(outDir, 'sw.js');
      const version = createHash('sha1').update(files.join('\n')).digest('hex').slice(0, 10);
      const list = JSON.stringify(files);
      const src = readFileSync(path, 'utf8').replace('__SW_VERSION__', version).replace('__SW_FILES__', list);
      writeFileSync(path, src);
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [precache()],
  build: {
    rollupOptions: {
      input: {
        index: fileURLToPath(new URL('./index.html', import.meta.url)),
        board: fileURLToPath(new URL('./board.html', import.meta.url)),
      },
    },
  },
});
