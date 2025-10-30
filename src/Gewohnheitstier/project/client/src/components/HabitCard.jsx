import { dateOnly } from "../lib/convert";

export default function HabitCard({ habit, onDelete, onCheck = () => {} }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{habit.habit_name}</h5>
        <p className="card-text">{habit.description}</p>
        <p className="card-text">
          <small className="text-muted">Gestartet: {habit.start_date}</small>
        </p>
        <p className="card-text">
          <small className="text-muted">
            Letztmalig erledigt: {habit.last_checked ? dateOnly(habit.last_checked) : "—"}
          </small>
        </p>

        <button
          className="btn btn-danger btn-sm me-2"
          onClick={() => onDelete(habit.id)}
        >
          Löschen
        </button>

        <div className="form-check form-switch d-inline-block">
          {/* jetzt safe */}
          {dateOnly(habit.last_checked) === today ? (
            <input
            type="checkbox"
            className="form-check-input"
            id={`check-${habit.id}`}
            onChange={() => onCheck(habit.id)}
            checked
          />
            ): (<input
            type="checkbox"
            className="form-check-input"
            id={`check-${habit.id}`}
            onChange={() => onCheck(habit.id)}
          />)}
          <label className="form-check-label" htmlFor={`check-${habit.id}`}>
            Erledigt heute
          </label>
        </div>
      </div>
    </div>
  );
}