function initWebsiteNavigation() {
  const toggle = document.querySelector('.site-menu-toggle');
  const nav = document.querySelector('.site-nav');
  const actions = document.querySelector('.site-actions');
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

window.addEventListener('DOMContentLoaded', () => {
  initWebsiteNavigation();
  initWebsiteForms();
  initPortalRoleLinks();
});
