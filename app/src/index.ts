import '@fontsource/chakra-petch/latin-500.css';
import '@fontsource/chakra-petch/latin-700.css';
import './style.css';
import { parseParams } from './params';
import { drawMap } from './ui/map';
import { STAGE_H, STAGE_W, fitStage } from './ui/stage';

const params = parseParams(window.location.search);
document.body.dataset['state'] = params.state ?? 'attract';

if (params.state === 'play') {
  const canvas = document.createElement('canvas');
  canvas.width = STAGE_W;
  canvas.height = STAGE_H;
  const fit = fitStage(window.innerWidth, window.innerHeight, 1);
  canvas.style.width = `${fit.width}px`;
  canvas.style.height = `${fit.height}px`;
  document.getElementById('title')?.remove();
  document.body.append(canvas);
  void document.fonts.load('700 28px "Chakra Petch"').then(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#0b1220';
    ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    drawMap(ctx, { labelAlpha: 1 });
  });
}
