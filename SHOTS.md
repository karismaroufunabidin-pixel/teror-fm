# Midnight FM – Style & Shot List

Animasi horor 18 detik (1920×1080, 30 fps, 540 frame), gaya voxel Minecraft 3D, palet gelap.
Semua kamera, lampu, dan animasi karakter dikendalikan dari kode (Remotion + three.js).

## Style

- **Bentuk**: semua dari balok (1 unit = 1 blok). Karakter proporsi Minecraft: kepala kotak, badan kotak, lengan dan kaki kotak.
- **Palet**: abu-biru gelap (dinding deepslate), kayu gelap, karpet merah marun. Aksen: merah (ON AIR), teal (booth kontrol), oranye hangat (lampu meja).
- **Cahaya**: dua lampu gantung hangat sebagai key light, fill biru dingin dari arah kamera, glow teal dari jendela booth, lampu merah ON AIR yang selalu menyala.
- **Post**: vignette, scanline, film grain, grading dingin, HUD kamera REC + timecode, subtitle gaya chat Minecraft.
- **Tempat**: studio podcast kecil. Meja panjang di tengah, dua penyiar berhadapan, mic boom, mixer, monitor CRT, busa akustik, jendela booth di belakang Raka, pintu sedikit terbuka di belakang Sari.

## Shot list

| Shot | Frame | Detik | Kamera | Aksi |
|------|-------|-------|--------|------|
| S1 | 0–119 | 0–4 | Wide establishing dari samping, dolly-in pelan | Raka dan Sari berprofil, siaran dibuka. Suasana tenang. |
| S2 | 120–209 | 4–7 | Over-the-shoulder dari belakang Raka ke Sari, tele | Sari bicara soal pesan tanpa nama pengirim. |
| S3 | 210–299 | 7–10 | Over-the-shoulder dari belakang Sari ke Raka, sudut agak tinggi | Lampu mulai berkedip. Siluet tinggi muncul di kaca booth di belakang Raka. |
| S4 | 300–359 | 10–12 | Close-up Sari 3/4, push-in | Sari berhenti bicara, mata melebar, berbisik "...Raka." |
| S5 | 360–419 | 12–14 | High angle ke Raka dengan jendela di belakangnya | Raka tidak sadar. Sosok ber-headphone rusak mendekat dan menempel ke kaca. |
| S6 | 420–539 | 14–18 | Wide frontal, push-in | Kedua penyiar menoleh ke kamera. Lampu mati, tinggal ON AIR merah. Mata putih muncul makin dekat di belakang meja. Fade ke hitam. |

Definisi shot ada di `src/shots.ts` (array `SHOTS`): posisi kamera awal/akhir, target, FOV, dan catatan. Ubah angkanya untuk menggeser framing.

## Struktur kode

| File | Isi |
|------|-----|
| `src/shots.ts` | Durasi, daftar shot kamera, kedip lampu, subtitle, gerak mulut |
| `src/Studio.tsx` | Ruangan voxel, meja, mic, penyiar, sosok bayangan, lampu |
| `src/Voxel.tsx` | Helper blok (`Box`) dan blok instancing (`Blocks`) |
| `src/Overlays.tsx` | Vignette, grain, HUD, subtitle, judul akhir, fade |
| `src/HorrorStudio.tsx` | Komposisi utama (ThreeCanvas + overlay) |

## Menjalankan

```bash
npm install
npm run dev       # Remotion Studio, scrub timeline di browser
npm run render    # out/horror-studio.mp4 (1920x1080)
```

Render memakai WebGL. Di mesin tanpa GPU, `remotion.config.ts` sudah diset ke `angle` (software), jadi lebih lambat tapi tetap jalan.

## Prompt untuk opencode

Taruh folder ini di workspace opencode, lalu pakai prompt seperti:

> Baca SHOTS.md dan src/shots.ts. Pakai style dan komposisi yang sudah ada (voxel Minecraft 3D, studio podcast gelap, dua penyiar berhadapan). Tambahkan adegan baru setelah S6: [deskripsi adegan]. Tambahkan shot baru di array SHOTS dan sesuaikan DURATION. Jangan ubah gaya visual. Cek hasilnya dengan `npx remotion still src/index.ts HorrorStudio out/cek.png --frame=N` sebelum render penuh.

Tips: render still di frame tengah tiap shot dulu, baru render video penuh.
