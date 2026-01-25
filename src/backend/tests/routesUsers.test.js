// Unit-Tests fuer Users-Handler (Input-Validation) mit gestubbtem Prisma.
const assert = require('assert');

function makeRes() {
  const state = { statusCode: null, jsonPayload: null, sent: false };
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
      send() {
        state.sent = true;
        return this;
      },
    },
  };
}

function stubPrisma(prismaMock) {
  const prismaModulePath = require.resolve('../src/prisma');
  require.cache[prismaModulePath] = {
    id: prismaModulePath,
    filename: prismaModulePath,
    loaded: true,
    exports: prismaMock,
  };
}

function loadUsersRouter(prismaMock) {
  stubPrisma(prismaMock);
  const usersPath = require.resolve('../src/routes/users');
  delete require.cache[usersPath];
  return require('../src/routes/users');
}

function getRouteHandler(router, method, path) {
  const layer = router.stack.find(
    (entry) => entry.route && entry.route.path === path && entry.route.methods[method]
  );
  assert.ok(layer, `route ${method.toUpperCase()} ${path} not found`);
  return layer.route.stack[0].handle;
}

async function run() {
  // PUT /animal: missing body should return 400 before DB calls.
  {
    const router = loadUsersRouter({});
    const handler = getRouteHandler(router, 'put', '/animal');

    const req = { auth: { user: { id: 'user-1' } }, body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'animal_type or animal_mood is required' });
  }

  // GET /animal: user not found should return 404.
  {
    const router = loadUsersRouter({
      users: { findUnique: async () => null },
    });
    const handler = getRouteHandler(router, 'get', '/animal');

    const req = { auth: { user: { id: 'missing-user' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 404);
    assert.deepStrictEqual(state.jsonPayload, { error: 'User not found' });
  }

  console.log('users route unit tests passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
