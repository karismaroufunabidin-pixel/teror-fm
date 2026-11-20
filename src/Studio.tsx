import React, {useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {Box, Blocks, jitter, type BlockItem} from './Voxel';
import {BLACKOUT_START, CAPTIONS, TURN_LARAS, TURN_WINDU, getCamera, getShot, isPov, isPovDay, lightLevel, mouthOpen, povScene, type V3} from './shots';

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
  const glowOn = frame >= 2305 && frame < 2707 ? 1 : 0.18;
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
      {/* gelas Laras (statis). Gelas Windu TIDAK di sini lagi: dia gelas
          animasi (AnimatedNoodleCup) yang menempel di tangan Windu saat minum,
          supaya tidak ada dua gelas sekaligus. */}
      <Box pos={[0.2, 1.4, 1.2]} size={[0.16, 0.2, 0.16]} color="#2a2a30" />
      {/* telepon studio di dekat Laras: alasnya saja. Gagang adalah
          AnimatedHandset yang bergerak dari meja ke telinga Laras (918-2767). */}
      <Box pos={[0.85, 1.34, 0.5]} size={[0.32, 0.06, 0.22]} color="#3a3f48" />
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
// Isinya HANYA visualisasi khayalan cerita Bimo, bukan video asli penelpon.
// Layar menyala saat portal aktif (P1 s.d. P3). Jam 12:01 muncul sebagai
// digit piksel voxel di layar saat shot T1, tanpa ada yang mengucapkannya.
// ---------------------------------------------------------------------------

const Laptop: React.FC = () => {
  const frame = useCurrentFrame();
  const portalActive = frame >= 2707 && frame < 4499;
  const twistOn = frame >= BLACKOUT_START;
  const glow = portalActive ? 1.8 : twistOn ? 1.2 : frame >= 2444 ? 0.7 : 0.1;
  // Miniatur twist di layar: kursi sopir KOSONG + setir berputar sendiri.
  // Ini visualisasi khayalan cerita Bimo, bukan video asli penelpon (L3).
  const wheelSpin = twistOn ? (frame - BLACKOUT_START) * 0.09 : 0;
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
          color={portalActive || twistOn ? '#cfe8ff' : '#0a0f14'}
          emissive="#cfe8ff"
          ei={glow}
          cast={false}
        />
        {twistOn && (
          <group position={[0, 0, 0.05]}>
            {/* kursi sopir kosong */}
            <Box pos={[-0.18, -0.1, 0]} size={[0.16, 0.2, 0.02]} color="#1a2436" basic fog={false} cast={false} />
            <Box pos={[-0.18, 0.02, 0]} size={[0.16, 0.1, 0.02]} color="#1a2436" basic fog={false} cast={false} />
            {/* setir berputar sendiri */}
            <group position={[0.18, 0.05, 0]} rotation={[0, 0, wheelSpin]}>
              {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
                const a = (k / 8) * Math.PI * 2;
                return (
                  <Box
                    key={k}
                    pos={[Math.cos(a) * 0.11, Math.sin(a) * 0.11, 0]}
                    size={[0.045, 0.045, 0.02]}
                    color="#0b0e14"
                    basic
                    fog={false}
                    cast={false}
                  />
                );
              })}
              <Box pos={[0, 0, 0]} size={[0.05, 0.05, 0.02]} color="#0b0e14" basic fog={false} cast={false} />
            </group>
            <Box pos={[0.18, -0.08, 0]} size={[0.03, 0.12, 0.02]} color="#0b0e14" basic fog={false} cast={false} />
          </group>
        )}
      </group>
      <pointLight position={[0, 1.7, 1.2]} color="#cfe8ff" intensity={portalActive ? 10 : twistOn ? 6 : 0.5} distance={3} decay={2} />
    </group>
  );
};

// Gelas kopi Windu (animasi, BUKAN prop statis di Table).
// Jendela minum 430-593: angkat 430-480, tahan di mulut 480-515,
// turun kembali ke meja 515-593. Di frame ~480 gelas HARUS di depan
// mulut Windu (world ~[-1.32, 1.98, -0.08]), bukan di meja.
// ---------------------------------------------------------------------------

const AnimatedNoodleCup: React.FC = () => {
  const frame = useCurrentFrame();
  // Jendela minum 324-482 (dialog 004): angkat 324-380, di mulut 380-430, turun 430-482.
  const cupT = interpolate(frame, [324, 380, 430, 482], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const steamT = interpolate(frame, [340, 380, 430, 460], [0, 1, 1, 0], clamp);
  const rest: V3 = [-0.95, 1.42, -0.45];
  const mouth: V3 = [-1.02, 1.96, -0.58];
  const pos: V3 = [
    rest[0] + (mouth[0] - rest[0]) * cupT,
    rest[1] + (mouth[1] - rest[1]) * cupT,
    rest[2] + (mouth[2] - rest[2]) * cupT,
  ];
  return (
    <group>
      <group position={pos} rotation={[0.15 * cupT, 0, -0.5 * cupT]}>
        <Box size={[0.26, 0.34, 0.26]} color="#f7efdd" emissive="#fff2cf" ei={1.1} />
        <Box pos={[0, 0.18, 0]} size={[0.22, 0.02, 0.22]} color="#c22a2a" cast={false} />
        <Box pos={[0, 0.1, 0]} size={[0.2, 0.06, 0.2]} color="#d8a04a" cast={false} />
        <Box pos={[0.15, 0, 0]} size={[0.05, 0.16, 0.05]} color="#f7efdd" emissive="#fff2cf" ei={0.8} cast={false} />
      </group>
      {steamT > 0.05 &&
        [0, 1, 2].map((i) => (
          <Box
            key={i}
            pos={[pos[0] + (i - 1) * 0.06, pos[1] + 0.28 + ((frame * 0.01 + i * 0.3) % 0.3), pos[2]]}
            size={[0.04, 0.04, 0.04]}
            color="#e8e8e8"
            basic
            fog={false}
            opacity={0.5 * steamT}
            cast={false}
          />
        ))}
    </group>
  );
};

// Gagang telepon studio: naik dari meja ke telinga Laras (918-960),
// bertahan di telinga selama Bimo bercerita, turun saat portal (2707-2767).
const AnimatedHandset: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [918, 960, 2707, 2767], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const rest: V3 = [0.85, 1.42, 0.5];
  const ear: V3 = [1.32, 2.18, 0.28];
  const pos: V3 = [
    rest[0] + (ear[0] - rest[0]) * t,
    rest[1] + (ear[1] - rest[1]) * t,
    rest[2] + (ear[2] - rest[2]) * t,
  ];
  if (t <= 0.01) return null;
  return (
    <group position={pos} rotation={[0, 0, -0.4 * t]}>
      <Box size={[0.28, 0.07, 0.09]} color="#d8d8d8" />
      <Box pos={[-0.1, 0.05, 0]} size={[0.07, 0.05, 0.07]} color="#8a8a8a" cast={false} />
      <Box pos={[0.1, 0.05, 0]} size={[0.07, 0.05, 0.07]} color="#8a8a8a" cast={false} />
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

  // --- Jendela animasi EP02 (satu aksi = satu jendela naik-tahan-turun) ---
  const env = (a: number, b: number, c: number, d: number) =>
    interpolate(frame, [a, b, c, d], [0, 1, 1, 0], {...clamp, easing: Easing.inOut(Easing.cubic)});
  // Windu: tepuk perut 102-203, minum mie 324-482, meringis dingin 430-482, lap mulut 482-520
  const stomachPatT = isA ? env(102, 120, 180, 203) : 0;
  const drinkT = isA ? env(324, 380, 430, 482) : 0;
  const grimT = isA ? env(430, 445, 470, 482) : 0;
  const wipeT = isA ? env(482, 495, 505, 520) : 0;
  // Laras: tertawa kecil 206-321, menulis 567-685
  const laughT = !isA ? env(206, 230, 300, 321) : 0;
  const writeT = !isA ? env(567, 600, 660, 685) : 0;
  // Laras: gagang telepon naik 918-960, bertahan di telinga s.d. portal 2707, turun 2707-2767
  const phoneT = !isA ? interpolate(frame, [918, 950, 2707, 2767], [0, 1, 1, 0], clamp) : 0;
  // Windu: tunjuk telepon 857-918, menoleh ke lampu 1932-2037, kaget setir 3810-3904
  const phonePointT = isA ? env(857, 875, 900, 918) : 0;
  const lookUpT = isA ? env(1932, 1950, 2010, 2037) : 0;
  const recoilT = isA ? env(3810, 3830, 3880, 3904) : 0;
  // Laras: tunjuk laptop 2474-2568 dan 4529-4671, angkat satu sisi headphone 3591-3665
  const pointT = !isA
    ? Math.max(env(2474, 2500, 2540, 2568), env(4529, 4560, 4630, 4671))
    : 0;
  const headphoneT = !isA ? env(3591, 3610, 3640, 3665) : 0;
  // Windu: tutup mulut dengan tangan 4780-4905, menunduk saat telepon putus 5194-5343
  const coverMouthT = isA ? env(4780, 4810, 4870, 4905) : 0;
  const slumpT = isA ? env(5194, 5220, 5300, 5343) : 0;
  // Pendengar mencondongkan badan saat penelpon bicara di studio
  const penCap = CAPTIONS.find((x) => x.who === 'PENELPON' && frame >= x.from && frame <= x.to);
  const listenT = penCap && frame < 2707
    ? interpolate(frame, [penCap.from, penCap.from + 15, penCap.to - 15, penCap.to], [0, 1, 1, 0], clamp)
    : 0;

  const headPitchExtra =
    -0.18 * grimT - 0.65 * lookUpT + 0.28 * slumpT - 0.12 * recoilT + 0.1 * phoneT -
    0.15 * coverMouthT + 0.12 * headphoneT - 0.1 * stomachPatT;
  const headYawExtra = 0.35 * pointT + 0.2 * phoneT + 0.25 * headphoneT;
  const headY = (isA ? -1 : 1) * turnT * 1.45 + idle + headYawExtra;
  const headZ = (isA ? 1 : -1) * turnT * 0.2 + 0.14 * laughT;
  const nod =
    amp * 0.05 * Math.sin(frame * 0.5) +
    Math.sin(frame * 0.07) * 0.015 +
    headPitchExtra +
    0.03 * Math.sin(frame * 0.12) * listenT;
  // Mata menyipit saat meringis / tertawa (beda dari mata melebar takut)
  const squintY = 1 - 0.55 * grimT - 0.5 * laughT;
  const browGrim = grimT * 0.3;
  const browLaugh = laughT * 0.15;

  // Windu: mata melebar saat setir berputar sendiri (3668-3807) dan saat telepon putus.
  // Laras: jarang takut — hanya melebar 1.3x saat jam 12:01 terlihat.
  const widen = isA
    ? interpolate(frame, [3668, 3720, 3807, 3904, 4780, 4905, 5194, 5343], [1, 1.75, 1.75, 1, 1, 1.75, 1.75, 1.75], clamp)
    : interpolate(frame, [5343, 5416], [1, 1.3], clamp);
  const pupil = 1 - 0.5 * ((widen - 1) / 0.75);
  const blink = widen < 1.3 && lookUpT < 0.5 && (frame + (isA ? 0 : 41)) % 97 < 3 ? 0.12 : 1;
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

      {/* badan: mencondong ke depan saat mendengarkan, menunduk saat
          telepon putus, mundur sedikit saat kaget, bahu bergetar saat tertawa */}
      <group
        position={[0, -0.05 * slumpT + 0.03 * Math.sin(frame * 0.9) * laughT, 0.07 * listenT - 0.08 * recoilT - 0.1 * lookUpT]}
        scale={[1, breath, 1]}
      >
        <Box pos={[0, 1.38, 0]} size={[0.64, 0.96, 0.32]} color={look.shirt} />
        {/* aksen kerah / logo */}
        <Box pos={[0, 1.7, 0.17]} size={[0.3, 0.06, 0.02]} color={isA ? '#3b6f73' : '#6a4a86'} cast={false} />
      </group>

      {/* lengan: satu lengan per aksi, lengan satunya tetap di meja.
          ax +0.48 = sisi dekat kamera di shot OTS masing-masing.
          Windu minum: lengan +0.48 terangkat ke mulut (430-593).
          Laras telepon: lengan +0.48 meraih telepon (759-860).
          Laras menunjuk laptop: lengan +0.48 terulur lurus (6517-6579).
          Windu headset: lengan -0.48 naik ke telinga saat telepon putus. */}
      {([-0.48, 0.48] as number[]).map((ax) => {
        const isDrinkArm = isA; // KEDUA lengan Windu mengangkat mie cup
        const isWipeArm = isA && ax === 0.48;
        const isPatArm = isA && ax === -0.48;
        const isPhoneArm = !isA && ax === 0.48;
        const isWriteArm = !isA && ax === -0.48;
        const isHeadsetArm = isA && ax === -0.48;
        const isCoverArm = isA && ax === 0.48;
        const rx =
          -1.1 +
          (isDrinkArm ? -0.75 * drinkT : 0) +
          (isWipeArm ? -0.9 * wipeT : 0) +
          (isPatArm ? 0.55 * stomachPatT : 0) +
          (isPhoneArm ? -0.5 * phoneT - 0.75 * pointT : 0) +
          (isWriteArm ? 0.35 * writeT : 0) +
          (isHeadsetArm ? -1.0 * slumpT : 0) +
          (isCoverArm ? -0.85 * coverMouthT : 0);
        const rz =
          (isDrinkArm ? -0.55 * drinkT : 0) +
          (isPhoneArm ? -0.85 * pointT - 0.3 * phoneT : 0) +
          (isHeadsetArm ? 0.5 * slumpT : 0) +
          (isCoverArm ? -0.4 * coverMouthT : 0) +
          (isWriteArm ? 0.2 * writeT : 0);
        const sleeveColor = isDrinkArm ? '#4a7d84' : look.shirt;
        return (
          <group key={ax} position={[ax, 1.74, 0]} rotation={[rx, 0, rz]}>
            <Box pos={[0, -0.48, 0]} size={[0.32, 0.96, 0.32]} color={sleeveColor} />
            <Box
              pos={[0, -0.9, 0]}
              size={isDrinkArm ? [0.36, 0.22, 0.36] : [0.32, 0.18, 0.32]}
              color={look.skin}
              emissive={isPhoneArm && pointT > 0.01 ? look.skin : undefined}
              ei={0.4}
            />
            {isWriteArm && writeT > 0.05 && (
              <Box pos={[0, -1.05, 0.08]} size={[0.05, 0.32, 0.05]} color="#1c2f6e" cast={false} />
            )}
          </group>
        );
      })}

      {/* Jari menunjuk Laras — BUKAN di dalam grup lengan (rotasi lengan
          rx -1.85 membuat jari di dalam grup menunjuk KE ATAS di samping
          wajah, bukan ke laptop). Jari ini dirender di ruang lokal Host,
          sumbu panjang di +z lokal = arah laptop, setinggi mulut/dagu,
          muncul dari tangan di ujung lengan menunjuk. */}
      {!isA && pointT > 0.01 && (
        <Box
          pos={[-0.35, 1.86, 0.82]}
          size={[0.2, 0.2, 0.55]}
          color={look.skin}
          emissive={look.skin}
          ei={0.6}
          rot={[0.45, 0, 0]}
          cast={false}
        />
      )}

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
            <Box pos={[s * 0.42, 0.32 + (s === 1 ? 0.28 * headphoneT : 0), -0.02 - (s === 1 ? 0.15 * headphoneT : 0)]} size={[0.14, 0.3, 0.3]} color="#14151a" />
            <Box pos={[s * 0.5, 0.32, -0.02]} size={[0.02, 0.18, 0.18]} color="#8a1111" emissive="#ff1a1a" ei={0.6} cast={false} />
          </group>
        ))}
        {/* wajah */}
        {eyeX.slice(0, 2).map((ex, i) => (
          <group key={i} position={[ex, 0.38, 0.325]} scale={[widen, widen * blink * squintY, 1]}>
            <Box size={[0.14, 0.1, 0.02]} color="#e8e8ea" cast={false} />
            <Box pos={[px * (i === 0 ? 1 : 1) * 0.5, 0.025 * lookUpT, 0.012]} size={[0.07 * pupil, 0.08 * pupil, 0.02]} color="#0b0b10" cast={false} />
          </group>
        ))}
        <Box pos={[-0.15, 0.47, 0.325]} size={[0.17, 0.03, 0.02]} color={hair} cast={false} rot={[0, 0, (widen > 1.3 ? 0.25 : 0) + browGrim - browLaugh]} />
        <Box pos={[0.15, 0.47, 0.325]} size={[0.17, 0.03, 0.02]} color={hair} cast={false} rot={[0, 0, (widen > 1.3 ? -0.25 : 0) - browGrim + browLaugh]} />
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
  if (frame < 2305 || frame >= 2707) return null;
  const fx = interpolate(frame, [2305, 2600], [-9.4, -7.55], {...clamp, easing: Easing.out(Easing.quad)});
  return (
    <group position={[fx, 0, interpolate(frame, [2400, 2650], [0, 0.45], clamp)]} rotation={[0, Math.PI / 2, 0]}>
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
// halte KM 12, jalan malam, terminal kosong. Sosok tanpa wajah di kursi bus.
// Laras dan Windu TIDAK tampil di POV, hanya suara Bimo sebagai narasi.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// POV Bimo (Babak 3) — voxel kode saja, tanpa gambar AI.
// Bus: depan (kaca depan, sopir, pintu) di z=-4, belakang di z=+4.
// (a) interior bus lengkap, (b) halte KM 12 lengkap, (c) jalan malam + terminal.
// Bimo divisualisasikan dari belakang (tanpa wajah jelas); penumpang adalah
// sosok bayangan (Listener) yang posisinya berpindah. Laras dan Windu TIDAK
// tampil di POV, hanya suara mereka sebagai narasi.
// ---------------------------------------------------------------------------

const PovScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = povScene(frame);
  const inBus = scene === 'p2a' || scene === 'p2b';
  const inHalte = scene === 'p2d';
  const inRoad = scene === 'p2e';

  // --- Animasi Bimo ---
  // 2767-3023 di kursi belakang membungkuk ambil uang; 3023-3314 di lorong
  // menoleh ke spion; 3314-3446 berjalan kembali ke kursi sopir sambil
  // memegang sandaran kursi; >=3446 duduk di kursi sopir.
  const walkZ = interpolate(frame, [3314, 3446], [2.0, -3.2], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  const bimoPosZ = frame < 3023 ? 3.2 : frame < 3314 ? 2.0 : frame < 3446 ? walkZ : -3.2;
  const bimoPosX = frame < 3023 ? -0.6 : 0;
  const walking = frame >= 3314 && frame < 3446;
  const walkPh = Math.sin(frame * 0.3);
  const bimoBend = interpolate(frame, [2767, 2820, 2880, 2919], [0, 1, 1, 0], clamp);
  const bimoSit = interpolate(frame, [3446, 3500], [0, 1], clamp);
  const mirrorT = interpolate(frame, [3023, 3060, 3120, 3162], [0, 1, 1, 0], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  // Uang: dari kursi belakang ke tangan Bimo, dibalik (diputar) di tangan.
  const moneyT = interpolate(frame, [2770, 2860, 2919], [0, 1, 1], clamp);
  const moneyPos: V3 = [
    -0.95 + (-0.6 + 0.95) * moneyT,
    1.05 + (1.3 - 1.05) * moneyT,
    2.5 + (2.9 - 2.5) * moneyT,
  ];
  // Penumpang: kursi belakang kanan (z 3.8) s.d. 3449, lalu PINDAH ke kursi
  // tepat di belakang sopir (z -2.0) selama 3449-3520.
  const passZ = frame < 3449 ? 3.8 : interpolate(frame, [3449, 3520], [3.8, -2.0], clamp);
  const passX = frame < 3449 ? 0.95 : interpolate(frame, [3449, 3520], [0.95, 0.95], clamp);
  // Setir: goyang pelan saat normal; berputar sendiri 3668-4089 (+ gemetar).
  const wheelAngle =
    frame < 3668
      ? Math.sin(frame * 0.04) * 0.12
      : (frame - 3668) * 0.11 + Math.sin(frame * 0.9) * 0.05;
  const pedalT = interpolate(frame, [3907, 3950, 4089], [0, 1, 1], clamp);
  const doorOpenT =
    interpolate(frame, [4092, 4160], [0, 1], clamp) *
    (1 - interpolate(frame, [4232, 4300], [0, 1], clamp));
  const seatRows = [-2.0, -0.5, 1.0, 2.5, 3.8];

  return (
    <group>
      {/* ================= (a) INTERIOR BUS MALAM ================= */}
      {inBus && (
        <group>
          {/* lantai, langit-langit, dinding + jendela samping */}
          <Box pos={[0, -0.15, 0]} size={[3.6, 0.3, 10]} color="#1c1e24" receive />
          <Box pos={[0, 2.85, 0]} size={[3.6, 0.2, 10]} color="#14161c" />
          <Box pos={[-1.65, 1.4, 0]} size={[0.15, 2.8, 10]} color="#23262e" />
          <Box pos={[1.65, 1.4, 0]} size={[0.15, 2.8, 10]} color="#23262e" />
          {([-1.62, 1.62] as number[]).map((wx) =>
            ([-3, -1, 1, 3] as number[]).map((wz) => (
              <Box key={`${wx}-${wz}`} pos={[wx, 1.9, wz]} size={[0.04, 1.0, 1.4]} color="#0a1220" opacity={0.55} cast={false} />
            )),
          )}
          {/* kaca depan */}
          <Box pos={[0, 1.7, -4.75]} size={[2.9, 1.7, 0.06]} color="#05060a" opacity={0.35} cast={false} />
          <Box pos={[0, 0.6, -4.8]} size={[3.2, 1.0, 0.15]} color="#1a1d24" />
          {/* dashboard + tombol pintu */}
          <Box pos={[0, 1.15, -4.3]} size={[3.0, 0.35, 0.5]} color="#15171c" />
          <Box pos={[0.9, 1.38, -4.3]} size={[0.16, 0.06, 0.16]} color="#d62a2a" emissive="#ff2a2a" ei={1.2} cast={false} />
          <Box pos={[0, 1.35, -4.3]} size={[0.5, 0.1, 0.2]} color="#0a0f14" cast={false} />
          {/* lampu bus di langit-langit */}
          {([-2.5, 0, 2.5] as number[]).map((lz) => (
            <Box key={lz} pos={[0, 2.72, lz]} size={[1.2, 0.06, 0.5]} color="#ffdf8a" emissive="#ffdf8a" ei={1.4} cast={false} />
          ))}
          <pointLight position={[0, 2.4, 0]} color="#ffdf8a" intensity={35} distance={10} decay={2} />
          <pointLight position={[0, 2.2, 3.0]} color="#ffdf8a" intensity={14} distance={5} decay={2} />
          {/* tiang pegangan + rel tangan */}
          {([-1.2, 1.2] as number[]).flatMap((px) =>
            ([-1, 1, 3] as number[]).map((pz) => (
              <Box key={`${px}-${pz}`} pos={[px, 1.4, pz]} size={[0.08, 2.8, 0.08]} color="#8a8f98" />
            )),
          )}
          <Box pos={[0, 2.55, 0]} size={[0.07, 0.07, 9]} color="#8a8f98" />
          {/* kursi-kursi bus: 5 baris x 2 sisi, sandaran + dudukan */}
          {seatRows.map((rz) =>
            ([-0.95, 0.95] as number[]).map((rx) => (
              <group key={`${rx}-${rz}`}>
                <Box pos={[rx, 0.55, rz]} size={[0.7, 0.15, 0.6]} color="#2a3550" />
                <Box pos={[rx, 1.0, rz + 0.28]} size={[0.7, 0.9, 0.15]} color="#2a3550" />
                <Box pos={[rx, 1.35, rz + 0.2]} size={[0.7, 0.12, 0.06]} color="#1c2438" cast={false} />
              </group>
            )),
          )}
          {/* kursi sopir */}
          <Box pos={[0, 0.55, -3.2]} size={[0.7, 0.15, 0.6]} color="#3a2a1a" />
          <Box pos={[0, 1.0, -2.92]} size={[0.7, 0.9, 0.15]} color="#3a2a1a" />
          {/* pintu depan (sisi kanan) — terbuka sendiri di halte */}
          <Box pos={[1.58 + 0.5 * doorOpenT, 1.2, -3.9]} size={[0.08, 2.2, 0.9]} color="#23262e" />
          {/* kaca spion dalam + bayangan penumpang di spion */}
          <Box pos={[0, 2.5, -4.4]} size={[0.8, 0.3, 0.04]} color="#9aa0aa" cast={false} />
          {mirrorT > 0.05 && (
            <group position={[0, 2.45, -4.32]} scale={[0.35, 0.35, 0.35]}>
              <Listener eyeGlow={0.7} />
            </group>
          )}
          {/* setir + tangan Bimo di setir (berputar bersama setir) */}
          <group position={[0, 1.45, -3.55]} rotation={[0.5, 0, wheelAngle]}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
              const a = (k / 8) * Math.PI * 2;
              return (
                <Box
                  key={k}
                  pos={[Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0]}
                  size={[0.11, 0.11, 0.06]}
                  color="#2a2a2e"
                  emissive="#2a2a2e"
                  ei={0.15}
                />
              );
            })}
            <Box pos={[0, 0, 0]} size={[0.12, 0.12, 0.08]} color="#14161c" />
            {/* penanda merah di pelek: putaran setir terbaca di still */}
            <Box pos={[0, 0.3, 0.02]} size={[0.1, 0.1, 0.06]} color="#ff2a1f" emissive="#ff2a1f" ei={0.6} cast={false} />
            {bimoSit > 0.5 && (
              <>
                <Box pos={[-0.3, 0.12, 0.08]} size={[0.14, 0.14, 0.1]} color="#8a6a4a" />
                <Box pos={[0.3, -0.1, 0.08]} size={[0.14, 0.14, 0.1]} color="#8a6a4a" />
              </>
            )}
          </group>
          <Box pos={[0, 1.25, -3.55]} size={[0.07, 0.4, 0.07]} color="#14161c" />
          {/* pedal rem + kaki Bimo mencoba menginjak rem */}
          {bimoSit > 0.5 && (
            <group>
              <Box pos={[0.35, 0.3 - 0.12 * pedalT, -3.0]} size={[0.16, 0.1, 0.3]} color="#8a6a4a" />
              <Box pos={[0.35, 0.55, -2.7]} size={[0.18, 0.5, 0.18]} color="#14161d" />
            </group>
          )}
          {/* uang lecek di kursi belakang, lalu di tangan Bimo (dibalik) */}
          <group position={moneyPos} rotation={[0, moneyT * Math.PI, 0]}>
            <Box size={[0.28, 0.02, 0.18]} color="#c9b98a" emissive="#c9b98a" ei={0.9} cast={false} />
          </group>
          {/* Bimo: dari belakang, tanpa wajah jelas. Seragam sopir biru gelap + topi. */}
          <group
            position={[bimoPosX, walking ? 0.04 * Math.abs(walkPh) : 0, bimoPosZ]}
            rotation={[0, Math.PI, walking ? 0.06 * walkPh : 0]}
          >
            {bimoSit < 0.5 && (
              <>
                {([-0.12, 0.12] as number[]).map((lx, i) => (
                  <group
                    key={lx}
                    position={[lx, 0.85, 0]}
                    rotation={[walking ? (i === 0 ? 1 : -1) * 0.6 * walkPh : 0, 0, 0]}
                  >
                    <Box pos={[0, -0.4, 0]} size={[0.18, 0.85, 0.18]} color="#14161d" />
                  </group>
                ))}
              </>
            )}
            {bimoSit >= 0.5 && (
              <>
                <Box pos={[-0.14, 0.45, 0.1]} size={[0.2, 0.9, 0.2]} color="#14161d" />
                <Box pos={[0.14, 0.45, 0.1]} size={[0.2, 0.9, 0.2]} color="#14161d" />
              </>
            )}
            <group position={[0, 0.95, 0]} rotation={[-(0.65 * bimoBend) * (1 - bimoSit), 0, 0]}>
              <Box pos={[0, 0.35, 0]} size={[0.55, 0.6, 0.3]} color="#2a4a70" />
              {([-0.32, 0.32] as number[]).map((ax, i) => (
                <group
                  key={ax}
                  position={[ax, 0.55, 0]}
                  rotation={[
                    walking ? (i === 0 ? -1 : 1) * 0.5 * walkPh : bimoBend > 0.5 ? -1.1 : bimoSit > 0.5 ? -1.3 : -0.2,
                    0,
                    0,
                  ]}
                >
                  <Box pos={[0, -0.3, 0]} size={[0.14, 0.6, 0.14]} color="#2a4a70" />
                  <Box pos={[0, -0.62, 0]} size={[0.13, 0.14, 0.13]} color="#8a6a4a" />
                </group>
              ))}
              <group position={[0, 0.78, 0]} rotation={[0, -1.1 * mirrorT, 0]}>
                <Box size={[0.4, 0.4, 0.4]} color="#8a6a4a" />
                <Box pos={[0, 0.21, 0]} size={[0.42, 0.06, 0.42]} color="#2a4a70" cast={false} />
                <Box pos={[0, 0, 0.21]} size={[0.34, 0.1, 0.04]} color="#0a0a0c" cast={false} />
              </group>
            </group>
          </group>
          {/* penumpang: sosok bayangan tanpa wajah, duduk di belakang */}
          <group position={[passX, 0, passZ]} rotation={[0, Math.PI, 0]} scale={[0.85, 0.85, 0.85]}>
            <Listener eyeGlow={0.6} />
          </group>
        </group>
      )}

      {/* ================= (b) HALTE KM 12 LENGKAP ================= */}
      {inHalte && (
        <group>
          {/* tanah + jalan + trotoar */}
          <Box pos={[0, -0.15, 0]} size={[18, 0.3, 18]} color="#1e1a14" receive />
          <Box pos={[0, -0.05, 3.5]} size={[18, 0.12, 3]} color="#14161c" receive />
          <Box pos={[0, -0.02, 1.2]} size={[18, 0.08, 1.4]} color="#2e2a24" receive />
          {/* marka jalan */}
          {([-6, -3, 0, 3, 6] as number[]).map((mx) => (
            <Box key={mx} pos={[mx, 0.05, 3.5]} size={[1.2, 0.02, 0.14]} color="#c9b98a" cast={false} />
          ))}
          {/* halte: atap, tiang, bangku, papan nama + papan jadwal */}
          <Box pos={[0, 2.6, 0]} size={[3.4, 0.16, 1.8]} color="#23262e" />
          <Box pos={[-1.5, 1.3, -0.7]} size={[0.14, 2.6, 0.14]} color="#3a3f48" />
          <Box pos={[1.5, 1.3, -0.7]} size={[0.14, 2.6, 0.14]} color="#3a3f48" />
          <Box pos={[0, 0.55, -0.5]} size={[2.6, 0.12, 0.5]} color="#4a3427" />
          <Box pos={[-1.2, 0.28, -0.5]} size={[0.12, 0.55, 0.12]} color="#1a110c" />
          <Box pos={[1.2, 0.28, -0.5]} size={[0.12, 0.55, 0.12]} color="#1a110c" />
          <Box pos={[0, 2.2, -0.75]} size={[2.2, 0.5, 0.06]} color="#1c2438" emissive="#3a4a6a" ei={0.6} cast={false} />
          <Box pos={[-1.2, 1.5, 0.4]} size={[0.9, 1.2, 0.06]} color="#2a2f38" />
          {([0, 1, 2, 3, 4] as number[]).map((r) => (
            <Box key={r} pos={[-1.2, 1.9 - r * 0.18, 0.44]} size={[0.7, 0.05, 0.02]} color="#c9c9c9" cast={false} />
          ))}
          {/* lampu jalan halte */}
          <Box pos={[2.8, 1.5, 1.2]} size={[0.14, 3.0, 0.14]} color="#1c1e22" />
          <Box pos={[2.8, 3.05, 1.2]} size={[0.5, 0.18, 0.5]} color="#ffdf8a" emissive="#ffdf8a" ei={2.0} cast={false} />
          <pointLight position={[2.8, 2.9, 1.2]} color="#ffdf8a" intensity={22} distance={10} decay={2} />
          {/* bus parkir di halte, pintu terbuka sendiri */}
          <group position={[-3.2, 0, 2.2]}>
            <Box pos={[0, 1.3, 0]} size={[5.5, 2.2, 2.2]} color="#2a4a70" />
            <Box pos={[0, 2.5, 0]} size={[5.5, 0.2, 2.2]} color="#14161c" />
            {([-2, -1, 0, 1, 2] as number[]).map((wx) => (
              <Box key={wx} pos={[wx, 1.7, 1.12]} size={[0.8, 0.7, 0.04]} color="#0a1220" cast={false} />
            ))}
            <Box pos={[2.6, 1.0, 1.12]} size={[0.5, 0.6, 0.04]} color="#ffdf8a" emissive="#ffdf8a" ei={1.5} cast={false} />
            <Box pos={[2.0 + 0.6 * doorOpenT, 1.1, 1.15]} size={[0.7, 1.9, 0.06]} color="#2a3550" />
            <Box pos={[-2.2, 0.45, 0.8]} size={[0.7, 0.7, 0.7]} color="#0a0a0c" />
            <Box pos={[2.2, 0.45, 0.8]} size={[0.7, 0.7, 0.7]} color="#0a0a0c" />
          </group>
          {/* pohon + pagar + bangunan jauh */}
          {([-5.5, 5.5] as number[]).map((tx) => (
            <group key={tx}>
              <Box pos={[tx, 1.0, -3]} size={[0.35, 2.0, 0.35]} color="#241812" />
              <Box pos={[tx, 2.6, -3]} size={[1.6, 1.4, 1.6]} color="#16241a" />
            </group>
          ))}
          {([-4, -3, -2, -1, 0, 1, 2, 3, 4] as number[]).map((fx) => (
            <Box key={fx} pos={[fx, 0.5, -4.5]} size={[0.12, 1.0, 0.12]} color="#2e2a24" />
          ))}
          <Box pos={[0, 0.85, -4.5]} size={[8.4, 0.08, 0.08]} color="#2e2a24" />
          <Box pos={[-6, 1.5, -6]} size={[3, 3, 2]} color="#1a1d24" />
          <Box pos={[6, 1.5, -6]} size={[3, 3, 2]} color="#1a1d24" />
        </group>
      )}

      {/* ================= (c) JALAN MALAM + TERMINAL KOSONG ================= */}
      {inRoad && (
        <group>
          <Box pos={[0, -0.15, 0]} size={[16, 0.3, 20]} color="#1e1a14" receive />
          {/* jalan lurus + marka yang bergerak (bus jalan) */}
          <Box pos={[0, -0.05, 0]} size={[3.2, 0.12, 20]} color="#14161c" receive />
          {([-8, -6, -4, -2, 0, 2, 4, 6, 8] as number[]).map((dz) => (
            <Box
              key={dz}
              pos={[0, 0.05, dz + ((frame * 0.08) % 2)]}
              size={[0.14, 0.02, 1.0]}
              color="#c9b98a"
              cast={false}
            />
          ))}
          {/* lampu jalan berderet */}
          {([-6, -3, 0, 3, 6] as number[]).map((lz) => (
            <group key={lz}>
              <Box pos={[-2.2, 1.5, lz]} size={[0.14, 3.0, 0.14]} color="#1c1e22" />
              <Box pos={[-2.2, 3.05, lz]} size={[0.5, 0.18, 0.5]} color="#ffdf8a" emissive="#ffdf8a" ei={1.8} cast={false} />
            </group>
          ))}
          <pointLight position={[0, 3, 0]} color="#ffdf8a" intensity={16} distance={12} decay={2} />
          {/* terminal kosong di kejauhan */}
          <Box pos={[0, 1.5, -9]} size={[9, 3, 2]} color="#23262e" />
          <Box pos={[0, 3.15, -9]} size={[9.4, 0.3, 2.2]} color="#14161c" />
          {([-3, -1.5, 0, 1.5, 3] as number[]).map((wx) => (
            <Box key={wx} pos={[wx, 1.6, -7.95]} size={[1.0, 0.9, 0.06]} color={wx === 0 ? '#ffdf8a' : '#0a1220'} emissive={wx === 0 ? '#ffdf8a' : undefined} ei={wx === 0 ? 0.8 : 0} cast={false} />
          ))}
          <Box pos={[0, 2.6, -7.95]} size={[3.5, 0.4, 0.06]} color="#1c2438" emissive="#3a4a6a" ei={0.6} cast={false} />
          {/* bus-bus lain yang diam di terminal */}
          <Box pos={[-4.5, 1.1, -6]} size={[5, 2.2, 2.2]} color="#1a1d24" />
          <Box pos={[4.5, 1.1, -6.5]} size={[5, 2.2, 2.2]} color="#1a1d24" />
          {/* pohon + pagar */}
          {([-5, 5] as number[]).map((tx) => (
            <group key={tx}>
              <Box pos={[tx, 1.0, -4]} size={[0.35, 2.0, 0.35]} color="#241812" />
              <Box pos={[tx, 2.6, -4]} size={[1.6, 1.4, 1.6]} color="#16241a" />
            </group>
          ))}
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
          <AnimatedNoodleCup />
          <AnimatedHandset />
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
