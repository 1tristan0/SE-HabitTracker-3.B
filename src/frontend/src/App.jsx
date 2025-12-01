// client/src/App.jsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HabitsPage from './pages/HabitsPage';
import {
  login,
  register,
  logout,
  fetchSession,
  persistSession,
  loadSession,
  clearSession,
} from './api/authApi';

export default function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    const cached = loadSession();
    if (!cached?.accessToken) return;

    fetchSession(cached.accessToken)
      .then(({ user }) => setSession({ ...cached, user }))
      .catch(() => clearSession());
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      const next = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      };
      persistSession(next);
      setSession(next);
    } catch (err) {
      alert('Login fehlgeschlagen: ' + err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const result = await register(email, password);
      if (result.session?.accessToken) {
        const next = {
          accessToken: result.session.accessToken,
          refreshToken: result.session.refreshToken,
          user: result.user,
        };
        persistSession(next);
        setSession(next);
      } else {
        alert('Bestätigungslink wurde an deine E-Mail geschickt.');
      }
    } catch (err) {
      alert('Registrierung fehlgeschlagen: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      if (session?.accessToken) {
        await logout(session.accessToken);
      }
    } catch (err) {
      console.error('Logout-Fehler:', err.message);
    } finally {
      clearSession();
      setSession(null);
    }
  };

  if (!session) {
    return (
      <div className="container py-5" style={{ maxWidth: 400 }}>
        <h2 className="mb-4">{isLoginView ? 'Login' : 'Registrieren'}</h2>

        <form onSubmit={isLoginView ? handleLogin : handleRegister}>
          <div className="mb-3">
            <label className="form-label">E-Mail</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Passwort</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            {isLoginView ? 'Login' : 'Registrieren'}
          </button>
        </form>

        <div className="text-center mt-3">
          <button
            className="btn btn-link"
            onClick={() => setIsLoginView(!isLoginView)}
          >
            {isLoginView
              ? 'Noch keinen Account? Registrieren'
              : 'Schon registriert? Login'}
          </button>
        </div>
      </div>
    );
  }

  return <HabitsPage session={session} onLogout={handleLogout} />;
}
