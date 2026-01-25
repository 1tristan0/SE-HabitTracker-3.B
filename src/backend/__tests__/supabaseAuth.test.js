// Diese Tests pruefen die Supabase-Auth-Helper, ohne echte HTTP-Requests.
// Wir stubben fetch und kontrollieren die aufgerufenen URLs/Headers/Bodies.
const assert = require('assert');

// Setzt Dummy-Env, damit das Modul keine Warnung ausgibt.
function setEnv() {
  process.env.SUPABASE_URL = 'http://supabase.local';
  process.env.SUPABASE_ANON_KEY = 'anon-key';
}

// Erzwingt einen frischen Import, damit neue fetch-Stubs greifen.
function loadModule() {
  const modulePath = require.resolve('../src/supabaseAuth');
  delete require.cache[modulePath];
  return require('../src/supabaseAuth');
}

async function run() {
  setEnv();

  // Erfolgsfall: fetch liefert JSON.
  let lastRequest = null;
  global.fetch = async (url, options) => {
    lastRequest = { url, options };
    return {
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true }),
    };
  };

  const { registerUser, loginWithPassword, fetchUser, signOut } = loadModule();

  // Registrierung: richtiger Endpoint, Methode, Header und Body.
  await registerUser('user@example.com', 'testtest');
  assert.strictEqual(lastRequest.url, 'http://supabase.local/auth/v1/signup');
  assert.strictEqual(lastRequest.options.method, 'POST');
  assert.strictEqual(lastRequest.options.headers.apikey, 'anon-key');
  assert.strictEqual(
    lastRequest.options.body,
    JSON.stringify({ email: 'user@example.com', password: 'testtest' })
  );

  // Login: richtiger Endpoint und Body.
  await loginWithPassword('user@example.com', 'testtest');
  assert.strictEqual(
    lastRequest.url,
    'http://supabase.local/auth/v1/token?grant_type=password'
  );
  assert.strictEqual(
    lastRequest.options.body,
    JSON.stringify({ email: 'user@example.com', password: 'testtest' })
  );

  // User-Info: Authorization Header wird gesetzt.
  await fetchUser('token123');
  assert.strictEqual(lastRequest.url, 'http://supabase.local/auth/v1/user');
  assert.strictEqual(lastRequest.options.headers.Authorization, 'Bearer token123');

  // Logout: richtiger Endpoint.
  await signOut('token123');
  assert.strictEqual(lastRequest.url, 'http://supabase.local/auth/v1/logout');

  // Fehlerfall: JSON-Error payload -> Message/Status werden uebernommen.
  global.fetch = async () => ({
    ok: false,
    status: 401,
    statusText: 'Unauthorized',
    headers: { get: () => 'application/json' },
    json: async () => ({ error_description: 'Invalid token' }),
  });

  const { fetchUser: fetchUserError } = loadModule();
  let failed = false;
  try {
    await fetchUserError('badtoken');
  } catch (err) {
    failed = true;
    assert.strictEqual(err.message, 'Invalid token');
    assert.strictEqual(err.status, 401);
  }

  assert.ok(failed, 'fetchUser should throw on error');

  // Fehlerfall: Text-Error payload -> statusText wird verwendet.
  global.fetch = async () => ({
    ok: false,
    status: 500,
    statusText: 'Server error',
    headers: { get: () => 'text/plain' },
    text: async () => 'oops',
  });

  const { signOut: signOutError } = loadModule();
  failed = false;
  try {
    await signOutError('token123');
  } catch (err) {
    failed = true;
    assert.strictEqual(err.message, 'Server error');
    assert.strictEqual(err.status, 500);
  }

  assert.ok(failed, 'signOut should throw on non-json error');
  delete global.fetch;
  console.log('supabaseAuth tests passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
