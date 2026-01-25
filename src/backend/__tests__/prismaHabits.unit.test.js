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

function isDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

async function run() {
  // GET /: Erfolgsfall setzt Streaks bei Bedarf zurueck und mappt DB-Typen ins API-Payload.
  {
    const habitsData = [
      {
        id: 5n,
        habit_name: 'laufen',
        description: 'taeglich',
        start_date: new Date('2026-01-10T00:00:00Z'),
        streak: 2n,
        last_checked: new Date('2026-01-20T12:00:00Z'),
        prev_last_checked: [new Date('2026-01-19T12:00:00Z')],
        userId: 'user-1',
      },
    ];

    const prismaMock = {
      habits_table: {
        updateMany: makeSpy(async () => ({ count: 1 })),
        findMany: makeSpy(async () => habitsData),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'get', '/');

    const req = { auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    const updateArgs = prismaMock.habits_table.updateMany.calls[0][0];
    assert.strictEqual(updateArgs.where.userId, 'user-1');
    assert.ok(Array.isArray(updateArgs.where.OR));
    assert.strictEqual(updateArgs.data.streak, BigInt(0));
    assert.ok(isDate(updateArgs.data.last_break));

    const findArgs = prismaMock.habits_table.findMany.calls[0][0];
    assert.deepStrictEqual(findArgs, {
      where: { userId: 'user-1' },
      orderBy: { start_date: 'desc' },
    });

    assert.deepStrictEqual(state.jsonPayload, [
      {
        id: '5',
        habit_name: 'laufen',
        description: 'taeglich',
        start_date: '2026-01-10',
        streak: 2,
        last_checked: '2026-01-20T12:00:00.000Z',
        prev_last_checked: ['2026-01-19T12:00:00.000Z'],
        userId: 'user-1',
      },
    ]);
  }

  // GET /: Prisma-updateMany-Fehler soll 500 mit stabilem Error-Payload liefern.
  {
    const prismaMock = {
      habits_table: {
        updateMany: makeSpy(async () => {
          throw new Error('update failed');
        }),
        findMany: makeSpy(async () => []),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'get', '/');

    const req = { auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 500);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Failed to fetch habits' });
  }

  // POST /: fehlender Name soll 400 liefern, bevor Prisma create aufgerufen wird.
  {
    const prismaMock = {
      habits_table: {
        create: makeSpy(async () => ({
          id: '1',
          habit_name: 'lesen',
          description: '',
          start_date: new Date('2026-01-10T00:00:00Z'),
          streak: 0n,
          last_checked: null,
          prev_last_checked: [],
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'post', '/');

    const req = { auth: { user: { id: 'user-1' } }, body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'name is required' });
  }

  // POST /: Erfolgsfall erstellt Defaults (start_date, streak) und liefert gemapptes Payload.
  {
    const prismaMock = {
      habits_table: {
        create: makeSpy(async () => ({
          id: '1',
          habit_name: 'lesen',
          description: '',
          start_date: new Date('2026-01-10T00:00:00Z'),
          streak: 0n,
          last_checked: null,
          prev_last_checked: [],
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'post', '/');

    const req = { auth: { user: { id: 'user-1' } }, body: { name: 'lesen' } };
    const { res, state } = makeRes();
    await handler(req, res);

    const createArgs = prismaMock.habits_table.create.calls[0][0];
    assert.strictEqual(createArgs.data.habit_name, 'lesen');
    assert.strictEqual(createArgs.data.description, '');
    assert.ok(isDate(createArgs.data.start_date));
    assert.strictEqual(createArgs.data.streak, BigInt(0));
    assert.deepStrictEqual(createArgs.data.user.connectOrCreate, {
      where: { id: 'user-1' },
      create: { id: 'user-1' },
    });

    assert.strictEqual(state.statusCode, 201);
    assert.deepStrictEqual(state.jsonPayload, {
      id: '1',
      habit_name: 'lesen',
      description: '',
      start_date: '2026-01-10',
      streak: 0,
      last_checked: null,
      prev_last_checked: [],
      userId: 'user-1',
    });
  }

  // PUT /: fehlende id soll 400 liefern (ungueltige habit id).
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => ({ id: '1' })),
        update: makeSpy(async () => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: 1n,
          last_checked: null,
          prev_last_checked: [],
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/:id');

    const req = { params: {}, auth: { user: { id: 'user-1' } }, body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Invalid habit id' });
  }

  // PUT /: fehlende Update-Felder sollen 400 liefern (erfordert name/desc/start_date).
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => ({ id: '1' })),
        update: makeSpy(async () => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: 1n,
          last_checked: null,
          prev_last_checked: [],
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/:id');

    const req = { params: { id: '1' }, auth: { user: { id: 'user-1' } }, body: {} };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'name, desc or start_date is required' });
  }

  // PUT /: ungueltiges start_date-Format soll 400 liefern.
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => ({ id: '1' })),
        update: makeSpy(async () => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: 1n,
          last_checked: null,
          prev_last_checked: [],
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/:id');

    const req = {
      params: { id: '1' },
      auth: { user: { id: 'user-1' } },
      body: { start_date: 'not-a-date' },
    };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Invalid start_date' });
  }

  // PUT /: nicht vorhandene Habit soll 404 liefern.
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => null),
        update: makeSpy(async () => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: 1n,
          last_checked: null,
          prev_last_checked: [],
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/:id');

    const req = {
      params: { id: '1' },
      auth: { user: { id: 'user-1' } },
      body: { name: 'neu' },
    };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 404);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Habit not found' });
  }

  // PUT /: Erfolgsfall aktualisiert Felder und mappt Response-Payload.
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => ({ id: '1' })),
        update: makeSpy(async () => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: 1n,
          last_checked: null,
          prev_last_checked: [],
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'put', '/:id');

    const req = {
      params: { id: '1' },
      auth: { user: { id: 'user-1' } },
      body: { name: 'neu', start_date: '2026-01-12' },
    };
    const { res, state } = makeRes();
    await handler(req, res);

    const updateArgs = prismaMock.habits_table.update.calls[0][0];
    assert.deepStrictEqual(updateArgs.where, { id: '1' });
    assert.strictEqual(updateArgs.data.habit_name, 'neu');
    assert.ok(isDate(updateArgs.data.start_date));
    assert.strictEqual(updateArgs.data.description, undefined);

    assert.deepStrictEqual(state.jsonPayload, {
      id: '1',
      habit_name: 'neu',
      description: 'desc',
      start_date: '2026-01-12',
      streak: 1,
      last_checked: null,
      prev_last_checked: [],
      userId: 'user-1',
    });
  }

  // DELETE /: fehlende id soll 400 liefern.
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => ({ id: '1' })),
        delete: makeSpy(async () => ({ id: '1' })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'delete', '/:id');

    const req = { params: {}, auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Invalid habit id' });
  }

  // DELETE /: nicht vorhandene Habit soll 404 liefern.
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => null),
        delete: makeSpy(async () => ({ id: '1' })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'delete', '/:id');

    const req = { params: { id: '1' }, auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 404);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Habit not found' });
  }

  // DELETE /: Erfolg soll 204 liefern und prisma delete mit id aufrufen.
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => ({ id: '1' })),
        delete: makeSpy(async () => ({ id: '1' })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'delete', '/:id');

    const req = { params: { id: '1' }, auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 204);
    assert.strictEqual(state.sent, true);
    assert.deepStrictEqual(prismaMock.habits_table.delete.calls[0][0], { where: { id: '1' } });
  }

  // POST /:id/toggle: fehlende id soll 400 liefern.
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => ({ id: '1' })),
        update: makeSpy(async () => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: 2n,
          last_checked: new Date('2026-01-21T12:00:00Z'),
          prev_last_checked: [],
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'post', '/:id/toggle');

    const req = { params: {}, auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 400);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Invalid habit id' });
  }

  // POST /:id/toggle: nicht vorhandene Habit soll 404 liefern.
  {
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => null),
        update: makeSpy(async () => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: 2n,
          last_checked: new Date('2026-01-21T12:00:00Z'),
          prev_last_checked: [],
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'post', '/:id/toggle');

    const req = { params: { id: '1' }, auth: { user: { id: 'user-1' } } };
    const { res, state } = makeRes();
    await handler(req, res);

    assert.strictEqual(state.statusCode, 404);
    assert.deepStrictEqual(state.jsonPayload, { error: 'Habit not found' });
  }

  // POST /:id/toggle: wenn last_checked gestern war, inkrementiert streak und prev_last_checked waechst.
  {
    // Zeit einfrieren, um Flakiness um Mitternacht zu vermeiden.
    const realNow = Date.now;
    const fixedNow = new Date('2026-01-25T12:00:00Z');
    Date.now = () => fixedNow.getTime();

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const prevDate = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: 2n,
          last_checked: yesterday,
          prev_last_checked: [prevDate],
          userId: 'user-1',
        })),
        update: makeSpy(async (args) => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: args.data.streak,
          last_checked: args.data.last_checked,
          prev_last_checked: args.data.prev_last_checked,
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'post', '/:id/toggle');

    const req = { params: { id: '1' }, auth: { user: { id: 'user-1' } } };
    const { res } = makeRes();
    await handler(req, res);

    const updateArgs = prismaMock.habits_table.update.calls[0][0];
    assert.strictEqual(updateArgs.where.id, '1');
    assert.strictEqual(updateArgs.data.streak, BigInt(3));
    assert.ok(isDate(updateArgs.data.last_checked));
    assert.strictEqual(updateArgs.data.prev_last_checked.length, 2);

    Date.now = realNow;
  }

  // POST /:id/toggle: wenn last_checked heute war, setzt streak zurueck und prev_last_checked leert.
  {
    // Zeit einfrieren, um Flakiness um Mitternacht zu vermeiden.
    const realNow = Date.now;
    const fixedNow = new Date('2026-01-25T12:00:00Z');
    Date.now = () => fixedNow.getTime();

    const today = new Date();
    const prevDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const prismaMock = {
      habits_table: {
        findFirst: makeSpy(async () => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: 2n,
          last_checked: today,
          prev_last_checked: [prevDate],
          userId: 'user-1',
        })),
        update: makeSpy(async (args) => ({
          id: '1',
          habit_name: 'neu',
          description: 'desc',
          start_date: new Date('2026-01-12T00:00:00Z'),
          streak: args.data.streak,
          last_checked: args.data.last_checked,
          prev_last_checked: args.data.prev_last_checked,
          userId: 'user-1',
        })),
      },
    };
    const router = loadHabitsRouter(prismaMock);
    const handler = getRouteHandler(router, 'post', '/:id/toggle');

    const req = { params: { id: '1' }, auth: { user: { id: 'user-1' } } };
    const { res } = makeRes();
    await handler(req, res);

    const updateArgs = prismaMock.habits_table.update.calls[0][0];
    assert.strictEqual(updateArgs.where.id, '1');
    assert.strictEqual(updateArgs.data.streak, BigInt(1));
    assert.deepStrictEqual(updateArgs.data.prev_last_checked, []);
    assert.ok(updateArgs.data.last_checked instanceof Date || updateArgs.data.last_checked === null);

    Date.now = realNow;
  }

  console.log('prisma habits unit tests passed');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
