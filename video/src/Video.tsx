import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {SCENES} from './scenes';
import {C, FPS} from './theme';
import {useFonts} from './lib/fonts';

/**
 * Hard cuts only. Each scene pre-rolls its first visual so the cut lands on a
 * populated frame; the canvas is never empty.
 */
export const Jev: React.FC = () => {
  useFonts();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Audio src={staticFile('audio.wav')} />
      {SCENES.map((s) => (
        <Sequence
          key={s.id}
          from={Math.round(s.start * FPS)}
          durationInFrames={Math.max(1, Math.round((s.end - s.start) * FPS))}
        >
          <s.C />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
