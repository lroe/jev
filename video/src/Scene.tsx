import React from 'react';
import {T0} from './lib/ink';

/**
 * Scene content is always fully opaque. The video uses hard cuts, so there is
 * never a blank or dark frame between scenes. Every scene pre-rolls its first
 * visual so the cut lands on a populated frame.
 */
export const Scene: React.FC<{
  start: number;
  end: number;
  children: React.ReactNode;
}> = ({start, children}) => {
  return (
    <T0.Provider value={start}>
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>{children}</div>
    </T0.Provider>
  );
};

export const Svg: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg
    width={1920}
    height={1080}
    viewBox="0 0 1920 1080"
    style={{position: 'absolute', inset: 0, overflow: 'visible'}}
  >
    {children}
  </svg>
);
