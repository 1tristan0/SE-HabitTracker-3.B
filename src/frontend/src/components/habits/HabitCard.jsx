
import { dateOnly, todayAsString } from "../../lib/convert";
import DeleteIcon from "../icons/DeleteIcon";
import EditIcon from "../icons/EditIcon";
import StreakBadge from "../ui/StreakBadge";
import ToggleSwitch from "../ui/ToggleSwitch";


// React-Komponente zur Darstellung einer einzelnen Gewohnheit (Habit)
export default function HabitCard({
  habit,
  onDelete,
  onCheck = () => {},
  onClick = () => {},
  onEdit = () => {},
}) {
  // Heutiges Datum im Format YYYY-MM-DD (zum Vergleich mit last_checked)
  const today = todayAsString();

  // Sicherer Umgang mit optionalem last_checked
  const lastCheckedDate = habit.last_checked ? dateOnly(habit.last_checked) : null;
  const isDoneToday = lastCheckedDate === today;

  // Tastatur-Event-Handler für Barrierefreiheit
  const handleCardKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(habit);
    }
  };

  return (
    <div
      className="card mb-1 bg-primary3 habitcard mx-auto max-w-3xl cursor-pointer rounded-[10px] shadow-sm"
      role="button"
      tabIndex={0}
      onClick={() => onClick(habit)}
      onKeyDown={handleCardKeyDown}
    >
      <div className="card-body py-1 px-2">
        <div className="d-flex align-items-center">
          {/* Links: Toggle zum Erledigen/Nicht erledigen des Habits */}
          <div className="flex-shrink-0 me-2">
            <ToggleSwitch
              id={`check-${habit.id}`}
              checked={isDoneToday}
              onToggle={(nextChecked) => onCheck(habit.id, nextChecked)}
              ariaLabel="Heute erledigt"
              className="scale-90"
            />
          </div>

          {/* Mitte: Name + Beschreibung */}
          <div className="flex-grow-1 me-2 min-w-0">
            <div className="d-flex align-items-center justify-content-between mb-1">
              <h5
                className="mb-0 text-primary1 truncate text-[1.2rem] font-semibold"
                title={habit.habit_name}
              >
                {habit.habit_name}
              </h5>
            </div>

            {habit.description && (
              <p
                className="mb-0 text-primary1 truncate text-[0.9rem] opacity-90"
                title={habit.description}
              >
                {habit.description}
              </p>
            )}
          </div>

          {/* Nach der Mitte: Streak */}
          <div className="me-3 flex-shrink-0 d-flex align-items-center">
            <StreakBadge streak={habit.streak} />
          </div>

          {/* Rechts: Bearbeiten + Löschen */}
          <div className="d-flex align-items-center flex-shrink-0">
            <button
              className="btn btn-link btn-sm text-secondary p-0 me-2 inline-flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(habit);
              }}
              aria-label={`Bearbeite "${habit.habit_name}"`}
              title="Bearbeiten"
            >
              <EditIcon size={16} />
            </button>

            <button
              className="btn btn-link btn-sm text-danger p-0 inline-flex items-center justify-center"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(habit.id);
              }}
              aria-label={`Lösche "${habit.habit_name}"`}
              title="Löschen"
              role="löschen"
            >
              <DeleteIcon size={16} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}