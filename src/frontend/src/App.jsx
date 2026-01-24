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
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import { Route, Routes } from 'react-router';
import CreateHabitPage from './pages/CreateHabitPage';

export default function App() {
  const [session, setSession] = useState(null);
  const [isLoginView, setIsLoginView] = useState(true);

  useEffect(() => {
    const cached = loadSession();
    if (!cached?.accessToken) return;

    fetchSession(cached.accessToken)
      .then(({ user }) => setSession({ ...cached, user }))
      .catch(() => clearSession());
  }, []);

  const handleLogin = async (email, password) => {
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

  const handleRegister = async (email, password) => {
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
    return isLoginView ? (
      <Login
        onSubmit={handleLogin}
        switchToRegister={() => setIsLoginView(false)}
      />
    ) : (
      <Signup
        onSubmit={handleRegister}
        switchToLogin={() => setIsLoginView(true)}
      />
    );
  }

  // ==== Authentifizierte Ansicht ====
  return (
    <>
      <Navbar onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={<HabitsPage session={session} view="overview" />}
        />
        <Route
          path="/add"
          element={<CreateHabitPage userId={session.user.id} session={session} view="add" />}
        />
      </Routes>
    </>
  );
}
