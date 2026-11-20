import {Easing, interpolate, random} from 'remotion';

export type V3 = [number, number, number];

export const FPS = 30;
export const DURATION = 5461; // 182.03 detik — dari audio terukur 169.76 detik (5091 frame) + jeda + fade (L12)
export const W = 1080;
export const H = 1920;

/**
 * TEROR FM EP02 — Halte Terakhir. 182.03 detik / 5461 frame, 30 fps, 9:16 vertikal.
 * Studio: x -7..7, z -6..9, tinggi 5. Windu x=-1.7 menghadap +x,
 * Laras x=+1.7 menghadap -x. Laptop portal di [0, 1.32, 0.3].
 * POV: 3 environment voxel lengkap terpisah — (a) interior bus malam lengkap,
 * (b) halte KM 12 lengkap, (c) jalan malam + terminal kosong.
 * CAPTIONS dihitung dari durations.csv EP02 (ffprobe), gap 3 frame antar dialog;
 * gap khusus: telepon berdering 45f (setelah 007), lampu berkedip 30f (setelah 016),
 * laptop menyala 30f (setelah 020), portal P1/P3 60f (caption berikutnya mulai
 * 30f di tengah portal), telepon putus hening 45f (setelah 039), ekor 45f.
 * SHOTS diturunkan dari dialog (L17): kamera mengikuti pembicara / pendengar saat penelpon bicara di studio.
 * Shot pemicu (L16): SP telepon berdering, SF lampu berkedip, SL laptop menyala —
 * ketiganya beat sendiri sebelum dialog menyebutnya.
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
    note: 'Babak 1 pembuka, mie cup Windu. Laras dan Windu berprofil. Vertikal: kamera ditarik mundur + FOV 50-52 supaya keduanya masuk frame.',
  },
  {
    id: 'S3a',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 102,
    to: 206,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu: udah lapar dari tadi. (Perut bunyi + Windu menepuk perutnya sendiri di beat ini.)',
  },
  {
    id: 'S2a',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 206,
    to: 324,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras tertawa kecil soal perut Windu.',
  },
  {
    id: 'S3b',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 324,
    to: 485,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu mengangkat gelas mie cup dua tangan, meniup, menyeruput, meletakkan lagi. FULL ANIMASI: gelas harus di mulut ~380-430.',
  },
  {
    id: 'S2b',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 485,
    to: 567,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: terus kenapa masih kamu pegangin?',
  },
  {
    id: 'S3c',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 567,
    to: 685,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu: kalau aku taruh, aku makin sadar aku lapar. Windu mengelap mulut setelah minum (460-510).',
  },
  {
    id: 'S2c',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 685,
    to: 812,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras menulis di kertas naskah dengan pulpen lalu menutup pulpen (567-685, tangan menulis terlihat di shot ini).',
  },
  {
    id: 'SP',
    label: 'CLOSE-UP meja - telepon berdering',
    from: 812,
    to: 857,
    pos: [[0, 2.2, 3.4], [0, 2.0, 3.0]],
    target: [[0, 1.35, 0.3], [0, 1.35, 0.3]],
    fov: [30, 28],
    scene: 'studio',
    note: 'L16 pemicu: telepon berdering, kamera ke meja sebelum Windu menunjuk telepon. Beat sendiri 45 frame.',
  },
  {
    id: 'S3d',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 857,
    to: 918,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu menunjuk telepon: eh, udah ada yang nelpon.',
  },
  {
    id: 'S2d',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 918,
    to: 1022,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras menyapa penelpon. Laras mengangkat gagang telepon ke telinga (918-1022, gagang bergerak dari meja ke telinga).',
  },
  {
    id: 'S4a',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 1022,
    to: 1169,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Bimo bicara di telepon (010). Bimo tidak tampil di studio; kamera ke Laras yang mendengarkan serius, gagang telepon di telinga.',
  },
  {
    id: 'S2e',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 1169,
    to: 1297,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: malam, Bimo. kamu nelpon dari mana? dari bus?',
  },
  {
    id: 'S4b',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 1297,
    to: 1425,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Bimo: dari bus, bus terakhir. penumpangnya tinggal satu.',
  },
  {
    id: 'S3e',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 1425,
    to: 1550,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu sinis: bus terakhir jam segini masih ada penumpang? tumben.',
  },
  {
    id: 'S4c',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 1550,
    to: 1692,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Bimo: cuma satu orang, naiknya selalu di halte yang sama.',
  },
  {
    id: 'S2f',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 1692,
    to: 1781,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: halte yang mana? halte yang masih rame?',
  },
  {
    id: 'S4d',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 1781,
    to: 1932,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Bimo: halte KM dua belas, udah tutup sejak dua ribu sembilan belas.',
  },
  {
    id: 'SF',
    label: 'CLOSE-UP lampu gantung berkedip',
    from: 1932,
    to: 1962,
    pos: [[-1.2, 2.8, 4.0], [-1.2, 3.0, 3.5]],
    target: [[-1.2, 3.85, 0], [-1.2, 3.85, 0]],
    fov: [36, 32],
    scene: 'studio',
    note: 'L16 pemicu: lampu berkedip sekali, ditunjukkan sebagai beat sendiri 30 frame sebelum Windu bicara soal lampu.',
  },
  {
    id: 'S3f',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 1962,
    to: 2037,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu menoleh ke atas: halte tutup kok bisa ada yang naik?',
  },
  {
    id: 'S4e',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 2037,
    to: 2189,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Bimo: dia duduk paling belakang, nggak pernah turun.',
  },
  {
    id: 'S2g',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 2189,
    to: 2305,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: terus kamu nggak samperin? nggak tanya dia mau ke mana?',
  },
  {
    id: 'S4f',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 2305,
    to: 2444,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Bimo: tadi saya samperin, saya berdiri, saya jalan ke belakang.',
  },
  {
    id: 'SL',
    label: 'CLOSE-UP laptop menyala sendiri',
    from: 2444,
    to: 2474,
    pos: [[0, 2.2, 3.4], [0, 2.0, 3.0]],
    target: [[0, 1.35, 0.3], [0, 1.35, 0.3]],
    fov: [30, 28],
    scene: 'studio',
    note: 'L16 pemicu: layar laptop menyala redup sendiri, ditunjukkan sebagai beat sendiri 30 frame sebelum Laras bicara soal laptop.',
  },
  {
    id: 'S2p',
    label: 'OTS lebar - Laras menunjuk laptop',
    from: 2474,
    to: 2568,
    pos: [[-4.5, 2.75, 1.35], [-4.0, 2.65, 1.15]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [34, 30],
    scene: 'studio',
    note: 'Laras menunjuk laptop: bentar, Bimo. laptop kami nyala sendiri. Kamera ditarik mundur + FOV 34 supaya lengan menunjuk masuk frame.',
  },
  {
    id: 'S4g',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 2568,
    to: 2707,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Bimo: kursi belakang itu kosong. tapi uangnya ada di kursi.',
  },
  {
    id: 'P1',
    label: 'PORTAL LAPTOP - zoom masuk',
    from: 2707,
    to: 2767,
    pos: [[0, 2.4, 10.5], [0, 1.65, 0.9]],
    target: [[0, 1.9, -1], [0, 1.62, 0.0]],
    fov: [52, 18],
    scene: 'studio',
    note: 'Portal 60 frame. Laptop menyala (visualisasi khayalan, bukan video asli). Layar membesar memenuhi frame. Suara Bimo (023) mulai di tengah zoom. Tanpa fade hitam.',
  },
  {
    id: 'P2a1',
    label: 'POV BUS - kursi belakang, uang di kursi',
    from: 2767,
    to: 3023,
    pos: [[0, 2.7, 5.2], [0, 2.6, 4.6]],
    target: [[-0.4, 1.0, 1.0], [-0.4, 1.0, 0.5]],
    fov: [55, 52],
    scene: 'pov',
    note: 'POV interior bus: Bimo membungkuk di kursi belakang, mengambil uang lecek dengan dua tangan, membalik-balik uang itu. Penumpang masih duduk di belakang (bayangan).',
  },
  {
    id: 'P2a2',
    label: 'POV BUS - kaca spion',
    from: 3023,
    to: 3314,
    pos: [[0.3, 2.6, 4.0], [0.25, 2.55, 3.8]],
    target: [[0, 1.5, -2.5], [0, 1.5, -3.0]],
    fov: [48, 44],
    scene: 'pov',
    note: 'POV interior bus: Bimo menoleh ke kaca spion — di spion penumpang itu masih duduk, padahal kursi belakang kosong. Kepala Bimo menoleh (animasi).',
  },
  {
    id: 'P2a3',
    label: 'POV BUS - berjalan kembali ke kursi sopir',
    from: 3314,
    to: 3591,
    pos: [[0.3, 2.5, 4.4], [0.2, 2.4, 3.8]],
    target: [[0, 1.2, -1.5], [0, 1.2, -2.0]],
    fov: [48, 44],
    scene: 'pov',
    note: 'POV interior bus: Bimo berjalan menyusuri lorong sambil tangan memegang sandaran kursi satu per satu, lalu duduk lagi — penumpang sudah pindah ke kursi tepat di belakangnya.',
  },
  {
    id: 'P2b',
    label: 'POV BUS - setir berputar sendiri',
    from: 3591,
    to: 4092,
    pos: [[0, 2.6, 0.5], [0, 2.55, 0.2]],
    target: [[0, 1.45, -3.6], [0, 1.45, -3.6]],
    fov: [34, 30],
    scene: 'pov',
    note: 'POV interior bus, close-up setir: tangan Bimo gemetar memegang setir yang berputar sendiri, kaki mencoba menginjak rem. Setir HARUS berputar antar frame.',
  },
  {
    id: 'P2d',
    label: 'POV HALTE KM 12 - bus berhenti, pintu terbuka sendiri',
    from: 4092,
    to: 4381,
    pos: [[1.2, 2.6, 8.2], [1.0, 2.5, 7.6]],
    target: [[-1.2, 1.0, -1], [-1.2, 1.0, -1]],
    fov: [50, 46],
    scene: 'pov',
    note: 'POV halte KM 12 lengkap: halte, papan jadwal, lampu jalan, jalan sepi, pohon, pagar. Bus berhenti sendiri, pintu terbuka sendiri, tidak ada yang naik, pintu menutup lagi.',
  },
  {
    id: 'P2e',
    label: 'POV JALAN MALAM + TERMINAL - putaran ketiga',
    from: 4381,
    to: 4499,
    pos: [[0, 2.6, 8.5], [0, 2.4, 7.8]],
    target: [[0, 1.0, -3], [0, 1.0, -3]],
    fov: [55, 52],
    scene: 'pov',
    note: 'POV jalan malam lengkap: jalan, marka, lampu jalan, terminal kosong di kejauhan dengan bus-bus lain yang diam. Bus melewati halte yang sama untuk ketiga kalinya.',
  },
  {
    id: 'P3',
    label: 'PORTAL LAPTOP - zoom keluar',
    from: 4499,
    to: 4559,
    pos: [[0, 1.65, 0.9], [0, 2.4, 10.5]],
    target: [[0, 1.62, 0.0], [0, 1.9, -1]],
    fov: [18, 52],
    scene: 'studio',
    note: 'Kembali ke studio 60 frame, kebalikan P1. Layar laptop mengecil ke meja. Suara Laras (036) mulai di tengah zoom.',
  },
  {
    id: 'S2h',
    label: 'OTS lebar - Laras menunjuk laptop (twist)',
    from: 4559,
    to: 4674,
    pos: [[-4.5, 2.75, 1.35], [-4.0, 2.65, 1.15]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [34, 30],
    scene: 'studio',
    note: 'Babak 4. Laras menunjuk laptop: di laptop kami... kursi sopirmu kosong. Lengan menunjuk masuk frame (kamera mundur, FOV 34).',
  },
  {
    id: 'S4h',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 4674,
    to: 4780,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Bimo: kosong? mbak, saya masih duduk di sini.',
  },
  {
    id: 'S3g',
    label: 'CLOSE-UP Windu (3/4, push-in, cermin S4)',
    from: 4780,
    to: 4908,
    pos: [[0, 2.4, 3.6], [-0.4, 2.35, 3.1]],
    target: [[-1.7, 2.2, 0], [-1.7, 2.2, 0]],
    fov: [36, 30],
    scene: 'studio',
    note: 'Windu menutup mulut dengan tangan: kalau kursimu kosong, terus yang nelpon kami ini siapa?',
  },
  {
    id: 'S4i',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 4908,
    to: 5050,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Bimo berbisik: jam di dashboard nggak jalan. tapi busnya jalan terus. Lalu suara pintu bus menutup, telepon terputus.',
  },
  {
    id: 'S6h',
    label: 'WIDE FRONTAL - hening telepon putus',
    from: 5050,
    to: 5095,
    pos: [[0, 2.4, 10.5], [0, 2.1, 9.0]],
    target: [[0, 1.9, -1], [0, 2.0, -1.2]],
    fov: [52, 50],
    scene: 'studio',
    note: 'Hening 45 frame tanpa dialog setelah telepon putus. Laras dan Windu menatap telepon.',
  },
  {
    id: 'S2j',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 5095,
    to: 5194,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: Bimo? Bimo, kamu masih di sana?',
  },
  {
    id: 'S3h',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 5194,
    to: 5343,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu: teleponnya putus. lampunya... lampunya mati semua. Windu menunduk, tangan ke headset.',
  },
  {
    id: 'T1',
    label: 'CLOSE-UP laptop - kursi sopir kosong, setir berputar sendiri',
    from: 5343,
    to: 5416,
    pos: [[0, 1.7, 3.4], [0, 1.68, 3.1]],
    target: [[0, 1.64, 0.04], [0, 1.64, 0.04]],
    fov: [36, 32],
    scene: 'studio',
    note: 'Twist: kamera menyorot layar laptop — miniatur interior bus: kursi sopir KOSONG, setir berputar sendiri. Lampu mati, hanya ON AIR merah. Laras menutup dengan suara (042) di atas shot ini.',
  },
  {
    id: 'T2',
    label: 'WIDE FRONTAL akhir + judul',
    from: 5416,
    to: 5461,
    pos: [[0, 2.4, 10.5], [0, 2.1, 9.0]],
    target: [[0, 1.9, -1], [0, 2.0, -1.2]],
    fov: [52, 50],
    scene: 'studio',
    note: 'Penutup. Laras dan Windu menoleh ke kamera. Judul akhir merah berkedip: BUS TERAKHIR TIDAK PERNAH SAMPAI, lalu fade hitam 14 frame terakhir.',
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
  const shake = frame >= 4092 ? 1.6 : frame >= 1962 ? 1.2 : 1;
  pos[0] += Math.sin(frame * 0.11) * 0.012 * shake;
  pos[1] += Math.sin(frame * 0.17 + 1) * 0.01 * shake;
  target[1] += Math.sin(frame * 0.09 + 2) * 0.01 * shake;
  return {pos, target, fov: lerp(shot.fov[0], shot.fov[1], t)};
};

/** Level lampu 0..1. Babak 1 stabil, Babak 2 berkedip pelan, POV redup,
 * kembali 0.9, twist: 0 lalu mati total di shot laptop (T1) dan penutup. */
const FLICKER: [number, number, number][] = [
  [1932, 2037, 0.35],
  [2305, 2444, 0.5],
  [2707, 2767, 0.45],
  [4092, 4229, 0.5],
  [4499, 4559, 0.5],
];

export const lightLevel = (frame: number): number => {
  if (frame >= 5343) return 0; // twist: lampu mati, hanya ON AIR merah
  if (frame >= 2767 && frame < 4499) return 0.55; // POV malam: redup, cahaya dari lampu bus / lampu jalan
  let level = 1;
  for (const [a, b, p] of FLICKER) {
    if (frame >= a && frame < b) {
      const r = random(`flicker-${Math.floor(frame / 2)}`);
      if (r < p) level = 0.04 + r * 0.2;
    }
  }
  if (frame > 1962 && frame < 4499 && level === 1) {
    level = 0.9 + 0.06 * Math.sin(frame * 0.7);
  }
  return level;
};

export const isPov = (frame: number): boolean => getShot(frame).scene === 'pov';
export const isPovDay = (_frame: number): boolean => false;
export const povScene = (frame: number): 'p2a' | 'p2b' | 'p2d' | 'p2e' | null => {
  if (frame >= 2767 && frame < 3591) return 'p2a';
  if (frame >= 3591 && frame < 4092) return 'p2b';
  if (frame >= 4092 && frame < 4381) return 'p2d';
  if (frame >= 4381 && frame < 4499) return 'p2e';
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
  {from: 10, to: 99, who: 'LARAS', text: 'selamat malam, ini TEROR FM.', audio: 'ep02_laras_001.mp3'},
  {from: 102, to: 203, who: 'WINDU', text: 'selamat malam. aku udah lapar dari tadi.', audio: 'ep02_windu_002.mp3'},
  {from: 206, to: 321, who: 'LARAS', text: 'itu perutmu ya? baru juga jam segini.', audio: 'ep02_laras_003.mp3'},
  {from: 324, to: 482, who: 'WINDU', text: "bukan lapar. ini... mie-nya udah dingin, nggak ada air panas.", audio: 'ep02_windu_004.mp3'},
  {from: 485, to: 564, who: 'LARAS', text: 'terus kenapa masih kamu pegangin?', audio: 'ep02_laras_005.mp3'},
  {from: 567, to: 682, who: 'WINDU', text: 'karena kalau aku taruh, aku makin sadar aku lapar.', audio: 'ep02_windu_006.mp3'},
  {from: 685, to: 812, who: 'LARAS', text: 'ya udah, tahan dulu. kita siaran dulu, habis ini makan.', audio: 'ep02_laras_007.mp3'},
  {from: 857, to: 915, who: 'WINDU', text: 'eh, udah ada yang nelpon.', audio: 'ep02_windu_008.mp3'},
  {from: 918, to: 1019, who: 'LARAS', text: 'halo, TEROR FM. dengan siapa di sana?', audio: 'ep02_laras_009.mp3'},
  {from: 1022, to: 1166, who: 'PENELPON', text: 'malam, mbak. saya Bimo. sopir bus, shift malam.', audio: 'ep02_penelpon_010.mp3'},
  {from: 1169, to: 1294, who: 'LARAS', text: 'malam, Bimo. kamu nelpon dari mana? dari bus?', audio: 'ep02_laras_011.mp3'},
  {from: 1297, to: 1422, who: 'PENELPON', text: 'dari bus, mbak. bus terakhir. penumpangnya tinggal satu.', audio: 'ep02_penelpon_012.mp3'},
  {from: 1425, to: 1547, who: 'WINDU', text: 'bus terakhir jam segini masih ada penumpang? tumben.', audio: 'ep02_windu_013.mp3'},
  {from: 1550, to: 1689, who: 'PENELPON', text: 'cuma satu orang, mas. naiknya selalu di halte yang sama.', audio: 'ep02_penelpon_014.mp3'},
  {from: 1692, to: 1778, who: 'LARAS', text: 'halte yang mana? halte yang masih rame?', audio: 'ep02_laras_015.mp3'},
  {from: 1781, to: 1932, who: 'PENELPON', text: 'halte KM dua belas, mbak. halte itu udah tutup sejak dua ribu sembilan belas.', audio: 'ep02_penelpon_016.mp3'},
  {from: 1962, to: 2034, who: 'WINDU', text: 'halte tutup kok bisa ada yang naik?', audio: 'ep02_windu_017.mp3'},
  {from: 2037, to: 2186, who: 'PENELPON', text: 'itu yang saya juga bingung, mas. dia duduk paling belakang, nggak pernah turun.', audio: 'ep02_penelpon_018.mp3'},
  {from: 2189, to: 2302, who: 'LARAS', text: 'terus kamu nggak samperin? nggak tanya dia mau ke mana?', audio: 'ep02_laras_019.mp3'},
  {from: 2305, to: 2444, who: 'PENELPON', text: 'tadi saya samperin, mbak. saya berdiri, saya jalan ke belakang.', audio: 'ep02_penelpon_020.mp3'},
  {from: 2474, to: 2565, who: 'LARAS', text: 'bentar, Bimo. laptop kami nyala sendiri.', audio: 'ep02_laras_021.mp3'},
  {from: 2568, to: 2707, who: 'PENELPON', text: 'mbak... kursi belakang itu kosong. tapi uangnya ada di kursi.', audio: 'ep02_penelpon_022.mp3'},
  {from: 2737, to: 2919, who: 'PENELPON', text: 'uangnya lecek, mbak. uang lama. saya ambil pakai dua tangan, saya balik-balik.', audio: 'ep02_penelpon_023.mp3'},
  {from: 2922, to: 3020, who: 'LARAS', text: 'terus orangnya ke mana? kamu lihat dia turun?', audio: 'ep02_laras_024.mp3'},
  {from: 3023, to: 3162, who: 'PENELPON', text: 'saya nggak lihat dia turun, mbak. saya lihat di spion, dia masih duduk.', audio: 'ep02_penelpon_025.mp3'},
  {from: 3165, to: 3311, who: 'WINDU', text: 'di spion masih duduk, tapi kursinya kosong? itu nggak masuk akal.', audio: 'ep02_windu_026.mp3'},
  {from: 3314, to: 3446, who: 'PENELPON', text: 'saya juga mikir gitu, mas. makanya saya balik ke kursi sopir.', audio: 'ep02_penelpon_027.mp3'},
  {from: 3449, to: 3588, who: 'PENELPON', text: 'pas saya duduk lagi... dia udah pindah. tepat di belakang saya.', audio: 'ep02_penelpon_028.mp3'},
  {from: 3591, to: 3665, who: 'LARAS', text: 'Bimo, kamu masih di bus sekarang?', whisper: true, audio: 'ep02_laras_029.mp3'},
  {from: 3668, to: 3807, who: 'PENELPON', text: 'masih, mbak. dan setirnya... setirnya muter sendiri.', audio: 'ep02_penelpon_030.mp3'},
  {from: 3810, to: 3904, who: 'WINDU', text: 'setir muter sendiri? kamu nggak pegang setir?', audio: 'ep02_windu_031.mp3'},
  {from: 3907, to: 4089, who: 'PENELPON', text: "saya pegang, mas. tapi tangan saya ikut ketarik. remnya saya injak, nggak ngaruh.", audio: 'ep02_penelpon_032.mp3'},
  {from: 4092, to: 4229, who: 'PENELPON', text: 'busnya berhenti sendiri di halte yang sama. pintunya kebuka sendiri.', audio: 'ep02_penelpon_033.mp3'},
  {from: 4232, to: 4378, who: 'PENELPON', text: "nggak ada yang naik, mbak. pintunya nutup lagi. busnya jalan lagi.", audio: 'ep02_penelpon_034.mp3'},
  {from: 4381, to: 4499, who: 'PENELPON', text: 'ini udah ketiga kalinya saya lewat halte yang sama malam ini.', audio: 'ep02_penelpon_035.mp3'},
  {from: 4529, to: 4671, who: 'LARAS', text: 'Bimo, bentar. di laptop kami... kursi sopirmu kosong.', audio: 'ep02_laras_036.mp3'},
  {from: 4674, to: 4777, who: 'PENELPON', text: 'kosong? mbak, saya masih duduk di sini.', audio: 'ep02_penelpon_037.mp3'},
  {from: 4780, to: 4905, who: 'WINDU', text: 'kalau kursimu kosong, terus yang nelpon kami ini siapa?', audio: 'ep02_windu_038.mp3'},
  {from: 4908, to: 5050, who: 'PENELPON', text: "mas... jam di dashboard nggak jalan. tapi busnya jalan terus.", whisper: true, audio: 'ep02_penelpon_039.mp3'},
  {from: 5095, to: 5191, who: 'LARAS', text: 'Bimo? Bimo, kamu masih di sana?', audio: 'ep02_laras_040.mp3'},
  {from: 5194, to: 5343, who: 'WINDU', text: 'teleponnya putus. lampunya... lampunya mati semua.', audio: 'ep02_windu_041.mp3'},
  {from: 5346, to: 5416, who: 'LARAS', text: 'teruskan, kami mendengarkan.', audio: 'ep02_laras_042.mp3'},
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
export const TURN_LARAS = 5432;
export const TURN_WINDU = 5416;
/** Frame mulai judul akhir berkedip. */
export const TITLE_START = 5416;
/** Frame mulai lampu mati total (shot twist laptop, T1). */
export const BLACKOUT_START = 5343;
