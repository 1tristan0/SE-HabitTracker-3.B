const express = require('express');
const prisma = require('../prisma');
const { authenticate } = require('../middleware/authenticate');
const router = express.Router();

function serializeHabit(habit) {
  return {
    id: habit.id?.toString(),
    habit_name: habit.habit_name,
    description: habit.description,
    start_date: habit.start_date ? habit.start_date.toISOString().slice(0, 10) : null,
    streak: habit.streak != null ? Number(habit.streak) : 0,
    last_checked: habit.last_checked ? habit.last_checked.toISOString() : null,
    prev_last_checked: Array.isArray(habit.prev_last_checked)
      ? habit.prev_last_checked.map((d) => (d instanceof Date ? d.toISOString() : d))
      : [],
    userId: habit.userId ?? habit.user_id ?? null,
  };
}

function normalizeDateArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => (entry instanceof Date ? entry : new Date(entry)));
}

router.use(authenticate);

/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: Liste aller Habits des angemeldeten Nutzers
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Erfolgreich
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Habit'
 *       401:
 *         description: Kein oder ungültiges Token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/', async (req, res) => {
  try {
    const userId = req.auth.user.id;
    const habits = await prisma.habits_table.findMany({
      where: { userId },
      orderBy: { start_date: 'desc' },
    });
    res.json(habits.map(serializeHabit));
  } catch (err) {
    console.error('[GET /api/habits] failed', err);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});
/**
 * @swagger
 * /api/habits:
 *   post:
 *     summary: Neues Habit anlegen
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *     responses:
 *       201:
 *         description: Habit angelegt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Name fehlt oder ungültig
 *       401:
 *         description: Kein oder ungültiges Token
 */
router.post('/', async (req, res) => {
  const { name, desc } = req.body || {};

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const userId = req.auth.user.id;
    const created = await prisma.habits_table.create({
      data: {
        habit_name: name,
        description: desc || '',
        start_date: new Date(),
        streak: BigInt(0),
        last_checked: null,
        prev_last_checked: [],
        user: {
          connectOrCreate: {
            where: { id: userId },
            create: { id: userId },
          },
        },
      },
    });

    res.status(201).json(serializeHabit(created));
  } catch (err) {
    console.error('[POST /api/habits] failed', err);
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

/**
 * @swagger
 * /api/habits/{id}:
 *   put:
 *     summary: Habit bearbeiten
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID des Habits
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               desc:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Habit aktualisiert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Ungültige Eingaben
 *       404:
 *         description: Habit nicht gefunden
 *       401:
 *         description: Kein oder ungültiges Token
 */
router.put('/:id', async (req, res) => {
  const idParam = req.params.id;
  if (!idParam) {
    return res.status(400).json({ error: 'Invalid habit id' });
  }

  const { name, desc, start_date } = req.body || {};
  if (name == null && desc == null && start_date == null) {
    return res.status(400).json({ error: 'name, desc or start_date is required' });
  }

  let parsedStartDate;
  if (start_date != null) {
    parsedStartDate = new Date(start_date);
    if (Number.isNaN(parsedStartDate.getTime())) {
      return res.status(400).json({ error: 'Invalid start_date' });
    }
  }

  try {
    const userId = req.auth.user.id;
    const existing = await prisma.habits_table.findFirst({
      where: { id: idParam, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const updated = await prisma.habits_table.update({
      where: { id: idParam },
      data: {
        ...(name != null ? { habit_name: name } : {}),
        ...(desc != null ? { description: desc } : {}),
        ...(start_date != null ? { start_date: parsedStartDate } : {}),
      },
    });

    return res.json(serializeHabit(updated));
  } catch (err) {
    console.error('[PUT /api/habits/:id] failed', err);
    return res.status(500).json({ error: 'Failed to update habit' });
  }
});

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Habit löschen
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID des Habits
 *     responses:
 *       204:
 *         description: Erfolgreich gelöscht
 *       400:
 *         description: Ungültige ID
 *       404:
 *         description: Habit nicht gefunden
 *       401:
 *         description: Kein oder ungültiges Token
 */
router.delete('/:id', async (req, res) => {
  const idParam = req.params.id;
  if (!idParam) {
    return res.status(400).json({ error: 'Invalid habit id' });
  }

  try {
    const userId = req.auth.user.id;
    const existing = await prisma.habits_table.findFirst({
      where: { id: idParam, userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await prisma.habits_table.delete({ where: { id: idParam } });
    res.status(204).send();
  } catch (err) {
    console.error('[DELETE /api/habits/:id] failed', err);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
});
/**
 * @swagger
 * /api/habits/{id}/toggle:
 *   post:
 *     summary: Habit für heute erledigt / rückgängig schalten
 *     tags: [Habits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID des Habits
 *     responses:
 *       200:
 *         description: Aktualisiertes Habit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Ungültige ID
 *       404:
 *         description: Habit nicht gefunden
 *       401:
 *         description: Kein oder ungültiges Token
 */
router.post('/:id/toggle', async (req, res) => {
  const idParam = req.params.id;
  if (!idParam) {
    return res.status(400).json({ error: 'Invalid habit id' });
  }

  try {
    const userId = req.auth.user.id;
    const habit = await prisma.habits_table.findFirst({
      where: { id: idParam, userId },
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const currentStreak = Number(habit.streak || 0);
    const prevArray = normalizeDateArray(habit.prev_last_checked);
    const lastChecked = habit.last_checked ? new Date(habit.last_checked) : null;

    const toISODate = (d) => d.toISOString().slice(0, 10);
    const todayISO = new Date().toISOString().slice(0, 10);
    const lastIsToday = lastChecked ? toISODate(lastChecked) === todayISO : false;

    let payload;

    if (lastIsToday) {
      const prevLen = prevArray.length;
      const restored = prevLen ? prevArray[prevLen - 1] : null;
      payload = {
        last_checked: restored,
        prev_last_checked: prevLen ? prevArray.slice(0, -1) : [],
        streak: BigInt(Math.max(0, currentStreak - 1)),
      };
    } else {
      const now = new Date();
      payload = {
        prev_last_checked: lastChecked ? [...prevArray, lastChecked] : prevArray,
        last_checked: now,
        streak: BigInt(currentStreak + 1),
      };
    }

    // ensure prev_last_checked stays Date objects
    if (payload.prev_last_checked) {
      payload.prev_last_checked = payload.prev_last_checked.map((d) =>
        d instanceof Date ? d : new Date(d)
      );
    }

    const updated = await prisma.habits_table.update({
      where: { id: idParam },
      data: payload,
    });

    res.json(serializeHabit(updated));
  } catch (err) {
    console.error('[POST /api/habits/:id/toggle] failed', err);
    res.status(500).json({ error: 'Failed to toggle habit' });
  }
});

module.exports = router;