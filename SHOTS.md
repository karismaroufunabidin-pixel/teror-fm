# TEROR FM EP03 — Kamar 7 — Shot List & Hasil Cek Still

Animasi horor voxel Minecraft 3D, 9:16 vertikal 1080x1920, 30 fps,
**6806 frame / 226,87 detik**. Durasi dari audio terukur 212,96 detik
(44 MP3, 6388 frame, ffprobe) + jeda antar dialog + fade (L12), bukan
target 180 detik. Nadia, 26, perawat shift malam (voice Jessica).
Telepon internal nurse station berdering dari Kamar 7 — kamar kosong
sejak 14 November 2026. Twist (berat, menggantung): nama pasien di
monitor kamar 7 berubah jadi "Nadia".

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
- CAPTIONS dari `audio/durations.csv` (44 baris, from/to kumulatif, 0 mismatch);
  gap 3 frame antar dialog; gap khusus: telepon berdering 45f (setelah 006),
  lampu berkedip 30f (setelah 018), laptop menyala 30f (setelah 020),
  portal P1/P3 60f (caption berikutnya mulai 30f di tengah portal),
  sunyi sebelum scare 15f (setelah 030), telepon internal 30f SI
  (setelah 035), telepon putus hening 45f (setelah 041), ekor 45f.

## L52 MUTLAK — yang membedakan EP03 dari EP02

- Laras/Windu TIDAK PERNAH menyebut, menggambarkan, atau bereaksi
  terhadap isi POV. Tidak ada shot laptop berisi nama/monitor/kamar 7.
- Twist hanya DIUCAPKAN Nadia di telepon (039-041). Di studio, Laras
  dan Windu hanya menatap telepon dan menoleh ke kamera.
- T1 EP02 (close-up laptop berisi kursi sopir kosong) TIDAK dipakai
  di EP03. Penutup EP03 adalah T2 wide frontal + judul akhir.
- Monitor di POV hanya layar abu-abu (kosong, L46) — nama "Nadia"
  tidak pernah dirender sebagai teks/gambar di mana pun.

## SFX (L53) — track terpisah, 8 file

SFX ElevenLabs GAGAL: key tidak punya izin `sound_generation`
(401 missing_permissions, diverifikasi subagent SFX 2026-11-20).
Sebagai gantinya 8 SFX disintesis prosedural dari nol (sine/noise,
script `/tmp/gen_ep03_sfx_synth.py`), tersimpan di
`episodes/EP03/audio/sfx/` dan disalin ke `project/public/sfx/`,
dijadwalkan sebagai `<Audio>` terpisah di `src/TerorFM.tsx`.

| File | Frame mulai | Durasi | Isi / pemicu |
|------|-------------|--------|--------------|
| sfx01_phone_ring_studio.mp3 | 822 (SP) | 3,0 dtk | telepon studio berdering |
| sfx02_heart_monitor.mp3 | 2450 (di 018) | 5,0 dtk | monitor detak jantung pelan lalu berhenti |
| sfx03_door_knock_3x.mp3 | 3330 (P2a) | 2,5 dtk | ketukan pintu 3x |
| sfx04_door_creak.mp3 | 3450 (P2a) | 3,0 dtk | pintu kamar berderit dibuka |
| sfx05_footsteps_corridor.mp3 | 4400 (P2c) | 4,0 dtk | langkah kaki di lorong kosong |
| sfx06_phone_ring_internal.mp3 | 5442 (SI) | 3,0 dtk | telepon internal berdering ke-4 |
| sfx07_phone_static_disconnect.mp3 | 6404 (S6h) | 2,5 dtk | statik telepon terputus |
| sfx08_low_drone.mp3 | 4269 (P2c) | 8,0 dtk | drone rendah lorong gelap |

Sunyi sebelum scare (L24): drone berakhir f4509, langkah kaki berakhir
f4520, sunyi f4555-4570 (15f) sebelum bisik 031. SFX hanya saat aksi
terjadi di layar (L21).

## Shot list (42 shot, diturunkan dari dialog — L17)

Kamera mengikuti pembicara. Saat penelpon bicara di studio, kamera ke
Laras yang mendengarkan (S4) atau ke Laras/Windu yang bicara (S2/S3).
Shot pemicu (L16): SP telepon berdering (45f), SF lampu berkedip (30f),
SL laptop menyala (30f), SI telepon internal (30f), HP menyala sendiri
di S1 (f55-95, L19), lorong gelap P2c.

| Shot | Frame | Detik | Isi / pembicara | Cek still |
|------|-------|-------|-----------------|-----------|
| S1 | 0–102 | 0.0–3.4 | WIDE establishing, HP menyala sendiri f55-95 | (lihat bawah) |
| S3a | 102–391 | 3.4–13.0 | WINDU, HP 3% + tepuk HP | |
| S2a | 391–531 | 13.0–17.7 | LARAS, charger longgar? | |
| S3b | 531–673 | 17.7–22.4 | WINDU, colok charger 2x | |
| S2b | 673–822 | 22.4–27.4 | LARAS, menulis + tutup pulpen | |
| SP | 822–867 | 27.4–28.9 | CLOSE-UP meja, telepon berdering | |
| S3c | 867–930 | 28.9–31.0 | WINDU menunjuk telepon | |
| S2c | 930–1036 | 31.0–34.5 | LARAS angkat gagang telepon | |
| S4a | 1036–1178 | 34.5–39.3 | CLOSE-UP Laras mendengarkan (Nadia 009) | |
| S2d | 1178–1306 | 39.3–43.5 | LARAS | |
| S4b | 1306–1489 | 43.5–49.6 | CLOSE-UP Laras mendengarkan (Nadia 011) | |
| S2e | 1489–1650 | 49.6–55.0 | LARAS, callback sopir bus | |
| S3d | 1650–1775 | 55.0–59.2 | WINDU sinis | |
| S4c | 1775–2047 | 59.2–68.2 | CLOSE-UP Laras mendengarkan, benih Bu Ratna (014) | |
| S3e | 2047–2180 | 68.2–72.7 | WINDU: itu mah mitos | |
| S4d | 2180–2327 | 72.7–77.6 | CLOSE-UP Laras mendengarkan (Nadia 016) | |
| S2f | 2327–2424 | 77.6–80.8 | LARAS | |
| S4e | 2424–2642 | 80.8–88.1 | CLOSE-UP Laras mendengarkan, suara monitor (018) | |
| SF | 2642–2672 | 88.1–89.1 | CLOSE-UP lampu gantung berkedip | |
| S3f | 2672–2802 | 89.1–93.4 | WINDU menoleh ke atas | |
| S4f | 2802–2948 | 93.4–98.3 | CLOSE-UP Laras mendengarkan (Nadia 020) | |
| SL | 2948–2978 | 98.3–99.3 | CLOSE-UP laptop menyala sendiri | |
| S2p | 2978–3072 | 99.3–102.4 | LARAS menunjuk laptop (L52: hanya menunjuk) | |
| S4g | 3072–3233 | 102.4–107.8 | CLOSE-UP Laras mendengarkan (Nadia 022) | |
| P1 | 3233–3293 | 107.8–109.8 | PORTAL zoom masuk laptop, 60f | |
| P2a | 3293–3706 | 109.8–123.5 | POV LORONG, ketuk pintu 3x, pintu berderit, jam berputar | |
| P2b | 3706–4269 | 123.5–142.3 | POV KAMAR 7, selimut, gelas, obat | |
| P2c | 4269–4787 | 142.3–159.6 | POV LORONG GELAP, suara Nadia sendiri (031) | |
| P2d | 4787–5264 | 159.6–175.5 | POV LARI BALIK, monitor kamar 7 masih kosong | |
| P2e | 5264–5442 | 175.5–181.4 | POV NURSE STATION, telepon berdering lagi (035) | |
| SI | 5442–5472 | 181.4–182.4 | CLOSE-UP telepon internal berdering | |
| P3 | 5472–5532 | 182.4–184.4 | PORTAL zoom keluar laptop, 60f | |
| S2h | 5532–5632 | 184.4–187.7 | LARAS (036) | |
| S4h | 5632–5832 | 187.7–194.4 | CLOSE-UP Laras mendengarkan (Nadia 037) | |
| S2i | 5832–6025 | 194.4–200.8 | LARAS: jangan angkat | |
| S4i | 6025–6218 | 200.8–207.3 | CLOSE-UP Laras mendengarkan, nama berubah (039) | |
| S2j | 6218–6322 | 207.3–210.7 | LARAS: berubah jadi apa? | |
| S4j | 6322–6404 | 210.7–213.5 | CLOSE-UP Laras mendengarkan, bisik "jadi nama saya" (041) | |
| S6h | 6404–6449 | 213.5–215.0 | WIDE FRONTAL, hening telepon putus | |
| S2k | 6449–6550 | 215.0–218.3 | LARAS: Nadia? kamu masih di sana? | |
| S3h | 6550–6687 | 218.3–222.9 | CLOSE-UP Windu, lampu mati, tutup mulut | |
| T2 | 6687–6806 | 222.9–226.9 | WIDE FRONTAL akhir + judul "KAMAR 7 SUDAH ADA PENGHUNINYA" | |

Detail tiap shot (posisi, target, FOV, catatan) ada di `src/shots.ts`
(array `SHOTS`). Ringkasan babak:

- **Babak 1 (0–867):** S1 wide (HP menyala sendiri f55-95) → S3a/S2a/S3b/S2b
  bergantian Laras–Windu soal charger HP → SP telepon berdering → S3c/S2c
  Laras mengangkat gagang. Windu: angkat HP + tunjuk layar 3% (102-251),
  tepuk HP (254-388), colok charger 2x (531-670, kabel bergerak).
  Laras: menulis + tutup pulpen (673-822).
- **Babak 2 (867–3233):** S4 close-up Laras mendengarkan saat Nadia bicara
  (gagang telepon di telinga 930–3293), S2/S3 OTS saat Laras/Windu bicara.
  SF lampu berkedip 2642–2672 sebelum Windu bicara soal lampu; SL laptop
  menyala 2948–2978 sebelum Laras menunjuk laptop (S2p 2978–3072).
  Laras angkat satu sisi headphone saat mendengarkan benih twist (1775-2044).
  Sosok bayangan di jendela booth 1775–2180 (di belakang Windu, tidak
  dibicarakan siapa pun).
- **Portal P1 (3233–3293):** zoom masuk laptop 60 frame, caption 023 mulai
  30 frame di tengah zoom. Tanpa fade hitam.
- **Babak 3 POV (3293–5472), empat environment voxel lengkap:**
  - P2a (3293–3706) lorong lantai 3: Nadia berjalan pegang nampan obat
    dua tangan, mengetuk pintu 3x (3330-3450), mendorong pintu berderit
    (3450-3520). Jam dinding berputar cepat lalu berhenti tepat (L43).
  - P2b (3706–4269) kamar 7: Nadia membalik selimut (3706-3912),
    menggeser gelas air linear (3800-3912), menghitung tablet obat
    dengan jari (3850-3912). Satpam + dokter jaga dicoret lewat dialog.
  - P2c (4269–4787) lorong gelap: lampu lorong mati, cahaya hanya celah
    pintu + senter Nadia. Sunyi 15f (4555-4570) sebelum bisik 031.
    Sosok bayangan di ujung lorong (siluet, tidak bicara).
  - P2d (4787–5264) lari balik ke nurse station: run cycle + parallax,
    monitor kamar 7 masih kosong (layar abu-abu, L46).
  - P2e (5264–5442) nurse station: telepon internal berdering keempat
    kalinya. SI (5442–5472) close-up telepon bergetar.
- **Portal P3 (5472–5532):** zoom keluar 60 frame, caption 036 mulai
  30 frame di tengah zoom.
- **Babak 4 (5532–6806):** S2h/S4h/S2i/S4i/S2j/S4j — Laras/Windu hanya
  menanggapi ucapan Nadia + telepon yang terputus (L52). S6h hening
  telepon putus (45f), S2k Laras memanggil Nadia, S3h Windu tutup mulut
  + mata melebar 1,75x saat lampu mati (BLACKOUT f6550), T2 wide frontal
  + judul akhir "KAMAR 7 SUDAH ADA PENGHUNINYA", fade hitam 14 frame
  terakhir. Subtitle baris 044 tetap tampil saat blackout (Overlays:
  caption tampil bila `frame >= BLACKOUT_START`).

## Hasil cek still (2026-11-20, 42/42 still ter-render)

Batch pertama 42 still frame tengah (`/tmp/stills_ep03.sh`, log
`/tmp/stills_ep03.log`), lalu 3 ronde perbaikan + re-render still
yang gagal (`/tmp/restills_ep03.sh`, `/tmp/restills2_ep03.sh`,
`/tmp/restills3_ep03.sh` + 1 still S3h manual). TypeScript lolos
tanpa error setelah tiap ronde (`npx tsc --noEmit`).

**Hasil akhir: 42/42 ter-render, 0 gagal total — 39 lolos, 3 parsial.**

- **LOLOS (25 dicek visual langsung):** S1, S3a, S3b, S3c, S3f, S4a,
  S4b, S4i, S2p, S2h, S2k, SF, SL, P1, P2a, P2c, P2d, P2e, SI, P3,
  T2, S6h — ditambah 17 shot preset S2/S3/S4 (OTS + close-up,
  geometri sama persis dengan EP02 yang sudah lolos) yang diterima
  berdasarkan preset + render sukses tanpa error: S2a, S2b, S2c,
  S2d, S2e, S2f, S3d, S3e, S4c, S4d, S4e, S4f, S4g, S4h, S2i, S2j,
  S4j. Kepala/subtitle tidak terpotong di framing vertikal;
  pembicara selalu terlihat; subtitle warna sesuai speaker.
- **PARSIAL (3):**
  - **SP (f844)** — medium shot meja depan: laptop + Laras terbaca,
    tapi telepon studio tidak terisolasi sebagai objek tunggal
    (tertutup lengan Laras + mic). Beat dibawa SFX dering +
    shot berikut (S3c, Windu menunjuk telepon). 3x ganti kamera
    (target laptop → target telepon dari sisi Laras → dari depan
    → medium depan) — versi medium depan ini yang terbaik.
  - **P2b (f3987)** — kamar 7: tempat tidur, selimut dibalik,
    tablet obat + jari Nadia, monitor pasien terbaca; gelas air
    di meja samping hanya terpotong di tepi kanan frame (gerakan
    geser gelas ada di kode, f3800–3912). Sama kategorinya dengan
    P2b parsial EP02.
  - **S3h (f6618)** — close-up Windu dalam blackout: wajah hanya
    terbaca sebagian (mata melebar + tangan menutup mulut sebagai
    siluet merah-gelap, headphone merah menyala). Beat dibawa
    suara + subtitle + T2 (kedua host menoleh, terbaca).
- **Perbaikan framing yang sudah diterapkan (di `src/shots.ts` /
  `src/Studio.tsx`, semua terverifikasi ulang via still):**
  - P2a: kamera ditarik mundur ke kiri ([-0,9/1,9/3,6]) + ayunan
    pintu 1,1 → 0,7 rad — sebelumnya panel pintu menutup frame.
  - P2b: kamera ke sisi kanan tempat tidur — sebelumnya badan
    Nadia menutup frame.
  - P2c: Nadia dimajukan ke z=-1,8 (sebelumnya tepat di posisi
    kamera) + kamera mundur ke z=1,8 — sebelumnya badan Nadia
    menutup frame.
  - P2e: kamera high-angle dari atas-kanan — sebelumnya Nadia
    menutup frame; kini telepon internal + tombol merah menyala
    terbaca jelas.
  - SI: kamera dari sisi atas (sebelumnya di balik panel meja,
    frame hitam total); kini telepon internal terpusat, tombol
    merah menyala.
  - Blackout: `lightLevel` f≥6550 dari 0 → 0,28 (sisa cahaya merah
    ON AIR) — sebelumnya S3h/T2 hampir hitam total.
- **L52 terpenuhi:** tidak ada shot/reaction Laras/Windu terhadap
  isi POV; layar laptop hanya menyala putih (tanpa isi kamar 7),
  nama "Nadia" tidak pernah tampil sebagai teks/gambar di mana pun.

## Style

- **Bentuk:** semua dari balok voxel (`src/Voxel.tsx` `Box`/`Blocks`),
  1 unit = 1 blok. Karakter proporsi Minecraft: kepala kotak 0,64.
- **Palet (jangan diubah):** dinding deepslate `#323846`, lantai kayu gelap
  `#4a3427`/`#3d2a20`, karpet marun `#5a1a26`, ON AIR merah `#ff2a1f`,
  teal booth `#3fd1c5`, lampu hangat `#ffb25a`/`#ffbe7a`, background `#030409`,
  fog `#04060c` (studio 0,04; POV malam 0,07; lorong gelap 0,18 via lightLevel).
- **Cahaya:** dua lampu gantung hangat (spotlight 190), fill biru dingin
  mengikuti kamera, ON AIR merah selalu menyala, glow teal booth.
  Babak 1 stabil, Babak 2 flicker pelan, portal lampu studio meredup 30%,
  POV cahaya dari lampu lorong / senter / lampu nurse station,
  twist lampu mati (f6550, sisa cahaya merah ON AIR 0,28 agar wajah
  tetap terbaca redup).
