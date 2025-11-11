import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import HabitsPage from './pages/HabitsPage';  //  Hauptseite

function App() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  // ==== Auth-Initialisierung ====
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  // ==== Login ====
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Login fehlgeschlagen: ' + error.message);
  };

  // ==== Registrierung ====
  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert('Registrierung fehlgeschlagen: ' + error.message);
    else alert('Bestätigungslink wurde an deine E-Mail geschickt.');
  };

  // ==== Logout ====
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ==== Login/Registrierung ====
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

  // ==== Authentifizierte Ansicht ====
  return (
    <HabitsPage
      userId={session.user.id}
      onLogout={handleLogout}
    />
  );
}

export default App;