/**
 * WEBCAPRICE 26 — AUTH MODULE
 * Menangani login, logout, sesi, dan status akun.
 * Role, status, dan redirect HARUS berasal dari sumber server tervalidasi
 * (PRD Login §12, §13; PRD Middleware FR-01/02/03).
 *
 * Website ini statis → autentikasi disimulasikan via AUTH_DEMO_USERS.
 * DALAM PRODUKSI: ganti dengan fetch() ke endpoint nyata & jangan pernah
 * menaruh kredensial role di client.
 */

"use strict";

window.CapriceAuth = (function () {
  const SESSION_KEY = "caprice-session";
  const RETURN_KEY = "caprice-return-url";

  // ---- DEMO USERS ----
  // INI HANYA UNTUK DEMO. Tidak boleh ada di client pada produksi nyata.
  const DEMO_USERS = [
    { id: "u1", identifier: "super@caprice26.id", password: "super123", displayName: "Super Admin Caprice", role: "super-admin", status: "active" },
    { id: "u2", identifier: "admin@caprice26.id", password: "admin123", displayName: "Admin Operasional", role: "admin", status: "active" },
    { id: "u3", identifier: "operator@caprice26.id", password: "operator123", displayName: "Operator Harian", role: "operator", status: "active" },
    { id: "u4", identifier: "viewer@caprice26.id", password: "viewer123", displayName: "Viewer Data", role: "viewer", status: "active" },
    { id: "u5", identifier: "nonaktif@caprice26.id", password: "pass123", displayName: "Akun Belum Aktif", role: "viewer", status: "inactive" },
    { id: "u6", identifier: "terkunci@caprice26.id", password: "pass123", displayName: "Akun Terkunci", role: "viewer", status: "locked" },
  ];

  const msgMap = {
    INVALID_CREDENTIALS: "Email/username atau password tidak sesuai.",
    ACCOUNT_INACTIVE: "Akun Anda belum aktif. Hubungi administrator atau periksa instruksi aktivasi.",
    ACCOUNT_LOCKED: "Akun ini sedang dikunci sementara. Silakan coba lagi nanti atau hubungi administrator.",
  };

  // ------- SESSION -------
  function createSession(user) {
    const session = {
      user: {
        id: user.id,
        displayName: user.displayName,
        identifier: user.identifier,
        role: user.role,
        status: user.status,
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
  // Simulasi panggilan autentikasi (PRD §12). Kembalikan Promise.
  function authenticate(identifier, password) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = DEMO_USERS.find(
          (u) => u.identifier.toLowerCase() === identifier.trim().toLowerCase()
        );
        if (!user || user.password !== password) {
          resolve({ ok: false, error: { code: "INVALID_CREDENTIALS", message: "Unable to authenticate", retryable: true } });
          return;
        }
        if (user.status !== "active") {
          resolve({ ok: true, user, accountStatus: user.status });
          return;
        }
        resolve({ ok: true, user });
      }, 1200);
    });
  }

  function login(identifier, password) {
    const success = document.dispatchEvent(
      new CustomEvent("caprice:auth", { detail: { action: "submitted" } })
    );
    void success;
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
    document.dispatchEvent(
      new CustomEvent("caprice:auth", { detail: { action: "logout" } })
    );
    destroySession();
  }

  function messageForCode(code) {
    return msgMap[code] || null;
  }

  // ------- RETURN URL (deep link, PRD §7.3) -------
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
    createSession,
    destroySession,
    messageForCode,
    setReturnUrl,
    getReturnUrl,
    SESSION_KEY,
    RETURN_KEY,
  };
})();
