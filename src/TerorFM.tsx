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
      {/* SFX L53: track terpisah dari voice over. SFX sintetis prosedural
          (bukan ElevenLabs — key tidak punya izin sound_generation, 401).
          Frame mulai = saat aksinya terlihat di layar (L21). */}
      {SFX.map((s) => (
        <Sequence key={s.file} from={s.from} durationInFrames={s.frames} name={s.file}>
          <Audio src={staticFile(`sfx/${s.file}`)} volume={s.volume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

/** SFX EP03 (frame mulai, durasi file, volume). Sunyi 15f sebelum scare
 * (4555-4570): drone berakhir 4509, langkah kaki berakhir 4520. */
const SFX: {file: string; from: number; frames: number; volume: number}[] = [
  {file: 'sfx01_phone_ring_studio.mp3', from: 822, frames: 90, volume: 0.9},
  {file: 'sfx02_heart_monitor.mp3', from: 2450, frames: 150, volume: 0.7},
  {file: 'sfx03_door_knock_3x.mp3', from: 3330, frames: 75, volume: 0.9},
  {file: 'sfx04_door_creak.mp3', from: 3450, frames: 90, volume: 0.8},
  {file: 'sfx05_footsteps_corridor.mp3', from: 4400, frames: 120, volume: 0.8},
  {file: 'sfx06_phone_ring_internal.mp3', from: 5442, frames: 90, volume: 0.9},
  {file: 'sfx07_phone_static_disconnect.mp3', from: 6404, frames: 75, volume: 0.9},
  {file: 'sfx08_low_drone.mp3', from: 4269, frames: 240, volume: 0.45},
];
