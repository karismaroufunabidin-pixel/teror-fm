import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {ThreeCanvas} from '@remotion/three';
import {Scene} from './Studio';
import {Overlays} from './Overlays';
import {CAPTIONS} from './shots';

export const TerorFM: React.FC = () => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{backgroundColor: '#030409'}}>
      <AbsoluteFill style={{filter: 'contrast(1.12) saturate(0.85)'}}>
        <ThreeCanvas
          width={width}
          height={height}
          shadows
          flat
          camera={{position: [0, 2, 7], fov: 45, near: 0.1, far: 60}}
        >
          <Scene />
        </ThreeCanvas>
      </AbsoluteFill>
      <Overlays />
      {/* Voice over: satu <Audio> per baris dialog, dijadwalkan dari CAPTIONS */}
      {CAPTIONS.map((c) => (
        <Sequence key={c.audio} from={c.from} durationInFrames={c.to - c.from} name={c.audio}>
          <Audio src={staticFile(`voiceover/${c.audio}`)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
