# Render EP01 TEROR FM di PC — Panduan

Paket ini berisi proyek Remotion lengkap episode EP01 "Kuburan Kosong".
Render di sini (server Muse) gagal karena memori host tinggal ~500 MB,
jadi render dipindah ke PC.

## Isi paket

- `src/` — kode Remotion, komposisi `TerorFM`
- `public/voiceover/` — 41 file MP3 voice over (Laras, Windu, Andi)
- `package.json` — Remotion 4.0.545, React 18, three.js 0.160
- `remotion.config.ts` — sudah diatur untuk render tanpa GPU
  (software WebGL `angle` + flag `enable-unsafe-swiftshader` untuk Chrome baru)

Tidak termasuk `node_modules/` (850 MB) dan `out/` (hasil still).
Keduanya dibuat ulang di PC.

## Spesifikasi video

- Judul: EP01 — Kuburan Kosong
- Resolusi: 1920x1080 landscape, 30 fps (EP01 dikecualikan dari aturan
  9:16, aturan itu berlaku mulai EP02)
- Durasi: 195 detik / 5850 frame
- Output: `out/teror-fm-ep01.mp4`, dengan audio

## Syarat PC

- Node.js 20 LTS atau 22 (cek dengan `node --version`)
- npm (ikut terpasang bersama Node.js)
- RAM 8 GB atau lebih, disk kosong ~2 GB untuk `node_modules`
- GPU tidak wajib. Kalau ada GPU, render bisa lebih cepat.

## Langkah render

1. Ekstrak zip ini ke satu folder.
2. Buka terminal di folder itu.
3. Pasang dependency (sekali saja, agak lama):

```bash
npm install
```

4. Cek cepat kalau TypeScript lolos (opsional):

```bash
npm run typecheck
```

5. Render penuh:

```bash
npm run render
```

Perintah di atas sama dengan:

```bash
npx remotion render src/index.ts TerorFM out/teror-fm-ep01.mp4
```

6. Tunggu sampai selesai. Render software per frame sekitar
   3 detik di server, di PC bisa lebih cepat atau lebih lambat
   tergantung CPU. Jangan tutup terminal selama render.
7. Hasilnya ada di `out/teror-fm-ep01.mp4`. Putar dan cek:
   durasi 195 detik, gambar 1920x1080, suara ada.

## Di Windows

- Pasang Node.js 20 LTS dari nodejs.org (installer MSI, sudah termasuk npm).
  Setelah pasang, buka PowerShell baru dan cek: `node --version` harus
  keluar v20.x.
- Simpan folder proyek di path pendek, misalnya `C:\teror-fm-ep01`,
  supaya path `node_modules` tidak kepanjangan.
- Buka PowerShell di folder itu (dari File Explorer: klik kanan di
  dalam folder, pilih "Open in Terminal"), lalu jalankan perintah
  di atas sama seperti biasa: `npm install`, lalu `npm run render`.
- Hasilnya di `out\teror-fm-ep01.mp4`. Putar dengan Movies & TV atau
  VLC untuk cek gambar dan suara.

## Kalau render gagal

- Coba dengan satu proses saja (lebih hemat memori):

```bash
npx remotion render src/index.ts TerorFM out/teror-fm-ep01.mp4 --concurrency=1
```

- Kalau Chrome tidak bisa start, pastikan Node.js versi 20 atau 22
  dan tidak ada Chrome lain yang sedang jalan.
- Kalau masih gagal, kirim pesan error terakhirnya ke Muse.
