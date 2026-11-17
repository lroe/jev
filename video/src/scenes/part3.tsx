import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Scene, Svg} from '../Scene';
import {C} from '../theme';
import {scoped} from '../timing';
import {
  Arrow,
  Bot,
  Fig,
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
  lerp,
  roundRectPath,
  wline,
} from '../lib/ink';
import {Icon, SvgBar, Gauge, DotGrid, Bar} from '../lib/widgets';
import {SLabel, ModelBox} from './part2';

/* ------------------------------------------------------------------ */
/* 29 — the Jev API                                                   */
/* ------------------------------------------------------------------ */

const S29 = 383.9;
const A29 = scoped(S29);

export const Scene29: React.FC = () => {
  const now = S29 + useCurrentFrame() / 30;
  return (
    <Scene start={S29} end={400.55}>
      <Svg>
        <SLabel x={350} y={190} size={44} color={C.pink}>
          TypeSafe AI
        </SLabel>
        <Panel x={180} y={330} w={360} h={210} at={A29('text')} fill={C.panel} />
        <Icon x={280} y={430} kind="doc" s={0.8} at={A29('text') + 0.1} />
        <Stroke paths={[wline(360, 400, 500, 400, 11), wline(360, 430, 480, 430, 12), wline(360, 460, 450, 460, 13)]} at={A29('text') + 0.2} dur={0.4} color={C.muted} width={2.6} />
        <Panel x={180} y={590} w={360} h={110} at={A29('question')} fill={C.panel} />
        <SLabel x={360} y={645} size={40}>
          question
        </SLabel>
        <SChip x={700} y={370} w={170} h={56} label="spam" at={A29('answers')} size={36} />
        <SChip x={700} y={455} w={170} h={56} label="inbox" at={A29('answers') + 0.12} size={36} />
        <SChip x={700} y={540} w={170} h={56} label="other" at={A29('answers') + 0.24} size={36} />
        <Arrow x1={540} y1={470} x2={790} y2={470} at={A29('send') + 0.2} color={C.muted} width={3.2} />
        <Arrow x1={540} y1={645} x2={800} y2={615} at={A29('question') + 0.3} color={C.muted} width={2.8} bend={-14} />
        <Bot x={910} y={500} s={0.85} at={S29 - 0.4} mood="happy" />
        <Arrow x1={1030} y1={500} x2={1150} y2={500} at={A29('pick')} color={C.pink} width={3.2} />
        <Panel x={1170} y={330} w={440} h={340} at={A29('pick') - 0.1} fill={C.panel} accent={C.pink} />
        <SLabel x={1390} y={430} size={54} script color={C.green}>
          positive
        </SLabel>
        <SLabel x={1390} y={530} size={100} script color={C.green}>
          96%
        </SLabel>
        <SvgBar x={1230} y={600} w={320} h={24} value={0.96} at={A29('probabilities')} dur={0.7} color={C.green} />
        <g opacity={now > A29('luna') - 0.2 ? 1 : 0}>
          <SLabel x={1650} y={470} size={44} color={C.muted}>
            =
          </SLabel>
          <Icon x={1730} y={450} kind="moon" s={0.9} at={A29('luna')} accent={C.purple} bg={C.bg} />
          <SLabel x={1730} y={570} size={42} color={C.purple}>
            Luna
          </SLabel>
          <SChip x={1730} y={690} w={170} h={56} label="fast" at={A29('faster')} size={36} selected color={C.green} />
          <SChip x={1730} y={770} w={170} h={56} label="cheap" at={A29('cheaper')} size={36} selected color={C.green} />
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 30 — three question types                                          */
/* ------------------------------------------------------------------ */

const S30 = 400.55;
const A30 = scoped(S30);

const TypeCard: React.FC<{x: number; title: string; color: string; at: number; active: boolean; children: React.ReactNode}> = ({
  x,
  title,
  color,
  at,
  active,
  children,
}) => (
  <g>
    <Panel x={x} y={330} w={520} h={430} at={at} fill={C.panel} stroke={active ? color : C.comment} />
    <SLabel x={x + 260} y={390} size={56} script color={color}>
      {title}
    </SLabel>
    {children}
  </g>
);

export const Scene30: React.FC = () => {
  const now = S30 + useCurrentFrame() / 30;
  const c1 = A30('choice');
  const c2 = A30('noul');
  const c3 = A30('score');
  const active = now < c2 ? 0 : now < c3 ? 1 : 2;
  return (
    <Scene start={S30} end={422.6}>
      <Svg>
        <TypeCard x={80} title="Choice" color={C.pink} at={S30 - 0.4} active={active === 0}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Panel x={140} y={450 + i * 86} w={400} h={64} at={c1 + 0.15 + i * 0.1} fill={C.well} stroke={i === 0 ? C.pink : C.comment} />
              <SLabel x={340} y={483 + i * 86} size={36} color={i === 0 ? C.pink : C.muted}>
                {['option A', 'option B', 'option C'][i]}
              </SLabel>
              {i === 0 ? <IconMark x={500} y={482} kind="check" color={C.pink} at={c1 + 0.5} size={14} /> : null}
            </g>
          ))}
        </TypeCard>
        <TypeCard x={700} title="Noul" color={C.cyan} at={S30 - 0.4} active={active === 1}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Panel x={760} y={450 + i * 82} w={400} h={60} at={c2 + 0.1 + i * 0.1} fill={C.well} stroke={C.comment} />
              <circle cx={800} cy={480 + i * 82} r={16} fill={i < 2 ? C.cyan : C.comment} opacity={0.85} />
              <SLabel x={980} y={481 + i * 82} size={36} color={C.muted}>
                yes
              </SLabel>
              <SLabel x={1100} y={481 + i * 82} size={36} color={C.muted}>
                no
              </SLabel>
            </g>
          ))}
          <SLabel x={960} y={720} size={38} color={C.cyan}>
            0.82
          </SLabel>
        </TypeCard>
        <TypeCard x={1320} title="Score" color={C.yellow} at={S30 - 0.4} active={active === 2}>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Panel x={1380 + i * 160} y={470} w={130} h={130} at={c3 + 0.1 + i * 0.1} fill={C.well} stroke={i === 2 ? C.yellow : C.comment} />
              <SLabel x={1445 + i * 160} y={535} size={54} script color={i === 2 ? C.yellow : C.muted}>
                {i}
              </SLabel>
            </g>
          ))}
        </TypeCard>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 31 — movie review demo                                             */
/* ------------------------------------------------------------------ */

const S31 = 422.6;
const A31 = scoped(S31);

export const Scene31: React.FC = () => {
  return (
    <Scene start={S31} end={440}>
      <Svg>
        <Panel x={170} y={280} w={600} h={520} at={S31 - 0.4} fill={C.panel} />
        <Icon x={270} y={380} kind="doc" s={0.85} at={S31 - 0.3} />
        {[0, 1, 2, 3].map((i) => (
          <Stroke key={i} paths={[wline(340, 360 + i * 36, 710, 360 + i * 36, 21 + i, 0.7, 0)]} at={A31('paste') + 0.25 + i * 0.08} dur={0.3} color={C.muted} width={2.6} />
        ))}
        <SLabel x={470} y={560} size={40} color={C.pink}>
          sentiment?
        </SLabel>
        <SChip x={330} y={650} w={250} h={64} label="unfavorable" at={A31('negative')} size={34} />
        <SChip x={620} y={650} w={230} h={64} label="favorable" at={A31('positive')} size={34} selected color={C.green} />
        <Arrow x1={780} y1={540} x2={900} y2={540} at={A31('comes') - 0.3} color={C.muted} width={3} />
        <Bot x={960} y={540} s={0.8} at={S31 + 0.2} mood="happy" />
        <Arrow x1={1030} y1={540} x2={1130} y2={540} at={A31('comes')} color={C.pink} width={3.2} />
        <Panel x={1150} y={280} w={580} h={520} at={A31('comes') - 0.1} fill={C.panel} accent={C.green} />
        <SLabel x={1440} y={400} size={62} script color={C.green}>
          positive
        </SLabel>
        <SLabel x={1440} y={520} size={110} script color={C.green}>
          96.5%
        </SLabel>
        <SvgBar x={1250} y={620} w={380} h={26} value={0.965} at={A31('comes') + 0.2} dur={0.7} color={C.green} />
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 32 — benchmark                                                     */
/* ------------------------------------------------------------------ */

const S32 = 440;
const A32 = scoped(S32);

export const Scene32: React.FC = () => {
  const now = S32 + useCurrentFrame() / 30;
  return (
    <Scene start={S32} end={466.4}>
      <Svg>
        <SLabel x={600} y={600} size={48} color={C.muted}>
          movie reviews
        </SLabel>
        <SLabel x={600} y={690} size={54} color={C.cyan}>
          25,000
        </SLabel>
        <SChip x={1100} y={380} w={220} h={64} label="20 min" at={A32('minutes')} size={40} />
        <SChip x={1350} y={380} w={220} h={64} label="$0.65" at={A32('cents')} size={40} />
        <g opacity={now > A32('modern') - 0.2 ? 1 : 0}>
          <SLabel x={1000} y={525} size={38} color={C.muted} anchor="start">
            ModernBERT
          </SLabel>
          <SvgBar x={1000} y={560} w={620} h={34} value={0.95} at={A32('modern')} dur={0.8} color={C.muted} />
          <SLabel x={1650} y={577} size={44} color={C.muted}>
            95%
          </SLabel>
          <SLabel x={1650} y={505} size={44} color={C.green}>
            +1.5
          </SLabel>
        </g>
        <g opacity={now > A32('caveats') - 0.2 ? 1 : 0}>
          <Icon x={450} y={870} kind="doc" s={0.55} at={A32('caveats')} color={C.orange} />
          <SLabel x={450} y={950} size={64} script color={C.orange}>
            ?
          </SLabel>
          <Panel x={1170} y={800} w={130} h={58} at={A32('caveats') + 0.1} fill={C.panel} stroke={C.panel2} />
          <Panel x={1370} y={800} w={130} h={58} at={A32('caveats') + 0.2} fill={C.panel} stroke={C.panel2} />
          <Stroke paths={[wline(1195, 820, 1275, 820, 91), wline(1395, 820, 1475, 820, 92)]} at={A32('caveats') + 0.25} dur={0.25} color={C.muted} width={2.2} />
          <Arrow x1={1235} y1={862} x2={1275} y2={870} at={A32('caveats') + 0.35} color={C.muted} width={2.2} head={9} />
          <Arrow x1={1435} y1={862} x2={1395} y2={870} at={A32('caveats') + 0.4} color={C.muted} width={2.2} head={9} />
          <SLabel x={1280} y={920} size={52} script color={C.yellow}>
            96.5
          </SLabel>
          <SLabel x={1400} y={920} size={52} script color={C.yellow}>
            96.4
          </SLabel>
        </g>
      </Svg>
      <T x={600} y={460} size={220} font="script" color={C.green} at={A32('96')}>
        96.5%
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 33 — tetris                                                         */
/* ------------------------------------------------------------------ */

const S33 = 466.4;
const A33 = scoped(S33);

export const Scene33: React.FC = () => {
  const now = S33 + useCurrentFrame() / 30;
  const cell = 30;
  const bx = 1120;
  const by = 300;
  const blocks = [
    ...Array.from({length: 4}).map((_, i) => ({c: i, r: 15, color: C.purple})),
    {c: 0, r: 14, color: C.cyan},
    {c: 1, r: 14, color: C.cyan},
    {c: 1, r: 13, color: C.cyan},
    {c: 3, r: 14, color: C.orange},
    {c: 4, r: 14, color: C.orange},
    {c: 5, r: 14, color: C.orange},
    {c: 6, r: 15, color: C.comment},
    {c: 7, r: 15, color: C.comment},
  ];
  return (
    <Scene start={S33} end={482.6}>
      <Svg>
        <SLabel x={960} y={190} size={48} color={C.muted}>
          the same model
        </SLabel>
        <Panel x={260} y={360} w={300} h={180} at={A33('swap') - 0.2} fill={C.panel} />
        <SLabel x={410} y={430} size={50}>
          move?
        </SLabel>
        <Arrow x1={560} y1={450} x2={680} y2={470} at={A33('swap')} color={C.muted} width={3} />
        <Bot x={760} y={520} s={0.9} at={A33('swap') - 0.2} mood="happy" />
        <rect x={bx} y={by} width={300} height={480} rx={10} fill={C.well} fillOpacity={0.8} />
        <Stroke paths={[roundRectPath(bx, by, 300, 480, 10, 41, 0.6)]} at={A33('same', 1) - 0.2} dur={0.5} color={C.ink} width={4} />
        {Array.from({length: 9}).map((_, i) => (
          <line key={i} x1={bx + (i + 1) * cell} y1={by + 6} x2={bx + (i + 1) * cell} y2={by + 474} stroke={C.ink} strokeWidth={1} opacity={0.08} />
        ))}
        {blocks.map((b, i) => (
          <rect key={i} x={bx + b.c * cell + 3} y={by + b.r * cell + 3} width={cell - 6} height={cell - 6} rx={4} fill={b.color} opacity={0.9} />
        ))}
        <Falling x={bx + 4 * cell} y={by + 4 * cell} cell={cell} at={A33('real')} />
        <SChip x={1560} y={400} w={190} h={54} label="left" at={A33('left')} size={36} />
        <SChip x={1560} y={480} w={190} h={54} label="right" at={A33('right')} size={36} />
        <SChip x={1560} y={560} w={190} h={54} label="rotate" at={A33('rotate')} size={36} />
        <SChip x={1560} y={640} w={190} h={54} label="drop" at={A33('drop')} size={36} />
        <g opacity={now > A33('fine') - 0.2 ? 1 : 0}>
          <Panel x={300} y={700} w={260} h={180} at={A33('fine')} fill={C.panel} stroke={C.comment} />
          <IconMark x={430} y={830} kind="cross" color={C.red} at={A33('fine') + 0.3} size={22} width={4} />
        </g>
      </Svg>
    </Scene>
  );
};

const Falling: React.FC<{x: number; y: number; cell: number; at: number}> = ({x, y, cell, at}) => {
  const now = S33 + useCurrentFrame() / 30;
  if (now < at) return null;
  const p = (now - at) % 2.2 / 2.2;
  const yy = lerp(0, cell * 9, p);
  return (
    <g>
      <rect x={x} y={y + yy} width={cell - 6} height={cell - 6} rx={4} fill={C.pink} />
      <rect x={x + cell} y={y + yy} width={cell - 6} height={cell - 6} rx={4} fill={C.pink} />
      <rect x={x + cell} y={y + yy + cell} width={cell - 6} height={cell - 6} rx={4} fill={C.pink} />
      <rect x={x - cell} y={y + yy + cell} width={cell - 6} height={cell - 6} rx={4} fill={C.pink} />
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 34 — a guess: one output per label                                  */
/* ------------------------------------------------------------------ */

const S34 = 482.6;
const A34 = scoped(S34);

export const Scene34: React.FC = () => {
  const now = S34 + useCurrentFrame() / 30;
  return (
    <Scene start={S34} end={498.05}>
      <Svg>
        <Panel x={380} y={400} w={340} h={280} at={A34('nobody')} fill={C.well} stroke={C.pink} />
        <SLabel x={550} y={540} size={54} script color={C.pink}>
          Jev
        </SLabel>
        <SLabel x={550} y={330} size={110} script color={C.pink}>
          ?
        </SLabel>
        <Arrow x1={730} y1={540} x2={850} y2={540} at={A34('trick')} color={C.muted} width={3.2} />
        <ModelBox x={870} y={430} w={260} h={190} at={A34('output')} label="scorer" accent={C.cyan} layers={2} />
        <SChip x={1260} y={470} w={170} h={56} label="spam" at={A34('output') + 0.2} size={36} />
        <SChip x={1260} y={570} w={170} h={56} label="inbox" at={A34('output') + 0.3} size={36} />
        <Arrow x1={1130} y1={490} x2={1210} y2={480} at={A34('output') + 0.15} color={C.cyan} width={3} />
        <Arrow x1={1130} y1={560} x2={1210} y2={570} at={A34('output') + 0.25} color={C.cyan} width={3} />
        {now > A34('third') - 0.2 ? (
          <g opacity={now > A34('rebuild') ? 0.4 : 1}>
            <SChip x={1260} y={670} w={170} h={56} label="third?" at={A34('third')} size={36} dashed />
            <Arrow x1={1130} y1={600} x2={1210} y2={660} at={A34('third') + 0.1} color={C.comment} width={2.6} />
            {now > A34('rebuild') ? <IconMark x={1420} y={670} kind="cross" color={C.red} at={A34('rebuild')} size={24} width={4.5} /> : null}
          </g>
        ) : null}
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 35 — one output, option in the input                                */
/* ------------------------------------------------------------------ */

const S35 = 498.05;
const A35 = scoped(S35);

export const Scene35: React.FC = () => {
  const now = S35 + useCurrentFrame() / 30;
  return (
    <Scene start={S35} end={513.55}>
      <Svg>
        <Panel x={210} y={380} w={300} h={90} at={A35('option')} fill={C.panel} />
        <SLabel x={360} y={425} size={36} color={C.muted}>
          text
        </SLabel>
        <Panel x={210} y={500} w={300} h={90} at={A35('option') + 0.15} fill={C.panel} />
        <SLabel x={360} y={545} size={36} color={C.muted}>
          question
        </SLabel>
        <Panel x={210} y={620} w={300} h={90} at={A35('option') + 0.3} fill={C.panel} />
        <SLabel x={360} y={665} size={36} color={C.muted}>
          option
        </SLabel>
        <Arrow x1={520} y1={450} x2={680} y2={510} at={A35('option') + 0.45} color={C.muted} width={3} />
        <Arrow x1={520} y1={545} x2={680} y2={545} at={A35('option') + 0.5} color={C.muted} width={3} />
        <Arrow x1={520} y1={665} x2={680} y2={580} at={A35('option') + 0.55} color={C.muted} width={3} />
        <ModelBox x={700} y={460} w={260} h={190} at={S35 - 0.4} label="scorer" accent={C.pink} layers={2} />
        <Arrow x1={970} y1={555} x2={1110} y2={555} at={S35 + 0.55} color={C.pink} width={3.4} />
        <Panel x={1130} y={470} w={300} h={170} at={S35 + 0.55} fill={C.panel} accent={C.green} />
        <g opacity={now > A35('number') - 0.1 ? 1 : 0}>
          <SLabel x={1280} y={555} size={110} script color={C.green}>
            0.9
          </SLabel>
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 36 — passes + softmax                                              */
/* ------------------------------------------------------------------ */

const S36 = 513.55;
const A36 = scoped(S36);

export const Scene36: React.FC = () => {
  const now = S36 + useCurrentFrame() / 30;
  const probs = [0.82, 0.09, 0.09];
  return (
    <Scene start={S36} end={531.2}>
      <Svg>
        {['spam', 'inbox', 'other'].map((w, i) => (
          <g key={w}>
            <Panel x={190} y={360 + i * 150} w={300} h={110} at={S36 - 0.5 + i * 0.1} fill={C.panel} />
            <SLabel x={340} y={415 + i * 150} size={36} color={C.muted}>
              {w}
            </SLabel>
            <Arrow x1={500} y1={415 + i * 150} x2={620} y2={520} at={A36('every') + 0.2 + i * 0.08} color={C.muted} width={2.8} />
          </g>
        ))}
        <ModelBox x={640} y={420} w={240} h={190} at={S36 - 0.5} label="scorer" accent={C.pink} layers={2} />
        {[0.9, 0.1, 0.1].map((v, i) => (
          <SLabel key={i} x={1030} y={420 + i * 120} size={48} script color={C.pink}>
            {v.toFixed(1)}
          </SLabel>
        ))}
        <Arrow x1={900} y1={510} x2={970} y2={510} at={A36('squash')} color={C.muted} width={3} />
        {probs.map((p, i) => (
          <g key={i}>
            <SvgBar x={1120} y={400 + i * 90} w={300} h={44} value={p} at={A36('softmax') + i * 0.1} dur={0.8} color={i === 0 ? C.green : C.comment} />
            <SLabel x={1470} y={422 + i * 90} size={38} color={i === 0 ? C.green : C.muted}>
              {Math.round(p * 100)}%
            </SLabel>
          </g>
        ))}
        <SLabel x={1350} y={690} size={44} script color={C.green}>
          positive
        </SLabel>
        <g opacity={now > A36('three') - 0.2 ? 1 : 0}>
          <SLabel x={760} y={760} size={48} color={C.cyan}>
            × 3
          </SLabel>
          <SLabel x={900} y={760} size={48} color={C.cyan}>
            × 7
          </SLabel>
        </g>
        {now > A36('labels') - 0.2 ? (
          <g>
            <SChip x={760} y={870} w={170} h={54} label="text" at={A36('labels')} size={36} />
            <SChip x={950} y={870} w={190} h={54} label="option" at={A36('labels') + 0.1} size={36} selected color={C.pink} />
            <SChip x={1150} y={870} w={190} h={54} label="question" at={A36('labels') + 0.2} size={36} />
          </g>
        ) : null}
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 37 — data is the hard part                                         */
/* ------------------------------------------------------------------ */

const S37 = 531.2;
const A37 = scoped(S37);

export const Scene37: React.FC = () => {
  const now = S37 + useCurrentFrame() / 30;
  const stage = now < A37('hard') ? 0 : now < A37('better') ? 1 : 2;
  return (
    <Scene start={S37} end={557.95}>
      <Svg>
        <g opacity={stage === 0 ? 1 : 0}>
          <ModelBox x={760} y={450} w={300} h={220} at={S37 - 0.4} label="scorer" accent={C.cyan} layers={2} />
          <SLabel x={910} y={730} size={48} color={C.green}>
            easy
          </SLabel>
        </g>
        <g opacity={stage === 1 ? 1 : 0}>
          <Stroke paths={[wline(250, 560, 1600, 560, 81, 0.6, 0)]} at={A37('synthetic') - 0.3} dur={0.6} color={C.comment} width={3} />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <Panel x={235 + i * 250} y={430} w={210} h={80} at={A37('synthetic') + i * 0.12} fill={C.panel} stroke={C.panel2} />
              <IconMark x={340 + i * 250} y={470} kind="check" color={C.green} at={A37('synthetic') + 0.15 + i * 0.12} size={14} />
              <Stroke paths={[wline(340 + i * 250, 520, 340 + i * 250, 555, 40 + i, 0.3, 0)]} at={A37('synthetic') + i * 0.12} dur={0.2} color={C.comment} width={2} />
            </g>
          ))}
          <SLabel x={960} y={340} size={52} color={C.cyan}>
            data
          </SLabel>
          <SLabel x={960} y={690} size={44} color={C.muted}>
            synthetic
          </SLabel>
        </g>
      </Svg>
      <Bar x={600} y={470} w={540} h={54} value={0.9} at={A37('better')} dur={0.8} color={C.green} label="data" valueLabel="90%" />
      <Bar x={600} y={640} w={360} h={54} value={0.55} at={A37('better') + 0.2} dur={0.8} color={C.muted} label="tweaks" valueLabel="55%" />
      <T x={1050} y={880} size={48} color={C.green} at={A37('better') + 1.6}>
        better data wins
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 38 — probabilities interlude                                        */
/* ------------------------------------------------------------------ */

const S38 = 557.95;
const A38 = scoped(S38);

export const Scene38: React.FC = () => {
  const now = S38 + useCurrentFrame() / 30;
  return (
    <Scene start={S38} end={563.65}>
      <Svg>
        <Gauge x={960} y={620} r={220} value={0.74} color={C.yellow} at={S38 - 0.4} />
        <g opacity={now > S38 + 0.35 ? 1 : 0}>
          <SLabel x={960} y={550} size={150} script color={C.yellow}>
            74%
          </SLabel>
        </g>
      </Svg>
      <T x={960} y={230} size={64} font="script" color={C.pink} at={A38('probabilities')}>
        probabilities
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 39 — calibration                                                   */
/* ------------------------------------------------------------------ */

const S39 = 563.65;
const A39 = scoped(S39);

export const Scene39: React.FC = () => {
  const now = S39 + useCurrentFrame() / 30;
  return (
    <Scene start={S39} end={581.6}>
      <Svg>
        <SLabel x={430} y={360} size={150} script color={C.green}>
          74%
        </SLabel>
        <SLabel x={430} y={460} size={44} color={C.muted}>
          positive
        </SLabel>
        <DotGrid x={900} y={380} cols={10} rows={10} gap={30} r={7} lit={74} at={A39('hundred')} stagger={0.008} />
        <SLabel x={1040} y={730} size={46} color={C.green}>
          calibration
        </SLabel>
        <g opacity={now > A39('bad') - 0.2 ? 1 : 0}>
          <SLabel x={430} y={720} size={100} script color={C.red}>
            99%
          </SLabel>
          <Arrow x1={560} y1={760} x2={760} y2={800} at={A39('bad')} bend={-20} color={C.red} width={3} />
          <SLabel x={430} y={820} size={36} color={C.muted}>
            sounds sure
          </SLabel>
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 40 — 74 vs 54                                                      */
/* ------------------------------------------------------------------ */

const S40 = 581.6;
const A40 = scoped(S40);

export const Scene40: React.FC = () => {
  const now = S40 + useCurrentFrame() / 30;
  const t74 = A40('74');
  const t54 = A40('54');
  const trust = A40('trust');
  const person = A40('person');
  return (
    <Scene start={S40} end={591.6}>
      <Svg>
        <g opacity={now > t74 - 0.2 ? 1 : 0}>
          <Panel x={220} y={340} w={600} h={420} at={t74 - 0.2} fill={C.panel} accent={C.green} />
          <SLabel x={520} y={480} size={150} script color={C.green}>
            74%
          </SLabel>
          <SLabel x={520} y={580} size={48} color={C.muted}>
            positive
          </SLabel>
        </g>
        <g opacity={now > trust - 0.2 ? 1 : 0}>
          <IconMark x={520} y={660} kind="check" color={C.green} at={trust} size={24} width={4.5} />
          <SLabel x={520} y={720} size={38} color={C.green}>
            trust
          </SLabel>
        </g>
        <g opacity={now > t54 - 0.2 ? 1 : 0}>
          <Panel x={1100} y={340} w={600} h={420} at={t54 - 0.2} fill={C.panel} accent={C.orange} />
          <SLabel x={1400} y={480} size={150} script color={C.orange}>
            54%
          </SLabel>
          <SLabel x={1400} y={580} size={48} color={C.muted}>
            positive
          </SLabel>
        </g>
        <g opacity={now > person - 0.2 ? 1 : 0}>
          <Fig x={1400} y={720} s={0.45} at={person} pose="stand" />
          <SLabel x={1400} y={750} size={38} color={C.orange}>
            human
          </SLabel>
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 41 — temperature scaling                                           */
/* ------------------------------------------------------------------ */

const S41 = 591.6;
const A41 = scoped(S41);

export const Scene41: React.FC = () => {
  const now = S41 + useCurrentFrame() / 30;
  const t = clamp((now - A41('changes')) / 1.4);
  const p = lerp(0.74, 0.54, easeOut(t));
  return (
    <Scene start={S41} end={603.4}>
      <Svg>
        <SLabel x={320} y={390} size={40} color={C.muted}>
          scores
        </SLabel>
        <Panel x={220} y={440} w={220} h={170} at={A41('scaling')} fill={C.well} />
        <SLabel x={330} y={510} size={42}>
          2.0
        </SLabel>
        <SLabel x={330} y={570} size={42}>
          0.5
        </SLabel>
        <Arrow x1={470} y1={525} x2={620} y2={525} at={A41('divide') - 0.3} color={C.muted} width={3} />
        <circle cx={760} cy={525} r={86} fill={C.panel} stroke={C.pink} strokeWidth={4} />
        <SLabel x={760} y={525} size={64} script color={C.pink}>
          T
        </SLabel>
        <Stroke paths={[circlePath(760, 525, 110, 72, Math.PI * 0.2, Math.PI * 1.1)]} at={A41('divide') + 0.3} dur={0.5} color={C.ink} width={3} />
        <Arrow x1={870} y1={525} x2={1010} y2={525} at={A41('divide') + 0.5} color={C.muted} width={3} />
        <SvgBar x={1060} y={450} w={420} h={44} value={p} at={A41('divide') + 0.4} dur={0.4} color={C.green} />
        <SvgBar x={1060} y={540} w={420} h={44} value={1 - p} at={A41('divide') + 0.5} dur={0.4} color={C.comment} />
        <SLabel x={1540} y={472} size={40} color={C.green}>
          {Math.round(p * 100)}%
        </SLabel>
        <SLabel x={1540} y={562} size={40} color={C.muted}>
          {Math.round((1 - p) * 100)}%
        </SLabel>
        <SLabel x={1270} y={680} size={46} script color={C.green}>
          positive
        </SLabel>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 42 — RLCD / RLCR                                                   */
/* ------------------------------------------------------------------ */

const S42 = 603.4;
const A42 = scoped(S42);

export const Scene42: React.FC = () => {
  const now = S42 + useCurrentFrame() / 30;
  return (
    <Scene start={S42} end={613.9}>
      <Svg>
        <g opacity={1}>
          <Icon x={540} y={470} kind="shield" s={1.7} at={S42 - 0.4} accent={C.green} />
          <SLabel x={540} y={650} size={48} color={C.green}>
            honesty
          </SLabel>
        </g>
        <g opacity={now > A42('rlcd') - 0.2 ? 1 : 0}>
          <Panel x={800} y={410} w={260} h={170} at={A42('rlcd')} fill={C.panel} />
          <SLabel x={930} y={480} size={52} color={C.pink}>
            RLCD
          </SLabel>
          <Icon x={930} y={530} kind="lock" s={0.55} at={A42('rlcd') + 0.2} color={C.muted} />
        </g>
        <Arrow x1={1080} y1={500} x2={1200} y2={500} at={A42('published') - 0.2} color={C.muted} width={3} />
        <g opacity={now > A42('rlcr') - 0.2 ? 1 : 0}>
          <Panel x={1230} y={400} w={360} h={200} at={A42('rlcr')} fill={C.well} stroke={C.cyan} />
          <SLabel x={1410} y={470} size={56} color={C.cyan}>
            RLCR
          </SLabel>
          <SLabel x={1410} y={550} size={36} color={C.muted}>
            published
          </SLabel>
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 43 — reward formula                                                */
/* ------------------------------------------------------------------ */

const S43 = 613.9;
const A43 = scoped(S43);

export const Scene43: React.FC = () => {
  const now = S43 + useCurrentFrame() / 30;
  const first = A43('normally');
  const second = A43('state');
  return (
    <Scene start={S43} end={629.45}>
      <Svg>
        <SLabel x={360} y={280} size={38} color={C.muted}>
          right
        </SLabel>
        <SLabel x={360} y={370} size={90} script color={C.green}>
          1
        </SLabel>
        <SLabel x={700} y={280} size={38} color={C.muted}>
          wrong
        </SLabel>
        <SLabel x={700} y={370} size={90} script color={C.red}>
          0
        </SLabel>
        {now > A43('subtracts') - 0.2 ? (
          <g>
            <Gauge x={1510} y={760} r={110} value={0.9} color={C.yellow} at={A43('subtracts')} />
            <SLabel x={1510} y={670} size={40} color={C.muted}>
              90%
            </SLabel>
          </g>
        ) : null}
      </Svg>
      <T x={960} y={560} size={58} at={first}>
        reward = <span style={{color: C.green}}>correct</span>
      </T>
      <T x={960} y={650} size={50} at={second}>
        − (confidence − outcome)<sup>2</sup>
      </T>
    </Scene>
  );
};
