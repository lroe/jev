import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Scene, Svg} from '../Scene';
import {C} from '../theme';
import {scoped} from '../timing';
import {
  Arrow,
  Bot,
  Chip,
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
  useNow,
  wline,
} from '../lib/ink';
import {Icon, Bar} from '../lib/widgets';

/* ------------------------------------------------------------------ */
/* small svg text + model block helpers                                */
/* ------------------------------------------------------------------ */

export const SLabel: React.FC<{
  x: number;
  y: number;
  children: React.ReactNode;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  script?: boolean;
  opacity?: number;
}> = ({x, y, children, size = 44, color = C.ink, anchor = 'middle', script, opacity = 1}) => (
  <text
    x={x}
    y={y}
    textAnchor={anchor}
    dominantBaseline="central"
    fontFamily={script ? 'Caveat' : 'Patrick Hand'}
    fontWeight={script ? 700 : 400}
    fontSize={size}
    fill={color}
    opacity={opacity}
  >
    {children}
  </text>
);

export const ModelBox: React.FC<{
  x: number;
  y: number;
  w?: number;
  h?: number;
  at: number;
  label: string;
  accent?: string;
  head?: boolean;
  layers?: number;
  opacity?: number;
}> = ({x, y, w = 250, h = 190, at, label, accent = C.purple, head = false, layers = 3, opacity = 1}) => {
  const r = roundRectPath(x, y, w, h, 14, Math.round(x + y), 0.7);
  return (
    <g opacity={opacity}>
      <path d={r.d} fill={C.panel2} fillOpacity={0.32} />
      <Stroke paths={[r]} at={at} dur={0.5} color={C.ink} width={4} />
      {Array.from({length: layers}).map((_, i) => {
        const yy = y + 52 + i * 34;
        return (
          <Stroke
            key={i}
            paths={[wline(x + 24, yy, x + w - 24, yy, i + Math.round(x), 0.5, 0)]}
            at={at + 0.22 + i * 0.08}
            dur={0.2}
            color={accent}
            width={3}
            opacity={0.85}
          />
        );
      })}
      <SLabel x={x + w / 2} y={y + 26} size={40}>
        {label}
      </SLabel>
      {head ? (
        <g>
          <Panel x={x + w / 2 - 62} y={y - 54} w={124} h={44} at={at + 0.4} fill={C.panel} accent={C.green} />
          <SLabel x={x + w / 2} y={y - 32} size={34} color={C.green}>
            head
          </SLabel>
        </g>
      ) : null}
    </g>
  );
};

const VectorCard: React.FC<{
  x: number;
  y: number;
  at: number;
  values?: (string | number)[];
  w?: number;
  h?: number;
  size?: number;
  color?: string;
  label?: string;
}> = ({x, y, at, values = ['0.2', '0.9', '-0.4'], w = 300, h = 100, size = 40, color = C.cyan, label}) => {
  const cw = w / values.length;
  return (
    <g>
      <Panel x={x} y={y} w={w} h={h} at={at} fill={C.well} stroke={C.ink} />
      {values.map((v, i) => (
        <g key={i}>
          <rect x={x + i * cw + 7} y={y + 12} width={cw - 14} height={h - 24} rx={5} fill={color} opacity={0.08} />
          <SLabel x={x + i * cw + cw / 2} y={y + h / 2 + 1} size={size} color={i === 1 ? color : C.ink}>
            {v}
          </SLabel>
          {i > 0 ? <Stroke paths={[wline(x + i * cw, y + 10, x + i * cw, y + h - 10, i, 0.3, 0)]} at={at + 0.1} dur={0.2} color={C.comment} width={2} /> : null}
        </g>
      ))}
      {label ? (
        <SLabel x={x + w / 2} y={y + h + 40} size={46} color={color}>
          {label}
        </SLabel>
      ) : null}
    </g>
  );
};

/* ------------------------------------------------------------------ */
/* 14 — embeddings                                                     */
/* ------------------------------------------------------------------ */

const S14 = 145.6;
const A14 = scoped(S14);

export const Scene14: React.FC = () => {
  const now = S14 + useCurrentFrame() / 30;
  const dim = now > 156 ? 0.3 : 1;
  return (
    <Scene start={S14} end={165.3}>
      <Svg>
        <g opacity={dim}>
          <SLabel x={300} y={220} size={90} script color={C.pink}>1</SLabel>
          <SChip x={390} y={330} w={180} h={70} label="bank" at={S14 - 0.2} size={44} />
          <Arrow x1={500} y1={330} x2={640} y2={330} at={S14 + 1.3} color={C.muted} width={3.2} />
          <VectorCard x={660} y={280} at={A14('numbers')} w={330} h={100} values={['0.2', '0.9', '-0.4']} />
          <SLabel x={825} y={430} size={54} color={C.cyan}>
            embedding
          </SLabel>
        </g>
        <g>
          <Stroke paths={[wline(1100, 680, 1750, 680, 71), wline(1100, 680, 1100, 350, 72)]} at={A14('similar') + 0.1} dur={0.6} color={C.comment} width={2.6} opacity={0.8} />
          <Pop x={1210} y={530} at={A14('good')} from={0.8}>
            <circle cx={1210} cy={530} r={10} fill={C.green} />
            <SLabel x={1210} y={590} size={42}>
              good
            </SLabel>
          </Pop>
          <Pop x={1300} y={470} at={A14('great')} from={0.8}>
            <circle cx={1300} cy={470} r={10} fill={C.green} />
            <SLabel x={1300} y={420} size={42}>
              great
            </SLabel>
          </Pop>
          <Pop x={1580} y={590} at={A14('awful')} from={0.8}>
            <circle cx={1580} cy={590} r={10} fill={C.red} />
            <SLabel x={1580} y={640} size={42}>
              awful
            </SLabel>
          </Pop>
          <Stroke paths={[circlePath(1255, 500, 125, 79, -0.8, 6.5, 1.2)]} at={A14('similar') + 1.2} dur={0.7} color={C.muted} width={2.4} opacity={0.55} />
          <Arrow x1={1370} y1={510} x2={1500} y2={565} at={A14('far') + 0.2} bend={-30} color={C.red} width={3} opacity={0.75} />
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 15 — same word, different context (the flaw)                        */
/* ------------------------------------------------------------------ */

const S15 = 165.3;
const A15 = scoped(S15);

export const Scene15: React.FC = () => (
  <Scene start={S15} end={168.6}>
    <Svg>
      <Panel x={220} y={430} w={560} h={170} at={S15 - 0.4} fill={C.panel} />
      <Panel x={1140} y={430} w={560} h={170} at={A15('bank', 2)} fill={C.panel} />
      <VectorCard x={360} y={290} at={A15('identical')} w={280} h={80} values={['0.2', '0.9', '-0.4']} size={38} />
      <VectorCard x={1280} y={290} at={A15('identical') + 0.1} w={280} h={80} values={['0.2', '0.9', '-0.4']} size={38} />
      <Stroke paths={[circlePath(960, 700, 62, 51, -0.9, 6.5, 1)]} at={A15('identical') + 0.6} dur={0.5} color={C.red} width={4} />
    </Svg>
    <T x={500} y={515} size={54} at={S15 - 0.3}>
      river bank
    </T>
    <T x={1420} y={515} size={54} at={A15('bank', 2)}>
      bank account
    </T>
    <T x={960} y={700} size={92} font="script" color={C.red} at={A15('identical') + 0.55}>
      =
    </T>
    <T x={960} y={760} size={56} color={C.pink} at={A15('identical') + 0.8}>
      same
    </T>
  </Scene>
);

/* ------------------------------------------------------------------ */
/* 16 — recurrent network                                              */
/* ------------------------------------------------------------------ */

const S16 = 168.6;
const A16 = scoped(S16);

const WORDS16 = ['the', 'dog', 'bites', 'man'];
const X16 = [630, 850, 1070, 1290];

export const Scene16: React.FC = () => {
  const now = S16 + useCurrentFrame() / 30;
  const t1 = A16('reads') + 0.2;
  const t2 = A16('updates') + 0.1;
  const t3 = A16('matters') + 0.2;
  const active = now < t1 ? -1 : now < t1 + 1 ? 0 : now < t1 + 2 ? 1 : now < t1 + 3 ? 2 : 3;
  const gistColor = now > A16('shuffle') + 0.6 ? C.red : C.green;
  const swap = clamp((now - A16('shuffle') - 0.2) / 0.8);
  const swapX = 220 * easeOut(swap);
  return (
    <Scene start={S16} end={187.5}>
      <Svg>
        <SLabel x={960} y={290} size={54} color={C.purple}>
          recurrent
        </SLabel>
        {X16.map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={450} r={34} fill={C.panel} stroke={C.ink} strokeWidth={3.2} opacity={active === i ? 1 : 0.5} />
            <circle cx={x} cy={450} r={9} fill={active === i ? C.pink : C.comment} />
            {i < 3 ? <Arrow x1={x + 40} y1={450} x2={x + 170} y2={450} at={A16('recurrent') + 0.2 + i * 0.1} color={C.muted} width={2.8} head={12} /> : null}
          </g>
        ))}
        {active >= 0 ? (
          <Pop x={X16[active]} y={450} at={t1 + active * 1.0} from={0.85}>
            <circle cx={X16[active]} cy={450} r={24} fill={C.panel2} stroke={gistColor} strokeWidth={3.2} />
            <path d={curvePath(X16[active] - 10, 450, X16[active] + 10, 450, 6, 91, 0.4).d} fill="none" stroke={gistColor} strokeWidth={2.4} />
            <SLabel x={X16[active]} y={392} size={34} color={C.muted}>
              gist
            </SLabel>
          </Pop>
        ) : null}
        {WORDS16.map((w, i) => {
          let x = X16[i];
          if (swap > 0 && (i === 1 || i === 2)) x = i === 1 ? X16[1] + swapX : X16[2] - swapX;
          return (
            <g key={w}>
              <SChip x={x} y={610} w={170} h={64} label={w} at={A16('reads') - 0.4 + i * 0.12} size={42} />
              <Stroke paths={[wline(x, 492, x, 576, i + 31, 0.4, 0)]} at={A16('recurrent') + 0.4 + i * 0.05} dur={0.2} color={C.comment} width={2.2} opacity={0.7} />
            </g>
          );
        })}
        {now > t2 ? (
          <SLabel x={960} y={720} size={42} color={C.green}>
            gist updated
          </SLabel>
        ) : null}
        {now > t3 ? (
          <Stroke paths={[wline(530, 720, 1390, 720, 77, 0.6, 0)]} at={t3} dur={0.5} color={C.pink} width={3} />
        ) : null}
        {now > A16('shuffle') + 1.3 ? (
          <SLabel x={960} y={820} size={46} color={C.red}>
            different gist
          </SLabel>
        ) : null}
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 17 — RNN limits                                                     */
/* ------------------------------------------------------------------ */

const S17 = 187.5;
const A17 = scoped(S17);

export const Scene17: React.FC = () => {
  const now = S17 + useCurrentFrame() / 30;
  const squeeze = clamp((now - A17('squeezed')) / 1.2);
  return (
    <Scene start={S17} end={200.95}>
      <Svg>
        <SLabel x={960} y={170} size={64} script color={C.red}>
          catch
        </SLabel>
        {['the', 'dog', 'bites', 'the', 'man', 'and'].map((w, i) => (
          <SChip
            key={i}
            x={320 + i * 160}
            y={360}
            w={130}
            h={56}
            label={w}
            at={A17('summary') - 0.2 + i * 0.1}
            size={36}
            opacity={1 - squeeze * (i < 3 ? 0.92 : 0.35)}
          />
        ))}
        <g opacity={0.3 + 0.7 * (1 - squeeze)}>
          <Arrow x1={1290} y1={360} x2={1400} y2={360} at={A17('summary') + 0.5} color={C.muted} width={3} />
          <circle cx={1480} cy={360} r={56} fill={C.panel2} stroke={C.pink} strokeWidth={4} />
          <SLabel x={1480} y={360} size={40} color={C.pink}>
            …
          </SLabel>
          <BracketLabel x={1480} y={250} at={A17('squeezed') + 0.2} />
        </g>
        <g>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} opacity={now > A17('slow') - 0.3 ? 1 : 0}>
              <rect x={540 + i * 220} y={690} width={150} height={90} rx={9} fill={C.panel} fillOpacity={0.7} />
              <Stroke paths={[roundRectPath(540 + i * 220, 690, 150, 90, 9, i + 12, 0.5)]} at={A17('slow') - 0.3 + i * 0.08} dur={0.25} color={C.muted} width={3} />
              {i < 3 ? <Arrow x1={700 + i * 220} y1={735} x2={750 + i * 220} y2={735} at={A17('slow') + 0.1 + i * 0.08} color={C.muted} width={2.6} head={11} /> : null}
            </g>
          ))}
          <Icon x={420} y={735} kind="clock" s={0.62} at={A17('slow')} />
          {now > A17('painful') ? (
            <Stroke
              paths={[
                curvePath(560, 720, 1290, 760, 40, 81, 1.4),
                curvePath(620, 770, 1230, 700, -50, 82, 1.4),
              ]}
              at={A17('painful')}
              dur={0.8}
              color={C.red}
              width={4}
              opacity={0.8}
            />
          ) : null}
        </g>
      </Svg>
      <T x={1390} y={250} size={42} color={C.muted} at={A17('squeezed') + 0.1}>
        fixed size
      </T>
      <T x={960} y={880} size={48} color={C.orange} at={A17('slow') + 0.2}>
        slow
      </T>
      <T x={960} y={960} size={44} color={C.red} at={A17('painful') + 0.2}>
        painful to train
      </T>
    </Scene>
  );
};

const BracketLabel: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => (
  <Stroke
    paths={[wline(x - 70, y, x + 70, y, 71, 0.4, 0), wline(x - 70, y, x - 70, y + 40, 72, 0.3, 0), wline(x + 70, y, x + 70, y + 40, 73, 0.3, 0)]}
    at={at}
    dur={0.35}
    color={C.muted}
    width={2.6}
  />
);

/* ------------------------------------------------------------------ */
/* 18 — ULMFiT / pretrain then fine-tune                               */
/* ------------------------------------------------------------------ */

const S18 = 200.95;
const A18 = scoped(S18);

export const Scene18: React.FC = () => {
  const now = S18 + useCurrentFrame() / 30;
  return (
    <Scene start={S18} end={227.1}>
      <Svg>
        <SLabel x={330} y={205} size={54} color={C.cyan}>
          2018
        </SLabel>
        <SLabel x={640} y={205} size={54} color={C.purple}>
          ULMFiT
        </SLabel>
        <g>
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${i * 14 - 14} ${i * 16})`}>
              <DocSmall x={320} y={420} at={S18 - 0.4 + i * 0.06} seed={200 + i} />
            </g>
          ))}
          <g opacity={now > A18('fine') - 0.2 ? 1 : 0}>
            <DocSmall x={320} y={720} at={A18('fine')} seed={210} s={0.8} />
            <SLabel x={320} y={800} size={38} color={C.muted}>
              labeled
            </SLabel>
          </g>
        </g>
        <Arrow x1={470} y1={420} x2={700} y2={500} at={S18 - 0.2} bend={-20} color={C.muted} width={3.4} />
        <Arrow x1={470} y1={720} x2={700} y2={620} at={S18 - 0.1} bend={20} color={C.muted} width={3.4} />
        <ModelBox x={720} y={470} w={280} h={190} at={S18 - 0.3} label="model" accent={C.purple} head={now > A18('fine') + 0.3} />
        <SLabel x={860} y={710} size={42} color={C.green}>
          pretrained
        </SLabel>
        <T x={1490} y={420} size={170} font="script" color={C.green} at={A18('95')}>
          95%
        </T>
        <T x={1490} y={540} size={42} color={C.muted} at={A18('95') + 0.2}>
          reviews
        </T>
        {now > A18('remember') ? (
          <g>
            <Panel x={620} y={830} w={680} h={110} at={A18('remember')} fill={C.panel} accent={C.pink} />
            <SLabel x={790} y={885} size={50} script>
              big
            </SLabel>
            <Arrow x1={870} y1={885} x2={1040} y2={885} at={A18('remember') + 0.2} color={C.pink} width={3.4} />
            <SLabel x={1150} y={885} size={50} script>
              small
            </SLabel>
          </g>
        ) : null}
      </Svg>
      <T x={960} y={960} size={40} color={C.muted} at={A18('remember') + 0.4}>
        the recipe keeps coming back
      </T>
    </Scene>
  );
};

const DocSmall: React.FC<{x: number; y: number; at: number; seed: number; s?: number}> = ({x, y, at, seed, s = 1}) => (
  <g>
    <rect x={x - 50 * s} y={y - 64 * s} width={100 * s} height={128 * s} rx={5} fill={C.panel} />
    <Stroke paths={[roundRectPath(x - 50 * s, y - 64 * s, 100 * s, 128 * s, 5, seed, 0.6)]} at={at} dur={0.35} color={C.ink} width={3.2} />
    <Stroke
      paths={[wline(x - 32 * s, y - 32 * s, x + 32 * s, y - 32 * s, seed + 1), wline(x - 32 * s, y - 10 * s, x + 32 * s, y - 10 * s, seed + 2), wline(x - 32 * s, y + 12 * s, x + 10 * s, y + 12 * s, seed + 3)]}
      at={at + 0.12}
      dur={0.25}
      color={C.muted}
      width={2.6}
    />
  </g>
);

/* ------------------------------------------------------------------ */
/* 19 — convolutional window                                           */
/* ------------------------------------------------------------------ */

const S19 = 227.1;
const A19 = scoped(S19);

const SENT = ['it', 'was', 'surprisingly', 'good', 'acting', 'and', 'the', 'plot'];
export const Scene19: React.FC = () => {
  const now = S19 + useCurrentFrame() / 30;
  const slide = clamp((now - A19('window') - 0.1) / 3.2);
  const wx = lerp(340, 640, easeOut(slide));
  const chips = [
    {w: 'it', x: 360, ww: 120},
    {w: 'was', x: 500, ww: 130},
    {w: 'surprisingly', x: 650, ww: 290},
    {w: 'good', x: 960, ww: 130},
    {w: 'acting', x: 1110, ww: 160},
    {w: 'and', x: 1290, ww: 130},
  ];
  return (
    <Scene start={S19} end={247.3}>
      <Svg>
        {chips.map((c, i) => (
          <SChip key={c.w} x={c.x + c.ww / 2} y={480} w={c.ww} h={58} label={c.w} at={S19 - 0.4 + i * 0.05} size={36} />
        ))}
        <Stroke paths={[roundRectPath(wx, 430, 630, 100, 14, 71, 0.6)]} at={A19('window')} dur={0.45} color={C.cyan} width={4} />
        <SLabel x={wx + 315} y={398} size={38} color={C.cyan}>
          window
        </SLabel>
        {now > A19('bag') ? (
          <g>
            <SLabel x={980} y={700} size={54} color={C.muted}>
              ≈
            </SLabel>
            <SLabel x={1200} y={700} size={48} color={C.muted}>
              bag of words
            </SLabel>
          </g>
        ) : null}
        {now > A19('special') ? <Fig x={1620} y={820} s={0.9} at={A19('special') - 0.1} pose="shrug" /> : null}
      </Svg>
      <T x={960} y={900} size={44} color={C.muted} at={A19('special') + 0.2}>
        nothing special
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 20 — transformer / attention                                        */
/* ------------------------------------------------------------------ */

const S20 = 247.3;
const A20 = scoped(S20);

const TOK20 = ['the', 'bank', 'by', 'the', 'river', 'is'];
const X20 = [560, 730, 900, 1070, 1240, 1410];

export const Scene20: React.FC = () => {
  const now = S20 + useCurrentFrame() / 30;
  const focus = now > A20('bank') - 0.2;
  return (
    <Scene start={S20} end={265.55}>
      <Svg>
        <SLabel x={330} y={210} size={48} color={C.cyan}>
          2017
        </SLabel>
        <SLabel x={960} y={300} size={64} script color={C.pink}>
          attention
        </SLabel>
        {TOK20.map((w, i) => (
          <SChip
            key={i}
            x={X20[i]}
            y={590}
            w={150}
            h={64}
            label={w}
            at={S20 - 0.4 + i * 0.04}
            size={40}
            selected={(i === 1 || i === 4) && focus}
            color={C.yellow}
          />
        ))}
        {TOK20.flatMap((_, i) =>
          TOK20.slice(i + 1).map((__, j) => {
            const k = i + 1 + j;
            const isFocus = (i === 1 && k === 4) || (i === 4 && k === 1);
            return (
              <Stroke
                key={`${i}-${k}`}
                paths={[curvePath(X20[i], 552, X20[k], 552, -36 - Math.abs(k - i) * 18, 10 + i * 7 + k, 1.1)]}
                at={A20('every') + 0.3 + (i + k) * 0.05}
                dur={0.5}
                color={isFocus && focus ? C.pink : C.muted}
                width={isFocus && focus ? 4 : 2.2}
                opacity={focus ? (isFocus ? 1 : 0.14) : 0.55}
              />
            );
          }),
        )}
        {now > A20('fading') ? (
          <g opacity={0.5}>
            <circle cx={1650} cy={420} r={46} fill={C.panel2} stroke={C.comment} strokeWidth={3} />
            <IconMark x={1650} y={420} kind="cross" color={C.red} at={A20('fading')} size={22} width={4} />
            <SLabel x={1650} y={500} size={34} color={C.muted}>
              gist
            </SLabel>
          </g>
        ) : null}
        {now > A20('bank') + 0.8 ? (
          <g>
            <Stroke paths={[wline(750, 760, 1370, 760, 81, 0.6, 0)]} at={A20('bank') + 0.9} dur={0.5} color={C.yellow} width={3} opacity={0.8} />
            <SLabel x={1060} y={830} size={52} color={C.yellow}>
              river bank
            </SLabel>
          </g>
        ) : null}
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 21 — encoder / decoder families                                     */
/* ------------------------------------------------------------------ */

const S21 = 265.55;
const A21 = scoped(S21);

export const Scene21: React.FC = () => {
  const now = S21 + useCurrentFrame() / 30;
  const enc = now > S21 - 0.4;
  const dec = now > S21 - 0.4;
  const built = A21('built', 2);
  return (
    <Scene start={S21} end={288.55}>
      <Svg>
        <Panel x={150} y={270} w={780} h={600} at={S21 - 0.4} fill={C.panel} opacity={0.55} />
        <Panel x={990} y={270} w={780} h={600} at={S21 - 0.4} fill={C.panel} opacity={0.55} />
        <g opacity={enc ? 1 : 0}>
          <SLabel x={540} y={340} size={44} color={C.purple}>
            encoder
          </SLabel>
          <SLabel x={540} y={405} size={54}>
            BERT
          </SLabel>
          <SChip x={240} y={540} w={120} h={56} label="[CLS]" at={A21('marker') - 0.2} size={36} selected color={C.green} />
          {[0, 1, 2, 3].map((i) => (
            <SChip key={`e${i}`} x={370 + i * 140} y={540} w={120} h={56} label={['the', 'bank', 'by', 'river'][i]} at={A21('encoder') + 0.2 + i * 0.08} size={36} />
          ))}
          {[0, 1, 2].map((i) => (
            <g key={`ea${i}`}>
              <Arrow x1={430 + i * 140} y1={490} x2={500 + i * 140} y2={490} at={A21('encoder') + 0.5 + i * 0.08} color={C.purple} width={2.6} head={10} />
              <Arrow x1={500 + i * 140} y1={470} x2={430 + i * 140} y2={470} at={A21('encoder') + 0.6 + i * 0.08} color={C.purple} width={2.6} head={10} />
            </g>
          ))}
          <g opacity={now > A21('classifier') - 0.3 ? 1 : 0}>
            <Arrow x1={240} y1={590} x2={240} y2={688} at={A21('classifier') - 0.2} color={C.green} width={3} />
            <Panel x={150} y={700} w={180} h={86} at={A21('classifier')} fill={C.panel} accent={C.green} />
            <SLabel x={240} y={743} size={40} color={C.green}>
              head
            </SLabel>
          </g>
        </g>
        <g opacity={dec ? 1 : 0}>
          <SLabel x={1380} y={340} size={44} color={C.pink}>
            decoder
          </SLabel>
          <SLabel x={1380} y={405} size={54}>
            GPT
          </SLabel>
          {[0, 1, 2].map((i) => (
            <SChip key={`d${i}`} x={1170 + i * 140} y={540} w={120} h={56} label={['the', 'bank', 'by'][i]} at={A21('decoder') + 0.2 + i * 0.08} size={36} />
          ))}
          {[0, 1].map((i) => (
            <Arrow key={`da${i}`} x1={1230 + i * 140} y1={490} x2={1350 + i * 140} y2={490} at={A21('decoder') + 0.5 + i * 0.08} color={C.pink} width={2.8} head={11} />
          ))}
          <Panel x={1570} y={512} w={170} h={64} at={built - 0.1} fill={C.panel} accent={C.pink} />
          <SLabel x={1655} y={544} size={36} color={C.pink}>
            next?
          </SLabel>
          <Arrow x1={1510} y1={540} x2={1562} y2={540} at={built - 0.2} color={C.pink} width={2.6} head={10} />
          {now > built + 0.1 ? (
            <g>
              <Icon x={1650} y={700} kind="doc" s={0.65} at={built + 0.1} />
              <SLabel x={1650} y={795} size={40} color={C.pink}>
                writes
              </SLabel>
            </g>
          ) : null}
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 22 — decoders can sort                                             */
/* ------------------------------------------------------------------ */

const S22 = 288.55;
const A22 = scoped(S22);

export const Scene22: React.FC = () => {
  const now = S22 + useCurrentFrame() / 30;
  const ask = A22('ask');
  const ans = A22('training');
  return (
    <Scene start={S22} end={303.25}>
      <Svg>
        <ModelBox x={500} y={400} w={320} h={230} at={S22 - 0.4} label="decoder" accent={C.pink} />
        <g opacity={now > A22('sort') - 0.2 ? 1 : 0}>
          <SLabel x={660} y={700} size={38} color={C.purple}>
            sorter?
          </SLabel>
        </g>
        <g opacity={now > ask - 0.2 ? 1 : 0}>
          <Panel x={1010} y={360} w={520} h={120} at={ask - 0.2} fill={C.panel} />
          <SLabel x={1270} y={420} size={50}>
            positive?
          </SLabel>
          <Arrow x1={840} y1={440} x2={1002} y2={420} at={ask} bend={-12} color={C.muted} width={3.2} />
        </g>
        <g opacity={now > ans - 0.4 ? 1 : 0}>
          <Arrow x1={840} y1={560} x2={1005} y2={590} at={ans - 0.3} bend={-18} color={C.pink} width={3.2} />
          <Panel x={1010} y={550} w={520} h={130} at={ans - 0.4} fill={C.well} accent={C.green} />
          <SLabel x={1270} y={615} size={58} script color={C.green}>
            positive
          </SLabel>
          <SLabel x={1600} y={615} size={36} color={C.muted} anchor="start">
            no training
          </SLabel>
        </g>
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 23 — sloppy answers, giant model                                    */
/* ------------------------------------------------------------------ */

const S23 = 303.25;
const A23 = scoped(S23);

export const Scene23: React.FC = () => {
  const now = S23 + useCurrentFrame() / 30;
  return (
    <Scene start={S23} end={313.1}>
      <Svg>
        <Panel x={200} y={330} w={700} h={430} at={S23 - 0.4} fill={C.well} />
        {Array.from({length: 9}).map((_, i) => (
          <Stroke
            key={i}
            paths={[wline(250, 390 + i * 38, 250 + (i === 8 ? 380 : 600), 390 + i * 38, 31 + i, 0.8, 0)]}
            at={A23('sloppy') + 0.3 + i * 0.08}
            dur={0.25}
            color={C.muted}
            width={2.6}
            opacity={i === 8 ? 0.35 : 0.7}
          />
        ))}
        <circle cx={430} cy={650} r={54} fill="none" stroke={C.green} strokeWidth={3.5} />
        <SLabel x={430} y={651} size={38} color={C.green}>
          positive
        </SLabel>
        <Icon x={1430} y={470} kind="cloud" s={2.1} at={A23('giant')} color={C.ink} />
        <g opacity={now > A23('giant') - 0.2 ? 1 : 0}>
          <SLabel x={1430} y={650} size={40} color={C.muted}>
            giant model
          </SLabel>
        </g>
        <SChip x={1430} y={760} w={190} h={60} label="positive" at={A23('giant') + 0.5} size={38} />
        <Icon x={1660} y={770} kind="coin" s={0.7} at={A23('giant') + 0.7} />
        {now > A23('giant') + 0.8 ? (
          <SLabel x={1560} y={860} size={44} color={C.orange}>
            $$$
          </SLabel>
        ) : null}
      </Svg>
      <T x={960} y={190} size={64} font="script" color={C.red} at={A23('sloppy')}>
        sloppy
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 24 — ModernBERT + head, 95 vs 92                                    */
/* ------------------------------------------------------------------ */

const S24 = 313.1;
const A24 = scoped(S24);

export const Scene24: React.FC = () => {
  const now = S24 + useCurrentFrame() / 30;
  return (
    <Scene start={S24} end={331.3}>
      <Svg>
        {now < A24('modern') - 0.2 ? (
          <g>
            <Panel x={300} y={450} w={360} h={250} at={S24 - 0.4} fill={C.panel} stroke={C.comment} dashed />
            <SLabel x={480} y={560} size={96} script color={C.muted}>
              ?
            </SLabel>
          </g>
        ) : null}
        <ModelBox x={300} y={450} w={360} h={250} at={A24('modern')} label="ModernBERT" accent={C.purple} head={now > A24('head')} />
        <g opacity={now > A24('95') - 0.1 ? 1 : 0}>
          <SLabel x={1570} y={495} size={68} script color={C.green}>
            95%
          </SLabel>
        </g>
        <g opacity={now > A24('92') - 0.1 ? 1 : 0}>
          <SLabel x={1570} y={665} size={64} script color={C.yellow}>
            92%
          </SLabel>
          <SLabel x={950} y={610} size={38} color={C.muted} anchor="start">
            GPT-2
          </SLabel>
        </g>
      </Svg>
      <Bar x={950} y={470} w={560} h={50} value={0.95} at={A24('95')} dur={0.8} color={C.green} showValue={false} />
      <Bar x={950} y={640} w={560} h={50} value={0.92} at={A24('92')} dur={0.8} color={C.yellow} showValue={false} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 25 — option one: ask the big model                                  */
/* ------------------------------------------------------------------ */

const S25 = 331.3;
const A25 = scoped(S25);

export const Scene25: React.FC = () => {
  const now = S25 + useCurrentFrame() / 30;
  return (
    <Scene start={S25} end={344.3}>
      <Svg>
        <Icon x={740} y={430} kind="cloud" s={2.3} at={S25 - 0.4} />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <Panel x={260} y={350 + i * 58} w={150} h={50} at={A25('option') + 0.2 + i * 0.1} fill={C.panel} stroke={C.panel2} />
            <Stroke paths={[wline(280, 370 + i * 58, 390, 370 + i * 58, 31 + i), wline(280, 384 + i * 58, 350, 384 + i * 58, 41 + i)]} at={A25('option') + 0.3 + i * 0.1} dur={0.2} color={C.muted} width={2.2} />
          </g>
        ))}
        <Arrow x1={420} y1={430} x2={615} y2={430} at={A25('option') + 0.4} color={C.muted} width={3.2} />
        <SChip x={740} y={610} w={250} h={60} label="no training" at={A25('training')} size={40} selected color={C.green} />
        <SChip x={1010} y={610} w={200} h={60} label="flexible" at={A25('flexible')} size={40} selected color={C.green} />
        <SChip x={1310} y={430} w={180} h={60} label="slow" at={A25('slow')} size={40} selected color={C.red} />
        <Icon x={1530} y={470} kind="coin" s={0.75} at={A25('money')} color={C.orange} />
        {now > A25('money') ? (
          <SLabel x={1530} y={575} size={52} color={C.orange}>
            $$$
          </SLabel>
        ) : null}
      </Svg>
      <T x={520} y={225} size={130} font="script" color={C.pink} at={S25 - 0.4}>
        1
      </T>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 26 — option two: fine-tune a small model                            */
/* ------------------------------------------------------------------ */

const S26 = 344.3;
const A26 = scoped(S26);

export const Scene26: React.FC = () => {
  const now = S26 + useCurrentFrame() / 30;
  return (
  <Scene start={S26} end={356.2}>
    <Svg>
      <ModelBox x={260} y={440} w={300} h={220} at={S26 - 0.3} label="small model" accent={C.cyan} />
      <SChip x={760} y={470} w={190} h={60} label="fast" at={A26('fast')} size={40} selected color={C.green} />
      <SChip x={760} y={570} w={210} h={60} label="cheap" at={A26('cheap')} size={40} selected color={C.green} />
      <SChip x={1250} y={400} w={230} h={58} label="labels" at={A26('labelled')} size={38} selected color={C.orange} />
      <SChip x={1250} y={510} w={240} h={58} label="training" at={A26('training')} size={38} selected color={C.orange} />
      <SChip x={1250} y={620} w={260} h={58} label="new model" at={A26('new')} size={38} selected color={C.orange} />
    </Svg>
    <T x={250} y={225} size={130} font="script" color={C.pink} at={S26 - 0.4}>
      2
    </T>
  </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 27 — the gap                                                       */
/* ------------------------------------------------------------------ */

const S27 = 356.2;
const A27 = scoped(S27);

export const Scene27: React.FC = () => {
  const now = S27 + useCurrentFrame() / 30;
  return (
    <Scene start={S27} end={372.1}>
      <Svg>
        <Panel x={250} y={330} w={420} h={120} at={S27 - 0.4} fill={C.panel} />
        <SLabel x={460} y={390} size={48}>
          one-off
        </SLabel>
        <Arrow x1={460} y1={460} x2={460} y2={570} at={A27('one') + 0.2} color={C.muted} width={3.2} />
        <Icon x={460} y={660} kind="cloud" s={1.4} at={A27('one') + 0.35} />
        <SLabel x={460} y={780} size={40} color={C.muted}>
          ask
        </SLabel>
        <Panel x={1250} y={330} w={420} h={120} at={S27 - 0.3} fill={C.panel} />
        <SLabel x={1460} y={390} size={48}>
          a million
        </SLabel>
        <Arrow x1={1460} y1={460} x2={1460} y2={570} at={A27('million') + 0.2} color={C.muted} width={3.2} />
        <Icon x={1460} y={660} kind="chip" s={1.4} at={A27('million') + 0.35} color={C.cyan} />
        <SLabel x={1460} y={780} size={40} color={C.muted}>
          train
        </SLabel>
        <Panel x={820} y={520} w={280} h={260} at={A27('gap') - 0.2} fill={C.well} stroke={C.pink} dashed />
        {now < A27('steps') - 0.1 ? (
          <SLabel x={960} y={620} size={110} script color={C.pink}>
            ?
          </SLabel>
        ) : null}
        {now > A27('steps') - 0.1 ? (
          <g>
            <Bot x={960} y={650} s={0.45} at={A27('steps') - 0.1} mood="happy" />
            <SLabel x={960} y={860} size={46} color={C.pink}>
              Jev
            </SLabel>
          </g>
        ) : null}
      </Svg>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* 28 — subscribe                                                     */
/* ------------------------------------------------------------------ */

const S28 = 372.1;
const A28 = scoped(S28);

export const Scene28: React.FC = () => (
  <Scene start={S28} end={383.9}>
    <Svg>
      <Bot x={620} y={560} s={1.2} at={S28 - 0.4} mood="wave" />
      <Icon x={900} y={380} kind="bell" s={0.8} at={A28('subscribe') - 0.2} accent={C.pink} />
      <Icon x={1320} y={380} kind="spark" s={0.7} at={A28('subscribe') + 0.3} accent={C.yellow} />
    </Svg>
    <T x={1200} y={500} size={110} font="script" color={C.pink} at={A28('subscribe')}>
      subscribe
    </T>
    <T x={1200} y={630} size={48} color={C.muted} at={A28('plain')}>
      plain English
    </T>
    <T x={1200} y={720} size={44} color={C.green} at={A28('jargon')}>
      no jargon
    </T>
  </Scene>
);
