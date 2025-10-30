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
      .select('id, habit_name, description, start_date, last_checked')
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
  const check = async (id) => {
  const today = new Date().toISOString().slice(0,10);
  const { error } = await supabase
    .from('habits_table')
    .update({ last_checked: today })
    .eq('id', id)
    .eq('user_id', userId);
  if (!error) load();
  if(error) console.log("Error checking habit:", error);
};

  useEffect(() => { if (userId) load(); }, [userId]);

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