const assert = require('assert');

function makeSpy(impl) {
  const spy = (...args) => {
    spy.calls.push(args);
    return impl ? impl(...args) : undefined;
  };
  spy.calls = [];
  return spy;
}

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
  // GET /animal: Erfolgsfall liefert Tier-Felder.
  {
    const prismaMock = {
      users: {
        findUnique: makeSpy(async () => ({ animal_type: 'hund', animal_mood: 'gluecklich' })),
      },
    };
    const router = loadUsersRouter(prismaMock);
    const handler = getRouteHandler(router, 'get', '/animal');

    const req = { auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.deepStrictEqual(prismaMock.users.findUnique.calls[0][0], {
      where: { id: 'user-1' },
      select: { animal_type: true, animal_mood: true },
    });
    assert.deepStrictEqual(state.jsonPayload, {
      animal_type: 'hund',
      animal_mood: 'gluecklich',
    });
    assert.strictEqual(state.statusCode, null);
  }

  // GET /animal: fehlender Benutzer soll 404 liefern.
  {
    const prismaMock = {
      users: {
        findUnique: makeSpy(async () => null),
      },
    };
    const router = loadUsersRouter(prismaMock);
    const handler = getRouteHandler(router, 'get', '/animal');

    const req = { auth: { user: { id: 'missing-user' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 404);
    assert.deepStrictEqual(state.jsonPayload, { error: 'User not found' });
  }

  // GET /animal: Prisma-Fehler soll 500 liefern.
  {
    const prismaMock = {
      users: {
        findUnique: makeSpy(async () => {
          throw new Error('db down');
        }),
      },
    };
    const router = loadUsersRouter(prismaMock);
    const handler = getRouteHandler(router, 'get', '/animal');

    const req = { auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 500);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Failed to fetch user animal data' });
  }

  // PUT /animal: fehlendes Payload soll 400 liefern, bevor DB-Aufrufe passieren.
  {
    const prismaMock = {
      users: {
        findUnique: makeSpy(async () => ({ id: 'user-1' })),
        update: makeSpy(async () => ({ animal_type: 'katze', animal_mood: 'traurig' })),
      },
    };
    const router = loadUsersRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/animal');

    const req = { auth: { user: { id: 'user-1' } }, body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'animal_type or animal_mood is required' });
    assert.strictEqual(prismaMock.users.findUnique.calls.length, 0);
  }

  // PUT /animal: ungueltiger animal_type soll 400 liefern.
  {
    const prismaMock = {
      users: {
        findUnique: makeSpy(async () => ({ id: 'user-1' })),
        update: makeSpy(async () => ({ animal_type: 'katze', animal_mood: 'traurig' })),
      },
    };
    const router = loadUsersRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/animal');

    const req = { auth: { user: { id: 'user-1' } }, body: { animal_type: 'dragon' } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Invalid animal_type' });
    assert.strictEqual(prismaMock.users.findUnique.calls.length, 0);
  }

  // PUT /animal: ungueltiger animal_mood soll 400 liefern.
  {
    const prismaMock = {
      users: {
        findUnique: makeSpy(async () => ({ id: 'user-1' })),
        update: makeSpy(async () => ({ animal_type: 'katze', animal_mood: 'traurig' })),
      },
    };
    const router = loadUsersRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/animal');

    const req = { auth: { user: { id: 'user-1' } }, body: { animal_mood: 'angry' } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Invalid animal_mood' });
    assert.strictEqual(prismaMock.users.findUnique.calls.length, 0);
  }

  // PUT /animal: Benutzer nicht gefunden soll 404 liefern und kein Update ausfuehren.
  {
    const prismaMock = {
      users: {
        findUnique: makeSpy(async () => null),
        update: makeSpy(async () => ({ animal_type: 'katze', animal_mood: 'traurig' })),
      },
    };
    const router = loadUsersRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/animal');

    const req = { auth: { user: { id: 'missing-user' } }, body: { animal_type: 'katze' } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 404);
    assert.deepStrictEqual(state.jsonPayload, { error: 'User not found' });
    assert.strictEqual(prismaMock.users.update.calls.length, 0);
  }

  // PUT /animal: Erfolgsfall aktualisiert und liefert neue Tierdaten.
  {
    const prismaMock = {
      users: {
        findUnique: makeSpy(async () => ({ id: 'user-1' })),
        update: makeSpy(async () => ({ animal_type: 'katze', animal_mood: 'gluecklich' })),
      },
    };
    const router = loadUsersRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/animal');

    const req = { auth: { user: { id: 'user-1' } }, body: { animal_type: 'katze' } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.deepStrictEqual(prismaMock.users.update.calls[0][0], {
      where: { id: 'user-1' },
      data: { animal_type: 'katze' },
      select: { animal_type: true, animal_mood: true },
    });
    assert.deepStrictEqual(state.jsonPayload, {
      animal_type: 'katze',
      animal_mood: 'gluecklich',
    });
  }

  // PUT /animal: Prisma-Fehler soll 500 liefern.
  {
    const prismaMock = {
      users: {
        findUnique: makeSpy(async () => ({ id: 'user-1' })),
        update: makeSpy(async () => {
          throw new Error('update failed');
        }),
      },
    };
    const router = loadUsersRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/animal');

    const req = { auth: { user: { id: 'user-1' } }, body: { animal_mood: 'gluecklich' } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 500);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Failed to update user animal data' });
  }

  console.log('prisma users unit tests passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
