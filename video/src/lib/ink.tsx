import React, {createContext, useContext} from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {C} from '../theme';

/* ------------------------------------------------------------------ */
/* time                                                                */
/* ------------------------------------------------------------------ */

export const T0 = createContext(0);

export const useNow = (): number => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t0 = useContext(T0);
  return t0 + f / fps;
};

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
export const easeInOut = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
};

export function prog(at: number, dur: number, now: number) {
  if (now <= at) return 0;
  return easeOut((now - at) / Math.max(0.001, dur));
}

/* ------------------------------------------------------------------ */
/* deterministic randomness                                            */
/* ------------------------------------------------------------------ */

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Pt = [number, number];

/* ------------------------------------------------------------------ */
/* hand-drawn path builders                                            */
/* ------------------------------------------------------------------ */

const pathFrom = (pts: Pt[]) =>
  pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(' ');

export type PathDef = {d: string; len: number};

const mk = (pts: Pt[]): PathDef => {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  }
  return {d: pathFrom(pts), len};
};

export function wline(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed: number,
  amp = 1.1,
  over = 2.5,
): PathDef {
  const r = mulberry32(seed);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const o1 = over * (0.25 + r() * 0.8);
  const o2 = over * (0.25 + r() * 0.8);
  const bow = (r() - 0.5) * amp * 1.6;
  const ph = r() * Math.PI * 2;
  const ph2 = r() * Math.PI * 2;
  const n = Math.max(5, Math.ceil(len / 18));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const along = -o1 + t * (len + o1 + o2);
    const taper = Math.sin(Math.PI * clamp(t));
    const wob =
      taper *
      (bow * Math.sin(Math.PI * t) +
        amp * 0.55 * Math.sin(t * Math.PI * 2.4 + ph) +
        amp * 0.25 * Math.sin(t * Math.PI * 5.1 + ph2));
    pts.push([x1 + ux * along + px * wob, y1 + uy * along + py * wob]);
  }
  return mk(pts);
}

export function wpoly(pts: Pt[], seed: number, amp = 1.0, close = false): PathDef {
  const r = mulberry32(seed);
  const src = close ? [...pts, pts[0]] : pts;
  const out: Pt[] = [];
  const ph = r() * 6.28;
  let total = 0;
  for (let i = 1; i < src.length; i++) total += Math.hypot(src[i][0] - src[i - 1][0], src[i][1] - src[i - 1][1]);
  let walked = 0;
  for (let i = 0; i < src.length - 1; i++) {
    const [ax, ay] = src[i];
    const [bx, by] = src[i + 1];
    const seg = Math.hypot(bx - ax, by - ay) || 1;
    const n = Math.max(1, Math.ceil(seg / 14));
    for (let k = 0; k < n; k++) {
      const t = k / n;
      const u = (walked + seg * t) / (total || 1);
      const taper = Math.sin(Math.PI * clamp(u));
      const wob = amp * taper * (0.6 * Math.sin(u * 11 + ph) + 0.4 * Math.sin(u * 23 + ph * 1.7));
      const nx = -(by - ay) / seg;
      const ny = (bx - ax) / seg;
      out.push([lerp(ax, bx, t) + nx * wob, lerp(ay, by, t) + ny * wob]);
    }
    walked += seg;
  }
  out.push(src[src.length - 1]);
  return mk(out);
}

export function rectPaths(x: number, y: number, w: number, h: number, seed: number, over = 3.5): PathDef[] {
  return [
    wline(x, y, x + w, y, seed + 1, 1.0, over),
    wline(x + w, y, x + w, y + h, seed + 2, 1.0, over),
    wline(x + w, y + h, x, y + h, seed + 3, 1.0, over),
    wline(x, y + h, x, y, seed + 4, 1.0, over),
  ];
}

export function roundRectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  rad: number,
  seed: number,
  amp = 0.7,
): PathDef {
  const r = mulberry32(seed);
  const ph = r() * 6.28;
  const pts: Pt[] = [];
  const push = (px: number, py: number) => pts.push([px, py]);
  const line = (x1: number, y1: number, x2: number, y2: number) => {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const n = Math.max(1, Math.ceil(len / 16));
    for (let i = 0; i <= n; i++) push(lerp(x1, x2, i / n), lerp(y1, y2, i / n));
  };
  const corner = (cx: number, cy: number, a0: number, a1: number) => {
    const n = 12;
    for (let i = 0; i <= n; i++) {
      const a = lerp(a0, a1, i / n);
      push(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
    }
  };
  const R = rad;
  line(x + R, y, x + w - R, y);
  corner(x + w - R, y + R, -Math.PI / 2, 0);
  line(x + w, y + R, x + w, y + h - R);
  corner(x + w - R, y + h - R, 0, Math.PI / 2);
  line(x + w - R, y + h, x + R, y + h);
  corner(x + R, y + h - R, Math.PI / 2, Math.PI);
  line(x, y + h - R, x, y + R);
  corner(x + R, y + R, Math.PI, Math.PI * 1.5);
  // wobble
  const n = pts.length;
  const out = pts.map(([px, py], i) => {
    const u = i / n;
    const taper = Math.sin(Math.PI * clamp(u));
    const wob = amp * taper * (0.7 * Math.sin(u * 19 + ph) + 0.3 * Math.sin(u * 41 + ph));
    const cx0 = x + w / 2;
    const cy0 = y + h / 2;
    const dx = px - cx0;
    const dy = py - cy0;
    const d = Math.hypot(dx, dy) || 1;
    return [px + (dx / d) * wob, py + (dy / d) * wob] as Pt;
  });
  return mk(out);
}

export function circlePath(
  cx: number,
  cy: number,
  rad: number,
  seed: number,
  start = -0.7,
  sweep = Math.PI * 2 + 0.3,
  amp = 1.1,
): PathDef {
  const r = mulberry32(seed);
  const ph = r() * 6.28;
  const n = Math.max(48, Math.ceil(rad * 1.6));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + sweep * t;
    const wob = amp * (0.65 * Math.sin(t * 13 + ph) + 0.35 * Math.sin(t * 29 + ph * 1.7));
    const rr = rad + wob * Math.sin(Math.PI * t);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.995]);
  }
  return mk(pts);
}

export function curvePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bend: number,
  seed: number,
  amp = 0.9,
): PathDef {
  const r = mulberry32(seed);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const cx = (x1 + x2) / 2 + nx * bend;
  const cy = (y1 + y2) / 2 + ny * bend;
  const ph = r() * 6.28;
  const n = Math.max(24, Math.ceil(len / 12));
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const mt = 1 - t;
    const px = mt * mt * x1 + 2 * mt * t * cx + t * t * x2;
    const py = mt * mt * y1 + 2 * mt * t * cy + t * t * y2;
    const wob = amp * Math.sin(Math.PI * t) * (0.7 * Math.sin(t * 13 + ph) + 0.3 * Math.sin(t * 31 + ph));
    pts.push([px + nx * wob, py + ny * wob]);
  }
  return mk(pts);
}

export function arrowPaths(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  seed: number,
  bend = 0,
  head = 17,
  amp = 0.7,
): PathDef[] {
  const shaft = bend === 0 ? wline(x1, y1, x2, y2, seed, amp, 0) : curvePath(x1, y1, x2, y2, bend, seed, amp);
  // tangent at end (approximate using last part of path is hard; use quad control when bent)
  let ax = x2 - x1;
  let ay = y2 - y1;
  if (bend !== 0) {
    const mx = (x1 + x2) / 2 - (y2 - y1) * 0 + (-(y2 - y1) / (Math.hypot(x2 - x1, y2 - y1) || 1)) * bend;
    const my = (y1 + y2) / 2 + ((x2 - x1) / (Math.hypot(x2 - x1, y2 - y1) || 1)) * bend;
    ax = x2 - mx;
    ay = y2 - my;
  }
  const a = Math.atan2(ay, ax);
  const h1 = wline(x2, y2, x2 - Math.cos(a - 0.48) * head, y2 - Math.sin(a - 0.48) * head, seed + 7, 0.4, 0);
  const h2 = wline(x2, y2, x2 - Math.cos(a + 0.48) * head, y2 - Math.sin(a + 0.48) * head, seed + 8, 0.4, 0);
  return [shaft, h1, h2];
}

/* ------------------------------------------------------------------ */
/* stroke rendering                                                    */
/* ------------------------------------------------------------------ */

export const Stroke: React.FC<{
  paths: PathDef[];
  at?: number;
  dur?: number;
  color?: string;
  width?: number;
  opacity?: number;
  cap?: 'round' | 'butt';
  progress?: number;
  dashed?: boolean;
}> = ({paths, at = 0, dur = 0.6, color = C.ink, width = 4, opacity = 1, cap = 'round', progress, dashed}) => {
  const now = useNow();
  const p = progress !== undefined ? clamp(progress) : prog(at, dur, now);
  if (p <= 0) return null;
  const total = paths.reduce((a, b) => a + b.len, 0);
  let walked = 0;
  return (
    <g opacity={opacity}>
      {paths.map((pa, i) => {
        const before = walked;
        walked += pa.len;
        if (dashed) {
          return (
            <path
              key={i}
              d={pa.d}
              fill="none"
              stroke={color}
              strokeWidth={width}
              strokeLinecap={cap}
              strokeLinejoin="round"
              strokeDasharray="9 13"
              opacity={p}
            />
          );
        }
        const local = clamp((p * total - before) / pa.len);
        if (local <= 0) return null;
        return (
          <path
            key={i}
            d={pa.d}
            fill="none"
            stroke={color}
            strokeWidth={width}
            strokeLinecap={cap}
            strokeLinejoin="round"
            pathLength={pa.len}
            strokeDasharray={`${pa.len} ${pa.len}`}
            strokeDashoffset={pa.len * (1 - local)}
          />
        );
      })}
    </g>
  );
};

export const Ink: React.FC<{
  path: PathDef;
  at?: number;
  dur?: number;
  color?: string;
  width?: number;
  opacity?: number;
  progress?: number;
}> = (p) => <Stroke paths={[p.path]} {...p} />;

/* ------------------------------------------------------------------ */
/* pop / fade (SVG groups)                                             */
/* ------------------------------------------------------------------ */

export const Pop: React.FC<{
  x: number;
  y: number;
  at?: number;
  children: React.ReactNode;
  from?: number;
  opacity?: number;
  scale?: number;
}> = ({x, y, at = -10, children, from = 0.9, opacity = 1, scale = 1}) => {
  const now = useNow();
  const {fps} = useVideoConfig();
  if (now < at) return null;
  const s = spring({frame: (now - at) * fps, fps, config: {damping: 15, stiffness: 170, mass: 0.7}});
  const k = (from + (1 - from) * s) * scale;
  const o = Math.min(1, ((now - at) * fps) / 3) * opacity;
  return (
    <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`} opacity={o}>
      {children}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* typography                                                          */
/* ------------------------------------------------------------------ */

export type FontKind = 'hand' | 'script';

export const fontFamily = (font: FontKind) => (font === 'script' ? 'Caveat' : 'Patrick Hand');

export const T: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  font?: FontKind;
  weight?: number;
  opacity?: number;
  rotate?: number;
  at?: number;
  dur?: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  lineHeight?: number;
  style?: React.CSSProperties;
  rise?: number;
  letterSpacing?: number;
}> = ({
  x,
  y,
  children,
  size = 46,
  color = C.ink,
  anchor = 'middle',
  font = 'hand',
  weight,
  opacity = 1,
  rotate = 0,
  at,
  dur = 0.32,
  width,
  align = 'center',
  lineHeight = 1.05,
  style,
  rise = 8,
  letterSpacing,
}) => {
  const now = useNow();
  const local = at === undefined ? 1 : clamp((now - at) / dur);
  if (local <= 0) return null;
  const tr = `translate(${anchor === 'middle' ? '-50%' : anchor === 'end' ? '-100%' : '0'}, -50%) rotate(${rotate}deg) translateY(${(1 - easeOut(local)) * rise}px)`;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: tr,
        opacity: opacity * clamp(local * 2.2),
        fontFamily: fontFamily(font),
        fontSize: size,
        fontWeight: weight ?? (font === 'script' ? 700 : 400),
        color,
        lineHeight,
        whiteSpace: width ? 'pre-wrap' : 'nowrap',
        width,
        textAlign: align,
        letterSpacing: letterSpacing ?? (font === 'script' ? 0.4 : 0.2),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* widgets                                                             */
/* ------------------------------------------------------------------ */

export const Fade: React.FC<{
  at?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  from?: number;
  dur?: number;
}> = ({at = -10, children, style, from = 0, dur = 0.25}) => {
  const now = useNow();
  const local = clamp((now - at) / dur);
  if (local <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute',
        opacity: local,
        transform: `translateY(${(1 - easeOut(local)) * from}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Chip: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: React.ReactNode;
  at?: number;
  color?: string;
  fill?: string;
  stroke?: string;
  size?: number;
  font?: FontKind;
  selected?: boolean;
  strike?: boolean;
  rotate?: number;
  dashed?: boolean;
  icon?: 'check' | 'cross' | null;
}> = ({
  x,
  y,
  w,
  h = 64,
  label,
  at = -10,
  color = C.ink,
  fill,
  stroke,
  size = 42,
  font = 'hand',
  selected,
  strike,
  rotate = 0,
  dashed,
  icon,
}) => {
  const now = useNow();
  const {fps} = useVideoConfig();
  if (now < at) return null;
  const s = spring({frame: (now - at) * fps, fps, config: {damping: 15, stiffness: 190, mass: 0.6}});
  const width = w ?? Math.max(96, String(label).length * size * 0.53 + 44) + (icon ? size * 0.6 : 0);
  const col = selected ? color : C.ink;
  const fillCol = selected ? color : fill ?? C.panel2;
  const path = roundRectPath(0, 0, width, h, 10, Math.round(x * 13 + y * 7 + width), 0.6);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - width / 2,
        top: y - h / 2,
        width,
        height: h,
        transform: `rotate(${rotate}deg) scale(${0.88 + 0.12 * s})`,
        opacity: clamp(((now - at) * fps) / 3),
      }}
    >
      <svg width={width} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path
          d={path.d}
          fill={fillCol}
          fillOpacity={selected ? 0.14 : fill ? 0.55 : 0.28}
          stroke="none"
        />
        <Stroke paths={[path]} at={at} dur={0.24} color={stroke ?? (selected ? color : C.ink)} width={3.2} dashed={dashed} />
        {strike ? (
          <Stroke
            paths={[wline(8, h / 2, width - 8, h / 2, Math.round(x + y + width), 0.9, 1)]}
            at={at + 0.15}
            dur={0.3}
            color={C.red}
            width={4}
          />
        ) : null}
        {icon ? <IconMark x={width - 24} y={h / 2} kind={icon} color={color} at={at + 0.18} size={15} /> : null}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: icon ? 6 : 12,
          paddingRight: icon ? 30 : 14,
          fontFamily: fontFamily(font),
          fontSize: size,
          fontWeight: font === 'script' ? 700 : 400,
          color: col,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          opacity: strike ? 0.75 : 1,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const SChip: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  at?: number;
  color?: string;
  fill?: string;
  stroke?: string;
  size?: number;
  selected?: boolean;
  strike?: boolean;
  rotate?: number;
  icon?: 'check' | 'cross' | null;
  opacity?: number;
  font?: FontKind;
  dashed?: boolean;
}> = ({
  x,
  y,
  w,
  h = 64,
  label,
  at = -10,
  color = C.ink,
  fill = C.panel2,
  stroke,
  size = 42,
  selected,
  strike,
  rotate = 0,
  icon,
  opacity = 1,
  font = 'hand',
  dashed,
}) => {
  const now = useNow();
  if (now < at) return null;
  const width = w ?? Math.max(96, label.length * size * 0.52 + 48) + (icon ? size * 0.5 : 0);
  const path = roundRectPath(x - width / 2, y - h / 2, width, h, 10, Math.round(x * 7 + y * 13 + width), 0.55);
  const col = selected ? color : C.ink;
  return (
    <Pop x={x} y={y} at={at} from={0.9}>
      <g transform={`rotate(${rotate} ${x} ${y})`} opacity={opacity}>
        <path d={path.d} fill={fill} fillOpacity={selected ? 0.15 : 0.3} />
        <Stroke paths={[path]} at={at} dur={0.22} color={stroke ?? (selected ? color : C.ink)} width={3.2} dashed={dashed} />
        {strike ? (
          <Stroke paths={[wline(x - width / 2 + 10, y, x + width / 2 - 10, y, Math.round(x + y), 0.8, 1)]} at={at + 0.12} dur={0.3} color={C.red} width={4} />
        ) : null}
        {icon ? <IconMark x={x + width / 2 - 24} y={y} kind={icon} color={color} at={at + 0.18} size={14} /> : null}
        <text
          x={x - (icon ? 9 : 0)}
          y={y + 1}
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily={fontFamily(font)}
          fontWeight={font === 'script' ? 700 : 400}
          fontSize={size}
          fill={col}
          opacity={strike ? 0.72 : 1}
        >
          {label}
        </text>
      </g>
    </Pop>
  );
};

export const IconMark: React.FC<{
  x: number;
  y: number;
  kind: 'check' | 'cross' | 'arrow' | 'plus' | 'minus';
  color: string;
  at?: number;
  size?: number;
  width?: number;
}> = ({x, y, kind, color, at = -10, size = 16, width = 4}) => {  if (kind === 'check') {
    return (
      <Stroke
        paths={[
          wline(x - size, y, x - size * 0.25, y + size * 0.65, Math.round(x + y), 0.4, 0),
          wline(x - size * 0.25, y + size * 0.65, x + size, y - size * 0.75, Math.round(x - y), 0.4, 0),
        ]}
        at={at}
        dur={0.26}
        color={color}
        width={width}
      />
    );
  }
  if (kind === 'cross') {
    return (
      <Stroke
        paths={[
          wline(x - size, y - size, x + size, y + size, Math.round(x + y), 0.4, 0),
          wline(x + size, y - size, x - size, y + size, Math.round(x - y), 0.4, 0),
        ]}
        at={at}
        dur={0.22}
        color={color}
        width={width}
      />
    );
  }
  if (kind === 'plus') {
    return (
      <Stroke
        paths={[
          wline(x - size, y, x + size, y, Math.round(x), 0.3, 0),
          wline(x, y - size, x, y + size, Math.round(y), 0.3, 0),
        ]}
        at={at}
        dur={0.2}
        color={color}
        width={width}
      />
    );
  }
  if (kind === 'minus') {
    return <Stroke paths={[wline(x - size, y, x + size, y, Math.round(x), 0.3, 0)]} at={at} dur={0.2} color={color} width={width} />;
  }
  return null;
};

export const Panel: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  at?: number;
  fill?: string;
  stroke?: string;
  accent?: string;
  children?: React.ReactNode;
  rad?: number;
  draw?: boolean;
  opacity?: number;
  dashed?: boolean;
}> = ({x, y, w, h, at = -10, fill = C.panel, stroke = C.ink, accent, children, rad = 14, draw = true, opacity = 1, dashed}) => {
  const now = useNow();
  if (now < at) return null;
  const path = roundRectPath(x, y, w, h, rad, Math.round(x * 3 + y * 5 + w), 0.8);
  return (
    <g opacity={opacity}>
      <path d={path.d} fill={fill} fillOpacity={0.92} stroke="none" />
      {accent ? <path d={roundRectPath(x, y, 8, h, 4, Math.round(x + y + 3), 0.5).d} fill={accent} /> : null}
      {draw ? (
        <Stroke paths={[path]} at={at} dur={0.42} color={stroke} width={3.3} dashed={dashed} />
      ) : (
        <path d={path.d} fill="none" stroke={stroke} strokeWidth={3.3} opacity={0.9} />
      )}
      {children}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* figures                                                             */
/* ------------------------------------------------------------------ */

export const Fig: React.FC<{
  x: number;
  y: number;
  s?: number;
  at?: number;
  pose?: 'stand' | 'shrug' | 'sit' | 'phone' | 'think';
  color?: string;
  accent?: string;
  seed?: number;
  flip?: boolean;
  headTilt?: number;
}> = ({x, y, s = 1, at = -10, pose = 'stand', color = C.ink, accent = C.pink, seed = 5, flip = false, headTilt = 0}) => {
  const now = useNow();
  const bob = Math.sin(now * 1.35 + seed) * 1.4;
  const blink = (now + seed * 0.7) % 4.2 < 0.11;
  const f = flip ? -1 : 1;
  const S = (px: number, py: number): Pt => [x + px * s * f, y + py * s + bob];
  const head: Pt = S(0, -178);
  const neck: Pt = S(0, -150);
  const hip: Pt = S(0, -66);
  const shoulder: Pt = S(0, -138);
  const armL: Pt =
    pose === 'shrug' ? S(-64, -128) : pose === 'phone' ? S(-34, -104) : pose === 'think' ? S(-30, -160) : S(-52, -84);
  const armR: Pt =
    pose === 'shrug' ? S(64, -128) : pose === 'phone' ? S(34, -104) : pose === 'think' ? S(38, -124) : S(52, -84);
  const legL: Pt = pose === 'sit' ? S(-84, -40) : S(-30, 0);
  const legR: Pt = pose === 'sit' ? S(-84, -2) : S(30, 0);
  const headR = 27 * s;
  return (
    <g>
      <Pop x={x} y={y} at={at} from={0.94}>
        <Stroke
          paths={[
            circlePath(head[0], head[1] - headTilt * 0.4, headR, seed + 2, -1.0, 6.6, 0.8),
          ]}
          at={at}
          dur={0.45}
          color={color}
          width={4}
        />
        <Stroke paths={[wline(neck[0], neck[1], hip[0], hip[1], seed + 3, 0.7, 1)]} at={at + 0.1} dur={0.25} color={color} width={4} />
        <Stroke paths={[wline(shoulder[0], shoulder[1], armL[0], armL[1], seed + 4, 0.6, 1)]} at={at + 0.18} dur={0.24} color={color} width={4} />
        <Stroke paths={[wline(shoulder[0], shoulder[1], armR[0], armR[1], seed + 5, 0.6, 1)]} at={at + 0.22} dur={0.24} color={color} width={4} />
        <Stroke paths={[wline(hip[0], hip[1], legL[0], legL[1], seed + 6, 0.6, 1)]} at={at + 0.26} dur={0.24} color={color} width={4} />
        <Stroke paths={[wline(hip[0], hip[1], legR[0], legR[1], seed + 7, 0.6, 1)]} at={at + 0.28} dur={0.24} color={color} width={4} />
        {/* feet */}
        <Stroke paths={[wline(legL[0], legL[1], legL[0] - 15 * f, legL[1], seed + 8, 0.3, 0)]} at={at + 0.38} dur={0.12} color={color} width={4} />
        <Stroke paths={[wline(legR[0], legR[1], legR[0] + 15 * f, legR[1], seed + 9, 0.3, 0)]} at={at + 0.4} dur={0.12} color={color} width={4} />
        {/* face */}
        {blink ? (
          <Stroke
            paths={[
              wline(head[0] - 12 * s, head[1] - 2, head[0] - 4 * s, head[1] - 2, seed + 10, 0.2, 0),
              wline(head[0] + 4 * s, head[1] - 2, head[0] + 12 * s, head[1] - 2, seed + 11, 0.2, 0),
            ]}
            at={at + 0.5}
            dur={0.2}
            color={color}
            width={2.6}
          />
        ) : (
          <g fill={color}>
            <circle cx={head[0] - 8 * s} cy={head[1] - 2} r={2.6 * s} />
            <circle cx={head[0] + 8 * s} cy={head[1] - 2} r={2.6 * s} />
          </g>
        )}
        {pose === 'shrug' ? (
          <Stroke paths={[wline(head[0] - 8 * s, head[1] + 12 * s, head[0], head[1] + 8 * s, seed + 12, 0.2, 0)]} at={at + 0.55} dur={0.16} color={color} width={2.4} />
        ) : (
          <Stroke paths={[curvePath(head[0] - 7 * s, head[1] + 9 * s, head[0] + 7 * s, head[1] + 9 * s, 2 * s, seed + 12, 0.2)]} at={at + 0.52} dur={0.2} color={color} width={2.4} />
        )}
        {pose === 'phone' ? (
          <Stroke paths={[rectPaths(S(28, -120)[0], S(28, -120)[1], 22 * s, 34 * s, seed + 20, 1)[0]]} at={at + 0.5} dur={0.2} color={accent} width={3} />
        ) : null}
        {pose === 'shrug' ? (
          <g>
            <Stroke paths={[wline(armL[0], armL[1], armL[0] - 12 * f, armL[1] - 16 * s, seed + 14, 0.4, 0)]} at={at + 0.35} dur={0.16} color={color} width={3} />
            <Stroke paths={[wline(armR[0], armR[1], armR[0] + 12 * f, armR[1] - 16 * s, seed + 15, 0.4, 0)]} at={at + 0.37} dur={0.16} color={color} width={3} />
          </g>
        ) : null}
      </Pop>
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* the Jev robot                                                       */
/* ------------------------------------------------------------------ */

export const Bot: React.FC<{
  x: number;
  y: number;
  s?: number;
  at?: number;
  mood?: 'happy' | 'flat' | 'think' | 'wave';
  color?: string;
  screen?: string;
  accent?: string;
}> = ({x, y, s = 1, at = -10, mood = 'happy', color = C.ink, screen = C.cyan, accent = C.pink}) => {
  const now = useNow();
  const bl = (now + 0.7) % 5.3 < 0.12;
  const wave = mood === 'wave' ? Math.sin(now * 7) * 0.5 : 0;
  const bob = Math.sin(now * 1.7) * 1.2;
  const B = (px: number, py: number) => [x + px * s, y + py * s + bob] as Pt;
  const body = {x: x - 92 * s, y: y - 60 * s + bob, w: 184 * s, h: 152 * s};
  const bodyPath = roundRectPath(body.x, body.y, body.w, body.h, 24 * s, 77, 0.6);
  const scr = {x: x - 68 * s, y: y - 38 * s + bob, w: 136 * s, h: 78 * s};
  const scrPath = roundRectPath(scr.x, scr.y, scr.w, scr.h, 14 * s, 88, 0.5);
  return (
    <Pop x={x} y={y} at={at} from={0.9}>
      {/* antenna */}
      <Stroke paths={[wline(x, y - 60 * s + bob, x, y - 98 * s + bob, 12, 0.4, 0)]} at={at + 0.12} dur={0.24} color={color} width={3.4} />
      <circle cx={x} cy={y - 103 * s + bob} r={7 * s} fill={accent} />
      <circle cx={x} cy={y - 103 * s + bob} r={11 * s} fill={accent} opacity={0.16} />
      {/* arms */}
      <Stroke
        paths={[
          wline(body.x + 4 * s, y - 10 * s + bob, x - 116 * s, y + 26 * s + bob, 21, 0.5, 0),
          wline(x - 116 * s, y + 26 * s + bob, x - 138 * s, y + 58 * s + bob, 25, 0.5, 0),
        ]}
        at={at + 0.22}
        dur={0.3}
        color={color}
        width={3.6}
      />
      <circle cx={x - 141 * s} cy={y + 62 * s + bob} r={6 * s} fill={accent} opacity={0.9} />
      {mood === 'wave' ? (
        <g transform={`rotate(${wave * 16} ${x + 118 * s} ${y - 20 * s})`}>
          <Stroke
            paths={[
              wline(body.x + body.w - 4 * s, y - 10 * s + bob, x + 116 * s, y - 24 * s + bob, 22, 0.5, 0),
              wline(x + 116 * s, y - 24 * s + bob, x + 128 * s, y - 86 * s + bob, 26, 0.5, 0),
            ]}
            at={at + 0.3}
            dur={0.32}
            color={color}
            width={3.6}
          />
          <circle cx={x + 130 * s} cy={y - 91 * s + bob} r={6 * s} fill={accent} />
        </g>
      ) : (
        <>
          <Stroke
            paths={[
              wline(body.x + body.w - 4 * s, y - 10 * s + bob, x + 116 * s, y + 26 * s + bob, 23, 0.5, 0),
              wline(x + 116 * s, y + 26 * s + bob, x + 138 * s, y + 58 * s + bob, 27, 0.5, 0),
            ]}
            at={at + 0.28}
            dur={0.3}
            color={color}
            width={3.6}
          />
          <circle cx={x + 141 * s} cy={y + 62 * s + bob} r={6 * s} fill={accent} opacity={0.9} />
        </>
      )}
      {/* legs */}
      <Stroke paths={[wline(x - 38 * s, body.y + body.h - 4 * s, x - 38 * s, y + 122 * s + bob, 31, 0.4, 0)]} at={at + 0.32} dur={0.2} color={color} width={3.6} />
      <Stroke paths={[wline(x + 38 * s, body.y + body.h - 4 * s, x + 38 * s, y + 122 * s + bob, 32, 0.4, 0)]} at={at + 0.34} dur={0.2} color={color} width={3.6} />
      <Stroke paths={[wline(x - 52 * s, y + 122 * s + bob, x - 24 * s, y + 122 * s + bob, 33, 0.3, 0)]} at={at + 0.42} dur={0.14} color={color} width={3.6} />
      <Stroke paths={[wline(x + 24 * s, y + 122 * s + bob, x + 52 * s, y + 122 * s + bob, 34, 0.3, 0)]} at={at + 0.44} dur={0.14} color={color} width={3.6} />
      {/* body */}
      <path d={bodyPath.d} fill={C.panel2} fillOpacity={0.75} />
      <Stroke paths={[bodyPath]} at={at + 0.04} dur={0.5} color={color} width={4} />
      {/* screen */}
      <path d={scrPath.d} fill={C.well} />
      <Stroke paths={[scrPath]} at={at + 0.2} dur={0.36} color={color} width={3} />
      {/* face */}
      {mood === 'flat' ? (
        <Stroke
          paths={[
            wline(scr.x + 32 * s, scr.y + 30 * s, scr.x + 52 * s, scr.y + 30 * s, 41, 0.3, 0),
            wline(scr.x + 84 * s, scr.y + 30 * s, scr.x + 104 * s, scr.y + 30 * s, 42, 0.3, 0),
          ]}
          at={at + 0.45}
          dur={0.2}
          color={screen}
          width={3}
        />
      ) : bl ? (
        <Stroke
          paths={[
            wline(scr.x + 34 * s, scr.y + 30 * s, scr.x + 50 * s, scr.y + 30 * s, 41, 0.2, 0),
            wline(scr.x + 86 * s, scr.y + 30 * s, scr.x + 102 * s, scr.y + 30 * s, 42, 0.2, 0),
          ]}
          at={at + 0.45}
          dur={0.2}
          color={screen}
          width={2.6}
        />
      ) : (
        <g fill={screen}>
          <circle cx={scr.x + 42 * s} cy={scr.y + 30 * s} r={4.2 * s} />
          <circle cx={scr.x + 94 * s} cy={scr.y + 30 * s} r={4.2 * s} />
        </g>
      )}
      {mood === 'think' ? (
        <Stroke paths={[wline(scr.x + 56 * s, scr.y + 52 * s, scr.x + 80 * s, scr.y + 52 * s, 43, 0.2, 0)]} at={at + 0.5} dur={0.2} color={screen} width={3} />
      ) : (
        <Stroke
          paths={[curvePath(scr.x + 52 * s, scr.y + 48 * s, scr.x + 84 * s, scr.y + 48 * s, 8 * s, 44, 0.3)]}
          at={at + 0.5}
          dur={0.24}
          color={screen}
          width={3}
        />
      )}
      {/* badge */}
      <rect x={x - 13 * s} y={body.y + body.h - 20 * s} width={26 * s} height={9 * s} rx={4 * s} fill={accent} opacity={0.85} />
    </Pop>
  );
};

/* ------------------------------------------------------------------ */
/* small drawing helpers                                               */
/* ------------------------------------------------------------------ */

export const Dot: React.FC<{x: number; y: number; r?: number; color?: string; at?: number; opacity?: number}> = ({
  x,
  y,
  r = 6,
  color = C.ink,
  at = -10,
  opacity = 1,
}) => {
  const now = useNow();
  const {fps} = useVideoConfig();
  if (now < at) return null;
  const s = spring({frame: (now - at) * fps, fps, config: {damping: 14, stiffness: 220, mass: 0.5}});
  return <circle cx={x} cy={y} r={r * (0.5 + 0.5 * s)} fill={color} opacity={opacity * s} />;
};

export const Arrow: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  at?: number;
  dur?: number;
  color?: string;
  width?: number;
  bend?: number;
  head?: number;
  seed?: number;
  opacity?: number;
}> = ({x1, y1, x2, y2, at = -10, dur = 0.45, color = C.ink, width = 3.6, bend = 0, head = 17, seed = 1, opacity = 1}) => (
  <Stroke paths={arrowPaths(x1, y1, x2, y2, seed, bend, head)} at={at} dur={dur} color={color} width={width} opacity={opacity} />
);

export const Bracket: React.FC<{
  x1: number;
  x2: number;
  y: number;
  tick?: number;
  color?: string;
  at?: number;
  width?: number;
}> = ({x1, x2, y, tick = 12, color = C.muted, at = -10, width = 3}) => (
  <Stroke
    paths={[wline(x1, y, x2, y, Math.round(x1 + x2 + y), 0.3, 0), wline(x1, y - tick, x1, y + tick, 12, 0.2, 0), wline(x2, y - tick, x2, y + tick, 23, 0.2, 0)]}
    at={at}
    dur={0.3}
    color={color}
    width={width}
  />
);
