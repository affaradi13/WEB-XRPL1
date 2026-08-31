# Website Resmi Kelas X RPL 1 — Caprice Team 26

Website resmi dan landing page dokumentasi untuk **Kelas X Rekayasa Perangkat Lunak 1 (Caprice Team 26)** — **SMK Negeri 1 Kota Probolinggo**.

---

## Fitur Utama

- **Desain Modern & Responsif**: Tampilan antarmuka glassmorphism yang bersih, elegan, dan adaptif untuk semua perangkat (ponsel, tablet, dan desktop).
- **WebCaprice 26 Multi-Page Experience**: Portal 10 halaman lengkap mencakup Beranda, Struktur Organisasi (38 siswa), Jadwal & Piket, Galeri Lightbox, Projek Showcase, Trophy Room, Buku Tamu, RPL Playground/Kuis, Kontak & FAQ, serta Portal Siswa.
- **Efek Visual Canggih**:
  - *Interactive Canvas Particle System* yang merespons kursor mouse.
  - *3D Card Tilt Effect* dinamis dengan perspektif realistis.
  - *Typewriter Animation* dengan perputaran slogan motivasi.
  - *Sound FX Synthesizer* berbasis Web Audio API murni.
  - *Custom Glow Cursor* & indikator scroll progress.
  - *5 Pilihan Warna Neon Aksen* (Indigo, Cyan, Emerald, Pink, Amber) + Dark & Light Mode.
- **Dual Runtime Backend**: Server backend dapat dijalankan menggunakan **Node.js** maupun **Python 3 murni** tanpa dependensi pihak ketiga.

---

## Struktur Halaman WebCaprice 26

1. **`WebCaprice26/index.html`** — Beranda utama, typewriter banner, ikhtisar angka kelas, dan navigation hub.
2. **`WebCaprice26/struktur.html`** — Struktur organisasi pengurus inti dan direktori 38 siswa dengan filter & pencarian interaktif.
3. **`WebCaprice26/jadwal.html`** — Jadwal pelajaran harian dengan live status tracker dan regu piket kelas.
4. **`WebCaprice26/galeri.html`** — Galeri foto dengan modal viewer Lightbox dan video reels kenangan.
5. **`WebCaprice26/proyek.html`** — Pameran hasil coding projek siswa X RPL 1 (Web, Mobile, Bot, IoT).
6. **`WebCaprice26/prestasi.html`** — Ruang piala (Trophy Room) dan timeline pencapaian kelas.
7. **`WebCaprice26/bukutamu.html`** — Dinding pesan dan buku tamu dengan reaksi emoji.
8. **`WebCaprice26/lab-game.html`** — Kuis sintaks pemrograman dengan efek suara dan live code runner.
9. **`WebCaprice26/kontak.html`** — Informasi sekolah SMKN 1 Probolinggo, peta, formulir, dan FAQ accordion.
10. **`WebCaprice26/login.html`** — Simulasi autentikasi biometrik sidik jari dan dashboard siswa.

---

## Cara Menjalankan Aplikasi

Anda dapat memilih untuk menjalankan server backend menggunakan **Node.js** atau **Python 3**.

### Opsi 1: Menggunakan Node.js
```bash
node main.js
```

### Opsi 2: Menggunakan Python 3
```bash
python3 main.py
```

Setelah server aktif, akses website di browser:
- Landing Page Root: `http://localhost:3000/`
- WebCaprice 26 Multi-Page: `http://localhost:3000/WebCaprice26/`

---

## REST API Endpoints

| Metode | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Status kesehatan server dan timestamp ISO |
| `GET` | `/api/members` | Data struktur dan daftar pengurus kelas |
| `GET` | `/api/gallery` | Data album dan dokumentasi kegiatan kelas |
| `GET` | `/api/stats` | Statistik pencapaian dan angka kelas |
| `POST` | `/api/contact` | Mengirim pesan kontak baru (`name`, `email`, `message`) |

---

## Struktur Berkas

```
Website.CapriceTeam/
├── WebCaprice26/
│   ├── index.html        # Beranda utama WebCaprice 26
│   ├── struktur.html     # Direktori 38 siswa & bagan organisasi
│   ├── jadwal.html       # Jadwal pelajaran & piket interaktif
│   ├── galeri.html       # Galeri foto & modal lightbox
│   ├── proyek.html       # Showcase portofolio coding
│   ├── prestasi.html     # Trophy room & timeline prestasi
│   ├── bukutamu.html     # Buku tamu & comment wall interaktif
│   ├── lab-game.html     # RPL Quiz game & live code sandbox
│   ├── kontak.html       # Kontak, peta lokasi & FAQ
│   ├── login.html        # Portal siswa & dashboard biometrik
│   ├── style.css         # Desain sistem visual, efek 3D & neon
│   └── main.js           # Engine interaktif, partikel & synth suara
├── index.html            # Landing page root
├── login.html            # Redirect portal login
├── style.css             # Style landing page root
├── main.js               # Backend Node.js murni
├── main.py               # Backend Python 3 murni
└── README.md             # Dokumentasi lengkap proyek
```

---

## Dibuat Oleh
**Caprice Team 26** &bull; Kelas X RPL 1 &bull; SMK Negeri 1 Kota Probolinggo.
