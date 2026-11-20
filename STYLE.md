# TEROR FM EP03 — Kamar 7 — STYLE

Gaya visual TEROR FM, sumber `~/workspace/teror-fm/style.md` dan
`~/workspace/horror-studio/STYLE.md`. Jangan ubah gaya ini.

## Format

- 9:16 vertikal, 1080x1920, 30 fps. Durasi 6806 frame / 226,87 detik
  (dari audio terukur, L12).
- Full via kode: Remotion 4.0.545 + @remotion/three + three.js.
  Jangan buat dari create image. Jangan pakai gambar AI.
- Framing vertikal: utamakan close-up dan medium; wide hanya pembuka,
  portal, dan penutup, dengan FOV 50-52 + kamera mundur supaya kedua
  penyiar masuk frame tanpa kepala terpotong.
- Area aman vertikal: HUD atas dan subtitle bawah dijaga dari tepi
  (subtitle bottom 150px, font 36px, max-width 88%).

## Palet — jangan diubah

- Dinding deepslate abu-biru `#323846`, varian lumut `#25402f`, retak `#222630`.
- Lantai kayu gelap `#4a3427` / `#3d2a20`, karpet marun `#5a1a26` / `#4a1520`.
- Aksen merah ON AIR `#ff2a1f`, glow `#ff1208`.
- Aksen teal booth `#3fd1c5`, glow `#0f5a58`.
- Aksen oranye hangat lampu meja `#ffb25a` / `#ffbe7a`.
- Background `#030409`, fog `#04060c` (studio 0,04; POV malam 0,07; POV siang 0,025).
- Grading: contrast 1,12, saturate 0,85, lapisan dingin `rgba(8,22,42,0,28)`.
- Subtitle: Laras ungu `#c79bff`, Windu teal `#5fd0c8`, Penelpon abu-abu `#bfc6d6`.

## Set studio podcast

Ruangan sama seperti base: meja di tengah, Windu x=-1,7, Laras x=+1,7,
mixer 18 tombol, monitor CRT hijau, dua gelas, kertas naskah, mic boom,
jendela booth di dinding kiri, pintu kanan sedikit terbuka, tanda TEROR FM
piksel merah di dinding belakang atas.

Laptop di tengah meja [0, 1,32, 0,3] adalah portal ke POV penelpon.
Layar mati/redup di Babak 1-2, menyala saat portal aktif, jam 12:01
sebagai digit piksel voxel di layar saat twist (T1). Isi laptop HANYA
visualisasi khayalan cerita Andi, bukan video asli dari penelpon (L3).

## Set POV penelpon (L18 — environment lengkap tiap adegan)

- P2a jalan pulang malam 17 Nov: jalan gelap + kuburan lengkap (barisan
  nisan, gerbang, pagar, pohon) + motor Andi + penumpang tanpa muka.
  Cahaya hanya lampu motor, fog pekat.
- P2b kampung siang 19 Nov: seluruh kampung — rumah-rumah, jalan, lampu
  jalan mati, nisan kosong di depan tiap rumah, pintu kebuka, tidak ada
  orang, tidak ada suara/lampu nyala. Cahaya siang, fog tipis.
- P2c kuburan malam 19 Nov: seluruh kuburan — gundukan tanah, sekop,
  pagar, pohon, cahaya bulan, lubang kosong yang digali Andi, sosok di
  ujung kuburan. Fog pekat.
- Sosok yang dilihat penelpon: siluet hitam `#040406`, mata putih kalau
  perlu, tanpa wajah jelas. Jangan beri dia dialog.
- Jangan tampilkan Laras dan Windu di POV, kecuali suara mereka.

## Karakter visual

- Laras: kulit `#dcb59b`, rambut panjang `#1b1013`, baju ungu gelap `#382a45`.
- Windu: kulit `#c28a63`, rambut pendek `#2a1a12`, baju teal gelap `#21393d`.
- Keduanya pakai headphone hitam aksen merah. Mulut kotak gelap, mengembang
  mengikuti `mouthOpen`. Mata putih + pupil hitam; Windu melebar sampai
  1,75x saat takut, Laras max 1,3x.

## Overlay dan teks

- Font Courier New, monospace, tebal, bayangan piksel `3px 3px 0 #000`.
- HUD kiri atas: titik merah berkedip + `REC 03:03:12`, timecode naik
  1 detik per 30 frame. HUD kanan atas: `TEROR FM` + id dan label shot.
- Subtitle bawah tengah, background hitam 0,55, font 36px.
  Format `<LARAS>` / `<WINDU>` / `<PENELPON>` + teks bersih (tanpa tag
  ekspresi, tanpa [whispers]/[laughs]).
- Post: vignette radial kuat, scanline tiap 4px, film grain, glitch merah
  di momen twist berat.
- Judul akhir: teks merah `#ff2a1f`, 48px, letter-spacing 6, glow merah,
  berkedip: `SIARAN INI BELUM SELESAI`. Lalu fade hitam 14 frame terakhir.
