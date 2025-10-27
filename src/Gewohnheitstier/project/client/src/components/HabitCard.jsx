// client/src/components/HabitCard.jsx
export default function HabitCard({ habit, onDelete }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{habit.habit_name}</h5>
        <p className="card-text">{habit.description}</p>
        <p className="card-text"><small className="text-muted">Gestartet: {habit.start_date}</small></p>
        <button className="btn btn-danger btn-sm" onClick={()=>onDelete(habit.id)}>Löschen</button>
      </div>
    </div>
  );
}