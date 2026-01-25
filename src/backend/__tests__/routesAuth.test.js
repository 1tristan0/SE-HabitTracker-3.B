// Unit-Tests fuer die Auth-Handler mit gestubbtem supabaseAuth.
const assert = require('assert');

function makeRes() {
  const state = { statusCode: null, jsonPayload: null };
  return {
    state,
    res: {
      status(code) {
        state.statusCode = code;
        return this;
      },
      json(payload) {
        state.jsonPayload = payload;
        return payload;
      },
    },
  };
}

function stubAuth(authMock) {
  const authModulePath = require.resolve('../src/supabaseAuth');
  require.cache[authModulePath] = {
    id: authModulePath,
    filename: authModulePath,
    loaded: true,
    exports: authMock,
  };
}

function loadAuthRouter(authMock) {
  stubAuth(authMock);
  const authPath = require.resolve('../src/routes/auth');
  delete require.cache[authPath];
  return require('../src/routes/auth');
}

function getRouteHandler(router, method, path) {
  const layer = router.stack.find(
    (entry) => entry.route && entry.route.path === path && entry.route.methods[method]
  );
  assert.ok(layer, `route ${method.toUpperCase()} ${path} not found`);
  return layer.route.stack[0].handle;
}

async function run() {
  // POST /login: fehlende Zugangsdaten sollen 400 liefern.
  {
    const router = loadAuthRouter({});
    const handler = getRouteHandler(router, 'post', '/login');

    const req = { body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'email and password are required' });
  }

  // POST /login: Erfolg soll Session-Tokens ins Response-Payload abbilden.
  {
    const router = loadAuthRouter({
      loginWithPassword: async () => ({
        access_token: 'access',
        refresh_token: 'refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: { id: 'user-1' },
      }),
    });
    const handler = getRouteHandler(router, 'post', '/login');

    const req = { body: { email: 'a@b.c', password: 'pw' } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, null);
    assert.deepStrictEqual(state.jsonPayload, {
      accessToken: 'access',
      refreshToken: 'refresh',
      expiresIn: 3600,
      tokenType: 'bearer',
      user: { id: 'user-1' },
    });
  }

  // POST /login: ungueltige Zugangsdaten sollen 401 liefern.
  {
    const router = loadAuthRouter({
      loginWithPassword: async () => {
        const err = new Error('invalid');
        err.status = 400;
        throw err;
      },
    });
    const handler = getRouteHandler(router, 'post', '/login');

    const req = { body: { email: 'a@b.c', password: 'pw' } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 401);
    assert.strictEqual(state.jsonPayload.error, 'Login failed');
  }

  // POST /register: fehlende Zugangsdaten sollen 400 liefern.
  {
    const router = loadAuthRouter({});
    const handler = getRouteHandler(router, 'post', '/register');

    const req = { body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'email and password are required' });
  }

  // POST /session: fehlender accessToken soll 400 liefern.
  {
    const router = loadAuthRouter({});
    const handler = getRouteHandler(router, 'post', '/session');

    const req = { body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'accessToken is required' });
  }

  // POST /logout: fehlender accessToken soll 400 liefern.
  {
    const router = loadAuthRouter({});
    const handler = getRouteHandler(router, 'post', '/logout');

    const req = { body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'accessToken is required' });
  }

  console.log('auth route unit tests passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
