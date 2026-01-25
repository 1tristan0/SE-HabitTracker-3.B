// Backend Smoke-Tests: pruefen Router-Wiring und Auth-Middleware,
// ohne echte DB/Prisma-Abhaengigkeiten zu laden.
const assert = require('assert');

// Express routers are functions with a "stack" of registered middleware/routes.
function isExpressRouter(router) {
  return typeof router === 'function' && Array.isArray(router.stack);
}

// Minimal response stub used to capture status/json calls from middleware.
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

async function run() {
  // Prevent Prisma from initializing the native query engine during unit tests.
  const prismaModulePath = require.resolve('../src/prisma');
  require.cache[prismaModulePath] = {
    id: prismaModulePath,
    filename: prismaModulePath,
    loaded: true,
    exports: {},
  };

  // Load routers after Prisma is stubbed so they don't import Prisma directly.
  const authRouter = require('../src/routes/auth');
  const habitsRouter = require('../src/routes/habits');
  const usersRouter = require('../src/routes/users');
  const { authenticate } = require('../src/middleware/authenticate');

  // Basic router shape checks ensure Express wiring stays intact.
  assert.ok(isExpressRouter(authRouter), 'auth router should be an express router');
  assert.ok(isExpressRouter(habitsRouter), 'habits router should be an express router');
  assert.ok(isExpressRouter(usersRouter), 'users router should be an express router');

  // Habits routes must require authentication by default.
  const hasAuthMiddleware = habitsRouter.stack.some(
    (layer) => layer?.handle?.name === 'authenticate'
  );
  assert.ok(hasAuthMiddleware, 'habits router should use authenticate middleware');

  // Missing token should short-circuit with a 401 and not call next().
  const missingTokenReq = { headers: {} };
  const missingToken = makeRes();
  let missingTokenNext = false;

  await authenticate(missingTokenReq, missingToken.res, () => {
    missingTokenNext = true;
  });

  assert.strictEqual(missingToken.state.statusCode, 401, 'missing token should return 401');
  assert.strictEqual(missingToken.state.jsonPayload?.error, 'Missing bearer token');
  assert.strictEqual(missingTokenNext, false);

  // Stub fetchUser to simulate an invalid token and validate error handling.
  const authModulePath = require.resolve('../src/supabaseAuth');
  const authenticateModulePath = require.resolve('../src/middleware/authenticate');
  const originalAuthModule = require('../src/supabaseAuth');

  require.cache[authModulePath].exports = {
    ...originalAuthModule,
    fetchUser: async () => {
      const err = new Error('invalid token');
      err.status = 401;
      throw err;
    },
  };
  delete require.cache[authenticateModulePath];
  const { authenticate: authenticateWithStub } = require('../src/middleware/authenticate');

  const invalidTokenReq = { headers: { authorization: 'Bearer badtoken' } };
  const invalidToken = makeRes();
  let invalidTokenNext = false;

  await authenticateWithStub(invalidTokenReq, invalidToken.res, () => {
    invalidTokenNext = true;
  });

  assert.strictEqual(invalidToken.state.statusCode, 401, 'invalid token should return 401');
  assert.strictEqual(invalidToken.state.jsonPayload?.error, 'Authentication failed');
  assert.strictEqual(invalidTokenNext, false);

  // Stub fetchUser to simulate a valid token and ensure req.auth is populated.
  require.cache[authModulePath].exports = {
    ...originalAuthModule,
    fetchUser: async () => ({ id: 'user-1', email: 'user@example.com' }),
  };
  delete require.cache[authenticateModulePath];
  const { authenticate: authenticateSuccess } = require('../src/middleware/authenticate');

  const successReq = { headers: { authorization: 'Bearer goodtoken' } };
  const success = makeRes();
  let successNext = false;

  await authenticateSuccess(successReq, success.res, () => {
    successNext = true;
  });

  assert.strictEqual(success.state.statusCode, null);
  assert.strictEqual(success.state.jsonPayload, null);
  assert.strictEqual(successNext, true);
  assert.strictEqual(successReq.auth?.user?.id, 'user-1');

  console.log('backend smoke tests passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
