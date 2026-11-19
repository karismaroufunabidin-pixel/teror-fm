import React, {useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {Box, Blocks, jitter, type BlockItem} from './Voxel';
import {BLACKOUT_START, TURN_LARAS, TURN_WINDU, getCamera, getShot, isPov, isPovDay, lightLevel, mouthOpen, povScene, type V3} from './shots';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// ---------------------------------------------------------------------------
// Ruangan
// ---------------------------------------------------------------------------

const useRoomBlocks = () =>
  useMemo(() => {
    const floor: BlockItem[] = [];
    for (let x = -7; x < 7; x++) {
      for (let z = -6; z < 9; z++) {
        const rug = x >= -4 && x < 4 && z >= -3 && z < 3;
        for (let k = 0; k < 2; k++) {
          const base = rug
            ? (x + z) % 2 === 0
              ? '#5a1a26'
              : '#4a1520'
            : (x * 3 + z + k) % 2 === 0
              ? '#4a3427'
              : '#3d2a20';
          floor.push({
            p: [x + 0.5, -0.1, z + 0.25 + k * 0.5],
            s: [1, 0.2, 0.48],
            c: jitter(base, `floor-${x}-${z}-${k}`, 0.025),
          });
        }
      }
    }

    const brick = (seed: string) => {
      const r = random(seed);
      if (r < 0.07) return '#25402f'; // lumut
      if (r < 0.16) return '#222630'; // retak
      return jitter('#323846', seed, 0.03);
    };

    const walls: BlockItem[] = [];
    for (let x = -7; x < 7; x++) {
      for (let y = 0; y < 5; y++) {
        walls.push({p: [x + 0.5, y + 0.5, -6.25], s: [1, 1, 0.5], c: brick(`bw-${x}-${y}`)});
      }
    }
    for (let z = -6; z < 9; z++) {
      for (let y = 0; y < 5; y++) {
        const inWindow = z >= -3 && z < 3 && y >= 2 && y < 4;
        if (!inWindow) {
          walls.push({p: [-7.25, y + 0.5, z + 0.5], s: [0.5, 1, 1], c: brick(`lw-${z}-${y}`)});
        }
        const inDoor = (z === -1 || z === 0) && y < 3;
        if (!inDoor) {
          walls.push({p: [7.25, y + 0.5, z + 0.5], s: [0.5, 1, 1], c: brick(`rw-${z}-${y}`)});
        }
      }
    }

    const ceiling: BlockItem[] = [];
    for (let x = -7; x < 7; x++) {
      for (let z = -6; z < 9; z++) {
        ceiling.push({p: [x + 0.5, 5.15, z + 0.5], s: [1, 0.3, 1], c: jitter('#22252d', `c-${x}-${z}`, 0.015)});
      }
    }

    const foam: BlockItem[] = [];
    const foamColor = (seed: string) => (random(seed) < 0.09 ? '#40202e' : jitter('#2a2433', seed, 0.025));
    for (let x = -6; x < 6; x++) {
      for (let y = 1; y < 3; y++) {
        const d = (x + y) % 2 === 0 ? 0.14 : 0.32;
        foam.push({p: [x + 0.5, y + 0.5, -6 + d / 2], s: [1, 1, d], c: foamColor(`fb-${x}-${y}`)});
      }
    }
    for (let z = -6; z < 9; z++) {
      for (let y = 1; y < 4; y++) {
        const d = (z + y) % 2 === 0 ? 0.14 : 0.32;
        if (z < -3 || z >= 3) {
          foam.push({p: [-7 + d / 2, y + 0.5, z + 0.5], s: [d, 1, 1], c: foamColor(`fl-${z}-${y}`)});
        }
        if (z < -1 || z > 0) {
          foam.push({p: [7 - d / 2, y + 0.5, z + 0.5], s: [d, 1, 1], c: foamColor(`fr-${z}-${y}`)});
        }
      }
    }

    return {floor, walls, ceiling, foam};
  }, []);

const Room: React.FC = () => {
  const {floor, walls, ceiling, foam} = useRoomBlocks();
  return (
    <group>
      <Blocks items={floor} receive />
      <Blocks items={walls} receive />
      <Blocks items={ceiling} receive={false} />
      <Blocks items={foam} receive />
      {/* balok langit-langit */}
      {[-4, 0, 4].map((z) => (
        <Box key={z} pos={[0, 4.78, z]} size={[14, 0.4, 0.45]} color="#101217" cast={false} />
      ))}
    </group>
  );
};

// ---------------------------------------------------------------------------
// Jendela booth kontrol (dinding kiri) + sosok di baliknya
// ---------------------------------------------------------------------------

const BoothWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const lv = lightLevel(frame);
  const glowOn = frame >= 2870 && frame < 3515 ? 1 : 0.18;
  const flick = 0.75 + 0.25 * random(`booth-${Math.floor(frame / 2)}`);
  const glow = glowOn * flick * (0.35 + 0.65 * lv);
  return (
    <group>
      {/* ruang booth: hanya sisi dalam yang digambar */}
      <mesh position={[-9, 3, 0]}>
        <boxGeometry args={[3, 2.4, 6.4]} />
        <meshStandardMaterial
          color="#0b2326"
          emissive="#0f5a58"
          emissiveIntensity={1.5 * glow}
          side={THREE.BackSide}
          flatShading
        />
      </mesh>
      {/* bingkai */}
      <Box pos={[-6.88, 4.1, 0]} size={[0.3, 0.2, 6.3]} color="#0c0d10" cast={false} />
      <Box pos={[-6.85, 1.95, 0]} size={[0.5, 0.16, 6.3]} color="#0c0d10" cast={false} />
      {[-3.1, -1.5, 1.5, 3.1].map((z) => (
        <Box key={z} pos={[-6.9, 3, z]} size={[0.2, 2.2, 0.14]} color="#0c0d10" cast={false} />
      ))}
      {/* kaca */}
      <mesh position={[-6.97, 3, 0]}>
        <boxGeometry args={[0.02, 2.1, 6]} />
        <meshStandardMaterial color="#9ac7c4" transparent opacity={0.07} depthWrite={false} roughness={0.1} />
      </mesh>
      <pointLight position={[-8.2, 3.8, 0]} color="#3fd1c5" intensity={14 * glow} distance={9} decay={2} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// Pintu kanan (sedikit terbuka, gelap)
// ---------------------------------------------------------------------------

const Door: React.FC = () => (
  <group>
    <mesh position={[8.6, 1.5, 0]}>
      <boxGeometry args={[3, 3, 2]} />
      <meshBasicMaterial color="#000000" side={THREE.BackSide} />
    </mesh>
    <Box pos={[6.95, 3.1, 0]} size={[0.3, 0.2, 2.3]} color="#0c0d10" cast={false} />
    <Box pos={[6.95, 1.5, -1.1]} size={[0.3, 3, 0.15]} color="#0c0d10" cast={false} />
    <Box pos={[6.95, 1.5, 1.1]} size={[0.3, 3, 0.15]} color="#0c0d10" cast={false} />
    {/* daun pintu terbuka sedikit */}
    <Box pos={[6.4, 1.45, 0.95]} size={[0.14, 2.9, 0.9]} color="#241913" rot={[0, 0.9, 0]} />
    <Box pos={[6.98, 3.35, 0]} size={[0.06, 0.2, 0.6]} color="#5a0a0a" emissive="#ff1010" ei={0.8} cast={false} />
  </group>
);

// ---------------------------------------------------------------------------
// Tanda ON AIR dari piksel
// ---------------------------------------------------------------------------

const GLYPHS: Record<string, string[]> = {
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  ' ': ['00', '00', '00', '00', '00', '00', '00'],
};

const OnAirSign: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.85 + 0.15 * Math.sin(frame * 0.2);
  const cell = 0.12;
  const text = 'TEROR FM';
  const pixels = useMemo(() => {
    const out: V3[] = [];
    let cursor = 0;
    for (const ch of text) {
      const g = GLYPHS[ch];
      const w = g[0].length;
      g.forEach((row, ry) =>
        row.split('').forEach((v, rx) => {
          if (v === '1') out.push([cursor + rx, 6 - ry, 0]);
        }),
      );
      cursor += w + 1;
    }
    const total = cursor - 1;
    return out.map((p): V3 => [(p[0] - total / 2 + 0.5) * cell, (p[1] - 3) * cell, 0.07]);
  }, []);
  return (
    <group position={[0, 4.15, -5.78]}>
      <Box size={[5.9, 1.45, 0.16]} color="#0a0a0c" cast={false} />
      {pixels.map((p, i) => (
        <Box key={i} pos={p} size={[cell * 0.92, cell * 0.92, 0.08]} color="#ff2a1f" emissive="#ff1208" ei={2.2 * pulse} cast={false} />
      ))}
    </group>
  );
};

// ---------------------------------------------------------------------------
// Meja, kursi, mic, perangkat
// ---------------------------------------------------------------------------

const Table: React.FC = () => {
  const frame = useCurrentFrame();
  const crt = 0.6 + 0.4 * random(`crt-${Math.floor(frame / 3)}`);
  const buttons = useMemo(
    () =>
      Array.from({length: 18}, (_, i) => ({
        p: [-0.35 + (i % 6) * 0.14, 0.06, -0.18 + Math.floor(i / 6) * 0.17] as V3,
        c: ['#1fd36a', '#e8b21c', '#d62a2a', '#2a8fd6'][i % 4],
      })),
    [],
  );
  return (
    <group>
      <Box pos={[0, 1.24, 0]} size={[2.3, 0.12, 4.4]} color="#2b1b12" receive />
      <Box pos={[0, 1.15, 0]} size={[2.1, 0.08, 4.2]} color="#1a110c" />
      {([-0.95, 0.95] as number[]).flatMap((x) =>
        ([-1.9, 1.9] as number[]).map((z) => (
          <Box key={`${x}-${z}`} pos={[x, 0.6, z]} size={[0.18, 1.2, 0.18]} color="#1a110c" />
        )),
      )}
      {/* mixer */}
      <group position={[0, 1.36, -1.2]}>
        <Box size={[1.0, 0.12, 0.7]} color="#101216" />
        {buttons.map((b, i) => (
          <Box key={i} pos={b.p} size={[0.07, 0.04, 0.07]} color={b.c} emissive={b.c} ei={0.9} cast={false} />
        ))}
      </group>
      {/* monitor CRT */}
      <group position={[0, 1.72, -1.95]}>
        <Box size={[0.9, 0.7, 0.6]} color="#15161a" />
        <Box pos={[0, 0.02, 0.31]} size={[0.7, 0.5, 0.02]} color="#1b7a52" emissive="#1fe08a" ei={0.8 * crt} cast={false} />
      </group>
      {/* gelas */}
      <Box pos={[0.2, 1.4, 1.2]} size={[0.16, 0.2, 0.16]} color="#2a2a30" />
      <Box pos={[-0.25, 1.4, 0.8]} size={[0.16, 0.2, 0.16]} color="#3a1f1f" />
      {/* kertas naskah */}
      <Box pos={[-0.2, 1.31, 0.2]} size={[0.5, 0.01, 0.35]} color="#bdb6a4" rot={[0, 0.3, 0]} cast={false} />
    </group>
  );
};

const MicArm: React.FC<{side: 1 | -1}> = ({side}) => (
  <group scale={[side, 1, 1]}>
    <Box pos={[0.95, 1.55, 0.5]} size={[0.06, 0.5, 0.06]} color="#0b0b0d" />
    <Box pos={[0.95, 1.8, 0.31]} size={[0.06, 0.06, 0.4]} color="#0b0b0d" />
    <Box pos={[1.04, 1.8, 0.12]} size={[0.2, 0.06, 0.06]} color="#0b0b0d" />
    <Box pos={[1.14, 1.8, 0.12]} size={[0.22, 0.26, 0.22]} color="#0f0f12" />
    <Box pos={[1.14, 1.8, 0.12]} size={[0.26, 0.2, 0.26]} color="#241719" />
  </group>
);


// ---------------------------------------------------------------------------
// Laptop portal di tengah meja [0, 1.32, 0.3]
// Isinya HANYA visualisasi khayalan cerita Andi, bukan video asli penelpon.
// Layar menyala saat portal aktif (P1 s.d. P3). Jam 12:01 muncul sebagai
// digit piksel voxel di layar saat shot T1, tanpa ada yang mengucapkannya.
// ---------------------------------------------------------------------------

const CLOCK_DIGITS: Record<string, string[]> = {
  '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'],
  '0': ['111', '101', '101', '101', '111'],
  ':': ['0', '1', '0', '1', '0'],
};

const Laptop: React.FC = () => {
  const frame = useCurrentFrame();
  const portalActive = frame >= 3515 && frame < 6240;
  const clockOn = frame >= BLACKOUT_START;
  const glow = portalActive ? 1.8 : clockOn ? 1.2 : 0.1;
  const chars = ['1', '2', ':', '0', '1'];
  const pixels: {x: number; y: number}[] = [];
  let cx = 0;
  for (const ch of chars) {
    const g = CLOCK_DIGITS[ch];
    const w = g[0].length;
    g.forEach((row, ry) =>
      row.split('').forEach((v, rx) => {
        if (v === '1') pixels.push({x: cx + rx, y: 4 - ry});
      }),
    );
    cx += w + 1;
  }
  const totalW = cx - 1;
  return (
    <group position={[0, 1.32, 0.3]}>
      {/* alas + keyboard */}
      <Box pos={[0, 0.04, 0]} size={[0.9, 0.08, 0.6]} color="#14161a" />
      {Array.from({length: 24}, (_, i) => (
        <Box
          key={i}
          pos={[-0.36 + (i % 8) * 0.103, 0.09, -0.12 + Math.floor(i / 8) * 0.11]}
          size={[0.07, 0.02, 0.07]}
          color="#23262c"
          cast={false}
        />
      ))}
      {/* layar, miring sedikit ke belakang, menghadap kamera (+z) */}
      <group position={[0, 0.32, -0.26]} rotation={[-0.18, 0, 0]}>
        <Box size={[0.9, 0.6, 0.06]} color="#0a0f14" />
        <Box
          pos={[0, 0, 0.035]}
          size={[0.82, 0.52, 0.01]}
          color={portalActive || clockOn ? '#cfe8ff' : '#0a0f14'}
          emissive="#cfe8ff"
          ei={glow}
          cast={false}
        />
        {clockOn &&
          pixels.map((px, i) => (
            <Box
              key={i}
              pos={[(px.x - totalW / 2) * 0.045, (px.y - 2) * 0.045, 0.045]}
              size={[0.04, 0.04, 0.01]}
              color="#0b0e14"
              basic
              fog={false}
              cast={false}
            />
          ))}
      </group>
      <pointLight position={[0, 1.7, 1.2]} color="#cfe8ff" intensity={portalActive ? 10 : clockOn ? 6 : 0.5} distance={3} decay={2} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// Penyiar (karakter blocky)
// ---------------------------------------------------------------------------

type HostLook = {
  skin: string;
  hair: string;
  shirt: string;
  pants: string;
  longHair: boolean;
};

const LOOKS: Record<'A' | 'B', HostLook> = {
  A: {skin: '#c28a63', hair: '#2a1a12', shirt: '#21393d', pants: '#14161d', longHair: false},
  B: {skin: '#dcb59b', hair: '#1b1013', shirt: '#382a45', pants: '#1c1a22', longHair: true},
};

const Host: React.FC<{role: 'A' | 'B'}> = ({role}) => {
  const frame = useCurrentFrame();
  const isA = role === 'A';
  const look = LOOKS[role];
  const who = isA ? 'WINDU' : 'LARAS';
  const x = isA ? -1.7 : 1.7;
  const faceY = isA ? Math.PI / 2 : -Math.PI / 2;

  const amp = mouthOpen(who, frame);
  const turnStart = isA ? TURN_WINDU : TURN_LARAS;
  const turnT = interpolate(frame, [turnStart, turnStart + 46], [0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const idle = Math.sin(frame * 0.045 + (isA ? 0 : 2)) * 0.07 * (1 - turnT);
  const headY = (isA ? -1 : 1) * turnT * 1.45 + idle;
  const headZ = (isA ? 1 : -1) * turnT * 0.2;
  const nod = amp * 0.05 * Math.sin(frame * 0.5) + Math.sin(frame * 0.07) * 0.015;

  // Windu: mata melebar saat nisan Andi disebut (2776-2968) dan saat telepon putus.
  // Laras: jarang takut — hanya melebar 1.3x saat jam 12:01 terlihat.
  const widen = isA
    ? interpolate(frame, [3089, 3140, 3515, 3600, 6432, 6579], [1, 1.75, 1.75, 1, 1, 1.75], clamp)
    : interpolate(frame, [6579, 6639], [1, 1.3], clamp);
  const pupil = 1 - 0.5 * ((widen - 1) / 0.75);
  const blink = widen < 1.3 && (frame + (isA ? 0 : 41)) % 97 < 3 ? 0.12 : 1;
  const breath = 1 + Math.sin(frame * 0.1 + (isA ? 0 : 1)) * 0.012;

  const px = (isA ? 1 : 1) * 0.07; // arah pupil ke lawan bicara
  const eyeX: V3 = [-0.15, 0.15, 0] as V3;

  const hair = look.hair;
  const dark = '#241012';

  return (
    <group position={[x, 0, 0]} rotation={[0, faceY, 0]}>
      {/* kursi */}
      <Box pos={[0, 0.8, -0.02]} size={[0.8, 0.1, 0.8]} color="#0f1115" />
      <Box pos={[0, 1.2, -0.45]} size={[0.8, 0.7, 0.1]} color="#0f1115" />
      <Box pos={[0, 0.4, -0.02]} size={[0.1, 0.8, 0.1]} color="#08090b" />
      <Box pos={[0, 0.04, -0.02]} size={[0.8, 0.08, 0.1]} color="#08090b" />
      <Box pos={[0, 0.04, -0.02]} size={[0.1, 0.08, 0.8]} color="#08090b" />

      {/* kaki */}
      {([-0.16, 0.16] as number[]).map((lx) => (
        <group key={lx}>
          <Box pos={[lx, 0.75, 0.5]} size={[0.3, 0.3, 0.84]} color={look.pants} />
          <Box pos={[lx, 0.3, 0.82]} size={[0.3, 0.6, 0.3]} color={look.pants} />
          <Box pos={[lx, 0.07, 0.9]} size={[0.32, 0.14, 0.42]} color="#0a0a0c" />
        </group>
      ))}

      {/* badan */}
      <group position={[0, 0, 0]} scale={[1, breath, 1]}>
        <Box pos={[0, 1.38, 0]} size={[0.64, 0.96, 0.32]} color={look.shirt} />
        {/* aksen kerah / logo */}
        <Box pos={[0, 1.7, 0.17]} size={[0.3, 0.06, 0.02]} color={isA ? '#3b6f73' : '#6a4a86'} cast={false} />
      </group>

      {/* lengan di atas meja */}
      {([-0.48, 0.48] as number[]).map((ax) => (
        <group key={ax} position={[ax, 1.74, 0]} rotation={[-1.1, 0, 0]}>
          <Box pos={[0, -0.48, 0]} size={[0.32, 0.96, 0.32]} color={look.shirt} />
          <Box pos={[0, -0.9, 0]} size={[0.32, 0.18, 0.32]} color={look.skin} />
        </group>
      ))}

      {/* kepala */}
      <group position={[0, 1.86, 0]} rotation={[nod, headY, headZ]}>
        <Box pos={[0, 0.32, 0]} size={[0.64, 0.64, 0.64]} color={look.skin} />
        {/* rambut */}
        <Box pos={[0, 0.68, -0.01]} size={[0.7, 0.14, 0.7]} color={hair} />
        <Box pos={[0, 0.66, 0.3]} size={[0.7, 0.12, 0.12]} color={hair} />
        <Box pos={[0, 0.38, -0.31]} size={[0.7, 0.62, 0.1]} color={hair} />
        {look.longHair && (
          <>
            <Box pos={[0, 0.0, -0.31]} size={[0.7, 0.7, 0.1]} color={hair} />
            <Box pos={[-0.36, 0.2, -0.05]} size={[0.1, 0.9, 0.5]} color={hair} />
            <Box pos={[0.36, 0.2, -0.05]} size={[0.1, 0.9, 0.5]} color={hair} />
          </>
        )}
        {!look.longHair && (
          <>
            <Box pos={[-0.34, 0.52, 0]} size={[0.06, 0.2, 0.6]} color={hair} />
            <Box pos={[0.34, 0.52, 0]} size={[0.06, 0.2, 0.6]} color={hair} />
          </>
        )}
        {/* headphone */}
        <Box pos={[0, 0.76, -0.02]} size={[0.8, 0.07, 0.16]} color="#0b0b0e" />
        {([-1, 1] as number[]).map((s) => (
          <group key={s}>
            <Box pos={[s * 0.4, 0.58, -0.02]} size={[0.07, 0.3, 0.16]} color="#0b0b0e" />
            <Box pos={[s * 0.42, 0.32, -0.02]} size={[0.14, 0.3, 0.3]} color="#14151a" />
            <Box pos={[s * 0.5, 0.32, -0.02]} size={[0.02, 0.18, 0.18]} color="#8a1111" emissive="#ff1a1a" ei={0.6} cast={false} />
          </group>
        ))}
        {/* wajah */}
        {eyeX.slice(0, 2).map((ex, i) => (
          <group key={i} position={[ex, 0.38, 0.325]} scale={[widen, widen * blink, 1]}>
            <Box size={[0.14, 0.1, 0.02]} color="#e8e8ea" cast={false} />
            <Box pos={[px * (i === 0 ? 1 : 1) * 0.5, 0, 0.012]} size={[0.07 * pupil, 0.08 * pupil, 0.02]} color="#0b0b10" cast={false} />
          </group>
        ))}
        <Box pos={[-0.15, 0.47, 0.325]} size={[0.17, 0.03, 0.02]} color={hair} cast={false} rot={[0, 0, widen > 1.3 ? 0.25 : 0]} />
        <Box pos={[0.15, 0.47, 0.325]} size={[0.17, 0.03, 0.02]} color={hair} cast={false} rot={[0, 0, widen > 1.3 ? -0.25 : 0]} />
        <Box pos={[0, 0.27, 0.34]} size={[0.1, 0.1, 0.06]} color={isA ? '#a8714e' : '#c79b82'} cast={false} />
        <Box
          pos={[0, 0.13, 0.325]}
          size={[0.2, 0.05, 0.02]}
          scale={[1, 0.4 + amp * 3.2, 1]}
          color={dark}
          cast={false}
        />
      </group>
    </group>
  );
};

// ---------------------------------------------------------------------------
// Sosok bayangan dengan headphone rusak
// ---------------------------------------------------------------------------

const Listener: React.FC<{eyeGlow?: number}> = ({eyeGlow = 1}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.05) * 0.04;
  const body = '#040406';
  return (
    <group scale={[1.05, 1.05, 1.05]}>
      <Box pos={[-0.16, 0.8, 0]} size={[0.22, 1.6, 0.22]} color={body} />
      <Box pos={[0.16, 0.8, 0]} size={[0.22, 1.6, 0.22]} color={body} />
      <Box pos={[0, 2.2, 0]} size={[0.62, 1.2, 0.28]} color={body} />
      <Box pos={[-0.42, 1.75, 0.05]} size={[0.16, 1.9, 0.16]} color={body} rot={[0.05, 0, 0.04]} />
      <Box pos={[0.42, 1.75, 0.05]} size={[0.16, 1.9, 0.16]} color={body} rot={[0.05, 0, -0.04]} />
      <group position={[0, 3.2, 0]} rotation={[0, 0, 0.22 + sway]}>
        <Box size={[0.5, 0.56, 0.5]} color={body} />
        {/* headphone rusak */}
        <Box pos={[0, 0.34, 0]} size={[0.62, 0.06, 0.14]} color="#15161b" />
        <Box pos={[-0.34, 0.05, 0]} size={[0.12, 0.28, 0.26]} color="#15161b" />
        <Box pos={[0.4, -0.3, 0.05]} size={[0.12, 0.28, 0.26]} color="#15161b" rot={[0, 0, 0.5]} />
        <Box pos={[-0.12, 0.04, 0.26]} size={[0.15, 0.07, 0.02]} color="#ffffff" basic fog={false} opacity={eyeGlow} />
        <Box pos={[0.12, 0.04, 0.26]} size={[0.15, 0.07, 0.02]} color="#ffffff" basic fog={false} opacity={eyeGlow} />
      </group>
    </group>
  );
};

const FigureInWindow: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < 2870 || frame >= 3515) return null;
  const fx = interpolate(frame, [2870, 3300], [-9.4, -7.55], {...clamp, easing: Easing.out(Easing.quad)});
  return (
    <group position={[fx, 0, interpolate(frame, [3100, 3400], [0, 0.45], clamp)]} rotation={[0, Math.PI / 2, 0]}>
      <Listener />
    </group>
  );
};

// EP01: sosok TIDAK masuk ke ruangan. Twist-nya telepon putus + jam 12:01
// di layar laptop, bukan sosok di belakang meja.
const FigureInRoom: React.FC = () => null;


// ---------------------------------------------------------------------------
// POV penelpon (Babak 3) — voxel kode saja, tanpa gambar AI.
// Kampung kosong: tiap rumah ada nisan kosong di depannya. Kuburan di ujung
// jalan, lampu motor menyorot nisan Andi. Sosok tanpa wajah di belakang motor.
// Laras dan Windu TIDAK tampil di POV, hanya suara Andi sebagai narasi.
// ---------------------------------------------------------------------------

const PovScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = povScene(frame);
  const inP2a = scene === 'p2a';
  const inP2b = scene === 'p2b';
  const inP2c = scene === 'p2c';
  const houseZ = [4.5, 1.5, -1.5];
  return (
    <group>
      {/* tanah + jalan */}
      <Box pos={[0, -0.15, 0]} size={[16, 0.3, 18]} color="#241a12" receive />
      <Box pos={[0, -0.08, 0]} size={[2.2, 0.16, 16]} color="#2e2118" receive />
      {/* rumah-rumah gelap di kiri-kanan jalan, jendela mati */}
      {([-3.6, 3.6] as number[]).flatMap((hx) =>
        houseZ.map((hz) => (
          <group key={`${hx}-${hz}`}>
            <Box pos={[hx, 1.0, hz]} size={[2.2, 2.0, 2.2]} color="#2a2433" />
            <Box pos={[hx, 2.15, hz]} size={[2.5, 0.3, 2.5]} color="#17131d" />
            <Box pos={[hx * 0.82, 1.2, hz]} size={[0.5, 0.5, 0.06]} color="#05060a" cast={false} />
            {/* pintu kebuka (P2b): daun pintu terbuka ke luar, dalam gelap */}
            <Box pos={[hx * 0.55, 0.9, hz + 1.15]} size={[0.7, 1.8, 0.08]} color="#05060a" cast={false} />
            <Box pos={[hx * 0.55 + 0.45, 0.9, hz + 1.5]} size={[0.08, 1.8, 0.6]} color="#1c1410" rot={[0, 0.7, 0]} />
            {/* nisan kosong di depan tiap rumah */}
            <Box pos={[hx * 0.62, 0.35, hz + 1.4]} size={[0.42, 0.7, 0.14]} color="#5a5f68" />
            <Box pos={[hx * 0.62, 0.75, hz + 1.4]} size={[0.5, 0.12, 0.18]} color="#4a4f58" />
          </group>
        )),
      )}
      {/* kuburan di ujung jalan: barisan nisan */}
      {([-3, -2, -1, 0, 1, 2, 3] as number[]).flatMap((tx) =>
        ([-4.6, -5.6] as number[]).map((tz) => (
          <group key={`${tx}-${tz}`}>
            <Box pos={[tx, 0.35, tz]} size={[0.42, 0.7, 0.14]} color={tx === 1 && tz === -4.6 ? '#8a8f98' : '#565b64'} />
            <Box pos={[tx, 0.75, tz]} size={[0.5, 0.12, 0.18]} color="#454a53" />
          </group>
        )),
      )}
      {/* gerbang kuburan: dua tiang + balok atas, sosok hilang begitu Andi lewat gerbang */}
      <Box pos={[-1.3, 1.1, -6.2]} size={[0.3, 2.2, 0.3]} color="#3a3f48" />
      <Box pos={[1.3, 1.1, -6.2]} size={[0.3, 2.2, 0.3]} color="#3a3f48" />
      <Box pos={[0, 2.3, -6.2]} size={[2.9, 0.25, 0.25]} color="#3a3f48" />
      {/* pagar kuburan di depan barisan nisan */}
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((fx) => (
        <Box key={fx} pos={[fx, 0.5, -3.6]} size={[0.12, 1.0, 0.12]} color="#2e2a24" />
      ))}
      <Box pos={[0, 0.85, -3.6]} size={[8.4, 0.08, 0.08]} color="#2e2a24" />
      {/* pohon-pohon kuburan / kampung */}
      {([-5.5, 5.5] as number[]).flatMap((tx) =>
        ([-5, 2] as number[]).map((tz) => (
          <group key={`${tx}-${tz}`}>
            <Box pos={[tx, 1.0, tz]} size={[0.35, 2.0, 0.35]} color="#241812" />
            <Box pos={[tx, 2.6, tz]} size={[1.6, 1.4, 1.6]} color="#16241a" />
            <Box pos={[tx, 3.4, tz]} size={[1.0, 0.8, 1.0]} color="#1b2f20" />
          </group>
        )),
      )}
      {/* lampu jalan kampung — mati di P2b (tidak ada lampu nyala), bulan di P2c */}
      {([-2.8, 2.8] as number[]).map((lx) => (
        <group key={lx}>
          <Box pos={[lx, 1.4, 0.5]} size={[0.12, 2.8, 0.12]} color="#1c1e22" />
          <Box pos={[lx, 2.9, 0.5]} size={[0.4, 0.2, 0.4]} color="#0a0a0c" />
        </group>
      ))}
      <Box pos={[-4, 6.5, -8]} size={[0.9, 0.9, 0.1]} color="#dfe8ff" emissive="#cfe0ff" ei={1.6} basic fog={false} cast={false} />
      {/* nisan Andi yang disorot lampu motor */}
      <Box pos={[1, 0.45, -4.6]} size={[0.55, 0.9, 0.16]} color="#9aa0aa" />
      {/* gundukan galian + lubang kosong */}
      <Box pos={[0, 0.0, -2.6]} size={[1.3, 0.08, 2.1]} color="#050505" />
      {([
        [-0.5, 0.15, -1.8],
        [0.4, 0.22, -1.7],
        [-0.1, 0.3, -3.4],
        [0.55, 0.12, -3.3],
      ] as V3[]).map((pp, i) => (
        <Box key={i} pos={pp} size={[0.5, 0.25, 0.4]} color="#3a2a1a" />
      ))}
      {/* sekop bersandar di gundukan */}
      <Box pos={[0.9, 0.5, -2.0]} size={[0.06, 1.0, 0.06]} color="#4a3427" rot={[0, 0, 0.35]} />
      <Box pos={[1.05, 0.95, -2.0]} size={[0.22, 0.3, 0.04]} color="#6a6f78" rot={[0, 0, 0.35]} />
      {/* motor Andi: setang + lampu depan — hanya P2a (di P2b/P2c Andi jalan kaki) */}
      {inP2a && (
      <group position={[0, 0, 2.0]}>
        <Box pos={[-0.35, 1.05, 0]} size={[0.7, 0.06, 0.06]} color="#0b0b0d" />
        <Box pos={[0, 0.55, -0.3]} size={[0.5, 0.7, 1.1]} color="#1d4a22" />
        <Box pos={[0, 0.75, -0.85]} size={[0.3, 0.2, 0.06]} color="#ffe9b0" emissive="#ffdf8a" ei={2.5} cast={false} />
        <Box pos={[0, 0.25, 0.3]} size={[0.4, 0.5, 0.4]} color="#0b0b0d" />
      </group>
      )}
      {/* Andi di atas motor (P2a, orang ketiga dekat): jaket ojol hijau redup + helm */}
      {inP2a && (
        <group position={[0, 0, 2.0]}>
          <Box pos={[0, 1.25, 0.35]} size={[0.55, 0.6, 0.3]} color="#1d4a22" />
          <Box pos={[0, 1.75, 0.35]} size={[0.4, 0.4, 0.4]} color="#22242a" />
          <Box pos={[0, 1.75, 0.14]} size={[0.34, 0.12, 0.06]} color="#0a0a0c" cast={false} />
          <Box pos={[-0.32, 1.3, 0.35]} size={[0.14, 0.5, 0.14]} color="#1d4a22" />
          <Box pos={[0.32, 1.3, 0.35]} size={[0.14, 0.5, 0.14]} color="#1d4a22" />
        </group>
      )}
      {/* sosok tanpa wajah: duduk di belakang Andi di motor (P2a).
          Terlihat selama Andi di dalam kuburan, hilang begitu dia lewat gerbang
          (frame >= 4100). Ini visualisasi spion: dari sudut orang ketiga dekat,
          penumpang itu terlihat di belakang pengendara. */}
      {inP2a && frame < 4100 && (
        <group position={[0.9, 0.75, 2.85]} scale={[0.42, 0.42, 0.42]} rotation={[0, 0, 0]}>
          <Listener />
        </group>
      )}
      {/* sosok di ujung kuburan saat penggalian (P2c) */}
      {inP2c && (
        <group position={[2.4, 0, -5.2]} rotation={[0, 0.5, 0]}>
          <Listener eyeGlow={0.9} />
        </group>
      )}
    </group>
  );
};

const PovLights: React.FC = () => {
  const frame = useCurrentFrame();
  const day = isPovDay(frame);
  const flick = 0.85 + 0.15 * random(`pov-${Math.floor(frame / 2)}`);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(0, 0.4, -4.6);
    return o;
  }, []);
  return (
    <group>
      <ambientLight color={day ? '#aab4c4' : '#1a2030'} intensity={day ? 2.2 : 0.5} />
      <hemisphereLight args={day ? ['#b8c4d8', '#5a4a34', 1.3] : ['#232c44', '#120a08', 0.45]} />
      {day && <pointLight position={[4, 6, 2]} color="#fff2d0" intensity={100} distance={22} decay={2} />}
      {/* lampu motor: satu-satunya sumber cahaya utama di POV */}
      <primitive object={target} />
      <spotLight
        position={[0, 1.0, 2.0]}
        target={target}
        angle={0.6}
        penumbra={0.6}
        intensity={day ? 80 * flick : 600 * flick}
        decay={2}
        distance={18}
        color="#ffdf8a"
        castShadow
      />
      {/* cahaya hangat dari belakang motor (P2a): pengendara + penumpang harus terbaca, bukan siluet hitam pekat */}
      {frame >= 3575 && frame < 4283 && (
        <pointLight position={[0, 2.8, 4.5]} color="#ffdf8a" intensity={25} distance={7} decay={2} />
      )}
      {/* cahaya dingin dari langit kuburan / bulan; siang hari jadi cahaya matahari redup */}
      <pointLight position={[0, 4, -5]} color={day ? '#cfe0ff' : '#5a6f9a'} intensity={day ? 60 : 20} distance={14} decay={2} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// Lampu gantung, debu, cahaya
// ---------------------------------------------------------------------------

const HangingLamp: React.FC<{x: number}> = ({x}) => {
  const frame = useCurrentFrame();
  const lv = lightLevel(frame);
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(x * 1.0, 0.8, 0);
    return o;
  }, [x]);
  return (
    <group>
      <Box pos={[x, 4.5, 0]} size={[0.06, 1.2, 0.06]} color="#08090b" cast={false} />
      <Box pos={[x, 3.85, 0]} size={[0.7, 0.24, 0.7]} color="#101114" cast={false} />
      <Box pos={[x, 3.7, 0]} size={[0.42, 0.08, 0.42]} color="#ffb25a" emissive="#ffb35a" ei={2.4 * lv} basic fog={false} cast={false} opacity={1} />
      <primitive object={target} />
      <spotLight
        position={[x, 3.65, 0]}
        target={target}
        angle={0.8}
        penumbra={0.75}
        intensity={190 * lv}
        decay={2}
        distance={14}
        color="#ffbe7a"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0006}
      />
    </group>
  );
};

const Dust: React.FC = () => {
  const frame = useCurrentFrame();
  const lv = lightLevel(frame);
  const motes = useMemo(
    () =>
      Array.from({length: 40}, (_, i) => ({
        x: (random(`dx-${i}`) - 0.5) * 8,
        y: 0.8 + random(`dy-${i}`) * 3.4,
        z: (random(`dz-${i}`) - 0.5) * 6,
        s: 0.02 + random(`ds-${i}`) * 0.025,
        ph: random(`dp-${i}`) * 6.28,
      })),
    [],
  );
  if (lv < 0.1) return null;
  return (
    <group>
      {motes.map((m, i) => (
        <Box
          key={i}
          pos={[m.x + Math.sin(frame * 0.02 + m.ph) * 0.3, m.y + Math.sin(frame * 0.03 + m.ph) * 0.15, m.z + Math.cos(frame * 0.02 + m.ph) * 0.2]}
          size={[m.s, m.s, m.s]}
          color="#ffd9a0"
          basic
          fog={false}
          opacity={0.5 * lv}
          cast={false}
        />
      ))}
    </group>
  );
};

const Lights: React.FC = () => {
  const frame = useCurrentFrame();
  const lv = lightLevel(frame);
  const pulse = 14 + 4 * Math.sin(frame * 0.2);
  const cam = getCamera(frame);
  const dx = cam.pos[0] - cam.target[0];
  const dy = cam.pos[1] - cam.target[1];
  const dz = cam.pos[2] - cam.target[2];
  const dist2 = dx * dx + dy * dy + dz * dz;
  return (
    <group>
      {/* fill dingin yang mengikuti kamera supaya wajah tetap terbaca */}
      <pointLight position={[cam.pos[0], cam.pos[1] + 0.6, cam.pos[2]]} color="#6f8ad0" intensity={(2 + 0.22 * dist2) * (0.35 + 0.65 * lv)} distance={14} decay={2} />
      <ambientLight color="#2b3c6e" intensity={0.12 + 0.75 * lv} />
      <hemisphereLight args={['#3a4a7a', '#1a0c0c', 0.15 + 0.45 * lv]} />
      <pointLight position={[0, 3.6, -4.9]} color="#ff1a14" intensity={pulse} distance={11} decay={2} />
      <HangingLamp x={-1.2} />
      <HangingLamp x={1.2} />
    </group>
  );
};

// ---------------------------------------------------------------------------
// Kamera
// ---------------------------------------------------------------------------

const CameraRig: React.FC = () => {
  const frame = useCurrentFrame();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const cam = getCamera(frame);
  useLayoutEffect(() => {
    camera.position.set(...cam.pos);
    camera.lookAt(...cam.target);
    camera.fov = cam.fov;
    camera.near = 0.1;
    camera.far = 60;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
  });
  return null;
};

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const pov = isPov(frame);
  return (
    <>
      <color attach="background" args={[isPovDay(frame) ? '#54647a' : '#030409']} />
      <fogExp2 attach="fog" args={[isPovDay(frame) ? '#5a6a80' : '#04060c', pov ? (isPovDay(frame) ? 0.025 : 0.07) : 0.04]} />
      <CameraRig />
      {pov ? (
        <>
          <PovLights />
          <PovScene />
        </>
      ) : (
        <>
          <Lights />
          <Room />
          <BoothWindow />
          <Door />
          <OnAirSign />
          <Table />
          <Laptop />
          <MicArm side={1} />
          <MicArm side={-1} />
          <Host role="A" />
          <Host role="B" />
          <FigureInWindow />
          <FigureInRoom />
          <Dust />
        </>
      )}
    </>
  );
};
