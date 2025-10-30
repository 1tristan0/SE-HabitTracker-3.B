import { dateOnly } from "../lib/convert";
import HabitCard from "./HabitCard";

export default function HabitGrid({ habits, onDelete, onCheck }) {

    const today = new Date().toISOString().slice(0, 10);
    const completed = habits.filter((h) => dateOnly(h.last_checked) === today); // Filtern der erledigten Gewohnheiten
    const remaining = habits.filter((h) => dateOnly(h.last_checked) !== today);// Filtern der nicht erledigten Gewohnheiten

    return (
        <>
            {remaining.map((h) => (
                <HabitCard key={h.id} habit={h} onDelete={onDelete} onCheck={onCheck} />
            ))}

            {/* Welche Habits wurden heute schon erledigt */}
            <h1 className="text-2xl mb-3 font-bold text-center text-gray-500 mt-5">Bereits heute erledigt</h1>
            {completed.length > 0 ? (
                completed.map((h) => (
                    <HabitCard key={h.id} habit={h} onDelete={onDelete} onCheck={onCheck} />
                ))
            ) : (
                <p className="text-center text-sm text-gray-400 mt-2">Keine erledigten Gewohnheiten für heute.</p>
            )}
        </>
    );
}