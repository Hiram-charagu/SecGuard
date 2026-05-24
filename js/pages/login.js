function initLoginPage() {
  const form = document.querySelector('.login-form');
  if (!form) return;

  let selectedRole = window.SecguardAuth?.getRole() || 'company_admin';
  const roleSelect = document.querySelector('[data-role-select]');
  const params = new URLSearchParams(window.location.search);
  selectedRole = params.get('role') || selectedRole;

  function setRole(role) {
    selectedRole = window.SecguardAuth?.setRole(role) || role || 'company_admin';
    if (roleSelect) roleSelect.value = selectedRole;
  }

  function enterRole(role, demo = false) {
    setRole(role);
    if (demo) {
      try {
        localStorage.setItem('secguard_demo_session', 'true');
      } catch (error) {
        console.warn('Could not persist demo session flag.', error);
      }
    }
    window.location.href = window.SecguardAuth?.routeForRole(selectedRole) || 'dashboard.html';
  }

  setRole(selectedRole);
  roleSelect?.addEventListener('change', () => setRole(roleSelect.value));

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    if (!email || !password) {
      alert('Please provide email and password.');
      return;
    }

    if (!window.SecguardSupabase) {
      enterRole(selectedRole, true);
      return;
    }

    const { error, local } = await window.SecguardSupabase.login(email, password, selectedRole);
    if (error && !local) {
      alert(error.message || 'Login failed. Use demo access for local testing.');
      return;
    }
    enterRole(selectedRole, local);
  });

  document.querySelector('[data-demo-login]')?.addEventListener('click', () => enterRole(selectedRole, true));

  document.querySelector('[data-signup]')?.addEventListener('click', async () => {
    const email = form.querySelector('input[type="email"]').value;
    const password = form.querySelector('input[type="password"]').value;
    if (!email || !password) {
      alert('Enter email and password before creating a user.');
      return;
    }
    const { error } = await window.SecguardSupabase.signup(email, password, selectedRole);
    alert(error ? (error.message || 'Signup failed.') : 'Workspace user request sent.');
  });

  document.querySelector('[data-password-reset]')?.addEventListener('click', async () => {
    const email = form.querySelector('input[type="email"]').value;
    if (!email) {
      alert('Enter your email first.');
      return;
    }
    const { error } = await window.SecguardSupabase.resetPassword(email);
    alert(error ? (error.message || 'Reset request failed.') : 'Password reset email sent.');
  });

  document.querySelector('[data-google-login]')?.addEventListener('click', () => {
    window.SecguardSupabase.googleLogin(selectedRole);
  });
}

window.addEventListener('DOMContentLoaded', initLoginPage);
