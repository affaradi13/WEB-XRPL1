# Product Requirements Document (PRD)

## Fitur Middleware Berbasis Role untuk Dashboard Website

**Versi:** 1.0  
**Status:** Final untuk review lintas tim  
**Pemilik dokumen:** Manus AI  
**Tanggal:** 1 September 2026  

> **Ringkasan:** Fitur ini menyediakan kontrol akses berbasis role melalui middleware sehingga setiap pengguna hanya dapat mengakses dashboard, halaman, menu, dan aksi yang sesuai dengan kewenangannya.

---

## 1. Latar Belakang

Website membutuhkan mekanisme terpusat untuk memvalidasi identitas dan hak akses pengguna sebelum permintaan diteruskan ke halaman atau API. Tanpa middleware yang konsisten, aplikasi berisiko menampilkan menu yang tidak relevan, mengizinkan akses langsung melalui URL, atau membuka endpoint penting kepada pengguna yang tidak berwenang.

Fitur ini akan menerapkan **role-based access control (RBAC)** pada seluruh route dashboard dan endpoint terkait. Setelah login, pengguna diarahkan ke dashboard sesuai role-nya. Middleware harus memvalidasi autentikasi, status akun, role, permission, serta konteks akses bila diperlukan.

### 1.1 Asumsi Produk

PRD ini menggunakan struktur role generik yang dapat disesuaikan dengan domain bisnis. Role awal yang digunakan adalah **Super Admin, Admin, Operator, dan Viewer**. Satu pengguna dapat memiliki satu atau lebih role apabila kebutuhan bisnis mengharuskannya, tetapi MVP menggunakan satu role utama agar implementasi dan audit lebih sederhana.

| Role | Tujuan utama | Dashboard default |
|---|---|---|
| Super Admin | Mengelola seluruh sistem, pengguna, role, permission, dan konfigurasi | `/dashboard/super-admin` |
| Admin | Mengelola operasional dan data bisnis sesuai cakupan organisasi | `/dashboard/admin` |
| Operator | Menjalankan proses operasional harian tanpa mengubah konfigurasi kritis | `/dashboard/operator` |
| Viewer | Melihat data dan laporan tanpa mengubah data | `/dashboard/viewer` |

---

## 2. Tujuan dan Sasaran

### 2.1 Tujuan

Fitur ini bertujuan menyediakan satu lapisan middleware yang aman, konsisten, mudah diuji, dan mudah dikembangkan untuk mengatur akses pengguna ke berbagai dashboard website.

### 2.2 Sasaran Keberhasilan

| Sasaran | Target MVP |
|---|---:|
| Route terproteksi tanpa autentikasi | 100% route dashboard dan API privat |
| Pengguna diarahkan ke dashboard sesuai role | ≥ 99% kasus valid |
| Akses ke route yang tidak diizinkan menghasilkan respons yang benar | 100% pengujian permission |
| Perubahan role diterapkan setelah sesi diperbarui | Maksimal 5 menit atau pada request berikutnya setelah token direfresh |
| Tersedianya audit log untuk keputusan akses kritis | 100% penolakan akses dan perubahan role |
| Tidak ada akses data lintas organisasi tanpa permission | 0 kasus pada pengujian keamanan |

### 2.3 Non-Goals MVP

MVP tidak mencakup attribute-based access control yang kompleks, workflow approval bertingkat, impersonasi pengguna, sinkronisasi role dari identity provider eksternal, atau kebijakan akses berbasis lokasi/perangkat. Kemampuan tersebut dapat direncanakan sebagai fase lanjutan.

---

## 3. Ruang Lingkup

### 3.1 Termasuk dalam Scope

Fitur yang termasuk adalah validasi sesi login, pemeriksaan role pada route, pemeriksaan permission pada aksi, pengalihan ke dashboard default, halaman unauthorized dan forbidden, perlindungan route server-side/API, penyembunyian menu berdasarkan permission, pengelolaan role dasar oleh Super Admin, serta pencatatan audit untuk aktivitas keamanan.

### 3.2 Di Luar Scope

Pengembangan modul bisnis di dalam setiap dashboard bukan bagian utama fitur middleware. Modul tersebut hanya digunakan sebagai contoh resource untuk mendefinisikan permission dan acceptance criteria.

---

## 4. Persona dan User Story

| Persona | Kebutuhan |
|---|---|
| Super Admin | Sebagai Super Admin, saya ingin mengatur role dan permission agar akses seluruh pengguna dapat dikendalikan dari satu tempat. |
| Admin | Sebagai Admin, saya ingin melihat ringkasan operasional dan mengelola data bisnis yang menjadi tanggung jawab saya. |
| Operator | Sebagai Operator, saya ingin mengerjakan tugas harian tanpa dapat mengubah pengaturan sistem yang kritis. |
| Viewer | Sebagai Viewer, saya ingin melihat dashboard dan laporan tanpa risiko mengubah data. |
| Pengguna belum login | Sebagai pengguna yang belum login, saya ingin diarahkan ke halaman login ketika membuka halaman privat. |
| Auditor/Owner | Sebagai pemilik sistem, saya ingin melihat jejak keputusan akses dan perubahan role untuk keperluan audit. |

---

## 5. Definisi Role dan Permission

Role adalah kumpulan permission. Middleware tidak boleh hanya mengandalkan nama halaman atau komponen frontend; keputusan akses wajib dilakukan pada layer server atau API.

### 5.1 Permission MVP

| Resource | Permission | Super Admin | Admin | Operator | Viewer |
|---|---|---:|---:|---:|---:|
| Dashboard | `dashboard.view` | Ya | Ya | Ya | Ya |
| User | `user.view` | Ya | Ya | Tidak | Tidak |
| User | `user.create` | Ya | Terbatas | Tidak | Tidak |
| User | `user.update` | Ya | Terbatas | Tidak | Tidak |
| User | `user.delete` | Ya | Tidak | Tidak | Tidak |
| Role | `role.view` | Ya | Tidak | Tidak | Tidak |
| Role | `role.manage` | Ya | Tidak | Tidak | Tidak |
| Data bisnis | `data.view` | Ya | Ya | Ya | Ya |
| Data bisnis | `data.create` | Ya | Ya | Ya | Tidak |
| Data bisnis | `data.update` | Ya | Ya | Ya | Tidak |
| Data bisnis | `data.delete` | Ya | Terbatas | Tidak | Tidak |
| Laporan | `report.view` | Ya | Ya | Ya | Ya |
| Laporan | `report.export` | Ya | Ya | Terbatas | Tidak |
| Pengaturan | `settings.view` | Ya | Terbatas | Tidak | Tidak |
| Pengaturan | `settings.manage` | Ya | Tidak | Tidak | Tidak |
| Audit log | `audit.view` | Ya | Terbatas | Tidak | Tidak |

Keterangan **Terbatas** berarti akses dibatasi oleh organisasi, cabang, project, atau scope data yang diberikan kepada pengguna. Detail pembatasan scope harus ditentukan oleh aturan bisnis masing-masing modul.

---

## 6. Kebutuhan Fungsional

### FR-01 — Validasi autentikasi

Middleware harus memeriksa keberadaan dan validitas sesi atau token sebelum pengguna mengakses route privat. Pengguna yang belum login diarahkan ke `/login` untuk request halaman dan menerima status `401 Unauthorized` untuk request API.

### FR-02 — Validasi status akun

Middleware harus menolak akses bagi akun yang berstatus nonaktif, ditangguhkan, dihapus, atau belum memenuhi verifikasi wajib. Status tersebut tidak boleh hanya ditentukan dari data frontend.

### FR-03 — Resolusi role dan permission

Setelah autentikasi valid, sistem mengambil role dan permission efektif pengguna. Permission dapat berasal dari role, namun permission eksplisit yang dicabut atau dibatasi harus mengikuti kebijakan prioritas yang disepakati. Untuk MVP, sistem menggunakan role utama dan daftar permission yang telah dihitung pada server.

### FR-04 — Pengarahan dashboard berdasarkan role

Setelah login, pengguna diarahkan ke dashboard default sesuai role. Jika pengguna memiliki lebih dari satu role, sistem menggunakan dashboard default yang dikonfigurasi atau meminta pengguna memilih konteks role.

| Kondisi | Perilaku |
|---|---|
| Belum login | Redirect ke `/login` atau respons `401` untuk API |
| Login valid dengan role aktif | Redirect ke dashboard default role |
| Role tidak dikenali | Tampilkan halaman error dan catat insiden |
| Akun nonaktif | Tampilkan halaman akun tidak aktif |
| Tidak memiliki permission route | Tampilkan `403 Forbidden` |
| Resource tidak ditemukan | Tampilkan `404 Not Found` tanpa membocorkan keberadaan resource privat |

### FR-05 — Proteksi route dashboard

Route harus mendeklarasikan persyaratan akses secara eksplisit, misalnya `requiredRole`, `requiredPermission`, atau kombinasi keduanya. Middleware menolak request sebelum halaman atau data privat dirender.

Contoh konfigurasi konseptual:

```ts
{
  path: "/admin/users",
  requiredPermission: "user.view",
  requiredScope: "organization"
}
```

### FR-06 — Proteksi endpoint API

Setiap endpoint privat harus menerapkan pemeriksaan autentikasi dan permission. Pemeriksaan frontend hanya berfungsi sebagai pengalaman pengguna dan tidak dianggap sebagai kontrol keamanan.

### FR-07 — Visibilitas menu dan aksi

Menu, tombol, dan aksi yang tidak diizinkan harus disembunyikan dari UI berdasarkan permission efektif. Namun, endpoint tetap wajib menolak request apabila pengguna mencoba mengaksesnya secara langsung.

### FR-08 — Halaman akses ditolak

Sistem harus menyediakan halaman `401`, `403`, dan akun nonaktif dengan pesan yang jelas, tanpa menampilkan detail permission internal, token, atau informasi sensitif.

### FR-09 — Manajemen role oleh Super Admin

Super Admin dapat melihat role, menambah atau memperbarui permission role, mengatur dashboard default, mengaktifkan atau menonaktifkan role, serta melihat riwayat perubahan. Penghapusan role yang masih digunakan harus dicegah atau memerlukan migrasi pengguna terlebih dahulu.

### FR-10 — Perubahan role pengguna

Ketika role pengguna berubah, akses efektif harus diperbarui pada request berikutnya setelah cache/session invalidation atau token refresh. Sistem harus mencatat siapa yang melakukan perubahan, role sebelum dan sesudah, waktu, serta alasan perubahan bila diwajibkan.

### FR-11 — Audit log

Sistem mencatat login gagal, penolakan akses, perubahan role, perubahan permission, perubahan status akun, dan aktivitas administratif kritis. Log minimal mencakup actor, target, action, hasil, timestamp, request ID, dan metadata keamanan yang tidak sensitif.

### FR-12 — Cakupan data

Untuk role dengan akses terbatas, middleware atau service authorization harus meneruskan scope pengguna ke lapisan data. Pengguna tidak boleh memperoleh data organisasi atau cabang lain hanya dengan mengubah parameter URL atau request body.

---

## 7. Alur Utama

### 7.1 Alur Login dan Redirect

1. Pengguna mengirimkan kredensial ke endpoint login.
2. Sistem memvalidasi kredensial dan status akun.
3. Sistem membuat sesi/token dan memuat role serta permission efektif.
4. Sistem mencatat login berhasil.
5. Sistem mengarahkan pengguna ke dashboard default role.
6. Jika dashboard default tidak tersedia, sistem mengarahkan ke halaman fallback yang aman dan mencatat konfigurasi yang bermasalah.

### 7.2 Alur Akses Route Privat

1. Request masuk ke middleware.
2. Middleware memvalidasi sesi/token.
3. Middleware mengambil identitas, status akun, role, permission, dan scope.
4. Middleware mencocokkan persyaratan route dengan akses pengguna.
5. Jika valid, request diteruskan.
6. Jika tidak valid, sistem mengembalikan `401` atau `403`, menyembunyikan detail sensitif, dan mencatat audit log untuk kasus yang relevan.

### 7.3 Alur Perubahan Role

1. Super Admin membuka pengelolaan pengguna.
2. Sistem memvalidasi permission `user.update` atau permission administratif yang sesuai.
3. Super Admin memilih role baru dan mengonfirmasi perubahan.
4. Sistem memvalidasi bahwa role baru aktif dan tidak melanggar aturan organisasi.
5. Sistem menyimpan perubahan dalam transaksi atomik.
6. Sistem menginvalidasi cache/sesi yang terkait.
7. Sistem mencatat audit log dan menampilkan hasil perubahan.

---

## 8. Spesifikasi Route Dashboard

| Area | Route | Akses minimum | Fungsi utama |
|---|---|---|---|
| Super Admin | `/dashboard/super-admin` | `dashboard.view` + role Super Admin | Ringkasan sistem, user, role, konfigurasi, audit |
| Admin | `/dashboard/admin` | `dashboard.view` + role Admin | Ringkasan operasional dan manajemen data bisnis |
| Operator | `/dashboard/operator` | `dashboard.view` + role Operator | Tugas, antrean proses, dan pembaruan operasional |
| Viewer | `/dashboard/viewer` | `dashboard.view` + role Viewer | Ringkasan, laporan, dan data read-only |
| Pengelolaan pengguna | `/admin/users` | `user.view` | Daftar dan detail pengguna |
| Role dan permission | `/admin/roles` | `role.view` | Konfigurasi role dan permission |
| Audit log | `/admin/audit-logs` | `audit.view` | Riwayat aktivitas keamanan dan administratif |

---

## 9. Kebutuhan Nonfungsional

| Area | Persyaratan |
|---|---|
| Keamanan | Otorisasi dilakukan server-side; token tidak disimpan dalam lokasi yang mudah diakses JavaScript bila arsitektur memungkinkan; seluruh akses menggunakan HTTPS; pesan error tidak membocorkan data privat. |
| Performa | Pemeriksaan akses umum tidak menambah lebih dari 100 ms pada p95 request setelah cache efektif tersedia. |
| Konsistensi | Route UI dan API menggunakan sumber kebijakan permission yang sama atau memiliki kontrak yang terdokumentasi. |
| Reliabilitas | Jika layanan permission gagal, sistem menggunakan fail-closed untuk route privat, bukan memberikan akses secara default. |
| Observability | Keputusan akses kritis dapat ditelusuri menggunakan request ID dan audit log. |
| Maintainability | Penambahan role atau permission tidak memerlukan perubahan tersebar di banyak komponen. |
| Privasi | Log tidak menyimpan password, token penuh, secret, atau data pribadi yang tidak dibutuhkan untuk audit. |
| Kompatibilitas | Middleware mendukung browser dan perangkat yang menjadi target website serta request halaman dan API. |

---

## 10. Kontrak Respons API

| Kondisi | HTTP status | Contoh respons |
|---|---:|---|
| Sesi tidak ada/tidak valid | 401 | `{ "code": "UNAUTHENTICATED", "message": "Authentication required" }` |
| Permission tidak mencukupi | 403 | `{ "code": "FORBIDDEN", "message": "You do not have access to this resource" }` |
| Resource tidak ditemukan | 404 | `{ "code": "NOT_FOUND", "message": "Resource not found" }` |
| Role akun tidak valid | 403 | `{ "code": "INVALID_ACCESS_CONTEXT", "message": "Access context is invalid" }` |

Pesan yang dikembalikan kepada pengguna harus bersifat umum. Detail seperti permission yang hilang dapat ditulis ke log internal, bukan dikirimkan ke browser.

---

## 11. Acceptance Criteria

### AC-01 — Route tanpa login

**Given** pengguna belum login, **when** pengguna membuka route dashboard privat, **then** sistem mengarahkan ke halaman login dan menyimpan tujuan awal secara aman untuk digunakan setelah login.

### AC-02 — Redirect sesuai role

**Given** pengguna login dengan role Operator, **when** proses login berhasil, **then** pengguna diarahkan ke `/dashboard/operator` dan tidak diarahkan ke dashboard role lain.

### AC-03 — Penolakan akses lintas role

**Given** pengguna Viewer, **when** pengguna mencoba membuka `/admin/roles` secara langsung, **then** sistem mengembalikan halaman `403` dan tidak mengirimkan data role.

### AC-04 — Proteksi API

**Given** pengguna tidak memiliki `data.delete`, **when** pengguna mengirim request delete ke endpoint data, **then** server mengembalikan `403` meskipun tombol delete disembunyikan atau request dibuat manual.

### AC-05 — Perubahan role

**Given** role pengguna diubah dari Operator menjadi Viewer, **when** sesi lama diinvalidasi atau token direfresh, **then** permission lama tidak lagi dapat digunakan.

### AC-06 — Scope organisasi

**Given** Admin hanya memiliki akses ke Organisasi A, **when** Admin meminta data Organisasi B melalui parameter request, **then** sistem menolak request atau mengembalikan hasil kosong sesuai kebijakan resource, tanpa membocorkan data Organisasi B.

### AC-07 — Audit

**Given** akses ke route ditolak, **when** penolakan terjadi pada endpoint yang diawasi, **then** audit log berisi actor, route/resource, action, hasil penolakan, timestamp, dan request ID tanpa menyimpan token.

### AC-08 — Fail-closed

**Given** service permission tidak tersedia, **when** pengguna mengakses route privat, **then** sistem tidak memberikan akses dan menampilkan respons error yang aman.

---

## 12. Rencana Implementasi

### Fase 1 — Fondasi autentikasi dan model akses

Mendefinisikan model User, Role, Permission, UserRole, RolePermission, scope akses, status akun, dan konfigurasi dashboard default. Pada fase ini juga ditetapkan format error serta request ID.

### Fase 2 — Middleware dan guard API

Membangun middleware autentikasi, role guard, permission guard, scope guard, serta mekanisme fail-closed. Seluruh route privat dan endpoint API dipetakan ke persyaratan akses.

### Fase 3 — Dashboard dan navigasi berbasis permission

Membangun redirect dashboard, route guard frontend, menu dinamis, halaman `401/403`, serta state yang konsisten ketika sesi habis atau role berubah.

### Fase 4 — Administrasi dan audit

Membangun halaman pengelolaan pengguna, role, permission, konfigurasi dashboard, audit log, invalidasi cache/sesi, dan pembatasan perubahan role.

### Fase 5 — Pengujian dan peluncuran bertahap

Melakukan unit test untuk policy, integration test untuk route/API, end-to-end test untuk seluruh role, pengujian keamanan, uji performa, serta peluncuran bertahap menggunakan feature flag jika tersedia.

---

## 13. Strategi Pengujian

| Jenis pengujian | Cakupan minimum |
|---|---|
| Unit test | Resolver role, evaluator permission, evaluator scope, status akun, dan redirect resolver |
| Integration test | Semua route dashboard dan endpoint privat untuk seluruh role |
| End-to-end test | Login, logout, session expiry, redirect, akses ditolak, perubahan role, dan menu dinamis |
| Security test | Bypass melalui URL langsung, manipulasi request body, IDOR, token kedaluwarsa, dan privilege escalation |
| Performance test | Latensi middleware pada kondisi cache hit dan cache miss |
| Regression test | Modul bisnis yang telah ada setelah middleware diterapkan |

Minimum test matrix harus mencakup setiap kombinasi role dan permission kritis, termasuk kondisi akun nonaktif, permission hilang, scope berbeda, dan service permission gagal.

---

## 14. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Hanya mengandalkan guard frontend | Akses privat dapat dibypass | Wajibkan authorization pada server/API |
| Cache permission kedaluwarsa | Role lama tetap memiliki akses | TTL pendek, invalidasi saat perubahan role, dan token versioning |
| Permission tersebar di banyak file | Inkonsistensi kebijakan | Gunakan policy registry dan kontrak route terpusat |
| Log menyimpan data sensitif | Risiko privasi dan keamanan | Redaksi token, secret, dan data pribadi sebelum logging |
| Role terlalu luas | Privilege berlebihan | Terapkan prinsip least privilege dan review permission berkala |
| Kegagalan service authorization | Sistem tidak konsisten | Terapkan fail-closed pada route privat dan observability |

---

## 15. Metrik dan Monitoring

Metrik yang dipantau meliputi jumlah login gagal, rasio `401` dan `403`, jumlah perubahan role, waktu respons middleware, error pada permission service, serta pola penolakan akses yang tidak biasa. Alert perlu dibuat untuk lonjakan penolakan akses, perubahan permission dalam jumlah besar, dan kegagalan berulang pada service authorization.

---

## 16. Open Questions

1. Apakah satu pengguna boleh memiliki banyak role sekaligus, atau hanya satu role utama?
2. Apakah scope akses akan berbasis organisasi, cabang, project, wilayah, atau kombinasi beberapa konteks?
3. Apakah Admin boleh membuat pengguna baru, atau hanya Super Admin?
4. Apakah perubahan role harus melalui approval dan menyertakan alasan wajib?
5. Berapa lama sesi login dan berapa lama cache permission dapat digunakan?
6. Apakah role dan permission perlu disinkronkan dengan SSO atau identity provider eksternal?
7. Apakah audit log harus dapat diekspor dan berapa lama retensi datanya?
8. Apakah dashboard setiap role berbeda secara penuh, atau hanya berbeda pada widget dan menu?

---

## 17. Definition of Done

Fitur dianggap selesai apabila seluruh route dashboard dan endpoint privat memiliki kebijakan akses eksplisit, middleware server-side telah aktif, redirect dan error state telah diuji untuk seluruh role, menu tidak menampilkan aksi yang tidak diizinkan, perubahan role menginvalidasi akses lama sesuai SLA, audit log tersedia, pengujian keamanan utama lulus, dokumentasi permission diperbarui, dan tidak terdapat defect kritis atau tinggi yang terbuka.

---

## Referensi

Dokumen ini tidak bergantung pada data eksternal tertentu. Untuk implementasi lanjutan, tim engineering disarankan menjadikan **OWASP Application Security Verification Standard** sebagai referensi pengujian kontrol autentikasi dan otorisasi: [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/).

---

**Catatan:** Nama role, route, permission, SLA, serta pembatasan scope pada dokumen ini adalah baseline generik. Nilai final perlu dikonfirmasi oleh Product Owner, Engineering, Security, dan pemilik proses bisnis sebelum masuk ke tahap development.
