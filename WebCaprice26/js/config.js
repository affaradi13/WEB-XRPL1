/**
 * WEBCAPRICE 26 — MIDDLEWARE ROLE-BASED ACCESS CONTROL
 * Sumber kebenaran (single source of truth) untuk role, permission,
 * route, menu, dan pesan sistem.
 * ---
 * PERINGATAN: Website ini statis, sehingga kontrol akses berjalan di
 * client-side. Untuk produksi nyata, otorisasi WAJIB juga dilakukan
 * server-side (lihat PRD §1.1, §6, & Risk matrix). Konfigurasi ini hanya
 * untuk UX + demonstrasi middleware.
 */

"use strict";

window.CAPRICE_CONFIG = (function () {
  // Definisi role & permission (PRD §5)
  const ROLES = {
    "super-admin": {
      label: "Super Admin",
      dashboard: "dashboard-super-admin.html",
    },
    admin: {
      label: "Admin",
      dashboard: "dashboard-admin.html",
    },
    operator: {
      label: "Operator",
      dashboard: "dashboard-operator.html",
    },
    viewer: {
      label: "Viewer",
      dashboard: "dashboard-viewer.html",
    },
  };

  // Matriks permission MVP (PRD §5.1) — role -> daftar permission
  const PERMISSIONS = {
    "dashboard.view": ["super-admin", "admin", "operator", "viewer"],
    "user.view": ["super-admin", "admin"],
    "user.create": ["super-admin"],
    "user.update": ["super-admin"],
    "user.delete": ["super-admin"],
    "role.view": ["super-admin"],
    "role.manage": ["super-admin"],
    "data.view": ["super-admin", "admin", "operator", "viewer"],
    "data.create": ["super-admin", "admin", "operator"],
    "data.update": ["super-admin", "admin", "operator"],
    "data.delete": ["super-admin"],
    "report.view": ["super-admin", "admin", "operator", "viewer"],
    "report.export": ["super-admin", "admin", "operator"],
    "settings.view": ["super-admin", "admin"],
    "settings.manage": ["super-admin"],
    "audit.view": ["super-admin", "admin"],
  };

  // Route dashboard & area terproteksi (PRD §8)
  // Tiap route mendeklarasikan kebutuhan akses secara eksplisit (FR-05)
  const ROUTES = {
    "dashboard-super-admin.html": { requiredRole: "super-admin", requiredPermission: "dashboard.view" },
    "dashboard-admin.html": { requiredRole: "admin", requiredPermission: "dashboard.view" },
    "dashboard-operator.html": { requiredRole: "operator", requiredPermission: "dashboard.view" },
    "dashboard-viewer.html": { requiredRole: "viewer", requiredPermission: "dashboard.view" },
    "admin-users.html": { requiredPermission: "user.view" },
    "admin-roles.html": { requiredPermission: "role.view" },
    "admin-audit-logs.html": { requiredPermission: "audit.view" },
    "admin-settings.html": { requiredPermission: "settings.view" },
  };

  // Menu navigasi dashboard per role (FR-07: sembunyikan yang tak diizinkan)
  const MENUS = {
    "super-admin": [
      { label: "Dashboard", href: "dashboard-super-admin.html", icon: "📊" },
      { label: "Pengguna", href: "admin-users.html", icon: "👥" },
      { label: "Role & Permission", href: "admin-roles.html", icon: "🛡️" },
      { label: "Audit Log", href: "admin-audit-logs.html", icon: "📜" },
      { label: "Pengaturan", href: "admin-settings.html", icon: "⚙️" },
    ],
    admin: [
      { label: "Dashboard", href: "dashboard-admin.html", icon: "📊" },
      { label: "Pengguna", href: "admin-users.html", icon: "👥" },
      { label: "Audit Log", href: "admin-audit-logs.html", icon: "📜" },
      { label: "Pengaturan", href: "admin-settings.html", icon: "⚙️" },
    ],
    operator: [{ label: "Dashboard", href: "dashboard-operator.html", icon: "📊" }],
    viewer: [{ label: "Dashboard", href: "dashboard-viewer.html", icon: "📊" }],
  };

  // Halaman publik yang TIDAK dilindungi (boleh diakses tanpa login)
  const PUBLIC_ROUTES = [
    "index.html",
    "struktur.html",
    "jadwal.html",
    "galeri.html",
    "proyek.html",
    "prestasi.html",
    "bukutamu.html",
    "lab-game.html",
    "kontak.html",
    "login.html",
  ];

  // Pesan sistem (PRD §10/op, gabung dengan PRD login §11)
  const MESSAGES = {
    UNAUTHENTICATED: "Authentication required",
    FORBIDDEN: "You do not have access to this resource",
    NOT_FOUND: "Resource not found",
    INVALID_ACCESS_CONTEXT: "Access context is invalid",
    SESSION_EXPIRED: "Sesi Anda telah berakhir. Silakan masuk kembali.",
    LOGIN_REQUIRED: "Silakan masuk terlebih dahulu untuk mengakses dashboard.",
    ROLE_UNKNOWN: "Peran akun Anda tidak dikenali sistem. Silakan hubungi administrator.",
    NO_ACCESS_ROUTE: "Anda berhasil masuk, tetapi tidak memiliki izin untuk membuka halaman ini.",
  };

  return {
    ROLES,
    PERMISSIONS,
    ROUTES,
    MENUS,
    PUBLIC_ROUTES,
    MESSAGES,
  };
})();
