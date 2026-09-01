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

  const toggleMenu = () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    soundFX.play("click");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (menu.classList.contains("open")) {
        toggleMenu();
      }
    });
  });

  // Close when clicking outside menu
  document.addEventListener("click", (e) => {
    if (menu.classList.contains("open") && !menu.contains(e.target) && !toggle.contains(e.target)) {
      toggleMenu();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) {
      toggleMenu();
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

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      contents.forEach((c) => (c.style.display = "none"));

      tab.classList.add("active");
      const target = tab.getAttribute("data-day");
      const activeContent = document.getElementById(`schedule-${target}`);
      if (activeContent) activeContent.style.display = "flex";
      soundFX.play("click");
    });
  });

  const now = new Date();
  const options = { timeZone: "Asia/Jakarta", hour: "numeric", minute: "numeric", weekday: "long" };
  const formatter = new Intl.DateTimeFormat("id-ID", options);
  const parts = formatter.formatToParts(now);
  const dayName = parts.find((p) => p.type === "weekday")?.value || "";

  const liveTrackerText = document.getElementById("live-tracker-info");
  if (liveTrackerText) {
    const hours = now.getHours();
    if (hours >= 7 && hours < 15) {
      liveTrackerText.innerHTML = `<strong>Kegiatan Belajar Sedang Berlangsung</strong> &bull; Hari ini: <strong>${dayName}</strong>`;
    } else {
      liveTrackerText.innerHTML = `<strong>Waktu Istirahat / Belajar Mandiri</strong> &bull; Sampai jumpa di kelas besok!`;
    }
  }
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
// 14. ROLE-BASED LOGIN & AUTHENTICATION FLOW (PRD LOGIN-ROLE-001)
// ==========================================================================
const AUTH_CONFIG = {
  // Route default per role (role berasal dari sumber server tervalidasi)
  routes: {
    admin: "index.html",
    manager: "index.html",
    staff: "index.html",
  },
  // Matriks akses: fitur/menu yang boleh diakses tiap role
  access: {
    admin: ["dashboard", "user-management", "reports", "tasks", "settings", "profile"],
    manager: ["dashboard", "reports", "tasks", "profile"],
    staff: ["dashboard", "tasks", "profile"],
  },
};

// Status pesan (copy mengikuti PRD section 11)
const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: "Email/username atau password tidak sesuai.",
  ACCOUNT_INACTIVE: "Akun Anda belum aktif. Hubungi administrator atau periksa instruksi aktivasi.",
  ACCOUNT_LOCKED: "Akun ini sedang dikunci sementara. Silakan coba lagi nanti atau hubungi administrator.",
  ACCOUNT_DISABLED: "Akun ini tidak dapat digunakan. Hubungi administrator.",
  TOO_MANY_ATTEMPTS: "Terlalu banyak percobaan. Coba lagi nanti atau reset password.",
  SERVER_ERROR: "Login sedang mengalami gangguan. Silakan coba lagi.",
};

// Skema akun demo — DALAM PRODUKSI TIDAK BOLEH ADA DI CLIENT.
// Role, status, dan redirect harus berasal dari respons server tervalidasi.
const AUTH_DEMO_USERS = [
  { id: "u_admin", identifier: "admin@caprice26.id", password: "admin123", displayName: "Administrator Caprice", role: "admin", status: "active" },
  { id: "u_mgr", identifier: "manager@caprice26.id", password: "manager123", displayName: "Manager Caprice", role: "manager", status: "active" },
  { id: "u_staff", identifier: "staff@caprice26.id", password: "staff123", displayName: "Staff Caprice", role: "staff", status: "active" },
  { id: "u_inactive", identifier: "nonaktif@caprice26.id", password: "pass123", displayName: "Akun Belum Aktif", role: "staff", status: "inactive" },
  { id: "u_locked", identifier: "terkunci@caprice26.id", password: "pass123", displayName: "Akun Terkunci", role: "staff", status: "locked" },
];

let currentUser = null;

function initRoleBasedAuth() {
  const loginForm = document.getElementById("login-form");
  if (!loginForm) return;

  const views = {
    expired: document.getElementById("view-session-expired"),
    unauthorized: document.getElementById("view-unauthorized"),
    inactive: document.getElementById("view-account-inactive"),
  };

  const showView = (key) => {
    document.getElementById("view-login").hidden = true;
    Object.values(views).forEach((v) => { if (v) v.hidden = true; });
    if (key === "login") {
      document.getElementById("view-login").hidden = false;
    } else if (views[key]) {
      views[key].hidden = false;
    }
    soundFX.play("click");
  };

  // --- Toggle visibility password ---
  const toggleBtn = document.getElementById("toggle-password");
  const passInput = document.getElementById("login-password");
  if (toggleBtn && passInput) {
    toggleBtn.addEventListener("click", () => {
      const isVisible = passInput.type === "text";
      passInput.type = isVisible ? "password" : "text";
      toggleBtn.setAttribute("aria-pressed", String(!isVisible));
      toggleBtn.innerHTML = isVisible ? "👁" : "🙈";
      toggleBtn.setAttribute("aria-label", isVisible ? "Tampilkan password" : "Sembunyikan password");
      soundFX.play("click");
    });
  }

  // --- Set error state pada field (FR-02, FR-03) ---
  const setFieldError = (fieldId, msg) => {
    const group = document.getElementById(`fld-${fieldId}`);
    const errEl = document.getElementById(`err-${fieldId}`);
    if (group) group.classList.toggle("has-error", Boolean(msg));
    if (errEl) {
      errEl.textContent = msg || "";
      errEl.setAttribute("aria-live", msg ? "assertive" : "off");
    }
    return Boolean(msg);
  };

  const clearFieldErrors = () => {
    setFieldError("identifier", "");
    setFieldError("password", "");
    const alert = document.getElementById("login-alert");
    if (alert) alert.hidden = true;
  };

  const showAlert = (msg) => {
    const alertEl = document.getElementById("login-alert");
    if (alertEl) {
      alertEl.textContent = msg;
      alertEl.hidden = !msg;
    }
  };

  const setLoading = (loading) => {
    const submit = document.getElementById("login-submit");
    const identifier = document.getElementById("login-identifier");
    const password = document.getElementById("login-password");
    if (submit) submit.classList.toggle("loading", loading);
    if (identifier) identifier.disabled = loading;
    if (password) password.disabled = loading;
    if (toggleBtn) toggleBtn.disabled = loading;
  };

  // --- Simulasi panggilan autentikasi ke backend ---
  // Di produksi, ganti dengan fetch() ke endpoint nyata. Respons dipetakan
  // dari server, bukan dari input bebas pengguna (PRD section 12 & 13).
  const simulateAuth = (identifier, password) =>
    new Promise((resolve) => {
      setTimeout(() => {
        // FR-06: kredensial salah -> pesan generik
        const user = AUTH_DEMO_USERS.find(
          (u) => u.identifier.toLowerCase() === identifier.trim().toLowerCase()
        );
        if (!user || user.password !== password) {
          resolve({ ok: false, error: { code: "INVALID_CREDENTIALS" } });
          return;
        }
        if (!AUTH_CONFIG.routes[user.role]) {
          resolve({ ok: true, user, redirectTo: null, unknownRole: true });
          return;
        }
        // Status akun khusus -> halaman status
        if (user.status !== "active") {
          resolve({ ok: true, user, accountStatus: user.status });
          return;
        }
        resolve({ ok: true, user, redirectTo: AUTH_CONFIG.routes[user.role] });
      }, 1200);
    });

  const handleAuthSuccess = (user, redirectTo, accountStatus) => {
    currentUser = user;
    window.sessionStorage.setItem("caprice-user", JSON.stringify(user));

    if (accountStatus === "inactive" || accountStatus === "locked" || accountStatus === "disabled") {
      showView("inactive");
      const icon = document.getElementById("inactive-icon");
      const title = document.getElementById("inactive-title");
      const desc = document.getElementById("inactive-desc");
      if (accountStatus === "inactive" || accountStatus === "disabled") {
        if (icon) icon.textContent = "⏸️";
        if (title) title.textContent = "Akun belum dapat digunakan";
        if (desc) desc.textContent = AUTH_MESSAGES.ACCOUNT_INACTIVE;
      } else {
        if (icon) icon.textContent = "🔒";
        if (title) title.textContent = "Akun sedang terkunci";
        if (desc) desc.textContent = AUTH_MESSAGES.ACCOUNT_LOCKED;
      }
      soundFX.play("wrong");
      return;
    }

    // Role tidak dikenal -> fallback aman (PRD 13.4)
    if (!redirectTo) {
      showView("unauthorized");
      const info = document.getElementById("unauth-role-info");
      if (info) info.textContent = "Peran akun Anda tidak dikenali sistem. Silakan hubungi administrator.";
      soundFX.play("wrong");
      return;
    }

    // Gunakan return URL bila aman & diizinkan (FR-09, PRD 13.3)
    const returnUrl = sessionStorage.getItem("caprice-return-url");
    const safeReturn = resolveSafeReturn(returnUrl);
    soundFX.play("success");
    setTimeout(() => {
      window.location.href = safeReturn || redirectTo;
    }, 500);
  };

  const handleAuthFailure = (code) => {
    const msg = AUTH_MESSAGES[code] || AUTH_MESSAGES.SERVER_ERROR;
    showAlert(msg);
    // FR-06: identifier dipertahankan, password dikosongkan
    if (passInput) passInput.value = "";
    if (passInput) passInput.focus();
    soundFX.play("wrong");
  };

  // --- Submit form (FR-05: loading & cegah submit ganda) ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const identifier = document.getElementById("login-identifier");
    const password = document.getElementById("login-password");

    clearFieldErrors();

    // Validasi client-side (FR-02, FR-03)
    let valid = true;
    if (!identifier.value.trim()) {
      valid = setFieldError("identifier", "Masukkan email atau username.") && valid;
    }
    if (!password.value) {
      valid = setFieldError("password", "Masukkan password.") && valid;
    }
    if (!valid) {
      soundFX.play("wrong");
      return;
    }

    // Anti submit ganda
    if (document.getElementById("login-submit").classList.contains("loading")) return;

    setLoading(true);
    simulateAuth(identifier.value, password.value).then((res) => {
      setLoading(false);
      if (res.ok) {
        handleAuthSuccess(res.user, res.redirectTo, res.accountStatus);
      } else {
        handleAuthFailure(res.error && res.error.code);
      }
    });
  });

  // --- Lupa password (FR-10) ---
  const forgotLink = document.getElementById("forgot-link");
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      e.preventDefault();
      soundFX.play("click");
      showAlert("Alur reset password sedang dikembangkan. Hubungi administrator untuk bantuan.");
    });
  }

  // --- Demo account shortcuts ---
  document.querySelectorAll("[data-role]").forEach((item) => {
    item.addEventListener("click", () => {
      const role = item.getAttribute("data-role");
      // Map demo card ke akun
      const map = {
        admin: "admin@caprice26.id",
        manager: "manager@caprice26.id",
        staff: "staff@caprice26.id",
        inactive: "nonaktif@caprice26.id",
        locked: "terkunci@caprice26.id",
      }[role] || role;
      const identifier = document.getElementById("login-identifier");
      const password = document.getElementById("login-password");
      if (identifier) identifier.value = map;
      if (password) password.value = role === "inactive" || role === "locked" ? "pass123" : `${role}123`;
      clearFieldErrors();
      soundFX.play("click");
    });
  });

  // --- Unauthorized view actions ---
  const unauthBack = document.getElementById("unauth-back");
  const unauthLogout = document.getElementById("unauth-logout");
  if (unauthBack) {
    unauthBack.addEventListener("click", () => {
      soundFX.play("click");
      if (currentUser && AUTH_CONFIG.routes[currentUser.role]) {
        window.location.href = AUTH_CONFIG.routes[currentUser.role];
      } else {
        logout();
      }
    });
  }
  if (unauthLogout) unauthLogout.addEventListener("click", logout);

  // --- Inactive / locked view actions ---
  const inactiveBack = document.getElementById("inactive-back");
  const inactiveContact = document.getElementById("inactive-contact");
  if (inactiveBack) {
    inactiveBack.addEventListener("click", () => {
      soundFX.play("click");
      window.sessionStorage.removeItem("caprice-user");
      currentUser = null;
      showView("login");
      clearFieldErrors();
    });
  }
  if (inactiveContact) {
    inactiveContact.addEventListener("click", () => {
      soundFX.play("click");
      window.location.href = "kontak.html";
    });
  }

  // --- Session expired view action ---
  const sessionBack = document.getElementById("session-back");
  if (sessionBack) {
    sessionBack.addEventListener("click", () => {
      soundFX.play("click");
      showView("login");
      clearFieldErrors();
    });
  }

  // --- Deep-link & session expired handling ---
  handleSessionState();
}

// Validasi return URL: hanya route internal yang diizinkan (PRD 13.3).
// Daftar route internal aman; semua role kembali ke halaman utama pada demo statis.
const SAFE_INTERNAL_ROUTES = ["index.html", "struktur.html", "jadwal.html", "galeri.html", "proyek.html", "prestasi.html", "bukutamu.html", "lab-game.html", "kontak.html"];

function resolveSafeReturn(returnUrl) {
  if (!returnUrl) return null;
  try {
    const url = new URL(returnUrl, window.location.origin);
    if (url.origin !== window.location.origin) return null; // tolak URL eksternal
    const path = decodeURIComponent(url.pathname).replace(/^\//, "");
    if (SAFE_INTERNAL_ROUTES.includes(path)) return url.pathname.replace(/^\//, "");
    return null;
  } catch (e) {
    return null;
  }
}

function logout() {
  soundFX.play("click");
  window.sessionStorage.removeItem("caprice-user");
  window.sessionStorage.removeItem("caprice-return-url");
  currentUser = null;
  const views = document.querySelectorAll("[id^='view-']");
  views.forEach((v) => { if (v) v.hidden = true; });
  const loginView = document.getElementById("view-login");
  if (loginView) loginView.hidden = false;
  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.reset();
  clearFieldErrorsGlobal();
}

function clearFieldErrorsGlobal() {
  const alert = document.getElementById("login-alert");
  if (alert) alert.hidden = true;
  ["identifier", "password"].forEach((f) => {
    const group = document.getElementById(`fld-${f}`);
    if (group) group.classList.remove("has-error");
  });
}

// Deep link + session-expired simulation (PRD 7.3 & 7.5)
function handleSessionState() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");

  if (mode === "expired") {
    const expired = document.getElementById("view-session-expired");
    if (expired) expired.hidden = false;
    document.getElementById("view-login").hidden = true;
    return;
  }

  if (mode === "unauthorized") {
    const unauthorized = document.getElementById("view-unauthorized");
    const info = document.getElementById("unauth-role-info");
    if (info) {
      info.innerHTML =
        'Peran Anda: <strong>Staff</strong><br>Halaman ini hanya tersedia untuk Admin.';
    }
    if (unauthorized) unauthorized.hidden = false;
    document.getElementById("view-login").hidden = true;
    return;
  }

  // Deteksi sesi aktif
  const storedUser = sessionStorage.getItem("caprice-user");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && AUTH_CONFIG.routes[user.role]) {
        // Sudah login → langsung ke dashboard role
        window.location.replace(AUTH_CONFIG.routes[user.role]);
      }
    } catch (e) {
      /* abaikan */
    }
  }
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
