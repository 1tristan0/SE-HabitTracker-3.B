const { fetchUser } = require('../supabaseAuth');

async function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  try {
    const user = await fetchUser(token);
    req.auth = { token, user };
    return next();
  } catch (err) {
    const status = err.status === 401 ? 401 : 403; // Unauthorisiert oder Verboten
    return res.status(status).json({ error: 'Authentication failed', detail: err.message });
  }
}

module.exports = { authenticate };
