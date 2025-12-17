const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('[auth] SUPABASE_URL oder SUPABASE_ANON_KEY fehlt – Auth-Endpoints werden fehlschlagen.');
}

async function supabaseRequest(path, { method = 'GET', headers = {}, body } = {}) {
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
      ...headers,
    },
    body,
  });

  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = payload?.error_description || payload?.message || response.statusText;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

async function loginWithPassword(email, password) {
  return supabaseRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

async function registerUser(email, password) {
  return supabaseRequest('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

async function fetchUser(accessToken) {
  return supabaseRequest('/auth/v1/user', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

async function signOut(accessToken) {
  return supabaseRequest('/auth/v1/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

module.exports = {
  loginWithPassword,
  registerUser,
  fetchUser,
  signOut,
};
