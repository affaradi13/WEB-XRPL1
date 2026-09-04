/**
 * WEBCAPRICE 26 — ROLE-BASED MIDDLEWARE
 * Modul kontrol akses berbasis role (RBAC) dinamis untuk WebCaprice 26.
 *
 * Menyediakan:
 *  - guardRoute()          : proteksi halaman berdasarkan route & permission
 *  - roleHasPermission()   : evaluator permission dinamis
 *  - hasPermission()       : evaluator permission user aktif
 *  - renderMenu()          : menu dinamis sesuai role & permissions
 *  - applyDomPermissions() : sembunyikan / nonaktifkan elemen UI berdasarkan izin
 *  - renderUserBar()       : render bar status pengguna di header
 */

"use strict";

window.CapriceMiddleware = (function () {
  const cfg = window.CAPRICE_CONFIG;
  const auth = window.CapriceAuth;

  // ---- Evaluator permission dinamis ----
  function roleHasPermission(role, permission) {
    const permissions = cfg.getPermissions();
    const rolesWithPermission = permissions[permission];
    if (!rolesWithPermission) return false;
    return rolesWithPermission.includes(role);
  }

  function userHasPermission(user, permission) {
    if (!user || user.status !== "active") return false;
    return roleHasPermission(user.role, permission);
  }

  // ---- Evaluator route ----
  function canAccessRoute(user, routeName) {
    if (!user) return false;
    if (user.status !== "active") return false;

    const route = cfg.ROUTES[routeName];
    if (!route) return false;

    // requiredRole (jika ada ketentuan role spesifik)
    if (route.requiredRole) {
      if (user.role !== route.requiredRole && user.role !== "super-admin") {
        return false;
      }
    }

    // requiredPermission
    if (route.requiredPermission) {
      if (!roleHasPermission(user.role, route.requiredPermission)) {
        return false;
      }
    }

    const roles = cfg.getRoles();
    if (!roles[user.role]) return false;

    return true;
  }

  function resolvePage(page) {
    const isInPages = window.location.pathname.includes("/pages/") || window.location.pathname.endsWith("/pages");
    return isInPages ? page : `pages/${page}`;
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

    // Belum login
    if (!user) {
      const current = window.location.pathname.split("/").pop() || "index.html";
      auth.setReturnUrl(current);
      return { type: "redirect", to: resolvePage("login.html") };
    }

    // Akun tidak aktif / terkunci
    if (user.status !== "active") {
      return { type: "redirect", to: resolvePage("login.html?mode=inactive") };
    }

    // Role tidak dikenali
    const roles = cfg.getRoles();
    if (!roles[user.role]) {
      return { type: "redirect", to: resolvePage("unauthorized.html") };
    }

    // Cek izin akses route
    if (!canAccessRoute(user, routeName)) {
      return { type: "redirect", to: resolvePage("forbidden.html") };
    }

    return { type: "ok" };
  }

  // ---- Menu dinamis ----
  function renderMenu(user, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !user) return;
    const items = cfg.MENUS[user.role] || cfg.MENUS["anggota"] || [];
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

  // ---- DOM Permission Guard (Menyembunyikan / Men-disable aksi yang tidak diizinkan) ----
  function applyDomPermissions(user) {
    if (!user) return;

    // 1. Cek elemen dengan data-permission="xxx"
    document.querySelectorAll("[data-permission]").forEach((el) => {
      const requiredPerm = el.getAttribute("data-permission");
      const mode = el.getAttribute("data-permission-mode") || "hide"; // 'hide' or 'disable'
      const hasPerm = userHasPermission(user, requiredPerm);

      if (!hasPerm) {
        if (mode === "disable") {
          el.setAttribute("disabled", "true");
          el.classList.add("btn-disabled");
          el.style.pointerEvents = "none";
          el.style.opacity = "0.45";
          el.title = `Fitur memerlukan izin: ${requiredPerm}`;
        } else {
          el.style.display = "none";
        }
      } else {
        if (mode === "disable") {
          el.removeAttribute("disabled");
          el.classList.remove("btn-disabled");
          el.style.pointerEvents = "";
          el.style.opacity = "";
          el.title = "";
        } else {
          el.style.display = "";
        }
      }
    });

    // 2. Cek elemen dengan data-role="super-admin" atau "ketua-kelas"
    document.querySelectorAll("[data-allowed-roles]").forEach((el) => {
      const allowedRoles = el.getAttribute("data-allowed-roles").split(",").map((r) => r.trim());
      if (!allowedRoles.includes(user.role)) {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    });
  }

  // ---- Header user info + logout ----
  function renderUserBar(user, containerId, logoutBtnId) {
    const container = document.getElementById(containerId);
    if (container && user) {
      const roles = cfg.getRoles();
      const roleObj = roles[user.role];
      const roleLabel = roleObj ? roleObj.label : user.role;
      const badgeClass = getRoleBadgeClass(user.role);

      container.innerHTML = `
        <span class="dash-user-name">${escapeHtml(user.displayName || user.identifier)}</span>
        <span class="tech-badge dash-role-badge ${badgeClass}">${escapeHtml(roleLabel)}</span>
      `;
    }
    const logoutBtn = document.getElementById(logoutBtnId);
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        auth.logout();
        window.location.href = resolvePage("login.html");
      });
    }
  }

  function getRoleBadgeClass(role) {
    switch (role) {
      case "super-admin":
        return "badge-super-admin";
      case "ketua-kelas":
      case "admin":
        return "badge-admin";
      case "bendahara":
      case "operator":
        return "badge-bendahara";
      case "sekretaris":
        return "badge-sekretaris";
      default:
        return "badge-viewer";
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

  function defaultDashboardFor(role) {
    const roles = cfg.getRoles();
    const r = roles[role];
    return r ? r.dashboard : "dashboard-viewer.html";
  }

  return {
    roleHasPermission,
    userHasPermission,
    canAccessRoute,
    guardRoute,
    renderMenu,
    applyDomPermissions,
    renderUserBar,
    getRoleBadgeClass,
    defaultDashboardFor,
    escapeHtml,
  };
})();

