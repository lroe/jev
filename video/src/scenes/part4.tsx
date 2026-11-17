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
  useNow,
} from '../lib/ink';
import {Icon, SvgBar, Gauge, Bar} from '../lib/widgets';
import {SLabel, ModelBox} from './part2';

/* ------------------------------------------------------------------ */
/* 44 — three reward examples                                         */
/* ------------------------------------------------------------------ */

const S44 = 629.45;
const A44 = scoped(S44);

const RewardRow: React.FC<{
  y: number;
  sure: number;
  right: boolean;
  value: string;
  color: string;
  at: number;
  valAt: number;
}> = ({y, sure, right, value, color, at, valAt}) => {
  const now = useNow();
  return (
    <g>
      <Panel x={260} y={y - 70} w={1400} h={140} at={S44 - 0.4} fill={C.panel} stroke={C.panel2} />
      <g opacity={now >= at ? 1 : 0}>
        <SLabel x={450} y={y} size={76} script color={C.ink}>
          {sure}%
        </SLabel>
        <SLabel x={620} y={y} size={38} color={C.muted}>
          sure
        </SLabel>
        <IconMark x={800} y={y} kind={right ? 'check' : 'cross'} color={right ? C.green : C.red} at={at + 0.15} size={22} width={4.5} />
        <SLabel x={960} y={y} size={38} color={right ? C.green : C.red}>
          {right ? 'right' : 'wrong'}
        </SLabel>
        <g opacity={now >= valAt ? 1 : 0}>
          <SLabel x={1250} y={y} size={80} script color={color}>
            {value}
          </SLabel>
        </g>
      </g>
    </g>
  );
};

export const Scene44: React.FC = () => {
  const now = S44 + useCurrentFrame() / 30;
  const s1 = S44 - 0.4;
  const s2 = A44('sure', 2);
  const s3 = A44('sure', 3);
  return (
    <Scene start={S44} end={651.55}>
      <Svg>
        <RewardRow y={300} sure={90} right value="0.99" color={C.green} at={s1} valAt={A44('scores')} />
        <RewardRow y={520} sure={90} right={false} value="−0.81" color={C.red} at={s2} valAt={A44('minus')} />
        <RewardRow y={740} sure={20} right={false} value="−0.04" color={C.orange} at={s3} valAt={A44('minus', 2)} />
        <g opacity={now > A44('honest') - 0.2 ? 1 : 0}>
          <IconMark x={830} y={900} kind="check" color={C.green} at={A44('honest')} size={18} />
          <SLabel x={960} y={900} size={48} color={C.green}>
            honest
          </SLabel>
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 45 — calibration error 0.37 -> 0.03                                */
/* ------------------------------------------------------------------ */

const S45 = 651.55;
const A45 = scoped(S45);

export const Scene45: React.FC = () => {
  const now = S45 + useCurrentFrame() / 30;
  const t03 = A45('dropped') + 1.2;
  return (
  <Scene start={S45} end={659.75}>
    <Svg>
      <SLabel x={960} y={230} size={52} color={C.muted}>
        calibration error
      </SLabel>
      <SLabel x={500} y={540} size={180} script color={C.red}>
        0.37
      </SLabel>
      <SvgBar x={310} y={650} w={380} h={40} value={0.37} at={A45('dropped')} dur={0.8} color={C.red} />
      <Arrow x1={760} y1={540} x2={950} y2={540} at={t03 - 0.5} color={C.muted} width={4} />
      <g opacity={now > t03 - 0.15 ? 1 : 0}>
        <SLabel x={1420} y={540} size={180} script color={C.green}>
          0.03
        </SLabel>
      </g>
      <g opacity={now > A45('accuracy') - 0.2 ? 1 : 0}>
        <SLabel x={960} y={800} size={46} color={C.muted}>
          same accuracy
        </SLabel>
      </g>
      <SvgBar x={1230} y={650} w={380} h={40} value={0.03} at={t03} dur={0.8} color={C.green} />
    </Svg>
  </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 46 — theory vs practice                                            */
/* ------------------------------------------------------------------ */

const S46 = 659.75;
const A46 = scoped(S46);

export const Scene46: React.FC = () => {
  const now = S46 + useCurrentFrame() / 30;
  return (
    <Scene start={S46} end={678.95}>
      <Svg>
        <g opacity={now > A46('practice') - 0.2 ? 0.35 : 1}>
          <Bot x={360} y={600} s={0.9} at={A46('know')} mood="think" />
          <SLabel x={360} y={380} size={110} script color={C.pink}>
            ?
          </SLabel>
        </g>
        <g opacity={now > A46('practice') - 0.2 ? 1 : 0}>
          <Stroke paths={[wline(980, 760, 1740, 760, 71), wline(980, 760, 980, 340, 72)]} at={A46('practice')} dur={0.6} color={C.comment} width={2.6} />
          <Stroke
            paths={[wline(1000, 520, 1400, 520, 73, 0.6, 0)]}
            at={A46('practice') + 0.2}
            dur={0.7}
            color={C.cyan}
            width={3.4}
          />
          <Stroke
            paths={[curvePath(1000, 700, 1680, 420, -40, 74, 0.8)]}
            at={A46('practice') + 0.4}
            dur={1.2}
            color={C.pink}
            width={3.4}
          />
          <SLabel x={1450} y={575} size={38} color={C.cyan}>
            accuracy
          </SLabel>
          <SLabel x={1590} y={360} size={38} color={C.pink}>
            confidence
          </SLabel>
          <Bracket x={1650} y={420} at={A46('overfit') + 0.3} />
          <g opacity={now > A46('always') - 0.2 ? 1 : 0}>
            <SLabel x={1570} y={880} size={40} color={C.muted}>
              check
            </SLabel>
            <IconMark x={1480} y={880} kind="check" color={C.green} at={A46('always')} size={16} />
          </g>
        </g>
      </Svg>
    </Scene>
  );
};

const Bracket: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => (
  <Stroke
    paths={[wline(x, y, x, y + 100, 81, 0.4, 0), wline(x, y, x + 26, y, 82, 0.3, 0), wline(x, y + 100, x + 26, y + 100, 83, 0.3, 0)]}
    at={at}
    dur={0.4}
    color={C.red}
    width={2.6}
  />
);

/* ------------------------------------------------------------------ */
/* 47 — clones                                                        */
/* ------------------------------------------------------------------ */

const S47 = 678.95;
const A47 = scoped(S47);

const MiniBot: React.FC<{x: number; y: number; at: number; s?: number}> = ({x, y, at, s = 0.3}) => (
  <g>
    <rect x={x - 92 * s} y={y - 60 * s} width={184 * s} height={152 * s} rx={24 * s} fill={C.panel2} fillOpacity={0.8} stroke={C.ink} strokeWidth={2.4} />
    <rect x={x - 68 * s} y={y - 38 * s} width={136 * s} height={78 * s} rx={14 * s} fill={C.well} stroke={C.ink} strokeWidth={2} />
    <circle cx={x - 22 * s} cy={y - 8 * s} r={4 * s} fill={C.cyan} />
    <circle cx={x + 22 * s} cy={y - 8 * s} r={4 * s} fill={C.cyan} />
    <path d={curvePath(x - 14 * s, y + 18 * s, x + 14 * s, y + 18 * s, 5 * s, 91, 0.3).d} fill="none" stroke={C.cyan} strokeWidth={2} />
    <line x1={x} y1={y - 60 * s} x2={x} y2={y - 92 * s} stroke={C.ink} strokeWidth={2} />
    <circle cx={x} cy={y - 96 * s} r={5 * s} fill={C.pink} />
  </g>
);

export const Scene47: React.FC = () => {
  const now = S47 + useCurrentFrame() / 30;
  return (
    <Scene start={S47} end={706.2}>
      <Svg>
        <SLabel x={480} y={230} size={58} script color={C.pink}>
          clones
        </SLabel>
        {Array.from({length: 12}).map((_, i) => (
          <Pop key={i} x={240 + (i % 4) * 190} y={360 + Math.floor(i / 4) * 180} at={S47 - 0.4 + i * 0.04} from={0.9}>
            <MiniBot x={240 + (i % 4) * 190} y={360 + Math.floor(i / 4) * 180} at={-10} s={0.28} />
          </Pop>
        ))}
        <g opacity={now > A47('wrap') - 0.2 ? 1 : 0}>
          <ModelBox x={1030} y={330} w={230} h={150} at={A47('wrap')} label="model" accent={C.cyan} layers={2} />
          <Arrow x1={1270} y1={405} x2={1370} y2={405} at={A47('wrap') + 0.3} color={C.muted} width={2.8} />
          <Panel x={1380} y={355} w={180} h={100} at={A47('wrap') + 0.4} fill={C.panel} accent={C.pink} />
          <SLabel x={1470} y={405} size={38} color={C.pink}>
            API
          </SLabel>
        </g>
        <g opacity={now > A47('scored') - 0.2 ? 1 : 0}>
          <SLabel x={1030} y={560} size={38} color={C.muted} anchor="start">
            clone A
          </SLabel>
          <SvgBar x={1030} y={590} w={520} h={40} value={0.83} at={A47('scored')} dur={0.7} color={C.orange} />
          <SLabel x={1600} y={610} size={48} script color={C.orange}>
            83%
          </SLabel>
          <SLabel x={1030} y={670} size={38} color={C.muted} anchor="start">
            clone B
          </SLabel>
          <SvgBar x={1030} y={700} w={520} h={40} value={0.92} at={A47('another')} dur={0.7} color={C.yellow} />
          <SLabel x={1600} y={720} size={48} script color={C.yellow}>
            92%
          </SLabel>
        </g>
        <g opacity={now > A47('tetris') - 0.2 ? 1 : 0}>
          <MiniTetris x={430} y={800} at={A47('tetris')} />
          <IconMark x={620} y={880} kind="cross" color={C.red} at={A47('tetris') + 0.4} size={30} width={5} />
        </g>
        {now > A47('tasks') - 0.2 ? (
          <g>
            <SLabel x={960} y={980} size={44} color={C.green}>
              many tasks
            </SLabel>
          </g>
        ) : null}
      </Svg>
    </Scene>
  );
};

const MiniTetris: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => (
  <g opacity={0.8}>
    {[0, 1, 2, 3, 4].map((c) =>
      [0, 1, 2, 3, 4, 5].map((r) =>
        r > 3 || (c < 2 && r > 1) ? <rect key={`${c}-${r}`} x={x + c * 34} y={y + r * 34} width={28} height={28} rx={3} fill={[C.purple, C.cyan, C.orange][c % 3]} opacity={0.8} /> : null,
      ),
    )}
    <Stroke paths={[rectPathsT(x - 4, y - 4, 178, 212, 71)]} at={at} dur={0.4} color={C.ink} width={3} />
  </g>
);

const rectPathsT = (x: number, y: number, w: number, h: number, seed: number) => roundRectPath(x, y, w, h, 6, seed, 0.5);

/* ------------------------------------------------------------------ */
/* 48 — privacy                                                       */
/* ------------------------------------------------------------------ */

const S48 = 706.2;
const A48 = scoped(S48);

export const Scene48: React.FC = () => {
  const now = S48 + useCurrentFrame() / 30;
  return (
    <Scene start={S48} end={712.75}>
      <Svg>
        <Stroke paths={[circlePath(760, 560, 330, 81, -0.6, 6.3, 1.6)]} at={A48('privacy')} dur={0.9} color={C.comment} width={2.6} dashed />
        <rect x={450} y={430} width={620} height={340} rx={14} fill={C.panel} stroke={C.ink} strokeWidth={4} />
        <rect x={490} y={470} width={540} height={240} rx={8} fill={C.well} />
        <Icon x={760} y={590} kind="shield" s={1.2} at={A48('privacy') + 0.2} accent={C.green} />
        <Stroke paths={[wline(400, 800, 1120, 800, 91, 0.6, 0)]} at={A48('privacy') + 0.3} dur={0.4} color={C.ink} width={5} />
        <g opacity={now > A48('servers') - 0.2 ? 1 : 0}>
          <Icon x={1600} y={420} kind="cloud" s={1.1} at={A48('servers')} color={C.muted} />
          <IconMark x={1600} y={420} kind="cross" color={C.red} at={A48('servers') + 0.3} size={26} width={4} />
          <Arrow x1={1110} y1={530} x2={1450} y2={470} at={A48('servers') + 0.2} color={C.red} width={3} />
        </g>
      </Svg>
      <T x={760} y={900} size={46} color={C.green} at={A48('privacy')}>
        local
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 49 — OpenAI Decisions API                                          */
/* ------------------------------------------------------------------ */

const S49 = 712.75;
const A49 = scoped(S49);

export const Scene49: React.FC = () => {
  const now = S49 + useCurrentFrame() / 30;
  return (
    <Scene start={S49} end={719.4}>
      <Svg>
        <g opacity={1}>
          <Panel x={420} y={280} w={1080} h={520} at={S49 - 0.4} fill={C.panel} accent={C.cyan} />
          <SLabel x={700} y={380} size={46} color={C.muted}>
            OpenAI
          </SLabel>
          <Icon x={1380} y={330} kind="spark" s={0.6} at={A49('noticed') + 0.3} accent={C.yellow} />
        </g>
        <g opacity={now > A49('decisions') - 0.2 ? 1 : 0}>
          <SLabel x={960} y={500} size={78} anchor="middle">
            Decisions API
          </SLabel>
        </g>
        <g opacity={now > A49('luna') - 0.2 ? 1 : 0}>
          <Icon x={960} y={650} kind="moon" s={1.0} at={A49('luna')} accent={C.purple} bg={C.panel} />
          <SLabel x={1120} y={665} size={42} color={C.purple}>
            Luna
          </SLabel>
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 50 — weak spots                                                    */
/* ------------------------------------------------------------------ */

const S50 = 719.4;
const A50 = scoped(S50);

export const Scene50: React.FC = () => {
  const now = S50 + useCurrentFrame() / 30;
  return (
    <Scene start={S50} end={734.5}>
      <Svg>
        <g opacity={now > A50('narrow') - 0.3 ? 0.25 : 1}>
          <Panel x={220} y={320} w={650} h={480} at={S50 - 0.4} fill={C.panel} />
          <Icon x={400} y={470} kind="doc" s={1.1} at={S50 + 0.1} />
          <SChip x={650} y={420} w={90} h={46} label="ES" at={A50('legal') + 0.2} size={36} />
          <SChip x={760} y={420} w={90} h={46} label="FR" at={A50('legal') + 0.3} size={36} />
          <Arrow x1={500} y1={620} x2={650} y2={620} at={A50('translation')} color={C.muted} width={3} />
          <g opacity={now > A50('translation') - 0.2 ? 1 : 0}>
            <SLabel x={740} y={620} size={38} color={C.green}>
              translate
            </SLabel>
          </g>
        </g>
        <g opacity={now > A50('narrow') - 0.2 ? 1 : 0}>
          <Panel x={1050} y={320} w={650} h={480} at={A50('narrow')} fill={C.panel} />
          <Icon x={1250} y={470} kind="chip" s={1.1} at={A50('narrow') + 0.1} color={C.cyan} />
          <SLabel x={1250} y={600} size={38} color={C.cyan}>
            custom
          </SLabel>
          <SvgBar x={1150} y={660} w={440} h={34} value={0.93} at={A50('volume')} dur={0.7} color={C.green} />
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 51 — use cases                                                     */
/* ------------------------------------------------------------------ */

const S51 = 734.5;
const A51 = scoped(S51);

const useCards = [
  {x: 640, y: 330, label: 'email', at: S51 + 0.2},
  {x: 1280, y: 330, label: 'tickets', at: S51 + 0.3},
  {x: 1560, y: 600, label: 'injection', at: 740.4},
  {x: 1280, y: 860, label: 'thinking', at: 744.9},
  {x: 640, y: 860, label: 'instructions', at: 748.1},
  {x: 350, y: 600, label: 'judge', at: 751.3},
];

export const Scene51: React.FC = () => (
  <Scene start={S51} end={753.85}>
    <Svg>
      {useCards.map((c) => (
        <g key={c.label}>
          <Stroke
            paths={[wline(960 + (c.x - 960) * 0.15, 590 + (c.y - 590) * 0.15, c.x, c.y, Math.round(c.x + c.y), 0.5, 0)]}
            at={c.at - 0.2}
            dur={0.4}
            color={C.comment}
            width={2.2}
            opacity={0.7}
          />
          <SChip x={c.x} y={c.y} w={240} h={68} label={c.label} at={c.at} size={38} />
        </g>
      ))}
      <Bot x={960} y={590} s={0.8} at={S51 - 0.4} mood="happy" />
    </Svg>
  </Scene>
);

/* ------------------------------------------------------------------ */
/* 52 — what changed                                                  */
/* ------------------------------------------------------------------ */

const S52 = 753.85;
const A52 = scoped(S52);

export const Scene52: React.FC = () => {
  const now = S52 + useCurrentFrame() / 30;
  return (
    <Scene start={S52} end={772.4}>
      <Svg>
        <SLabel x={400} y={230} size={46} color={C.muted}>
          before
        </SLabel>
        <Panel x={280} y={330} w={180} h={120} at={S52 - 0.4} fill={C.panel} />
        <Panel x={420} y={390} w={180} h={120} at={S52 - 0.3} fill={C.panel} />
        <g opacity={now > A52('changed') - 0.2 ? 1 : 0}>
          <SLabel x={370} y={390} size={36} color={C.muted}>
            data
          </SLabel>
          <SLabel x={510} y={450} size={36} color={C.muted}>
            train
          </SLabel>
        </g>
        <Arrow x1={620} y1={450} x2={800} y2={450} at={S52 + 0.9} color={C.muted} width={3} bend={-18} />
        <Panel x={830} y={385} w={220} h={140} at={S52 + 0.8} fill={C.panel} />
        <g opacity={now > A52('used') - 0.2 ? 1 : 0}>
          <SLabel x={940} y={455} size={38} color={C.muted}>
            model
          </SLabel>
        </g>
        <SLabel x={1380} y={230} size={46} color={C.green}>
          now
        </SLabel>
        <g opacity={now > A52('sentence') - 0.2 ? 1 : 0}>
          <Panel x={1240} y={380} w={420} h={110} at={A52('sentence') - 0.1} fill={C.panel} accent={C.green} />
          <SLabel x={1450} y={435} size={40}>
            sort this
          </SLabel>
          <Arrow x1={1680} y1={435} x2={1760} y2={435} at={A52('sentence') + 0.2} color={C.green} width={3.2} />
          <IconMark x={1800} y={435} kind="check" color={C.green} at={A52('sentence') + 0.4} size={18} />
        </g>
        <g opacity={now > A52('bar') - 0.2 ? 1 : 0}>
          <Stroke paths={[wline(700, 640, 1220, 640, 91, 0.5, 3)]} at={A52('bar')} dur={0.5} color={C.pink} width={5} />
          <Stroke paths={[wline(720, 640, 720, 830, 92, 0.3, 0), wline(1200, 640, 1200, 830, 93, 0.3, 0)]} at={A52('bar') + 0.2} dur={0.3} color={C.muted} width={3} />
          <Fig x={960} y={980} s={0.7} at={A52('bar') + 0.3} pose="think" />
          <SLabel x={1290} y={700} size={46} color={C.pink}>
            bar
          </SLabel>
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 53 — smaller choices inside bigger systems                          */
/* ------------------------------------------------------------------ */

const S53 = 772.4;
const A53 = scoped(S53);

export const Scene53: React.FC = () => {
  const now = S53 + useCurrentFrame() / 30;
  return (
    <Scene start={S53} end={784.3}>
      <Svg>
        <Icon x={960} y={430} kind="brain" s={2.0} at={S53 - 0.4} color={C.purple} accent={C.pink} />
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 380 + i * 290;
          return (
            <g key={i}>
              <SChip x={x} y={800} w={190} h={62} label="jev" at={A53('small') + 0.1 + i * 0.1} size={36} selected color={C.pink} />
              <Arrow x1={x} y1={760} x2={960 + (x - 960) * 0.25} y2={560} at={A53('small') + 0.2 + i * 0.1} color={C.comment} width={2.4} opacity={0.7} />
            </g>
          );
        })}
        <g opacity={now > A53('cheaper') - 0.2 ? 1 : 0}>
          <SChip x={700} y={950} w={190} h={58} label="cheap" at={A53('cheaper')} size={38} selected color={C.green} />
          <SChip x={950} y={950} w={190} h={58} label="fast" at={A53('cheaper') + 0.2} size={38} selected color={C.green} />
        </g>
      </Svg>
      <T x={960} y={200} size={46} color={C.muted} at={A53('small')}>
        little choices
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 54 — close                                                         */
/* ------------------------------------------------------------------ */

const S54 = 784.3;
const A54 = scoped(S54);

export const Scene54: React.FC = () => {
  const now = S54 + useCurrentFrame() / 30;
  const end = now > 791.2;
  return (
    <Scene start={S54} end={794}>
      {!end ? (
        <>
          <Svg>
            <Fig x={520} y={720} s={1.2} at={S54 - 0.4} pose="shrug" />
            {now > A54('sorting') - 0.2 ? (
              <g>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={i} x={980 + i * 110} y={560} width={86} height={86} rx={6} fill={C.panel} stroke={C.muted} strokeWidth={2.6} />
                ))}
                <SLabel x={1320} y={700} size={44} color={C.yellow}>
                  sort
                </SLabel>
              </g>
            ) : null}
            {now > A54('plain') - 0.2 ? (
              <g>
                <Panel x={980} y={330} w={560} h={110} at={A54('plain') - 0.1} fill={C.panel} accent={C.pink} />
                <SLabel x={1260} y={388} size={40}>
                  in plain English
                </SLabel>
                <Arrow x1={1540} y1={440} x2={1620} y2={500} at={A54('plain') + 0.5} color={C.pink} width={3.2} />
              </g>
            ) : null}
          </Svg>
          <T x={520} y={880} size={62} font="script" color={C.muted} at={A54('kind')}>
            kind of
          </T>
          <T x={1320} y={520} size={96} font="script" color={C.green} at={A54('instantly') - 0.2}>
            positive
          </T>
        </>
      ) : (
        <Svg>
          <Stroke paths={[wline(760, 520, 1160, 520, 71, 0.9, 2)]} at={-1} dur={0.5} color={C.pink} width={4} />
          <Bot x={960} y={830} s={0.52} at={-1} mood="wave" />
        </Svg>
      )}
      {end ? (
        <>
          <T x={960} y={400} size={210} font="script" color={C.ink}>
            JEV
          </T>
          <T x={960} y={540} size={52} color={C.pink}>
            sort. done.
          </T>
        </>
      ) : null}
    </Scene>
  );
};
