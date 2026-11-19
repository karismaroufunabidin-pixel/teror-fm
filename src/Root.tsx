import React from 'react';
import {Composition} from 'remotion';
import {TerorFM} from './TerorFM';
import {DURATION, FPS, H, W} from './shots';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="TerorFM"
      component={TerorFM}
      durationInFrames={DURATION}
      fps={FPS}
      width={W}
      height={H}
    />
  );
};
