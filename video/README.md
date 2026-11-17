# Jev — minimalist explainer

Local preview only (no full render was produced).

## Preview

```bash
cd /home/jeevankumar/Videos/jev2/video
npx remotion studio --port 3000
```

Open **http://localhost:3000** and choose the `Jev` composition.

- 1920×1080, 30 fps, 13:14 (794 s)
- Audio: `public/audio.wav`
- Word-level timestamps: `src/words.ts` (from Whisper), used by `at()` / `scoped()` in `src/timing.ts`
- 54 scenes in `src/scenes/part1.tsx` … `part4.tsx`
- Hard cuts with pre-rolled first visuals: the canvas is never blank between scenes
- Palette: Dracula night `#282A36` / ink `#F8F8F2`; Caveat + Patrick Hand

## Handy

- `npx remotion still src/index.ts Jev out/frame.png --frame=1234` for a still
- Scene timing lives in `src/scenes/index.ts`
- All artwork is vector SVG (no image assets)
