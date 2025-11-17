//// client/src/components/HabitGrid.jsx
// Importiere Hilfsfunktion und Komponente
import { dateOnly } from "../lib/convert";   // Hilfsfunktion zur Formatierung von Datumswerten (YYYY-MM-DD)
import HabitCard from "./HabitCard";         // Einzelkomponente zur Darstellung einer Gewohnheit

// Komponente zur Darstellung aller Gewohnheiten in einem Grid (Liste)
// Props:
//  - habits: Array aller Gewohnheiten
//  - onDelete: Callback zum Löschen einer Gewohnheit
//  - onCheck: Callback zum Markieren als erledigt
export default function HabitGrid({ habits, onDelete, onCheck }) {

    // Heutiges Datum im Format YYYY-MM-DD
    const today = new Date().toISOString().slice(0, 10);

    // Gewohnheiten filtern:
    // 1. "completed" → alle, die heute erledigt wurden
    const completed = habits.filter((h) => dateOnly(h.last_checked) === today);

    // 2. "remaining" → alle, die noch nicht (oder an einem anderen Tag) erledigt wurden
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
                />
            ))}

            {/* Abschnitt für heute bereits erledigte Gewohnheiten */}
            <h1 className="text-2xl mb-3 font-bold text-center text-gray-500 mt-5">
                Bereits heute erledigt
            </h1>

            {/* Wenn es bereits erledigte Gewohnheiten gibt, zeige sie an,
                ansonsten einen Hinweistext */}
            {completed.length > 0 ? (
                completed.map((h) => (
                    <HabitCard
                        key={h.id}
                        habit={h}
                        onDelete={onDelete}
                        onCheck={onCheck}
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