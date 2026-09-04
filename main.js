/**
 * WEBCAPRICE 26 — INTERACTIVE ENGINE & VISUAL EFFECTS
 * SMK Negeri 1 Kota Probolinggo — Kelas X RPL 1
 */

"use strict";

// ==========================================================================
// 1. SOUND FX SYNTHESIZER (WEB AUDIO API)
// ==========================================================================
class SoundFXEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem("caprice-sound") !== "muted";
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem("caprice-sound", this.enabled ? "enabled" : "muted");
    this.updateSoundButton();
    if (this.enabled) {
      this.play("click");
    }
  }

  updateSoundButton() {
    const btn = document.getElementById("sound-toggle-btn");
    if (btn) {
      btn.innerHTML = this.enabled ? "🔊" : "🔇";
      btn.title = this.enabled ? "Suara Aktif (Klik untuk mute)" : "Suara Nonaktif (Klik untuk aktifkan)";
      btn.classList.toggle("active", this.enabled);
    }
  }

  play(type) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === "hover") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.05);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "click") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === "correct") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.09);
        osc.frequency.setValueAtTime(783.99, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.25);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (e) {
      console.warn("Audio issue:", e);
    }
  }
}

const soundFX = new SoundFXEngine();

// ==========================================================================
// 2. CANVAS INTERACTIVE PARTICLE SYSTEM
// ==========================================================================
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 150 };
    this.particleCount = window.innerWidth < 768 ? 35 : 70;

    this.resize();
    this.init();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        size: Math.random() * 2.5 + 1,
        color: this.getRandomColor(),
      });
    }
  }

  getRandomColor() {
    const colors = [
      "rgba(99, 102, 241, 0.7)",
      "rgba(139, 92, 246, 0.7)",
      "rgba(6, 182, 212, 0.7)",
      "rgba(236, 72, 153, 0.6)",
      "rgba(255, 255, 255, 0.4)",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.init();
    });

    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener("mouseleave", () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = p.color;
      this.ctx.fill();

      for (let j = i + 1; j < this.particles.length; j++) {
        const p2 = this.particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 110) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${0.35 * (1 - dist / 110)})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }
    }
  }
}

// ==========================================================================
// 3. CUSTOM CURSOR & GLOW EFFECT
// ==========================================================================
function initCustomCursor() {
  const dot = document.querySelector(".custom-cursor-dot");
  const ring = document.querySelector(".custom-cursor-ring");
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, select, .member-card, .gallery-card, .project-card, .page-card, .day-tab, .filter-btn"
  );
  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("active");
      soundFX.play("hover");
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("active");
    });
    el.addEventListener("click", () => {
      soundFX.play("click");
    });
  });
}

// ==========================================================================
// 4. THEME & ACCENT ENGINE
// ==========================================================================
function initThemeEngine() {
  const currentTheme = localStorage.getItem("caprice-theme") || "dark";
  const currentAccent = localStorage.getItem("caprice-accent") || "indigo";

  if (currentTheme === "light") {
    document.body.classList.add("light-mode");
  }
  if (currentAccent !== "indigo") {
    document.documentElement.setAttribute("data-accent", currentAccent);
  }

  // Dark/Light Toggle
  const themeBtn = document.getElementById("theme-toggle-btn");
  if (themeBtn) {
    themeBtn.innerHTML = currentTheme === "light" ? "☀️" : "🌙";
    themeBtn.addEventListener("click", () => {
      const isLight = document.body.classList.toggle("light-mode");
      localStorage.setItem("caprice-theme", isLight ? "light" : "dark");
      themeBtn.innerHTML = isLight ? "☀️" : "🌙";
      soundFX.play("click");
    });
  }

  // Accent Palette Toggle
  const accentBtn = document.getElementById("accent-toggle-btn");
  const paletteMenu = document.getElementById("accent-palette-menu");
  if (accentBtn && paletteMenu) {
    accentBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      paletteMenu.classList.toggle("open");
      soundFX.play("click");
    });

    document.querySelectorAll(".accent-dot").forEach((dot) => {
      const accent = dot.getAttribute("data-accent");
      if (accent === currentAccent) dot.classList.add("active");

      dot.addEventListener("click", () => {
        document.querySelectorAll(".accent-dot").forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");

        if (accent === "indigo") {
          document.documentElement.removeAttribute("data-accent");
        } else {
          document.documentElement.setAttribute("data-accent", accent);
        }
        localStorage.setItem("caprice-accent", accent);
        paletteMenu.classList.remove("open");
        soundFX.play("success");
      });
    });

    document.addEventListener("click", () => {
      paletteMenu.classList.remove("open");
    });
  }

  // Sound Toggle Button
  const soundBtn = document.getElementById("sound-toggle-btn");
  if (soundBtn) {
    soundFX.updateSoundButton();
    soundBtn.addEventListener("click", () => {
      soundFX.toggle();
    });
  }
}

// ==========================================================================
// 5. 3D TILT EFFECT ON CARDS
// ==========================================================================
function init3DTilt() {
  const cards = document.querySelectorAll(".tilt-card, .member-card, .page-card, .project-card, .gallery-card, .trophy-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    });
  });
}

// ==========================================================================
// 6. TYPEWRITER EFFECT
// ==========================================================================
function initTypewriter() {
  const typewriterEl = document.getElementById("typewriter-text");
  if (!typewriterEl) return;

  const phrases = [
    "Satu Visi, Seribu Baris Kode, Sejuta Kenangan!",
    "Rekayasa Perangkat Lunak 1 &bull; Caprice Team 26",
    "SMK Negeri 1 Kota Probolinggo &bull; Unggul & Berprestasi",
    "Calon Full-Stack Developer & Tech Innovator Masa Depan",
    "Membangun Solidaritas Lewat Karya & Kebersamaan",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typewriterEl.innerHTML = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      delay = 45;
    } else {
      typewriterEl.innerHTML = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      delay = 90;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      delay = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  type();
}

// ==========================================================================
// 7. SCROLL PROGRESS & REVEAL ANIMATIONS
// ==========================================================================
function initScrollEngine() {
  const progressBar = document.getElementById("scroll-progress");
  const header = document.querySelector(".site-header");
  const backToTop = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (header) header.classList.toggle("scrolled", window.scrollY > 40);
    if (backToTop) backToTop.classList.toggle("visible", window.scrollY > 400);
  });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      soundFX.play("click");
    });
  }

  const reveals = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));
}

// ==========================================================================
// 8. MOBILE HAMBURGER NAVIGATION (FIXED & ROBUST)
// ==========================================================================
function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu-wrapper");
  if (!toggle || !menu) return;

  const isMobileNav = () => window.matchMedia("(max-width: 1080px)").matches;

  const setBodyScroll = (lock) => {
    if (lock && isMobileNav()) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  };

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    setBodyScroll(isOpen);
    soundFX.play("click");
  };

  const closeMenu = () => {
    if (menu.classList.contains("open")) {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      setBodyScroll(false);
    }
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Dropdown toggle for RPL Lab
  const dropdownParent = document.querySelector(".nav-item-dropdown");
  const dropdownToggle = document.querySelector(".nav-dropdown-toggle");

  if (dropdownToggle && dropdownParent) {
    // If the active page is inside the dropdown, pre-open dropdown on mobile for clear context
    if (dropdownParent.querySelector(".dropdown-item.active") && isMobileNav()) {
      dropdownParent.classList.add("open");
      dropdownToggle.setAttribute("aria-expanded", "true");
    }

    dropdownToggle.addEventListener("click", (e) => {
      // In mobile view, toggle accordion dropdown smoothly
      if (isMobileNav()) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = dropdownParent.classList.toggle("open");
        dropdownToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        soundFX.play("click");
      }
    });
  }

  // Regular links and dropdown item links close the mobile menu
  document.querySelectorAll(".nav-link:not(.nav-dropdown-toggle), .dropdown-item").forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  // Close when clicking outside menu or dropdown
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("open") && !menu.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
    if (dropdownParent && !dropdownParent.contains(e.target) && !isMobileNav()) {
      dropdownParent.classList.remove("open");
      if (dropdownToggle) dropdownToggle.setAttribute("aria-expanded", "false");
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      if (dropdownParent && !isMobileNav()) {
        dropdownParent.classList.remove("open");
        if (dropdownToggle) dropdownToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // Handle window resize cleanly between mobile and desktop
  window.addEventListener("resize", () => {
    if (!isMobileNav()) {
      closeMenu();
      dropdownParent?.classList.remove("open");
      dropdownToggle?.setAttribute("aria-expanded", "false");
    }
  });
}

// ==========================================================================
// 9. LIGHTBOX VIEWER (GALERI)
// ==========================================================================
function initLightbox() {
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");

  if (!modal || !img) return;

  const galleryItems = Array.from(document.querySelectorAll(".gallery-card"));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const card = galleryItems[index];
    const src = card.getAttribute("data-full-img") || card.querySelector("img").src;
    const title = card.querySelector(".gallery-title") ? card.querySelector(".gallery-title").innerText : "";
    const meta = card.querySelector(".gallery-meta") ? card.querySelector(".gallery-meta").innerText : "";

    img.src = src;
    caption.innerHTML = `<strong>${title}</strong><br><span style="font-size:0.85rem; color:#94a3b8;">${meta}</span>`;
    modal.classList.add("open");
    soundFX.play("click");
  }

  galleryItems.forEach((card, idx) => {
    card.addEventListener("click", () => openLightbox(idx));
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => modal.classList.remove("open"));
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(currentIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      openLightbox(currentIndex);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape") modal.classList.remove("open");
    if (e.key === "ArrowLeft" && prevBtn) prevBtn.click();
    if (e.key === "ArrowRight" && nextBtn) nextBtn.click();
  });
}

// ==========================================================================
// 10. JADWAL INTERAKTIF & LIVE TRACKER
// ==========================================================================
function initSchedule() {
  const tabs = document.querySelectorAll(".day-tab");
  const contents = document.querySelectorAll(".schedule-day-content");
  if (!tabs.length) return;

  function switchTab(dayKey) {
    const targetTab = Array.from(tabs).find((t) => t.getAttribute("data-day") === dayKey);
    if (!targetTab) return;
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => (c.style.display = "none"));
    targetTab.classList.add("active");
    const activeContent = document.getElementById(`schedule-${dayKey}`);
    if (activeContent) activeContent.style.display = "flex";
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-day");
      switchTab(target);
      soundFX.play("click");
    });
  });

  function updateLiveTracker() {
    const now = new Date();
    const clockEl = document.getElementById("live-clock");
    const liveTrackerText = document.getElementById("live-tracker-info");

    const timeString = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta",
    });

    const dayName = now.toLocaleDateString("id-ID", {
      weekday: "long",
      timeZone: "Asia/Jakarta",
    });

    if (clockEl) {
      clockEl.innerHTML = `${dayName}, ${timeString} WIB`;
    }

    if (liveTrackerText) {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const isWeekday = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"].includes(dayName);

      if (isWeekday && totalMinutes >= 6 * 60 + 45 && totalMinutes <= 15 * 60 + 20) {
        liveTrackerText.innerHTML = `<strong>Kegiatan Belajar Sedang Berlangsung</strong> &bull; Hari ini: <strong>${dayName}</strong>`;
      } else if (isWeekday && totalMinutes > 15 * 60 + 20 && totalMinutes <= 17 * 60) {
        liveTrackerText.innerHTML = `<strong>Kegiatan Ekstrakurikuler / Belajar Mandiri</strong> &bull; Hari ini: <strong>${dayName}</strong>`;
      } else {
        liveTrackerText.innerHTML = `<strong>Waktu Istirahat / Belajar Mandiri</strong> &bull; Sampai jumpa di kelas besok!`;
      }
    }
  }

  // Auto switch tab ke hari ini (Senin - Jumat)
  const todayName = new Date().toLocaleDateString("id-ID", { weekday: "long", timeZone: "Asia/Jakarta" }).toLowerCase();
  if (["senin", "selasa", "rabu", "kamis", "jumat"].includes(todayName)) {
    switchTab(todayName);
  }

  updateLiveTracker();
  setInterval(updateLiveTracker, 1000);
}

// ==========================================================================
// 11. BUKU TAMU & WALL OF WISHES
// ==========================================================================
function initGuestbook() {
  const form = document.getElementById("guestbook-form");
  const feed = document.getElementById("guestbook-feed");
  if (!form || !feed) return;

  const defaultMessages = [
    {
      author: "Pak Dimas (Guru Produktif RPL)",
      role: "Wali Kelas / Guru",
      time: "Kemarin, 14:20 WIB",
      category: "Semangat",
      message: "Tetap semangat belajar algoritma dan terus eksplorasi teknologi baru ya anak-anak Caprice 26! Banggakan SMKN 1 Probolinggo!",
      likes: 24,
    },
    {
      author: "Caesar Arkan Athariz",
      role: "Ketua Kelas",
      time: "2 hari lalu",
      category: "Keluarga",
      message: "Terima kasih untuk semua teman-teman X RPL 1 yang selalu kompak dan solid. Semoga kita sukses bersama sampai lulus!",
      likes: 19,
    },
    {
      author: "Kiki Aurelia",
      role: "Wakil Ketua",
      time: "3 hari lalu",
      category: "Pesan",
      message: "Website kelas kita makin keren dan canggih! Jangan lupa kerjakan tugas pemrograman web ya kawan-kawan hehe.",
      likes: 15,
    },
  ];

  let stored = JSON.parse(localStorage.getItem("caprice-guestbook")) || defaultMessages;

  function renderFeed() {
    feed.innerHTML = stored
      .map(
        (item, index) => `
      <div class="guest-card animate-on-scroll in-view">
        <div class="guest-header">
          <div>
            <div class="guest-author">${item.author}</div>
            <div class="guest-time">${item.role ? `<span style="color:var(--primary);">${item.role}</span> &bull; ` : ""}${item.time}</div>
          </div>
          <span class="tech-badge">${item.category || "Pesan"}</span>
        </div>
        <div class="guest-message">&ldquo;${item.message}&rdquo;</div>
        <div class="guest-reactions">
          <button class="reaction-btn" onclick="likeGuestMessage(${index})">❤️ <span>${item.likes || 0}</span></button>
          <button class="reaction-btn" onclick="soundFX.play('click')">🔥 Keren</button>
          <button class="reaction-btn" onclick="soundFX.play('click')">👏 Solid</button>
        </div>
      </div>
    `
      )
      .join("");
  }

  window.likeGuestMessage = (index) => {
    stored[index].likes = (stored[index].likes || 0) + 1;
    localStorage.setItem("caprice-guestbook", JSON.stringify(stored));
    renderFeed();
    soundFX.play("correct");
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("gb-name");
    const catInput = document.getElementById("gb-category");
    const msgInput = document.getElementById("gb-message");

    if (!nameInput.value.trim() || !msgInput.value.trim()) return;

    const newMsg = {
      author: nameInput.value.trim(),
      role: "Pengunjung",
      time: "Baru saja",
      category: catInput ? catInput.value : "Pesan",
      message: msgInput.value.trim(),
      likes: 1,
    };

    stored.unshift(newMsg);
    localStorage.setItem("caprice-guestbook", JSON.stringify(stored));
    renderFeed();
    form.reset();
    soundFX.play("success");

    const alertBox = document.getElementById("gb-alert");
    if (alertBox) {
      alertBox.style.display = "block";
      alertBox.innerHTML = "✨ Pesan Anda berhasil dipublikasikan di dinding kenangan!";
      setTimeout(() => (alertBox.style.display = "none"), 4000);
    }
  });

  renderFeed();
}

// ==========================================================================
// 12. RPL PLAYGROUND & CODING QUIZ GAME
// ==========================================================================
function initQuizGame() {
  const quizBox = document.getElementById("quiz-container");
  if (!quizBox) return;

  const questions = [
    {
      q: "Apa tag HTML semantik yang paling tepat untuk mendefinisikan navigasi utama situs?",
      code: '<div class="menu">...</div> vs <nav>...</nav>',
      opts: ["<nav>", "<navigation>", "<menu>", "<header>"],
      ans: 0,
      expl: "<nav> adalah elemen standar HTML5 semantik untuk wadah tautan navigasi.",
    },
    {
      q: "Properti CSS apa yang digunakan untuk membuat efek blur pada latar belakang elemen (Glassmorphism)?",
      code: "card { ... : blur(16px); }",
      opts: ["background-filter", "backdrop-filter", "box-blur", "filter-drop"],
      ans: 1,
      expl: "backdrop-filter: blur(...) memberikan efek kaca buram pada area di belakang elemen.",
    },
    {
      q: "Dalam JavaScript, metode array mana yang digunakan untuk menghasilkan array baru hasil transformasi elemen?",
      code: "const squared = numbers....(n => n * n);",
      opts: ["filter()", "forEach()", "map()", "reduce()"],
      ans: 2,
      expl: "Array.prototype.map() mengembalikan array baru berdasarkan hasil fungsi terhadap setiap elemen.",
    },
    {
      q: "Dalam Python, struktur data apa yang menyimpan pasangan kunci-nilai (Key-Value)?",
      code: 'student = {"nama": "Caesar", "kelas": "X RPL 1"}',
      opts: ["Tuple", "List", "Dictionary", "Set"],
      ans: 2,
      expl: "Dictionary (dict) menyimpan pasangan key-value diapit tanda kurung kurawal {}.",
    },
    {
      q: "Perintah Git apa yang digunakan untuk mengunduh kode terbaru dari repositori remote?",
      code: "$ git ... origin main",
      opts: ["git push", "git pull", "git commit", "git clone"],
      ans: 1,
      expl: "git pull mengambil (fetch) dan menggabungkan (merge) perubahan dari repositori remote.",
    },
  ];

  let curQ = 0;
  let score = 0;

  function renderQuestion() {
    if (curQ >= questions.length) {
      quizBox.innerHTML = `
        <div style="text-align:center; padding: 2rem 0;">
          <div style="font-size: 4rem; margin-bottom: 1rem;">🏆</div>
          <h3 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem;">Kuis Selesai!</h3>
          <p style="font-size: 1.2rem; color: var(--text-muted); margin-bottom: 1.5rem;">Skor Anda: <strong style="color:var(--primary); font-size: 1.8rem;">${score} / ${questions.length * 20}</strong></p>
          <p style="margin-bottom: 2rem; color: var(--text-muted);">${score >= 80 ? "Luar biasa! Pemahaman coding kamu sangat matang!" : "Bagus! Terus asah logika dan sintaks coding kamu!"}</p>
          <button class="btn btn-primary" onclick="initQuizGame()">Ulangi Kuis 🔄</button>
        </div>
      `;
      soundFX.play("success");
      return;
    }

    const qData = questions[curQ];
    quizBox.innerHTML = `
      <div class="game-quiz-header">
        <span style="font-weight: 700;">Pertanyaan ${curQ + 1} dari ${questions.length}</span>
        <span class="quiz-score-badge">Skor: ${score}</span>
      </div>
      <div class="quiz-question-box">
        <h4 class="quiz-question-title">${qData.q}</h4>
        ${qData.code ? `<div class="code-snippet">${qData.code}</div>` : ""}
        <div class="quiz-options">
          ${qData.opts
            .map(
              (opt, idx) => `
            <button class="quiz-opt-btn" onclick="handleQuizAnswer(${idx})">${opt}</button>
          `
            )
            .join("")}
        </div>
      </div>
      <div id="quiz-feedback" style="margin-top:1rem; font-weight:600; display:none;"></div>
    `;
  }

  window.handleQuizAnswer = (selectedIdx) => {
    const qData = questions[curQ];
    const fb = document.getElementById("quiz-feedback");
    const btns = document.querySelectorAll(".quiz-opt-btn");

    btns.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === qData.ans) btn.classList.add("correct");
      if (idx === selectedIdx && idx !== qData.ans) btn.classList.add("wrong");
    });

    if (selectedIdx === qData.ans) {
      score += 20;
      soundFX.play("correct");
      fb.style.color = "var(--success)";
      fb.innerHTML = `Benar! ${qData.expl}`;
    } else {
      soundFX.play("wrong");
      fb.style.color = "var(--error)";
      fb.innerHTML = `Kurang tepat. ${qData.expl}`;
    }
    fb.style.display = "block";

    setTimeout(() => {
      curQ++;
      renderQuestion();
    }, 1800);
  };

  renderQuestion();
}

// ==========================================================================
// 13. SEARCH & DIRECTORY FILTER
// ==========================================================================
function initDirectoryFilter() {
  const searchInput = document.getElementById("student-search");
  const filterBtns = document.querySelectorAll(".student-filter-btn");
  const cards = document.querySelectorAll(".student-card");

  if (!cards.length) return;

  function filterCards() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const activeBtn = document.querySelector(".student-filter-btn.active");
    const selectedCategory = activeBtn ? activeBtn.getAttribute("data-filter") : "all";

    cards.forEach((card) => {
      const name = (card.getAttribute("data-name") || "").toLowerCase();
      const role = (card.getAttribute("data-role") || "").toLowerCase();
      const skills = (card.getAttribute("data-skills") || "").toLowerCase();
      const category = card.getAttribute("data-category") || "all";

      const matchesSearch = name.includes(query) || role.includes(query) || skills.includes(query);
      const matchesCategory = selectedCategory === "all" || category.includes(selectedCategory);

      if (matchesSearch && matchesCategory) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", filterCards);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      filterCards();
      soundFX.play("click");
    });
  });
}

// ==========================================================================
// 14. ROLE-BASED AUTH & MIDDLEWARE (PRD Middleware)
// ==========================================================================
// Logika autentikasi & kontrol akses dipindahkan ke modul terpisah:
//   js/config.js      -> role, permission, route, menu, pesan (sumber kebenaran)
//   js/auth.js        -> login/logout/sesi (demo)
//   js/middleware.js  -> route guard, permission evaluator, menu dinamis
// main.js fokus pada interaksi halaman publik & efek visual.
//
// Khusus halaman login (login.html), semua handler form dikerjakan oleh
// js/auth-login.js. Jika elemen login tidak ada (halaman publik), fungsi
// initRoleBasedAuth di bawah hanya menjadi no-op agar tidak error.

function initRoleBasedAuth() {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return; // halaman publik → tidak ada form login
  // Handler login dijalankan oleh js/auth-login.js
}

// ==========================================================================
// 15. FAQ ACCORDION
// ==========================================================================
function initFAQ() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const q = item.querySelector(".faq-question");
    if (q) {
      q.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        faqItems.forEach((i) => i.classList.remove("open"));
        if (!isOpen) {
          item.classList.add("open");
          soundFX.play("click");
        }
      });
    }
  });
}

// ==========================================================================
// INITIALIZATION ON DOM READY
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  new ParticleSystem("bg-canvas");
  initCustomCursor();
  initThemeEngine();
  init3DTilt();
  initTypewriter();
  initScrollEngine();
  initMobileNav();
  initLightbox();
  initSchedule();
  initGuestbook();
  initQuizGame();
  initDirectoryFilter();
  initRoleBasedAuth();
  initFAQ();
});
