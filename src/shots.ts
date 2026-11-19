import {Easing, interpolate, random} from 'remotion';

export type V3 = [number, number, number];

export const FPS = 30;
export const DURATION = 5850; // 195 detik
export const W = 1920;
export const H = 1080;

/**
 * TEROR FM EP01 — Kuburan Kosong. 195 detik / 5850 frame, 30 fps.
 * Studio: x -7..7, z -6..9, tinggi 5. Windu x=-1.7 menghadap +x,
 * Laras x=+1.7 menghadap -x. Laptop portal di [0, 1.32, 0.3].
 * POV: scene voxel terpisah (kampung kosong + kuburan), kamera P2.
 * CAPTIONS dihitung dari durations.csv (ffprobe), gap 3 frame,
 * jeda hening 51 frame sebelum caption terakhir untuk shot jam 12:01.
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
    to: 214,
    pos: [[-1.2, 2.5, 6.8], [0.6, 2.2, 5.4]],
    target: [[0, 1.6, 0], [0, 1.7, 0]],
    fov: [44, 42],
    scene: 'studio',
    note: 'Babak 1 pembuka. Laras dan Windu berprofil, hujan, lampu berkedip.',
  },
  {
    id: 'S2',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 214,
    to: 918,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Babak 1 lanjut. Laras bicara, Windu setengah terlihat di kiri frame.',
  },
  {
    id: 'S3',
    label: 'OTS - dari belakang Laras ke Windu (jendela di belakang)',
    from: 918,
    to: 2219,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Babak 2 awal. Telepon masuk, Andi mulai bercerita. Lampu mulai berkedip.',
  },
  {
    id: 'S4',
    label: 'CLOSE-UP Laras (3/4, push-in)',
    from: 2219,
    to: 2773,
    pos: [[0.2, 2.35, 2.2], [0.6, 2.3, 1.7]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [34, 28],
    scene: 'studio',
    note: 'Babak 2 tengah. Laras mendengarkan serius saat Andi cerita soal nisan namanya.',
  },
  {
    id: 'S5',
    label: 'HIGH ANGLE - Windu + jendela booth',
    from: 2773,
    to: 3394,
    pos: [[0.9, 2.95, -0.4], [0.1, 2.9, -0.3]],
    target: [[-3.2, 2.45, 0.1], [-3.6, 2.6, 0.1]],
    fov: [40, 36],
    scene: 'studio',
    note: 'Babak 2 akhir. Windu tidak sadar, sosok bayangan samar di kaca booth di belakangnya.',
  },
  {
    id: 'P1',
    label: 'PORTAL LAPTOP - zoom masuk',
    from: 3394,
    to: 3454,
    pos: [[0, 2.3, 6.6], [0, 1.65, 0.9]],
    target: [[0, 1.9, -1], [0, 1.62, 0.0]],
    fov: [42, 18],
    scene: 'studio',
    note: 'Portal: laptop menyala (visualisasi khayalan, bukan video asli). Layar membesar memenuhi frame. Suara Andi terus jalan.',
  },
  {
    id: 'P2a',
    label: 'POV - motor menuju kuburan',
    from: 3454,
    to: 3741,
    pos: [[0, 1.6, 4.0], [0, 1.6, 2.5]],
    target: [[0, 1.4, -2], [0, 1.4, -2]],
    fov: [50, 46],
    scene: 'pov',
    note: 'POV orang pertama: lampu motor menyorot kuburan. Ketukan helm, sosok tanpa wajah di spion.',
  },
  {
    id: 'P2b',
    label: 'POV - kampung kosong',
    from: 3741,
    to: 4429,
    pos: [[-2.2, 2.0, 4.0], [-1.8, 1.9, 3.0]],
    target: [[1.0, 1.2, -2], [0.5, 1.2, -2.5]],
    fov: [40, 36],
    scene: 'pov',
    note: 'POV orang ketiga dekat: kampung kosong, tiap rumah ada nisan kosong di depannya. Tidak ada suara, tidak ada lampu.',
  },
  {
    id: 'P2c',
    label: 'POV - gali kuburan kosong',
    from: 4429,
    to: 5250,
    pos: [[1.5, 2.0, 2.5], [0.8, 1.5, 1.0]],
    target: [[0, 0.8, -2.5], [0, 0.6, -2.5]],
    fov: [38, 32],
    scene: 'pov',
    note: 'POV gali kuburan: gundukan tanah, nisan Andi, lubang kosong. Tahan di frame paling seram sebelum kembali.',
  },
  {
    id: 'P3',
    label: 'PORTAL LAPTOP - zoom keluar',
    from: 5250,
    to: 5310,
    pos: [[0, 1.65, 0.9], [0, 2.3, 6.6]],
    target: [[0, 1.62, 0.0], [0, 1.9, -1]],
    fov: [18, 42],
    scene: 'studio',
    note: 'Kembali ke studio. Layar laptop mengecil ke meja. Telepon masih terhubung.',
  },
  {
    id: 'S6',
    label: 'WIDE FRONTAL - kembali ke studio',
    from: 5310,
    to: 5647,
    pos: [[0, 2.3, 6.6], [0, 2.0, 4.1]],
    target: [[0, 1.9, -1], [0, 2.0, -1.2]],
    fov: [42, 40],
    scene: 'studio',
    note: 'Babak 4. Laras dan Windu menatap laptop. Telepon terputus tiba-tiba.',
  },
  {
    id: 'T1',
    label: 'CLOSE-UP jam laptop 12:01',
    from: 5647,
    to: 5698,
    pos: [[0, 1.66, 1.65], [0, 1.65, 1.55]],
    target: [[0, 1.62, 0.0], [0, 1.62, 0.0]],
    fov: [20, 18],
    scene: 'studio',
    note: 'Twist: kamera menyorot jam di layar laptop: 12:01. Hening, tanpa dialog. Lampu mati, hanya ON AIR merah.',
  },
  {
    id: 'T2',
    label: 'WIDE FRONTAL akhir + judul',
    from: 5698,
    to: 5850,
    pos: [[0, 2.3, 6.6], [0, 2.0, 4.1]],
    target: [[0, 1.9, -1], [0, 2.0, -1.2]],
    fov: [42, 40],
    scene: 'studio',
    note: 'Penutup. Laras dan Windu menoleh ke kamera. Judul akhir merah berkedip, lalu fade hitam.',
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
  const shake = frame >= 2773 ? 1.6 : frame >= 1978 ? 1.2 : 1;
  pos[0] += Math.sin(frame * 0.11) * 0.012 * shake;
  pos[1] += Math.sin(frame * 0.17 + 1) * 0.01 * shake;
  target[1] += Math.sin(frame * 0.09 + 2) * 0.01 * shake;
  return {pos, target, fov: lerp(shot.fov[0], shot.fov[1], t)};
};

/** Level lampu 0..1. Babak 1 stabil, Babak 2 berkedip pelan, POV redup,
 * kembali 0.9, twist: 0.3 lalu mati total di shot jam (T1) dan penutup. */
const FLICKER: [number, number, number][] = [
  [1978, 2400, 0.35],
  [2773, 3000, 0.5],
  [3424, 3600, 0.45],
  [4429, 4600, 0.5],
  [5310, 5450, 0.5],
];

export const lightLevel = (frame: number): number => {
  if (frame >= 5647) return 0; // twist: lampu mati, hanya ON AIR merah
  if (frame >= 3424 && frame < 5310) return 0.55; // POV: redup, cahaya dari lampu motor
  let level = 1;
  for (const [a, b, p] of FLICKER) {
    if (frame >= a && frame < b) {
      const r = random(`flicker-${Math.floor(frame / 2)}`);
      if (r < p) level = 0.04 + r * 0.2;
    }
  }
  if (frame > 1978 && frame < 5310 && level === 1) {
    level = 0.9 + 0.06 * Math.sin(frame * 0.7);
  }
  return level;
};

export const isPov = (frame: number): boolean => getShot(frame).scene === 'pov';

export type Caption = {
  from: number;
  to: number;
  who: 'LARAS' | 'WINDU' | 'PENELPON';
  text: string;
  whisper?: boolean;
  audio: string;
};

export const CAPTIONS: Caption[] = [
  {from: 10, to: 96, who: 'LARAS', text: "selamat malam, ini TEROR FM.", audio: 'ep01_laras_001.mp3'},
  {from: 99, to: 214, who: 'WINDU', text: "selamat malam. hujan nggak berhenti-berhenti dari tadi.", audio: 'ep01_windu_002.mp3'},
  {from: 217, to: 363, who: 'LARAS', text: "kamu kenapa sih? lampunya baru kedip sekali, kamu udah kayak gitu.", audio: 'ep01_laras_003.mp3'},
  {from: 366, to: 517, who: 'WINDU', text: "aku nggak kenapa-kenapa. cuma dingin aja. lampunya aja yang aneh.", audio: 'ep01_windu_004.mp3'},
  {from: 520, to: 621, who: 'LARAS', text: "yang aneh itu kamu, Windu.", audio: 'ep01_laras_005.mp3'},
  {from: 624, to: 761, who: 'WINDU', text: "eh, jangan ketawa dulu. tadi tuh kedipnya tiga kali, kayak...", audio: 'ep01_windu_006.mp3'},
  {from: 764, to: 800, who: 'LARAS', text: "kayak apa?", audio: 'ep01_laras_007.mp3'},
  {from: 803, to: 918, who: 'WINDU', text: "ah, udahlah. lupakan. lanjut aja.", audio: 'ep01_windu_008.mp3'},
  {from: 921, to: 1019, who: 'LARAS', text: "halo, TEROR FM. dengan siapa di sini?", audio: 'ep01_laras_009.mp3'},
  {from: 1022, to: 1168, who: 'PENELPON', text: "halo, mbak... mas... saya Andi. saya driver ojol.", audio: 'ep01_penelpon_010.mp3'},
  {from: 1171, to: 1373, who: 'PENELPON', text: "saya nggak tau mau mulai dari mana. tapi saya harus cerita malam ini, kalau nggak saya bisa gila.", audio: 'ep01_penelpon_011.mp3'},
  {from: 1376, to: 1510, who: 'LARAS', text: "santai dulu, Andi. pelan-pelan aja. kami dengerin kok.", audio: 'ep01_laras_012.mp3'},
  {from: 1513, to: 1681, who: 'PENELPON', text: "tanggal 17 November kemarin, saya dapat orderan antar ke kampung yang aneh banget.", audio: 'ep01_penelpon_013.mp3'},
  {from: 1684, to: 1792, who: 'PENELPON', text: "sebelum masuk kampung itu, saya mesti lewat kuburan dulu.", audio: 'ep01_penelpon_014.mp3'},
  {from: 1795, to: 1975, who: 'WINDU', text: "kuburan... ya namanya juga jalan ke kampung, pasti gelap. itu mah biasa.", audio: 'ep01_windu_015.mp3'},
  {from: 1978, to: 2146, who: 'PENELPON', text: "bukan itu masalahnya, mas. di kampung itu, depan tiap rumah ada nisan.", audio: 'ep01_penelpon_016.mp3'},
  {from: 2149, to: 2219, who: 'WINDU', text: "nisan? di depan rumah orang?", audio: 'ep01_windu_017.mp3'},
  {from: 2222, to: 2438, who: 'PENELPON', text: "iya, mas. nisannya kosong. nggak ada nama, nggak ada tanggal. semua rumah kayak gitu.", audio: 'ep01_penelpon_018.mp3'},
  {from: 2441, to: 2559, who: 'LARAS', text: "terus kamu gimana? habis ngantar, kamu langsung pulang?", audio: 'ep01_laras_019.mp3'},
  {from: 2562, to: 2773, who: 'PENELPON', text: "iya, mbak. saya pulang lewat kuburan itu lagi. terus lampu motor saya tiba-tiba nyorot ke satu nisan.", audio: 'ep01_penelpon_020.mp3'},
  {from: 2776, to: 2968, who: 'PENELPON', text: "di situ ada nama saya, mbak. Andi. sama tanggal 19 November 2026.", audio: 'ep01_penelpon_021.mp3'},
  {from: 2971, to: 3069, who: 'WINDU', text: "19 November... itu kan hari ini?", audio: 'ep01_windu_022.mp3'},
  {from: 3072, to: 3161, who: 'PENELPON', text: "iya. makanya saya telepon sekarang.", audio: 'ep01_penelpon_023.mp3', whisper: true},
  {from: 3164, to: 3267, who: 'LARAS', text: "setelah kamu lihat itu, terus apa yang terjadi?", audio: 'ep01_laras_024.mp3'},
  {from: 3270, to: 3421, who: 'PENELPON', text: "awalnya nggak ada apa-apa, mbak. tapi hari ini, semuanya mulai datang.", audio: 'ep01_penelpon_025.mp3'},
  {from: 3424, to: 3592, who: 'PENELPON', text: "saya denger ada yang ngetok helm saya dari belakang. padahal saya sendirian di motor.", audio: 'ep01_penelpon_026.mp3'},
  {from: 3595, to: 3741, who: 'PENELPON', text: "di kaca spion, ada yang duduk di belakang saya. nggak ada mukanya.", audio: 'ep01_penelpon_027.mp3'},
  {from: 3744, to: 3967, who: 'PENELPON', text: "siangnya saya balik ke kampung itu. kosong, mbak. bener-bener kosong. nggak ada orang sama sekali.", audio: 'ep01_penelpon_028.mp3'},
  {from: 3970, to: 4169, who: 'PENELPON', text: "rumahnya masih ada. nisannya masih ada. tapi nggak ada suara, nggak ada lampu.", audio: 'ep01_penelpon_029.mp3'},
  {from: 4172, to: 4246, who: 'WINDU', text: "mungkin kampungnya emang udah ditinggalin?", audio: 'ep01_windu_030.mp3'},
  {from: 4249, to: 4429, who: 'PENELPON', text: "nggak, mas. tanggal 17 kemarin kampung itu masih rame. saya ngantar ke orang di sana.", audio: 'ep01_penelpon_031.mp3'},
  {from: 4432, to: 4646, who: 'PENELPON', text: "saya balik lagi ke kuburan itu. saya cari nisan saya. masih ada. masih sama persis.", audio: 'ep01_penelpon_032.mp3'},
  {from: 4649, to: 4807, who: 'PENELPON', text: "saya udah kesel banget, mbak. akhirnya saya beraniin gali kuburan itu malam ini.", audio: 'ep01_penelpon_033.mp3'},
  {from: 4810, to: 4990, who: 'PENELPON', text: "saya gali... saya gali terus... di dalamnya kosong. nggak ada apa-apa.", audio: 'ep01_penelpon_034.mp3'},
  {from: 4993, to: 5144, who: 'PENELPON', text: "kuburan itu emang disiapin buat saya. kosong, nunggu saya masuk.", audio: 'ep01_penelpon_035.mp3'},
  {from: 5147, to: 5277, who: 'PENELPON', text: "dan sekarang... saya bisa denger suara tanah di belakang saya.", audio: 'ep01_penelpon_036.mp3', whisper: true},
  {from: 5280, to: 5374, who: 'WINDU', text: "Andi? Andi, kamu masih di sana?", audio: 'ep01_windu_037.mp3'},
  {from: 5377, to: 5507, who: 'LARAS', text: "Andi, jangan dimatiin dulu teleponnya. ngomong terus sama kami.", audio: 'ep01_laras_038.mp3'},
  {from: 5510, to: 5589, who: 'WINDU', text: "Laras... teleponnya mati.", audio: 'ep01_windu_039.mp3'},
  {from: 5592, to: 5647, who: 'LARAS', text: "Windu, lihat laptopnya.", audio: 'ep01_laras_040.mp3'},
  {from: 5698, to: 5835, who: 'LARAS', text: "selamat malam, pendengar TEROR FM. siaran ini belum selesai.", audio: 'ep01_laras_041.mp3'},
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

/** Frame mulai Laras dan Windu menoleh ke kamera (Babak 4 akhir). */
export const TURN_LARAS = 5698;
export const TURN_WINDU = 5714;
/** Frame mulai judul akhir berkedip. */
export const TITLE_START = 5698;
/** Frame mulai lampu mati total (shot jam 12:01). */
export const BLACKOUT_START = 5647;
