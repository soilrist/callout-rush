// 사용: npm run sfxtrack — captures/tmp/video/sfx.json 의 시각표를 OfflineAudioContext 로 한 번에 그려 sfx.wav(48kHz 모노 16비트) 로 쓴다.
// 먼저 npm run videorec 로 sfx.json 을 만들어 둔다. 출력: `SFXTRACK ok: ...`
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import ts from 'typescript';
import { chromium } from 'playwright';

const dir = resolve(process.cwd(), '..', 'captures/tmp/video');
const jsonPath = resolve(dir, 'sfx.json');
if (!existsSync(jsonPath)) { console.error('sfx.json 없음 — 먼저 npm run videorec'); process.exit(1); }
const events = JSON.parse(readFileSync(jsonPath, 'utf8'));
if (!events.length) { console.error('sfx.json 이 비어 있음'); process.exit(1); }
const src = readFileSync(new URL('../src/audio/sfx.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const RATE = 48000;
const secs = Math.ceil(Math.max(...events.map((e) => e.t)) + 1.5);
const browser = await chromium.launch();
let code = 0;
try {
  const page = await browser.newPage();
  const arr = await page.evaluate(async ({ js, events, rate, secs }) => {
    const mod = await import(URL.createObjectURL(new Blob([js], { type: 'text/javascript' })));
    const ctx = new OfflineAudioContext(1, rate * secs, rate);
    for (const e of events) mod.scheduleSfx(ctx, ctx.destination, e.id, e.t, e.opts ?? {});
    const d = (await ctx.startRendering()).getChannelData(0);
    const pcm = new Int16Array(d.length);
    for (let i = 0; i < d.length; i++) pcm[i] = Math.max(-1, Math.min(1, d[i])) * 32767;
    const u8 = new Uint8Array(pcm.buffer);
    let bin = '';
    for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode(...u8.subarray(i, i + 0x8000));
    return btoa(bin);
  }, { js, events, rate: RATE, secs });
  const data = Buffer.from(arr, 'base64');
  const h = Buffer.alloc(44);
  h.write('RIFF', 0); h.writeUInt32LE(36 + data.length, 4); h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(data.length, 40);
  writeFileSync(resolve(dir, 'sfx.wav'), Buffer.concat([h, data]));
  console.log(`SFXTRACK ok: 소리 ${events.length}개, ${secs}초, ${RATE}Hz → captures/tmp/video/sfx.wav`);
} catch (e) { console.error(e); code = 1; } finally { await browser.close(); }
process.exit(code);
