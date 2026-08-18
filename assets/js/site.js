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

document.querySelectorAll('a[href]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      link.origin !== window.location.origin ||
      link.pathname === window.location.pathname
    ) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    event.preventDefault();
    document.body.classList.add('page-is-leaving');
    window.setTimeout(() => { window.location.href = link.href; }, 180);
  });
});

const yearTarget = document.querySelector('[data-year]');
if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

const visitorCountTarget = document.querySelector('[data-visitor-count]');
if (visitorCountTarget) {
  const counterBaseUrl = 'https://api.counterapi.dev/v2/jen-and-brian-github-io/site-total';
  const sessionSeenKey = 'visitor-counted-this-session-counterapi-site-total';
  const localTotalKey = 'visitor-count-counterapi-site-total';

  const showVisitorText = (value) => {
    visitorCountTarget.textContent = `Hello, visitor #${value.toLocaleString()}!`;
    visitorCountTarget.classList.add('is-visible');
  };

  const hideVisitorText = () => {
    visitorCountTarget.textContent = '';
    visitorCountTarget.classList.remove('is-visible');
  };

  const parseCount = (data) => {
    const count = typeof data?.value === 'number'
      ? data.value
      : typeof data?.data === 'number'
        ? data.data
        : typeof data?.count === 'number'
          ? data.count
          : typeof data?.data?.up_count === 'number'
            ? data.data.up_count
            : null;

    if (typeof count !== 'number') {
      throw new Error('Invalid visitor count response');
    }
    return count;
  };

  const getRemoteCount = () => fetch(counterBaseUrl)
    .then((response) => response.json())
    .then(parseCount);

  const hitRemoteCount = () => fetch(`${counterBaseUrl}/up`)
    .then((response) => response.json())
    .then(parseCount);

  let hasCountedThisSession = false;
  try {
    hasCountedThisSession = window.sessionStorage.getItem(sessionSeenKey) === '1';
  } catch {
    hasCountedThisSession = false;
  }

  const fetchCount = hasCountedThisSession ? getRemoteCount : hitRemoteCount;

  fetchCount()
    .then((value) => {
      showVisitorText(value);
      window.localStorage.setItem(localTotalKey, String(value));
      try {
        window.sessionStorage.setItem(sessionSeenKey, '1');
      } catch {
        // Ignore storage write failures.
      }
    })
    .catch(() => {
      hideVisitorText();
    });
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
