/* main.js – PBL ConsultING */

/* CURSOR */
const glow = document.getElementById('cursorGlow');
const dot = document.getElementById('cursorDot');
document.addEventListener('mousemove', e => {
  if (dot) { dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; }
  if (glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; }
  document.querySelectorAll('.leistung-card, .about-card, .testimonial-card, .partner-card').forEach(card => {
    const r = card.getBoundingClientRect();
    if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
      const rx = ((e.clientY - (r.top + r.height/2)) / (r.height/2)) * 6;
      const ry = ((e.clientX - (r.left + r.width/2)) / (r.width/2)) * -6;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
    } else { card.style.transform = ''; }
  });
});
document.querySelectorAll('a, button, .leistung-card, .partner-card').forEach(el => {
  el.addEventListener('mouseenter', () => { if (!glow) return; glow.style.width='48px'; glow.style.height='48px'; });
  el.addEventListener('mouseleave', () => { if (!glow) return; glow.style.width='28px'; glow.style.height='28px'; });
});

/* NAV SCROLL */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* MOBILE MENU */
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
  document.body.style.overflow = document.getElementById('mobileMenu').classList.contains('open') ? 'hidden' : '';
}

/* SCROLL REVEAL */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* FORM */
function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('form-success').style.display = 'block';
  e.target.reset();
  setTimeout(() => { document.getElementById('form-success').style.display = 'none'; }, 6000);
}

/* SCROLL COUNTER ANIMATION */
function animateCounters() {
  document.querySelectorAll('.stat-num, .trust-stat span').forEach(el => {
    const target = parseInt(el.textContent);
    if (isNaN(target)) return;
    const suffix = el.textContent.replace(/[0-9]/g, '');
    let start = 0; const duration = 1500; const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.round(start) + suffix;
      if (start >= target) clearInterval(timer);
    }, 16);
  });
}
const statsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) { animateCounters(); statsObs.disconnect(); }
}, { threshold: 0.5 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);
