import {WORDS} from './words';

const cache = new Map<string, string[]>();

export function toks(s: string): string[] {
  if (cache.has(s)) return cache.get(s)!;
  const t = s
    .toLowerCase()
    .replace(/[’']/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
  cache.set(s, t);
  return t;
}

/**
 * Time of a spoken phrase, in seconds from the start of the audio.
 * nth: which occurrence (1-based). after: only accept occurrences starting after this time.
 */
export function at(phrase: string, nth = 1, after = -1): number {
  const q = toks(phrase);
  if (!q.length) return 0;
  let found = 0;

  // exact token-sequence match
  for (let i = 0; i <= WORDS.length - q.length; i++) {
    let ok = true;
    for (let k = 0; k < q.length; k++) {
      if (WORDS[i + k][0] !== q[k]) {
        ok = false;
        break;
      }
    }
    if (ok && WORDS[i][1] >= after) {
      found++;
      if (found === nth) return WORDS[i][1];
    }
  }

  // fallback: token boundaries can differ between script and whisper
  const joined = q.join('');
  if (joined.length >= 4) {
    for (let i = 0; i < WORDS.length; i++) {
      if (WORDS[i][1] < after) continue;
      let acc = '';
      for (let j = i; j < Math.min(WORDS.length, i + q.length + 3); j++) {
        acc += WORDS[j][0];
        if (acc === joined) {
          found++;
          if (found === nth) return WORDS[i][1];
          break;
        }
        if (acc.length >= joined.length) break;
      }
    }
  }

  console.warn(`[timing] phrase not found: "${phrase}" #${nth} after ${after}`);
  return 0;
}

/** Start of a quiet-ish paragraph, handy for chapter cards. */
export const END = 793.54;

/** Scene-scoped lookup: first occurrence after the scene starts. */
export const scoped = (start: number) => (phrase: string, nth = 1) => at(phrase, nth, start - 0.08);
