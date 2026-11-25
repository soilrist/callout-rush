// Usage: npm run sfxrender — actually render the eight sounds with the browser OfflineAudioContext and measure peak and length.
// Output: `SFX ok: ...` (exit 1 if any one is off)
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { chromium } from 'playwright';

const src = readFileSync(new URL('../src/audio/sfx.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const browser = await chromium.launch();
let code = 0;
try {
  const page = await browser.newPage();
  const rows = await page.evaluate(async (code) => {
    const mod = await import(URL.createObjectURL(new Blob([code], { type: 'text/javascript' })));
    const out = [];
    for (const [id, ms] of Object.entries(mod.SFX_MS)) {
      const rate = 44100;
      const ctx = new OfflineAudioContext(1, Math.ceil(rate * 0.9), rate);
      mod.scheduleSfx(ctx, ctx.destination, id, 0);
      const d = (await ctx.startRendering()).getChannelData(0);
      let peak = 0, last = 0;
      for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; if (a > 0.005) last = i; }
      out.push({ id, ms, peak, lenMs: (last / rate) * 1000 });
    }
    return out;
  }, js);
  for (const r of rows) {
    const ok = r.peak > 0.05 && Math.abs(r.lenMs - r.ms) <= 20;
    console.log(`${r.id}: peak ${r.peak.toFixed(3)} length ${r.lenMs.toFixed(0)}ms (table ${r.ms}ms) ${ok ? 'ok' : 'FAIL'}`);
    if (!ok) code = 1;
  }
  if (code === 0) console.log(`SFX ok: ${rows.length} sounds rendered, peak > 0.05, length within table ±20ms`);
} catch (e) { console.error(e); code = 1; } finally { await browser.close(); }
process.exit(code);
