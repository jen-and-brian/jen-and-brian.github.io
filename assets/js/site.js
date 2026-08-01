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
