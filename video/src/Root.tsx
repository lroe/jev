import React from 'react';
import {Composition} from 'remotion';
import {Jev} from './Video';
import {FPS, H, W} from './theme';

export const Root: React.FC = () => {
  return (
    <>
      <Composition id="Jev" component={Jev} durationInFrames={Math.round(794 * FPS)} fps={FPS} width={W} height={H} />
    </>
  );
};
