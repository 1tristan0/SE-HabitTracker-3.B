// client/src/api/habitsApi.js
import { supabase } from '../supabaseClient';

export async function fetchHabits(userId) {
  const { data, error } = await supabase
    .from('habits_table')
    .select('id, habit_name, description, start_date')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addHabit({ userId, name, desc }) {
  const { error } = await supabase
    .from('habits_table')
    .insert({
      habit_name: name,
      description: desc,
      start_date: new Date().toISOString().slice(0,10),
      user_id: userId
    });
  if (error) throw error;
}

export async function deleteHabit({ userId, id }) {
  const { error } = await supabase
    .from('habits_table')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}