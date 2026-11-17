import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

let started = false;

export const useFonts = () => {
  const [handle] = useState(() => (started ? null : delayRender('Loading local fonts')));
  useEffect(() => {
    if (started || handle === null) return;
    started = true;
    const faces = [
      new FontFace('Caveat', `url(${staticFile('fonts/Caveat.ttf')}) format('truetype')`, {weight: '400 700'}),
      new FontFace('Patrick Hand', `url(${staticFile('fonts/PatrickHand-Regular.ttf')}) format('truetype')`, {
        weight: '400',
      }),
    ];
    Promise.all(faces.map((f) => f.load()))
      .then((loaded) => {
        loaded.forEach((f) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(f));
        return document.fonts.ready;
      })
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error('font load failed', err);
        continueRender(handle);
      });
  }, [handle]);
};
