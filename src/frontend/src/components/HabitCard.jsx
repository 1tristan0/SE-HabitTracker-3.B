
import { dateOnly } from "../lib/convert";
import DeleteIcon from "./icons/DeleteIcon";
import EditIcon from "./icons/EditIcon";
import StreakBadge from "./ui/StreakBadge";


// React-Komponente zur Darstellung einer einzelnen Gewohnheit (Habit)
export default function HabitCard({
  habit,
  onDelete,
  onCheck = () => {},
  onClick = () => {},
  onEdit = () => {},
}) {
  // Heutiges Datum im Format YYYY-MM-DD (zum Vergleich mit last_checked)
  const today = new Date().toISOString().slice(0, 10);

  // Sicherer Umgang mit optionalem last_checked
  const lastCheckedDate = habit.last_checked ? dateOnly(habit.last_checked) : null;
  const isDoneToday = lastCheckedDate === today;

  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(habit);
    }
  };

  return (
    <div
      className="card mb-1 bg-primary3 habitcard mx-auto max-w-3xl"
      role="button"
      tabIndex={0}
      onClick={() => onClick(habit)}
      onKeyDown={handleCardKeyDown}
      style={{
        cursor: "pointer",
        borderRadius: 10,
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      <div className="card-body py-1 px-2">
        <div className="d-flex align-items-center">
          {/* LEFT: Toggle */}
          <div className="flex-shrink-0 me-2">
            <div className="form-check form-switch mb-0" style={{ transform: "scale(0.9)" }}>
              <input
                type="checkbox"
                className="form-check-input"
                id={`check-${habit.id}`}
                checked={isDoneToday}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation();
                  onCheck(habit.id, e.target.checked);
                }}
                aria-label="Heute erledigt"
              />
            </div>
          </div>

          {/* MIDDLE: Name + Beschreibung */}
          <div className="flex-grow-1 me-2" style={{ minWidth: 0 }}>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h5
                className="mb-0 text-primary1 text-truncate"
                style={{ fontSize: "1.2rem", fontWeight: 600 }}
                title={habit.habit_name}
              >
                {habit.habit_name}
              </h5>
            </div>

            {habit.description && (
              <p
                className="mb-0 text-primary1 text-truncate"
                style={{
                  fontSize: "0.9rem",
                  opacity: 0.9,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                title={habit.description}
              >
                {habit.description}
              </p>
            )}
          </div>

          {/* AFTER MIDDLE: Streak */}
          <div className="me-3 flex-shrink-0 d-flex align-items-center">
            <StreakBadge streak={habit.streak} />
          </div>

          {/* RIGHT: Edit + Delete */}
          <div className="d-flex align-items-center flex-shrink-0">
            <button
              className="btn btn-link btn-sm text-secondary p-0 me-2"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(habit);
              }}
              aria-label={`Bearbeite "${habit.habit_name}"`}
              title="Bearbeiten"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditIcon size={16} />
            </button>

            <button
              className="btn btn-link btn-sm text-danger p-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(habit.id);
              }}
              aria-label={`Lösche "${habit.habit_name}"`}
              title="Löschen"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DeleteIcon size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}