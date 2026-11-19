# Midnight FM – Style Guide (dipelajari 2026-11-19)

Sumber: `horror-studio.zip` dan video render 18 detik yang diunggah George.
Proyek tersimpan di `~/workspace/horror-studio/` dan sudah diverifikasi
frame per frame dengan videonya. Pakai panduan ini untuk adegan baru
tanpa mengubah gaya visual.

## Format

- 18 detik, 540 frame, 30 fps.
- Komposisi kode: 1920x1080. Render yang diunggah: 1152x648, 16:9, H.264,
  tanpa trek audio di MP4.
- Dibuat full via code: Remotion 4.0.545 + @remotion/three + three.js.
  Tidak ada gambar AI. Semua gerak dari `src/shots.ts` dan `src/Studio.tsx`.

## Bentuk voxel

- Semua dari balok. 1 unit = 1 blok Minecraft.
- Karakter proporsi Minecraft: kepala kotak 0.64, badan kotak, lengan dan
  kaki kotak, flatShading, roughness 0.92-0.95, metalness 0.
- Ruangan: x -7..7, z -6..9, tinggi 5. Meja di tengah (x = 0), memanjang
  di sumbu z. Raka di x = -1.7 menghadap +x, Sari di x = +1.7 menghadap -x.
- Lantai, dinding, langit-langit, dan busa akustik dibuat dengan
  `Blocks` (instancedMesh, satu draw call). Warna tiap blok di-jitter
  sedikit supaya tidak datar.

## Palet

- Dinding deepslate abu-biru: dasar `#323846`, varian lumut `#25402f`
  dan retak `#222630`.
- Lantai kayu gelap `#4a3427` / `#3d2a20`, karpet marun `#5a1a26` / `#4a1520`.
- Aksen merah ON AIR: `#ff2a1f`, glow `#ff1208`.
- Aksen teal booth kontrol: `#3fd1c5`, glow `#0f5a58`.
- Aksen oranye hangat lampu meja: `#ffb25a` / `#ffbe7a`.
- Background `#030409`, fog `#04060c` density 0.04.
- Grading: contrast 1.12, saturate 0.85, lapisan dingin
  `rgba(8,22,42,0.28)` dengan soft-light.

## Cahaya

- Dua lampu gantung hangat sebagai key light, spotlight 190, warna
  `#ffbe7a`, dari langit-langit ke meja.
- Fill biru dingin dari arah kamera, mengikuti posisi kamera, supaya
  wajah tetap terbaca di gelap.
- Lampu merah ON AIR selalu menyala, point light merah di dinding belakang.
- Glow teal dari jendela booth di belakang Raka.
- Ambient dan hemisphere rendah. Debu beterbangan 40 partikel kecil
  warna `#ffd9a0`, hilang saat lampu mati.
- `lightLevel(frame)`: berkedip di frame 262-300, 326-342, 392-402,
  466-500, lalu mati total di frame >= 500. Handheld shake menguat
  dari frame 262.

## Karakter

- RAKA (A): kulit `#c28a63`, rambut `#2a1a12`, baju `#21393d`, rambut pendek.
- SARI (B): kulit `#dcb59b`, rambut `#1b1013`, baju `#382a45`, rambut panjang.
- Keduanya pakai headphone hitam dengan aksen merah menyala.
- Mulut: kotak gelap yang mengembang mengikuti `mouthOpen`, dihitung
  dari caption aktif per 3 frame, acak tapi deterministik.
- Mata: putih + pupil hitam. Saat takut, mata melebar 1x ke 1.75x,
  alis miring, pupil mengecil. Sari melebar di frame 298-325,
  Raka di frame 396-420.
- Napas: badan mengembang 1.2% sinusoidal. Kepala idle bergoyang pelan.
- Di akhir, keduanya menoleh ke kamera: Sari mulai frame 432,
  Raka mulai frame 448, durasi 46 frame, easing cubic in-out.

## Sosok bayangan (Listener)

- Semua hitam `#040406`, tinggi, proporsi manusia blok.
- Headphone rusak: satu cup jatuh ke bawah, miring.
- Mata: dua kotak putih menyala, tanpa wajah lain.
- Di jendela booth: muncul frame 268-424, bergerak dari x -9.4 ke -7.55,
  mendekat dan menempel ke kaca, lalu z bergeser ke 0.45.
- Di ruangan: muncul frame >= 468, melangkah mendekat z -4.7, -3.9,
  -3.2, lalu -2.7, berkedip hilang-muncul setelah frame 500.

## Set studio podcast

- Meja kayu gelap panjang, mixer dengan 18 tombol warna
  hijau/kuning/merah/biru, monitor CRT hijau `#1fe08a` yang berkedip,
  dua gelas, kertas naskah.
- Mic boom hitam di depan masing-masing penyiar.
- Tanda ON AIR: huruf piksel dari `GLYPHS`, cell 0.15, merah menyala
  dengan pulse sinusoidal, di dinding belakang atas.
- Jendela booth kontrol di dinding kiri (x = -7), di belakang Raka,
  kaca transparan opacity 0.07, bingkai hitam.
- Pintu kanan sedikit terbuka, gelap, dengan tanda merah kecil di atasnya.
- Busa akustik di dinding, pola kedalaman 0.14 / 0.32 berselang-seling.

## Kamera: 6 shot

Definisi lengkap di `src/shots.ts`, array `SHOTS`. Posisi, target, dan
FOV di-interpolasi dengan bezier ease di tiap shot, plus handheld shake.

- S1 0-120 (0-4 dtk): Wide establishing dari samping, dolly-in pelan.
- S2 120-210 (4-7 dtk): Over-the-shoulder dari belakang Raka ke Sari, tele.
- S3 210-300 (7-10 dtk): Over-the-shoulder dari belakang Sari ke Raka,
  sudut agak tinggi, jendela di belakang.
- S4 300-360 (10-12 dtk): Close-up Sari 3/4, push-in.
- S5 360-420 (12-14 dtk): High angle ke Raka dengan jendela di belakangnya.
- S6 420-540 (14-18 dtk): Wide frontal, push-in, blackout.

## Overlay dan teks

- Font: Courier New, monospace, tebal, bayangan piksel `3px 3px 0 #000`.
- HUD kiri atas: titik merah berkedip + `REC 03:03:12`, timecode naik
  1 detik per 30 frame.
- HUD kanan atas: `MIDNIGHT FM 107.3`, di bawahnya id dan label shot,
  misal `S1 · WIDE ESTABLISHING`.
- Subtitle bawah tengah, background hitam 0.55, font 40px.
  Format `<RAKA>` teal `#5fd0c8`, `<SARI>` ungu `#c79bff`, lalu teks.
  Bisikan italic dan mulut lebih pelan.
- Post: vignette radial kuat, scanline tiap 4px, film grain
  feTurbulence seed berubah tiap frame, glitch merah di frame 466-500.
- Judul akhir: `SIARAN INI BELUM SELESAI`, merah `#ff2a1f`, 64px,
  letter-spacing 10, glow merah, berkedip dari frame 506.
- Fade hitam masuk 10 frame pertama dan keluar 14 frame terakhir.

## Dialog (6 caption)

- 14-72 RAKA: Selamat malam, pendengar setia. Ini Midnight FM.
- 76-118 SARI: Jam tiga pagi. Cuma kita... dan kalian.
- 126-205 SARI: Ada pesan baru masuk. Tanpa nama pengirim.
- 214-292 RAKA: Isinya cuma satu kalimat: "Aku sudah di sini sejak tadi."
- 318-352 SARI (bisik): ...Raka.
- 364-414 RAKA: Sari? Kamu lihat apa di belakangku?

## Struktur cerita

- Tenang dulu, lalu pesan misterius, lalu eskalasi.
- Ancaman tidak pernah dijelaskan, hanya ditunjukkan: siluet di kaca,
  lalu sosok makin dekat, lalu blackout.
- Akhir menggantung, tanpa resolusi. Judul akhir menegaskan siaran
  belum selesai.

## Cara pakai untuk adegan baru

- Baca `SHOTS.md` dan `src/shots.ts` dulu.
- Tambah shot baru di array `SHOTS`, sesuaikan `DURATION`.
- Tambah caption baru di array `CAPTIONS`.
- Jangan ubah palet, font, overlay, atau proporsi karakter.
- Cek dengan still di frame tengah tiap shot sebelum render penuh:
  `npx remotion still src/index.ts HorrorStudio out/cek.png --frame=N`
- Render: `npm run render`, hasil `out/horror-studio.mp4`.
- Render memakai WebGL. Tanpa GPU, `remotion.config.ts` sudah diset
  ke `angle` (software), lebih lambat tapi tetap jalan.
