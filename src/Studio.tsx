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
  const glowOn = frame >= 1775 && frame < 3233 ? 1 : 0.18;
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
          HP Windu (AnimatedPhone) tergeletak di meja, bukan prop statis. */}
      <Box pos={[0.2, 1.4, 1.2]} size={[0.16, 0.2, 0.16]} color="#2a2a30" />
      {/* telepon studio di dekat Laras: alasnya saja. Gagang adalah
          AnimatedHandset yang bergerak dari meja ke telinga Laras (930-3293). */}
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
// Isinya HANYA visualisasi khayalan cerita Nadia, bukan video asli penelpon.
// Layar menyala saat portal aktif (P1 s.d. P3). L52: TIDAK ADA visual
// nama/monitor kamar 7 di layar — twist hanya diucapkan Nadia.
// ---------------------------------------------------------------------------

const Laptop: React.FC = () => {
  const frame = useCurrentFrame();
  const portalActive = frame >= 3233 && frame < 5532;
  const twistOn = frame >= BLACKOUT_START;
  // L52: layar TIDAK PERNAH menampilkan isi POV (nama/monitor/kamar 7).
  // Saat twist lampu mati, layar ikut mati — hanya cahaya ON AIR merah.
  const glow = portalActive ? 1.8 : twistOn ? 0 : frame >= 2948 ? 0.7 : 0.1;
  // L52: tidak ada miniatur isi POV di layar saat twist. Layar hanya menyala
  // redup saat portal aktif (visualisasi khayalan Nadia, bukan rekaman).
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
          color={portalActive ? '#cfe8ff' : frame >= 2948 && !twistOn ? '#9db8cc' : '#0a0f14'}
          emissive="#cfe8ff"
          ei={glow}
          cast={false}
        />
      </group>
      <pointLight position={[0, 1.7, 1.2]} color="#cfe8ff" intensity={portalActive ? 10 : twistOn ? 0 : 0.5} distance={3} decay={2} />
    </group>
  );
};

// HP Windu di meja (animasi, BUKAN prop statis di Table).
// L19 hook: layar MENYALA SENDIRI f55-95 (dalam 90 frame pertama) sebelum
// dialog panjang. Baterai 3% ditunjukkan sebagai bar merah kecil di layar.
// ---------------------------------------------------------------------------

const AnimatedPhone: React.FC = () => {
  const frame = useCurrentFrame();
  const screenGlow = interpolate(frame, [55, 65, 85, 95], [0.2, 2.2, 2.2, 0.3], clamp);
  return (
    <group position={[-0.95, 1.36, -0.45]} rotation={[0, 0.4, 0]}>
      <Box size={[0.5, 0.05, 0.28]} color="#14161a" />
      <Box pos={[0, 0.03, 0]} size={[0.44, 0.02, 0.22]} color="#0a0f14" emissive="#cfe8ff" ei={screenGlow} cast={false} />
      {/* bar baterai 3% — merah, hampir habis */}
      <Box pos={[-0.18, 0.045, 0]} size={[0.05, 0.02, 0.1]} color="#ff2a1f" emissive="#ff2a1f" ei={1.2} cast={false} />
      <Box pos={[0.05, 0.045, 0]} size={[0.3, 0.02, 0.1]} color="#2a2f38" cast={false} />
    </group>
  );
};

// Kabel charger Windu: dicolok 531-580, ditarik 580-620, dicolok lagi 620-670
// (dialog 005: udah aku colok dua kali, tetap tiga persen).
const AnimatedChargerCable: React.FC = () => {
  const frame = useCurrentFrame();
  const plugT = interpolate(frame, [531, 580, 620, 670], [0, 1, 0, 1], {
    ...clamp,
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <group position={[-0.95 - 0.35 + 0.3 * plugT, 1.36, -0.45]} rotation={[0, 0, 0.3]}>
      <Box size={[0.35, 0.04, 0.06]} color="#1c1e22" />
      <Box pos={[0.2, 0, 0]} size={[0.08, 0.06, 0.08]} color="#8a8f98" cast={false} />
    </group>
  );
};

// Gagang telepon studio: naik dari meja ke telinga Laras (930-970),
// bertahan di telinga selama Nadia bercerita, turun saat portal (3233-3293).
const AnimatedHandset: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [930, 970, 3233, 3293], [0, 1, 1, 0], {
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
  // Windu: tunjuk layar HP 3% 102-251, tepuk HP nyala sendiri 254-388, colok charger 531-670
  const phoneShowT = isA ? env(102, 130, 220, 251) : 0;
  const phoneTapT = isA ? env(254, 275, 350, 388) : 0;
  const chargerT = isA ? env(531, 570, 630, 670) : 0;
  // Laras: menulis di kertas naskah 673-822
  const writeT = !isA ? env(673, 700, 790, 822) : 0;
  // Laras: gagang telepon naik 930-970, bertahan di telinga s.d. portal 3233, turun 3233-3293
  const phoneT = !isA ? interpolate(frame, [930, 970, 3233, 3293], [0, 1, 1, 0], clamp) : 0;
  // Windu: tunjuk telepon 857-918, menoleh ke lampu 1932-2037, kaget setir 3810-3904
  const phonePointT = isA ? env(867, 885, 905, 927) : 0;
  const lookUpT = isA ? env(2672, 2690, 2770, 2799) : 0;
  const recoilT = isA ? env(4787, 4810, 4860, 4888) : 0;
  // Laras: tunjuk laptop 2474-2568 dan 4529-4671, angkat satu sisi headphone 3591-3665
  const pointT = !isA ? env(2978, 3005, 3045, 3069) : 0;
  const headphoneT = !isA ? env(1775, 1800, 2000, 2044) : 0;
  // Windu: tutup mulut dengan tangan 6550-6684, menunduk saat telepon putus 6550-6684
  const coverMouthT = isA ? env(6550, 6580, 6650, 6684) : 0;
  const slumpT = isA ? env(6550, 6580, 6650, 6684) : 0;
  // Pendengar mencondongkan badan saat penelpon bicara di studio
  const penCap = CAPTIONS.find((x) => x.who === 'PENELPON' && frame >= x.from && frame <= x.to);
  const listenT = penCap && frame < 3233
    ? interpolate(frame, [penCap.from, penCap.from + 15, penCap.to - 15, penCap.to], [0, 1, 1, 0], clamp)
    : 0;

  const headPitchExtra =
    -0.65 * lookUpT + 0.28 * slumpT - 0.12 * recoilT + 0.1 * phoneT -
    0.15 * coverMouthT + 0.12 * headphoneT - 0.1 * phoneTapT - 0.08 * phoneShowT;
  const headYawExtra = 0.35 * pointT + 0.2 * phoneT + 0.25 * headphoneT;
  const headY = (isA ? -1 : 1) * turnT * 1.45 + idle + headYawExtra;
  const headZ = (isA ? 1 : -1) * turnT * 0.2;
  const nod =
    amp * 0.05 * Math.sin(frame * 0.5) +
    Math.sin(frame * 0.07) * 0.015 +
    headPitchExtra +
    0.03 * Math.sin(frame * 0.12) * listenT;
  const squintY = 1;
  const browGrim = 0;
  const browLaugh = 0;

  // Windu: mata melebar saat setir berputar sendiri (3668-3807) dan saat telepon putus.
  // Laras: jarang takut — hanya melebar 1.3x saat jam 12:01 terlihat.
  const widen = isA
    ? interpolate(frame, [4787, 4830, 4888, 6550, 6684], [1, 1.75, 1, 1, 1.75], clamp)
    : interpolate(frame, [6550, 6687], [1, 1.3], clamp);
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
        position={[0, -0.05 * slumpT, 0.07 * listenT - 0.08 * recoilT - 0.1 * lookUpT]}
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
        const isDrinkArm = isA && ax === 0.48; // lengan Windu meraih HP / charger
        const isPatArm = isA && ax === -0.48;
        const isPhoneArm = !isA && ax === 0.48;
        const isWriteArm = !isA && ax === -0.48;
        const isHeadsetArm = isA && ax === -0.48;
        const isCoverArm = isA && ax === 0.48;
        const rx =
          -1.1 +
          (isDrinkArm ? -0.6 * phoneShowT - 0.75 * chargerT : 0) +
          (isPatArm ? 0.55 * phoneTapT : 0) +
          (isPhoneArm ? -0.5 * phoneT - 0.75 * pointT : 0) +
          (isWriteArm ? 0.35 * writeT : 0) +
          (isHeadsetArm ? -1.0 * slumpT : 0) +
          (isCoverArm ? -0.85 * coverMouthT : 0);
        const rz =
          (isDrinkArm ? -0.4 * phoneShowT - 0.55 * chargerT : 0) +
          (isPhoneArm ? -0.85 * pointT - 0.3 * phoneT : 0) +
          (isHeadsetArm ? 0.5 * slumpT : 0) +
          (isCoverArm ? -0.4 * coverMouthT : 0) +
          (isWriteArm ? 0.2 * writeT : 0);
        const sleeveColor = look.shirt;
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
  if (frame < 1775 || frame >= 2180) return null;
  const fx = interpolate(frame, [1775, 2050], [-9.4, -7.55], {...clamp, easing: Easing.out(Easing.quad)});
  return (
    <group position={[fx, 0, interpolate(frame, [1850, 2150], [0, 0.45], clamp)]} rotation={[0, Math.PI / 2, 0]}>
      <Listener />
    </group>
  );
};

// EP03: sosok TIDAK masuk ke ruangan. Twist-nya telepon putus + nama
// pasien berubah jadi Nadia (hanya diucapkan, bukan ditampilkan).
const FigureInRoom: React.FC = () => null;


// ---------------------------------------------------------------------------
// POV Nadia (Babak 3) — voxel kode saja, tanpa gambar AI.
// RS lantai 3: (a) lorong lantai 3 lengkap, (b) kamar 7 lengkap,
// (c) lorong gelap, (d) nurse station lengkap.
// Nadia divisualisasikan dari belakang (tanpa wajah jelas), seragam perawat
// putih. Laras dan Windu TIDAK tampil di POV, hanya suara mereka.
// L52: nama pasien di monitor TIDAK PERNAH ditampilkan sebagai teks/gambar —
// monitor hanya layar abu-abu (kosong). Nama "Nadia" hanya DIUCAPKAN penelpon
// di Babak 4, di studio tidak ada visual monitor itu.
// ---------------------------------------------------------------------------

const NadiaFigure: React.FC<{
  pos: V3;
  rotY?: number;
  bend?: number;
  armRaise?: number;
  walking?: boolean;
  tray?: boolean;
  flashlight?: boolean;
}> = ({pos, rotY = Math.PI, bend = 0, armRaise = 0, walking = false, tray = false, flashlight = false}) => {
  const frame = useCurrentFrame();
  const ph = Math.sin(frame * (walking ? 0.5 : 0.1));
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      {/* kaki */}
      {([-0.12, 0.12] as number[]).map((lx, i) => (
        <group key={lx} position={[lx, 0.85, 0]} rotation={[walking ? (i === 0 ? 1 : -1) * 0.55 * ph : 0, 0, 0]}>
          <Box pos={[0, -0.4, 0]} size={[0.18, 0.85, 0.18]} color="#1c1a22" />
        </group>
      ))}
      {/* badan membungkuk saat memeriksa selimut */}
      <group position={[0, 0.95, 0]} rotation={[-0.65 * bend, 0, 0]}>
        <Box pos={[0, 0.35, 0]} size={[0.55, 0.6, 0.3]} color="#e8eef2" />
        <Box pos={[0, 0.55, 0.16]} size={[0.3, 0.08, 0.02]} color="#c22a2a" cast={false} />
        {([-0.32, 0.32] as number[]).map((ax, i) => (
          <group
            key={ax}
            position={[ax, 0.55, 0]}
            rotation={[tray ? -1.1 : walking ? (i === 0 ? -1 : 1) * 0.5 * ph : armRaise > 0.5 ? -1.4 : -0.2, 0, 0]}
          >
            <Box pos={[0, -0.3, 0]} size={[0.14, 0.6, 0.14]} color="#e8eef2" />
            <Box pos={[0, -0.62, 0]} size={[0.13, 0.14, 0.13]} color="#dcb59b" />
          </group>
        ))}
        {/* nampan obat di depan, dua tangan */}
        {tray && (
          <group position={[0, 0.55, 0.45]}>
            <Box size={[0.5, 0.04, 0.35]} color="#9aa0aa" />
            <Box pos={[-0.12, 0.05, 0]} size={[0.08, 0.1, 0.08]} color="#c9b98a" cast={false} />
            <Box pos={[0.1, 0.05, 0.05]} size={[0.08, 0.08, 0.08]} color="#f2f2f2" cast={false} />
            <Box pos={[0.12, 0.05, -0.08]} size={[0.06, 0.12, 0.06]} color="#3a6ea5" cast={false} />
          </group>
        )}
        {/* senter di tangan kanan saat gelap */}
        {flashlight && (
          <group position={[0.32, 0.1, 0.45]}>
            <Box size={[0.1, 0.1, 0.28]} color="#14161a" />
            <Box pos={[0, 0, 0.16]} size={[0.08, 0.08, 0.02]} color="#cfe8ff" emissive="#cfe8ff" ei={2.5} cast={false} />
          </group>
        )}
        {/* kepala: dari belakang, rambut + sanggul, tanpa wajah jelas */}
        <group position={[0, 0.78, 0]}>
          <Box size={[0.4, 0.4, 0.4]} color="#dcb59b" />
          <Box pos={[0, 0.21, 0]} size={[0.42, 0.06, 0.42]} color="#1b1013" cast={false} />
          <Box pos={[0, 0.1, -0.22]} size={[0.2, 0.2, 0.08]} color="#1b1013" cast={false} />
          <Box pos={[0, 0.24, 0]} size={[0.2, 0.08, 0.2]} color="#f2f2f2" cast={false} />
        </group>
      </group>
    </group>
  );
};

const Corridor: React.FC<{doorOpen: number; clockAngle: number; dark: boolean}> = ({doorOpen, clockAngle, dark}) => {
  const lv = dark ? 0 : 1;
  return (
    <group>
      {/* lantai, langit-langit, dinding */}
      <Box pos={[0, -0.15, 0]} size={[4, 0.3, 12]} color="#2a2f38" receive />
      <Box pos={[0, 3.05, 0]} size={[4, 0.2, 12]} color="#1a1d24" />
      <Box pos={[-2.05, 1.5, 0]} size={[0.15, 3, 12]} color="#3a3f48" />
      <Box pos={[2.05, 1.5, 0]} size={[0.15, 3, 12]} color="#3a3f48" />
      <Box pos={[0, 1.5, -6]} size={[4, 3, 0.15]} color="#3a3f48" />
      {/* pintu kamar 7 (kanan, z=-2) + papan nomor, pintu kamar 6 (kiri, z=0) */}
      <group position={[1.95, 1.4, -2]} rotation={[0, -0.7 * doorOpen, 0]}>
        <Box size={[0.08, 2.6, 1.1]} color="#4a3427" />
        <Box pos={[0.06, 0, 0.35]} size={[0.05, 0.08, 0.12]} color="#8a8f98" cast={false} />
      </group>
      <Box pos={[2.0, 2.9, -2]} size={[0.06, 0.4, 0.5]} color="#8a8f98" emissive="#8a8f98" ei={0.4 * lv} cast={false} />
      <Box pos={[-1.95, 1.4, 0]} size={[0.08, 2.6, 1.1]} color="#3d2a20" />
      <Box pos={[-2.0, 2.9, 0]} size={[0.06, 0.4, 0.5]} color="#8a8f98" emissive="#8a8f98" ei={0.4 * lv} cast={false} />
      {/* jam dinding lorong (L43): jarum berputar cepat lalu berhenti tepat */}
      <group position={[0, 2.4, -5.9]}>
        <Box size={[0.7, 0.7, 0.06]} color="#e8e8ea" />
        <Box pos={[0, 0, 0.05]} size={[0.6, 0.6, 0.02]} color="#14161a" cast={false} />
        <group rotation={[0, 0, clockAngle]}>
          <Box pos={[0, 0.18, 0.07]} size={[0.04, 0.36, 0.02]} color="#e8e8ea" cast={false} />
        </group>
        <group rotation={[0, 0, clockAngle * 0.25]}>
          <Box pos={[0, 0.12, 0.07]} size={[0.05, 0.24, 0.02]} color="#e8e8ea" cast={false} />
        </group>
        <Box pos={[0, 0, 0.08]} size={[0.06, 0.06, 0.02]} color="#ff2a1f" cast={false} />
      </group>
      {/* lampu lorong */}
      {([-3, 0, 3] as number[]).map((lz) => (
        <Box key={lz} pos={[0, 2.9, lz]} size={[1.0, 0.06, 0.4]} color="#ffdf8a" emissive="#ffdf8a" ei={dark ? 0 : 1.6} cast={false} />
      ))}
      <pointLight position={[0, 2.6, 0]} color="#ffdf8a" intensity={dark ? 0 : 22} distance={10} decay={2} />
      {/* jendela ujung lorong + kursi tunggu + tanaman */}
      <Box pos={[0, 1.9, -5.9]} size={[1.6, 1.0, 0.06]} color="#0a1220" opacity={0.6} cast={false} />
      <Box pos={[-1.4, 0.55, 4.5]} size={[1.2, 0.12, 0.5]} color="#4a3427" />
      <Box pos={[-1.4, 0.28, 4.5]} size={[0.1, 0.55, 0.1]} color="#1a110c" />
      <Box pos={[1.5, 0.6, 5.2]} size={[0.35, 1.2, 0.35]} color="#241812" />
      <Box pos={[1.5, 1.5, 5.2]} size={[0.9, 0.8, 0.9]} color="#16241a" />
    </group>
  );
};

const Room7: React.FC<{blanketFlip: number; glassT: number; pillT: number}> = ({blanketFlip, glassT, pillT}) => (
  <group>
    {/* lantai + dinding kamar 7 */}
    <Box pos={[0, -0.15, -1]} size={[5, 0.3, 5]} color="#2a2f38" receive />
    <Box pos={[0, 3.05, -1]} size={[5, 0.2, 5]} color="#1a1d24" />
    <Box pos={[-2.55, 1.5, -1]} size={[0.15, 3, 5]} color="#3a3f48" />
    <Box pos={[2.55, 1.5, -1]} size={[0.15, 3, 5]} color="#3a3f48" />
    <Box pos={[0, 1.5, -3.55]} size={[5, 3, 0.15]} color="#3a3f48" />
    {/* tempat tidur + selimut yang dibalik */}
    <Box pos={[-0.5, 0.45, -1]} size={[1.2, 0.35, 2.2]} color="#5a3a28" />
    <Box pos={[-0.5, 0.68, -1]} size={[1.1, 0.12, 2.1]} color="#e8e8ea" />
    <group position={[-0.5, 0.8, -0.6]} rotation={[-0.9 * blanketFlip, 0, 0]}>
      <Box pos={[0, 0.1 * blanketFlip, 0]} size={[1.1, 0.12, 1.4]} color="#7a9ab8" />
    </group>
    <Box pos={[-0.5, 0.78, -1.95]} size={[1.0, 0.14, 0.4]} color="#f2f2f2" />
    {/* meja samping: gelas air digeser linear + tablet obat dihitung jari */}
    <Box pos={[1.3, 0.35, -1.5]} size={[0.7, 0.7, 0.7]} color="#4a3427" />
    <Box pos={[1.3 + 0.3 * glassT, 0.82, -1.5]} size={[0.14, 0.22, 0.14]} color="#9ac7c4" opacity={0.8} cast={false} />
    <Box pos={[1.3, 0.76, -1.5]} size={[0.14, 0.04, 0.14]} color="#3a6ea5" cast={false} />
    {([0, 1, 2] as number[]).map((i) => (
      <Box key={i} pos={[1.05 + i * 0.16, 0.75, -1.2]} size={[0.08, 0.03, 0.08]} color="#f2f2f2" cast={false} />
    ))}
    {/* jari Nadia menelusuri tablet obat (L44) */}
    <Box pos={[1.05 + pillT * 0.32, 0.85, -1.2]} size={[0.07, 0.14, 0.07]} color="#dcb59b" cast={false} />
    {/* monitor pasien mati + tiang infus + tirai + jendela bulan */}
    <Box pos={[-1.6, 1.0, -2.8]} size={[0.1, 2.0, 0.1]} color="#8a8f98" />
    <Box pos={[-1.6, 2.1, -2.8]} size={[0.7, 0.5, 0.06]} color="#14161a" />
    <Box pos={[-1.6, 2.1, -2.76]} size={[0.55, 0.35, 0.02]} color="#3a3f48" cast={false} />
    <Box pos={[1.8, 1.5, -2.8]} size={[0.08, 3.0, 0.08]} color="#8a8f98" />
    <Box pos={[1.8, 2.2, -2.8]} size={[0.3, 0.4, 0.1]} color="#c9b98a" opacity={0.7} cast={false} />
    <Box pos={[2.3, 1.6, -3.4]} size={[0.5, 2.6, 0.1]} color="#5a6f9a" opacity={0.7} cast={false} />
    <Box pos={[0, 1.9, -3.5]} size={[1.4, 1.0, 0.06]} color="#0a1220" opacity={0.6} cast={false} />
    <pointLight position={[0, 2.4, -1]} color="#5a6f9a" intensity={10} distance={7} decay={2} />
  </group>
);

const NurseStation: React.FC<{phoneRing: boolean}> = ({phoneRing}) => {
  const frame = useCurrentFrame();
  const vib = phoneRing ? Math.sin(frame * 1.2) * 0.03 : 0;
  return (
    <group>
      {/* meja nurse station + telepon internal + monitor (layar abu-abu = kosong, L46) */}
      <Box pos={[0, 1.05, 4.5]} size={[3.0, 0.12, 1.0]} color="#2b1b12" receive />
      <Box pos={[0, 0.5, 4.5]} size={[2.8, 1.0, 0.8]} color="#1a110c" />
      <group position={[0.6 + vib, 1.18, 4.5]}>
        <Box size={[0.4, 0.08, 0.28]} color="#3a3f48" />
        <Box pos={[0, 0.08, 0]} size={[0.34, 0.08, 0.1]} color="#d8d8d8" />
        <Box pos={[0.18, 0.1, 0]} size={[0.05, 0.05, 0.05]} color={phoneRing ? '#ff2a1f' : '#3a3f48'} emissive={phoneRing ? '#ff2a1f' : undefined} ei={phoneRing ? 1.5 : 0} cast={false} />
      </group>
      <Box pos={[-0.8, 1.55, 4.6]} size={[0.9, 0.6, 0.08]} color="#14161a" />
      <Box pos={[-0.8, 1.55, 4.65]} size={[0.75, 0.45, 0.02]} color="#8a8f98" cast={false} />
      {/* papan jadwal + kursi + lampu meja */}
      <Box pos={[0, 2.2, 5.9]} size={[2.4, 1.2, 0.06]} color="#2a2f38" />
      {([0, 1, 2, 3] as number[]).map((r) => (
        <Box key={r} pos={[0, 2.6 - r * 0.22, 5.95]} size={[2.0, 0.05, 0.02]} color="#c9c9c9" cast={false} />
      ))}
      <Box pos={[0, 0.8, 5.2]} size={[0.8, 0.1, 0.8]} color="#0f1115" />
      <Box pos={[0, 1.2, 5.55]} size={[0.8, 0.7, 0.1]} color="#0f1115" />
      <Box pos={[-1.2, 1.35, 4.5]} size={[0.25, 0.3, 0.25]} color="#ffdf8a" emissive="#ffdf8a" ei={1.2} cast={false} />
      <pointLight position={[-1.2, 1.6, 4.5]} color="#ffdf8a" intensity={8} distance={5} decay={2} />
      <Box pos={[0, 1.5, 6]} size={[4, 3, 0.15]} color="#3a3f48" />
    </group>
  );
};

const PovScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = povScene(frame);
  const inCorridor = scene === 'p2a' || scene === 'p2c' || scene === 'p2d';
  const inRoom = scene === 'p2b';
  const inStation = scene === 'p2d' || scene === 'p2e' || scene === 'si';
  const dark = scene === 'p2c';

  // --- Animasi Nadia ---
  const walkZ = interpolate(frame, [3293, 3470], [2.0, -1.2], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const knockT = interpolate(frame, [3330, 3360, 3390, 3420, 3450], [0, 1, 0, 1, 0], clamp);
  const doorOpenT = interpolate(frame, [3450, 3520], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const blanketFlipT = interpolate(frame, [3706, 3780, 3860, 3912], [0, 1, 1, 0], clamp);
  const glassT = interpolate(frame, [3800, 3912], [0, 1], clamp);
  const pillT = interpolate(frame, [3850, 3912], [0, 1], clamp);
  const bendT = interpolate(frame, [3706, 3780, 3860, 3912], [0, 1, 1, 0], clamp);
  // Jam dinding: jarum berputar cepat lalu BERHENTI TEPAT (L43)
  const clockAngle = frame < 3450 ? -(frame - 3293) * 0.12 : -(3450 - 3293) * 0.12;
  // Lari balik ke nurse station (L45 run cycle + parallax)
  const runZ = interpolate(frame, [4787, 4950], [-2, 3.2], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const running = frame >= 4787 && frame < 4950;

  return (
    <group>
      {inCorridor && <Corridor doorOpen={doorOpenT} clockAngle={clockAngle} dark={dark} />}
      {inRoom && <Room7 blanketFlip={blanketFlipT} glassT={glassT} pillT={pillT} />}
      {inStation && <NurseStation phoneRing={frame >= 5264} />}
      {/* Nadia per scene — selalu dari belakang, tanpa wajah jelas */}
      {scene === 'p2a' && (
        <NadiaFigure pos={[0, 0, walkZ]} rotY={Math.PI} walking={frame < 3470} tray armRaise={knockT} />
      )}
      {scene === 'p2b' && (
        <NadiaFigure pos={[-0.5, 0, -0.2]} rotY={Math.PI} bend={bendT} />
      )}
      {scene === 'p2c' && (
        <NadiaFigure pos={[0, 0, -1.8]} rotY={Math.PI} flashlight />
      )}
      {scene === 'p2d' && (
        <NadiaFigure pos={[0, 0, runZ]} rotY={0} walking={running} />
      )}
      {(scene === 'p2e' || scene === 'si') && (
        <NadiaFigure pos={[-0.7, 0, 3.6]} rotY={0} />
      )}
      {/* sosok bayangan di ujung lorong gelap — hanya siluet, tidak bicara */}
      {dark && (
        <group position={[0, 0, -5.2]} rotation={[0, 0, 0]} scale={[0.9, 0.9, 0.9]}>
          <Listener eyeGlow={0.5} />
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
      {/* senter Nadia: satu-satunya sumber cahaya utama di lorong gelap (P2c) */}
      <primitive object={target} />
      <spotLight
        position={[0, 1.0, 2.0]}
        target={target}
        angle={0.6}
        penumbra={0.6}
        intensity={day ? 80 * flick : 300 * flick}
        decay={2}
        distance={18}
        color="#ffdf8a"
        castShadow
      />
      {/* cahaya hangat lorong RS di scene terang (bukan lorong gelap) */}
      {((frame >= 3293 && frame < 4269) || frame >= 4787) && (
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
          <AnimatedPhone />
          <AnimatedChargerCable />
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
