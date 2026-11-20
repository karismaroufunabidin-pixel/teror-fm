# TEROR FM EP01v2 — Kuburan Kosong (Remake) — Shot List & Style

Animasi horor voxel Minecraft 3D, 9:16 vertikal 1080x1920, 30 fps,
**6826 frame / 227,53 detik**. Durasi dari audio terukur 215,12 detik
(47 MP3, ffprobe) + jeda antar dialog + fade (L12), bukan target 180 detik.
Remake EP01: cerita sama, logika diperbaiki (lokasi telepon jelas di kuburan,
timeline 17 Nov malam → 19 Nov siang → 19 Nov malam gali, sosok hilang di gerbang).

## Format vertikal 9:16

- Komposisi `TerorFM` 1080x1920, 30 fps (`src/shots.ts`: W=1080, H=1920).
- Wide shot (S1, P1 awal, P3 akhir, T2) memakai FOV 50-52 dan kamera ditarik
  mundur (z 7,8-8,8) supaya Laras (x=+1,7) dan Windu (x=-1,7) masuk frame.
  Close-up / OTS tetap FOV 24-36. Kalau still menunjukkan kepala terpotong,
  majukan kamera atau naikkan FOV sedikit, lalu cek still lagi.
- Area aman: HUD atas jangan mepet tepi atas, subtitle di bottom 150px,
  font 36px, max-width 88%, supaya tidak tertutup UI TikTok/Shorts.
- Subtitle: Laras ungu `#c79bff`, Windu teal `#5fd0c8`, Penelpon abu-abu
  `#bfc6d6`, font Courier New, background hitam 0,55.

## Shot list (33 shot, diturunkan dari dialog — L17)

Kamera mengikuti pembicara. Saat penelpon bicara di studio, kamera ke
Laras/Windu yang mendengarkan. Shot pemicu (L16): SP telepon berdering
(45 frame) dan SF lampu berkedip (30 frame) — keduanya beat sendiri
sebelum dialog menyebutnya.

| Shot | Frame | Detik | Pembicara |
|------|-------|-------|-----------|
| S1 | 0–102 | 0.0–3.4 | LARAS |
| S3a | 102–211 | 3.4–7.0 | WINDU |
| S2a | 211–329 | 7.0–11.0 | LARAS |
| S3b | 329–596 | 11.0–19.9 | WINDU |
| S2b | 596–714 | 19.9–23.8 | LARAS |
| SP | 714–759 | 23.8–25.3 | - |
| S2c | 759–860 | 25.3–28.7 | LARAS |
| S4a | 860–1151 | 28.7–38.4 | PENELPON |
| S2d | 1151–1298 | 38.4–43.3 | LARAS |
| S4b | 1298–1447 | 43.3–48.2 | PENELPON |
| S2e | 1447–1558 | 48.2–51.9 | LARAS |
| S4c | 1558–1944 | 51.9–64.8 | PENELPON |
| S3c | 1944–2108 | 64.8–70.3 | WINDU |
| S4d | 2108–2281 | 70.3–76.0 | PENELPON |
| S3d | 2281–2349 | 76.0–78.3 | WINDU |
| S4e | 2349–2560 | 78.3–85.3 | PENELPON |
| SF | 2560–2590 | 85.3–86.3 | - |
| S3e | 2590–2660 | 86.3–88.7 | WINDU |
| S2f | 2660–2870 | 88.7–95.7 | LARAS |
| S4f | 2870–3344 | 95.7–111.5 | PENELPON |
| S3f | 3344–3378 | 111.5–112.6 | WINDU |
| S2g | 3378–3515 | 112.6–117.2 | LARAS |
| P1 | 3515–3575 | 117.2–119.2 | PENELPON |
| P2a | 3575–4283 | 119.2–142.8 | PENELPON,WINDU |
| P2b | 4283–5306 | 142.8–176.9 | PENELPON,WINDU |
| P2c | 5306–6180 | 176.9–206.0 | PENELPON |
| P3 | 6180–6240 | 206.0–208.0 | WINDU |
| S3g | 6240–6302 | 208.0–210.1 | WINDU |
| S2h | 6302–6432 | 210.1–214.4 | LARAS |
| S3h | 6432–6517 | 214.4–217.2 | WINDU |
| S2i | 6517–6579 | 217.2–219.3 | LARAS |
| T1 | 6579–6639 | 219.3–221.3 | - |
| T2 | 6639–6826 | 221.3–227.5 | LARAS |
| | | | |

Detail tiap shot (posisi, target, FOV, catatan) ada di `src/shots.ts`
(array `SHOTS`). Ringkasan babak:

- **Babak 1 (0–759):** S1 wide → S3a/S2a/S3b/S2b bergantian Laras–Windu soal
  kopi dingin → SP telepon berdering → S2c Laras mengangkat.
  Revisi animasi 2026-11-20: S3b Windu minum kopi (gelas krem animasi
  naik ke mulut 430–593, meringis 514–593), S2b Laras tertawa kecil
  (kepala miring + mata menyipit 596–714), S2c Laras meraih ke arah mic
  saat mengangkat (759–860, prop telepon di meja). Revisi ke-2 2026-11-20:
  gelas S3b dipindah ke sisi kamera (z −0,58, di depan lengan) + emissive
  krem supaya tidak tertutup lengan dan tidak tenggelam gelap.
- **Babak 2 (759–3515):** S4 close-up Laras mendengarkan saat Andi bicara,
  S2/S3 OTS saat Laras/Windu bicara. SF lampu berkedip di 2560–2590,
  sebelum Windu bicara soal lampu (020). Revisi animasi 2026-11-20: S3e
  Windu menengadah ke lampu (2560–2660, kepala menengadah + pupil ke atas).
- **Portal P1 (3515–3575):** zoom masuk laptop 60 frame, caption 028 mulai
  30 frame di tengah zoom. Tanpa fade hitam.
- **Babak 3 POV (3575–6180), satu mode: orang ketiga dekat:**
  - P2a (3575–4283) jalan pulang malam 17 Nov: jalan gelap + kuburan lengkap
    + gerbang + pagar + pohon + motor Andi (jaket ojol hijau redup + helm)
    + penumpang tanpa muka di belakangnya, hilang di gerbang (frame >= 4100).
  - P2b (4283–5306) kampung siang 19 Nov: seluruh kampung — rumah-rumah,
    jalan, lampu jalan mati, nisan kosong di depan tiap rumah, pintu kebuka,
    tidak ada orang/suara/lampu nyala. Cahaya siang, fog tipis (0,025).
    Andi BERJALAN di jalan (revisi animasi 2026-11-20): kaki bergantian,
    lengan mengayun, maju z 1,5 → −1,5.
  - P2c (5306–6180) kuburan malam 19 Nov: seluruh kuburan — gundukan tanah,
    sekop, pagar, pohon, cahaya bulan, lubang kosong, sosok di ujung kuburan.
    Andi MENGGALI (revisi animasi 2026-11-20): membungkuk, sekop ayun
    naik-turun (periode 120 frame), gundukan membesar; lalu membeku dan
    menoleh ke belakang saat dengar suara tanah (5986–6180).
  - P2a (3575–4283): Andi di motor — kepala tersentak saat ketokan (3545),
    menoleh ke kaca spion kiri (3823–3979, visor terang + strip helm).
- **Portal P3 (6180–6240):** zoom keluar 60 frame, caption 043 mulai
  30 frame di tengah zoom.
- **Babak 4 (6240–6826):** S3g/S2h/S3h/S2i bergantian Windu–Laras
  (S2i Laras menunjuk laptop, 6517–6579, lengan terulur diagonal + jari
  menunjuk — revisi animasi 2026-11-20; revisi ke-2 2026-11-20: lengan
  diangkat menyilang + jari di ruang lokal Host, framing S2i ditarik
  mundur FOV 27→34 supaya lengan + laptop masuk frame),
  T1 close-up jam laptop 12:01 (6579–6639, hening 60 frame, lampu mati,
  hanya ON AIR merah), T2 wide frontal + judul akhir
  "SIARAN INI BELUM SELESAI" (6639–6826), fade hitam 14 frame terakhir.

## Style

- **Bentuk:** semua dari balok voxel (`src/Voxel.tsx` `Box`/`Blocks`),
  1 unit = 1 blok. Karakter proporsi Minecraft: kepala kotak 0,64.
- **Palet (jangan diubah):** dinding deepslate `#323846`, lantai kayu gelap
  `#4a3427`/`#3d2a20`, karpet marun `#5a1a26`, ON AIR merah `#ff2a1f`,
  teal booth `#3fd1c5`, lampu hangat `#ffb25a`/`#ffbe7a`, background `#030409`,
  fog `#04060c` (studio 0,04; POV malam 0,07; POV siang 0,025).
- **Cahaya:** dua lampu gantung hangat (spotlight 190), fill biru dingin
  mengikuti kamera, ON AIR merah selalu menyala, glow teal booth.
  Babak 1 stabil, Babak 2 flicker pelan, portal lampu studio meredup 30%,
  POV cahaya dari lampu motor / bulan, twist lampu mati total.
- **Laptop portal** di [0, 1,32, 0,3]: layar mati/redup di Babak 1-2,
  menyala saat portal aktif, jam 12:01 sebagai digit piksel voxel di layar
  saat T1. Isi laptop HANYA visualisasi khayalan cerita Andi, bukan video asli.
- **Post:** vignette, scanline, film grain, grading dingin, HUD REC +
  timecode mulai 03:03:12, label shot di HUD kanan atas.
- **Karakter:** Laras kulit `#dcb59b`, rambut `#1b1013`, baju ungu gelap
  `#382a45`; Windu kulit `#c28a63`, rambut `#2a1a12`, baju teal gelap
  `#21393d`. Keduanya headphone hitam aksen merah. Laras jarang takut
  (mata max 1,3x), Windu sering melebar 1,75x.

## Menjalankan

```bash
npm run typecheck   # tsc --noEmit
npm run dev         # Remotion Studio
npx remotion still src/index.ts TerorFM out/cek.png --frame=N
# JANGAN render penuh lokal (memori host ~500 MB, Chrome gagal launch).
# Render di GitHub Actions, sesuai agent.md Langkah 6.
```

`remotion.config.ts` wajib: `Config.setChromiumOpenGlRenderer('angle')`
dan flag `enable-unsafe-swiftshader` (Chrome 158+).
