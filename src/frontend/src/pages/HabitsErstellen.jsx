// HabitsErstellen.jsx
import React from "react";
import {
  addHabit as apiAddHabit,
} from "../api/habitsApi";
import HabitCreateContent from "../components/HabitCreateContent";

export default function HabitsErstellen({userId, session}) {
  const add = async (name, desc) => {
      try {
        await apiAddHabit(session.accessToken, { name, desc });
        console.log("Habit successfully added.");
      } catch (err) {
        console.error('Anlegen fehlgeschlagen:', err.message);
      }
  };

  const handleCancel = () => {
    // zurück zur Habit-Liste navigieren
    window.location.href = "/";
  };

  return (
    <HabitCreateContent
      onSubmit={add}
      onCancel={handleCancel}
    />
  );
}
