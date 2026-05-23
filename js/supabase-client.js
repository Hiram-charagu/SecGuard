const SecguardSupabase = (() => {
  const config = window.SECGUARD_SUPABASE || {};
  const hasClient = Boolean(window.supabase && config.url && config.anonKey);
  const client = hasClient ? window.supabase.createClient(config.url, config.anonKey) : null;

  function enabled() {
    return Boolean(config.enabled && client);
  }

  function routeForRole(role) {
    return window.SecguardAuth?.routeForRole(role) || 'dashboard.html';
  }

  async function login(email, password, role) {
    if (!client) return { data: null, error: null, local: true };
    const result = await client.auth.signInWithPassword({ email, password });
    if (!result.error && result.data?.user) {
      window.SecguardAuth?.setRole(result.data.user.user_metadata?.role || role || 'company_admin');
    }
    return result;
  }

  async function signup(email, password, role) {
    window.SecguardAuth?.setRole(role || 'company_admin');
    if (!client) return { data: null, error: null, local: true };
    return client.auth.signUp({
      email,
      password,
      options: { data: { role: role || 'company_admin' } },
    });
  }

  async function googleLogin(role) {
    if (!client) return { error: new Error('Supabase client is not available') };
    return client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/${routeForRole(role)}`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
  }

  async function getSession() {
    if (!client) return { data: { session: null }, error: null };
    return client.auth.getSession();
  }

  async function getUser() {
    if (!client) return { data: { user: null }, error: null };
    return client.auth.getUser();
  }

  async function logout() {
    window.SecguardAuth?.clearSessionState();
    if (client) await client.auth.signOut();
    window.location.href = 'login.html';
  }

  async function resetPassword(email) {
    if (!client) return { error: new Error('Supabase client is not available') };
    return client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login.html`,
    });
  }

  async function uploadFile(bucket, path, file) {
    if (!client) return { data: null, error: new Error('Supabase client is not available') };
    return client.storage.from(bucket).upload(path, file, { upsert: true });
  }

  function subscribe(table, callback) {
    if (!client) return null;
    return client
      .channel(`${table}-channel`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  }

  window.secguardSupabase = client;

  return { client, enabled, login, signup, googleLogin, getSession, getUser, logout, resetPassword, uploadFile, subscribe, routeForRole };
})();

