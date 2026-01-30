
import { dateOnly, todayAsString } from "../../lib/convert";   // Hilfsfunktion zur Formatierung von Datumswerten (YYYY-MM-DD)
import Titel from "../ui/Titel";
import HabitCard from "./HabitCard";         // Einzelkomponente zur Darstellung einer Gewohnheit

// Komponente zur Darstellung aller Gewohnheiten in einem Grid (Liste)
export default function HabitGrid({ habits, onDelete, onCheck, onClick, onClose, onEdit, setAnimalMood }) {

    // Heutiges Datum im Format YYYY-MM-DD
    const today = todayAsString();

    // Gewohnheiten filtern:
    // 1. "completed" → alle Gewohnheiten, die heute erledigt wurden
    const completed = habits.filter((h) => dateOnly(h.last_checked) === today);
    // Wenn mindestens eine Gewohnheit erledigt wurde, setze Animal Mood auf "gluecklich", sonst auf "traurig"
    if (completed.length > 0) {
        setAnimalMood("gluecklich");
    } else {
        setAnimalMood("traurig");
    }

    // 2. "remaining" → alle Gewohnheiten, die noch nicht (oder an einem anderen Tag) erledigt wurden
    const remaining = habits.filter((h) => dateOnly(h.last_checked) !== today);

    return (
        <>
            {/* Noch nicht erledigte Gewohnheiten anzeigen */}
            {remaining.map((h) => (
                <HabitCard
                    key={h.id}              // Eindeutiger Schlüssel für React
                    habit={h}               // Gewohnheit als Prop
                    onDelete={onDelete}     // Löschen-Callback weiterreichen
                    onCheck={onCheck}       // Erledigt-Callback weiterreichen
                    onClick={onClick}       // Klick-Callback weiterreichen
                    onClose={onClose}       // Schließen-Callback weiterreichen
                    onEdit={onEdit}         // Bearbeiten-Callback weiterreichen
                />
            ))}

            {/* Abschnitt für heute bereits erledigte Gewohnheiten */}

            <Titel>Bereits heute erledigt</Titel>
            {completed.length > 0 ? (
                completed.map((h) => (
                    <HabitCard
                        key={h.id}
                        habit={h}
                        onDelete={onDelete}
                        onCheck={onCheck}
                        onClick={onClick}
                        onClose={onClose}
                        onEdit={onEdit}      
                    />
                ))
            ) : (
                <p className="text-center text-sm text-gray-400 mt-2">
                    Keine erledigten Gewohnheiten für heute.
                </p>
            )}
        </>
    );
}