const express = require('express');
const prisma = require('../prisma');
const { authenticate } = require('../middleware/authenticate');

const router = express.Router();

const ANIMAL_TYPES = ['hund', 'katze', 'hamster', 'wurm'];
const ANIMAL_MOODS = ['gluecklich', 'traurig'];

function isValidEnumValue(value, allowed) {
  return typeof value === 'string' && allowed.includes(value);
}

router.use(authenticate);

/**
 * @swagger
 * /api/users/animal:
 *   get:
 *     summary: Tier-Typ und Stimmung des angemeldeten Nutzers laden
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Erfolgreich
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAnimal'
 *       404:
 *         description: Nutzer nicht gefunden
 *       401:
 *         description: Kein oder ungültiges Token
 */
router.get('/animal', async (req, res) => {
  try {
    const userId = req.auth.user.id;
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { animal_type: true, animal_mood: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      animal_type: user.animal_type,
      animal_mood: user.animal_mood,
    });
  } catch (err) {
    console.error('[GET /api/users/animal] failed', err);
    return res.status(500).json({ error: 'Failed to fetch user animal data' });
  }
});

/**
 * @swagger
 * /api/users/animal:
 *   put:
 *     summary: Tier-Typ und/oder Stimmung des angemeldeten Nutzers setzen
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserAnimalUpdate'
 *           examples:
 *             setBoth:
 *               summary: Typ und Stimmung setzen
 *               value:
 *                 animal_type: katze
 *                 animal_mood: traurig
 *             setTypeOnly:
 *               summary: Nur Typ setzen
 *               value:
 *                 animal_type: hund
 *             setMoodOnly:
 *               summary: Nur Stimmung setzen
 *               value:
 *                 animal_mood: gluecklich
 *     responses:
 *       200:
 *         description: Erfolgreich aktualisiert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAnimal'
 *       400:
 *         description: Ungültige Werte
 *       404:
 *         description: Nutzer nicht gefunden
 *       401:
 *         description: Kein oder ungültiges Token
 */
router.put('/animal', async (req, res) => {
  const { animal_type, animal_mood } = req.body || {};

  if (animal_type == null && animal_mood == null) {
    return res.status(400).json({ error: 'animal_type or animal_mood is required' });
  }

  if (animal_type != null && !isValidEnumValue(animal_type, ANIMAL_TYPES)) {
    return res.status(400).json({ error: 'Invalid animal_type' });
  }

  if (animal_mood != null && !isValidEnumValue(animal_mood, ANIMAL_MOODS)) {
    return res.status(400).json({ error: 'Invalid animal_mood' });
  }

  try {
    const userId = req.auth.user.id;
    const existing = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!existing) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updated = await prisma.users.update({
      where: { id: userId },
      data: {
        ...(animal_type != null ? { animal_type } : {}),
        ...(animal_mood != null ? { animal_mood } : {}),
      },
      select: { animal_type: true, animal_mood: true },
    });

    return res.json({
      animal_type: updated.animal_type,
      animal_mood: updated.animal_mood,
    });
  } catch (err) {
    console.error('[PUT /api/users/animal] failed', err);
    return res.status(500).json({ error: 'Failed to update user animal data' });
  }
});

module.exports = router;
