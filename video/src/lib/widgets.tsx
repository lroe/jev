import React, {useId} from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';
import {Stroke, T, Dot, clamp, easeOut, prog, useNow, roundRectPath, wline, circlePath, curvePath, wpoly, Dot as DotC, Pop} from './ink';

/* ------------------------------------------------------------------ */
/* bars                                                                */
/* ------------------------------------------------------------------ */

export const Bar: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  value: number;
  color?: string;
  at?: number;
  dur?: number;
  label?: string;
  valueLabel?: string;
  labelSize?: number;
  valueSize?: number;
  showValue?: boolean;
  align?: 'left' | 'right';
  muted?: boolean;
}> = ({
  x,
  y,
  w,
  h = 54,
  value,
  color = C.green,
  at = -10,
  dur = 0.8,
  label,
  valueLabel,
  labelSize = 44,
  valueSize = 48,
  showValue = true,
  align = 'left',
  muted,
}) => {
  const now = useNow();
  const id = useId().replace(/:/g, '');
  if (now < at) return null;
  const p = prog(at, dur, now);
  const path = roundRectPath(0, 0, w, h, 9, Math.round(x + y + w), 0.7);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h}}>
      <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <clipPath id={`bar${id}`}>
            <rect x="0" y="0" width={w * Math.min(1, Math.max(0, value)) * p} height={h} rx={8} />
          </clipPath>
        </defs>
        <path d={path.d} fill={C.panel2} fillOpacity={0.45} />
        <rect x={0} y={0} width={w} height={h} fill={color} opacity={muted ? 0.55 : 0.95} clipPath={`url(#bar${id})`} rx={8} />
        <Stroke paths={[path]} at={at} dur={0.35} color={C.ink} width={3} opacity={0.9} />
      </svg>
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: align === 'left' ? 0 : undefined,
            right: align === 'right' ? 0 : undefined,
            top: -labelSize - 4,
            fontFamily: 'Patrick Hand',
            fontSize: labelSize,
            color: C.muted,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
      ) : null}
      {showValue ? (
        <div
          style={{
            position: 'absolute',
            left: align === 'left' ? w + 18 : undefined,
            right: align === 'right' ? w + 18 : undefined,
            top: (h - valueSize * 1.05) / 2,
            fontFamily: 'Caveat',
            fontWeight: 700,
            fontSize: valueSize,
            color,
            whiteSpace: 'nowrap',
          }}
        >
          {valueLabel ?? `${Math.round(value * 100)}%`}
        </div>
      ) : null}
    </div>
  );
};

export const SvgBar: React.FC<{
  x: number;
  y: number;
  w: number;
  h?: number;
  value: number;
  color?: string;
  at?: number;
  dur?: number;
  opacity?: number;
}> = ({x, y, w, h = 44, value, color = C.green, at = -10, dur = 0.8, opacity = 1}) => {
  const now = useNow();
  if (now < at) return null;
  const p = prog(at, dur, now);
  const v = Math.max(0, Math.min(1, value)) * p;
  const path = roundRectPath(x, y, w, h, 8, Math.round(x + y * 3), 0.6);
  const id = `b${Math.round(x)}_${Math.round(y)}_${Math.round(w)}`;
  return (
    <g opacity={opacity}>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w * v} height={h} />
        </clipPath>
      </defs>
      <path d={path.d} fill={C.panel2} fillOpacity={0.45} />
      <rect x={x} y={y} width={w} height={h} fill={color} clipPath={`url(#${id})`} opacity={0.95} />
      <Stroke paths={[path]} at={at} dur={0.35} color={C.ink} width={3} opacity={0.9} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* confidence gauge                                                    */
/* ------------------------------------------------------------------ */

export const Gauge: React.FC<{
  x: number;
  y: number;
  r?: number;
  value: number;
  color?: string;
  at?: number;
  label?: string;
  size?: number;
}> = ({x, y, r = 110, value, color = C.green, at = -10, label, size = 76}) => {
  const now = useNow();
  const {fps} = useVideoConfig();
  if (now < at) return null;
  const s = spring({frame: (now - at) * fps, fps, config: {damping: 18, stiffness: 90, mass: 1}});
  const ang = Math.PI + Math.PI * value * s;
  const arc = circlePath(x, y, r, Math.round(x + y), Math.PI, Math.PI, 0.8);
  return (
    <g>
      <Stroke paths={[arc]} at={at} dur={0.6} color={C.panel2} width={10} />
      <g transform={`rotate(${(ang * 180) / Math.PI + 90} ${x} ${y})`} opacity={clamp((now - at) * 3)}>
        <line x1={x} y1={y} x2={x} y2={y - r * 0.78} stroke={color} strokeWidth={5} strokeLinecap="round" />
        <circle cx={x} cy={y} r={8} fill={color} />
      </g>
      {label ? (
        <T x={x} y={y + 46} size={size} font="script" color={color} at={at + 0.15}>
          {label}
        </T>
      ) : null}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* dot grid (calibration)                                              */
/* ------------------------------------------------------------------ */

export const DotGrid: React.FC<{
  x: number;
  y: number;
  cols?: number;
  rows?: number;
  gap?: number;
  r?: number;
  lit: number;
  litColor?: string;
  dimColor?: string;
  at?: number;
  stagger?: number;
}> = ({x, y, cols = 10, rows = 10, gap = 34, r = 8, lit, litColor = C.green, dimColor = C.panel2, at = -10, stagger = 0.012}) => {
  const now = useNow();
  return (
    <g>
      {Array.from({length: cols * rows}).map((_, i) => {
        const cx = x + (i % cols) * gap;
        const cy = y + Math.floor(i / cols) * gap;
        const t = at + i * stagger;
        if (now < t) return null;
        const isLit = i < lit;
        return <Dot key={i} x={cx} y={cy} r={r} color={isLit ? litColor : dimColor} at={t} opacity={isLit ? 1 : 0.55} />;
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* tetris                                                              */
/* ------------------------------------------------------------------ */

export type Block = {c: number; r: number; color: string};

export const TetrisBoard: React.FC<{
  x: number;
  y: number;
  cell?: number;
  cols?: number;
  rows?: number;
  blocks?: Block[];
  at?: number;
  dim?: number;
}> = ({x, y, cell = 34, cols = 10, rows = 16, blocks = [], at = -10, dim = 0}) => {
  const now = useNow();
  const w = cols * cell;
  const h = rows * cell;
  return (
    <g opacity={1 - dim}>
      <PanelBox x={x} y={y} w={w} h={h} at={at} />
      {Array.from({length: cols - 1}).map((_, i) => (
        <line key={`v${i}`} x1={x + (i + 1) * cell} y1={y + 5} x2={x + (i + 1) * cell} y2={y + h - 5} stroke={C.ink} strokeWidth={1.2} opacity={0.09} />
      ))}
      {Array.from({length: rows - 1}).map((_, i) => (
        <line key={`h${i}`} x1={x + 5} y1={y + (i + 1) * cell} x2={x + w - 5} y2={y + (i + 1) * cell} stroke={C.ink} strokeWidth={1.2} opacity={0.09} />
      ))}
      {blocks.map((b, i) => (
        <g key={i} opacity={now >= at ? 1 : 0}>
          <rect x={x + b.c * cell + 3} y={y + b.r * cell + 3} width={cell - 6} height={cell - 6} rx={4} fill={b.color} opacity={0.9} />
          <rect x={x + b.c * cell + 3} y={y + b.r * cell + 3} width={cell - 6} height={8} rx={4} fill={C.ink} opacity={0.25} />
        </g>
      ))}
    </g>
  );
};

const PanelBox: React.FC<{x: number; y: number; w: number; h: number; at: number}> = ({x, y, w, h, at}) => {
  const p = roundRectPath(x, y, w, h, 12, Math.round(x + y * 2), 0.7);
  return (
    <g>
      <path d={p.d} fill={C.well} fillOpacity={0.75} />
      <Stroke paths={[p]} at={at} dur={0.5} color={C.ink} width={4} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* icons                                                               */
/* ------------------------------------------------------------------ */

export type IconKind =
  | 'envelope'
  | 'doc'
  | 'ticket'
  | 'cloud'
  | 'chip'
  | 'server'
  | 'moon'
  | 'shield'
  | 'lock'
  | 'clock'
  | 'coin'
  | 'bell'
  | 'target'
  | 'spark'
  | 'brain'
  | 'scale'
  | 'arrow'
  | 'check'
  | 'cross';

export const Icon: React.FC<{
  x: number;
  y: number;
  kind: IconKind;
  s?: number;
  at?: number;
  color?: string;
  accent?: string;
  width?: number;
  bg?: string;
}> = ({x, y, kind, s = 1, at = -10, color = C.ink, accent = C.pink, width = 3.4, bg = C.bg}) => {
  const now = useNow();
  if (now < at) return null;
  const stroke = (paths: ReturnType<typeof wline>[], extra?: {color?: string; width?: number}) => (
    <Stroke paths={paths} at={at} dur={0.5} color={extra?.color ?? color} width={extra?.width ?? width} />
  );
  switch (kind) {
    case 'envelope': {
      const w = 96 * s;
      const h = 66 * s;
      const r = roundRectPath(x - w / 2, y - h / 2, w, h, 6, Math.round(x + y), 0.6);
      return (
        <g>
          <path d={r.d} fill={C.panel2} fillOpacity={0.4} />
          <Stroke paths={[r]} at={at} dur={0.4} color={color} width={width} />
          {stroke([wline(x - w / 2 + 3, y - h / 2 + 4, x, y + 8, 4, 0.5, 0), wline(x + w / 2 - 3, y - h / 2 + 4, x, y + 8, 5, 0.5, 0)])}
        </g>
      );
    }
    case 'doc': {
      const w = 78 * s;
      const h = 98 * s;
      const r = roundRectPath(x - w / 2, y - h / 2, w, h, 5, Math.round(x + y), 0.6);
      return (
        <g>
          <path d={r.d} fill={C.panel} fillOpacity={0.7} />
          <Stroke paths={[r]} at={at} dur={0.4} color={color} width={width} />
          {stroke([
            wline(x - w / 2 + 16, y - 24, x + w / 2 - 16, y - 24, 11, 0.6, 0),
            wline(x - w / 2 + 16, y - 4, x + w / 2 - 16, y - 4, 12, 0.6, 0),
            wline(x - w / 2 + 16, y + 16, x + 6, y + 16, 13, 0.6, 0),
          ])}
        </g>
      );
    }
    case 'ticket': {
      const w = 96 * s;
      const h = 62 * s;
      const r = roundRectPath(x - w / 2, y - h / 2, w, h, 7, Math.round(x + y), 0.6);
      return (
        <g>
          <path d={r.d} fill={C.panel2} fillOpacity={0.35} />
          <Stroke paths={[r]} at={at} dur={0.4} color={color} width={width} />
          <Stroke paths={[wline(x - w / 2 + 14, y, x + w / 2 - 14, y, 9, 0.4, 0)]} at={at} dur={0.35} color={color} width={2.2} dashed />
          <circle cx={x - w / 2} cy={y} r={6 * s} fill={bg} stroke={color} strokeWidth={2.4} />
          <circle cx={x + w / 2} cy={y} r={6 * s} fill={bg} stroke={color} strokeWidth={2.4} />
        </g>
      );
    }
    case 'cloud': {
      const d = `M ${x - 66 * s} ${y + 20 * s} C ${x - 88 * s} ${y - 12 * s}, ${x - 52 * s} ${y - 40 * s}, ${x - 22 * s} ${y - 26 * s} C ${x - 10 * s} ${y - 58 * s}, ${x + 42 * s} ${y - 56 * s}, ${x + 48 * s} ${y - 22 * s} C ${x + 84 * s} ${y - 26 * s}, ${x + 92 * s} ${y + 12 * s}, ${x + 64 * s} ${y + 22 * s} Z`;
      return (
        <g>
          <path d={d} fill={C.panel2} fillOpacity={0.35} />
          <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
        </g>
      );
    }
    case 'chip': {
      const w = 72 * s;
      const r = roundRectPath(x - w / 2, y - w / 2, w, w, 8, Math.round(x + y), 0.5);
      return (
        <g>
          <path d={r.d} fill={C.panel2} fillOpacity={0.5} />
          <Stroke paths={[r]} at={at} dur={0.35} color={color} width={width} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Stroke paths={[wline(x - w / 2 - 14, y - 20 + i * 20, x - w / 2, y - 20 + i * 20, 30 + i, 0.3, 0)]} at={at + 0.15} dur={0.2} color={color} width={2.8} />
              <Stroke paths={[wline(x + w / 2, y - 20 + i * 20, x + w / 2 + 14, y - 20 + i * 20, 35 + i, 0.3, 0)]} at={at + 0.15} dur={0.2} color={color} width={2.8} />
            </g>
          ))}
          <rect x={x - 14 * s} y={y - 14 * s} width={28 * s} height={28 * s} rx={4} fill={accent} opacity={0.5} />
        </g>
      );
    }
    case 'server': {
      const w = 70 * s;
      const h = 112 * s;
      const r = roundRectPath(x - w / 2, y - h / 2, w, h, 6, Math.round(x), 0.5);
      return (
        <g>
          <path d={r.d} fill={C.panel} fillOpacity={0.8} />
          <Stroke paths={[r]} at={at} dur={0.4} color={color} width={width} />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Stroke paths={[wline(x - w / 2 + 12, y - h / 2 + 26 + i * 32, x + w / 2 - 12, y - h / 2 + 26 + i * 32, 40 + i, 0.4, 0)]} at={at + 0.15} dur={0.2} color={color} width={2.6} />
              <circle cx={x + w / 2 - 16} cy={y - h / 2 + 18 + i * 32} r={3} fill={accent} />
            </g>
          ))}
        </g>
      );
    }
    case 'moon': {
      return (
        <g>
          <circle cx={x} cy={y} r={58 * s} fill={accent} opacity={0.85} />
          <circle cx={x + 30 * s} cy={y - 16 * s} r={52 * s} fill={bg} />
          <circle cx={x - 18 * s} cy={y + 18 * s} r={4} fill={bg} opacity={0.4} />
        </g>
      );
    }
    case 'shield': {
      const d = `M ${x} ${y - 58 * s} L ${x + 50 * s} ${y - 36 * s} L ${x + 44 * s} ${y + 20 * s} Q ${x + 30 * s} ${y + 52 * s} ${x} ${y + 66 * s} Q ${x - 30 * s} ${y + 52 * s} ${x - 44 * s} ${y + 20 * s} L ${x - 50 * s} ${y - 36 * s} Z`;
      return (
        <g>
          <path d={d} fill={C.panel2} fillOpacity={0.4} />
          <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" />
          <Stroke paths={[wline(x - 18 * s, y + 2, x - 3 * s, y + 18 * s, 21, 0.4, 0), wline(x - 3 * s, y + 18 * s, x + 22 * s, y - 18 * s, 22, 0.4, 0)]} at={at + 0.2} dur={0.3} color={accent} width={width + 0.6} />
        </g>
      );
    }
    case 'lock': {
      const r = roundRectPath(x - 34 * s, y - 6 * s, 68 * s, 56 * s, 7, Math.round(x), 0.5);
      return (
        <g>
          <path d={r.d} fill={C.panel2} fillOpacity={0.5} />
          <Stroke paths={[r]} at={at} dur={0.35} color={color} width={width} />
          <Stroke paths={[circlePath(x, y - 8 * s, 22 * s, 7, Math.PI, Math.PI, 0.5)]} at={at + 0.12} dur={0.35} color={color} width={width} />
          <circle cx={x} cy={y + 16 * s} r={5 * s} fill={accent} />
        </g>
      );
    }
    case 'clock': {
      return (
        <g>
          <Stroke paths={[circlePath(x, y, 46 * s, Math.round(x), -0.8, 6.5, 0.7)]} at={at} dur={0.4} color={color} width={width} />
          <Stroke paths={[wline(x, y, x, y - 26 * s, 3, 0.3, 0), wline(x, y, x + 20 * s, y + 8 * s, 4, 0.3, 0)]} at={at + 0.15} dur={0.25} color={accent} width={width} />
        </g>
      );
    }
    case 'coin': {
      return (
        <g>
          <Stroke paths={[circlePath(x, y, 40 * s, Math.round(x), -0.9, 6.6, 0.6)]} at={at} dur={0.4} color={color} width={width} />
          <Stroke paths={[wline(x, y - 20 * s, x, y + 20 * s, 5, 0.3, 0), wline(x - 12 * s, y - 8 * s, x + 12 * s, y - 8 * s, 6, 0.3, 0), wline(x - 12 * s, y + 8 * s, x + 12 * s, y + 8 * s, 7, 0.3, 0)]} at={at + 0.12} dur={0.25} color={accent} width={width - 0.4} />
        </g>
      );
    }
    case 'bell': {
      const d = `M ${x - 34 * s} ${y + 20 * s} Q ${x - 26 * s} ${y + 4 * s} ${x - 26 * s} ${y - 16 * s} Q ${x - 26 * s} ${y - 46 * s} ${x} ${y - 48 * s} Q ${x + 26 * s} ${y - 46 * s} ${x + 26 * s} ${y - 16 * s} Q ${x + 26 * s} ${y + 4 * s} ${x + 34 * s} ${y + 20 * s} Z`;
      return (
        <g>
          <path d={d} fill={C.panel2} fillOpacity={0.4} />
          <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" />
          <Stroke paths={[curvePath(x - 26 * s, y + 20 * s, x + 26 * s, y + 20 * s, 5 * s, 11, 0.4)]} at={at + 0.12} dur={0.25} color={color} width={width} />
          <circle cx={x} cy={y + 30 * s} r={6 * s} fill={accent} />
        </g>
      );
    }
    case 'target': {
      return (
        <g>
          <Stroke paths={[circlePath(x, y, 46 * s, 1, -0.8, 6.5, 0.7)]} at={at} dur={0.45} color={color} width={width} opacity={0.5} />
          <Stroke paths={[circlePath(x, y, 26 * s, 2, -0.5, 6.4, 0.6)]} at={at + 0.1} dur={0.35} color={color} width={width} />
          <circle cx={x} cy={y} r={7 * s} fill={accent} />
        </g>
      );
    }
    case 'spark': {
      const d = `M ${x} ${y - 30 * s} Q ${x + 5 * s} ${y - 5 * s} ${x + 30 * s} ${y} Q ${x + 5 * s} ${y + 5 * s} ${x} ${y + 30 * s} Q ${x - 5 * s} ${y + 5 * s} ${x - 30 * s} ${y} Q ${x - 5 * s} ${y - 5 * s} ${x} ${y - 30 * s} Z`;
      return (
        <g>
          <path d={d} fill={accent} opacity={0.9} />
          <circle cx={x} cy={y} r={3 * s} fill={C.bg} />
        </g>
      );
    }
    case 'brain': {
      const d = `M ${x - 50 * s} ${y + 6 * s} Q ${x - 70 * s} ${y - 30 * s} ${x - 34 * s} ${y - 40 * s} Q ${x - 28 * s} ${y - 68 * s} ${x} ${y - 54 * s} Q ${x + 30 * s} ${y - 70 * s} ${x + 38 * s} ${y - 38 * s} Q ${x + 72 * s} ${y - 30 * s} ${x + 52 * s} ${y + 4 * s} Q ${x + 44 * s} ${y + 40 * s} ${x + 10 * s} ${y + 34 * s} Q ${x - 12 * s} ${y + 48 * s} ${x - 26 * s} ${y + 28 * s} Q ${x - 44 * s} ${y + 30 * s} ${x - 50 * s} ${y + 6 * s} Z`;
      return (
        <g>
          <path d={d} fill={C.panel2} fillOpacity={0.3} />
          <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinejoin="round" />
          <Stroke paths={[curvePath(x - 20 * s, y - 18 * s, x - 4 * s, y + 20 * s, 12 * s, 31, 0.5), curvePath(x + 4 * s, y - 30 * s, x + 18 * s, y + 6 * s, -10 * s, 32, 0.5)]} at={at + 0.2} dur={0.3} color={accent} width={2.6} opacity={0.9} />
        </g>
      );
    }
    case 'scale': {
      return (
        <g>
          <Stroke paths={[wline(x, y - 42 * s, x, y + 54 * s, 51, 0.4, 0), wline(x - 110 * s, y - 42 * s, x + 110 * s, y - 42 * s, 52, 0.5, 0)]} at={at} dur={0.4} color={color} width={width} />
          {[-1, 1].map((side) => (
            <g key={side}>
              <Stroke paths={[wline(x + side * 96 * s, y - 40 * s, x + side * 96 * s, y + 14 * s, 53 + side, 0.3, 0), curvePath(x + side * 60 * s, y + 14 * s, x + side * 132 * s, y + 14 * s, 12 * s, 55 + side, 0.6)]} at={at + 0.15} dur={0.3} color={color} width={width - 0.4} />
            </g>
          ))}
          <Stroke paths={[wline(x - 52 * s, y + 54 * s, x + 52 * s, y + 54 * s, 57, 0.3, 0)]} at={at + 0.2} dur={0.2} color={color} width={width} />
        </g>
      );
    }
    default:
      return null;
  }
};
