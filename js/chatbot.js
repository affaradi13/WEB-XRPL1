/**
 * Caprice AI Chatbot Widget (CapriceBot ⚡)
 * Asisten Virtual Cerdas Kelas X RPL 1 - SMK Negeri 1 Kota Probolinggo
 * Caprice Team 26
 */

(function () {
  'use strict';

  // --- KNOWLEDGE BASE KELAS X RPL 1 ---
  const KNOWLEDGE_BASE = {
    identity: {
      name: "Caprice AI (CapriceBot ⚡)",
      class: "X RPL 1 (Rekayasa Perangkat Lunak 1)",
      generation: "Caprice 26 (Angkatan 2026)",
      school: "SMK Negeri 1 Kota Probolinggo",
      motto: "Solid, Kreatif, Berprestasi, dan Berorientasi Teknologi Masa Depan",
      totalStudents: 38
    },

    pengurus: {
      ketua: "Caesar Arkan Arthariz (No. 09) - Full-Stack & Leadership",
      wakil: "Kiki Aurelia (No. 19) - UI/UX Designer & Frontend",
      sekretaris1: "Aisyah Azzahra (No. 05) - Dokumentasi & Frontend Dev",
      sekretaris2: "Nugraheni (No. 30) - Administrasi & Web Dev",
      bendahara1: "Natasya Febiola Putri Prianita (No. 29) - Keuangan & Database",
      bendahara2: "Adeleo Rivano Ibrahimovic (No. 02) - Anggaran Kelas & Backend Dev"
    },

    jadwalPelajaran: {
      senin: [
        "06.45 - 07.30 : Upacara Bendera",
        "07.30 - 09.00 : Projek IPA/S",
        "09.00 - 09.15 : Istirahat Pertama (Break 1)",
        "09.15 - 10.30 : Projek IPA/S",
        "10.35 - 11.45 : Informatika & KKA",
        "11.45 - 12.25 : Istirahat Kedua (Break 2)",
        "12.25 - 13.35 : Informatika & KKA",
        "13.35 - 15.20 : Dasar PPLG"
      ],
      selasa: [
        "06.45 - 07.30 : LDR (Literasi, Dhuha dan Recite)",
        "07.30 - 09.00 : Bahasa Inggris 1",
        "09.00 - 09.15 : Istirahat Pertama (Break 1)",
        "09.15 - 10.30 : Bahasa Inggris 1",
        "10.35 - 11.45 : Sejarah",
        "11.45 - 12.25 : Istirahat Kedua (Break 2)",
        "12.25 - 13.00 : BK 1",
        "13.00 - 14.45 : Dasar PPLG",
        "14.45 - 15.20 : MCL (Max Cleaning)"
      ],
      rabu: [
        "06.45 - 07.30 : LDR (Literasi, Dhuha dan Recite)",
        "07.30 - 09.00 : PJOK (Olahraga)",
        "09.00 - 09.15 : Istirahat Pertama (Break 1)",
        "09.15 - 11.45 : Bahasa Indonesia 1",
        "11.45 - 12.25 : Istirahat Kedua (Break 2)",
        "12.25 - 14.45 : Dasar PPLG",
        "14.45 - 15.20 : MCL (Max Cleaning)"
      ],
      kamis: [
        "06.45 - 07.30 : LDR (Literasi, Dhuha dan Recite)",
        "07.30 - 09.00 : PAB Islam 1",
        "09.00 - 09.15 : Istirahat Pertama (Break 1)",
        "09.15 - 09.55 : PAB Islam 1",
        "09.55 - 11.45 : Dasar PPLG",
        "11.45 - 12.25 : Istirahat Kedua (Break 2)",
        "12.25 - 13.00 : Pendidikan Pancasila",
        "13.00 - 15.20 : Seni & B. Jawa 1"
      ],
      jumat: [
        "06.45 - 07.30 : JB (Jumba Berlian / Jumat Bersih)",
        "07.30 - 09.00 : Matematika 1",
        "09.00 - 09.15 : Istirahat Pertama (Break 1)",
        "09.15 - 10.50 : Matematika 1",
        "10.50 - 12.30 : Sholat Jumat & Istirahat",
        "12.30 - 14.00 : Ekstrakurikuler & Pengembangan Diri"
      ]
    },

    jadwalPiket: {
      senin: ["Puspa", "Aluna", "Aren", "Reva", "Satria", "Rico", "I Gede"],
      selasa: ["Andin", "Ronald", "Vano", "Ian", "Natasya", "Cello", "Bagas", "Rama"],
      rabu: ["Raffa", "Bayu", "Vega", "Felix", "Alex", "Caca", "Ibra", "Eni"],
      kamis: ["Hafiz", "Krisna", "Caesar", "Micael", "Yolanda", "Azryl", "Naila", "Dwinge"],
      jumat: ["Kiki", "Adit", "Aisyah", "Rafi", "Rendi", "Kevin", "Dido"]
    },

    studentsList: [
      { no: 1, name: "Abqory Dido Tsanie Adzani", nick: "Dido", role: "Frontend Specialist", skills: "HTML5, CSS3, JavaScript, Web Design" },
      { no: 2, name: "Adeleo Rivano Ibrahimovic", nick: "Vano", role: "Bendahara 2 & Backend Dev", skills: "PHP, MySQL, Backend, Logistik" },
      { no: 3, name: "Aditya Rafa Pratama", nick: "Adit / Rafa", role: "Mobile & Web Developer", skills: "Flutter, Dart, Web Development" },
      { no: 4, name: "Ahmad Shofyan", nick: "Ian / Shofyan", role: "Python Backend Specialist", skills: "Python, Algoritma, Flask" },
      { no: 5, name: "Aisyah Azzahra", nick: "Aisyah / Caca", role: "Sekretaris 1 & Frontend Dev", skills: "Dokumentasi, Web, JavaScript, Administrasi" },
      { no: 6, name: "Andhika Satria Oetama", nick: "Satria", role: "Game Developer & 3D Creator", skills: "Unity, C#, 3D Blender, Game Design" },
      { no: 7, name: "Andika Bagas Pratama", nick: "Bagas", role: "DevOps & Linux Admin", skills: "Linux, Networking, Server, Cloud" },
      { no: 8, name: "Andini Syafaaturrohma", nick: "Andin", role: "Creative & UI Designer", skills: "Figma, Canva, UI Design, CSS" },
      { no: 9, name: "Caesar Arkan Arthariz", nick: "Caesar", role: "Ketua Kelas & Full-Stack", skills: "Full-Stack, Python, JavaScript, Linux" },
      { no: 10, name: "Dhearen Nickyta Bhalqiez", nick: "Aren", role: "Web Designer & Frontend", skills: "CSS Grid, Responsive, JavaScript, SASS" },
      { no: 11, name: "Dwinge Rahilda Afrishea", nick: "Dwinge", role: "UI & Typography Specialist", skills: "UI Design, Wireframing, Figma, Web" },
      { no: 12, name: "Fachrandy Ferdinandz Firdaus", nick: "Randi", role: "Backend API Developer", skills: "Node.js, Express, REST API, MySQL" },
      { no: 13, name: "Faiharicya Ilmania Tirta Agista", nick: "Ica", role: "Creative & Frontend Dev", skills: "HTML5, CSS Animations, UI/UX" },
      { no: 14, name: "Felix Damian Akbar Febriesta", nick: "Felix", role: "Database Administrator", skills: "MySQL, PostgreSQL, Database Management" },
      { no: 15, name: "I Gede Niloh Pratama Putra", nick: "I Gede", role: "Game Developer & Logic", skills: "Godot, C++, Game Logic, Algoritma" },
      { no: 16, name: "Ibra Putra Kurniawan", nick: "Ibra", role: "Frontend Web Developer", skills: "JavaScript, Vue.js, Tailwind CSS" },
      { no: 17, name: "Kafi Nurhikmah", nick: "Kafi", role: "QA & Software Tester", skills: "Quality Assurance, Testing, Git, Bug Tracking" },
      { no: 18, name: "Kevin Ramadhan", nick: "Kevin", role: "TypeScript & Modern Web Dev", skills: "TypeScript, React, Next.js, CSS" },
      { no: 19, name: "Kiki Aurelia", nick: "Kiki", role: "Wakil Ketua & UI/UX Designer", skills: "UI/UX, Frontend, Figma, Design System" },
      { no: 20, name: "Krisna Andika Nugraha", nick: "Krisna", role: "React Native Mobile Dev", skills: "React Native, Mobile, JavaScript" },
      { no: 21, name: "Latifah Maulida Puspa Sari", nick: "Puspa", role: "Humas & Content Specialist", skills: "Copywriting, Public Relations, Web Content" },
      { no: 22, name: "M. Rico Efendi", nick: "Rico", role: "Desktop & C# Developer", skills: "C#, .NET, Windows Forms, SQL" },
      { no: 23, name: "Marcello Daniel Novaldo", nick: "Cello", role: "Laravel Backend Developer", skills: "PHP, Laravel, MySQL, Linux" },
      { no: 24, name: "Michael Brilliant Alfakhir", nick: "Michael / Micael", role: "Cyber Security Enthusiast", skills: "Cybersecurity, Pentesting, Linux, Network" },
      { no: 25, name: "Muhammad Azryl Raynaldi Arifin", nick: "Azryl", role: "IoT & Hardware Developer", skills: "IoT, Arduino, Microcontroller, C++" },
      { no: 26, name: "Muhammad Bayuangga Sahputra", nick: "Bayu", role: "Data & Automation Engineer", skills: "Python, Pandas, Automation, Scripting" },
      { no: 27, name: "Muhammad Hafizh", nick: "Hafiz", role: "Frontend Specialist", skills: "React, JavaScript, Tailwind, Vite" },
      { no: 28, name: "Nailah Mufrihatin Nazidah", nick: "Naila", role: "UI/UX & Graphic Designer", skills: "Figma, Design System, Wireframing, CSS" },
      { no: 29, name: "Natasya Febiola Putri Prianita", nick: "Natasya", role: "Bendahara 1 & Database", skills: "Keuangan, Database, SQL, Administrasi" },
      { no: 30, name: "Nugraheni", nick: "Eni", role: "Sekretaris 2 & Web Dev", skills: "Administrasi, Web Dev, CSS, Notulensi" },
      { no: 31, name: "Putri Yolanda", nick: "Yolanda", role: "Web Layout Developer", skills: "Bootstrap, HTML5, CSS3, SASS" },
      { no: 32, name: "Raffa Adi Wijaksono", nick: "Raffa", role: "Game Developer & Pixel Art", skills: "Godot, Pixel Art, 2D Game, C#" },
      { no: 33, name: "Ramadhan Hendry Syahputra", nick: "Rama", role: "Frontend Developer", skills: "Vue.js, JavaScript, Tailwind CSS" },
      { no: 34, name: "Revalina Inge Avrilia Haris", nick: "Reva", role: "Multimedia & Creative Specialist", skills: "Video Editing, Multimedia, Canva, UI" },
      { no: 35, name: "Ronald Abqory Az Ghozaly", nick: "Ronald", role: "Backend & Security Explorer", skills: "Linux, Python, Cybersecurity, Scripting" },
      { no: 36, name: "Satria Eka Arifianto", nick: "Alex / Satria Eka", role: "Mobile & Game Developer", skills: "Flutter, Unity, Dart, C#" },
      { no: 37, name: "Shaluna Adinda Chalista", nick: "Aluna", role: "UI/UX & Frontend Designer", skills: "Figma, CSS3, Wireframing, Web Design" },
      { no: 38, name: "Vega Zhafir Rabbani", nick: "Vega", role: "Product & UX Researcher", skills: "UX Research, Prototyping, Web Dev, Figma" }
    ],

    shortcuts: [
      { label: "📅 Jadwal Hari Ini", query: "jadwal hari ini" },
      { label: "🧹 Piket Hari Ini", query: "siapa piket hari ini" },
      { label: "👑 Pengurus Kelas", query: "siapa pengurus kelas" },
      { label: "👥 Daftar 38 Siswa", query: "daftar 38 anak" },
      { label: "🎮 Info Lab Game", query: "bagaimana main game" },
      { label: "💻 Projek RPL", query: "apa saja projek rpl" }
    ]
  };

  // --- AUDIO SYNTHESIZER ---
  const ChatAudio = {
    ctx: null,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();
      }
    },
    playBeep(type) {
      try {
        this.init();
        if (!this.ctx || this.ctx.state === 'suspended') {
          this.ctx?.resume();
        }
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        if (type === 'send') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        } else if (type === 'receive') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(660, now);
          osc.frequency.exponentialRampToValueAtTime(1100, now + 0.12);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'open') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(660, now + 0.1);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
          osc.start(now);
          osc.stop(now + 0.1);
        }
      } catch (e) {
        // audio fail silently
      }
    }
  };

  // --- NATURAL LANGUAGE & QUERY MATCHING ENGINE ---
  function getPageLink(pageName) {
    const isInPages = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
    if (pageName === 'index.html') {
      return isInPages ? '../index.html' : 'index.html';
    }
    return isInPages ? pageName : `pages/${pageName}`;
  }

  function getDayName(dayIndex) {
    const days = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];
    return days[dayIndex] || 'senin';
  }

  function getTodaySchedule() {
    const today = new Date().getDay();
    const dayKey = getDayName(today);
    if (dayKey === 'sabtu' || dayKey === 'minggu') {
      return {
        isHoliday: true,
        text: `🎉 **Hari ini (${dayKey.toUpperCase()}) adalah hari libur sekolah!** Tidak ada jadwal KBM aktif. Kamu bisa istirahat, belajar mandiri koding, atau mengasah skill di <a href="${getPageLink('lab-game.html')}" class="chat-link">🎮 Lab Game RPL</a>.`
      };
    }
    const schedule = KNOWLEDGE_BASE.jadwalPelajaran[dayKey];
    if (!schedule) return { isHoliday: true, text: "Jadwal tidak ditemukan." };
    return {
      isHoliday: false,
      day: dayKey,
      text: `📅 **Jadwal Pelajaran Hari Ini (${dayKey.toUpperCase()}):**\n` + schedule.map(s => `• ${s}`).join('\n') + `\n\n🔗 Lihat jadwal lengkap di <a href="${getPageLink('jadwal.html')}" class="chat-link">Halaman Jadwal</a>.`
    };
  }

  function getTodayPiket() {
    const today = new Date().getDay();
    const dayKey = getDayName(today);
    if (dayKey === 'sabtu' || dayKey === 'minggu') {
      return `🎉 Hari ini (${dayKey.toUpperCase()}) libur, tidak ada tugas piket maupun pengambilan M.bg!`;
    }
    const piket = KNOWLEDGE_BASE.jadwalPiket[dayKey];
    if (!piket) return "Tidak ada data piket untuk hari ini.";
    return `🧹 **Petugas Piket & Pengambilan M.bg Hari Ini (${dayKey.toUpperCase()}):**\n👥 **Anggota:** ${piket.join(', ')}\n\n💡 *Catatan:* Petugas piket bertanggung jawab menjaga kebersihan kelas dan mengambil M.bg tepat waktu!`;
  }

  // --- MATHEMATICAL & LOGIC ARITHMETIC EVALUATOR ---
  function trySolveMath(input) {
    if (!input) return null;
    const raw = input.trim();
    let q = raw.toLowerCase();

    // Abaikan jika query jelas menanyakan jadwal, piket, atau siswa
    if (/\b(absen|siswa|murid|nomor\s+\d|piket|jadwal|jam|kelas|pelajaran)\b/i.test(q)) {
      return null;
    }

    // 1. Operasi Akar Kuadrat: "akar dari 64", "akar 16", "sqrt(16)"
    const sqrtMatch = q.match(/^(?:berapa\s+|hitung\s+)?(?:akar\s*(?:dari|\^2)?|sqrt\s*\(?)\s*(\d+(?:\.\d+)?)\)?(?:\s*(?:sama dengan|adalah|berapa|hasilnya)|[\s\?\=])*$/i);
    if (sqrtMatch) {
      const num = parseFloat(sqrtMatch[1]);
      const res = Math.sqrt(num);
      const formattedRes = Number.isInteger(res) ? res : Number(res.toFixed(6));
      return `🧮 **Hasil Perhitungan Matematika:**\n**√${num} = ${formattedRes}** ⚡\n\n💡 *Catatan:* Akar kuadrat dari ${num} adalah ${formattedRes}.`;
    }

    // 2. Normalisasi awalan & akhiran ekspresi matematika
    let expr = q
      .replace(/^(?:berapa|hitunglah|hitung|coba hitung|tolong hitung|hasil dari|hasil|apakah)\s+/i, "")
      .replace(/(?:\s*(?:sama dengan|adalah|berapa|hasilnya)|[\s\?\=])+$/i, "")
      .trim();

    // 3. Konversi kata verbal operator Indonesia ke operator aritmatika
    expr = expr
      .replace(/\bpangkat\b/gi, "**")
      .replace(/\^/g, "**")
      .replace(/\btambah\b/gi, "+")
      .replace(/\bkurang\b/gi, "-")
      .replace(/\bkali\b/gi, "*")
      .replace(/(\d)\s*x\s*(\d)/gi, "$1 * $2")
      .replace(/\bbagi\b/gi, "/")
      .replace(/(\d)\s*:\s*(\d)/gi, "$1 / $2")
      .replace(/\bmodulus\b|\bmod\b/gi, "%");

    // 4. Sanitasi ketat: Hanya izinkan digit, spasi, +, -, *, /, %, (, ), .
    if (!/^[\d\s\+\-\*\/\%\(\)\.]+$/.test(expr)) {
      return null;
    }

    // Harus mengandung minimal satu operator matematika dan digit angka
    if (!/[\+\-\*\/\%]/.test(expr) || !/\d/.test(expr)) {
      return null;
    }

    // Cegah kurung kosong "()"
    if (/\(\s*\)/.test(expr)) return null;

    try {
      const calcFn = new Function("return (" + expr + ");");
      const result = calcFn();

      if (typeof result !== "number" || isNaN(result)) return null;

      if (!isFinite(result)) {
        return `🧮 **Hasil Perhitungan:**\n\`${raw}\` = **Tidak Terdefinisi (Pembagian dengan Nol)** ⚠️`;
      }

      const cleanExpr = expr.replace(/\*\*/g, "^");
      const formattedResult = Number.isInteger(result) ? result : Number(result.toFixed(6));

      let techFact = "";
      if (Number.isInteger(result) && result >= 0 && result <= 65535) {
        const bin = result.toString(2);
        const hex = result.toString(16).toUpperCase();
        techFact = `\n\n💡 *Fun Fact IT RPL:* Nilai desimal **${formattedResult}** setara dengan biner \`${bin}₂\` dan heksadesimal \`0x${hex}\`.`;
      }

      return `🧮 **Hasil Perhitungan Matematika:**\n**${cleanExpr} = ${formattedResult}** ⚡${techFact}\n\nAda soal logika atau koding lain yang ingin kamu tanyakan?`;
    } catch (e) {
      return null;
    }
  }

  function processQuery(input) {
    const q = input.toLowerCase().trim();

    // 0. Evaluasi Ekspresi Matematika & Logika Aritmatika (Presisi 100%)
    const mathResult = trySolveMath(input);
    if (mathResult) {
      return mathResult;
    }

    // 1. Salam / Sapaan
    if (/^(hai|halo|hello|hey|hei|pagi|siang|sore|malam|assalamualaikum|shalom|ping|p)\b/i.test(q)) {
      return `Halo! 👋 Saya **Caprice AI**, asisten cerdas kelas **X RPL 1 (Caprice 26)**.\n\nAda yang bisa saya bantu? Kamu bisa menanyakan jadwal pelajaran, piket harian, pengurus kelas, info 38 siswa, atau projek coding kami! ✨`;
    }

    // 2. Siapa Kamu / Tentang Bot
    if (q.includes('siapa kamu') || q.includes('tentang bot') || q.includes('kamu siapa') || q.includes('caprice bot') || q.includes('caprice ai')) {
      return `🤖 Saya adalah **${KNOWLEDGE_BASE.identity.name}**, asisten virtual resmi untuk **${KNOWLEDGE_BASE.identity.class}** di **${KNOWLEDGE_BASE.identity.school}**.\n\n🌟 **Misi Kami:** ${KNOWLEDGE_BASE.identity.motto}.\nSaya dirancang untuk membantu memberikan informasi seputar kelas secara cepat dan interaktif!`;
    }

    // 3. Jadwal Hari Ini
    if (q.includes('jadwal hari ini') || q.includes('pelajaran hari ini') || q.includes('mapel hari ini') || q.includes('sekarang belajar apa') || q.includes('jadwal sekarang')) {
      const todayRes = getTodaySchedule();
      return todayRes.text;
    }

    // 4. Jadwal Hari Tertentu (Senin - Jumat)
    if (q.includes('jadwal senin') || q.includes('hari senin')) {
      return `📅 **Jadwal Pelajaran Hari SENIN:**\n` + KNOWLEDGE_BASE.jadwalPelajaran.senin.map(s => `• ${s}`).join('\n') + `\n\n🔗 <a href="${getPageLink('jadwal.html')}" class="chat-link">Buka Jadwal Lengkap</a>`;
    }
    if (q.includes('jadwal selasa') || q.includes('hari selasa')) {
      return `📅 **Jadwal Pelajaran Hari SELASA:**\n` + KNOWLEDGE_BASE.jadwalPelajaran.selasa.map(s => `• ${s}`).join('\n') + `\n\n🔗 <a href="${getPageLink('jadwal.html')}" class="chat-link">Buka Jadwal Lengkap</a>`;
    }
    if (q.includes('jadwal rabu') || q.includes('hari rabu')) {
      return `📅 **Jadwal Pelajaran Hari RABU:**\n` + KNOWLEDGE_BASE.jadwalPelajaran.rabu.map(s => `• ${s}`).join('\n') + `\n\n🔗 <a href="${getPageLink('jadwal.html')}" class="chat-link">Buka Jadwal Lengkap</a>`;
    }
    if (q.includes('jadwal kamis') || q.includes('hari kamis')) {
      return `📅 **Jadwal Pelajaran Hari KAMIS:**\n` + KNOWLEDGE_BASE.jadwalPelajaran.kamis.map(s => `• ${s}`).join('\n') + `\n\n🔗 <a href="${getPageLink('jadwal.html')}" class="chat-link">Buka Jadwal Lengkap</a>`;
    }
    if (q.includes('jadwal jumat') || q.includes('hari jumat') || q.includes('jum\'at')) {
      return `📅 **Jadwal Pelajaran Hari JUMAT:**\n` + KNOWLEDGE_BASE.jadwalPelajaran.jumat.map(s => `• ${s}`).join('\n') + `\n\n🔗 <a href="${getPageLink('jadwal.html')}" class="chat-link">Buka Jadwal Lengkap</a>`;
    }
    if (q.includes('jadwal') || q.includes('mata pelajaran') || q.includes('mapel')) {
      return `📅 **Jadwal Pelajaran X RPL 1:**\nKamu bisa tanyakan jadwal spesifik, misalnya: *"jadwal senin"*, *"jadwal selasa"*, *"jadwal hari ini"*, atau klik tautan berikut:\n\n👉 <a href="${getPageLink('jadwal.html')}" class="chat-link">Buka Halaman Jadwal Interaktif</a>`;
    }

    // 5. Istilah Khusus (LDR, JB, MCL, BREAK)
    if (q.includes('ldr')) {
      return `📖 **LDR** adalah singkatan dari **Literasi, Dhuha dan Recite**. Kegiatan pembiasaan pagi setiap hari Selasa, Rabu, dan Kamis pukul 06.45 - 07.30 WIB.`;
    }
    if (q.includes('jb') || q.includes('jumat bersih') || q.includes('jumba berlian')) {
      return `✨ **JB** adalah singkatan dari **Jumba Berlian (Jumat Bersih)** yang dilaksanakan setiap hari Jumat pagi pukul 06.45 - 07.30 WIB untuk menjaga kebersihan dan kenyamanan lingkungan sekolah.`;
    }
    if (q.includes('mcl') || q.includes('max cleaning')) {
      return `🧹 **MCL** adalah singkatan dari **Max Cleaning**, yaitu waktu pembersihan dan perapian kelas secara menyeluruh di akhir jam pelajaran.`;
    }
    if (q.includes('mbg') || q.includes('m.bg')) {
      return `🍱 **M.bg** adalah program makan bergizi / konsumsi sekolah yang diambil oleh regu piket kelas sesuai jadwal harian.`;
    }

    // 6. Jadwal Piket & M.bg
    if (q.includes('piket hari ini') || q.includes('siapa piket') || q.includes('piket sekarang')) {
      return getTodayPiket();
    }
    if (q.includes('piket senin')) {
      return `🧹 **Petugas Piket & M.bg Hari SENIN:**\n${KNOWLEDGE_BASE.jadwalPiket.senin.join(', ')}`;
    }
    if (q.includes('piket selasa')) {
      return `🧹 **Petugas Piket & M.bg Hari SELASA:**\n${KNOWLEDGE_BASE.jadwalPiket.selasa.join(', ')}`;
    }
    if (q.includes('piket rabu')) {
      return `🧹 **Petugas Piket & M.bg Hari RABU:**\n${KNOWLEDGE_BASE.jadwalPiket.rabu.join(', ')}`;
    }
    if (q.includes('piket kamis')) {
      return `🧹 **Petugas Piket & M.bg Hari KAMIS:**\n${KNOWLEDGE_BASE.jadwalPiket.kamis.join(', ')}`;
    }
    if (q.includes('piket jumat') || q.includes('piket jum\'at')) {
      return `🧹 **Petugas Piket & M.bg Hari JUMAT:**\n${KNOWLEDGE_BASE.jadwalPiket.jumat.join(', ')}`;
    }
    if (q.includes('piket') || q.includes('kebersihan')) {
      return `🧹 **Daftar Piket & Pengambilan M.bg X RPL 1:**\n• **Senin:** ${KNOWLEDGE_BASE.jadwalPiket.senin.join(', ')}\n• **Selasa:** ${KNOWLEDGE_BASE.jadwalPiket.selasa.join(', ')}\n• **Rabu:** ${KNOWLEDGE_BASE.jadwalPiket.rabu.join(', ')}\n• **Kamis:** ${KNOWLEDGE_BASE.jadwalPiket.kamis.join(', ')}\n• **Jumat:** ${KNOWLEDGE_BASE.jadwalPiket.jumat.join(', ')}\n\n🔗 <a href="${getPageLink('jadwal.html')}" class="chat-link">Lihat Jadwal Piket di Website</a>`;
    }

    // 7. Pengurus Inti Kelas
    if (q.includes('ketua kelas') || q.includes('siapa ketua') || q.includes('caesar')) {
      return `👑 **Ketua Kelas X RPL 1:**\n**${KNOWLEDGE_BASE.pengurus.ketua}**\n\nMemimpin koordinasi kelas, delegasi tugas, dan pengembangan projek IT bersama Caprice Team 26!`;
    }
    if (q.includes('wakil ketua') || q.includes('kiki')) {
      return `⭐ **Wakil Ketua Kelas X RPL 1:**\n**${KNOWLEDGE_BASE.pengurus.wakil}**\n\nMendampingi ketua kelas dan memimpin divisi kreatif serta UI/UX!`;
    }
    if (q.includes('sekretaris')) {
      return `📝 **Sekretaris X RPL 1:**\n• **Sekretaris 1:** ${KNOWLEDGE_BASE.pengurus.sekretaris1}\n• **Sekretaris 2:** ${KNOWLEDGE_BASE.pengurus.sekretaris2}\n\nBertanggung jawab atas administrasi, notulensi, dan pencatatan kegiatan kelas.`;
    }
    if (q.includes('bendahara')) {
      return `💰 **Bendahara X RPL 1:**\n• **Bendahara 1:** ${KNOWLEDGE_BASE.pengurus.bendahara1}\n• **Bendahara 2:** ${KNOWLEDGE_BASE.pengurus.bendahara2}\n\nBertanggung jawab atas pengelolaan kas kelas, transparansi laporan keuangan, dan logistik.`;
    }
    if (q.includes('pengurus') || q.includes('struktur')) {
      return `🏛️ **Pengurus Inti X RPL 1 (Caprice 26):**\n• **Ketua:** ${KNOWLEDGE_BASE.pengurus.ketua}\n• **Wakil Ketua:** ${KNOWLEDGE_BASE.pengurus.wakil}\n• **Sekretaris 1:** ${KNOWLEDGE_BASE.pengurus.sekretaris1}\n• **Sekretaris 2:** ${KNOWLEDGE_BASE.pengurus.sekretaris2}\n• **Bendahara 1:** ${KNOWLEDGE_BASE.pengurus.bendahara1}\n• **Bendahara 2:** ${KNOWLEDGE_BASE.pengurus.bendahara2}\n\n🔗 <a href="${getPageLink('struktur.html')}" class="chat-link">Lihat Bagan Struktur Lengkap</a>`;
    }

    // 8a. Pencarian Siswa Berdasarkan Nomor Absen (misal: "absen 13", "nomor 2", "no absen 5")
    const absenMatch = q.match(/(?:absen|no|nomor)\s*(\d{1,2})\b/i);
    if (absenMatch) {
      const targetNo = parseInt(absenMatch[1], 10);
      const student = KNOWLEDGE_BASE.studentsList.find(s => s.no === targetNo);
      if (student) {
        return `👤 **Data Siswa X RPL 1 (Absen ${student.no < 10 ? '0' + student.no : student.no}):**\n• **Nama Lengkap:** ${student.name}\n• **Panggilan:** ${student.nick}\n• **Spesialisasi:** ${student.role}\n• **Skills:** ${student.skills}\n\n🔗 <a href="${getPageLink('struktur.html')}" class="chat-link">Lihat di Direktori 38 Siswa</a>`;
      }
    }

    // 8b. Pencarian Data 38 Siswa Berdasarkan Nama & Panggilan (menggunakan token kata agar tidak salah cocok)
    const queryWords = q.split(/[\s,?!.]+/).filter(Boolean);
    for (const st of KNOWLEDGE_BASE.studentsList) {
      const matchFullName = q.length >= 3 && st.name.toLowerCase().includes(q);
      const nicks = st.nick ? st.nick.toLowerCase().split(/[\/,]/).map(n => n.trim()) : [];
      const matchNick = nicks.some(n => n && (q === n || queryWords.includes(n)));
      if (matchFullName || matchNick) {
        return `👤 **Data Siswa X RPL 1:**\n• **Nomor Absen:** ${st.no < 10 ? '0' + st.no : st.no}\n• **Nama Lengkap:** ${st.name}\n• **Panggilan:** ${st.nick}\n• **Spesialisasi:** ${st.role}\n• **Skills:** ${st.skills}\n\n🔗 <a href="${getPageLink('struktur.html')}" class="chat-link">Lihat di Direktori 38 Siswa</a>`;
      }
    }

    // 9. Jumlah Siswa & Daftar 38 Siswa
    if (q.includes('berapa siswa') || q.includes('jumlah siswa') || q.includes('jumlah murid') || q.includes('38 siswa') || q.includes('38 anak') || q.includes('daftar siswa') || q.includes('semua siswa')) {
      return `👥 Kelas **X RPL 1 (Caprice 26)** memiliki total **38 Siswa Aktif** dengan berbagai keahlian koding (Frontend, Backend, Mobile, UI/UX, Game Dev, DevOps & IoT).\n\nKamu bisa melihat profil lengkap seluruh 38 anak di <a href="${getPageLink('struktur.html')}" class="chat-link">Direktori Siswa X RPL 1</a> atau ketik nama teman yang ingin kamu cari!`;
    }

    // 10. Projek & Coding Lab
    if (q.includes('projek') || q.includes('project') || q.includes('aplikasi') || q.includes('karya')) {
      return `💻 **Projek Unggulan X RPL 1:**\n1. **WebCaprice 26**: Portal kelas interaktif berbasis Glassmorphism, RBAC Admin, & Sound FX.\n2. **RPL Quiz & Lab Game**: Arena kuis koding interaktif dan game edukatif.\n3. **SI-KAS RPL**: Sistem manajemen kas kelas digital transparan.\n\n🔗 <a href="${getPageLink('proyek.html')}" class="chat-link">Kunjungi Galeri Projek</a>`;
    }
    if (q.includes('game') || q.includes('lab game') || q.includes('kuis') || q.includes('main game')) {
      return `🎮 **RPL Interactive Lab Game:**\nKamu bisa menguji kemampuan koding, bermain tebak sintaks, dan mengumpulkan skor tertinggi di lab game kami!\n\n👉 <a href="${getPageLink('lab-game.html')}" class="chat-link">Mulai Main di Lab Game</a>`;
    }
    if (q.includes('prestasi') || q.includes('lomba') || q.includes('juara')) {
      return `🏆 **Ruang Prestasi X RPL 1:**\nSiswa-siswi Caprice 26 aktif mengikuti berbagai kompetisi bidang Web Technologies, Competitive Programming, dan Game Development.\n\n🔗 <a href="${getPageLink('prestasi.html')}" class="chat-link">Lihat Ruang Prestasi</a>`;
    }
    if (q.includes('galeri') || q.includes('foto') || q.includes('kegiatan')) {
      return `📸 **Galeri X RPL 1:**\nDokumentasi momen seru, praktikum lab komputer, kegiatan upacara, dan kebersamaan kelas tersimpan rapi di <a href="${getPageLink('galeri.html')}" class="chat-link">Halaman Galeri</a>.`;
    }
    if (q.includes('buku tamu') || q.includes('pesan') || q.includes('guestbook')) {
      return `✍️ **Buku Tamu:**\nTinggalkan jejak, pesan motivasi, atau kesanmu untuk kelas X RPL 1 di <a href="${getPageLink('bukutamu.html')}" class="chat-link">Halaman Buku Tamu</a>.`;
    }
    if (q.includes('kontak') || q.includes('alamat') || q.includes('lokasi') || q.includes('sekolah')) {
      return `📍 **Lokasi & Kontak:**\nSMK Negeri 1 Kota Probolinggo\nJurusan Rekayasa Perangkat Lunak (RPL)\n\n🔗 <a href="${getPageLink('kontak.html')}" class="chat-link">Buka Halaman Kontak</a>`;
    }

    // 11. Tech Stack & Belajar Koding
    if (q.includes('tech stack') || q.includes('bahasa pemrograman') || q.includes('belajar apa')) {
      return `⚡ **Teknologi yang Dipelajari di X RPL 1:**\n• **Frontend:** HTML5, CSS3/Tailwind, JavaScript, Vue, React\n• **Backend:** Python, PHP, Laravel, Node.js, REST API\n• **Database:** MySQL, PostgreSQL\n• **Mobile & Game:** Flutter, Dart, Unity, Godot\n• **Design & Tools:** Figma, Git, GitHub, Linux OS`;
    }

    // 12. Jokes / Fun
    if (q.includes('joke') || q.includes('lelucon') || q.includes('lucu') || q.includes('humor')) {
      const jokes = [
        "Kenapa programmer suka kopi? Karena tanpa `coffee.drink()`, sistemnya error `NullPointerException`! ☕😂",
        "Ada 10 jenis orang di dunia: mereka yang paham bilangan biner, dan mereka yang tidak. 🤓",
        "Kenapa JavaScript pakai kacamata? Karena dia nggak bisa `C#`! 👓⚡",
        "Ibu programmer: 'Tolong ke pasar beli 1 botol minyak, dan jika ada telur, beli 6.'\nProgrammer pulang membawa 6 botol minyak! 🍳🤣"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }

    // 13. Ucapan Terima Kasih
    if (q.includes('terima kasih') || q.includes('makasih') || q.includes('thanks') || q.includes('thx')) {
      return `Sama-sama! Senang bisa membantu kamu. Jika ada hal lain yang ingin ditanyakan seputar **X RPL 1**, silakan tanyakan lagi ya! 🚀`;
    }

    // 14. Fallback Cerdas dengan Saran
    return `Hmm, saya belum menemukan jawaban persis untuk pertanyaan: *"_` + escapeHTML(input) + `_*" 🤔\n\n💡 **Coba tanyakan salah satu topik ini:**\n• *"Jadwal hari ini"* atau *"Jadwal Senin"*\n• *"Siapa yang piket hari ini?"*\n• *"Siapa ketua kelas?"*\n• *"Cari data [Nama Siswa]"*\n• *"Apa saja projek kelas?"*\n\nAtau buka menu navigasi kami di bagian atas website! ✨`;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // --- RICH MARKDOWN PARSER WITH CODE BLOCK & COPY SUPPORT ---
  function formatMessageText(text) {
    if (!text) return '';

    // 1. Extract and format multi-line code blocks: ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let formatted = text.replace(codeBlockRegex, (match, lang, code) => {
      const language = lang.trim() || 'code';
      const cleanCode = escapeHTML(code.trim());
      return `
        <div class="chat-code-container">
          <div class="chat-code-header">
            <span>💻 ${language}</span>
            <button type="button" class="chat-code-copy-btn" title="Salin Kode">
              <span>📋</span> Salin
            </button>
          </div>
          <pre class="chat-code-pre"><code>${cleanCode}</code></pre>
        </div>
      `;
    });

    // 2. Format inline code: `code`
    formatted = formatted.replace(/`([^`]+)`/g, '<code class="chat-inline-code">$1</code>');

    // 3. Format bold: **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 4. Format italic: *text* or _text_
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 5. Format bullet points
    formatted = formatted.replace(/^[•\-\*]\s+(.*)$/gm, '<li style="margin-left:1rem;">$1</li>');

    // 6. Convert newlines to <br> (excluding inside code blocks)
    formatted = formatted.replace(/\n/g, '<br>');

    // Clean up adjacent </li><br><li to cleaner lists
    formatted = formatted.replace(/<\/li><br><li/g, '</li><li');

    return formatted;
  }

  // --- GOOGLE AI STUDIO (GEMINI API) CLIENT ---
  const GeminiClient = {
    STORAGE_KEY_API: "caprice_gemini_api_key",
    STORAGE_KEY_MODEL: "caprice_gemini_model",
    DEFAULT_MODEL: "gemini-3.6-flash",

    getApiKey() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY_API);
        if (stored && stored.trim()) return stored.trim();
      } catch (e) {}
      if (window.CAPRICE_CONFIG?.DEFAULT_CHATBOT_CONFIG?.apiKey) {
        return window.CAPRICE_CONFIG.DEFAULT_CHATBOT_CONFIG.apiKey;
      }
      if (window.CAPRICE_CONFIG?.GEMINI_API_KEY) {
        return window.CAPRICE_CONFIG.GEMINI_API_KEY;
      }
      return "";
    },

    setApiKey(key) {
      if (key && key.trim()) {
        localStorage.setItem(this.STORAGE_KEY_API, key.trim());
      } else {
        localStorage.removeItem(this.STORAGE_KEY_API);
      }
    },

    getModel() {
      try {
        const stored = localStorage.getItem(this.STORAGE_KEY_MODEL);
        if (stored && stored.trim()) {
          const m = stored.trim();
          // Auto migrate deprecated gemini-2.5-flash to gemini-3.6-flash
          if (m === "gemini-2.5-flash") {
            this.setModel("gemini-3.6-flash");
            return "gemini-3.6-flash";
          }
          return m;
        }
      } catch (e) {}
      return window.CAPRICE_CONFIG?.DEFAULT_CHATBOT_CONFIG?.defaultModel || this.DEFAULT_MODEL;
    },

    setModel(model) {
      if (model && model.trim()) {
        localStorage.setItem(this.STORAGE_KEY_MODEL, model.trim());
      }
    },

    hasApiKey() {
      return Boolean(this.getApiKey());
    },

    buildSystemInstruction() {
      // Compile class knowledge base into system instruction
      const kb = KNOWLEDGE_BASE;
      const studentsSummary = kb.studentsList.map(s => 
        `${s.no}. ${s.name} (${s.nick}) - ${s.role} [Keahlian: ${s.skills}]`
      ).join("\n");

      return `Kamu adalah Caprice AI (CapriceBot ⚡), asisten virtual kecerdasan buatan resmi untuk kelas X Rekayasa Perangkat Lunak 1 (X RPL 1 / Caprice 26) di SMK Negeri 1 Kota Probolinggo.

Motto Kelas: "${kb.identity.motto}".
Jumlah Siswa: 38 siswa.

PENGURUS KELAS:
- Ketua Kelas: ${kb.pengurus.ketua}
- Wakil Ketua: ${kb.pengurus.wakil}
- Sekretaris 1: ${kb.pengurus.sekretaris1}
- Sekretaris 2: ${kb.pengurus.sekretaris2}
- Bendahara 1: ${kb.pengurus.bendahara1}
- Bendahara 2: ${kb.pengurus.bendahara2}

DAFTAR 38 SISWA LENGKAP:
${studentsSummary}

JADWAL PELAJARAN:
- Senin: ${kb.jadwalPelajaran.senin.join(", ")}
- Selasa: ${kb.jadwalPelajaran.selasa.join(", ")}
- Rabu: ${kb.jadwalPelajaran.rabu.join(", ")}
- Kamis: ${kb.jadwalPelajaran.kamis.join(", ")}
- Jumat: ${kb.jadwalPelajaran.jumat.join(", ")}

JADWAL PIKET:
- Senin: ${kb.jadwalPiket.senin.join(", ")}
- Selasa: ${kb.jadwalPiket.selasa.join(", ")}
- Rabu: ${kb.jadwalPiket.rabu.join(", ")}
- Kamis: ${kb.jadwalPiket.kamis.join(", ")}
- Jumat: ${kb.jadwalPiket.jumat.join(", ")}

HALAMAN WEBSITE KELAS X RPL 1:
- Beranda: index.html
- Jadwal Pelajaran & Piket: pages/jadwal.html
- Struktur Organisasi & 38 Siswa: pages/struktur.html
- Prestasi Siswa: pages/prestasi.html
- Galeri Foto & Momen: pages/galeri.html
- Showcase Projek RPL: pages/proyek.html
- Lab Game RPL: pages/lab-game.html
- Buku Tamu Kelas: pages/bukutamu.html
- Hubungi Kelas: pages/kontak.html
- Portal Login: pages/login.html

PANDUAN KEPRIBADIAN & GAYA MENJAWAB:
1. Bersikap ramah, antusias, cerdas, solutif, dan bergaya khas anak IT / siswa Rekayasa Perangkat Lunak SMK yang profesional dan melek teknologi.
2. Gunakan Bahasa Indonesia yang luwes dan natural. Tambahkan emoji yang relevan secukupnya.
3. Selalu prioritaskan data resmi kelas X RPL 1 saat menjawab pertanyaan seputar siswa, jadwal, piket, atau kegiatan kelas.
4. Kamu juga ahli koding (HTML, CSS, JS, Python, PHP, Java, C++, Flutter, Unity, database SQL). Jika diminta membuat kode program atau tutorial, gunakan format blok kode (\`\`\`bahasa ... \`\`\`) dengan penjelasan ringkas yang mudah dipahami pemula.
5. Bila relevan, sertakan saran tautan ke halaman internal website kami (gunakan format link HTML sederhana).
6. MATEMATIKA & PERHITUNGAN LOGIKA: Selalu hitung dan jawab operasi matematika (seperti 1 + 1, perkalian, pembagian, akar, dsb.) dengan hasil yang 100% presisi dan benar secara ilmiah (misalnya: 1 + 1 = 2). DILARANG KERAS mengaitkan operasi hitung angka dengan nomor urut absen siswa atau memberikan jawaban halusinasi seperti 13.
7. PERTANYAAN UMUM / DILUAR KELAS: Jika pengguna menanyakan sains, matematika, logika, atau pengetahuan umum di luar data kelas X RPL 1, berikan jawaban edukatif, faktual, dan benar tanpa memaksakan data kelas.`;
    },

    async generateResponse(userPrompt, conversationHistory = []) {
      const apiKey = this.getApiKey();
      if (!apiKey) {
        throw new Error("NO_API_KEY");
      }

      let model = this.getModel();
      let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

      // Prepare conversation payload
      const contents = [];

      // Add previous conversation turns (limit to last 10 messages for speed & token efficiency)
      const recentHistory = conversationHistory.slice(-10);
      recentHistory.forEach(item => {
        if (item.role === 'user' || item.role === 'model') {
          contents.push({
            role: item.role,
            parts: [{ text: item.text }]
          });
        }
      });

      // Add the current user prompt
      contents.push({
        role: "user",
        parts: [{ text: userPrompt }]
      });

      const body = {
        contents: contents,
        systemInstruction: {
          parts: [{ text: this.buildSystemInstruction() }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1200
        }
      };

      let response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData.error?.message || `HTTP Error ${response.status} (${response.statusText})`;

        // Auto fallback if previous model is deprecated / unavailable (e.g. gemini-2.5-flash)
        if (model !== "gemini-3.6-flash" && (errMsg.includes("no longer available") || errMsg.includes("gemini-3.6-flash") || response.status === 404)) {
          console.warn(`Model ${model} tidak tersedia (${errMsg}). Mengalihkan otomatis ke gemini-3.6-flash...`);
          model = "gemini-3.6-flash";
          this.setModel("gemini-3.6-flash");
          endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
          response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });
          if (!response.ok) {
            const retryErr = await response.json().catch(() => ({}));
            throw new Error(retryErr.error?.message || `HTTP Error ${response.status}`);
          }
        } else {
          throw new Error(errMsg);
        }
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("Respon kosong dari Google AI Studio.");
      }

      return text;
    },

    async testConnection(testKey, testModel) {
      const key = (testKey || this.getApiKey() || "").trim();
      let model = testModel || this.getModel() || this.DEFAULT_MODEL;

      if (!key) {
        return { ok: false, error: "API Key belum diisi." };
      }

      let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
      try {
        let response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: "Tes koneksi. Jawab singkat: OK" }] }],
            generationConfig: { maxOutputTokens: 10 }
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          const errMsg = errData.error?.message || `Status HTTP ${response.status}`;

          // Auto fallback if deprecated
          if (model !== "gemini-3.6-flash" && (errMsg.includes("no longer available") || errMsg.includes("gemini-3.6-flash"))) {
            model = "gemini-3.6-flash";
            this.setModel("gemini-3.6-flash");
            endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`;
            response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ role: "user", parts: [{ text: "Tes koneksi. Jawab singkat: OK" }] }],
                generationConfig: { maxOutputTokens: 10 }
              })
            });
            if (response.ok) {
              return { ok: true, modelSwitched: "gemini-3.6-flash" };
            }
          }
          return { ok: false, error: errMsg };
        }

        return { ok: true };
      } catch (err) {
        return { ok: false, error: err.message || "Gagal menghubungi server Google AI Studio." };
      }
    }
  };

  // Helper Pemeriksaan Hak Akses Admin / Super Admin
  function isUserAdminOrSuperAdmin() {
    try {
      if (!window.CapriceAuth) return false;
      const user = window.CapriceAuth.getUser();
      if (!user) return false;
      return user.role === "super-admin" || user.role === "ketua-kelas" || user.role === "admin";
    } catch (e) {
      return false;
    }
  }

  // --- UI CHATBOT WIDGET CONTROLLER ---
  class CapriceChatbotWidget {
    constructor() {
      this.isOpen = false;
      this.isTyping = false;
      this.isWide = false;
      this.conversationHistory = [];
      this.init();
    }

    init() {
      if (document.getElementById('caprice-chatbot-root')) return;
      this.injectWidgetHTML();
      this.cacheDOMElements();
      this.bindEvents();
      this.updateAdminControls();
      this.updateStatusBadge();
      this.loadWelcomeMessage();
    }

    injectWidgetHTML() {
      const widget = document.createElement('div');
      widget.id = 'caprice-chatbot-root';
      widget.className = 'caprice-chatbot-widget';
      widget.innerHTML = `
        <!-- Floating Toggle Button -->
        <button id="chatbot-toggle-btn" class="chatbot-toggle-btn" aria-label="Buka Chatbot Caprice AI" title="Chat dengan Caprice AI ⚡">
          <div class="chatbot-toggle-icon">
            <span class="bot-icon-default">⚡</span>
            <span class="bot-icon-close">✕</span>
          </div>
          <span class="chatbot-badge-dot"></span>
        </button>

        <!-- Chat Window Container -->
        <div id="chatbot-window" class="chatbot-window" aria-hidden="true">
          <!-- Header -->
          <div class="chatbot-header">
            <div class="chatbot-header-info">
              <div class="chatbot-avatar" id="chatbot-avatar">
                <span>⚡</span>
                <span class="chatbot-online-indicator" title="Online"></span>
              </div>
              <div class="chatbot-title-wrap">
                <div style="display:flex; align-items:center; gap:0.4rem;">
                  <h4 class="chatbot-title">Caprice AI ⚡</h4>
                  <span class="chatbot-mode-badge" id="chatbot-mode-badge">Memuat...</span>
                </div>
                <p class="chatbot-status" id="chatbot-status-desc">Asisten Cerdas X RPL 1</p>
              </div>
            </div>
            <div class="chatbot-header-actions">
              <button id="chatbot-settings-btn" class="chatbot-action-btn" title="Pengaturan Google AI Studio (Khusus Admin)" aria-label="Pengaturan Admin" style="display:none;">⚙️</button>
              <button id="chatbot-expand-btn" class="chatbot-action-btn" title="Perlebar Tampilan" aria-label="Perlebar Tampilan">⛶</button>
              <button id="chatbot-clear-btn" class="chatbot-action-btn" title="Bersihkan Percakapan" aria-label="Bersihkan Percakapan">🗑️</button>
              <button id="chatbot-close-btn" class="chatbot-action-btn" title="Tutup Chat" aria-label="Tutup Chat">✕</button>
            </div>
          </div>

          <!-- In-Chat Settings Panel Flyout (Khusus Super Admin & Admin) -->
          <div class="chatbot-settings-panel" id="chatbot-settings-panel">
            <div class="chatbot-settings-header">
              <h4 style="margin:0; font-size:0.92rem; font-weight:700; color:#fff; display:flex; align-items:center; gap:0.4rem;">
                🛡️ Pengaturan AI Studio (Admin)
              </h4>
              <button type="button" class="chatbot-action-btn" id="close-settings-btn" title="Kembali ke Chat">✕</button>
            </div>
            <div class="chatbot-settings-body">
              <p style="font-size:0.8rem; color:var(--text-dim); margin:0; line-height:1.4;">
                Kelola kredensial <strong>Google AI Studio (Gemini API)</strong> untuk seluruh pengunjung dan siswa kelas X RPL 1.
              </p>

              <div>
                <label style="display:block; font-size:0.8rem; font-weight:600; color:#e2e8f0; margin-bottom:0.35rem;" for="gemini-api-key-input">
                  Google AI Studio API Key:
                </label>
                <div style="position:relative; display:flex; align-items:center;">
                  <input
                    type="password"
                    id="gemini-api-key-input"
                    class="caprice-form-input"
                    placeholder="AIzaSy..."
                    style="width:100%; padding-right:2.4rem; font-family:monospace; font-size:0.82rem;"
                  />
                  <button type="button" id="toggle-key-visibility" style="position:absolute; right:8px; background:none; border:none; color:var(--text-dim); cursor:pointer; font-size:0.9rem;" title="Lihat/Sembunyikan Key">
                    👁️
                  </button>
                </div>
                <p style="font-size:0.75rem; color:var(--text-muted); margin:0.35rem 0 0;">
                  🔑 <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style="color:var(--accent-cyan); text-decoration:underline;">Buka Google AI Studio untuk generate API Key &rarr;</a>
                </p>
              </div>

              <div>
                <label style="display:block; font-size:0.8rem; font-weight:600; color:#e2e8f0; margin-bottom:0.35rem;" for="gemini-model-select">
                  Pilihan Model Gemini:
                </label>
                <select id="gemini-model-select" class="caprice-form-select" style="font-size:0.82rem;">
                  <option value="gemini-3.6-flash">Gemini 3.6 Flash (Terbaru & Sangat Cepat — Rekomendasi)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Stabil)</option>
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
                </select>
              </div>

              <div id="settings-test-result" style="display:none; font-size:0.78rem; padding:0.5rem 0.75rem; border-radius:8px; line-height:1.4;"></div>

              <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.5rem;">
                <button type="button" class="btn btn-outline btn-sm" id="btn-test-gemini" style="flex:1; min-width:120px; font-size:0.8rem;">
                  🧪 Tes Koneksi
                </button>
                <button type="button" class="btn btn-primary btn-sm" id="btn-save-gemini" style="flex:1; min-width:120px; font-size:0.8rem;">
                  💾 Simpan Key
                </button>
              </div>

              <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:0.75rem; margin-top:0.25rem;">
                <button type="button" class="btn btn-outline btn-sm" id="btn-reset-gemini" style="width:100%; font-size:0.78rem; color:#f43f5e; border-color:rgba(244,63,94,0.3);">
                  🔄 Hapus Key & Beralih ke Mode Lokal
                </button>
              </div>
            </div>
          </div>

          <!-- Message Body -->
          <div id="chatbot-messages-body" class="chatbot-messages-body">
            <!-- Messages will be injected here -->
            <div id="chatbot-typing-indicator" class="chatbot-typing-indicator" style="display: none;">
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
              <span class="typing-dot"></span>
            </div>
          </div>

          <!-- Quick Suggestion Chips -->
          <div class="chatbot-chips-container" id="chatbot-chips">
            ${KNOWLEDGE_BASE.shortcuts.map(s => `
              <button class="chat-chip-btn" data-query="${s.query}">${s.label}</button>
            `).join('')}
          </div>

          <!-- Input Footer -->
          <div class="chatbot-input-footer">
            <form id="chatbot-form" class="chatbot-form" autocomplete="off">
              <input 
                type="text" 
                id="chatbot-input" 
                class="chatbot-input" 
                placeholder="Tanya jadwal, koding, siswa, piket..." 
                aria-label="Ketik pesan pertanyaan"
                maxlength="500"
              />
              <button type="submit" id="chatbot-send-btn" class="chatbot-send-btn" aria-label="Kirim Pesan" title="Kirim">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>
      `;
      document.body.appendChild(widget);
    }

    cacheDOMElements() {
      this.toggleBtn = document.getElementById('chatbot-toggle-btn');
      this.chatWindow = document.getElementById('chatbot-window');
      this.avatar = document.getElementById('chatbot-avatar');
      this.modeBadge = document.getElementById('chatbot-mode-badge');
      this.statusDesc = document.getElementById('chatbot-status-desc');
      this.settingsBtn = document.getElementById('chatbot-settings-btn');
      this.expandBtn = document.getElementById('chatbot-expand-btn');
      this.closeBtn = document.getElementById('chatbot-close-btn');
      this.clearBtn = document.getElementById('chatbot-clear-btn');
      this.messagesBody = document.getElementById('chatbot-messages-body');
      this.typingIndicator = document.getElementById('chatbot-typing-indicator');
      this.form = document.getElementById('chatbot-form');
      this.input = document.getElementById('chatbot-input');
      this.chipsContainer = document.getElementById('chatbot-chips');

      // Settings Elements
      this.settingsPanel = document.getElementById('chatbot-settings-panel');
      this.closeSettingsBtn = document.getElementById('close-settings-btn');
      this.apiKeyInput = document.getElementById('gemini-api-key-input');
      this.toggleKeyVisBtn = document.getElementById('toggle-key-visibility');
      this.modelSelect = document.getElementById('gemini-model-select');
      this.testResult = document.getElementById('settings-test-result');
      this.btnTestGemini = document.getElementById('btn-test-gemini');
      this.btnSaveGemini = document.getElementById('btn-save-gemini');
      this.btnResetGemini = document.getElementById('btn-reset-gemini');
    }

    bindEvents() {
      // Toggle Open/Close
      if (this.toggleBtn) this.toggleBtn.addEventListener('click', () => this.toggleChat());
      if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeChat());
      if (this.clearBtn) this.clearBtn.addEventListener('click', () => this.clearChat());

      // Expand / Wide Mode Toggle
      if (this.expandBtn) {
        this.expandBtn.addEventListener('click', () => this.toggleWideMode());
      }

      // Settings Panel Open/Close (Admin Only)
      if (this.settingsBtn) {
        this.settingsBtn.addEventListener('click', () => this.openSettings());
      }
      if (this.closeSettingsBtn) {
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
      }

      // Toggle Key Visibility
      if (this.toggleKeyVisBtn && this.apiKeyInput) {
        this.toggleKeyVisBtn.addEventListener('click', () => {
          const isPass = this.apiKeyInput.type === "password";
          this.apiKeyInput.type = isPass ? "text" : "password";
          this.toggleKeyVisBtn.textContent = isPass ? "🔒" : "👁️";
        });
      }

      // Save Settings
      if (this.btnSaveGemini) {
        this.btnSaveGemini.addEventListener('click', () => this.handleSaveSettings());
      }

      // Test Connection
      if (this.btnTestGemini) {
        this.btnTestGemini.addEventListener('click', () => this.handleTestConnection());
      }

      // Reset to Local
      if (this.btnResetGemini) {
        this.btnResetGemini.addEventListener('click', () => this.handleResetSettings());
      }

      // Listen to Auth State changes (e.g. login/logout)
      document.addEventListener("caprice:auth", () => {
        this.updateAdminControls();
        this.updateStatusBadge();
      });

      // Form Submit
      if (this.form) {
        this.form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleUserSubmit();
        });
      }

      // Quick Chips Click
      if (this.chipsContainer) {
        this.chipsContainer.addEventListener('click', (e) => {
          const chip = e.target.closest('.chat-chip-btn');
          if (chip) {
            const query = chip.getAttribute('data-query');
            if (query && this.input) {
              this.input.value = query;
              this.handleUserSubmit();
            }
          }
        });
      }

      // Copy Code Blocks delegation
      if (this.messagesBody) {
        this.messagesBody.addEventListener('click', (e) => {
          const copyBtn = e.target.closest('.chat-code-copy-btn');
          if (copyBtn) {
            const container = copyBtn.closest('.chat-code-container');
            const codeEl = container ? container.querySelector('pre code') : null;
            if (codeEl) {
              navigator.clipboard.writeText(codeEl.textContent).then(() => {
                const origHtml = copyBtn.innerHTML;
                copyBtn.innerHTML = '<span>✅</span> Tersalin!';
                setTimeout(() => copyBtn.innerHTML = origHtml, 2000);
              }).catch(() => {
                copyBtn.textContent = 'Gagal!';
              });
            }
          }
        });
      }

      // Close on Escape Key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          if (this.settingsPanel && this.settingsPanel.classList.contains('active')) {
            this.closeSettings();
          } else {
            this.closeChat();
          }
        }
      });
    }

    updateAdminControls() {
      const canManage = isUserAdminOrSuperAdmin();
      if (this.settingsBtn) {
        this.settingsBtn.style.display = canManage ? "inline-flex" : "none";
      }
      if (this.settingsPanel && !canManage) {
        this.settingsPanel.classList.remove("active");
      }
      if (this.statusDesc) {
        const hasKey = GeminiClient.hasApiKey();
        if (hasKey) {
          this.statusDesc.textContent = "Google AI Studio Active ⚡";
        } else {
          this.statusDesc.textContent = canManage
            ? "Knowledge Base Offline (Klik ⚙️ untuk aktifkan Gemini)"
            : "Asisten Cerdas X RPL 1";
        }
      }
    }

    updateStatusBadge() {
      const hasKey = GeminiClient.hasApiKey();
      const model = GeminiClient.getModel();

      if (this.modeBadge) {
        if (hasKey) {
          this.modeBadge.className = 'chatbot-mode-badge';
          this.modeBadge.innerHTML = `🟢 ${model.replace('gemini-', 'Gemini ')}`;
        } else {
          this.modeBadge.className = 'chatbot-mode-badge mode-local';
          this.modeBadge.innerHTML = `🟡 Mode Lokal`;
        }
      }

      if (this.avatar) {
        if (hasKey) {
          this.avatar.classList.add('gemini-live');
        } else {
          this.avatar.classList.remove('gemini-live');
        }
      }
    }

    openSettings() {
      if (!isUserAdminOrSuperAdmin()) {
        console.warn("Akses ditolak: Pengaturan hanya dapat diakses oleh Super Admin dan Admin.");
        return;
      }
      this.apiKeyInput.value = GeminiClient.getApiKey();
      this.modelSelect.value = GeminiClient.getModel();
      this.testResult.style.display = 'none';
      this.settingsPanel.classList.add('active');
    }

    closeSettings() {
      this.settingsPanel.classList.remove('active');
      this.updateAdminControls();
      this.updateStatusBadge();
    }

    async handleTestConnection() {
      if (!isUserAdminOrSuperAdmin()) return;
      const key = this.apiKeyInput.value.trim();
      const model = this.modelSelect.value;
      this.btnTestGemini.disabled = true;
      this.btnTestGemini.textContent = "Menguji...";
      this.testResult.style.display = 'block';
      this.testResult.style.background = "rgba(255,255,255,0.06)";
      this.testResult.style.color = "#fff";
      this.testResult.textContent = "Menghubungi Google AI Studio...";

      const res = await GeminiClient.testConnection(key, model);
      this.btnTestGemini.disabled = false;
      this.btnTestGemini.textContent = "🧪 Tes Koneksi";

      if (res.ok) {
        if (res.modelSwitched) {
          this.modelSelect.value = res.modelSwitched;
        }
        const activeModel = res.modelSwitched || model;
        this.testResult.style.background = "rgba(16,185,129,0.15)";
        this.testResult.style.border = "1px solid rgba(16,185,129,0.3)";
        this.testResult.style.color = "#10b981";
        this.testResult.innerHTML = "✅ <strong>Koneksi Berhasil!</strong> API Key aktif dan siap digunakan dengan <strong>" + activeModel + "</strong>" + (res.modelSwitched ? " (otomatis dialihkan dari model lama yang telah usang)." : ".");
      } else {
        this.testResult.style.background = "rgba(239,68,68,0.15)";
        this.testResult.style.border = "1px solid rgba(239,68,68,0.3)";
        this.testResult.style.color = "#f87171";
        this.testResult.innerHTML = "❌ <strong>Koneksi Gagal:</strong> " + escapeHTML(res.error);
      }
    }

    handleSaveSettings() {
      if (!isUserAdminOrSuperAdmin()) return;
      const key = this.apiKeyInput.value.trim();
      const model = this.modelSelect.value;
      GeminiClient.setApiKey(key);
      GeminiClient.setModel(model);
      this.updateAdminControls();
      this.updateStatusBadge();
      this.closeSettings();
      this.addBotMessage(`⚙️ **Pengaturan Diperbarui!**\nMode kecerdasan saat ini: **${key ? 'Google AI Studio (' + model + ')' : 'Mode Lokal'}**. Kredensial aktif untuk seluruh pengguna portal. 🚀`, true);
    }

    handleResetSettings() {
      if (!isUserAdminOrSuperAdmin()) return;
      GeminiClient.setApiKey("");
      this.apiKeyInput.value = "";
      this.updateAdminControls();
      this.updateStatusBadge();
      this.closeSettings();
      this.addBotMessage(`🔄 **Beralih ke Mode Lokal:** API Key telah dihapus. Chatbot kini berjalan offline dengan basis pengetahuan lokal kelas X RPL 1.`, true);
    }

    toggleWideMode() {
      this.isWide = !this.isWide;
      this.chatWindow.classList.toggle('wide-mode', this.isWide);
      if (this.expandBtn) {
        this.expandBtn.textContent = this.isWide ? '⤦' : '⛶';
        this.expandBtn.title = this.isWide ? 'Kecilkan Tampilan' : 'Perlebar Tampilan';
      }
    }

    toggleChat() {
      if (this.isOpen) {
        this.closeChat();
      } else {
        this.openChat();
      }
    }

    openChat() {
      this.isOpen = true;
      this.updateAdminControls();
      this.chatWindow.classList.add('active');
      this.toggleBtn.classList.add('active');
      this.chatWindow.setAttribute('aria-hidden', 'false');
      ChatAudio.playBeep('open');
      setTimeout(() => {
        if (this.input) this.input.focus();
        this.scrollToBottom();
      }, 150);
    }

    closeChat() {
      this.isOpen = false;
      this.chatWindow.classList.remove('active');
      this.toggleBtn.classList.remove('active');
      this.chatWindow.setAttribute('aria-hidden', 'true');
      if (this.settingsPanel) this.settingsPanel.classList.remove('active');
    }

    clearChat() {
      this.conversationHistory = [];
      if (!this.messagesBody) return;
      this.messagesBody.querySelectorAll('.chat-bubble-row').forEach(el => el.remove());
      this.loadWelcomeMessage();
    }

    loadWelcomeMessage() {
      if (!this.messagesBody) return;
      const hasKey = GeminiClient.hasApiKey();
      const canManage = isUserAdminOrSuperAdmin();

      let welcome = `👋 **Halo! Selamat datang di Website X RPL 1 (Caprice 26)!**\n\nSaya **Caprice AI ⚡**, asisten cerdas resmi kelas X Rekayasa Perangkat Lunak 1.\n\n`;
      if (hasKey) {
        welcome += `🟢 **Model Gemini AI Siap:** Ajukan pertanyaan apa pun seputar kelas X RPL 1, belajar coding, matematika, atau obrolan santai!`;
      } else if (canManage) {
        welcome += `💡 *Halo Pengurus! Klik tombol ⚙️ di kanan atas untuk memasukkan Google AI Studio API Key agar AI semakin cerdas & kontekstual.*\n\nKamu tetap bisa bertanya seputar jadwal, piket, 38 siswa, dan projek!`;
      } else {
        welcome += `Silakan tanyakan info mengenai:\n• 📅 **Jadwal Pelajaran** harian\n• 🧹 **Jadwal Piket Kelas**\n• 👑 **Pengurus & 38 Siswa**\n• 🎮 **Projek & Lab Game**\n\n*Ketik pertanyaanmu di bawah atau klik tombol pertanyaan cepat!*`;
      }

      this.addBotMessage(welcome, false);
    }

    async handleUserSubmit() {
      const text = this.input ? this.input.value.trim() : '';
      if (!text || this.isTyping) return;

      if (this.input) this.input.value = '';
      this.addUserMessage(text);
      ChatAudio.playBeep('send');

      // Record user turn in conversation history
      this.conversationHistory.push({ role: 'user', text: text });

      // Cek apakah query adalah operasi matematika langsung
      const directMath = trySolveMath(text);
      if (directMath) {
        this.conversationHistory.push({ role: 'model', text: directMath });
        this.showTyping(true);
        setTimeout(() => {
          this.showTyping(false);
          this.streamBotMessage(directMath);
          ChatAudio.playBeep('receive');
        }, 220);
        return;
      }

      // Show Typing Animation
      this.showTyping(true);

      const hasKey = GeminiClient.hasApiKey();

      if (hasKey) {
        try {
          const aiResponse = await GeminiClient.generateResponse(text, this.conversationHistory);
          this.conversationHistory.push({ role: 'model', text: aiResponse });
          this.showTyping(false);
          this.streamBotMessage(aiResponse);
          ChatAudio.playBeep('receive');
        } catch (err) {
          console.warn("Gemini API error, falling back to local engine:", err);
          // Graceful fallback to local rule-based processing
          const localReply = processQuery(text);
          this.showTyping(false);
          const notice = `*(Catatan: Terjadi kendala saat menghubungi Google AI Studio: ${escapeHTML(err.message)}. Menampilkan jawaban dari basis pengetahuan lokal:)*\n\n${localReply}`;
          this.addBotMessage(notice, true);
          ChatAudio.playBeep('receive');
        }
      } else {
        // Fallback to local rule-based engine
        const thinkTime = Math.floor(Math.random() * 250) + 300;
        setTimeout(() => {
          const reply = processQuery(text);
          this.showTyping(false);
          this.streamBotMessage(reply);
          ChatAudio.playBeep('receive');
        }, thinkTime);
      }
    }

    addUserMessage(text) {
      if (!this.messagesBody) return;
      const time = this.getCurrentTime();
      const row = document.createElement('div');
      row.className = 'chat-bubble-row user-row';
      row.innerHTML = `
        <div class="chat-bubble user-bubble">
          <div class="bubble-content">${escapeHTML(text)}</div>
          <span class="bubble-time">${time}</span>
        </div>
      `;
      this.messagesBody.insertBefore(row, this.typingIndicator);
      this.scrollToBottom();
    }

    addBotMessage(text, animate = true) {
      if (!this.messagesBody) return;
      const time = this.getCurrentTime();
      const row = document.createElement('div');
      row.className = 'chat-bubble-row bot-row' + (animate ? ' animate-pop' : '');
      row.innerHTML = `
        <div class="chat-bot-avatar">⚡</div>
        <div class="chat-bubble bot-bubble">
          <div class="bubble-content">${formatMessageText(text)}</div>
          <span class="bubble-time">${time}</span>
        </div>
      `;
      this.messagesBody.insertBefore(row, this.typingIndicator);
      this.scrollToBottom();
    }

    streamBotMessage(fullText) {
      if (!this.messagesBody) return;
      const time = this.getCurrentTime();
      const row = document.createElement('div');
      row.className = 'chat-bubble-row bot-row animate-pop';
      row.innerHTML = `
        <div class="chat-bot-avatar">⚡</div>
        <div class="chat-bubble bot-bubble">
          <div class="bubble-content"><span class="stream-text"></span><span class="streaming-cursor"></span></div>
          <span class="bubble-time">${time}</span>
        </div>
      `;
      this.messagesBody.insertBefore(row, this.typingIndicator);
      this.scrollToBottom();

      const textEl = row.querySelector('.stream-text');
      const cursorEl = row.querySelector('.streaming-cursor');
      const bubbleContent = row.querySelector('.bubble-content');

      // Words stream animation
      const words = fullText.split(' ');
      let currentIdx = 0;
      const streamBatchSize = Math.max(1, Math.floor(words.length / 40));

      const interval = setInterval(() => {
        currentIdx += streamBatchSize;
        if (currentIdx >= words.length) {
          clearInterval(interval);
          if (cursorEl) cursorEl.remove();
          if (bubbleContent) bubbleContent.innerHTML = formatMessageText(fullText);
          this.scrollToBottom();
        } else {
          const partial = words.slice(0, currentIdx).join(' ');
          if (textEl) textEl.innerHTML = formatMessageText(partial);
          this.scrollToBottom();
        }
      }, 35);
    }

    showTyping(show) {
      this.isTyping = show;
      if (this.typingIndicator) {
        this.typingIndicator.style.display = show ? 'flex' : 'none';
        if (show) this.scrollToBottom();
      }
    }

    getCurrentTime() {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      return `${h}:${m}`;
    }

    scrollToBottom() {
      if (this.messagesBody) {
        this.messagesBody.scrollTop = this.messagesBody.scrollHeight;
      }
    }
  }

  // Auto initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CapriceChatbotWidget());
  } else {
    new CapriceChatbotWidget();
  }
})();

