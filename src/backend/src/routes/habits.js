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
    user_id: habit.user_id,
  };
}

function normalizeDateArray(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => (entry instanceof Date ? entry : new Date(entry)));
}

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const userId = req.auth.user.id;
    const habits = await prisma.habits_table.findMany({
      where: { user_id: userId },
      orderBy: { start_date: 'desc' },
    });
    res.json(habits.map(serializeHabit));
  } catch (err) {
    console.error('[GET /api/habits] failed', err);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
});

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
        user_id: userId,
      },
    });

    res.status(201).json(serializeHabit(created));
  } catch (err) {
    console.error('[POST /api/habits] failed', err);
    res.status(500).json({ error: 'Failed to create habit' });
  }
});

router.delete('/:id', async (req, res) => {
  const idParam = req.params.id;
  let habitId;
  try {
    habitId = BigInt(idParam);
  } catch {
    return res.status(400).json({ error: 'Invalid habit id' });
  }

  try {
    const userId = req.auth.user.id;
    const existing = await prisma.habits_table.findFirst({
      where: { id: habitId, user_id: userId },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    await prisma.habits_table.delete({ where: { id: habitId } });
    res.status(204).send();
  } catch (err) {
    console.error('[DELETE /api/habits/:id] failed', err);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
});

router.post('/:id/toggle', async (req, res) => {
  const idParam = req.params.id;
  let habitId;
  try {
    habitId = BigInt(idParam);
  } catch {
    return res.status(400).json({ error: 'Invalid habit id' });
  }

  try {
    const userId = req.auth.user.id;
    const habit = await prisma.habits_table.findFirst({
      where: { id: habitId, user_id: userId },
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
      where: { id: habitId },
      data: payload,
    });

    res.json(serializeHabit(updated));
  } catch (err) {
    console.error('[POST /api/habits/:id/toggle] failed', err);
    res.status(500).json({ error: 'Failed to toggle habit' });
  }
});

module.exports = router;
