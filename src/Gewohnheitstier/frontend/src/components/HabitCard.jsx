// client/src/components/HabitCard.jsx
// Hilfsfunktion zum Formatieren von Datumswerten (z. B. Entfernen von Uhrzeit)
import { dateOnly } from "../lib/convert";

// React-Komponente zur Darstellung einer einzelnen Gewohnheit (Habit)
export default function HabitCard({ habit, onDelete, onCheck = () => {}, onClick = () => {}, onClose = () => {} }) {
  // Heutiges Datum im Format YYYY-MM-DD (zum Vergleich mit last_checked)
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="card mb-3" onClick={() => onClick(habit)}>
      <div className="card-body">
        {/* Titel der Gewohnheit */}
        <h5 className="card-title">{habit.habit_name}</h5>

        {/* Beschreibung der Gewohnheit */}
        <p className="card-text">{habit.description}</p>

        {/* Anzeige des Startdatums */}
        <p className="card-text">
          <small className="text-muted">Gestartet: {habit.start_date}</small>
        </p>

        {/* Anzeige des letzten Erledigungsdatums (oder „—“, falls noch nie erledigt) */}
        <p className="card-text">
          <small className="text-muted">
            Letztmalig erledigt: {habit.last_checked ? dateOnly(habit.last_checked) : "—"}
          </small>
        </p>
        {/* Anzeige der Streak) */}
        <p className="card-text">
          <small className="text-muted">
            Streak: {habit.streak || 0}
          </small>
        </p>

        {/* Button zum Löschen der Gewohnheit */}
        <button
          className="btn btn-danger btn-sm me-2"
          onClick={(e) => { e.stopPropagation(); onDelete(habit.id); }} // prevent card click
        >
          Löschen
        </button>

        {/* Schalter (Switch) zum Markieren, ob die Gewohnheit heute erledigt wurde */}
        <div className="form-check form-switch d-inline-block">
          <input
            type="checkbox"
            className="form-check-input"
            id={`check-${habit.id}`}
            checked={dateOnly(habit.last_checked) === today}
            onChange={(e) => { e.stopPropagation(); onCheck(habit.id, e.target.checked); }}
          />

          {/* Label neben der Checkbox */}
          <label className="form-check-label" htmlFor={`check-${habit.id}`}>
            Erledigt!
          </label>
        </div>
      </div>
    </div>
  );
}