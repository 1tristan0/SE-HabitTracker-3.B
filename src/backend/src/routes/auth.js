const express = require('express');
const {
  loginWithPassword,
  registerUser,
  fetchUser,
  signOut,
} = require('../supabaseAuth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Nutzer anmelden
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login erfolgreich
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSession'
 *       400:
 *         description: Fehlende Felder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Falsche Zugangsdaten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const session = await loginWithPassword(email, password);
    res.json({
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresIn: session.expires_in,
      tokenType: session.token_type,
      user: session.user,
    });
  } catch (err) {
    const status = err.status === 400 ? 401 : err.status || 500;
    res.status(status).json({ error: 'Login failed', detail: err.message });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Nutzer registrieren
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registrierung erfolgreich
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/AuthUser'
 *                 session:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/AuthSession'
 *                     - type: 'null'
 *       400:
 *         description: Fehlende Felder
 *       500:
 *         description: Serverfehler
 */

router.post('/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  try {
    const result = await registerUser(email, password);
    res.status(201).json({
      user: result.user,
      session: result.session
        ? {
            accessToken: result.session.access_token,
            refreshToken: result.session.refresh_token,
            expiresIn: result.session.expires_in,
            tokenType: result.session.token_type,
          }
        : null,
    });
  } catch (err) {
    const status = err.status === 400 ? 400 : err.status || 500;
    res.status(status).json({ error: 'Registration failed', detail: err.message });
  }
});
/**
 * @swagger
 * /api/auth/session:
 *   post:
 *     summary: Token prüfen und User liefern
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accessToken]
 *             properties:
 *               accessToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token gültig
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/AuthUser'
 *       400:
 *         description: Fehlende Felder
 *       401:
 *         description: Ungültiges Token
 */

router.post('/session', async (req, res) => {
  const { accessToken } = req.body || {};
  if (!accessToken) {
    return res.status(400).json({ error: 'accessToken is required' });
  }

  try {
    const user = await fetchUser(accessToken);
    res.json({ user });
  } catch (err) {
    const status = err.status === 401 ? 401 : err.status || 500;
    res.status(status).json({ error: 'Session lookup failed', detail: err.message });
  }
});
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Token abmelden
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accessToken]
 *             properties:
 *               accessToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logout erfolgreich
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Fehlende Felder
 *       401:
 *         description: Ungültiges Token
 */
router.post('/logout', async (req, res) => {
  const { accessToken } = req.body || {};
  if (!accessToken) {
    return res.status(400).json({ error: 'accessToken is required' });
  }

  try {
    await signOut(accessToken);
    res.json({ success: true });
  } catch (err) {
    const status = err.status === 401 ? 401 : err.status || 500;
    res.status(status).json({ error: 'Logout failed', detail: err.message });
  }
});

module.exports = router;
