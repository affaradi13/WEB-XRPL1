/**
 * WEBCAPRICE 26 — MIDDLEWARE ROLE-BASED ACCESS CONTROL
 * Konfigurasi dan Store Dinamis untuk Role, Permission, Route, dan Menu
 * Mendukung penyimpanan persisten via localStorage dengan fallback default.
 */

"use strict";

window.CAPRICE_CONFIG = (function () {
  const STORAGE_KEY_ROLES = "caprice_roles_v2";
  const STORAGE_KEY_PERMS = "caprice_permissions_v2";

  // Definisi Default Roles Kelas X RPL 1
  const DEFAULT_ROLES = {
    "super-admin": {
      id: "super-admin",
      label: "Super Admin (Wali Kelas)",
      badge: "badge-super-admin",
      color: "#f59e0b",
      dashboard: "dashboard-super-admin.html",
      description: "Akses mutlak & konfigurasi penuh sistem dan matriks izin.",
    },
    "ketua-kelas": {
      id: "ketua-kelas",
      label: "Ketua Kelas (Admin)",
      badge: "badge-admin",
      color: "#00f0ff",
      dashboard: "dashboard-admin.html",
      description: "Kelola anggota tim kelas, penugasan role, dan operasional.",
    },
    bendahara: {
      id: "bendahara",
      label: "Bendahara",
      badge: "badge-bendahara",
      color: "#10b981",
      dashboard: "dashboard-bendahara.html",
      description: "Kelola keuangan kas kelas, pencatatan transaksi & export laporan.",
    },
    sekretaris: {
      id: "sekretaris",
      label: "Sekretaris",
      badge: "badge-sekretaris",
      color: "#a855f7",
      dashboard: "dashboard-sekretaris.html",
      description: "Kelola agenda, notulensi rapat, jadwal piket & data absensi.",
    },
    anggota: {
      id: "anggota",
      label: "Anggota (Siswa)",
      badge: "badge-viewer",
      color: "#64748b",
      dashboard: "dashboard-viewer.html",
      description: "Melihat transparansi kas, agenda, jadwal pelajaran & info kelas.",
    },
  };

  // Matriks Permission Default
  const DEFAULT_PERMISSIONS = {
    "dashboard.view": ["super-admin", "ketua-kelas", "bendahara", "sekretaris", "anggota"],
    "user.view": ["super-admin", "ketua-kelas", "bendahara", "sekretaris", "anggota"],
    "user.create": ["super-admin", "ketua-kelas"],
    "user.edit": ["super-admin", "ketua-kelas"],
    "user.change_role": ["super-admin", "ketua-kelas"],
    "user.reset_password": ["super-admin", "ketua-kelas"],
    "user.status_toggle": ["super-admin", "ketua-kelas"],
    "user.bulk_import": ["super-admin", "ketua-kelas"],
    "user.export": ["super-admin", "ketua-kelas"],
    "user.delete": ["super-admin"],
    "role.view": ["super-admin", "ketua-kelas"],
    "role.manage": ["super-admin"],
    "kas.view": ["super-admin", "ketua-kelas", "bendahara", "sekretaris", "anggota"],
    "kas.create": ["super-admin", "ketua-kelas", "bendahara"],
    "kas.edit": ["super-admin", "ketua-kelas", "bendahara"],
    "kas.delete": ["super-admin", "bendahara"],
    "kas.export": ["super-admin", "ketua-kelas", "bendahara"],
    "agenda.view": ["super-admin", "ketua-kelas", "bendahara", "sekretaris", "anggota"],
    "agenda.create": ["super-admin", "ketua-kelas", "sekretaris"],
    "agenda.edit": ["super-admin", "ketua-kelas", "sekretaris"],
    "agenda.delete": ["super-admin", "sekretaris"],
    "jadwal.manage": ["super-admin", "ketua-kelas", "sekretaris"],
    "audit.view": ["super-admin", "ketua-kelas"],
    "settings.view": ["super-admin", "ketua-kelas"],
    "settings.manage": ["super-admin", "ketua-kelas"],
  };

  // Deskripsi Human-Readable untuk Tiap Permission
  const PERMISSION_DESCRIPTIONS = {
    "dashboard.view": { label: "Melihat Dashboard", group: "Dashboard" },
    "user.view": { label: "Melihat Daftar Anggota", group: "Pengguna & Anggota" },
    "user.create": { label: "Menambah Anggota Baru", group: "Pengguna & Anggota" },
    "user.edit": { label: "Mengubah Profil Anggota", group: "Pengguna & Anggota" },
    "user.change_role": { label: "Mengatur Role Anggota", group: "Pengguna & Anggota" },
    "user.reset_password": { label: "Reset Password Siswa", group: "Pengguna & Anggota" },
    "user.status_toggle": { label: "Ubah Status Akun (Aktif/Kunci)", group: "Pengguna & Anggota" },
    "user.bulk_import": { label: "Import Data Siswa Massal", group: "Pengguna & Anggota" },
    "user.export": { label: "Export Rekap Siswa", group: "Pengguna & Anggota" },
    "user.delete": { label: "Menghapus Akun Anggota", group: "Pengguna & Anggota" },
    "role.view": { label: "Melihat Matriks Role", group: "Role & Permission" },
    "role.manage": { label: "Mengubah Matriks & Role", group: "Role & Permission" },
    "kas.view": { label: "Melihat Kas Kelas", group: "Keuangan & Kas" },
    "kas.create": { label: "Catat Kas Masuk/Keluar", group: "Keuangan & Kas" },
    "kas.edit": { label: "Ubah Catatan Kas", group: "Keuangan & Kas" },
    "kas.delete": { label: "Hapus Catatan Kas", group: "Keuangan & Kas" },
    "kas.export": { label: "Export Laporan Kas", group: "Keuangan & Kas" },
    "agenda.view": { label: "Melihat Agenda & Notulen", group: "Sekretariat" },
    "agenda.create": { label: "Buat Agenda & Notulen", group: "Sekretariat" },
    "agenda.edit": { label: "Ubah Agenda & Notulen", group: "Sekretariat" },
    "agenda.delete": { label: "Hapus Agenda & Notulen", group: "Sekretariat" },
    "jadwal.manage": { label: "Kelola Jadwal & Piket", group: "Sekretariat" },
    "audit.view": { label: "Melihat Audit Log", group: "Sistem & Keamanan" },
    "settings.view": { label: "Melihat Pengaturan", group: "Sistem & Keamanan" },
    "settings.manage": { label: "Mengubah Pengaturan", group: "Sistem & Keamanan" },
  };

  function loadRoles() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_ROLES);
      if (raw) {
        return Object.assign({}, DEFAULT_ROLES, JSON.parse(raw));
      }
    } catch (e) {
      console.warn("Error loading roles from localStorage", e);
    }
    return Object.assign({}, DEFAULT_ROLES);
  }

  function saveRolesToStorage(roles) {
    try {
      localStorage.setItem(STORAGE_KEY_ROLES, JSON.stringify(roles));
    } catch (e) {
      console.error("Error saving roles to localStorage", e);
    }
  }

  function loadPermissions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PERMS);
      if (raw) {
        return Object.assign({}, DEFAULT_PERMISSIONS, JSON.parse(raw));
      }
    } catch (e) {
      console.warn("Error loading permissions from localStorage", e);
    }
    return Object.assign({}, DEFAULT_PERMISSIONS);
  }

  function savePermissionsToStorage(perms) {
    try {
      localStorage.setItem(STORAGE_KEY_PERMS, JSON.stringify(perms));
    } catch (e) {
      console.error("Error saving permissions to localStorage", e);
    }
  }

  let currentRoles = loadRoles();
  let currentPermissions = loadPermissions();

  const ROUTES = {
    "dashboard-super-admin.html": { requiredRole: "super-admin", requiredPermission: "dashboard.view" },
    "dashboard-admin.html": { requiredRole: "ketua-kelas", requiredPermission: "dashboard.view" },
    "dashboard-bendahara.html": { requiredPermission: "kas.create" },
    "dashboard-sekretaris.html": { requiredPermission: "agenda.create" },
    "dashboard-viewer.html": { requiredPermission: "dashboard.view" },
    "dashboard-operator.html": { requiredPermission: "dashboard.view" },
    "admin-users.html": { requiredPermission: "user.view" },
    "admin-roles.html": { requiredPermission: "role.view" },
    "admin-audit-logs.html": { requiredPermission: "audit.view" },
    "admin-settings.html": { requiredPermission: "settings.view" },
  };

  const MENUS = {
    "super-admin": [
      { label: "Dashboard", href: "dashboard-super-admin.html", icon: "📊" },
      { label: "Anggota Kelas", href: "admin-users.html", icon: "👥" },
      { label: "Role & Permission", href: "admin-roles.html", icon: "🛡️" },
      { label: "Kas & Keuangan", href: "dashboard-bendahara.html", icon: "💰" },
      { label: "Agenda & Notulen", href: "dashboard-sekretaris.html", icon: "📝" },
      { label: "Audit Log", href: "admin-audit-logs.html", icon: "📜" },
      { label: "Pengaturan", href: "admin-settings.html", icon: "⚙️" },
    ],
    "ketua-kelas": [
      { label: "Dashboard", href: "dashboard-admin.html", icon: "📊" },
      { label: "Anggota & Role", href: "admin-users.html", icon: "👥" },
      { label: "Matriks Role", href: "admin-roles.html", icon: "🛡️" },
      { label: "Kas & Keuangan", href: "dashboard-bendahara.html", icon: "💰" },
      { label: "Agenda & Notulen", href: "dashboard-sekretaris.html", icon: "📝" },
      { label: "Audit Log", href: "admin-audit-logs.html", icon: "📜" },
    ],
    bendahara: [
      { label: "Dashboard Kas", href: "dashboard-bendahara.html", icon: "💰" },
      { label: "Daftar Siswa", href: "admin-users.html", icon: "👥" },
      { label: "Portal Kelas", href: "dashboard-viewer.html", icon: "📊" },
    ],
    sekretaris: [
      { label: "Sekretariat & Agenda", href: "dashboard-sekretaris.html", icon: "📝" },
      { label: "Daftar Siswa", href: "admin-users.html", icon: "👥" },
      { label: "Portal Kelas", href: "dashboard-viewer.html", icon: "📊" },
    ],
    anggota: [
      { label: "Portal Siswa", href: "dashboard-viewer.html", icon: "📊" },
      { label: "Daftar Siswa", href: "admin-users.html", icon: "👥" },
    ],
    // Backward compatibility
    admin: [
      { label: "Dashboard", href: "dashboard-admin.html", icon: "📊" },
      { label: "Anggota & Role", href: "admin-users.html", icon: "👥" },
      { label: "Audit Log", href: "admin-audit-logs.html", icon: "📜" },
    ],
    operator: [
      { label: "Dashboard", href: "dashboard-bendahara.html", icon: "📊" },
      { label: "Daftar Siswa", href: "admin-users.html", icon: "👥" },
    ],
    viewer: [
      { label: "Portal Siswa", href: "dashboard-viewer.html", icon: "📊" },
      { label: "Daftar Siswa", href: "admin-users.html", icon: "👥" },
    ],
  };

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

  const MESSAGES = {
    UNAUTHENTICATED: "Autentikasi diperlukan. Silakan masuk terlebih dahulu.",
    FORBIDDEN: "Anda tidak memiliki hak akses untuk membuka halaman ini.",
    NOT_FOUND: "Halaman tidak ditemukan.",
    INVALID_ACCESS_CONTEXT: "Konteks akses tidak valid.",
    SESSION_EXPIRED: "Sesi Anda telah berakhir. Silakan masuk kembali.",
    LOGIN_REQUIRED: "Silakan masuk terlebih dahulu untuk mengakses dashboard.",
    ROLE_UNKNOWN: "Peran akun Anda tidak dikenali sistem. Hubungi administrator.",
    NO_ACCESS_ROUTE: "Anda berhasil masuk, tetapi tidak memiliki izin untuk membuka halaman ini.",
  };

  function getRoles() {
    currentRoles = loadRoles();
    return currentRoles;
  }

  function getPermissions() {
    currentPermissions = loadPermissions();
    return currentPermissions;
  }

  function togglePermission(permissionKey, roleKey, isAllowed) {
    currentPermissions = loadPermissions();
    if (!currentPermissions[permissionKey]) {
      currentPermissions[permissionKey] = [];
    }
    const list = currentPermissions[permissionKey];
    const index = list.indexOf(roleKey);
    if (isAllowed && index === -1) {
      list.push(roleKey);
    } else if (!isAllowed && index !== -1) {
      list.splice(index, 1);
    }
    savePermissionsToStorage(currentPermissions);
    return currentPermissions;
  }

  function saveRole(roleKey, roleData) {
    currentRoles = loadRoles();
    currentRoles[roleKey] = Object.assign({}, currentRoles[roleKey] || {}, roleData);
    saveRolesToStorage(currentRoles);
    return currentRoles;
  }

  function deleteRole(roleKey) {
    currentRoles = loadRoles();
    if (DEFAULT_ROLES[roleKey]) {
      throw new Error("Role bawaan sistem tidak dapat dihapus!");
    }
    delete currentRoles[roleKey];
    saveRolesToStorage(currentRoles);

    currentPermissions = loadPermissions();
    Object.keys(currentPermissions).forEach((k) => {
      currentPermissions[k] = currentPermissions[k].filter((r) => r !== roleKey);
    });
    savePermissionsToStorage(currentPermissions);
    return true;
  }

  function resetToDefaults() {
    currentRoles = Object.assign({}, DEFAULT_ROLES);
    currentPermissions = Object.assign({}, DEFAULT_PERMISSIONS);
    localStorage.removeItem(STORAGE_KEY_ROLES);
    localStorage.removeItem(STORAGE_KEY_PERMS);
    return { roles: currentRoles, permissions: currentPermissions };
  }

  const DEFAULT_CHATBOT_CONFIG = {
    defaultModel: "gemini-3.6-flash",
    fallbackEnabled: true,
    storageKey: "caprice_gemini_api_key",
    modelStorageKey: "caprice_gemini_model",
    supportedModels: [
      { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash (Terbaru & Rekomendasi)" },
      { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
      { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (Stabil)" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Legacy)" }
    ]
  };

  return {
    get ROLES() {
      return getRoles();
    },
    get PERMISSIONS() {
      return getPermissions();
    },
    ROUTES,
    MENUS,
    PUBLIC_ROUTES,
    MESSAGES,
    PERMISSION_DESCRIPTIONS,
    DEFAULT_ROLES,
    DEFAULT_PERMISSIONS,
    DEFAULT_CHATBOT_CONFIG,
    getRoles,
    getPermissions,
    togglePermission,
    saveRole,
    deleteRole,
    resetToDefaults,
  };
})();
