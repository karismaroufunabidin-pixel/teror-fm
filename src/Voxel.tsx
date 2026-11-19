import React, {useLayoutEffect, useRef} from 'react';
import * as THREE from 'three';
import {random} from 'remotion';
import type {V3} from './shots';

type BoxProps = {
  pos?: V3;
  size: V3;
  color?: string;
  emissive?: string;
  ei?: number;
  basic?: boolean;
  fog?: boolean;
  cast?: boolean;
  receive?: boolean;
  rot?: V3;
  scale?: V3;
  opacity?: number;
  children?: React.ReactNode;
};

/** Satu blok voxel. flatShading supaya sisi-sisinya tegas seperti Minecraft. */
export const Box: React.FC<BoxProps> = ({
  pos = [0, 0, 0],
  size,
  color = '#888888',
  emissive,
  ei = 1,
  basic = false,
  fog = true,
  cast = true,
  receive = false,
  rot,
  scale,
  opacity,
  children,
}) => {
  const transparent = opacity !== undefined && opacity < 1;
  return (
    <mesh position={pos} rotation={rot} scale={scale} castShadow={cast} receiveShadow={receive}>
      <boxGeometry args={size} />
      {basic ? (
        <meshBasicMaterial color={color} fog={fog} transparent={transparent} opacity={opacity ?? 1} />
      ) : (
        <meshStandardMaterial
          color={color}
          flatShading
          roughness={0.92}
          metalness={0}
          emissive={emissive ?? '#000000'}
          emissiveIntensity={ei}
          transparent={transparent}
          opacity={opacity ?? 1}
          depthWrite={!transparent}
        />
      )}
      {children}
    </mesh>
  );
};

export type BlockItem = {p: V3; s: V3; c: string};

/** Banyak blok sekaligus (lantai, dinding, busa akustik). Satu draw call. */
export const Blocks: React.FC<{items: BlockItem[]; cast?: boolean; receive?: boolean}> = ({
  items,
  cast = false,
  receive = true,
}) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const o = new THREE.Object3D();
    const col = new THREE.Color();
    items.forEach((it, i) => {
      o.position.set(it.p[0], it.p[1], it.p[2]);
      o.scale.set(it.s[0], it.s[1], it.s[2]);
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      col.set(it.c);
      mesh.setColorAt(i, col);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, items.length]}
      castShadow={cast}
      receiveShadow={receive}
      frustumCulled={false}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial flatShading roughness={0.95} metalness={0} />
    </instancedMesh>
  );
};

/** Variasi warna kecil per blok supaya tidak terlihat datar. */
export const jitter = (base: string, seed: string, amt = 0.03): string => {
  const c = new THREE.Color(base);
  c.offsetHSL(0, 0, (random(seed) - 0.5) * amt * 2);
  return '#' + c.getHexString();
};
