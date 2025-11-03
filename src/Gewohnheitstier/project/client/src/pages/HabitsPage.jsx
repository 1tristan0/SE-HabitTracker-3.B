// client/src/pages/HabitsPage.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import HabitForm from '../components/HabitForm';
import Navbar from '../components/Navbar';
import HabitGrid from '../components/HabitGrid';

export default function HabitsPage({ userId, onLogout }) {
  const [habits, setHabits] = useState([]);

  const load = async () => {
    const { data, error } = await supabase
      .from('habits_table')
      .select('id, habit_name, description, start_date, last_checked, prev_last_checked, streak')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });
    if (!error) setHabits(data || []);
  };

  const add = async (name, desc) => {
    const { error } = await supabase.from('habits_table').insert({
      habit_name: name,
      description: desc,
      start_date: new Date().toISOString().slice(0,10),
      user_id: userId
    });
    if (!error) load();
  };

  const remove = async (id) => {
    const { error } = await supabase.from('habits_table')
      .delete().eq('id', id).eq('user_id', userId);
    if (!error) load();
  };
  // vereinfachte Check-/Uncheck-Logik
  const check = async (id, nextChecked = true) => {
    const today = new Date().toISOString().slice(0, 10);

    const { data: row, error: selErr } = await supabase
      .from('habits_table')
      .select('last_checked, prev_last_checked, streak')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (selErr) {
      console.error('Select error:', selErr);
      return;
    }

    const currentStreak = Number(row?.streak || 0);
    // prev als echtes Array normalisieren (NULL -> [])
    const prev = Array.isArray(row?.prev_last_checked) ? row.prev_last_checked : (row?.prev_last_checked ? [row.prev_last_checked].flat() : []);
    const lastDate = row?.last_checked ? row.last_checked.slice(0, 10) : null;


    const payload = nextChecked
      ? {
          // vorheriges Datum an Array anhängen
          prev_last_checked: lastDate ? [...prev, lastDate] : [...prev],
          last_checked: today,               // "YYYY-MM-DD"
          streak: currentStreak + 1,
        }
      : {
          // letztes “altes” Datum zurückholen (oder null)
          last_checked: prev.at(-1) ?? null,
          // und aus dem Array entfernen
          prev_last_checked: prev.length ? prev.slice(0, -1) : [],
          streak: Math.max(0, currentStreak - 1),
        };
    const { error: updErr } = await supabase
      .from('habits_table')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId);

    if (updErr) {
      console.error('Update error:', updErr);
      return;
    }

    load();
  };

  useEffect(() => {
    if (userId) load();
  }, [userId]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Navbar onLogout={onLogout} />
        
      </div>

      {/* <- Das ist das fehlende Eingabeformular */}
      <HabitForm onAdd={add} />

      {/*{habits.map(h => (
        <HabitCard key={h.id} habit={h} onDelete={remove} onCheck={check} />
      ))}*/}
      <HabitGrid habits={habits} onDelete={remove} onCheck={check} />
    </div>
  );
}