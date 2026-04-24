// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left = mx - 6 + 'px'; cursor.style.top = my - 6 + 'px'; });
function animRing() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx - 18 + 'px'; ring.style.top = ry - 18 + 'px'; requestAnimationFrame(animRing); }
animRing();
document.querySelectorAll('button,a').forEach(el => { el.addEventListener('mouseenter', () => { cursor.style.transform = 'scale(2)'; ring.style.transform = 'scale(1.5)'; }); el.addEventListener('mouseleave', () => { cursor.style.transform = 'scale(1)'; ring.style.transform = 'scale(1)'; }); });

// ── NAV ──
window.addEventListener('scroll', () => { document.getElementById('navbar').classList.toggle('scrolled', scrollY > 60); });

// ── SMOOTH SCROLL ──
function smooth(e, id) { e.preventDefault(); document.getElementById(id).scrollIntoView({ behavior: 'smooth' }); }

// ── FADE UP ──
const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }); }, { threshold: 0.15 });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));

// ── FLOATING ORBS ──
function spawnOrb() { const o = document.createElement('div'); o.className = 'orb'; const size = 6 + Math.random() * 20; const colors = ['rgba(91,184,232,0.25)', 'rgba(26,111,168,0.15)', 'rgba(184,223,245,0.3)']; o.style.cssText = `width:${size}px;height:${size}px;background:${colors[Math.floor(Math.random() * 3)]};left:${Math.random() * 100}%;animation-duration:${8 + Math.random() * 12}s;animation-delay:${Math.random() * 3}s;`; document.getElementById('hero').appendChild(o); setTimeout(() => o.remove(), 25000); }
setInterval(spawnOrb, 1200); for (let i = 0; i < 6; i++)spawnOrb();

// ── OCEAN CANVAS ──
const configs = [
    { id: 'ocean1', color1: 'rgba(150,160,180,0.45)', color2: 'rgba(100,110,130,0.25)', speed: 0.8 },
    { id: 'ocean2', color1: 'rgba(181,24,74,0.5)', color2: 'rgba(100,0,30,0.3)', speed: 0.9 },
    { id: 'ocean3', color1: 'rgba(46,127,192,0.5)', color2: 'rgba(26,74,128,0.3)', speed: 1.0 },
    { id: 'ocean4', color1: 'rgba(0,153,224,0.55)', color2: 'rgba(0,112,184,0.3)', speed: 1.2 },
    { id: 'ocean5', color1: 'rgba(74,154,168,0.5)', color2: 'rgba(42,101,112,0.3)', speed: 1.1 },
];
const isMobile = /Android|webOS|iPhone|iPad/i.test(navigator.userAgent);
configs.forEach(cfg => {
    const canvas = document.getElementById(cfg.id); if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    function resizeCanvas() { canvas.width = canvas.offsetWidth || 300; canvas.height = canvas.offsetHeight || 100; }
    resizeCanvas(); window.addEventListener('resize', resizeCanvas);
    const W = () => canvas.width, H = () => canvas.height; let t = Math.random() * 100;
    function wave(offset, amp, freq, yBase, color) { const cW = W(), cH = H(); ctx.beginPath(); ctx.moveTo(0, cH); for (let x = 0; x <= cW; x += 4) { const y = yBase + Math.sin((x * freq) + t + offset) * amp + Math.sin((x * freq * 1.7) + t * 1.3 + offset) * (amp * 0.4); ctx.lineTo(x, y); } ctx.lineTo(cW, cH); ctx.lineTo(0, cH); ctx.closePath(); ctx.fillStyle = color; ctx.fill(); }
    const bubbles = Array.from({ length: 4 }, () => ({ x: Math.random() * 300, y: 80 - Math.random() * 60, r: 2 + Math.random() * 4, vy: 0.3 + Math.random() * 0.4, opacity: 0.3 + Math.random() * 0.3 }));
    let fc = 0; function draw() { fc++; if (fc % 2 === 0) { requestAnimationFrame(draw); return; } const cW = W(), cH = H(); ctx.clearRect(0, 0, cW, cH); t += 0.015 * cfg.speed; wave(0, cH * 0.35, 0.025, cH * 0.45, cfg.color2); wave(1.5, cH * 0.28, 0.030, cH * 0.38, cfg.color1); bubbles.forEach(b => { b.y -= b.vy; if (b.y < 0) { b.y = cH; b.x = Math.random() * cW; } ctx.beginPath(); ctx.arc(b.x + Math.sin(t + b.x) * 2, b.y, b.r, 0, Math.PI * 2); ctx.strokeStyle = cfg.color1.replace(/[\d.]+\)$/, b.opacity + ')'); ctx.lineWidth = 1; ctx.stroke(); }); requestAnimationFrame(draw); }
    setTimeout(draw, Math.random() * 200);
});

// ── SLIDER ──
const track = document.getElementById('sliderTrack');
const cards = track.querySelectorAll('.admin-card');
const total = cards.length;
let current = 0, startX = 0, isDragging = false, dragOffset = 0;
const dotsEl = document.getElementById('sliderDots');
for (let i = 0; i < total; i++) { const d = document.createElement('button'); d.className = 'dot' + (i === 0 ? ' active' : ''); d.onclick = () => goTo(i); dotsEl.appendChild(d); }
function getCardWidth() { return cards[0].getBoundingClientRect().width + 20; }
function goTo(idx) { current = Math.max(0, Math.min(idx, total - 1)); track.style.transform = `translateX(-${current * getCardWidth()}px)`; document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current)); }
function slide(dir) { goTo(current + dir); }
track.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; track.style.transition = 'none'; });
track.addEventListener('touchstart', e => { isDragging = true; startX = e.touches[0].clientX; track.style.transition = 'none'; });
document.addEventListener('mousemove', e => { if (!isDragging) return; dragOffset = e.clientX - startX; track.style.transform = `translateX(${-current * getCardWidth() + dragOffset}px)`; });
document.addEventListener('touchmove', e => { if (!isDragging) return; dragOffset = e.touches[0].clientX - startX; track.style.transform = `translateX(${-current * getCardWidth() + dragOffset}px)`; });
function endDrag() { if (!isDragging) return; isDragging = false; track.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'; if (dragOffset < -60) goTo(current + 1); else if (dragOffset > 60) goTo(current - 1); else goTo(current); dragOffset = 0; }
document.addEventListener('mouseup', endDrag); document.addEventListener('touchend', endDrag);
document.addEventListener('keydown', e => { if (e.key === 'ArrowRight') slide(1); if (e.key === 'ArrowLeft') slide(-1); });

// ── GAME TABS ──
function switchGame(type) { ['quizGame', 'reflexGame', 'pitchGame'].forEach(id => document.getElementById(id).style.display = 'none'); document.getElementById(type + 'Game').style.display = 'block'; document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); document.querySelectorAll('.tab-btn')[['quiz', 'reflex', 'pitch'].indexOf(type)].classList.add('active'); }

// ── QUIZ ──
const quizData = [{ q: "Apa itu impersonasi suara?", opts: ["Meniru suara orang/karakter lain", "Membuat lagu baru", "Menulis lirik", "Mixing audio"], ans: 0 }, { q: "Genre musik apa yang identik dengan vokal gelap & emosional?", opts: ["Dangdut", "R&B/Soul", "Rock Metal", "Jazz"], ans: 1 }, { q: "Dubbing paling banyak dipakai di bidang apa?", opts: ["Olahraga", "Anime & Film", "Politik", "Arsitektur"], ans: 1 }, { q: "Apa arti kata 'ゆうる' (Yuuru) dalam bahasa Jepang?", opts: ["Keras & tegas", "Mengalir bebas", "Diam membisu", "Berteriak kencang"], ans: 1 }, { q: "Teknik suara untuk meniru bass rendah disebut?", opts: ["Falsetto", "Chest Voice", "Fry/Growl", "Head Voice"], ans: 2 }, { q: "Yuuru Club bergerak di berapa bidang utama?", opts: ["1", "2", "3", "4"], ans: 2 }, { q: "Warna dominan logo Yuuru Club?", opts: ["Merah & hitam", "Biru & putih", "Hijau & kuning", "Ungu & emas"], ans: 1 }, { q: "Voice actor profesional biasanya latihan apa?", opts: ["Berlari", "Artikulasi & breathing", "Mengetik cepat", "Melukis"], ans: 1 }, { q: "Istilah 'pitch' dalam musik merujuk ke?", opts: ["Volume suara", "Kecepatan lagu", "Tinggi-rendah nada", "Durasi nada"], ans: 2 }, { q: "Perbedaan cover dan dub?", opts: ["Tidak ada bedanya", "Cover = nyanyi, Dub = suarakan dialog", "Cover = instrumen, Dub = vokal", "Keduanya sama"], ans: 1 }];
let qIdx = 0, qScore = 0, qTotal = 0, qActive = false;
function startQuiz() { qIdx = Math.floor(Math.random() * quizData.length); qScore = 0; qTotal = 0; qActive = true; document.getElementById('quizScore').textContent = 0; document.getElementById('quizQ').textContent = 0; document.getElementById('quizResult').textContent = ''; document.getElementById('quizStartBtn').textContent = 'Next ▶'; showQuizQ(); }
function showQuizQ() { const d = quizData[qIdx]; document.getElementById('quizQuestion').textContent = (qTotal + 1) + '. ' + d.q; const opts = document.querySelectorAll('.quiz-opt'); d.opts.forEach((o, i) => { opts[i].textContent = o; opts[i].disabled = false; opts[i].className = 'quiz-opt'; }); document.getElementById('quizResult').textContent = ''; }
function answerQuiz(idx) { if (!qActive) return; const d = quizData[qIdx]; const opts = document.querySelectorAll('.quiz-opt'); opts.forEach(o => o.disabled = true); if (idx === d.ans) { opts[idx].classList.add('correct'); qScore++; document.getElementById('quizResult').textContent = '✅ Bener!'; document.getElementById('quizResult').className = 'game-result success'; } else { opts[idx].classList.add('wrong'); opts[d.ans].classList.add('correct'); document.getElementById('quizResult').textContent = '❌ Salah!'; document.getElementById('quizResult').className = 'game-result fail'; } qTotal++; document.getElementById('quizScore').textContent = qScore; document.getElementById('quizQ').textContent = qTotal; qIdx = (qIdx + 1) % quizData.length; if (qTotal >= 10) { setTimeout(() => { document.getElementById('quizQuestion').textContent = `🎉 Selesai! Skor: ${qScore}/10`; document.getElementById('quizResult').textContent = ''; document.getElementById('quizStartBtn').textContent = '▶ Main Lagi'; qActive = false; }, 1200); } }

// ── REFLEX ──
let reflexScore = 0, reflexMiss = 0, reflexTimer = null, reflexCountdown = null, reflexActive = false, reflexTargets = [];
function startReflex() { if (reflexActive) return; reflexActive = true; reflexScore = 0; reflexMiss = 0; document.getElementById('reflexScore').textContent = 0; document.getElementById('reflexMiss').textContent = 0; document.getElementById('reflexStartBtn').disabled = true; document.getElementById('reflexHint').style.display = 'none'; let t = 20; document.getElementById('reflexTime').textContent = t; reflexCountdown = setInterval(() => { t--; document.getElementById('reflexTime').textContent = t; if (t <= 0) stopReflex(); }, 1000); reflexTimer = setInterval(spawnTarget, 700); }
function spawnTarget() { const arena = document.getElementById('reflexArena'); const w = arena.offsetWidth, h = arena.offsetHeight; const size = 44 + Math.random() * 24; const x = Math.random() * (w - size - 10) + 5; const y = Math.random() * (h - size - 10) + 5; const dot = document.createElement('div'); dot.style.cssText = `position:absolute;width:${size}px;height:${size}px;left:${x}px;top:${y}px;border-radius:50%;cursor:pointer;background:radial-gradient(circle at 35% 35%,#a8d8f0,#1a6fa8);box-shadow:0 0 20px rgba(91,184,232,0.6);animation:popIn 0.2s ease;`; const st = document.createElement('style'); st.textContent = '@keyframes popIn{from{transform:scale(0)}to{transform:scale(1)}}'; document.head.appendChild(st); let alive = true; const timeout = setTimeout(() => { if (alive && dot.parentNode) { dot.remove(); alive = false; reflexMiss++; document.getElementById('reflexMiss').textContent = reflexMiss; } }, 1400); dot.addEventListener('click', () => { if (!alive) return; clearTimeout(timeout); alive = false; dot.style.transform = 'scale(1.4)'; dot.style.background = 'radial-gradient(circle at 35% 35%,#fff,#5bb8e8)'; setTimeout(() => dot.remove(), 200); reflexScore++; document.getElementById('reflexScore').textContent = reflexScore; }); arena.appendChild(dot); reflexTargets.push(dot); }
function stopReflex() { reflexActive = false; clearInterval(reflexTimer); clearInterval(reflexCountdown); reflexTargets.forEach(d => { if (d.parentNode) d.remove(); }); reflexTargets = []; document.getElementById('reflexStartBtn').disabled = false; document.getElementById('reflexTime').textContent = 0; document.getElementById('reflexHint').style.display = 'block'; document.getElementById('reflexHint').textContent = `Done! Hit: ${reflexScore} | Miss: ${reflexMiss}`; }

// ── PITCH ──
const pitchData = [{ char: "Karakter Villain Anime", sub: "Suara gelap & berwibawa", opts: ["Tinggi & ceria 🎶", "Dalam & menggelegar 🔱", "Serak & kasar ⚡", "Pelan & lembut 🌸"], ans: 1 }, { char: "Karakter Anak Kecil", sub: "Imut & polos", opts: ["Berat & serak", "Sedang & datar", "Tinggi & imut 🐣", "Rendah & berat"], ans: 2 }, { char: "Narrator Dokumenter", sub: "Profesional & terpercaya", opts: ["Ngobrol santai", "Sedang, tenang & jelas 📖", "Berteriak semangat", "Berbisik misterius"], ans: 1 }, { char: "Karakter Robot AI", sub: "Mekanis & dingin", opts: ["Hangat & emosional", "Datar, ritmis & presisi 🤖", "Bergetar & parau", "Melengking & histeris"], ans: 1 }, { char: "MC Konser Musik", sub: "Energik & hype", opts: ["Pelan & serak", "Sedang & monoton", "Keras, semangat & dinamis 🎤", "Bisik-bisik"], ans: 2 }, { char: "Karakter Bijak / Kakek Tua", sub: "Penuh pengalaman", opts: ["Cepat & bersemangat", "Pelan, dalam & berkesan 🧙", "Tinggi & kekanak-kanakan", "Jernih & cepat"], ans: 1 }];
let pIdx = 0, pScore = 0, pTotal = 0, pActive = false;
function startPitch() { pScore = 0; pTotal = 0; pActive = true; pIdx = 0; document.getElementById('pitchScore').textContent = 0; document.getElementById('pitchQ').textContent = 0; document.getElementById('pitchResult').textContent = ''; document.getElementById('pitchStartBtn').textContent = 'Next ▶'; showPitchQ(); document.querySelectorAll('.pitch-bar').forEach(b => b.classList.remove('idle')); }
function showPitchQ() { const d = pitchData[pIdx]; document.getElementById('pitchTarget').innerHTML = d.char + '<small>' + d.sub + '</small>'; const btns = [document.getElementById('pc1'), document.getElementById('pc2'), document.getElementById('pc3'), document.getElementById('pc4')]; d.opts.forEach((o, i) => { btns[i].textContent = o; btns[i].disabled = false; btns[i].className = 'quiz-opt'; }); document.getElementById('pitchResult').textContent = ''; }
function answerPitch(idx) { if (!pActive) return; const d = pitchData[pIdx]; const btns = [document.getElementById('pc1'), document.getElementById('pc2'), document.getElementById('pc3'), document.getElementById('pc4')]; btns.forEach(b => b.disabled = true); if (idx === d.ans) { btns[idx].classList.add('correct'); pScore++; document.getElementById('pitchResult').textContent = '✅ Pilihan tepat!'; document.getElementById('pitchResult').className = 'game-result success'; } else { btns[idx].classList.add('wrong'); btns[d.ans].classList.add('correct'); document.getElementById('pitchResult').textContent = '❌ Kurang pas!'; document.getElementById('pitchResult').className = 'game-result fail'; } pTotal++; pIdx = (pIdx + 1) % pitchData.length; document.getElementById('pitchScore').textContent = pScore; document.getElementById('pitchQ').textContent = pTotal; if (pTotal >= 6) { setTimeout(() => { document.getElementById('pitchTarget').innerHTML = `🎉 Done! Skor: ${pScore}/6<small>Gimana, udah kenal dunia suara?</small>`; document.getElementById('pitchResult').textContent = ''; document.getElementById('pitchStartBtn').textContent = '▶ Ulang'; document.querySelectorAll('.pitch-bar').forEach(b => b.classList.add('idle')); pActive = false; }, 1200); } }

// ── MINECRAFT PIXEL TEXT ──
(function () {
    const glyphs = { 'Y': [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 0, 1, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]], 'U': [[1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [0, 1, 1, 1, 0]], 'R': [[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0], [1, 0, 1, 0, 0], [1, 0, 0, 1, 0]], 'C': [[0, 1, 1, 1, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [0, 1, 1, 1, 0]], 'L': [[1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]], 'B': [[1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0], [1, 0, 0, 0, 1], [1, 1, 1, 1, 0]], ' ': [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]] };
    const text = 'YUURU CLUB'; const px = 7; const gap = 2;
    const cols = text.split('').reduce((a, c) => a + (glyphs[c]?.[0]?.length || 3) + gap, 0);
    const mc = document.getElementById('mcText'); if (!mc) return;
    mc.width = cols * px; mc.height = 5 * px + px + 4; mc.style.width = Math.min(cols * px, 360) + 'px'; mc.style.height = 'auto';
    const ctx = mc.getContext('2d'); ctx.imageSmoothingEnabled = false;
    let cx = 0; for (const char of text) { const g = glyphs[char]; if (!g) continue; for (let row = 0; row < g.length; row++) { for (let col = 0; col < g[row].length; col++) { if (g[row][col]) { ctx.fillStyle = '#1a3a52'; ctx.fillRect((cx + col) * px + px, row * px + px, px, px); ctx.fillStyle = '#5bb8e8'; ctx.fillRect((cx + col) * px, row * px, px, px); } } } cx += g[0].length + gap; }
})();

// ── PACMAN ──
(function () {
    const pc = document.getElementById('pacCanvas'); if (!pc) return;
    const ctx = pc.getContext('2d'); let W, H;
    function resize() { W = pc.parentElement.offsetWidth; H = 36; pc.width = W; pc.height = H; }
    resize(); window.addEventListener('resize', () => { resize(); initPellets(); });
    const R = 10; let px2 = R + 8, dir = 1, mouthAngle = 0, mouthDir = 1;
    let pellets = [];
    function initPellets() { pellets = []; for (let i = 20; i < W - 20; i += 20)pellets.push({ x: i, eaten: false }); }
    initPellets();
    function drawPacman(cx, cy) { const ma = mouthAngle * (Math.PI / 180); ctx.beginPath(); ctx.moveTo(cx, cy); if (dir === 1) ctx.arc(cx, cy, R, ma, Math.PI * 2 - ma); else ctx.arc(cx, cy, R, Math.PI + ma, Math.PI - ma); ctx.closePath(); ctx.fillStyle = '#f5c518'; ctx.fill(); const ex = dir === 1 ? cx - 2 : cx + 2; ctx.beginPath(); ctx.arc(ex, cy - R * 0.42, 1.8, 0, Math.PI * 2); ctx.fillStyle = '#0d1e2a'; ctx.fill(); }
    const ghostColors = ['rgba(232,80,80,0.85)', 'rgba(255,182,85,0.85)', 'rgba(100,220,100,0.85)', 'rgba(180,100,230,0.85)', 'rgba(50,150,255,0.85)'];
    function drawGhost(gx, cy, color) { if (gx < R || gx > W - R) return; ctx.save(); ctx.fillStyle = color; ctx.beginPath(); ctx.arc(gx, cy - 3, R * 0.8, Math.PI, 0); ctx.lineTo(gx + R * 0.8, cy + R * 0.55); const bw = R * 1.6; for (let i = 3; i >= 0; i--) { const wx = gx - R * 0.8 + (bw / 3) * i; const wy = i % 2 === 0 ? cy + R * 0.55 : cy + R * 0.15; ctx.lineTo(wx, wy); } ctx.closePath(); ctx.fill();[-0.28, 0.28].forEach(ex => { ctx.beginPath(); ctx.arc(gx + ex * R, cy - 3, R * 0.22, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.beginPath(); ctx.arc(gx + ex * R + dir * 1.5, cy - 1.5, R * 0.1, 0, Math.PI * 2); ctx.fillStyle = '#1a3a8a'; ctx.fill(); }); ctx.restore(); }
    function animate() { ctx.clearRect(0, 0, W, H); const cy = H / 2; mouthAngle += mouthDir * 4.5; if (mouthAngle >= 30) mouthDir = -1; if (mouthAngle <= 0) mouthDir = 1; px2 += dir * 1.6; if (px2 > W - R - 4) { dir = -1; initPellets(); } if (px2 < R + 4) { dir = 1; initPellets(); } pellets.forEach(p => { if (!p.eaten) { if (Math.abs(p.x - px2) < R + 2) { p.eaten = true; return; } ctx.beginPath(); ctx.arc(p.x, cy, 3, 0, Math.PI * 2); ctx.fillStyle = 'rgba(91,184,232,0.3)'; ctx.fill(); } }); ghostColors.forEach((color, i) => { const gx = px2 - dir * (42 + i * 38); drawGhost(gx, cy, color); }); drawPacman(px2, cy); requestAnimationFrame(animate); }
    animate();
})();

// ── BG: CLOUDS + SAKURA ──
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
function resizeBg() { bgCanvas.width = window.innerWidth; bgCanvas.height = window.innerHeight; }
resizeBg(); window.addEventListener('resize', resizeBg);

const clouds = [
    { x: -300, y: 40, speed: 0.20, scale: 1.3, opacity: 0.88, puffs: [{ x: 0, y: 0, r: 52 }, { x: 68, y: -22, r: 62 }, { x: 136, y: 4, r: 48 }, { x: 195, y: -8, r: 42 }, { x: 248, y: 10, r: 35 }] },
    { x: 600, y: 100, speed: 0.13, scale: 0.9, opacity: 0.70, puffs: [{ x: 0, y: 0, r: 38 }, { x: 52, y: -14, r: 48 }, { x: 100, y: 2, r: 36 }, { x: 145, y: -4, r: 30 }] },
    { x: 1100, y: 60, speed: 0.17, scale: 1.1, opacity: 0.75, puffs: [{ x: 0, y: 0, r: 46 }, { x: 62, y: -18, r: 55 }, { x: 120, y: 3, r: 42 }, { x: 172, y: -7, r: 34 }] },
    { x: 200, y: 20, speed: 0.25, scale: 0.7, opacity: 0.55, puffs: [{ x: 0, y: 0, r: 30 }, { x: 40, y: -10, r: 38 }, { x: 78, y: 2, r: 28 }] },
    { x: -700, y: 160, speed: 0.09, scale: 1.5, opacity: 0.50, puffs: [{ x: 0, y: 0, r: 58 }, { x: 78, y: -24, r: 70 }, { x: 156, y: 5, r: 52 }, { x: 225, y: -10, r: 45 }, { x: 280, y: 8, r: 38 }] },
    { x: 900, y: 140, speed: 0.15, scale: 0.85, opacity: 0.60, puffs: [{ x: 0, y: 0, r: 42 }, { x: 56, y: -15, r: 52 }, { x: 110, y: 3, r: 38 }] },
];

function drawCloud(ctx, cloud) { ctx.save(); ctx.translate(cloud.x, cloud.y); ctx.scale(cloud.scale, cloud.scale); ctx.globalAlpha = cloud.opacity; const grad = ctx.createLinearGradient(0, -80, 0, 60); grad.addColorStop(0, 'rgba(255,255,255,0.98)'); grad.addColorStop(0.5, 'rgba(240,248,255,0.95)'); grad.addColorStop(1, 'rgba(210,235,250,0.88)'); ctx.fillStyle = grad; ctx.shadowColor = 'rgba(100,160,220,0.15)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8; cloud.puffs.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; const hl = ctx.createLinearGradient(0, -80, 0, 0); hl.addColorStop(0, 'rgba(255,255,255,0.6)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = hl; cloud.puffs.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y - p.r * 0.15, p.r * 0.75, 0, Math.PI * 2); ctx.fill(); }); ctx.restore(); }

const petals = Array.from({ length: 55 }, () => ({ x: Math.random() * 1400, y: Math.random() * 900, size: 5 + Math.random() * 9, rot: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.04, vx: -0.3 + Math.random() * 0.6, vy: 0.4 + Math.random() * 0.8, swing: Math.random() * Math.PI * 2, swingSpeed: 0.01 + Math.random() * 0.02, opacity: 0.5 + Math.random() * 0.45, pink: Math.floor(Math.random() * 3) }));
const petalColors = [['rgba(255,210,220,', 'rgba(255,182,193,', 'rgba(255,220,228,'], ['rgba(255,175,185,', 'rgba(240,150,170,', 'rgba(255,200,210,'], ['rgba(240,140,160,', 'rgba(220,110,140,', 'rgba(250,180,195,']];
function drawPetal(ctx, p) { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.opacity; const c = petalColors[p.pink]; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size); g.addColorStop(0, c[0] + '1)'); g.addColorStop(0.6, c[1] + '0.9)'); g.addColorStop(1, c[2] + '0.3)'); ctx.fillStyle = g; for (let i = 0; i < 5; i++) { ctx.save(); ctx.rotate((i * Math.PI * 2) / 5); ctx.beginPath(); ctx.ellipse(0, -p.size * 0.6, p.size * 0.38, p.size * 0.65, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } ctx.beginPath(); ctx.arc(0, 0, p.size * 0.18, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,230,240,0.8)'; ctx.fill(); ctx.restore(); }

if (isMobile) petals.length = 25;
let bgT = 0, bgFrame = 0;
function animateBg() { bgFrame++; if (isMobile && bgFrame % 2 !== 0) { requestAnimationFrame(animateBg); return; } const W = bgCanvas.width, H = bgCanvas.height; bgCtx.clearRect(0, 0, W, H); bgT += 0.008; clouds.forEach(cloud => { cloud.x += cloud.speed; const cw = Math.max(...cloud.puffs.map(p => p.x + p.r)) * cloud.scale; if (cloud.x > W + 150) cloud.x = -cw - 100; drawCloud(bgCtx, cloud); }); petals.forEach(p => { p.swing += p.swingSpeed; p.x += p.vx + Math.sin(p.swing) * 0.5; p.y += p.vy; p.rot += p.rotSpeed; if (p.y > H + 30) { p.y = -20; p.x = Math.random() * W; } if (p.x > W + 20) p.x = -20; if (p.x < -20) p.x = W + 20; drawPetal(bgCtx, p); }); requestAnimationFrame(animateBg); }
animateBg();