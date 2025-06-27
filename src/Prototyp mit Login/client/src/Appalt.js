import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // State-Initialisierung als leeres Array
  const [habits, setHabits] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Daten beim Mounten fetchen
  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const { data, error } = await supabase
      .from('habits_table')
      .select('*')
      .order('start_date', { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setHabits(data || []);
    }
  };

  // Neues Habit einfügen und danach Liste neu laden
  const addHabit = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from('habits_table')
      .insert({
        habit_name: newName,
        description: newDesc,
        start_date: new Date().toISOString().slice(0, 10)
      });

    if (error) {
      console.error(error);
      return;
    }

    // Nach Insert die Liste erneut laden
    fetchHabits();
    setNewName('');
    setNewDesc('');
  };

  // Habit löschen und danach Liste neu laden
  const deleteHabit = async (id) => {
    const { error } = await supabase
      .from('habits_table')
      .delete()
      .eq('id', id);
    if (error) {
      console.error(error);
      return;
    }

    // Nach Delete die Liste erneut laden
    fetchHabits();
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">Gewohnheitstracker</h1>

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

      {/* Habits rendern */}
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
