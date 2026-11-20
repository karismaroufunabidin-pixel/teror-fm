import {Easing, interpolate, random} from 'remotion';

export type V3 = [number, number, number];

export const FPS = 30;
export const DURATION = 6806; // 226.87 detik — dari audio terukur 212.96 detik (6388 frame) + jeda + fade (L12)
export const W = 1080;
export const H = 1920;

/**
 * TEROR FM EP03 — Kamar 7. 226.87 detik / 6806 frame, 30 fps, 9:16 vertikal.
 * Studio: x -7..7, z -6..9, tinggi 5. Windu x=-1.7 menghadap +x,
 * Laras x=+1.7 menghadap -x. Laptop portal di [0, 1.32, 0.3].
 * POV: 4 environment voxel lengkap terpisah — (a) lorong lantai 3,
 * (b) kamar 7, (c) lorong gelap, (d) nurse station lantai 3.
 * CAPTIONS dihitung dari durations.csv EP03 (ffprobe), gap 3 frame antar dialog;
 * gap khusus: telepon berdering 45f (setelah 006), lampu berkedip 30f (setelah 018),
 * laptop menyala 30f (setelah 020), portal P1/P3 60f (caption berikutnya mulai
 * 30f di tengah portal), sunyi sebelum scare 15f (setelah 030), telepon internal
 * 30f (setelah 035, SI), telepon putus hening 45f (setelah 041), ekor 45f.
 * SHOTS diturunkan dari dialog (L17). Shot pemicu (L16): SP, SF, SL, SI + HP
 * menyala sendiri di S1 (f55-95, L19) + lorong gelap P2c.
 * L52 MUTLAK: Laras/Windu tidak pernah bereaksi terhadap isi POV. Tidak ada
 * shot laptop berisi nama/monitor kamar 7. Twist hanya diucapkan Nadia.
 * Wide shot vertikal: FOV 50-55 + kamera ditarik mundur (z 7.5-10.5).
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
    note: 'Babak 1 pembuka. HP Windu di meja MENYALA SENDIRI f55-95 (L19 hook, anomali di 90 frame pertama) sebelum dialog panjang. Laras dan Windu berprofil.',
  },
  {
    id: 'S3a',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 102,
    to: 391,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu: HP tinggal 3% (002) lalu HP nyala sendiri (003). Windu mengangkat HP, menunjuk layar 3% ke Laras, menepuk HP saat menyala sendiri.',
  },
  {
    id: 'S2a',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 391,
    to: 531,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: kamu colok chargernya belum?',
  },
  {
    id: 'S3b',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 531,
    to: 673,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu mencolokkan kabel charger, menariknya, mencolokkan lagi (531-670). HP tetap 3%. Kabel charger animasi bergerak ke HP.',
  },
  {
    id: 'S2b',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 673,
    to: 822,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: ya udah, biarin dulu. Laras menulis di kertas naskah dengan pulpen lalu menutup pulpen (673-822).',
  },
  {
    id: 'SP',
    label: 'CLOSE-UP meja - telepon berdering',
    from: 822,
    to: 867,
    pos: [[0, 2.8, 5.5], [0, 2.6, 5.0]],
    target: [[0.6, 1.35, 0.4], [0.6, 1.35, 0.4]],
    fov: [34, 30],
    scene: 'studio',
    note: 'L16 pemicu: [SFX telepon berdering] beat sendiri 45f sebelum Windu menunjuk telepon. Telepon studio bergetar di meja.',
  },
  {
    id: 'S3c',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 867,
    to: 930,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu menunjuk telepon: eh, udah ada yang nelpon. Lengan menunjuk terulur 867-927.',
  },
  {
    id: 'S2c',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 930,
    to: 1036,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras menyapa penelpon. Laras mengangkat gagang telepon ke telinga (930-1033, gagang bergerak dari meja ke telinga, bertahan s.d. portal).',
  },
  {
    id: 'S4a',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 1036,
    to: 1178,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia bicara di telepon (009). Nadia tidak tampil di studio; kamera ke Laras yang mendengarkan, gagang di telinga.',
  },
  {
    id: 'S2d',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 1178,
    to: 1306,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: malam, Nadia. kamu nelpon dari mana?',
  },
  {
    id: 'S4b',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 1306,
    to: 1489,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia: dari nurse station, lantai tiga. Kamar tujuh kosong, tapi teleponnya bunyi.',
  },
  {
    id: 'S2e',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 1489,
    to: 1650,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras (callback L40): semalam sopir bus, malam ini perawat.',
  },
  {
    id: 'S3d',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 1650,
    to: 1775,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu sinis: kamar kosong kok teleponnya bunyi?',
  },
  {
    id: 'S4c',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 1775,
    to: 2047,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia: benih twist L23 — suster senior bilang jangan angkat telepon kamar kosong tiga kali. Laras mendengarkan, mengangkat satu sisi headphone sebentar.',
  },
  {
    id: 'S3e',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 2047,
    to: 2180,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu menyangkal benih: itu mah mitos, telepon rusak.',
  },
  {
    id: 'S4d',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 2180,
    to: 2327,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia: saya angkat pas bunyi ketiga.',
  },
  {
    id: 'S2f',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 2327,
    to: 2424,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: terus yang kamu denger apa?',
  },
  {
    id: 'S4e',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 2424,
    to: 2642,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia: cuma suara monitor, detak jantung, pelan, terus berhenti. [SFX monitor] di beat ini.',
  },
  {
    id: 'SF',
    label: 'CLOSE-UP lampu gantung berkedip',
    from: 2642,
    to: 2672,
    pos: [[-1.2, 2.8, 4.0], [-1.2, 3.0, 3.5]],
    target: [[-1.2, 3.85, 0], [-1.2, 3.85, 0]],
    fov: [36, 32],
    scene: 'studio',
    note: 'L16 pemicu: lampu berkedip sekali, beat sendiri 30f sebelum Windu bicara soal lampu.',
  },
  {
    id: 'S3f',
    label: 'OTS - dari belakang Laras ke Windu',
    from: 2672,
    to: 2802,
    pos: [[4.7, 3.0, -0.9], [4.2, 2.95, -0.8]],
    target: [[-2.4, 2.65, 0.1], [-2.6, 2.75, 0.1]],
    fov: [36, 31],
    scene: 'studio',
    note: 'Windu menoleh ke atas: kamar kosong kok ada suara monitor?',
  },
  {
    id: 'S4f',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 2802,
    to: 2948,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia: saya jalan ke kamar tujuh, bawa nampan obat.',
  },
  {
    id: 'SL',
    label: 'CLOSE-UP laptop menyala sendiri',
    from: 2948,
    to: 2978,
    pos: [[0, 2.2, 3.4], [0, 2.0, 3.0]],
    target: [[0, 1.35, 0.3], [0, 1.35, 0.3]],
    fov: [30, 28],
    scene: 'studio',
    note: 'L16 pemicu: layar laptop menyala redup sendiri, beat sendiri 30f sebelum Laras bicara soal laptop. Laras/Windu HANYA tahu laptop menyala (L52) — isi layar tidak digambarkan.',
  },
  {
    id: 'S2p',
    label: 'OTS lebar - Laras menunjuk laptop',
    from: 2978,
    to: 3072,
    pos: [[-4.5, 2.75, 1.35], [-4.0, 2.65, 1.15]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [34, 30],
    scene: 'studio',
    note: 'Laras menunjuk laptop: bentar, Nadia. laptop kami nyala sendiri. Hanya menunjuk — TIDAK menggambarkan isi laptop (L52).',
  },
  {
    id: 'S4g',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 3072,
    to: 3233,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia: kamar itu kosong, tapi tempat tidurnya udah dipakai.',
  },
  {
    id: 'P1',
    label: 'PORTAL LAPTOP - zoom masuk',
    from: 3233,
    to: 3293,
    pos: [[0, 2.4, 10.5], [0, 1.65, 0.9]],
    target: [[0, 1.9, -1], [0, 1.62, 0.0]],
    fov: [52, 18],
    scene: 'studio',
    note: 'Portal 60f. Laptop menyala (visualisasi khayalan, bukan video asli). Layar membesar memenuhi frame. Suara Nadia (023) mulai 30f di tengah zoom. Tanpa fade hitam.',
  },
  {
    id: 'P2a',
    label: 'POV LORONG - ketuk pintu kamar 7',
    from: 3293,
    to: 3706,
    pos: [[-0.9, 1.9, 3.6], [-0.7, 1.8, 2.9]],
    target: [[1.2, 1.3, -2], [1.2, 1.3, -2]],
    fov: [55, 52],
    scene: 'pov',
    note: 'POV lorong lantai 3 lengkap: Nadia berjalan pegang nampan obat dua tangan, mengetuk pintu 3x [SFX ketukan], mendorong pintu [SFX berderit]. Jam dinding lorong berputar cepat lalu berhenti tepat (L43).',
  },
  {
    id: 'P2b',
    label: 'POV KAMAR 7 - selimut, gelas, obat',
    from: 3706,
    to: 4269,
    pos: [[2.0, 2.4, 2.6], [1.8, 2.2, 2.0]],
    target: [[0.0, 0.9, -0.9], [0.0, 0.9, -0.9]],
    fov: [54, 50],
    scene: 'pov',
    note: 'POV kamar 7 lengkap: tempat tidur, selimut dibalik, gelas air digeser linear, tablet obat dihitung dengan jari (L44). Lalu Nadia tanya satpam + dokter jaga (tersangka dicoret, L38).',
  },
  {
    id: 'P2c',
    label: 'POV LORONG GELAP - suara Nadia sendiri',
    from: 4269,
    to: 4787,
    pos: [[0, 1.7, 1.8], [0, 1.65, 1.2]],
    target: [[0, 1.5, -3], [0, 1.5, -3]],
    fov: [50, 48],
    scene: 'pov',
    note: 'POV lorong GELAP: lampu lorong dimatikan Nadia, cahaya hanya celah pintu + senter. Sunyi 15f (4555-4570, L24, SFX berhenti) sebelum bisik 031: suara Nadia sendiri. Visual disembunyikan, suara membawa cerita (L39).',
  },
  {
    id: 'P2d',
    label: 'POV LARI BALIK - nurse station, monitor kosong',
    from: 4787,
    to: 5264,
    pos: [[0, 1.8, -2], [0, 1.75, 0.0]],
    target: [[0, 1.4, 4], [0, 1.4, 4]],
    fov: [55, 52],
    scene: 'pov',
    note: 'POV lari balik ke nurse station (run cycle + parallax lorong, L45). Nadia menoleh ke monitor kamar 7: namanya masih kosong (layar abu-abu, L46 — satu warna = satu makna).',
  },
  {
    id: 'P2e',
    label: 'POV NURSE STATION - telepon berdering lagi',
    from: 5264,
    to: 5442,
    pos: [[1.8, 3.0, 5.2], [1.7, 2.9, 4.9]],
    target: [[0.2, 1.2, 4.3], [0.2, 1.2, 4.3]],
    fov: [42, 38],
    scene: 'pov',
    note: 'POV nurse station lengkap: Nadia di depan telepon internal, telepon berdering keempat kalinya (035).',
  },
  {
    id: 'SI',
    label: 'CLOSE-UP telepon internal berdering',
    from: 5442,
    to: 5472,
    pos: [[1.8, 3.0, 5.2], [1.7, 2.9, 4.9]],
    target: [[0.6, 1.2, 4.5], [0.6, 1.2, 4.5]],
    fov: [30, 26],
    scene: 'pov',
    note: 'L16 pemicu: [SFX telepon internal berdering] beat sendiri 30f di akhir POV sebelum portal keluar. Telepon bergetar di meja nurse station.',
  },
  {
    id: 'P3',
    label: 'PORTAL LAPTOP - zoom keluar',
    from: 5472,
    to: 5532,
    pos: [[0, 1.65, 0.9], [0, 2.4, 10.5]],
    target: [[0, 1.62, 0.0], [0, 1.9, -1]],
    fov: [18, 52],
    scene: 'studio',
    note: 'Kembali ke studio 60f, kebalikan P1. Suara Laras (036) mulai 30f di tengah zoom. Laras/Windu menatap TELEPON, bukan isi laptop (L52).',
  },
  {
    id: 'S2h',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 5532,
    to: 5632,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Babak 4. Laras: Nadia, itu suara telepon di tempatmu ya? Laras menatap telepon studio, bukan laptop.',
  },
  {
    id: 'S4h',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 5632,
    to: 5832,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia panik: telepon kamar tujuh bunyi terus, saya nggak berani angkat.',
  },
  {
    id: 'S2i',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 5832,
    to: 6025,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: jangan angkat. tetap di tempatmu, jangan ke kamar tujuh.',
  },
  {
    id: 'S4i',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 6025,
    to: 6218,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia: nama pasien kamar tujuh... baru berubah. Twist HANYA diucapkan Nadia — studio TIDAK menunjukkan monitor/laptop berisi nama itu (L52).',
  },
  {
    id: 'S2j',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 6218,
    to: 6322,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: berubah jadi apa, Nadia?',
  },
  {
    id: 'S4j',
    label: 'CLOSE-UP Laras mendengarkan (3/4, push-in)',
    from: 6322,
    to: 6404,
    pos: [[-2.2, 2.5, 1.6], [-1.8, 2.45, 1.3]],
    target: [[1.7, 2.2, 0], [1.7, 2.2, 0]],
    fov: [30, 26],
    scene: 'studio',
    note: 'Nadia berbisik: jadi nama saya, mbak. Nadia. [SFX statik] lalu telepon terputus di akhir shot.',
  },
  {
    id: 'S6h',
    label: 'WIDE FRONTAL - hening telepon putus',
    from: 6404,
    to: 6449,
    pos: [[0, 2.4, 10.5], [0, 2.1, 9.0]],
    target: [[0, 1.9, -1], [0, 2.0, -1.2]],
    fov: [52, 50],
    scene: 'studio',
    note: 'Hening 45f tanpa dialog setelah telepon putus. Laras dan Windu menatap telepon.',
  },
  {
    id: 'S2k',
    label: 'OTS - dari belakang Windu ke Laras',
    from: 6449,
    to: 6550,
    pos: [[-3.7, 2.55, 1.0], [-3.3, 2.5, 0.85]],
    target: [[1.7, 2.15, -0.1], [1.7, 2.15, -0.1]],
    fov: [27, 24],
    scene: 'studio',
    note: 'Laras: Nadia? Nadia, kamu masih di sana?',
  },
  {
    id: 'S3h',
    label: 'CLOSE-UP Windu (3/4, push-in)',
    from: 6550,
    to: 6687,
    pos: [[0.2, 2.5, 4.0], [-0.2, 2.45, 3.5]],
    target: [[-1.85, 2.2, 0], [-1.85, 2.2, 0]],
    fov: [34, 30],
    scene: 'studio',
    note: 'Windu menutup mulut dengan tangan, mata melebar 1.75x: teleponnya putus. lampunya mati semua. Lampu mati total dari f6550 (BLACKOUT).',
  },
  {
    id: 'T2',
    label: 'WIDE FRONTAL akhir + judul',
    from: 6687,
    to: 6806,
    pos: [[0, 2.4, 10.5], [0, 2.1, 9.0]],
    target: [[0, 1.9, -1], [0, 2.0, -1.2]],
    fov: [52, 50],
    scene: 'studio',
    note: 'Penutup. Laras dan Windu menoleh ke kamera. Judul akhir merah berkedip: KAMAR 7 SUDAH ADA PENGHUNINYA, lalu fade hitam 14f terakhir. TIDAK ada close-up laptop berisi nama — L52.',
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
  const shake = frame >= 4787 ? 1.6 : frame >= 2642 ? 1.2 : 1;
  pos[0] += Math.sin(frame * 0.11) * 0.012 * shake;
  pos[1] += Math.sin(frame * 0.17 + 1) * 0.01 * shake;
  target[1] += Math.sin(frame * 0.09 + 2) * 0.01 * shake;
  return {pos, target, fov: lerp(shot.fov[0], shot.fov[1], t)};
};

/** Level lampu 0..1. Babak 1 stabil, Babak 2 berkedip pelan, POV redup,
 * lorong gelap sangat redup, kembali 0.9, twist: 0 lalu mati total. */
const FLICKER: [number, number, number][] = [
  [2642, 2802, 0.35],
  [3706, 3912, 0.5],
  [3233, 3293, 0.45],
  [5472, 5532, 0.5],
];

export const lightLevel = (frame: number): number => {
  if (frame >= 6550) return 0.28; // twist: lampu mati, sisa cahaya merah ON AIR — wajah tetap terbaca redup
  if (frame >= 4269 && frame < 4787) return 0.18; // P2c lorong gelap
  if (frame >= 3293 && frame < 5532) return 0.55; // POV RS malam: redup
  let level = 1;
  for (const [a, b, p] of FLICKER) {
    if (frame >= a && frame < b) {
      const r = random(`flicker-${Math.floor(frame / 2)}`);
      if (r < p) level = 0.04 + r * 0.2;
    }
  }
  if (frame > 2642 && frame < 5532 && level === 1) {
    level = 0.9 + 0.06 * Math.sin(frame * 0.7);
  }
  return level;
};

export const isPov = (frame: number): boolean => getShot(frame).scene === 'pov';
export const isPovDay = (_frame: number): boolean => false;
export const povScene = (frame: number): 'p2a' | 'p2b' | 'p2c' | 'p2d' | 'p2e' | 'si' | null => {
  if (frame >= 3293 && frame < 3706) return 'p2a';
  if (frame >= 3706 && frame < 4269) return 'p2b';
  if (frame >= 4269 && frame < 4787) return 'p2c';
  if (frame >= 4787 && frame < 5264) return 'p2d';
  if (frame >= 5264 && frame < 5442) return 'p2e';
  if (frame >= 5442 && frame < 5472) return 'si';
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
  {from: 10, to: 99, who: 'LARAS', text: 'selamat malam, ini TEROR FM.', audio: 'ep03_laras_001.mp3'},
  {from: 102, to: 251, who: 'WINDU', text: 'selamat malam. HP-ku tinggal tiga persen, chargernya di mana ya?', audio: 'ep03_windu_002.mp3'},
  {from: 254, to: 388, who: 'WINDU', text: 'eh, HP-ku nyala sendiri. padahal tadi mati.', audio: 'ep03_windu_003.mp3'},
  {from: 391, to: 528, who: 'LARAS', text: 'kamu colok chargernya belum? jangan-jangan kabelnya longgar?', audio: 'ep03_laras_004.mp3'},
  {from: 531, to: 670, who: 'WINDU', text: 'udah aku colok dua kali. tetap tiga persen, nggak nambah.', audio: 'ep03_windu_005.mp3'},
  {from: 673, to: 822, who: 'LARAS', text: 'ya udah, biarin dulu. kita siaran dulu, HP-mu urusan belakangan.', audio: 'ep03_laras_006.mp3'},
  {from: 867, to: 927, who: 'WINDU', text: 'eh, udah ada yang nelpon.', audio: 'ep03_windu_007.mp3'},
  {from: 930, to: 1033, who: 'LARAS', text: 'halo, TEROR FM. dengan siapa di sana?', audio: 'ep03_laras_008.mp3'},
  {from: 1036, to: 1175, who: 'PENELPON', text: 'malam, mbak. saya Nadia. perawat, shift malam.', audio: 'ep03_penelpon_009.mp3'},
  {from: 1178, to: 1303, who: 'LARAS', text: 'malam, Nadia. kamu nelpon dari mana? dari rumah sakit?', audio: 'ep03_laras_010.mp3'},
  {from: 1306, to: 1486, who: 'PENELPON', text: 'dari nurse station, mbak. lantai tiga. kamar tujuh kosong, tapi teleponnya bunyi.', audio: 'ep03_penelpon_011.mp3'},
  {from: 1489, to: 1647, who: 'LARAS', text: 'semalam sopir bus, malam ini perawat. shift malam makin rame ya.', audio: 'ep03_laras_012.mp3'},
  {from: 1650, to: 1772, who: 'WINDU', text: 'kamar kosong kok teleponnya bunyi? salah sambung kali.', audio: 'ep03_windu_013.mp3'},
  {from: 1775, to: 2044, who: 'PENELPON', text: 'suster senior saya pernah bilang, kalau telepon kamar kosong bunyi tiga kali, jangan diangkat. nanti namamu yang masuk daftar pasien.', audio: 'ep03_penelpon_014.mp3'},
  {from: 2047, to: 2177, who: 'WINDU', text: 'itu mah mitos, mbak. telepon rusak, kabelnya konslet.', audio: 'ep03_windu_015.mp3'},
  {from: 2180, to: 2324, who: 'PENELPON', text: 'saya juga mikir gitu, mas. makanya saya angkat pas bunyi ketiga.', audio: 'ep03_penelpon_016.mp3'},
  {from: 2327, to: 2421, who: 'LARAS', text: 'terus yang kamu denger apa? ada yang ngomong?', audio: 'ep03_laras_017.mp3'},
  {from: 2424, to: 2642, who: 'PENELPON', text: 'nggak ada yang ngomong, mbak. cuma suara monitor. detak jantung. pelan, terus berhenti.', audio: 'ep03_penelpon_018.mp3'},
  {from: 2672, to: 2799, who: 'WINDU', text: 'kamar kosong kok ada suara monitor? monitornya kan mati.', audio: 'ep03_windu_019.mp3'},
  {from: 2802, to: 2948, who: 'PENELPON', text: 'makanya saya cek langsung, mas. saya jalan ke kamar tujuh, bawa nampan obat.', audio: 'ep03_penelpon_020.mp3'},
  {from: 2978, to: 3069, who: 'LARAS', text: 'bentar, Nadia. laptop kami nyala sendiri.', audio: 'ep03_laras_021.mp3'},
  {from: 3072, to: 3233, who: 'PENELPON', text: 'mbak... kamar itu kosong. tapi tempat tidurnya udah dipakai.', audio: 'ep03_penelpon_022.mp3'},
  {from: 3263, to: 3472, who: 'PENELPON', text: 'saya ketuk pintunya tiga kali. nggak ada yang jawab. saya dorong pelan, pintunya kebuka sendiri.', audio: 'ep03_penelpon_023.mp3'},
  {from: 3475, to: 3566, who: 'LARAS', text: 'terus di dalam ada apa? lampunya nyala?', audio: 'ep03_laras_024.mp3'},
  {from: 3569, to: 3703, who: 'PENELPON', text: 'lampunya mati, mbak. cuma lampu lorong yang masuk dari celah pintu.', audio: 'ep03_penelpon_025.mp3'},
  {from: 3706, to: 3912, who: 'PENELPON', text: 'selimutnya terlipat rapi, tapi gelas airnya tinggal setengah. obat di meja berkurang satu.', audio: 'ep03_penelpon_026.mp3'},
  {from: 3915, to: 4078, who: 'PENELPON', text: 'saya tanya satpam di lantai satu, dia bilang nggak ada yang naik ke lantai tiga malam ini.', audio: 'ep03_penelpon_027.mp3'},
  {from: 4081, to: 4266, who: 'PENELPON', text: 'saya tanya dokter jaga, dia bilang pasien kamar tujuh udah nggak ada sejak tanggal empat belas.', audio: 'ep03_penelpon_028.mp3'},
  {from: 4269, to: 4370, who: 'LARAS', text: 'terus kamu balik lagi ke kamar itu? sendirian?', audio: 'ep03_laras_029.mp3'},
  {from: 4373, to: 4555, who: 'PENELPON', text: 'saya balik, mbak. saya bawa senter. saya matiin lampu lorong, biar saya denger jelas.', audio: 'ep03_penelpon_030.mp3'},
  {from: 4570, to: 4784, who: 'PENELPON', text: 'di gelap itu, mbak... saya denger ada yang ngomong pelan. suaranya... suara saya sendiri.', audio: 'ep03_penelpon_031.mp3', whisper: true},
  {from: 4787, to: 4888, who: 'WINDU', text: 'suara kamu sendiri? kamu ngomong sama siapa di sana?', audio: 'ep03_windu_032.mp3'},
  {from: 4891, to: 5078, who: 'PENELPON', text: 'saya nggak ngomong, mas. saya diem. tapi suara itu bilang, jangan masuk kamar tujuh.', audio: 'ep03_penelpon_033.mp3'},
  {from: 5081, to: 5261, who: 'PENELPON', text: 'saya lari balik ke nurse station. saya cek monitor kamar tujuh. namanya masih kosong.', audio: 'ep03_penelpon_034.mp3'},
  {from: 5264, to: 5442, who: 'PENELPON', text: 'tadi saya balik ke nurse station. sekarang teleponnya bunyi lagi. keempat kalinya.', audio: 'ep03_penelpon_035.mp3'},
  {from: 5502, to: 5629, who: 'LARAS', text: 'Nadia, itu suara telepon di tempatmu ya? kamu masih di sana?', audio: 'ep03_laras_036.mp3'},
  {from: 5632, to: 5829, who: 'PENELPON', text: 'masih, mbak. saya di nurse station. telepon kamar tujuh bunyi terus, saya nggak berani angkat.', audio: 'ep03_penelpon_037.mp3'},
  {from: 5832, to: 6022, who: 'LARAS', text: 'Nadia, dengerin saya. jangan angkat. tetap di tempatmu, jangan ke kamar tujuh.', audio: 'ep03_laras_038.mp3'},
  {from: 6025, to: 6215, who: 'PENELPON', text: 'mbak... saya baru lihat monitornya. nama pasien kamar tujuh... baru berubah.', audio: 'ep03_penelpon_039.mp3'},
  {from: 6218, to: 6319, who: 'LARAS', text: 'berubah jadi apa, Nadia? kamu lihat jelas nggak?', audio: 'ep03_laras_040.mp3'},
  {from: 6322, to: 6404, who: 'PENELPON', text: 'jadi nama saya, mbak. Nadia.', audio: 'ep03_penelpon_041.mp3', whisper: true},
  {from: 6449, to: 6547, who: 'LARAS', text: 'Nadia? Nadia, kamu masih di sana?', audio: 'ep03_laras_042.mp3'},
  {from: 6550, to: 6684, who: 'WINDU', text: 'teleponnya putus. lampunya... lampunya mati semua.', audio: 'ep03_windu_043.mp3'},
  {from: 6687, to: 6761, who: 'LARAS', text: 'teruskan, kami mendengarkan.', audio: 'ep03_laras_044.mp3'},
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
export const TURN_LARAS = 6720;
export const TURN_WINDU = 6700;
/** Frame mulai judul akhir berkedip. */
export const TITLE_START = 6687;
/** Frame mulai lampu mati total (Windu: teleponnya putus, lampunya mati). */
export const BLACKOUT_START = 6550;
