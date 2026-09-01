# Product Requirements Document (PRD)
## UI Login dengan Fitur Role Pengguna

**Dokumen:** PRD-LOGIN-ROLE-001  
**Versi:** 1.0  
**Status:** Draft untuk review stakeholder  
**Pemilik Produk:** TBD  
**Penulis:** Manus AI  
**Tanggal:** 1 September 2026  

---

## 1. Ringkasan Produk

Fitur ini menyediakan pengalaman login yang aman, sederhana, dan responsif untuk pengguna aplikasi dengan akses yang ditentukan berdasarkan **role**. Setelah autentikasi berhasil, sistem mengarahkan pengguna ke halaman atau dashboard sesuai role yang dimilikinya. UI harus memberikan umpan balik yang jelas pada setiap kondisi, termasuk kredensial salah, akun belum aktif, sesi kedaluwarsa, dan pengguna yang tidak memiliki izin.

PRD ini berfokus pada **UI dan alur pengalaman pengguna**, tetapi juga menetapkan kontrak perilaku minimum antara frontend dan backend agar implementasi role-based access control tidak hanya bergantung pada tampilan frontend.

> **Prinsip utama:** role menentukan hak akses setelah autentikasi; role tidak boleh diperlakukan sebagai pengganti proses autentikasi dan tidak boleh dipercaya hanya berdasarkan data yang dikirim dari client.

## 2. Latar Belakang dan Masalah

Tanpa alur login berbasis role yang terdefinisi dengan baik, pengguna dapat diarahkan ke halaman yang keliru, melihat menu yang tidak relevan, atau menerima pesan error yang membingungkan. Tim produk dan engineering juga berisiko memiliki interpretasi berbeda mengenai perbedaan antara pengguna yang belum login, pengguna yang sudah login tetapi tidak berizin, dan akun yang dinonaktifkan.

Solusi yang diusulkan adalah satu halaman login yang konsisten untuk semua pengguna, dengan pengambilan role dari respons autentikasi yang tervalidasi. UI menampilkan tujuan yang relevan berdasarkan role, sementara backend tetap menjadi sumber kebenaran untuk validasi hak akses.

## 3. Tujuan dan Non-Tujuan

### 3.1 Tujuan

| ID | Tujuan | Indikator keberhasilan |
|---|---|---|
| G-01 | Memungkinkan pengguna masuk menggunakan kredensial yang valid | Login berhasil dan pengguna diarahkan ke tujuan sesuai role |
| G-02 | Menampilkan pengalaman yang relevan untuk setiap role | Menu dan dashboard yang terlihat sesuai matriks akses |
| G-03 | Mengurangi kebingungan saat login gagal | Pesan error jelas, spesifik secukupnya, dan dapat ditindaklanjuti |
| G-04 | Mendukung perangkat desktop dan mobile | Layout dapat digunakan pada viewport kecil tanpa kehilangan fungsi utama |
| G-05 | Menyediakan fondasi untuk pengembangan akses berbasis role | Kontrak data role, status akun, redirect, dan unauthorized state terdokumentasi |

### 3.2 Non-Tujuan

Versi pertama tidak mencakup pendaftaran akun mandiri, pengelolaan role oleh admin, single sign-on, login sosial, multi-factor authentication, manajemen profil lengkap, atau pengaturan permission granular berbasis resource. Fitur-fitur tersebut dapat menjadi pekerjaan lanjutan.

## 4. Asumsi Produk

| Area | Asumsi |
|---|---|
| Metode login | Pengguna login menggunakan email/username dan password. |
| Role awal | Sistem memiliki tiga role contoh: **Admin**, **Manager**, dan **Staff**. Nama role dapat dikonfigurasi oleh produk. |
| Role pengguna | Satu pengguna dapat memiliki satu role utama pada fase pertama. Dukungan multi-role ditunda. |
| Status akun | Akun dapat berstatus aktif, belum terverifikasi, terkunci sementara, atau dinonaktifkan. |
| Redirect | Setiap role memiliki landing page default; pengguna yang memiliki deep link kembali ke halaman tujuan setelah login bila masih berizin. |
| Backend | Backend menyediakan endpoint autentikasi dan mengembalikan identitas pengguna, role, status sesi, serta tujuan awal atau informasi yang diperlukan frontend. |
| Branding | Logo, warna merek, nama aplikasi, dan URL bantuan disediakan oleh stakeholder. |

## 5. Persona dan Skenario Utama

### 5.1 Persona

| Persona | Kebutuhan utama | Risiko/kekhawatiran |
|---|---|---|
| Admin | Masuk ke dashboard administrasi dan mengelola konfigurasi | Akses tidak sah ke data atau menu sensitif |
| Manager | Melihat ringkasan operasional dan mengelola tim | Diarahkan ke dashboard yang salah atau melihat data di luar cakupan |
| Staff | Mengakses pekerjaan harian sesuai tanggung jawab | Proses login terlalu rumit atau pesan error tidak jelas |

### 5.2 Skenario Penggunaan

1. Pengguna membuka aplikasi dan belum memiliki sesi aktif. Sistem menampilkan halaman login.
2. Pengguna mengisi email/username dan password, lalu menekan tombol **Masuk**.
3. Sistem memvalidasi input, mengirim permintaan autentikasi, dan menampilkan status proses.
4. Jika berhasil, sistem mengambil role yang telah divalidasi dan mengarahkan pengguna ke landing page sesuai role.
5. Jika gagal, sistem mempertahankan input email/username, mengosongkan password, dan menampilkan pesan yang sesuai.
6. Jika pengguna membuka URL yang membutuhkan autentikasi, sistem menyimpan tujuan tersebut dan mengembalikan pengguna ke URL itu setelah login bila role-nya memiliki izin.

## 6. Ruang Lingkup Fitur

### 6.1 In Scope

Fitur yang termasuk dalam rilis pertama adalah halaman login, validasi field, toggle tampil/sembunyikan password, status loading, penanganan error autentikasi, tautan **Lupa password**, tautan bantuan, redirect berdasarkan role, halaman unauthorized, logout, session-expired state, serta pengaturan tampilan menu berdasarkan role.

### 6.2 Out of Scope

Pendaftaran mandiri, approval pengguna, CRUD role, permission editor, login dengan OTP, login sosial, device management, dan audit dashboard tidak termasuk rilis pertama.

## 7. Alur Pengguna

### 7.1 Alur Login Berhasil

`Buka aplikasi → Halaman login → Isi kredensial → Validasi field → Submit → Loading → Autentikasi berhasil → Ambil role tervalidasi → Redirect ke dashboard role → Tampilkan aplikasi`

### 7.2 Alur Login Gagal

`Isi kredensial → Submit → Loading → Autentikasi gagal → Tampilkan pesan error → Fokus kembali ke field yang relevan → Pengguna memperbaiki data`

### 7.3 Alur Deep Link

`Pengguna membuka halaman terlindungi → Sistem mendeteksi belum login → Simpan return URL secara aman → Redirect ke login → Login berhasil → Periksa izin role → Redirect ke return URL atau halaman unauthorized`

### 7.4 Alur Role Tidak Diizinkan

`Login berhasil → Role tervalidasi → Return URL tidak diizinkan → Tampilkan halaman unauthorized → Sediakan tombol kembali ke dashboard role`

### 7.5 Alur Sesi Kedaluwarsa

`Pengguna sedang menggunakan aplikasi → Sesi kedaluwarsa → Tampilkan notifikasi → Hapus state sensitif → Redirect ke login → Setelah login, kembali ke halaman terakhir bila masih diizinkan`

## 8. Matriks Role dan Akses Awal

| Area/fitur | Admin | Manager | Staff |
|---|---:|---:|---:|
| Dashboard umum | Ya | Ya | Ya |
| Dashboard administrasi | Ya | Tidak | Tidak |
| Manajemen pengguna | Ya | Terbatas, bila ditentukan | Tidak |
| Laporan tim | Ya | Ya | Tidak |
| Tugas pribadi | Ya | Ya | Ya |
| Pengaturan aplikasi | Ya | Tidak | Tidak |
| Profil pribadi | Ya | Ya | Ya |

Matriks di atas merupakan baseline produk. Detail permission harus dikonfirmasi sebelum implementasi final. Frontend boleh menyembunyikan menu yang tidak relevan untuk meningkatkan kejelasan, tetapi backend wajib memvalidasi setiap permintaan ke resource yang dilindungi.

## 9. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas | Kriteria ringkas |
|---|---|---|---|
| FR-01 | Sistem menampilkan halaman login untuk pengguna tanpa sesi valid | Must | Halaman dapat dibuka melalui route login dan tidak menampilkan konten terlindungi |
| FR-02 | Field email/username wajib diisi | Must | Submit tanpa nilai menampilkan validasi inline |
| FR-03 | Field password wajib diisi | Must | Submit tanpa nilai menampilkan validasi inline |
| FR-04 | Pengguna dapat melihat atau menyembunyikan password | Should | Toggle tidak mengubah nilai password |
| FR-05 | Tombol Masuk memiliki state default, loading, enabled, dan disabled | Must | Selama request berlangsung, submit ganda dicegah |
| FR-06 | Kredensial salah menghasilkan error yang dapat dipahami | Must | Password dikosongkan; identifier tetap dipertahankan |
| FR-07 | Login berhasil menghasilkan sesi dan role tervalidasi | Must | Role berasal dari respons server, bukan input bebas pengguna |
| FR-08 | Sistem melakukan redirect sesuai role | Must | Admin, Manager, dan Staff menuju landing page yang benar |
| FR-09 | Sistem menangani return URL | Should | Return URL hanya digunakan bila valid dan diizinkan |
| FR-10 | Tersedia tautan Lupa password | Should | Tautan menuju alur reset password yang ditentukan produk |
| FR-11 | Sistem menampilkan halaman unauthorized | Must | Pengguna tidak mendapat akses ke halaman di luar role-nya |
| FR-12 | Logout mengakhiri sesi | Must | Setelah logout, halaman terlindungi tidak dapat diakses melalui back navigation tanpa login |
| FR-13 | Sistem menangani sesi kedaluwarsa | Must | Pengguna diarahkan login kembali dengan konteks yang jelas |
| FR-14 | UI responsif dan dapat digunakan dengan keyboard | Must | Semua kontrol utama dapat dinavigasi tanpa mouse |
| FR-15 | Sistem mencatat event autentikasi untuk kebutuhan monitoring | Should | Event sukses, gagal, logout, dan session expired tersedia bagi sistem observability |

## 10. Spesifikasi UI/UX

### 10.1 Struktur Halaman Login

| Komponen | Spesifikasi |
|---|---|
| Brand area | Logo dan nama aplikasi, tidak mendominasi form. |
| Heading | “Masuk ke akun Anda” atau copy yang disetujui brand. |
| Identifier field | Label eksplisit, placeholder contoh, helper text opsional, dan validasi inline. |
| Password field | Label eksplisit, input tersamarkan secara default, toggle visibility, dan validasi inline. |
| Remember me | Opsional; hanya digunakan jika kebijakan sesi mendukungnya. Default tidak dicentang. |
| Primary CTA | Tombol **Masuk**, memiliki state loading dan disabled. |
| Recovery link | Tautan **Lupa password?** ditempatkan dekat field password atau CTA. |
| Help link | Tautan bantuan atau kontak support di area footer. |
| System feedback | Alert/banner untuk error server, maintenance, atau sesi kedaluwarsa. |

### 10.2 Status Komponen

| Komponen | Default | Focus | Error | Loading/Disabled |
|---|---|---|---|---|
| Input identifier | Border netral | Border brand dan focus ring | Border error, pesan inline | Tetap terbaca, dapat dinonaktifkan saat submit |
| Input password | Teks tersamarkan | Focus ring terlihat | Pesan error tanpa mengekspos password | Nilai dikosongkan jika autentikasi gagal |
| Tombol Masuk | Aktif jika input valid | Focus ring | Tidak berubah menjadi error hanya karena kredensial salah | Menampilkan indikator proses dan mencegah submit ganda |
| Alert | Tidak terlihat | N/A | Pesan singkat dan dapat ditindaklanjuti | Tidak menutup loading state tanpa alasan |

### 10.3 Responsif

Pada layar desktop, form diletakkan di area yang memiliki ruang kosong cukup dan dapat dipasangkan dengan panel ilustrasi atau informasi brand. Pada layar mobile, panel dekoratif boleh dihilangkan agar form tetap menjadi fokus utama. Ukuran target interaksi, spacing, dan focus state harus memadai untuk input sentuh dan keyboard.

### 10.4 Aksesibilitas

Setiap input harus memiliki label yang terhubung secara semantik. Error harus dapat dibaca oleh screen reader dan dikaitkan dengan field yang bermasalah. Urutan tab harus logis: identifier, password, remember me bila ada, lupa password, tombol masuk, lalu bantuan. Warna tidak boleh menjadi satu-satunya cara untuk menyampaikan error atau status. Focus indicator harus terlihat jelas.

## 11. Copy dan Pesan Sistem

| Kondisi | Pesan yang disarankan | Tindakan pengguna |
|---|---|---|
| Identifier kosong | “Masukkan email atau username.” | Isi field identifier |
| Password kosong | “Masukkan password.” | Isi field password |
| Format identifier salah | “Masukkan format email atau username yang valid.” | Perbaiki identifier |
| Kredensial tidak cocok | “Email/username atau password tidak sesuai.” | Periksa data atau gunakan lupa password |
| Akun belum aktif | “Akun Anda belum aktif. Hubungi administrator atau periksa instruksi aktivasi.” | Ikuti instruksi aktivasi |
| Akun dinonaktifkan | “Akun ini tidak dapat digunakan. Hubungi administrator.” | Hubungi support/admin |
| Terlalu banyak percobaan | “Terlalu banyak percobaan. Coba lagi nanti atau reset password.” | Tunggu atau reset password |
| Gangguan server | “Login sedang mengalami gangguan. Silakan coba lagi.” | Coba ulang beberapa saat kemudian |
| Sesi kedaluwarsa | “Sesi Anda telah berakhir. Silakan masuk kembali.” | Login kembali |
| Tidak memiliki akses | “Anda berhasil masuk, tetapi tidak memiliki akses ke halaman ini.” | Kembali ke dashboard |

Pesan untuk kredensial gagal harus menghindari pengungkapan apakah identifier tertentu terdaftar, kecuali ada keputusan keamanan dan produk yang terdokumentasi untuk menampilkan informasi lebih spesifik.

## 12. Kontrak Data dan Integrasi

### 12.1 Request

```json
{
  "identifier": "user@example.com",
  "password": "********",
  "rememberMe": false,
  "returnUrl": "/dashboard"
}
```

### 12.2 Respons Berhasil

```json
{
  "user": {
    "id": "user_123",
    "displayName": "Nama Pengguna",
    "identifier": "user@example.com",
    "role": "manager",
    "status": "active"
  },
  "redirectTo": "/manager/dashboard",
  "session": {
    "expiresAt": "2026-09-01T12:00:00Z"
  }
}
```

### 12.3 Respons Gagal

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Unable to authenticate",
    "retryable": true
  }
}
```

Frontend harus memetakan `error.code` ke copy yang sesuai tanpa menampilkan detail teknis. Bila `role`, `status`, atau `redirectTo` tidak valid, frontend harus menggunakan fallback aman dan tidak membuka halaman terlindungi.

## 13. Aturan Role dan Redirect

1. **Role diperoleh dari sumber server yang tervalidasi.** Pengguna tidak memilih role melalui dropdown pada halaman login, kecuali terdapat kebutuhan bisnis khusus yang disetujui.
2. **Setiap role memiliki default route.** Contoh: Admin menuju `/admin/dashboard`, Manager menuju `/manager/dashboard`, dan Staff menuju `/staff/dashboard`.
3. **Return URL diprioritaskan hanya jika aman dan berizin.** URL eksternal, URL dengan skema tidak dikenal, dan route yang tidak sesuai role harus ditolak.
4. **Role yang tidak dikenal menggunakan fallback aman.** Sistem tidak boleh memberikan akses; pengguna diarahkan ke halaman error atau support.
5. **Role tidak cukup untuk mengizinkan aksi.** Otorisasi resource dan action tetap harus diverifikasi pada backend.
6. **Perubahan role saat sesi aktif** harus ditangani dengan refresh session atau logout paksa sesuai kebijakan backend.

## 14. Keamanan dan Privasi

Implementasi harus menggunakan transport terenkripsi, tidak menyimpan password di storage client, dan tidak menaruh token sensitif di URL. Form harus mencegah submit ganda, serta sistem perlu memiliki rate limiting dan mekanisme penanganan percobaan login berulang. Detail error internal, stack trace, dan status sensitif tidak boleh ditampilkan kepada pengguna.

Data analitik login harus dibatasi pada informasi yang diperlukan untuk monitoring, seperti waktu, hasil, dan kode error. Password, token, dan data rahasia tidak boleh masuk ke log aplikasi maupun alat analitik frontend.

## 15. Non-Functional Requirements

| Kategori | Persyaratan |
|---|---|
| Performa | Feedback visual setelah submit harus muncul segera; halaman login harus ringan dan tidak memuat asset dekoratif yang tidak perlu. |
| Reliabilitas | Kegagalan jaringan harus menghasilkan state retry, bukan halaman kosong. |
| Kompatibilitas | Mendukung browser modern yang menjadi target aplikasi serta viewport desktop dan mobile. |
| Aksesibilitas | Memenuhi standar aksesibilitas yang disepakati tim, termasuk keyboard navigation, label semantik, dan status error yang terbaca. |
| Maintainability | Copy, daftar role, dan route default sebaiknya terkonfigurasi secara terpusat. |
| Observability | Event autentikasi diberi kode konsisten untuk debugging dan monitoring. |
| Internasionalisasi | Struktur UI memungkinkan penambahan bahasa lain tanpa memotong teks atau merusak layout. |

## 16. Kriteria Penerimaan

### 16.1 Login Dasar

- **Given** pengguna belum login, **when** membuka aplikasi, **then** pengguna melihat halaman login dan tidak melihat konten terlindungi.
- **Given** identifier dan password valid, **when** pengguna menekan Masuk, **then** tombol masuk menampilkan loading, submit ganda dicegah, sesi dibuat, dan pengguna diarahkan ke landing page role.
- **Given** identifier atau password kosong, **when** pengguna menekan Masuk, **then** request tidak dikirim dan validasi inline muncul pada field yang relevan.
- **Given** kredensial salah, **when** server menolak login, **then** pesan generik ditampilkan, identifier dipertahankan, dan password dikosongkan.

### 16.2 Role dan Otorisasi

- **Given** pengguna dengan role Admin login, **when** autentikasi berhasil, **then** pengguna diarahkan ke dashboard Admin dan dapat melihat menu yang diizinkan.
- **Given** pengguna dengan role Manager login, **when** autentikasi berhasil, **then** pengguna diarahkan ke dashboard Manager dan tidak melihat menu Admin.
- **Given** pengguna dengan role Staff login, **when** autentikasi berhasil, **then** pengguna diarahkan ke dashboard Staff dan tidak dapat membuka route Admin/Manager.
- **Given** pengguna membuka deep link yang tidak sesuai role, **when** login berhasil, **then** sistem menampilkan unauthorized atau mengarahkan ke dashboard role, bukan membuka resource tersebut.
- **Given** respons login memuat role yang tidak dikenal, **when** frontend memproses respons, **then** akses terlindungi tidak diberikan dan error aman ditampilkan.

### 16.3 Usability dan Aksesibilitas

- Semua field memiliki label yang terlihat atau label semantik yang setara.
- Pengguna dapat menyelesaikan login hanya dengan keyboard.
- Focus state terlihat pada seluruh kontrol interaktif.
- Error dapat dipahami tanpa bergantung pada warna saja.
- Layout tetap dapat digunakan pada mobile tanpa horizontal scroll.

### 16.4 Sesi

- **Given** sesi kedaluwarsa, **when** pengguna melakukan aksi berikutnya, **then** sistem menampilkan informasi sesi kedaluwarsa dan mengarahkan ke login.
- **Given** pengguna logout, **when** mencoba membuka kembali halaman terlindungi, **then** sistem meminta login kembali.

## 17. Analitik dan Monitoring

Event minimum yang direkomendasikan adalah `login_viewed`, `login_submitted`, `login_succeeded`, `login_failed`, `password_reset_clicked`, `logout_completed`, `session_expired`, dan `unauthorized_viewed`. Event tidak boleh menyertakan password, token, atau data sensitif. Atribut yang diperbolehkan mencakup kode error, role setelah login, device category, dan timestamp sesuai kebijakan privasi.

## 18. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Role hanya disembunyikan di frontend | Akses tidak sah | Backend wajib menegakkan authorization pada setiap endpoint dan resource. |
| Return URL dimanipulasi | Redirect berbahaya atau akses tidak semestinya | Validasi allowlist route internal dan periksa permission sebelum redirect. |
| Pesan error terlalu detail | Kebocoran informasi akun | Gunakan pesan generik untuk kredensial gagal. |
| Perbedaan matriks akses antar tim | Pengalaman tidak konsisten | Jadikan matriks role sebagai artefak yang disetujui bersama. |
| Sesi kedaluwarsa tanpa feedback | Pengguna kehilangan konteks | Tampilkan notifikasi, simpan return context secara aman, dan sediakan retry. |
| Login lambat atau gagal jaringan | Abandonment dan tiket support | Tampilkan loading, timeout state, retry, dan monitoring error. |

## 19. Dependensi

Implementasi bergantung pada endpoint autentikasi, mekanisme session/token, definisi role resmi, daftar default route, desain brand, copy final, kebijakan password, kebijakan session timeout, sistem reset password, serta layanan monitoring. Tim engineering dan security perlu menyepakati format error dan sumber kebenaran authorization sebelum development dimulai.

## 20. Definition of Done

Fitur dianggap selesai apabila desain UI telah disetujui, seluruh acceptance criteria lulus pada role yang didukung, alur error dan session state telah diuji, route terlindungi telah diverifikasi dari sisi backend, keyboard dan screen-reader checks dasar telah dilakukan, event monitoring telah tersedia, serta dokumentasi konfigurasi role dan redirect telah diperbarui.

## 21. Pertanyaan Terbuka

| No. | Pertanyaan | Pemilik keputusan |
|---|---|---|
| 1 | Apakah identifier login menggunakan email, username, atau keduanya? | Product/Engineering |
| 2 | Apakah satu pengguna dapat memiliki lebih dari satu role? | Product |
| 3 | Apakah role dipilih dari organisasi/tenant setelah login? | Product/Architecture |
| 4 | Apakah fitur Remember me diizinkan oleh kebijakan keamanan? | Security |
| 5 | Berapa lama sesi aktif dan bagaimana perilaku idle timeout? | Security/Engineering |
| 6 | Apakah MFA, SSO, atau login sosial direncanakan untuk fase berikutnya? | Product |
| 7 | Apa dashboard default dan route resmi untuk setiap role? | Product |
| 8 | Apakah akun belum terverifikasi dapat meminta ulang email aktivasi? | Product |
| 9 | Bahasa apa saja yang harus didukung pada rilis pertama? | Product/Design |
| 10 | Apakah login harus mendukung multi-tenant atau pemilihan workspace? | Product/Architecture |

## 22. Rekomendasi Tahap Implementasi

**Tahap pertama** adalah finalisasi matriks role, route, kontrak API, dan kebijakan sesi. **Tahap kedua** adalah pembuatan wireframe serta desain visual untuk default, error, loading, unauthorized, dan session-expired states. **Tahap ketiga** adalah implementasi frontend dan integrasi autentikasi. **Tahap keempat** adalah pengujian fungsional, responsif, aksesibilitas, keamanan, dan role boundary. **Tahap terakhir** adalah pilot terbatas, pemantauan event login, dan perbaikan berdasarkan feedback.

---

## Lampiran A — Checklist Review Stakeholder

| Area review | Status |
|---|---|
| Tujuan dan scope disetujui | ☐ |
| Daftar role disetujui | ☐ |
| Matriks akses disetujui | ☐ |
| Default route per role disetujui | ☐ |
| Copy error disetujui | ☐ |
| Kebijakan sesi disetujui | ☐ |
| Acceptance criteria disetujui | ☐ |
| Security review selesai | ☐ |
| Design review selesai | ☐ |
| QA test plan tersedia | ☐ |

## Lampiran B — Catatan Asumsi untuk Disesuaikan

Dokumen ini menggunakan **Admin, Manager, dan Staff** sebagai role contoh. Jika produk memiliki role yang berbeda, nama role, matriks akses, default route, dan acceptance criteria terkait perlu diperbarui sebelum PRD ditandai final. Nilai `redirectTo`, kode error, dan struktur session pada contoh API juga harus disesuaikan dengan arsitektur backend yang digunakan.


# 23. Spesifikasi Wireframe Halaman Login

Bagian ini menerjemahkan kebutuhan produk menjadi rancangan wireframe low-fidelity yang dapat digunakan oleh Product Designer, UI Designer, dan Frontend Engineer. Wireframe menggunakan struktur monokrom dan placeholder sederhana; keputusan warna, ilustrasi, ikon final, dan tipografi dapat ditetapkan pada tahap visual design.

## 23.1 Tujuan Wireframe

Wireframe harus memastikan bahwa pengguna memahami tiga hal secara cepat: aplikasi yang sedang diakses, informasi yang harus dimasukkan, dan tindakan yang harus dilakukan untuk masuk. Wireframe juga harus memperlihatkan bagaimana halaman bereaksi terhadap validasi, proses login, kegagalan autentikasi, dan sesi yang kedaluwarsa.

## 23.2 Artboard dan Grid

| Device | Ukuran acuan | Struktur layout | Catatan |
|---|---:|---|---|
| Desktop | 1440 × 900 px | Dua kolom: brand panel 45% dan form panel 55% | Form dipusatkan secara vertikal dan horizontal pada panel kanan. |
| Tablet | 1024 × 768 px | Dua kolom fleksibel atau satu kolom dengan brand panel ringkas | Form tidak boleh lebih sempit dari 360 px. |
| Mobile | 390 × 844 px | Satu kolom penuh | Brand panel dekoratif disembunyikan atau dipindah ke header ringkas. |
| Mobile kecil | 320 × 667 px | Satu kolom dengan spacing dipadatkan | Seluruh CTA dan tautan tetap terlihat tanpa horizontal scroll. |

Gunakan container form dengan lebar maksimum sekitar **400–440 px**. Pada desktop, area form memiliki padding internal yang cukup untuk memisahkan heading, field, CTA, dan footer. Nilai spacing final mengikuti design system produk, tetapi hierarchy dan urutan komponen pada wireframe ini tidak boleh berubah tanpa review UX.

## 23.3 Wireframe Desktop — Kondisi Default

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                              VIEWPORT 1440 × 900                              │
│                                                                              │
│  ┌───────────────────────────────┬────────────────────────────────────────┐  │
│  │                               │                                        │  │
│  │        [ LOGO / BRAND ]       │           [ LOGO MINI, opsional ]       │  │
│  │                               │                                        │  │
│  │       Selamat datang          │           Masuk ke akun Anda            │  │
│  │       di [Nama Aplikasi]      │           Gunakan kredensial Anda       │  │
│  │                               │                                        │  │
│  │   [ Ilustrasi / pesan brand ] │           Email atau username            │  │
│  │                               │           ┌────────────────────────┐   │  │
│  │   Aman. Cepat. Terorganisasi. │           │                        │   │  │
│  │                               │           └────────────────────────┘   │  │
│  │                               │                                        │  │
│  │                               │           Password                      │  │
│  │                               │           ┌────────────────────────┐   │  │
│  │                               │           │ •••••••••••••      ◉    │   │  │
│  │                               │           └────────────────────────┘   │  │
│  │                               │                                        │  │
│  │                               │           [ ] Ingat saya                │  │
│  │                               │                       Lupa password?    │  │
│  │                               │                                        │  │
│  │                               │           ┌────────────────────────┐   │  │
│  │                               │           │          MASUK           │   │  │
│  │                               │           └────────────────────────┘   │  │
│  │                               │                                        │  │
│  │                               │           Butuh bantuan? Hubungi kami  │  │
│  │                               │                                        │  │
│  └───────────────────────────────┴────────────────────────────────────────┘  │
│                    © [Nama Aplikasi] · Kebijakan Privasi · Bantuan           │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Anotasi Desktop

| ID | Elemen | Spesifikasi wireframe |
|---|---|---|
| D-01 | Brand panel | Panel kiri bersifat informatif dan dekoratif. Konten tidak boleh diperlukan untuk menyelesaikan login. |
| D-02 | Logo | Logo utama berada di bagian atas panel brand. Logo mini pada panel form bersifat opsional. |
| D-03 | Heading | Heading utama menggunakan satu level hierarki yang jelas. Subheading menjelaskan tindakan tanpa paragraf panjang. |
| D-04 | Identifier field | Label berada di atas input. Placeholder hanya memberi contoh, bukan pengganti label. |
| D-05 | Password field | Ikon tampil/sembunyikan password berada di sisi kanan dan memiliki accessible name. |
| D-06 | Remember me | Diletakkan pada baris yang sama dengan tautan lupa password pada desktop. Jika ruang sempit, tautan dapat dipindah ke baris berikutnya. |
| D-07 | CTA | Tombol Masuk memiliki lebar penuh container untuk menonjolkan aksi utama. |
| D-08 | Footer | Link bantuan, kebijakan privasi, dan informasi hak cipta memiliki hierarchy sekunder. |

## 23.4 Wireframe Mobile — Kondisi Default

```text
┌──────────────────────────────┐
│        VIEWPORT 390 × 844     │
│                              │
│  [ LOGO ]                    │
│                              │
│  Masuk ke akun Anda          │
│  Gunakan kredensial Anda     │
│                              │
│  Email atau username         │
│  ┌────────────────────────┐  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  Password                    │
│  ┌────────────────────── ◉ │  │
│  │ •••••••••••••         │  │
│  └────────────────────────┘  │
│                              │
│  [ ] Ingat saya              │
│  Lupa password?              │
│                              │
│  ┌────────────────────────┐  │
│  │          MASUK          │  │
│  └────────────────────────┘  │
│                              │
│  Butuh bantuan? Hubungi kami │
│                              │
│                              │
│  © [Nama Aplikasi]           │
│  Privasi · Bantuan           │
└──────────────────────────────┘
```

### Anotasi Mobile

Pada mobile, logo menjadi elemen header ringkas dan panel brand dekoratif dihilangkan. Form menggunakan hampir seluruh lebar viewport dengan margin horizontal konsisten. Tautan **Lupa password?** ditempatkan pada baris terpisah agar mudah disentuh. Footer diletakkan setelah konten utama dan tidak boleh menekan tombol Masuk ke area yang sulit dijangkau.

## 23.5 Wireframe State Error — Kredensial Tidak Valid

```text
┌──────────────────────────────┐
│  [ LOGO ]                    │
│                              │
│  Masuk ke akun Anda          │
│                              │
│  ┌────────────────────────┐  │
│  │ user@example.com       │  │
│  └────────────────────────┘  │
│                              │
│  Password                    │
│  ┌────────────────────────┐  │
│  │                        │  │
│  └────────────────────────┘  │
│  Email/username atau         │
│  password tidak sesuai.      │
│                              │
│  [ ] Ingat saya              │
│  Lupa password?              │
│                              │
│  ┌────────────────────────┐  │
│  │          MASUK          │  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

Pada state ini, identifier dipertahankan agar pengguna tidak perlu mengetik ulang. Password dikosongkan. Pesan error ditampilkan dekat area yang relevan dan dapat dibaca oleh screen reader. Jika error bersifat umum atau berasal dari server, gunakan alert tambahan di atas heading atau tepat di atas form.

## 23.6 Wireframe State Loading

```text
┌──────────────────────────────┐
│  Email atau username         │
│  ┌────────────────────────┐  │
│  │ user@example.com       │  │
│  └────────────────────────┘  │
│                              │
│  Password                    │
│  ┌────────────────────────┐  │
│  │ •••••••••••••          │  │
│  └────────────────────────┘  │
│                              │
│  ┌────────────────────────┐  │
│  │     [spinner] MASUK     │  │
│  └────────────────────────┘  │
│                              │
│  Mohon tunggu…               │
└──────────────────────────────┘
```

Selama loading, tombol Masuk dinonaktifkan untuk mencegah submit ganda. Field boleh dinonaktifkan sementara, tetapi nilainya harus tetap terbaca. Indikator proses harus memiliki teks alternatif atau status live yang informatif. UI tidak boleh menampilkan loading tanpa batas waktu; timeout harus menghasilkan pesan retry yang sesuai.

## 23.7 Wireframe State Akun Tidak Aktif atau Terkunci

```text
┌──────────────────────────────┐
│  [ ikon status ]              │
│  Akun belum dapat digunakan   │
│                              │
│  Akun Anda belum aktif atau   │
│  sedang dikunci sementara.   │
│                              │
│  [ Hubungi administrator ]    │
│  [ Kembali ke login ]         │
└──────────────────────────────┘
```

State ini dapat ditampilkan sebagai alert inline pada halaman login atau sebagai halaman status khusus, tergantung respons backend. CTA utama harus membantu pengguna menyelesaikan masalah, misalnya menghubungi administrator atau mengulang aktivasi. Jangan menampilkan informasi internal seperti alasan detail penguncian bila informasi tersebut sensitif.

## 23.8 Wireframe Unauthorized Setelah Login

```text
┌────────────────────────────────────────────┐
│ [ LOGO ]                         [ Profil ] │
├────────────────────────────────────────────┤
│                                            │
│              Anda tidak memiliki akses     │
│                                            │
│  Role Anda: Staff                          │
│  Halaman ini hanya tersedia untuk Admin.   │
│                                            │
│  [ Kembali ke dashboard Staff ]            │
│                                            │
└────────────────────────────────────────────┘
```

Halaman unauthorized tidak boleh memberikan petunjuk teknis mengenai endpoint atau permission internal. Informasi role pengguna boleh ditampilkan hanya jika sesuai kebijakan privasi dan tidak menambah risiko keamanan. Tombol utama mengarahkan ke dashboard default role yang telah tervalidasi.

## 23.9 Wireframe Session Expired

```text
┌──────────────────────────────┐
│  [ ikon sesi ]                │
│  Sesi Anda telah berakhir     │
│                              │
│  Silakan masuk kembali untuk  │
│  melanjutkan pekerjaan.       │
│                              │
│  [ Masuk kembali ]            │
└──────────────────────────────┘
```

Jika pengguna datang dari deep link internal, sistem dapat mempertahankan konteks halaman terakhir secara aman. Setelah login ulang, pengguna dikembalikan hanya apabila role dan permission masih mengizinkan akses tersebut.

## 23.10 Komponen dan Properti Desain

| Komponen | Properti minimum |
|---|---|
| Text input | Label, placeholder opsional, value, focus, disabled, error, helper text, autocomplete yang sesuai. |
| Password input | Semua properti text input, masking default, toggle visibility, dan autocomplete password. |
| Checkbox | Label “Ingat saya”, checked, focus, disabled, dan helper text bila diperlukan. |
| Primary button | Label, default, hover, focus, pressed, loading, disabled, dan error recovery state. |
| Inline error | Pesan singkat, ikon opsional, hubungan semantik ke field, dan status live bila diperlukan. |
| Alert | Tipe info/error, heading opsional, deskripsi, dismissible bila aman, dan CTA opsional. |
| Link | State default, hover, focus, visited bila relevan, dan target yang jelas. |
| Role badge | Hanya digunakan di area aplikasi setelah login, bukan sebagai input bebas pada halaman login. |

## 23.11 Aturan Layout dan Spacing

1. Urutan visual wajib mengikuti alur: brand atau logo, heading, identifier, password, opsi pemulihan, CTA, bantuan, lalu footer.
2. CTA utama harus memiliki kontras visual paling tinggi dibandingkan link sekunder.
3. Error tidak boleh menyebabkan layout bergeser secara ekstrem. Sediakan ruang untuk satu atau dua baris pesan error pada desain final.
4. Label tetap terlihat saat field terisi. Placeholder tidak digunakan sebagai satu-satunya label.
5. Pada mobile, tombol Masuk memiliki lebar penuh container dan berada di area yang mudah ditemukan setelah field selesai diisi.
6. Elemen dekoratif tidak boleh menutupi form, mengganggu fokus, atau meningkatkan waktu muat secara tidak perlu.

## 23.12 Spesifikasi Interaksi

| Interaksi | Respons yang diharapkan |
|---|---|
| Menekan Tab | Fokus berpindah mengikuti urutan logis dan terlihat. |
| Menekan Enter pada field | Form disubmit bila validasi dasar terpenuhi. |
| Menekan ikon visibility | Password berubah antara tersamarkan dan terlihat tanpa kehilangan cursor position bila memungkinkan. |
| Menekan Masuk | Validasi client-side berjalan, lalu request dikirim satu kali. |
| Request berhasil | Sesi disimpan sesuai kebijakan dan redirect role dijalankan. |
| Request gagal | Error dipetakan ke copy yang sesuai; field dan focus state dipulihkan. |
| Menekan Lupa password | Pengguna diarahkan ke flow reset password yang resmi. |
| Menekan Bantuan | Pengguna diarahkan ke pusat bantuan atau kanal support. |

## 23.13 Handoff untuk Desain Visual dan Engineering

Designer perlu menyediakan versi final untuk seluruh state berikut: default, focus, filled, validation error, invalid credentials, loading, network error, account inactive, session expired, unauthorized, dan responsive breakpoints. Setiap state harus memiliki spesifikasi copy, spacing, icon behavior, dan accessibility annotation.

Frontend Engineer perlu mengimplementasikan komponen form sebagai komponen yang dapat diuji secara terpisah, memisahkan validasi input dari pemetaan error server, serta mengonsumsi role dan redirect dari sumber server. QA perlu menggunakan wireframe ini sebagai referensi visual dan perilaku saat menyusun test case.

## 23.14 Checklist Validasi Wireframe

| Item | Kriteria lulus | Status |
|---|---|---|
| Hierarki halaman | Pengguna memahami judul, field, dan CTA utama | ☐ |
| Desktop | Dua kolom tidak menyebabkan form terlalu sempit | ☐ |
| Mobile | Tidak ada horizontal scroll dan CTA mudah ditemukan | ☐ |
| Error | Pesan dekat konteks, terbaca, dan tidak mengekspos data sensitif | ☐ |
| Loading | Submit ganda dicegah dan proses memiliki feedback | ☐ |
| Role | Tidak ada role selector bebas pada login; redirect berdasarkan respons tervalidasi | ☐ |
| Unauthorized | Pengguna diarahkan ke dashboard role yang sesuai | ☐ |
| Session expired | Pengguna memahami mengapa harus login kembali | ☐ |
| Keyboard | Semua kontrol dapat diakses dan fokus terlihat | ☐ |
| Handoff | Semua state dan breakpoint tersedia untuk desain final | ☐ |

## Lampiran C — Ringkasan Komponen Berdasarkan Area

| Area | Komponen | Wajib |
|---|---|---:|
| Header | Logo/nama aplikasi | Ya |
| Intro | Heading dan subheading | Ya |
| Form | Identifier input | Ya |
| Form | Password input dan toggle visibility | Ya |
| Form | Remember me | Opsional |
| Recovery | Lupa password | Disarankan |
| Action | Tombol Masuk | Ya |
| Feedback | Inline error, alert, loading state | Ya |
| Support | Link bantuan/kontak | Disarankan |
| Footer | Privasi dan copyright | Sesuai kebijakan brand |

