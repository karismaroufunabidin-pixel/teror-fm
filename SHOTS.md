# TEROR FM EP02 — Halte Terakhir — Shot List & Hasil Cek Still

Animasi horor voxel Minecraft 3D, 9:16 vertikal 1080x1920, 30 fps,
**5461 frame / 182,03 detik**. Durasi dari audio terukur 169,76 detik
(42 MP3, 5091 frame, ffprobe) + jeda antar dialog + fade (L12), bukan
target 180 detik. Bimo, 31, sopir bus kota shift malam (voice Brian).
Penumpang naik tiap malam di halte KM 12 — tutup sejak 14 Maret 2019 —
duduk paling belakang, bayar uang lama yang lecek. Twist (berat, menggantung):
di laptop studio, kursi sopir terlihat KOSONG sementara setir berputar sendiri,
padahal Bimo bilang dia masih duduk di sana.

## Format vertikal 9:16

- Komposisi `TerorFM` 1080x1920, 30 fps (`src/shots.ts`: W=1080, H=1920).
- Wide shot (S1, P1 awal, P3 akhir, T2) memakai FOV 50-55 dan kamera ditarik
  mundur (z 7,5-10,5) supaya Laras (x=+1,7) dan Windu (x=-1,7) masuk frame.
  Close-up / OTS tetap FOV 24-38. Kalau still menunjukkan kepala terpotong,
  majukan kamera atau naikkan FOV sedikit, lalu cek still lagi.
- Area aman: HUD atas jangan mepet tepi atas, subtitle di bottom 150px,
  font 36px, max-width 88%, supaya tidak tertutup UI TikTok/Shorts.
- Subtitle: Laras ungu `#c79bff`, Windu teal `#5fd0c8`, Penelpon abu-abu
  `#bfc6d6`, font Courier New, background hitam 0,55.
- CAPTIONS dari `audio/durations.csv` (42 baris, from/to kumulatif, 0 mismatch);
  gap 3 frame antar dialog; gap khusus: telepon berdering 45f (setelah 007),
  lampu berkedip 30f (setelah 016), laptop menyala 30f (setelah 020),
  portal P1/P3 60f (caption berikutnya mulai 30f di tengah portal),
  telepon putus hening 45f (setelah 039), ekor 45f.

## Shot list (42 shot, diturunkan dari dialog — L17)

Kamera mengikuti pembicara. Saat penelpon bicara di studio, kamera ke
Laras yang mendengarkan (S4) atau ke Laras/Windu yang bicara (S2/S3).
Shot pemicu (L16): SP telepon berdering (45f), SF lampu berkedip (30f),
SL laptop menyala (30f) — ketiganya beat sendiri sebelum dialog menyebutnya.

| Shot | Frame | Detik | Isi / pembicara | Cek still |
|------|-------|-------|-----------------|-----------|
| S1 | 0–102 | 0.0–3.4 | WIDE establishing, Laras | LOLOS (f51) |
| S3a | 102–206 | 3.4–6.9 | WINDU, tepuk perut | LOLOS (f154) |
| S2a | 206–324 | 6.9–10.8 | LARAS tertawa | LOLOS (f265) |
| S3b | 324–485 | 10.8–16.2 | WINDU, mie cup diangkat–diminum | LOLOS (f404) |
| S2b | 485–567 | 16.2–18.9 | LARAS | LOLOS (f526, kamera sama S2a) |
| S3c | 567–685 | 18.9–22.8 | WINDU (Laras menulis di foreground) | LOLOS (f626, kamera sama S3a) |
| S2c | 685–812 | 22.8–27.1 | LARAS | LOLOS (f748) |
| SP | 812–857 | 27.1–28.6 | CLOSE-UP meja, telepon berdering | LOLOS (f834) |
| S3d | 857–918 | 28.6–30.6 | WINDU menunjuk telepon | LOLOS (f887, kamera sama S3a) |
| S2d | 918–1022 | 30.6–34.1 | LARAS mengangkat gagang | LOLOS (f970) |
| S4a | 1022–1169 | 34.1–39.0 | CLOSE-UP Laras mendengarkan | LOLOS (f1095) |
| S2e | 1169–1297 | 39.0–43.2 | LARAS | LOLOS (f1233) |
| S4b | 1297–1425 | 43.2–47.5 | CLOSE-UP Laras mendengarkan | LOLOS (f1361) |
| S3e | 1425–1550 | 47.5–51.7 | WINDU | LOLOS (f1487) |
| S4c | 1550–1692 | 51.7–56.4 | CLOSE-UP Laras mendengarkan | LOLOS (f1621) |
| S2f | 1692–1781 | 56.4–59.4 | LARAS | LOLOS (f1736) |
| S4d | 1781–1932 | 59.4–64.4 | CLOSE-UP Laras mendengarkan | LOLOS (f1856) |
| SF | 1932–1962 | 64.4–65.4 | CLOSE-UP lampu gantung berkedip | LOLOS (f1947) |
| S3f | 1962–2037 | 65.4–67.9 | WINDU menengadah ke lampu | LOLOS (f1999) |
| S4e | 2037–2189 | 67.9–73.0 | CLOSE-UP Laras mendengarkan | LOLOS (f2113) |
| S2g | 2189–2305 | 73.0–76.8 | LARAS | LOLOS (f2247) |
| S4f | 2305–2444 | 76.8–81.5 | CLOSE-UP Laras mendengarkan | LOLOS (f2374) |
| SL | 2444–2474 | 81.5–82.5 | CLOSE-UP laptop menyala sendiri | LOLOS (f2459) |
| S2p | 2474–2568 | 82.5–85.6 | LARAS menunjuk laptop | LOLOS (f2521) |
| S4g | 2568–2707 | 85.6–90.2 | CLOSE-UP Laras mendengarkan | LOLOS (f2637) |
| P1 | 2707–2767 | 90.2–92.2 | PORTAL zoom masuk laptop, 60f | LOLOS (f2737 tengah, f2766 akhir) |
| P2a1 | 2767–3023 | 92.2–100.8 | POV BUS kursi belakang, uang di kursi | LOLOS (f2895) |
| P2a2 | 3023–3314 | 100.8–110.5 | POV BUS kaca spion | LOLOS (f3100, f3168) |
| P2a3 | 3314–3591 | 110.5–119.7 | POV BUS berjalan kembali ke kursi sopir | LOLOS (f3452) |
| P2b | 3591–4092 | 119.7–136.4 | POV BUS setir berputar sendiri | **GAGAL parsial** (f3841) — lihat catatan |
| P2d | 4092–4381 | 136.4–146.0 | POV HALTE KM 12, pintu terbuka sendiri | LOLOS (f4236) |
| P2e | 4381–4499 | 146.0–150.0 | POV JALAN MALAM + TERMINAL | LOLOS (f4440) |
| P3 | 4499–4559 | 150.0–152.0 | PORTAL zoom keluar laptop, 60f | LOLOS (f4529 tengah, f4558 akhir) |
| S2h | 4559–4674 | 152.0–155.8 | LARAS menunjuk laptop (twist) | LOLOS (f4616) |
| S4h | 4674–4780 | 155.8–159.3 | CLOSE-UP Laras mendengarkan | LOLOS (f4727) |
| S3g | 4780–4908 | 159.3–163.6 | CLOSE-UP Windu, mata melebar | LOLOS (f4844) |
| S4i | 4908–5050 | 163.6–168.3 | CLOSE-UP Laras mendengarkan | LOLOS (f4979) |
| S6h | 5050–5095 | 168.3–169.8 | WIDE FRONTAL, hening telepon putus | LOLOS (f5072) |
| S2j | 5095–5194 | 169.8–173.1 | LARAS "Bimo? Bimo, kamu masih di sana?" | LOLOS (f5144) |
| S3h | 5194–5343 | 173.1–178.1 | WINDU, lampu mati, menoleh ke kamera | LOLOS (f5268) |
| T1 | 5343–5416 | 178.1–180.5 | CLOSE-UP laptop: kursi sopir KOSONG, setir berputar | LOLOS (f5379) |
| T2 | 5416–5461 | 180.5–182.0 | WIDE FRONTAL akhir + judul "BUS TERAKHIR TIDAK PERNAH SAMPAI" | LOLOS (f5438) |

Detail tiap shot (posisi, target, FOV, catatan) ada di `src/shots.ts`
(array `SHOTS`). Ringkasan babak:

- **Babak 1 (0–857):** S1 wide → S3a/S2a/S3b/S2b/S3c/S2c bergantian
  Laras–Windu soal mie cup dingin → SP telepon berdering → S2c/S3d/S2d
  Laras mengangkat. Windu: tepuk perut (102–203), angkat gelas mie dua
  tangan (324–380), tiup + seruput di mulut (380–430), meringis (430–482),
  letakkan + lap mulut (482–520). Laras: tertawa (206–321), menulis di
  kertas naskah dengan pulpen (567–685).
- **Babak 2 (857–2707):** S4 close-up Laras mendengarkan saat Bimo bicara
  (gagang telepon di telinga 918–2707), S2/S3 OTS saat Laras/Windu bicara.
  SF lampu berkedip 1932–1962 sebelum Windu bicara soal lampu; SL laptop
  menyala 2444–2474 sebelum Laras menunjuk laptop (S2p 2474–2568).
  Laras mengangkat satu sisi headphone saat mendengarkan (3591–3665,
  di dalam P2b).
- **Portal P1 (2707–2767):** zoom masuk laptop 60 frame, caption 023 mulai
  30 frame di tengah zoom. Tanpa fade hitam.
- **Babak 3 POV (2767–4499), tiga environment voxel lengkap:**
  - P2a1 (2767–3023) interior bus malam: Bimo membungkuk di kursi belakang,
    mengambil uang lecek dengan dua tangan, membalik-balik (2770–2919).
  - P2a2 (3023–3314) interior bus: Bimo menoleh ke kaca spion — di spion
    penumpang masih duduk, kursi kosong (refleksi diperbesar, spion 0,8 m).
  - P2a3 (3314–3591) interior bus: Bimo berjalan menyusuri lorong (z 2,0
    → −3,2) sambil lengan mengayun, penumpang pindah ke kursi tepat di
    belakang sopir (3449–3520).
  - P2b (3591–4092) interior bus: Bimo duduk di kursi sopir, setir berputar
    sendiri (wheelAngle, tangan ikut berputar + gemetar), kaki mencoba
    menginjak rem, tombol pintu merah di dashboard.
  - P2d (4092–4381) halte KM 12 lengkap: halte, papan jadwal, lampu jalan,
    jalan sepi, pohon, pagar, bus parkir — pintu terbuka sendiri
    (doorOpenT 4092–4300), tidak ada yang naik, pintu menutup lagi.
  - P2e (4381–4499) jalan malam + terminal kosong: marka jalan bergerak,
    lampu jalan, gedung terminal + 1 jendela menyala, 2 bus parkir.
- **Portal P3 (4499–4559):** zoom keluar 60 frame, caption 036 mulai
  30 frame di tengah zoom.
- **Babak 4 (4559–5461):** S2h Laras menunjuk laptop (twist), S3g Windu
  menutup mulut + mata melebar 1,75x, S6h hening telepon putus (45f),
  T1 close-up laptop — kursi sopir kosong + setir berputar sendiri
  (miniatur 8 kotak pelek + penanda merah), T2 wide frontal + judul akhir
  "BUS TERAKHIR TIDAK PERNAH SAMPAI", fade hitam 14 frame terakhir.
  Subtitle baris 042 tetap tampil saat blackout (Overlays: caption tampil
  bila `frame >= BLACKOUT_START`).

## Full animasi per aksi — bukti gerak (diff piksel antar frame)

Pasangan frame dibandingkan (mean abs diff / % piksel berubah):

| Aksi | Frame awal–akhir | Bukti |
|------|------------------|-------|
| Windu tepuk perut | 110–160 | diff 19,4 / 22,6% |
| Windu angkat mie cup → mulut | 330–405 | diff 19,0 / 19,5%; cup di mulut di f404 |
| Windu seruput → letakkan cup | 405–475 | diff 23,2 / 23,4% |
| Laras menulis + pulpen | 580–640 | diff 19,8 / 23,2% |
| Laras angkat gagang ke telinga | 930–1100 | diff 34,2 / 39,5%; gagang di telinga di f1095 |
| Laras menunjuk laptop | 2480–2540 | diff 18,7 / 23,2%; lengan terulur di f2521 |
| Bimo ambil uang di kursi belakang | 2780–2890 | diff 10,0 / 12,2%; membungkuk di f2895 |
| Bimo menoleh ke spion | 3030–3100 | diff 9,2 / 9,1%; kepala menoleh + spion di f3100 |
| Bimo berjalan di lorong | 3330–3430 | diff 22,1 / 24,3%; berjalan menjauh di f3452 |
| Penumpang pindah ke belakang sopir | 3460–3550 | diff 18,8 / 22,8% |
| Setir berputar (P2b) | 3700–3900 | diff 25,7 / 26,0% — TAPI setir tidak terbaca jelas di still (lihat catatan P2b) |
| Pintu halte buka–tutup | 4100–4200 | diff 7,9 / 7,2% — gerakan pintu kecil di frame |
| Setir twist berputar (T1, miniatur laptop) | 5350–5400 | diff 26,0 / 17,8%; cincin pelek jelas berputar di f5379 |
| Windu tutup mulut + mata melebar | 4780–4908 | f4844: lengan terangkat ke mulut, mata 1,75x |
| Windu + Laras menoleh ke kamera | 5416–5461 | f5438: Windu setengah menoleh, Laras mulai menoleh |

Tidak terbukti jelas di still (jujur dicatat, animasi ada di kode):
- Windu menunjuk telepon (857–918, pointT) — tidak ada pasangan still khusus.
- Laras angkat satu sisi headphone (3591–3665) — terjadi di dalam P2b,
  Laras tidak tampil di shot itu.
- Bimo tarik tuas rem + injak rem — pedal/kaki tersembunyi di balik
  dashboard di still P2b.
- Pintu bus halte terbuka sendiri — gerakan panel pintu kecil di frame P2d;
  bus + halte terbaca, pintu tidak terbukti jelas.

## Catatan P2b (satu-satunya shot GAGAL parsial)

Setir berputar sendiri adalah beat kunci, tapi setelah 6 ronde perbaikan
kamera, setir tetap tidak terbaca jelas di still P2b: kepala Bimo (0,4 m)
berada 0,35 m di depan setir, sehingga dari arah belakang setir selalu
tertutup tubuhnya; langit-langit bus (y 2,8) membatasi kamera dari atas;
kamera di sisi kanan (x 1,9) masuk ke dalam dinding bus (frame hitam);
close-up ketat dari belakang (z −2,85) dipenuhi kepala Bimo. Versi terbaik
yang dipertahankan: kamera lorong jauh [0, 2,6, 0,5] — Bimo dari belakang
terbaca, lengan terulur ke setir, ujung pelek + tangan mengintip di samping
kepala, dashboard di bawah. Rotasi setir ADA di kode (`wheelAngle =
(frame−3668)*0,11` + tremor, tangan ikut berputar) dan TERBUKTI di T1
(miniatur laptop: cincin pelek jelas berputar antar f5350–f5400, plus
penanda merah di pelek). Perbaikan yang mungkin di lain waktu: perbesar
setir, atau pindahkan setir lebih ke depan (z −3,9) supaya tidak tertutup
kepala dari arah belakang.

## Perbaikan framing yang dilakukan (2026-11-20)

1. Bimo menghadap terbalik (wajah ke kamera) → grup Bimo diputar 180°
   (rotation Y = PI), punggung ke kamera, lengan terulur ke setir.
2. Kamera P2a1/P2a2/P2a3 dipindah ke lorong bus (|x| ≤ 0,4) — kamera di atas
   kolom kursi (x ±0,95) tertutup sandaran kursi.
3. Lampu interior bus 18 → 35 + lampu hangat belakang (z 3,0) supaya
   punggung Bimo tidak hitam; seragam Bimo #1d3a5a → #2a4a70.
4. Cermin diperbesar 0,5 → 0,8 m, refleksi penumpang 0,22 → 0,35.
5. Kamera S4 Laras dipindah ke arah OTS S2a yang terbukti terang
   ([−2,2, 2,5, 1,6], FOV 30) — kamera lama dari +z membuat wajah gelap.
6. P2d: bus halte sempat digeser terlalu dekat (menutupi halte) → dikembalikan
   ke [−3,2, 0, 2,2], kamera mundur + FOV 50.
7. Subtitle baris 042 (T1) sempat hilang saat blackout → Overlays menampilkan
   caption bila `frame >= BLACKOUT_START`.
8. Penanda merah di pelek setir (ikut berputar) — membantu pembuktian rotasi.

## Style

- **Bentuk:** semua dari balok voxel (`src/Voxel.tsx` `Box`/`Blocks`),
  1 unit = 1 blok. Karakter proporsi Minecraft: kepala kotak 0,64.
- **Palet (jangan diubah):** dinding deepslate `#323846`, lantai kayu gelap
  `#4a3427`/`#3d2a20`, karpet marun `#5a1a26`, ON AIR merah `#ff2a1f`,
  teal booth `#3fd1c5`, lampu hangat `#ffb25a`/`#ffbe7a`, background `#030409`,
  fog `#04060c` (studio 0,04; POV malam 0,07).
- **Cahaya:** dua lampu gantung hangat (spotlight 190), fill biru dingin
  mengikuti kamera, ON AIR merah selalu menyala, glow teal booth.
  Babak 1 stabil, Babak 2 flicker pelan, portal lampu studio meredup 30%,
  POV cahaya dari lampu bus / lampu jalan, twist lampu mati total.
- **Laptop portal** di [0, 1,32, 0,3]: layar mati/redup di Babak 1-2,
  menyala saat portal aktif, miniatur kursi kosong + setir berputar di layar
  saat T1. Isi laptop HANYA visualisasi khayalan cerita Bimo, bukan video asli.
- **Post:** vignette, scanline, film grain, grading dingin, HUD REC +
  timecode mulai 03:03:12, label shot di HUD kanan atas.
- **Karakter:** Laras kulit `#dcb59b`, rambut `#1b1013`, baju ungu gelap
  `#382a45`; Windu kulit `#c28a63`, rambut `#2a1a12`, baju teal gelap
  `#21393d`. Keduanya headphone hitam aksen merah. Laras jarang takut
  (mata max 1,3x), Windu sering melebar 1,75x. Bimo seragam sopir biru
  `#2a4a70` + topi, divisualisasikan dari belakang, tanpa wajah jelas.

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
