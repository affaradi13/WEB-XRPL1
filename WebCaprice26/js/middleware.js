/**
 * WEBCAPRICE 26 — ROLE-BASED MIDDLEWARE
 * Modul kontrol akses berbasis role (RBAC) sesuai PRD Middleware.
 *
 * Menyediakan:
 *  - guardRoute()      : proteksi halaman berdasarkan route (FR-01, FR-05)
 *  - hasPermission()   : evaluator permission (FR-03)
 *  - renderMenu()      : menu dinamis sesuai role (FR-07)
 *  - Fail-closed       : jika tidak yakin, TOLAK akses (PRD NFR: Reliabilitas)
 */

"use strict";

window.CapriceMiddleware = (function () {
  const cfg = window.CAPRICE_CONFIG;
  const auth = window.CapriceAuth;

  // ---- Evaluator permission (FR-03) ----
  function roleHasPermission(role, permission) {
    const roles = cfg.PERMISSIONS[permission];
    if (!roles) return false; // permission tidak dikenal -> tolak
    return roles.includes(role);
  }

  // ---- Evaluator route (FR-05) ----
  // routeConfig: { requiredRole?, requiredPermission? }
  function canAccessRoute(user, routeName) {
    if (!user) return false; // fail-closed: belum login
    if (user.status !== "active") return false; // FR-02 status akun

    const route = cfg.ROUTES[routeName];
    if (!route) return false; // route tidak terdaftar -> tolak (FR-05)

    // requiredRole (role harus PERSIS sesuai)
    if (route.requiredRole) {
      if (user.role !== route.requiredRole) return false;
      // role harus dikenali
      if (!cfg.ROLES[user.role]) return false;
    }

    // requiredPermission
    if (route.requiredPermission) {
      if (!roleHasPermission(user.role, route.requiredPermission)) return false;
    }

    // role tidak dikenal
    if (!cfg.ROLES[user.role]) return false;

    return true;
  }

  /**
   * Route guard utama.
   * Mengembalikan salah satu:
   *   { type: "ok" }
   *   { type: "redirect", to: "login.html" }        -> belum login
   *   { type: "redirect", to: "forbidden.html" }    -> sudah login tapi tak diizinkan
   *   { type: "redirect", to: "unauthorized.html" } -> role tidak dikenal
   */
  function guardRoute(routeName) {
    const user = auth.getUser();

    // Belum login: simpan return URL & arahkan ke login (FR-01, AC-01)
    if (!user) {
      const current = window.location.pathname.split("/").pop() || "index.html";
      auth.setReturnUrl(current);
      return { type: "redirect", to: "login.html" };
    }

    // Akun tidak aktif / terkunci
    if (user.status !== "active") {
      return { type: "redirect", to: "login.html?mode=inactive" };
    }

    // Role tidak dikenali (FR-04) -> fallback aman
    if (!cfg.ROLES[user.role]) {
      return { type: "redirect", to: "unauthorized.html" };
    }

    if (!canAccessRoute(user, routeName)) {
      // Sudah login tapi tidak berizin -> 403 forbidden (AC-03)
      return { type: "redirect", to: "forbidden.html" };
    }

    return { type: "ok" };
  }

  // ---- Menu dinamis (FR-07) ----
  // Render menu sebagai <li> dalam <ul id="dashboard-nav-list"> (jika ada)
  function renderMenu(user, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = cfg.MENUS[user.role] || [];
    const current = window.location.pathname.split("/").pop() || "index.html";

    container.innerHTML = items
      .map(
        (item) => `
        <li>
          <a href="${item.href}" class="dash-nav-link ${current === item.href ? "active" : ""}">
            <span class="dash-nav-icon">${item.icon}</span>
            <span>${item.label}</span>
          </a>
        </li>
      `
      )
      .join("");
  }

  // Header user info + logout (pada dashboard)
  function renderUserBar(user, containerId, logoutBtnId) {
    const container = document.getElementById(containerId);
    if (container) {
      const role = cfg.ROLES[user.role];
      container.innerHTML = `
        <span class="dash-user-name">${escapeHtml(user.displayName || user.identifier)}</span>
        <span class="tech-badge dash-role-badge">${role ? role.label : user.role}</span>
      `;
    }
    const logoutBtn = document.getElementById(logoutBtnId);
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        auth.logout();
        window.location.href = "login.html";
      });
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  }

  // ---- Redirect ke dashboard sesuai role (PRD Login §13, Middleware FR-04) ----
  function defaultDashboardFor(role) {
    const r = cfg.ROLES[role];
    return r ? r.dashboard : null;
  }

  return {
    roleHasPermission,
    canAccessRoute,
    guardRoute,
    renderMenu,
    renderUserBar,
    defaultDashboardFor,
    escapeHtml,
  };
})();
