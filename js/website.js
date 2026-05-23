function initWebsiteNavigation() {
  const toggle = document.querySelector('.site-menu-toggle');
  const nav = document.querySelector('.site-nav');
  const actions = document.querySelector('.site-actions');
  const header = document.querySelector('.site-header');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.site-nav a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  if (!toggle || !nav || !actions) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    actions.classList.toggle('open');
  });

  const syncHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 60);
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
}

function initWebsiteForms() {
  document.querySelectorAll('.site-form').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const button = form.querySelector('button[type="submit"]');
      const previousLabel = button.textContent;
      button.textContent = 'Request captured';
      form.reset();
      setTimeout(() => {
        button.textContent = previousLabel;
      }, 1800);
    });
  });
}

function initPortalRoleLinks() {
  document.querySelectorAll('a[href^="login.html?role="]').forEach(link => {
    link.addEventListener('click', () => {
      const url = new URL(link.href, window.location.href);
      const role = url.searchParams.get('role');
      if (role) {
        try {
          localStorage.setItem('secguard_active_role', role);
        } catch (error) {
          console.warn('Could not persist selected portal role.', error);
        }
      }
    });
  });
}

function initRevealMotion() {
  const revealItems = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-count]');
  const animatedCounters = new WeakSet();

  function animateCounter(node) {
    if (animatedCounters.has(node)) return;
    animatedCounters.add(node);
    const target = Number(node.dataset.count || 0);
    const suffix = node.dataset.suffix || (node.textContent.includes('%') ? '%' : '');
    const duration = 1500;
    const start = performance.now();
    const format = value => target >= 1000 ? Math.round(value).toLocaleString() : Math.round(value).toString();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      node.textContent = `${format(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
      if (entry.target.matches('[data-count]')) animateCounter(entry.target);
    });
  }, { threshold: 0.22 });

  revealItems.forEach(item => observer.observe(item));
  counters.forEach(counter => observer.observe(counter));
}

function initTypingHeadline() {
  const headline = document.querySelector('[data-typing]');
  if (!headline) return;
  const text = headline.dataset.typing || headline.textContent;
  headline.textContent = '';
  let index = 0;
  const interval = setInterval(() => {
    headline.textContent = text.slice(0, index + 1);
    index += 1;
    if (index >= text.length) clearInterval(interval);
  }, 42);
}

function initThreatCycle() {
  const title = document.querySelector('[data-cycle-alert]');
  const meta = document.querySelector('[data-cycle-meta]');
  const feed = document.querySelector('[data-threat-feed]');
  if (!title || !meta) return;

  const events = [
    ['SIM swap detected', 'Branch Delta - 2s ago'],
    ['Unsold device activated', 'Nairobi CBD - 8s ago'],
    ['Duplicate IMEI found', 'Warehouse Sync - 14s ago'],
    ['Recovery ping received', 'Customer case RC-1042'],
  ];
  let index = 0;

  setInterval(() => {
    index = (index + 1) % events.length;
    title.textContent = events[index][0];
    meta.textContent = events[index][1];
    if (feed) {
      const first = feed.firstElementChild;
      if (first) {
        first.innerHTML = `<strong>LIVE</strong><span>${events[index][0]} - ${events[index][1]}</span>`;
        feed.appendChild(first);
      }
    }
  }, 2800);
}

window.addEventListener('DOMContentLoaded', () => {
  initWebsiteNavigation();
  initWebsiteForms();
  initPortalRoleLinks();
  initRevealMotion();
  initTypingHeadline();
  initThreatCycle();
});
