// Hilfsfunktion zum Formatieren von Datumswerten (z. B. Entfernen von Uhrzeit)
import { convertToGermanDateString, dateOnly } from "../lib/convert";
// Small inline delete icon to avoid external dependency on `react-icons`
// Small inline delete icon to avoid external dependency on `react-icons`
function DeleteIcon({ size = 18 }) {
  const s = size;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

// Simple edit (pencil) icon component
function EditIcon({ size = 16 }) {
  const s = size;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

// Compact visual badge for streak with a small flame icon and color tiers
function StreakBadge({ streak = 0 }) {
  const s = Number(streak) || 0;
  let bg = "#e9ecef";
  let textColor = "#222";

  if (s >= 30) {
    bg = "linear-gradient(135deg,#ffd166,#f4a261)";
    textColor = "#3b2f00";
  } else if (s >= 7) {
    bg = "#ff7a00";
    textColor = "#fff";
  } else if (s >= 3) {
    bg = "#2f9e44";
    textColor = "#fff";
  }

  const containerStyle = {
    minWidth: 46,
    height: 32,              // smaller than before → more compact
    borderRadius: 999,
    padding: "4px 8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,

    background: bg,
    color: textColor,
    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
  };

  return (
    <div
      className="streak-badge"
      title={`Streak: ${s} ${s === 1 ? "Tag" : "Tage"}`}
      style={{ ...containerStyle, overflow: "visible" }}
    >
      <img src="/flame.svg" alt="Flame icon" fill="orange" style={{ width: 14, height: 14 }} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          lineHeight: 1.1,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: "0.8rem", fontWeight: 700 }}>{s}</span>
      </div>
    </div>
  );
}

// React-Komponente zur Darstellung einer einzelnen Gewohnheit (Habit)
export default function HabitCard({
  habit,
  onDelete,
  onCheck = () => {},
  onClick = () => {},
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