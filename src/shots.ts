import {Easing, interpolate, random} from 'remotion';

export type V3 = [number, number, number];

export const FPS = 30;
export const DURATION = 6826; // 227.53 detik — dari audio terukur 215.12 detik + jeda + fade (L12)
export const W = 1080;
export const H = 1920;

/**
 * TEROR FM EP01v2 — Kuburan Kosong (remake). 227.53 detik / 6826 frame, 30 fps, 9:16 vertikal.
 * Studio: x -7..7, z -6..9, tinggi 5. Windu x=-1.7 menghadap +x,
 * Laras x=+1.7 menghadap -x. Laptop portal di [0, 1.32, 0.3].
 * POV: 3 environment voxel lengkap terpisah (jalan+kuburan malam, kampung siang kosong, kuburan malam gali).
 * CAPTIONS dihitung dari durations.csv EP01v2 (ffprobe), gap 3 frame antar dialog;
 * gap khusus: telepon berdering 45f (setelah 006), lampu berkedip 30f (setelah 019),
 * portal P1/P3 60f (caption berikutnya mulai 30f di tengah portal), hening jam 12:01 60f (setelah 046), ekor 45f.
 * SHOTS diturunkan dari dialog (L17): kamera mengikuti pembicara / pendengar saat penelpon bicara di studio.
 * Shot pemicu (L16): SP telepon berdering, SF lampu berkedip — keduanya beat sendiri sebelum dialog menyebutnya.
 * Wide shot vertikal: FOV 50-55 + kamera ditarik mundur (z 7.5-10.5) supaya Laras+Windu / isi POV masuk frame 9:16.
 */

export type Shot = {
  id: string;
  label: string;
  from: number;
  to: number;
  pos: [V3, V3];
  target: [V3, V3];
  fov: [number, number];
  scene: 'studio' | 'pov';
  note: string;
};

export const SHOTS: Shot[] = [
  {
    id: 'S1',
    label: 'WIDE ESTABLISHING (side, dolly-in)',
    from: 0,
    to: 102,
    pos: [[-0.8, 2.6, 10.5], [0.4, 2.3, 9.5]],
    target: [[0, 1.7, 0], [0, 1.7, 0]],
    fov: [52, 50],
    scene: 'studio',
    note: 'Babak 1 pembuka, kopi dingin. Laras dan Windu berprofil. Vertikal: kamera ditarik mundur + FOV 50-52 supaya keduanya masuk frame.',
  },
  {
    id: 'S3a',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 102,
    to: 211,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu bicara soal kopi dingin. Jendela booth di belakang Windu.',
  },
  {
    id: 'S2a',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 211,
    to: 329,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras menggoda Windu soal kopi.',
  },
  {
    id: 'S3b',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 329,
    to: 596,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu membela diri, lalu minum kopi dan meringis (pemicu visual sebelum dialog 005).',
  },
  {
    id: 'S2b',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 596,
    to: 714,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras tertawa kecil soal kopi Windu.',
  },
  {
    id: 'SP',
    label: 'CLOSE-UP meja - telepon berdering',
    from: 714,
    to: 759,
    pos: [[0, 2.2, 3.4], [0, 2.0, 3.0]],
    target: [[0, 1.35, 0.3], [0, 1.35, 0.3]],
    fov: [30, 28],
    scene: 'studio',
    note: 'L16 pemicu: telepon berdering terdengar, kamera ke meja sebelum Laras mengangkat. Beat sendiri 45 frame.',
  },
  {
    id: 'S2c',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 759,
    to: 860,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras mengangkat telepon.',
  },
  {
    id: 'S4a',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 860,
    to: 1151,
    pos: [[0, 2.4, 3.6], [0.4, 2.35, 3.1]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [36, 30],
    scene: 'studio',
    note: 'Andi bicara di telepon (008-009). Andi tidak tampil di studio; kamera ke Laras yang mendengarkan serius.',
  },
  {
    id: 'S2d',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 1151,
    to: 1298,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras bertanya Andi lagi di mana — pertanyaan yang menetapkan lokasi telepon di kuburan.',
  },
  {
    id: 'S4b',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 1298,
    to: 1447,
    pos: [[0, 2.4, 3.6], [0.4, 2.35, 3.1]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [36, 30],
    scene: 'studio',
    note: 'Andi: dia di kuburan, di samping kuburan yang dia gali. Laras mendengarkan.',
  },
  {
    id: 'S2e',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 1447,
    to: 1558,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: kenapa gali kuburan malam-malam?',
  },
  {
    id: 'S4c',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 1558,
    to: 1944,
    pos: [[0, 2.4, 3.6], [0.4, 2.35, 3.1]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [36, 30],
    scene: 'studio',
    note: 'Andi mulai dari awal: orderan 17 November, lewat kuburan dulu. Lampu mulai berkedip pelan.',
  },
  {
    id: 'S3c',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 1944,
    to: 2108,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu mencari penjelasan logis: jalan ke kampung kan biasanya gelap.',
  },
  {
    id: 'S4d',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 2108,
    to: 2281,
    pos: [[0, 2.4, 3.6], [0.4, 2.35, 3.1]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [36, 30],
    scene: 'studio',
    note: 'Andi: depan tiap rumah ada nisan.',
  },
  {
    id: 'S3d',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 2281,
    to: 2349,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu kaget: nisan di depan rumah orang?',
  },
  {
    id: 'S4e',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 2349,
    to: 2560,
    pos: [[0, 2.4, 3.6], [0.4, 2.35, 3.1]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [36, 30],
    scene: 'studio',
    note: 'Andi: nisannya kosong, semua rumah kayak gitu.',
  },
  {
    id: 'SF',
    label: 'CLOSE-UP lampu gantung berkedip',
    from: 2560,
    to: 2590,
    pos: [[-1.2, 2.8, 4.0], [-1.2, 3.0, 3.5]],
    target: [[-1.2, 3.85, 0], [-1.2, 3.85, 0]],
    fov: [36, 32],
    scene: 'studio',
    note: 'L16 pemicu: lampu berkedip sekali, ditunjukkan sebagai beat sendiri 30 frame sebelum Windu bicara soal lampu.',
  },
  {
    id: 'S3e',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 2590,
    to: 2660,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu menoleh ke atas: lampunya kedip lagi.',
  },
  {
    id: 'S2f',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 2660,
    to: 2870,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: biarin dulu, lanjutin. Lalu Laras bertanya Andi langsung pulang atau tidak.',
  },
  {
    id: 'S4f',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 2870,
    to: 3344,
    pos: [[0, 2.4, 3.6], [0.4, 2.35, 3.1]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [36, 30],
    scene: 'studio',
    note: 'Andi: lampu motor menyorot nisan namanya, tanggal 19 November 2026, itu tanggal hari ini.',
  },
  {
    id: 'S3f',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 3344,
    to: 3378,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu kaget: hari ini?',
  },
  {
    id: 'S2g',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 3378,
    to: 3515,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: setelah kamu lihat itu, terus apa yang terjadi malam itu juga? Lalu portal.',
  },
  {
    id: 'P1',
    label: 'PORTAL LAPTOP - zoom masuk',
    from: 3515,
    to: 3575,
    pos: [[0, 2.4, 10.5], [0, 1.65, 0.9]],
    target: [[0, 1.9, -1], [0, 1.62, 0.0]],
    fov: [52, 18],
    scene: 'studio',
    note: 'Portal 60 frame. Laptop menyala (visualisasi khayalan, bukan video asli). Layar membesar memenuhi frame. Suara Andi (028) mulai di tengah zoom. Tanpa fade hitam.',
  },
  {
    id: 'P2a',
    label: 'POV - motor pulang malam 17 Nov, jalan + kuburan',
    from: 3575,
    to: 4283,
    pos: [[0, 2.8, 8.5], [0, 2.6, 7.5]],
    target: [[0, 1.2, -1], [0, 1.2, -1]],
    fov: [55, 52],
    scene: 'pov',
    note: 'POV orang ketiga dekat (satu mode POV untuk seluruh episode): jalan gelap + kuburan lengkap + gerbang, motor Andi + penumpang tanpa muka di belakangnya, sosok hilang di gerbang.',
  },
  {
    id: 'P2b',
    label: 'POV - kampung siang 19 Nov, seluruh kampung kosong',
    from: 4283,
    to: 5306,
    pos: [[0, 2.4, 7.5], [0, 2.2, 6.5]],
    target: [[0, 0.9, -2], [0, 0.9, -2]],
    fov: [55, 52],
    scene: 'pov',
    note: 'POV orang ketiga dekat: seluruh kampung — rumah-rumah, jalan, lampu jalan mati, nisan kosong di depan tiap rumah, pintu kebuka, tidak ada orang/suara/lampu nyala. Siang: cahaya lebih terang, fog lebih tipis.',
  },
  {
    id: 'P2c',
    label: 'POV - gali kuburan malam 19 Nov, seluruh kuburan',
    from: 5306,
    to: 6180,
    pos: [[2.0, 2.4, 3.5], [1.2, 1.8, 2.0]],
    target: [[0, 0.8, -2.5], [0, 0.6, -2.5]],
    fov: [42, 36],
    scene: 'pov',
    note: 'POV gali kuburan: seluruh kuburan — gundukan tanah, sekop, pagar, pohon, cahaya bulan, lubang kosong yang digali Andi. Tahan di frame paling seram sebelum kembali.',
  },
  {
    id: 'P3',
    label: 'PORTAL LAPTOP - zoom keluar',
    from: 6180,
    to: 6240,
    pos: [[0, 1.65, 0.9], [0, 2.4, 10.5]],
    target: [[0, 1.62, 0.0], [0, 1.9, -1]],
    fov: [18, 52],
    scene: 'studio',
    note: 'Kembali ke studio 60 frame, kebalikan P1. Layar laptop mengecil ke meja. Suara Windu (043) mulai di tengah zoom.',
  },
  {
    id: 'S3g',
    label: 'CLOSE-UP Windu (3/4, push-in, cermin S4)',
    from: 6240,
    to: 6302,
    pos: [[0, 2.4, 3.6], [-0.4, 2.35, 3.1]],
    target: [[-1.7, 2.2, 0], [-1.7, 2.2, 0]],
    fov: [36, 30],
    scene: 'studio',
    note: 'Babak 4. Windu: Andi, kamu masih di sana?',
  },
  {
    id: 'S2h',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 6302,
    to: 6432,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: jangan dimatiin dulu teleponnya, ngomong terus sama kami.',
  },
  {
    id: 'S3h',
    label: 'CLOSE-UP Windu (3/4, push-in, cermin S4)',
    from: 6432,
    to: 6517,
    pos: [[0, 2.4, 3.6], [-0.4, 2.35, 3.1]],
    target: [[-1.7, 2.2, 0], [-1.7, 2.2, 0]],
    fov: [36, 30],
    scene: 'studio',
    note: 'Windu panik: teleponnya mati. Suara tanah makin keras lalu statis sebelum putus (pemicu terdengar).',
  },
  {
    id: 'S2i',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 6517,
    to: 6579,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras tenang: Windu, lihat laptopnya.',
  },
  {
    id: 'T1',
    label: 'CLOSE-UP jam laptop 12:01',
    from: 6579,
    to: 6639,
    pos: [[0, 1.7, 3.4], [0, 1.68, 3.1]],
    target: [[0, 1.64, 0.04], [0, 1.64, 0.04]],
    fov: [36, 32],
    scene: 'studio',
    note: 'Twist: kamera menyorot jam di layar laptop: 12:01. Hening 60 frame, tanpa dialog. Lampu mati, hanya ON AIR merah. Digit harus lengkap dan terbaca.',
  },
  {
    id: 'T2',
    label: 'WIDE FRONTAL akhir + judul',
    from: 6639,
    to: 6826,
    pos: [[0, 2.4, 10.5], [0, 2.1, 9.0]],
    target: [[0, 1.9, -1], [0, 2.0, -1.2]],
    fov: [52, 50],
    scene: 'studio',
    note: 'Penutup. Laras dan Windu menoleh ke kamera. Judul akhir merah berkedip, lalu fade hitam 14 frame terakhir.',
  },
];

const ease = Easing.bezier(0.35, 0, 0.65, 1);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

export const getShot = (frame: number): Shot =>
  SHOTS.find((s) => frame >= s.from && frame < s.to) ?? SHOTS[SHOTS.length - 1];

export const getCamera = (frame: number) => {
  const shot = getShot(frame);
  const t = interpolate(frame, [shot.from, shot.to - 1], [0, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pos = lerp3(shot.pos[0], shot.pos[1], t);
  const target = lerp3(shot.target[0], shot.target[1], t);
  // handheld ringan, menguat saat tegang (Babak 2 akhir s.d. twist)
  const shake = frame >= 2870 ? 1.6 : frame >= 1944 ? 1.2 : 1;
  pos[0] += Math.sin(frame * 0.11) * 0.012 * shake;
  pos[1] += Math.sin(frame * 0.17 + 1) * 0.01 * shake;
  target[1] += Math.sin(frame * 0.09 + 2) * 0.01 * shake;
  return {pos, target, fov: lerp(shot.fov[0], shot.fov[1], t)};
};

/** Level lampu 0..1. Babak 1 stabil, Babak 2 berkedip pelan, POV redup,
 * P2b siang lebih terang, kembali 0.9, twist: 0 lalu mati total di shot jam (T1) dan penutup. */
const FLICKER: [number, number, number][] = [
  [2108, 2660, 0.35],
  [2870, 3300, 0.5],
  [3575, 3800, 0.45],
  [5306, 5500, 0.5],
  [6180, 6400, 0.5],
];

export const lightLevel = (frame: number): number => {
  if (frame >= 6579) return 0; // twist: lampu mati, hanya ON AIR merah
  if (frame >= 4283 && frame < 5306) return 0.9; // P2b kampung siang
  if (frame >= 3575 && frame < 6240) return 0.55; // POV malam: redup, cahaya dari lampu motor / bulan
  let level = 1;
  for (const [a, b, p] of FLICKER) {
    if (frame >= a && frame < b) {
      const r = random(`flicker-${Math.floor(frame / 2)}`);
      if (r < p) level = 0.04 + r * 0.2;
    }
  }
  if (frame > 1944 && frame < 6240 && level === 1) {
    level = 0.9 + 0.06 * Math.sin(frame * 0.7);
  }
  return level;
};

export const isPov = (frame: number): boolean => getShot(frame).scene === 'pov';
export const isPovDay = (frame: number): boolean => frame >= 4283 && frame < 5306;
export const povScene = (frame: number): 'p2a' | 'p2b' | 'p2c' | null => {
  if (frame >= 3575 && frame < 4283) return 'p2a';
  if (frame >= 4283 && frame < 5306) return 'p2b';
  if (frame >= 5306 && frame < 6180) return 'p2c';
  return null;
};

export type Caption = {
  from: number;
  to: number;
  who: 'LARAS' | 'WINDU' | 'PENELPON';
  text: string;
  whisper?: boolean;
  audio: string;
};

export const CAPTIONS: Caption[] = [
  {from: 10, to: 99, who: 'LARAS', text: 'selamat malam, ini TEROR FM.', audio: 'ep01v2_laras_001.mp3'},
  {from: 102, to: 208, who: 'WINDU', text: 'kopiku udah dingin dari tadi.', audio: 'ep01v2_windu_002.mp3'},
  {from: 211, to: 326, who: 'LARAS', text: 'baru juga mulai siaran, kamu udah ngeluh soal kopi?', audio: 'ep01v2_laras_003.mp3'},
  {from: 329, to: 511, who: 'WINDU', text: 'bukan ngeluh. aku cuma... dari tadi nggak sempat minum, terus dingin sendiri.', audio: 'ep01v2_windu_004.mp3'},
  {from: 514, to: 593, who: 'WINDU', text: 'dingin banget. kayak es.', audio: 'ep01v2_windu_005.mp3'},
  {from: 596, to: 714, who: 'LARAS', text: 'ya minum aja, Windu. nggak ada yang larang.', audio: 'ep01v2_laras_006.mp3'},
  {from: 759, to: 857, who: 'LARAS', text: 'halo, TEROR FM. dengan siapa di sana?', audio: 'ep01v2_laras_007.mp3'},
  {from: 860, to: 1011, who: 'PENELPON', text: 'halo, mbak... mas... saya Andi. saya driver ojol.', audio: 'ep01v2_penelpon_008.mp3'},
  {from: 1014, to: 1148, who: 'PENELPON', text: 'saya harus cerita malam ini. kalau nggak, saya bisa gila.', audio: 'ep01v2_penelpon_009.mp3'},
  {from: 1151, to: 1295, who: 'LARAS', text: 'pelan-pelan aja, Andi. kami dengerin kok. kamu lagi di mana sekarang?', audio: 'ep01v2_laras_010.mp3'},
  {from: 1298, to: 1444, who: 'PENELPON', text: 'saya... saya lagi di kuburan, mbak. di samping kuburan yang saya gali tadi.', audio: 'ep01v2_penelpon_011.mp3'},
  {from: 1447, to: 1555, who: 'LARAS', text: 'kamu gali kuburan? kenapa kamu di sana malam-malam?', audio: 'ep01v2_laras_012.mp3'},
  {from: 1558, to: 1659, who: 'PENELPON', text: 'nanti saya jelasin dari awal, mbak. biar masuk akal.', audio: 'ep01v2_penelpon_013.mp3'},
  {from: 1662, to: 1830, who: 'PENELPON', text: 'tanggal 17 November kemarin, saya dapat orderan antar ke kampung yang aneh banget.', audio: 'ep01v2_penelpon_014.mp3'},
  {from: 1833, to: 1941, who: 'PENELPON', text: 'sebelum masuk kampung itu, saya mesti lewat kuburan dulu.', audio: 'ep01v2_penelpon_015.mp3'},
  {from: 1944, to: 2105, who: 'WINDU', text: 'kuburan... ya jalan ke kampung kan biasanya gelap. itu mah biasa.', audio: 'ep01v2_windu_016.mp3'},
  {from: 2108, to: 2278, who: 'PENELPON', text: 'bukan itu masalahnya, mas. di kampung itu, depan tiap rumah ada nisan.', audio: 'ep01v2_penelpon_017.mp3'},
  {from: 2281, to: 2346, who: 'WINDU', text: 'nisan? di depan rumah orang?', audio: 'ep01v2_windu_018.mp3'},
  {from: 2349, to: 2560, who: 'PENELPON', text: 'iya, mas. nisannya kosong. nggak ada nama, nggak ada tanggal. semua rumah kayak gitu.', audio: 'ep01v2_penelpon_019.mp3'},
  {from: 2590, to: 2657, who: 'WINDU', text: 'eh... lampunya kedip lagi.', audio: 'ep01v2_windu_020.mp3'},
  {from: 2660, to: 2744, who: 'LARAS', text: 'biarin dulu. Andi, lanjutin.', audio: 'ep01v2_laras_021.mp3'},
  {from: 2747, to: 2867, who: 'LARAS', text: 'terus kamu gimana? habis ngantar, kamu langsung pulang?', audio: 'ep01v2_laras_022.mp3'},
  {from: 2870, to: 3086, who: 'PENELPON', text: 'iya, mbak. saya pulang lewat kuburan itu lagi. terus lampu motor saya tiba-tiba nyorot ke satu nisan.', audio: 'ep01v2_penelpon_023.mp3'},
  {from: 3089, to: 3276, who: 'PENELPON', text: 'di situ ada nama saya, mbak. Andi. sama tanggal 19 November 2026.', audio: 'ep01v2_penelpon_024.mp3'},
  {from: 3279, to: 3341, who: 'PENELPON', text: 'itu tanggal hari ini, mbak.', audio: 'ep01v2_penelpon_025.mp3', whisper: true},
  {from: 3344, to: 3375, who: 'WINDU', text: 'hari ini?', audio: 'ep01v2_windu_026.mp3'},
  {from: 3378, to: 3515, who: 'LARAS', text: 'setelah kamu lihat itu, terus apa yang terjadi malam itu juga?', audio: 'ep01v2_laras_027.mp3'},
  {from: 3545, to: 3699, who: 'PENELPON', text: 'malam itu juga, pas saya pulang, ada yang ngetok helm saya dari belakang.', audio: 'ep01v2_penelpon_028.mp3'},
  {from: 3702, to: 3820, who: 'PENELPON', text: 'padahal saya sendirian di motor. nggak ada yang bonceng.', audio: 'ep01v2_penelpon_029.mp3'},
  {from: 3823, to: 3979, who: 'PENELPON', text: 'saya lirik kaca spion. ada yang duduk di belakang saya. nggak ada mukanya.', audio: 'ep01v2_penelpon_030.mp3'},
  {from: 3982, to: 4061, who: 'WINDU', text: 'mungkin itu cuma bayangan lampu, Andi?', audio: 'ep01v2_windu_031.mp3'},
  {from: 4064, to: 4280, who: 'PENELPON', text: 'bukan, mas. dia ngikutin saya sampai keluar kuburan. begitu saya lewatin gerbang kuburan, dia hilang.', audio: 'ep01v2_penelpon_032.mp3'},
  {from: 4283, to: 4511, who: 'PENELPON', text: 'siangnya, tanggal 19 ini, saya balik ke kampung itu. saya pengin buktiin kalau saya cuma halu.', audio: 'ep01v2_penelpon_033.mp3'},
  {from: 4514, to: 4672, who: 'PENELPON', text: 'kampung itu kosong, mbak. bener-bener kosong. nggak ada orang sama sekali.', audio: 'ep01v2_penelpon_034.mp3'},
  {from: 4675, to: 4937, who: 'PENELPON', text: 'rumahnya masih ada. pintunya masih kebuka. nisannya masih ada. tapi nggak ada suara, nggak ada lampu nyala.', audio: 'ep01v2_penelpon_035.mp3'},
  {from: 4940, to: 5019, who: 'WINDU', text: 'mungkin kampungnya emang udah ditinggalin?', audio: 'ep01v2_windu_036.mp3'},
  {from: 5022, to: 5303, who: 'PENELPON', text: 'nggak, mas. tanggal 17 kemarin kampung itu masih rame. saya ngantar ke orang di sana, dia yang bukain pintu, dia yang terima pesanannya.', audio: 'ep01v2_penelpon_037.mp3'},
  {from: 5306, to: 5448, who: 'PENELPON', text: 'saya harus tahu, mbak. kalau saya diemin, saya nggak bakal bisa tidur.', audio: 'ep01v2_penelpon_038.mp3'},
  {from: 5451, to: 5648, who: 'PENELPON', text: 'saya udah kesel banget. malam ini saya balik ke kuburan itu, saya gali nisan saya sendiri.', audio: 'ep01v2_penelpon_039.mp3'},
  {from: 5651, to: 5829, who: 'PENELPON', text: 'saya gali... saya gali terus... di dalamnya kosong. nggak ada apa-apa.', audio: 'ep01v2_penelpon_040.mp3'},
  {from: 5832, to: 5983, who: 'PENELPON', text: 'kuburan itu emang disiapin buat saya. kosong, nunggu saya masuk.', audio: 'ep01v2_penelpon_041.mp3'},
  {from: 5986, to: 6180, who: 'PENELPON', text: 'dan sekarang... saya bisa denger suara tanah di belakang saya. kayak ada yang gali dari dalam.', audio: 'ep01v2_penelpon_042.mp3', whisper: true},
  {from: 6210, to: 6299, who: 'WINDU', text: 'Andi? Andi, kamu masih di sana?', audio: 'ep01v2_windu_043.mp3'},
  {from: 6302, to: 6429, who: 'LARAS', text: 'Andi, jangan dimatiin dulu teleponnya. ngomong terus sama kami.', audio: 'ep01v2_laras_044.mp3'},
  {from: 6432, to: 6514, who: 'WINDU', text: 'Laras... teleponnya mati.', audio: 'ep01v2_windu_045.mp3'},
  {from: 6517, to: 6579, who: 'LARAS', text: 'Windu, lihat laptopnya.', audio: 'ep01v2_laras_046.mp3'},
  {from: 6639, to: 6781, who: 'LARAS', text: 'selamat malam, pendengar TEROR FM. siaran ini belum selesai.', audio: 'ep01v2_laras_047.mp3'},
];

 /** Amplitudo mulut 0..1 untuk penyiar tertentu di frame ini. Penelpon tidak
 * punya host di studio, jadi selalu 0. */
export const mouthOpen = (who: 'LARAS' | 'WINDU', frame: number): number => {
  const c = CAPTIONS.find((x) => x.who === who && frame >= x.from + 2 && frame <= x.to - 3);
  if (!c) return 0;
  const bucket = Math.floor(frame / 3);
  const a = random(`mouth-${who}-${bucket}`);
  const b = random(`mouth-${who}-${bucket + 1}`);
  const t = (frame % 3) / 3;
  const v = lerp(a, b, t);
  return (c.whisper ? 0.3 : 0.25) + (c.whisper ? 0.2 : 0.75) * v;
};

/** Frame mulai Laras dan Windu menoleh ke kamera (Babak 4 akhir, T2). */
export const TURN_LARAS = 6639;
export const TURN_WINDU = 6655;
/** Frame mulai judul akhir berkedip. */
export const TITLE_START = 6639;
/** Frame mulai lampu mati total (shot jam 12:01, T1). */
export const BLACKOUT_START = 6579;

