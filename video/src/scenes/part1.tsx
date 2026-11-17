import React from 'react';
import {useCurrentFrame, useVideoConfig, spring} from 'remotion';
import {Scene, Svg} from '../Scene';
import {C} from '../theme';
import {scoped} from '../timing';
import {
  Arrow,
  Bot,
  Chip,
  IconMark,
  Panel,
  Pop,
  SChip,
  Stroke,
  T,
  circlePath,
  clamp,
  curvePath,
  easeOut,
  Fig,
  lerp,
  roundRectPath,
  useNow,
  wline,
} from '../lib/ink';
import {Icon, Bar} from '../lib/widgets';

/* ------------------------------------------------------------------ */
/* 01 — meet Jev                                                       */
/* ------------------------------------------------------------------ */

const S1 = 0;
const A1 = scoped(S1);

export const Scene01: React.FC = () => (
  <Scene start={S1} end={10.25}>
    <Svg>
      <Bot x={520} y={560} s={1.5} at={-0.2} mood="wave" />
      <Arrow x1={720} y1={590} x2={890} y2={660} at={4.75} bend={-25} color={C.pink} />
      <Stroke paths={[wline(1070, 483, 1300, 483, 71, 0.9, 2)]} at={A1('jev') + 0.35} dur={0.4} color={C.pink} width={4} />
      <Icon x={270} y={380} kind="spark" s={0.8} at={7.3} accent={C.yellow} />
      <Icon x={800} y={330} kind="spark" s={0.55} at={7.5} accent={C.yellow} />
      <Icon x={300} y={700} kind="spark" s={0.5} at={7.7} accent={C.pink} />
      <Icon x={830} y={790} kind="spark" s={0.45} at={7.9} accent={C.cyan} />
    </Svg>

    <T x={1180} y={395} size={196} font="script" color={C.ink} at={A1('jev')}>
      JEV
    </T>

    <Chip x={420} y={900} w={172} h={62} label="chat" at={A1('chat')} size={42} strike color={C.muted} />
    <Chip x={690} y={900} w={286} h={62} label="write code" at={A1('code')} size={42} strike color={C.muted} />

    <Chip x={1060} y={720} w={172} h={62} label="spam" at={A1('list') + 0.35} size={42} icon="check" selected color={C.red} />
    <Chip x={1280} y={720} w={172} h={62} label="inbox" at={A1('list') + 0.6} size={42} />
    <Chip x={1500} y={720} w={196} h={62} label="positive" at={A1('list') + 0.85} size={42} />
  </Scene>
);

/* ------------------------------------------------------------------ */
/* 02 — what it does                                                   */
/* ------------------------------------------------------------------ */

const S2 = 10.25;
const A2 = scoped(S2);

export const Scene02: React.FC = () => (
  <Scene start={S2} end={16.95}>
    <Svg>
      <Panel x={210} y={360} w={370} h={230} at={S2 - 0.5} fill={C.panel} />
      <Stroke
        paths={[wline(250, 480, 540, 480, 11), wline(250, 518, 500, 518, 12), wline(250, 556, 470, 556, 13)]}
        at={S2 - 0.3}
        dur={0.5}
        color={C.muted}
        width={3}
      />
      <SChip x={300} y={670} w={150} h={58} label="spam" at={A2('options')} size={40} />
      <SChip x={470} y={670} w={150} h={58} label="inbox" at={A2('options') + 0.18} size={40} />
      <SChip x={640} y={670} w={150} h={58} label="other" at={A2('options') + 0.36} size={40} />
      <Arrow x1={690} y1={550} x2={790} y2={550} at={A2('fits') - 0.5} color={C.muted} width={3.2} />
      <Bot x={900} y={555} s={1.0} at={9.7} mood="happy" />
      <Arrow x1={1020} y1={555} x2={1170} y2={555} at={A2('fits') + 0.2} color={C.pink} width={3.6} />
      <Panel x={1200} y={400} w={440} h={310} at={A2('fits') + 0.1} fill={C.panel} accent={C.pink} />
      <Stroke paths={[wline(1250, 686, 1580, 686, 21)]} at={A2('sure') - 0.2} dur={0.4} color={C.comment} width={3} />
      <Stroke paths={[wline(1250, 686, 1540, 686, 22)]} at={A2('sure') - 0.05} dur={0.6} color={C.green} width={7} />
    </Svg>

    <T x={395} y={410} size={54} at={S2 - 0.4}>
      text
    </T>
    <T x={1420} y={520} size={100} font="script" color={C.red} at={A2('fits') + 0.25}>
      spam
    </T>
    <T x={1420} y={620} size={96} font="script" color={C.green} at={A2('sure') + 0.2}>
      98%
    </T>
  </Scene>
);

/* ------------------------------------------------------------------ */
/* 03 — three examples                                                 */
/* ------------------------------------------------------------------ */

const S3 = 16.95;
const A3 = scoped(S3);

const ExampleRow: React.FC<{
  y: number;
  icon: 'envelope' | 'doc' | 'ticket';
  left: string;
  right: string;
  side: 'left' | 'right';
  at: number;
  accent: string;
}> = ({y, icon, left, right, side, at, accent}) => (
  <g>
    <Icon x={640} y={y} kind={icon} s={0.78} at={at} />
    <SChip
      x={960}
      y={y}
      w={268}
      h={72}
      label={left}
      at={at + 0.12}
      size={44}
      selected={side === 'left'}
      color={accent}
      icon={side === 'left' ? 'check' : null}
    />
    <SChip
      x={1260}
      y={y}
      w={268}
      h={72}
      label={right}
      at={at + 0.24}
      size={44}
      selected={side === 'right'}
      color={accent}
      icon={side === 'right' ? 'check' : null}
    />
  </g>
);

export const Scene03: React.FC = () => (
  <Scene start={S3} end={23.05}>
    <Svg>
      <ExampleRow y={320} icon="envelope" left="spam" right="not spam" side="left" at={S3 - 0.2} accent={C.red} />
      <ExampleRow y={560} icon="doc" left="happy" right="angry" side="left" at={A3('happy')} accent={C.green} />
      <ExampleRow y={800} icon="ticket" left="billing" right="tech" side="left" at={A3('billing')} accent={C.orange} />
    </Svg>
  </Scene>
);

/* ------------------------------------------------------------------ */
/* 04 — shrug vs tetris                                                */
/* ------------------------------------------------------------------ */

const S4 = 23.05;
const A4 = scoped(S4);

export const Scene04: React.FC = () => (
  <Scene start={S4} end={31.85}>
    <Svg>
      <Fig x={500} y={760} s={1.25} at={A4('shrugged') - 0.15} pose="shrug" />
      <TetrisMini at={A4('playing')} />
      <Arrow x1={720} y1={870} x2={1350} y2={870} at={A4('same')} color={C.pink} width={3.4} head={16} opacity={0.8} />
      <Icon x={1100} y={250} kind="spark" s={0.65} at={A4('tetris', 2) - 0.2} accent={C.yellow} />
      <Icon x={1510} y={330} kind="spark" s={0.5} at={A4('tetris', 2)} accent={C.cyan} />
      <text x={1350} y={248} textAnchor="middle" dominantBaseline="central" fontFamily="Patrick Hand" fontSize={44} fill={C.cyan} opacity={0.95}>
        TETRIS
      </text>
    </Svg>
    <T x={1035} y={945} size={52} color={C.pink} at={A4('same') + 0.15}>
      same model
    </T>
  </Scene>
);

const TetrisMini: React.FC<{at: number}> = ({at}) => {
  const cell = 30;
  const x = 1200;
  const y = 300;
  const blocks = [
    {c: 0, r: 14, color: C.comment},
    {c: 1, r: 14, color: C.comment},
    {c: 2, r: 14, color: C.comment},
    {c: 0, r: 13, color: C.purple},
    {c: 1, r: 13, color: C.purple},
    {c: 2, r: 13, color: C.purple},
    {c: 2, r: 12, color: C.cyan},
    {c: 3, r: 14, color: C.cyan},
    {c: 3, r: 13, color: C.cyan},
    {c: 3, r: 12, color: C.cyan},
    {c: 6, r: 14, color: C.orange},
    {c: 7, r: 14, color: C.orange},
    {c: 7, r: 13, color: C.orange},
  ];
  return (
    <g>
      <Board cell={cell} x={x} y={y} at={at} blocks={blocks} />
      <FallingPiece x={x} y={y} cell={cell} at={at + 0.3} />
    </g>
  );
};

const Board: React.FC<{x: number; y: number; cell: number; at: number; blocks: {c: number; r: number; color: string}[]}> = ({
  x,
  y,
  cell,
  at,
  blocks,
}) => {
  const w = 10 * cell;
  const h = 16 * cell;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={C.well} fillOpacity={0.8} />
      <Stroke paths={[roundRectPath(x, y, w, h, 10, 41, 0.6)]} at={at} dur={0.5} color={C.ink} width={4} />
      {Array.from({length: 9}).map((_, i) => (
        <line key={i} x1={x + (i + 1) * cell} y1={y + 6} x2={x + (i + 1) * cell} y2={y + h - 6} stroke={C.ink} strokeWidth={1} opacity={0.08} />
      ))}
      {Array.from({length: 15}).map((_, i) => (
        <line key={i} x1={x + 6} y1={y + (i + 1) * cell} x2={x + w - 6} y2={y + (i + 1) * cell} stroke={C.ink} strokeWidth={1} opacity={0.08} />
      ))}
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={x + b.c * cell + 3} y={y + b.r * cell + 3} width={cell - 6} height={cell - 6} rx={4} fill={b.color} opacity={0.9} />
          <rect x={x + b.c * cell + 3} y={y + b.r * cell + 3} width={cell - 6} height={8} rx={3} fill={C.ink} opacity={0.22} />
        </g>
      ))}
    </g>
  );
};

const FallingPiece: React.FC<{x: number; y: number; cell: number; at: number}> = ({x, y, cell, at}) => {
  const now = useNow();
  if (now < at) return null;
  const p = easeOut((now - at) / 0.55);
  return (
    <g transform={`translate(0 ${(1 - p) * -170})`} opacity={Math.min(1, (now - at) * 4)}>
      <rect x={x + 4 * cell + 3} y={y + 2 * cell + 3} width={cell - 6} height={cell * 2 - 6} rx={4} fill={C.pink} opacity={0.9} />
      <rect x={x + 5 * cell + 3} y={y + 2 * cell + 3} width={cell - 6} height={cell - 6} rx={4} fill={C.pink} opacity={0.9} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 05 — boring or big deal                                             */
/* ------------------------------------------------------------------ */

const S5 = 31.85;
const A5 = scoped(S5);

export const Scene05: React.FC = () => (
  <Scene start={S5} end={36.6}>
    <Svg>
      <Balance at={S5 - 0.4} tiltAt={A5('deal') + 0.05} />
    </Svg>
    <T x={700} y={430} size={78} font="script" color={C.muted} at={A5('boring')}>
      boring
    </T>
    <T x={1220} y={430} size={78} font="script" color={C.pink} at={A5('deal')}>
      a big deal
    </T>
  </Scene>
);

const Balance: React.FC<{at: number; tiltAt: number}> = ({at, tiltAt}) => {
  const now = useNow();
  const a = now < tiltAt ? 0 : 0.13 * easeOut((now - tiltAt) / 0.8);
  const cx = 960;
  const cy = 560;
  const L = 230;
  const ex1 = cx - L * Math.cos(a);
  const ey1 = cy - L * Math.sin(a);
  const ex2 = cx + L * Math.cos(a);
  const ey2 = cy + L * Math.sin(a);
  return (
    <g>
      <Stroke paths={[wline(cx, cy, cx, 820, 21)]} at={at + 0.2} dur={0.4} color={C.ink} width={4} />
      <Stroke paths={[wline(cx - 120, 820, cx + 120, 820, 22)]} at={at + 0.3} dur={0.3} color={C.ink} width={4} />
      <Stroke paths={[wline(ex1, ey1, ex2, ey2, 23, 0.7, 3)]} at={at + 0.1} dur={0.5} color={C.ink} width={4.5} />
      {now > at ? <circle cx={cx} cy={cy} r={9} fill={C.pink} /> : null}
      <Pan x={ex1} y={ey1} at={at + 0.4} />
      <Pan x={ex2} y={ey2} at={at + 0.5} />
    </g>
  );
};

const Pan: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => (
  <g>
    <Stroke paths={[wline(x, y, x, y + 120, Math.round(x))]} at={at} dur={0.3} color={C.muted} width={2.6} />
    <Stroke paths={[curvePath(x - 58, y + 120, x + 58, y + 120, 30, Math.round(x) + 3, 0.7)]} at={at + 0.1} dur={0.35} color={C.ink} width={4} />
  </g>
);

/* ------------------------------------------------------------------ */
/* 06 — history chapter card                                           */
/* ------------------------------------------------------------------ */

const S6 = 36.6;
const A6 = scoped(S6);

export const Scene06: React.FC = () => {
  return (
    <Scene start={S6} end={44.95}>
      <Svg>
        <Stroke paths={[wline(300, 640, 1620, 640, 91, 0.7, 0)]} at={S6 - 0.8} dur={0.8} color={C.muted} width={3} dashed />
        {[420, 1040, 1440].map((x, i) => (
          <Stroke
            key={x}
            paths={[wline(x, 620, x, 660, 93 + i, 0.3, 0)]}
            at={S6 - 0.7 + i * 0.1}
            dur={0.2}
            color={i === 2 ? C.pink : C.muted}
            width={i === 2 ? 5 : 3}
          />
        ))}
        <Bot x={1690} y={720} s={0.42} at={S6 + 0.6} mood="think" />
      </Svg>
      <T x={960} y={330} size={118} font="script" at={S6 - 0.4}>
        a short history
      </T>
      <T x={420} y={720} size={46} at={S6 - 0.6}>
        1960s
      </T>
      <T x={1040} y={720} size={46} color={C.muted} at={S6 - 0.5}>
        2017
      </T>
      <T x={1440} y={720} size={46} color={C.pink} at={S6 - 0.4}>
        2018
      </T>
      <T x={1660} y={550} size={76} font="script" color={C.pink} at={S6 + 3.4}>
        ?
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 07 — classification is sorting                                      */
/* ------------------------------------------------------------------ */

const S7 = 44.95;
const A7 = scoped(S7);

export const Scene07: React.FC = () => (
  <Scene start={S7} end={59.15}>
    <Svg>
      {[
        {x: 860, y: 355, r: 8},
        {x: 930, y: 325, r: -7},
        {x: 1000, y: 355, r: 3},
      ].map((d, i) => (
        <Pop key={i} x={d.x} y={d.y} at={S7 - 0.6 + i * 0.12} from={0.9}>
          <g transform={`rotate(${d.r} ${d.x} ${d.y})`}>
            <Doc x={d.x} y={d.y} at={A7('pile') + i * 0.12} seed={30 + i} s={0.72} />
          </g>
        </Pop>
      ))}
      <Stroke
        paths={[
          wline(810, 430, 1110, 430, 81, 0.8, 4),
          wline(1110, 430, 1025, 565, 82, 0.8, 4),
          wline(810, 430, 895, 565, 83, 0.8, 4),
          wline(895, 565, 1025, 565, 84, 0.8, 2),
        ]}
        at={S7 - 0.8}
        dur={0.7}
        color={C.muted}
        width={3.4}
      />
      <Arrow x1={895} y1={575} x2={575} y2={686} at={A7('spam') - 0.1} color={C.muted} width={3} />
      <Arrow x1={960} y1={575} x2={960} y2={686} at={A7('positive') - 0.1} color={C.muted} width={3} />
      <Arrow x1={1025} y1={575} x2={1345} y2={686} at={A7('billing') - 0.1} color={C.muted} width={3} />
      <FlowBin x={540} y={780} icon="envelope" left="spam" right="inbox" at={A7('spam')} accent={C.red} />
      <FlowBin x={960} y={780} icon="doc" left="good" right="bad" at={A7('positive')} accent={C.green} />
      <FlowBin x={1380} y={780} icon="ticket" left="billing" right="tech" at={A7('billing')} accent={C.orange} />
    </Svg>
    <T x={960} y={170} size={92} font="script" at={S7 - 0.4}>
      sorting
    </T>
  </Scene>
);

const Doc: React.FC<{x: number; y: number; at: number; seed: number; s?: number}> = ({x, y, at, seed, s = 1}) => (
  <g>
    <rect x={x - 44 * s} y={y - 58 * s} width={88 * s} height={116 * s} rx={4} fill={C.panel} />
    <Stroke paths={[roundRectPath(x - 44 * s, y - 58 * s, 88 * s, 116 * s, 4, seed, 0.6)]} at={at} dur={0.35} color={C.ink} width={3.2} />
    <Stroke
      paths={[
        wline(x - 28 * s, y - 28 * s, x + 28 * s, y - 28 * s, seed + 1),
        wline(x - 28 * s, y - 8 * s, x + 28 * s, y - 8 * s, seed + 2),
        wline(x - 28 * s, y + 12 * s, x + 10 * s, y + 12 * s, seed + 3),
      ]}
      at={at + 0.15}
      dur={0.3}
      color={C.muted}
      width={2.6}
    />
  </g>
);

const FlowBin: React.FC<{
  x: number;
  y: number;
  icon: 'envelope' | 'doc' | 'ticket';
  left: string;
  right: string;
  at: number;
  accent: string;
}> = ({x, y, icon, left, right, at, accent}) => (
  <g>
    <Panel x={x - 188} y={y - 20} w={376} h={100} at={at} fill={C.panel} stroke={C.panel2} />
    <Icon x={x} y={y - 86} kind={icon} s={0.62} at={at} accent={accent} />
    <SChip x={x - 92} y={y + 26} w={176} h={58} label={left} at={at + 0.12} size={40} selected color={accent} />
    <SChip x={x + 92} y={y + 26} w={176} h={58} label={right} at={at + 0.24} size={40} />
  </g>
);

/* ------------------------------------------------------------------ */
/* 08 — fixed size input                                               */
/* ------------------------------------------------------------------ */

const S8 = 59.15;
const A8 = scoped(S8);

export const Scene08: React.FC = () => {
  const now = S8 + useCurrentFrame() / 30;
  const rowAt = A8('turn');
  const fill = clamp((now - rowAt) / 1.0);
  const values: (number | string)[] = [0, 2, 0, 1, 0, 0, 0, 0, 0, '…'];
  return (
    <Scene start={S8} end={75.7}>
      <Svg>
        <Doc x={430} y={410} at={S8 + 0.15} seed={51} />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 16 - 16} ${i * 18})`}>
            <Doc x={430} y={715} at={S8 + 0.25 + i * 0.06} seed={61 + i} s={0.92} />
          </g>
        ))}
        <Arrow x1={560} y1={410} x2={990} y2={535} at={A8('fixed') - 0.1} bend={-22} color={C.muted} width={3.2} />
        <Arrow x1={600} y1={740} x2={990} y2={585} at={A8('fixed') + 0.1} bend={22} color={C.muted} width={3.2} />
        <Panel x={1000} y={480} w={740} h={120} at={A8('fixed')} fill={C.panel} accent={C.cyan} />
        {values.map((v, i) => {
          const x = 1040 + i * 68;
          const on = fill > i / values.length;
          const fillCol = i === 1 ? C.green : i === 3 ? C.yellow : v === '…' ? C.cyan : C.muted;
          return (
            <g key={i}>
              <rect x={x} y={510} width={58} height={62} rx={5} fill={on ? fillCol : C.panel2} fillOpacity={on ? 0.16 : 0.25} />
              <Stroke
                paths={[roundRectPath(x, 510, 58, 62, 5, i + 80, 0.4)]}
                at={A8('fixed') + 0.3 + i * 0.03}
                dur={0.16}
                color={on ? fillCol : C.muted}
                width={2.6}
              />
              <text
                x={x + 29}
                y={543}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="Patrick Hand"
                fontSize={40}
                fill={fillCol}
                opacity={on ? 1 : 0}
              >
                {v}
              </text>
            </g>
          );
        })}
      </Svg>
      <T x={960} y={165} size={78} font="script" at={S8 - 0.4}>
        text to numbers
      </T>
      <T x={430} y={315} size={48} at={A8('computers') + 0.3}>
        10 words
      </T>
      <T x={430} y={875} size={48} color={C.pink} at={A8('10', 2) + 0.2}>
        10,000 words
      </T>
      <T x={1400} y={440} size={44} color={C.cyan} at={A8('fixed') + 0.15}>
        fixed size
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 09 — counting a bag of words                                        */
/* ------------------------------------------------------------------ */

const S9 = 75.7;
const A9 = scoped(S9);

const VOCAB = ['free', 'refund', 'winner', 'meeting', 'attached', 'prize'];

export const Scene09: React.FC = () => {
  const words = [2, 1, 0, 0, 0, 0, 0];
  const now = S9 + useCurrentFrame() / 30;
  return (
    <Scene start={S9} end={100}>
      <Svg>
        {VOCAB.map((w, i) => (
          <SChip key={w} x={300 + i * 180} y={300} w={166} h={62} label={w} at={S9 + 0.1 + i * 0.08} size={40} />
        ))}
        <SChip x={1380} y={300} w={120} h={62} label="…" at={S9 + 0.6} size={44} />
        <Panel x={190} y={400} w={400} h={82} at={A9('count') - 0.2} fill={C.panel} />
        <Stroke
          paths={[wline(230, 428, 540, 428, 111), wline(230, 458, 460, 458, 112)]}
          at={A9('count') - 0.05}
          dur={0.3}
          color={C.muted}
          width={2.6}
        />
        <Panel x={1110} y={400} w={620} h={82} at={A9('same') + 0.1} fill={C.well} dashed />
        <Stroke
          paths={[wline(1150, 428, 1690, 428, 113), wline(1150, 458, 1500, 458, 114)]}
          at={A9('same') + 0.25}
          dur={0.3}
          color={C.muted}
          width={2.6}
        />
        <Arrow x1={1420} y1={488} x2={1420} y2={510} at={A9('same') + 0.4} color={C.muted} width={2.8} />
        {Array.from({length: 7}).map((_, i) => (
          <g key={i}>
            <rect x={225 + i * 180} y={520} width={150} height={80} rx={7} fill={C.panel} fillOpacity={0.65} />
            <Stroke paths={[roundRectPath(225 + i * 180, 520, 150, 80, 7, 100 + i, 0.5)]} at={A9('slot') + i * 0.04} dur={0.25} color={C.muted} width={2.8} />
          </g>
        ))}
        {words.map((n, i) => {
          const active = i === 0 || i === 1;
          const at = i === 0 ? A9('free') + 0.1 : i === 1 ? A9('refund') + 0.1 : A9('zeros') + 0.3;
          return (
            <text
              key={i}
              x={300 + i * 180}
              y={560}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Caveat"
              fontWeight={700}
              fontSize={56}
              fill={active ? (i === 0 ? C.green : C.yellow) : C.comment}
              opacity={now >= at ? (active ? 1 : 0.8) : 0}
            >
              {n}
            </text>
          );
        })}
        <text x={1580} y={560} textAnchor="middle" dominantBaseline="central" fontFamily="Patrick Hand" fontSize={42} fill={C.cyan}>
          × 50,000
        </text>
        <Arrow x1={390} y1={482} x2={360} y2={505} at={A9('count')} color={C.pink} width={3.2} />
        <Arrow x1={390} y1={482} x2={500} y2={505} at={A9('count') + 0.15} color={C.pink} width={3.2} />
        <Stroke
          paths={[wline(230, 660, 1430, 660, 88, 0.6, 0)]}
          at={A9('same') + 0.2}
          dur={0.5}
          color={C.yellow}
          width={3}
        />
      </Svg>
      <T x={960} y={150} size={76} font="script" at={S9 - 0.4}>
        count the words
      </T>
      <T x={960} y={760} size={52} color={C.yellow} at={A9('same') + 0.3}>
        same size, every message
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 10 — the bag metaphor                                               */
/* ------------------------------------------------------------------ */

const S10 = 100;
const A10 = scoped(S10);

export const Scene10: React.FC = () => {
  const now = S10 + useCurrentFrame() / 30;
  const wiggle = now > A10('inside') ? Math.sin((now - A10('inside')) * 14) * Math.exp(-(now - A10('inside')) * 2.2) * 4 : 0;
  return (
    <Scene start={S10} end={107.1}>
      <Svg>
        <g transform={`rotate(${wiggle} 960 660)`}>
          <Bag at={A10('bag') + 0.2} />
        </g>
        <DropWord x0={700} y0={300} x1={880} y1={520} at={A10('tossing') + 0.1} label="free" color={C.green} />
        <DropWord x0={1230} y0={300} x1={1050} y1={520} at={A10('tossing') + 0.35} label="refund" color={C.yellow} />
        <DropWord x0={640} y0={300} x1={930} y1={520} at={A10('tossing') + 0.6} label="prize" color={C.pink} />
        <DropWord x0={1300} y0={300} x1={990} y1={520} at={A10('tossing') + 0.85} label="meeting" color={C.cyan} />
      </Svg>
      <T x={960} y={190} size={92} font="script" at={S10 - 0.4}>
        bag of words
      </T>
      <T x={760} y={870} size={54} color={C.green} at={A10('inside') + 0.55}>
        free × 2
      </T>
      <T x={1150} y={870} size={54} color={C.yellow} at={A10('inside') + 0.75}>
        refund × 1
      </T>
    </Scene>
  );
};

const Bag: React.FC<{at: number}> = ({at}) => {
  const body = [
    [760, 500],
    [1160, 500],
    [1105, 810],
    [815, 810],
  ];
  return (
    <g>
      <path d="M760 500 L815 810 L1105 810 L1160 500 Z" fill={C.panel2} fillOpacity={0.35} />
      <Stroke
        paths={[
          wline(760, 500, 815, 810, 111, 0.8, 2),
          wline(1160, 500, 1105, 810, 112, 0.8, 2),
          wline(815, 810, 1105, 810, 113, 0.8, 2),
          wline(760, 500, 1160, 500, 114, 0.8, 3),
        ]}
        at={at}
        dur={0.6}
        color={C.ink}
        width={4}
      />
      <Stroke
        paths={[wline(790, 530, 1130, 530, 115, 0.6, 2), wline(820, 780, 1010, 700, 116, 0.5, 2)]}
        at={at + 0.35}
        dur={0.5}
        color={C.comment}
        width={2.4}
        opacity={0.7}
      />
      <Stroke
        paths={[wline(768, 500, 778, 532, 117, 0.4, 1), wline(1152, 500, 1142, 532, 118, 0.4, 1), wline(778, 532, 1142, 532, 119, 0.5, 0)]}
        at={at + 0.2}
        dur={0.4}
        color={C.muted}
        width={2.4}
      />
    </g>
  );
};

const DropWord: React.FC<{x0: number; y0: number; x1: number; y1: number; at: number; label: string; color: string}> = ({
  x0,
  y0,
  x1,
  y1,
  at,
  label,
  color,
}) => {
  const now = useNow();
  if (now < at) return null;
  const p = easeOut((now - at) / 0.62);
  if (p >= 1) return null;
  const x = lerp(x0, x1, p);
  const y = lerp(y0, y1, p);
  return (
    <g opacity={p > 0.86 ? Math.max(0, (1 - p) / 0.14) : 1} transform={`rotate(${p * 10} ${x} ${y})`}>
      <SChip x={x} y={y} w={170} h={56} label={label} at={-10} size={40} color={color} selected />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 11 — naive bayes / logistic regression                              */
/* ------------------------------------------------------------------ */

const S11 = 107.1;
const A11 = scoped(S11);
export const Scene11: React.FC = () => {
  const now = S11 + useCurrentFrame() / 30;
  const t1 = A11('winner') + 0.1;
  const t2 = A11('attached') + 0.1;
  const a = now < t1 ? 0 : now < t2 ? -0.13 * easeOut((now - t1) / 0.7) : lerp(-0.13, 0.035, easeOut((now - t2) / 0.8));
  const cx = 960;
  const cy = 520;
  const L = 250;
  const ex1 = cx - L * Math.cos(a);
  const ey1 = cy - L * Math.sin(a);
  const ex2 = cx + L * Math.cos(a);
  const ey2 = cy + L * Math.sin(a);
  return (
    <Scene start={S11} end={120.2}>
      <Svg>
        <Stroke paths={[wline(cx, cy, cx, 810, 121)]} at={S11 - 0.4} dur={0.4} color={C.ink} width={4} />
        <Stroke paths={[wline(cx - 130, 810, cx + 130, 810, 122)]} at={S11 - 0.4} dur={0.3} color={C.ink} width={4} />
        <Stroke paths={[wline(ex1, ey1, ex2, ey2, 123, 0.7, 3)]} at={S11 - 0.4} dur={0.5} color={C.ink} width={4.5} />
        <circle cx={cx} cy={cy} r={9} fill={C.yellow} />
        <BayesPan x={ex1} y={ey1} at={S11 + 0.1} label="spam" color={C.red} />
        <BayesPan x={ex2} y={ey2} at={S11 + 0.15} label="inbox" color={C.green} />
        <DropWord x0={500} y0={280} x1={ex1 - 30} y1={ey1 + 110} at={A11('winner') + 0.1} label="winner" color={C.red} />
        <DropWord x0={620} y0={240} x1={ex1 + 34} y1={ey1 + 110} at={A11('prize') + 0.1} label="prize" color={C.red} />
        <DropWord x0={1280} y0={240} x1={ex2 - 28} y1={ey2 + 110} at={A11('attached') + 0.1} label="attached" color={C.green} />
        <DropWord x0={1400} y0={280} x1={ex2 + 32} y1={ey2 + 110} at={A11('meeting') + 0.1} label="meeting" color={C.green} />
      </Svg>
      <T x={ex1} y={790} size={62} font="script" color={C.red} at={S11 + 0.2}>
        spam
      </T>
      <T x={ex2} y={790} size={62} font="script" color={C.green} at={S11 + 0.3}>
        inbox
      </T>
      <T x={960} y={880} size={56} font="script" at={A11('naive')}>
        naive Bayes
      </T>
    </Scene>
  );
};

const BayesPan: React.FC<{x: number; y: number; at: number; label: string; color: string}> = ({x, y, at}) => (
  <g>
    <Stroke paths={[wline(x, y, x, y + 125, Math.round(x))]} at={at} dur={0.3} color={C.muted} width={2.6} />
    <Stroke paths={[curvePath(x - 60, y + 125, x + 60, y + 125, 30, Math.round(x) + 3, 0.7)]} at={at + 0.1} dur={0.35} color={C.ink} width={4} />
  </g>
);

/* ------------------------------------------------------------------ */
/* 12 — it works / 90%                                                 */
/* ------------------------------------------------------------------ */

const S12 = 120.2;
const A12 = scoped(S12);

export const Scene12: React.FC = () => {
  const now = S12 + useCurrentFrame() / 30;
  return (
    <Scene start={S12} end={135.2}>
      <Svg>
        <IconMark x={800} y={180} kind="check" color={C.green} at={S12 - 0.4} size={18} width={4.5} />
        <g opacity={now > A12('movie') ? 0.35 : 1}>
          <Stroke paths={[wline(340, 330, 1580, 330, 131, 0.6, 0)]} at={S12 - 0.8} dur={0.7} color={C.muted} width={3} />
          {[340, 700, 1060, 1420, 1580].map((x, i) => (
            <Stroke key={x} paths={[wline(x, 315, x, 345, 133 + i, 0.2, 0)]} at={S12 - 0.6 + i * 0.08} dur={0.2} color={C.muted} width={2.6} />
          ))}
          <Icon x={400} y={260} kind="envelope" s={0.5} at={A12('filters') - 0.3} />
          <Icon x={560} y={260} kind="envelope" s={0.5} at={A12('filters') - 0.1} color={C.muted} />
        </g>
        <Icon x={590} y={905} kind="clock" s={0.42} at={A12('fast')} />
        <Icon x={960} y={905} kind="coin" s={0.42} at={A12('cheap')} />
        <Icon x={1330} y={905} kind="spark" s={0.5} at={A12('afternoon')} accent={C.yellow} />
      </Svg>
      <Bar x={620} y={760} w={680} h={34} value={0.9} at={A12('movie') + 0.3} dur={0.9} color={C.green} showValue={false} />
      <T x={960} y={560} size={180} font="script" color={C.green} at={A12('movie') + 0.05}>
        90%
      </T>
      <T x={960} y={680} size={50} color={C.muted} at={A12('movie') + 0.25}>
        movie reviews
      </T>
      <T x={400} y={400} size={46} at={S12 - 0.4}>
        1960s
      </T>
      <T x={1580} y={400} size={46} color={C.muted} at={S12 - 0.2}>
        today
      </T>
      <Chip x={590} y={960} w={180} h={58} label="fast" at={A12('fast') + 0.15} size={44} />
      <Chip x={960} y={960} w={190} h={58} label="cheap" at={A12('cheap') + 0.15} size={44} />
      <Chip x={1330} y={960} w={300} h={58} label="one afternoon" at={A12('afternoon') + 0.15} size={44} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 13 — lost word order                                                */
/* ------------------------------------------------------------------ */

const S13 = 135.2;
const A13 = scoped(S13);

export const Scene13: React.FC = () => {
  const now = S13 + useCurrentFrame() / 30;
  const atSame = A13('exact') + 0.2;
  return (
    <Scene start={S13} end={145.6}>
      <Svg>
        <Panel x={170} y={300} w={620} h={130} at={A13('dog')} fill={C.panel} />
        <Panel x={1130} y={300} w={620} h={130} at={A13('man') + 0.15} fill={C.panel} />
        {[0, 1].map((side) => (
          <g key={side}>
            {[0, 1, 1, 0, 2, 0, 1].map((v, i) => (
              <g key={i}>
                <rect x={(side ? 1120 : 200) + i * 88} y={604} width={76} height={76} rx={6} fill={C.panel} />
                <Stroke
                  paths={[roundRectPath((side ? 1120 : 200) + i * 88, 604, 76, 76, 6, 140 + side * 10 + i, 0.4)]}
                  at={atSame + 0.1 + i * 0.03}
                  dur={0.2}
                  color={C.muted}
                  width={2.6}
                />
                <text
                  x={(side ? 1120 : 200) + i * 88 + 38}
                  y={643}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="Patrick Hand"
                  fontSize={42}
                  fill={v === 0 ? C.muted : v === 1 ? C.cyan : C.yellow}
                  opacity={now >= atSame + 0.25 + i * 0.03 ? (v === 0 ? 0.55 : 1) : 0}
                >
                  {v}
                </text>
              </g>
            ))}
          </g>
        ))}
        <Stroke paths={[circlePath(960, 620, 60, 77, -1.0, 6.6, 1)]} at={atSame + 0.5} dur={0.5} color={C.red} width={4} />
      </Svg>
      <T x={480} y={365} size={52} at={A13('dog') + 0.05}>
        the dog bites the man
      </T>
      <T x={1440} y={365} size={52} at={A13('man') + 0.2}>
        the man bites the dog
      </T>
      <T x={960} y={620} size={110} font="script" at={atSame + 0.3}>
        =
      </T>
      <T x={960} y={800} size={62} color={C.red} at={atSame + 0.7}>
        same
      </T>
    </Scene>
  );
};
