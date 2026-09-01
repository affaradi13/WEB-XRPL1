/**
 * WEBCAPRICE 26 — SITE AUTH UI (Halaman Publik)
 * Memperbarui tombol login/akun di navbar halaman publik berdasarkan sesi.
 * Tidak melakukan otorisasi; hanya meningkatkan UX (PRD Middleware FR-07:
 * frontend boleh menyembunyikan/menampilkan menu, backend tetap sumber kebenaran).
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const auth = window.CapriceAuth;
  const cfg = window.CAPRICE_CONFIG;
  if (!auth || !cfg) return;

  const user = auth.getUser();
  const portalLink = document.querySelector('a[href="login.html"].btn');

  if (!portalLink) return;

  if (user) {
    const role = cfg.ROLES[user.role];
    const label = "Dashboard";
    const target = role ? role.dashboard : "login.html";
    portalLink.textContent = label;
    portalLink.href = target;
    portalLink.classList.remove("btn-primary");
    portalLink.classList.add("btn-secondary");
  }
});
