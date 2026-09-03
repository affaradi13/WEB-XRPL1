/**
 * WEBCAPRICE 26 — AUTH & USER MANAGEMENT MODULE
 * Menangani login, logout, sesi, dan manajemen pengguna serta role assignment.
 * Data pengguna dan audit log disimpan secara persisten di localStorage.
 */

"use strict";

window.CapriceAuth = (function () {
  const SESSION_KEY = "caprice-session";
  const RETURN_KEY = "caprice-return-url";
  const STORAGE_KEY_USERS = "caprice_users_v2";
  const STORAGE_KEY_AUDIT = "caprice_audit_logs_v2";

  // ---- DEFAULT CLASS USERS ----
  const DEFAULT_USERS = [
    {
      id: "u-wali",
      identifier: "wali@caprice26.id",
      password: "super123",
      displayName: "Anang jasmiko (Wali Kelas)",
      role: "super-admin",
      status: "active",
      nisn: "198504122010012001",
      joinedAt: "2026-07-15",
    },
    {
      id: "u-ketua",
      identifier: "ketua@caprice26.id",
      password: "ketua123",
      displayName: "Muhammad Rizky (Ketua Kelas)",
      role: "ketua-kelas",
      status: "active",
      nisn: "0081234567",
      joinedAt: "2026-07-16",
    },
    {
      id: "u-bendahara",
      identifier: "bendahara@caprice26.id",
      password: "kas123",
      displayName: "Siti Aisyah (Bendahara)",
      role: "bendahara",
      status: "active",
      nisn: "0082345678",
      joinedAt: "2026-07-16",
    },
    {
      id: "u-sekretaris",
      identifier: "sekretaris@caprice26.id",
      password: "notulen123",
      displayName: "Nabila Putri (Sekretaris)",
      role: "sekretaris",
      status: "active",
      nisn: "0083456789",
      joinedAt: "2026-07-16",
    },
    {
      id: "u-siswa",
      identifier: "siswa@caprice26.id",
      password: "siswa123",
      displayName: "Ahmad Fauzi (Anggota)",
      role: "anggota",
      status: "active",
      nisn: "0084567890",
      joinedAt: "2026-07-17",
    },
    {
      id: "u-nonaktif",
      identifier: "nonaktif@caprice26.id",
      password: "pass123",
      displayName: "Siswa Pindahan (Nonaktif)",
      role: "anggota",
      status: "inactive",
      nisn: "0085678901",
      joinedAt: "2026-08-01",
    },
    {
      id: "u-terkunci",
      identifier: "terkunci@caprice26.id",
      password: "pass123",
      displayName: "Akun Terkunci (Sanksi)",
      role: "anggota",
      status: "locked",
      nisn: "0086789012",
      joinedAt: "2026-08-05",
    },
  ];

  // Backward compatibility alias map
  const ALIAS_MAP = {
    "super@caprice26.id": "wali@caprice26.id",
    "admin@caprice26.id": "ketua@caprice26.id",
    "operator@caprice26.id": "bendahara@caprice26.id",
    "viewer@caprice26.id": "siswa@caprice26.id",
  };

  const msgMap = {
    INVALID_CREDENTIALS: "Email/username atau password tidak sesuai.",
    ACCOUNT_INACTIVE: "Akun Anda belum aktif. Hubungi administrator atau periksa instruksi aktivasi.",
    ACCOUNT_LOCKED: "Akun ini sedang dikunci sementara. Silakan coba lagi nanti atau hubungi administrator.",
  };

  // ------- USER REPOSITORY -------
  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USERS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Error loading users from storage", e);
    }
    return DEFAULT_USERS.slice();
  }

  function saveUsersToStorage(users) {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch (e) {
      console.error("Error saving users to storage", e);
    }
  }

  let usersCache = loadUsers();

  function getUsers() {
    usersCache = loadUsers();
    return usersCache;
  }

  function getUserById(id) {
    const list = getUsers();
    return list.find((u) => u.id === id) || null;
  }

  function saveUser(userData, actorUser) {
    const list = getUsers();
    let updatedUser;
    if (userData.id) {
      // Edit existing user
      const idx = list.findIndex((u) => u.id === userData.id);
      if (idx !== -1) {
        // Cek wewenang jika actor adalah Admin (Ketua Kelas)
        if (actorUser && actorUser.role === "ketua-kelas") {
          if (list[idx].role === "super-admin") {
            throw new Error("Ketua Kelas tidak diizinkan mengubah akun Wali Kelas (Super Admin)!");
          }
        }
        list[idx] = Object.assign({}, list[idx], userData);
        updatedUser = list[idx];
        logAuditEvent("USER_UPDATE", `Mengubah profil ${updatedUser.displayName} (${updatedUser.identifier})`, actorUser, "Sukses");
      } else {
        throw new Error("Pengguna tidak ditemukan");
      }
    } else {
      // Create new user
      const exists = list.some((u) => u.identifier.toLowerCase() === userData.identifier.trim().toLowerCase());
      if (exists) {
        throw new Error("Email / Username sudah terdaftar!");
      }
      updatedUser = {
        id: "u-" + Date.now().toString(36),
        identifier: userData.identifier.trim().toLowerCase(),
        password: userData.password || "pass123",
        displayName: userData.displayName.trim(),
        role: userData.role || "anggota",
        status: userData.status || "active",
        nisn: userData.nisn || "-",
        joinedAt: new Date().toISOString().split("T")[0],
      };
      list.push(updatedUser);
      logAuditEvent("USER_CREATE", `Menambah anggota baru ${updatedUser.displayName} [Role: ${updatedUser.role}]`, actorUser, "Sukses");
    }

    saveUsersToStorage(list);
    return updatedUser;
  }

  function updateUserRole(userId, newRole, actorUser) {
    const list = getUsers();
    const target = list.find((u) => u.id === userId);
    if (!target) throw new Error("Pengguna tidak ditemukan");

    // Validasi wewenang
    if (actorUser) {
      if (actorUser.role === "ketua-kelas") {
        if (target.role === "super-admin") {
          throw new Error("Ketua Kelas tidak memiliki izin mengubah role Super Admin (Wali Kelas)!");
        }
        if (newRole === "super-admin") {
          throw new Error("Ketua Kelas tidak dapat mengangkat anggota menjadi Super Admin!");
        }
      } else if (actorUser.role !== "super-admin") {
        throw new Error("Hanya Super Admin dan Ketua Kelas yang dapat mengubah role anggota!");
      }
    }

    const oldRole = target.role;
    target.role = newRole;
    saveUsersToStorage(list);

    // Update sesi jika user yang sedang login adalah user ini
    const currentSession = getSession();
    if (currentSession && currentSession.user && currentSession.user.id === userId) {
      currentSession.user.role = newRole;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));
    }

    logAuditEvent(
      "ROLE_CHANGE",
      `Mengubah role ${target.displayName} dari [${oldRole}] menjadi [${newRole}]`,
      actorUser,
      "Sukses"
    );

    return target;
  }

  function deleteUser(userId, actorUser) {
    const list = getUsers();
    const idx = list.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error("Pengguna tidak ditemukan");

    const target = list[idx];
    if (target.role === "super-admin") {
      throw new Error("Akun Super Admin (Wali Kelas) tidak dapat dihapus!");
    }

    if (actorUser && actorUser.role !== "super-admin") {
      throw new Error("Hanya Super Admin (Wali Kelas) yang berwenang menghapus pengguna!");
    }

    list.splice(idx, 1);
    saveUsersToStorage(list);

    logAuditEvent("USER_DELETE", `Menghapus akun ${target.displayName} (${target.identifier})`, actorUser, "Sukses");
    return true;
  }

  function resetUsersToDefault() {
    usersCache = DEFAULT_USERS.slice();
    localStorage.removeItem(STORAGE_KEY_USERS);
    return usersCache;
  }

  // ------- AUDIT LOG STORE -------
  function loadAuditLogs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.warn("Error loading audit logs", e);
    }
    return [
      { id: "log-1", timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), actor: "wali@caprice26.id", action: "SYSTEM_INIT", detail: "Inisialisasi sistem RBAC WebCaprice 26", result: "Sukses", reqId: "req_init" },
      { id: "log-2", timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), actor: "ketua@caprice26.id", action: "LOGIN", detail: "Masuk ke Dashboard Ketua Kelas", result: "Sukses", reqId: "req_auth1" },
      { id: "log-3", timestamp: new Date(Date.now() - 3600000).toISOString(), actor: "bendahara@caprice26.id", action: "KAS_RECORD", detail: "Mencatat kas masuk mingguan", result: "Sukses", reqId: "req_kas1" },
    ];
  }

  function saveAuditLogsToStorage(logs) {
    try {
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(logs.slice(-200)));
    } catch (e) {
      console.error("Error saving audit logs", e);
    }
  }

  function logAuditEvent(action, detail, actorUser, result = "Sukses") {
    const logs = loadAuditLogs();
    const actorEmail = actorUser ? (actorUser.identifier || actorUser.displayName || "system") : "anonymous";
    const newLog = {
      id: "log-" + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      actor: actorEmail,
      action: action,
      detail: detail,
      result: result,
      reqId: "req_" + Math.random().toString(36).substring(2, 7),
    };
    logs.unshift(newLog);
    saveAuditLogsToStorage(logs);
    return newLog;
  }

  function getAuditLogs() {
    return loadAuditLogs();
  }

  function clearAuditLogs() {
    localStorage.removeItem(STORAGE_KEY_AUDIT);
  }

  // ------- SESSION -------
  function createSession(user) {
    const session = {
      user: {
        id: user.id,
        displayName: user.displayName,
        identifier: user.identifier,
        role: user.role,
        status: user.status,
        nisn: user.nisn || "",
      },
      createdAt: Date.now(),
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function getSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const s = JSON.parse(raw);
      if (!s || !s.user || !s.user.role) return null;
      // Sinkronkan role terkini dari database
      const liveUser = getUserById(s.user.id);
      if (liveUser) {
        s.user.role = liveUser.role;
        s.user.status = liveUser.status;
      }
      return s;
    } catch (e) {
      return null;
    }
  }

  function destroySession() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(RETURN_KEY);
  }

  function getUser() {
    const s = getSession();
    return s ? s.user : null;
  }

  // ------- AUTH FLOW -------
  function authenticate(identifier, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let lookupId = identifier.trim().toLowerCase();
        if (ALIAS_MAP[lookupId]) {
          lookupId = ALIAS_MAP[lookupId];
        }

        const users = getUsers();
        const user = users.find(
          (u) => u.identifier.toLowerCase() === lookupId || (u.nisn && u.nisn === lookupId)
        );

        if (!user || user.password !== password) {
          logAuditEvent("LOGIN_FAILED", `Percobaan masuk gagal untuk identitas: ${identifier}`, null, "Tolak");
          resolve({ ok: false, error: { code: "INVALID_CREDENTIALS", message: "Unable to authenticate", retryable: true } });
          return;
        }
        if (user.status !== "active") {
          logAuditEvent("LOGIN_BLOCKED", `Percobaan masuk akun ${user.status}: ${user.identifier}`, user, "Tolak");
          resolve({ ok: true, user, accountStatus: user.status });
          return;
        }
        logAuditEvent("LOGIN_SUCCESS", `Berhasil masuk: ${user.displayName} (${user.role})`, user, "Sukses");
        resolve({ ok: true, user });
      }, 500);
    });
  }

  function login(identifier, password) {
    document.dispatchEvent(
      new CustomEvent("caprice:auth", { detail: { action: "submitted" } })
    );
    return authenticate(identifier, password).then((res) => {
      if (res.ok && res.user.status === "active") {
        const session = createSession(res.user);
        document.dispatchEvent(
          new CustomEvent("caprice:auth", { detail: { action: "succeeded", role: res.user.role } })
        );
        return { ok: true, session, user: res.user };
      }
      if (res.ok && res.accountStatus) {
        document.dispatchEvent(
          new CustomEvent("caprice:auth", { detail: { action: "failed", code: res.accountStatus } })
        );
        return { ok: true, accountStatus: res.accountStatus, user: res.user };
      }
      document.dispatchEvent(
        new CustomEvent("caprice:auth", { detail: { action: "failed", code: res.error.code } })
      );
      return res;
    });
  }

  function logout() {
    const user = getUser();
    if (user) {
      logAuditEvent("LOGOUT", `Keluar dari sistem: ${user.displayName}`, user, "Sukses");
    }
    document.dispatchEvent(
      new CustomEvent("caprice:auth", { detail: { action: "logout" } })
    );
    destroySession();
  }

  function messageForCode(code) {
    return msgMap[code] || null;
  }

  function setReturnUrl(url) {
    sessionStorage.setItem(RETURN_KEY, url);
  }
  function getReturnUrl() {
    return sessionStorage.getItem(RETURN_KEY);
  }

  return {
    authenticate,
    login,
    logout,
    getSession,
    getUser,
    getUserById,
    getUsers,
    saveUser,
    updateUserRole,
    deleteUser,
    resetUsersToDefault,
    logAuditEvent,
    getAuditLogs,
    clearAuditLogs,
    createSession,
    destroySession,
    messageForCode,
    setReturnUrl,
    getReturnUrl,
    DEFAULT_USERS,
    SESSION_KEY,
    RETURN_KEY,
  };
})();

