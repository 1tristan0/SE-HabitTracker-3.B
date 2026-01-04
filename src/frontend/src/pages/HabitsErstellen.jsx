// HabitsErstellen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  addHabit as apiAddHabit,
} from "../api/habitsApi";
import HabitCreateContent from "../components/HabitCreateContent";

export default function HabitsErstellen({userId, session}) {
  const navigate = useNavigate();
  const token = session?.accessToken;

  
  const add = async (name, desc) => {
      try {
        await apiAddHabit(token, { name, desc });
        console.log("Habit successfully added.");
          navigate("/");
      } catch (err) {
        console.error('Anlegen fehlgeschlagen:', err.message);
      }
  };
  /*if (!session || !session.accessToken || !userId) {
    window.location.href = "/";
  }*/

  const handleCancel = () => {
    // zurück zur Habit-Liste navigieren
     navigate("/");
  };

  return (
    <HabitCreateContent
      onSubmit={add}
      onCancel={handleCancel}
    />
  );
}
