/**
 * WEBCAPRICE 26 — AUTH LOGIN PAGE CONTROLLER
 * Mengikat form login (login.html) ke modul CapriceAuth + CapriceMiddleware.
 * Menangani validasi inline, state loading, error account status, deep link,
 * dan redirect dashboard sesuai role (PRD Login §7, §13; PRD Middleware FR-04).
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  const auth = window.CapriceAuth;
  const middleware = window.CapriceMiddleware;
  const cfg = window.CAPRICE_CONFIG;

  const toggleBtn = document.getElementById("toggle-password");
  const passInput = document.getElementById("login-password");

  // ---- Toggle visibility password (PRD Login FR-04) ----
  if (toggleBtn && passInput) {
    toggleBtn.addEventListener("click", () => {
      const visible = passInput.type === "text";
      passInput.type = visible ? "password" : "text";
      toggleBtn.setAttribute("aria-pressed", String(!visible));
      toggleBtn.innerHTML = visible ? "👁" : "🙈";
      toggleBtn.setAttribute("aria-label", visible ? "Tampilkan password" : "Sembunyikan password");
      if (window.soundFX) window.soundFX.play("click");
    });
  }

  // ---- Field error ----
  const setFieldError = (fid, msg) => {
    const group = document.getElementById(`fld-${fid}`);
    const errEl = document.getElementById(`err-${fid}`);
    if (group) group.classList.toggle("has-error", Boolean(msg));
    if (errEl) {
      errEl.textContent = msg || "";
      errEl.setAttribute("aria-live", msg ? "assertive" : "off");
    }
  };
  const clearErrors = () => {
    setFieldError("identifier", "");
    setFieldError("password", "");
    const alert = document.getElementById("login-alert");
    if (alert) alert.hidden = true;
  };
  const showAlert = (msg) => {
    const alert = document.getElementById("login-alert");
    if (alert) {
      alert.textContent = msg;
      alert.hidden = !msg;
    }
  };

  // ---- Loading state ----
  const setLoading = (loading) => {
    const submit = document.getElementById("login-submit");
    const identifier = document.getElementById("login-identifier");
    if (submit) submit.classList.toggle("loading", loading);
    if (identifier) identifier.disabled = loading;
    if (passInput) passInput.disabled = loading;
    if (toggleBtn) toggleBtn.disabled = loading;
  };

  // ---- Account status view ----
  const showStatus = (type) => {
    const views = ["login", "inactive", "expired", "unauthorized"];
    views.forEach((v) => {
      const el = document.getElementById(`view-${v}`);
      if (el) el.hidden = true;
    });
    const el = document.getElementById(`view-${type}`);
    if (el) el.hidden = false;
    if (type === "login") {
      const loginView = document.getElementById("view-login");
      if (loginView) loginView.hidden = false;
    }
    if (window.soundFX) window.soundFX.play("click");
  };

  // ---- Submit ----
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();

    const identifier = document.getElementById("login-identifier");
    let valid = true;
    if (!identifier.value.trim()) {
      valid = false;
      setFieldError("identifier", "Masukkan email atau username.");
    }
    if (!passInput.value) {
      valid = false;
      setFieldError("password", "Masukkan password.");
    }
    if (!valid) {
      if (window.soundFX) window.soundFX.play("wrong");
      return;
    }
    if (document.getElementById("login-submit").classList.contains("loading")) return;

    setLoading(true);
    auth.login(identifier.value, passInput.value).then((res) => {
      setLoading(false);

      // Simulasi delay kecil untuk animasi
      setTimeout(() => {
        if (!res.ok) {
          // Kredensial salah → pesan generik, identifier dipertahankan, password dikosongkan
          showAlert(auth.messageForCode("INVALID_CREDENTIALS") || cfg.MESSAGES.UNAUTHENTICATED);
          if (passInput) passInput.value = "";
          if (passInput) passInput.focus();
          if (window.soundFX) window.soundFX.play("wrong");
          return;
        }

        // Status akun khusus (inactive / locked)
        if (res.accountStatus) {
          showStatus("inactive");
          const icon = document.getElementById("inactive-icon");
          const title = document.getElementById("inactive-title");
          const desc = document.getElementById("inactive-desc");
          if (res.accountStatus === "locked") {
            if (icon) icon.textContent = "🔒";
            if (title) title.textContent = "Akun sedang terkunci";
            if (desc) desc.textContent = auth.messageForCode("ACCOUNT_LOCKED");
          } else {
            if (icon) icon.textContent = "⏸️";
            if (title) title.textContent = "Akun belum dapat digunakan";
            if (desc) desc.textContent = auth.messageForCode("ACCOUNT_INACTIVE");
          }
          if (window.soundFX) window.soundFX.play("wrong");
          return;
        }

        // Sesi valid → redirect dashboard role (FR-08, PRD Login §13)
        const role = res.user.role;
        if (!cfg.ROLES[role]) {
          // Role tidak dikenal → fallback aman
          showStatus("unauthorized");
          const info = document.getElementById("unauth-role-info");
          if (info) info.textContent = cfg.MESSAGES.ROLE_UNKNOWN;
          if (window.soundFX) window.soundFX.play("wrong");
          return;
        }

        // Gunakan return URL bila merupakan rute yang diizinkan (deep link)
        let target = middleware.defaultDashboardFor(role);
        const returnUrl = auth.getReturnUrl();
        if (returnUrl && !cfg.PUBLIC_ROUTES.includes(returnUrl)) {
          const route = cfg.ROUTES[returnUrl];
          if (route && middleware.canAccessRoute(res.user, returnUrl)) {
            target = returnUrl;
          }
        }
        if (!target) target = "index.html";

        if (window.soundFX) window.soundFX.play("success");
        setTimeout(() => {
          window.location.href = target;
        }, 500);
      }, 200);
    });
  });

  // ---- Lupa password (PRD Login FR-10) ----
  const forgotLink = document.getElementById("forgot-link");
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      if (window.soundFX) window.soundFX.play("click");
      showAlert("Alur reset password sedang dikembangkan. Hubungi administrator untuk bantuan.");
    });
  }

  // ---- Demo account shortcuts ----
  const demoMap = {
    super: "super@caprice26.id",
    admin: "admin@caprice26.id",
    operator: "operator@caprice26.id",
    viewer: "viewer@caprice26.id",
    inactive: "nonaktif@caprice26.id",
    locked: "terkunci@caprice26.id",
  };
  const passMap = {
    super: "super123",
    admin: "admin123",
    operator: "operator123",
    viewer: "viewer123",
    inactive: "pass123",
    locked: "pass123",
  };
  document.querySelectorAll("[data-role]").forEach((item) => {
    item.addEventListener("click", () => {
      const role = item.getAttribute("data-role");
      const identifier = document.getElementById("login-identifier");
      if (identifier) identifier.value = demoMap[role] || role;
      if (passInput) passInput.value = passMap[role] || "";
      clearErrors();
      if (window.soundFX) window.soundFX.play("click");
    });
  });

  // ---- Inactive view actions ----
  const inactiveBack = document.getElementById("inactive-back");
  if (inactiveBack) {
    inactiveBack.addEventListener("click", () => {
      auth.destroySession();
      showStatus("login");
      clearErrors();
    });
  }
  const inactiveContact = document.getElementById("inactive-contact");
  if (inactiveContact) {
    inactiveContact.addEventListener("click", () => {
      window.location.href = "kontak.html";
    });
  }

  // ---- Unauthorized view actions ----
  const unauthBack = document.getElementById("unauth-back");
  if (unauthBack) {
    unauthBack.addEventListener("click", () => {
      const u = auth.getUser();
      const d = u && middleware.defaultDashboardFor(u.role);
      window.location.href = d || "index.html";
    });
  }
  const unauthLogout = document.getElementById("unauth-logout");
  if (unauthLogout) {
    unauthLogout.addEventListener("click", () => {
      auth.logout();
      window.location.href = "login.html";
    });
  }

  // ---- Session expired view ----
  const sessionBack = document.getElementById("session-back");
  if (sessionBack) {
    sessionBack.addEventListener("click", () => {
      auth.destroySession();
      showStatus("login");
    });
  }

  // ---- Deep link & session expired (PRD Login §7.3, §7.5) ----
  const params = new URLSearchParams(window.location.search);
  if (params.get("mode") === "expired") {
    showStatus("expired");
    auth.destroySession();
    return;
  }
  if (params.get("mode") === "unauthorized") {
    showStatus("unauthorized");
    return;
  }
  if (params.get("mode") === "inactive") {
    showStatus("inactive");
    return;
  }
});
