#!/usr/bin/env node
/**
 * Render the Jev explainer at 2K (or any scale) with real-time progress.
 *
 * Usage:
 *   node scripts/render_2k.mjs --output /content/jev_2k.mp4
 *   node scripts/render_2k.mjs --scale 1.3333333 --concurrency 2 --crf 16
 *   node scripts/render_2k.mjs --frames 0-149 --output /content/test.mp4
 *
 * The output is 2560x1440 at the default scale (4/3 of the 1920x1080 master).
 */
import path from 'node:path';
import fs from 'node:fs';
import {bundle} from '@remotion/bundler';
import {ensureBrowser, renderMedia, selectComposition} from '@remotion/renderer';

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : fallback;
};

const project = path.resolve(arg('project', process.cwd()));
const output = path.resolve(arg('output', path.join(project, 'out', 'jev_2k.mp4')));
const scale = Number(arg('scale', String(2560 / 1920)));
const concurrency = Number(arg('concurrency', '2'));
const crf = Number(arg('crf', '16'));
const jpegQuality = Number(arg('jpeg-quality', '95'));
const framesArg = arg('frames', '');
const audioBitrate = arg('audio-bitrate', '192k');
const requestedBrowser = arg('browser', process.env.REMOTION_BROWSER_EXECUTABLE || '');

const fmt = (seconds) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}s`;
};

fs.mkdirSync(path.dirname(output), {recursive: true});

console.log('[jev] ─────────────────────────────────────────────');
console.log(`[jev] project        ${project}`);
console.log(`[jev] output         ${output}`);
console.log(`[jev] scale          ${scale.toFixed(6)} → ${Math.round(1920 * scale)}×${Math.round(1080 * scale)}`);
console.log(`[jev] concurrency    ${concurrency}`);
console.log(`[jev] crf            ${crf}`);
if (framesArg) console.log(`[jev] frame range    ${framesArg}`);
console.log('[jev] ─────────────────────────────────────────────');

const started = Date.now();

console.log('[browser] ensuring a headless Chrome is available…');
const browserStatus = await ensureBrowser({
  browserExecutable: requestedBrowser || null,
});
if (browserStatus.type === 'no-browser' || browserStatus.type === 'version-mismatch') {
  throw new Error(`No usable Chrome found (${browserStatus.type}). Run: npx remotion browser ensure`);
}
const browserExecutable = browserStatus.path;
console.log(`[browser] ${browserStatus.type}: ${browserExecutable}`);

console.log('[bundle] bundling the Remotion project…');
let lastBundle = -1;
const serveUrl = await bundle({
  entryPoint: path.join(project, 'src/index.ts'),
  publicDir: path.join(project, 'public'),
  onProgress: (progress) => {
    if (progress >= lastBundle + 20 || progress === 100) {
      lastBundle = progress;
      console.log(`[bundle] ${progress}%`);
    }
  },
});

const composition = await selectComposition({
  serveUrl,
  id: 'Jev',
  browserExecutable,
});

const total = composition.durationInFrames;
const frameRange = framesArg ? framesArg.split('-').map(Number) : null;
const renderCount = frameRange ? frameRange[1] - frameRange[0] + 1 : total;
const minutes = (renderCount / composition.fps / 60).toFixed(2);

console.log(`[render] composition ${composition.width}×${composition.height} @ ${composition.fps} fps`);
console.log(`[render] ${renderCount} frames (${minutes} min) → ${Math.round(composition.width * scale)}×${Math.round(composition.height * scale)}`);
console.log('[render] starting. Progress updates below.');

let lastPct = -1;
let lastStage = '';
let lastPrint = 0;

const onProgress = ({progress, renderedFrames, encodedFrames, stitchStage, renderEstimatedTime}) => {
  const pct = Math.min(100, progress * 100);
  const stage = stitchStage || 'rendering';
  const now = Date.now();
  const pctKey = Math.floor(pct * 10) / 10;
  const shouldPrint = pctKey !== lastPct || stage !== lastStage || now - lastPrint > 15000;

  if (!shouldPrint) return;
  lastPct = pctKey;
  lastStage = stage;
  lastPrint = now;

  const elapsed = (now - started) / 1000;
  const eta = progress > 0.005 ? elapsed / progress - elapsed : 0;
  const est = renderEstimatedTime && renderEstimatedTime > 0 ? ` · remotion-est ${fmt(renderEstimatedTime / 1000)}` : '';
  console.log(
    `[render] ${pct.toFixed(1).padStart(5)}% · frames ${String(renderedFrames).padStart(5)}/${renderCount}` +
      ` · encoded ${String(encodedFrames).padStart(5)} · ${stage}` +
      ` · elapsed ${fmt(elapsed)} · ETA ${fmt(eta)}${est}`,
  );
};

await renderMedia({
  composition,
  serveUrl,
  codec: 'h264',
  outputLocation: output,
  scale,
  concurrency,
  crf,
  imageFormat: 'jpeg',
  jpegQuality,
  pixelFormat: 'yuv420p',
  audioCodec: 'aac',
  audioBitrate,
  frameRange,
  browserExecutable,
  overwrite: true,
  onProgress,
});

const sizeMb = fs.statSync(output).size / 1024 / 1024;
console.log('[jev] ─────────────────────────────────────────────');
console.log(`[done] ${output}`);
console.log(`[done] ${sizeMb.toFixed(1)} MB · ${fmt((Date.now() - started) / 1000)} total`);
console.log('[jev] ─────────────────────────────────────────────');
