const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const yearTarget = document.querySelector('[data-year]');
if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

// Transition header from transparent-over-hero to sticky-cream on scroll
const pageHero = document.querySelector('.page-hero');
const siteHeader = document.querySelector('.site-header');
if (pageHero && siteHeader) {
  const updateHeader = () => {
    const heroBottom = pageHero.getBoundingClientRect().bottom;
    siteHeader.classList.toggle('scrolled', heroBottom <= 0);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}

// Live countdown to the wedding date
const countdownEl = document.querySelector('[data-countdown]');
if (countdownEl) {
  const target = new Date(countdownEl.dataset.countdown);
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) {
      countdownEl.textContent = 'Today is the day!';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    countdownEl.textContent = `${d} days  ${h} hrs  ${m} mins  ${s} secs`;
  };
  tick();
  setInterval(tick, 1000);
}

// Image carousel
document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const track = carousel.querySelector('[data-carousel-track]');
  const slides = Array.from(track.children);
  const dotsContainer = carousel.querySelector('[data-carousel-dots]');
  let current = 0;

  const dots = slides.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(btn);
    return btn;
  });

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  carousel.querySelector('[data-carousel-prev]').addEventListener('click', () => goTo(current - 1));
  carousel.querySelector('[data-carousel-next]').addEventListener('click', () => goTo(current + 1));

  // Swipe support
  let startX = 0;
  track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
  });
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el) => observer.observe(el));
}
