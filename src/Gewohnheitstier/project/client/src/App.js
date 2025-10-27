import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // ------ Auth-State ------
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginView, setIsLoginView] = useState(true);

  // ------ Habit-State ------
  const [habits, setHabits] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // on load: get session & set listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchHabits(session.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      if (session) fetchHabits(session.user.id);
      else setHabits([]);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Fetch habits for given user
  const fetchHabits = async (userId) => {
    const { data, error } = await supabase
      .from('habits_table')
      .select('id, habit_name, description, start_date')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });
    if (error) console.error(error);
    else setHabits(data || []);
  };

  // Add new habit
  const addHabit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('habits_table')
      .insert({
        habit_name: newName,
        description: newDesc,
        start_date: new Date().toISOString().slice(0, 10),
        user_id: session.user.id
      });
    if (error) console.error(error);
    else {
      setNewName('');
      setNewDesc('');
      fetchHabits(session.user.id);
    }
  };

  // Delete habit
  const deleteHabit = async (id) => {
    const { error } = await supabase
      .from('habits_table')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);
    if (error) console.error(error);
    else fetchHabits(session.user.id);
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Login failed: ' + error.message);
  };

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert('Sign-up failed: ' + error.message);
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // ----- Unauthenticated View -----
  if (!session) {
    return (
      <div className="container py-5" style={{ maxWidth: 400 }}>
        <h2 className="mb-4">{isLoginView ? 'Login' : 'Registrieren'}</h2>
        <form onSubmit={isLoginView ? handleLogin : handleRegister}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Passwort</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
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
            {isLoginView ? 'Noch keinen Account? Registrieren' : 'Schon registriert? Login'}
          </button>
        </div>
      </div>
    );
  }

  // ----- Authenticated View -----
  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gewohnheitstier</h1>
        <button className="btn btn-outline-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <form onSubmit={addHabit} className="mb-5">
        <div className="mb-3">
          <label className="form-label">Name der Gewohnheit</label>
          <input
            type="text"
            className="form-control"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Beschreibung</label>
          <textarea
            className="form-control"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={3}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Hinzufügen</button>
      </form>

      {habits.map(habit => (
        <div key={habit.id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{habit.habit_name}</h5>
            <p className="card-text">{habit.description}</p>
            <p className="card-text"><small className="text-muted">Gestartet: {habit.start_date}</small></p>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteHabit(habit.id)}
            >
              Löschen
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
