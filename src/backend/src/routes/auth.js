const express = require('express');
const {
  loginWithPassword,
  registerUser,
  fetchUser,
  signOut,
} = require('../supabaseAuth');

const router = express.Router();

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
