// HabitsErstellen.jsx
import React from "react";
import {
  addHabit as apiAddHabit,
} from "../api/habitsApi";
import HabitCreateContent from "../components/HabitCreateContent";

export default function HabitsErstellen({userId}) {
  const add = async (name, desc) => {
      try {
        await apiAddHabit({ userId, name, desc });
      } catch (err) {
        console.error('Anlegen fehlgeschlagen:', err.message);
      }
  };

  const handleCancel = () => {
    // zurück zur Habit-Liste navigieren
  };

  return (
    <HabitCreateContent
      onSubmit={add}
      onCancel={handleCancel}
    />
  );
}
