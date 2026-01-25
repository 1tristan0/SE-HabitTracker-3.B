// Unit-Tests fuer Habits-Handler (Input-Validation) mit gestubbtem Prisma.
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

function loadHabitsRouter(prismaMock) {
  stubPrisma(prismaMock);
  const habitsPath = require.resolve('../src/routes/habits');
  delete require.cache[habitsPath];
  return require('../src/routes/habits');
}

function getRouteHandler(router, method, path) {
  const layer = router.stack.find(
    (entry) => entry.route && entry.route.path === path && entry.route.methods[method]
  );
  assert.ok(layer, `route ${method.toUpperCase()} ${path} not found`);
  return layer.route.stack[0].handle;
}

async function run() {
  // POST /: fehlender Name soll 400 liefern, bevor Prisma aufgerufen wird.
  {
    const router = loadHabitsRouter({});
    const handler = getRouteHandler(router, 'post', '/');

    const req = { auth: { user: { id: 'user-1' } }, body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'name is required' });
  }

  // DELETE /:id mit fehlender id soll 400 liefern.
  {
    const router = loadHabitsRouter({
      habits_table: { delete: async () => ({ id: '1' }) },
    });
    const handler = getRouteHandler(router, 'delete', '/:id');

    const req = { params: {}, auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Invalid habit id' });
  }

  console.log('habits route unit tests passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
