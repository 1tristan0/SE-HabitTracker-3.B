import { daysBetween } from "./calendar";
/**
 * Gibt die Anzahl der erledigten Gewohnheiten zurück.
 * @param {Object} habit - Das Gewohnheitsobjekt
 * @returns {number} Anzahl der erledigten Gewohnheiten
 */
export const getNumberOfCompletedHabits = (habit) => {
    if ((!habit || habit.prev_last_checked.length === 0) && habit.last_checked === 0) return 0;
    else if (habit.last_checked && habit.prev_last_checked.length === 0) return 1;
    else{
        return (habit.prev_last_checked.length + 1); // +1 für heute
    }
}
export const getNumberOfCompletedHabitsLastMonth = (habit) => {
    if ((!habit || habit.prev_last_checked.length === 0) && habit.last_checked === 0) return 0;
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    let count = 0;
    // Überprüfen, ob die Gewohnheit heute erledigt wurde
    if (habit.last_checked) {
        const lastCheckedDate = new Date(habit.last_checked);
        if (lastCheckedDate >= thirtyDaysAgo && lastCheckedDate <= today) {
            count++;
        }
    }
    // Überprüfen der vorherigen erledigten Daten
    habit.prev_last_checked.forEach((dateString) => {
        const date = new Date(dateString);
        if (date >= thirtyDaysAgo && date <= today) {
            count++;
        }
    });
    return count;
}
/**
 * Gibt den Prozentsatz der erledigten Gewohnheiten zurück.
 * @param {Object} habit - Das Gewohnheitsobjekt
 * @returns {number} Prozentsatz der erledigten Gewohnheiten
 */
export const getPercentageOfCompletedHabits = (habit) => {
    if ((!habit || habit.prev_last_checked.length === 0) && habit.last_checked === 0) return 0;
    else if (habit.last_checked && habit.prev_last_checked.length === 0){
        const completed = 1;
        const total = daysBetween(new Date(habit.start_date), new Date()) + 1;
        return Math.round((completed / total) * 100);
    }else{
    const completed = habit.prev_last_checked.length + 1; // +1 für heute
    const total = daysBetween(new Date(habit.start_date), new Date()) + 1;
    return Math.round((completed / total) * 100);
    }
}

export const getPercentageOfCompletedHabitsLastMonth = (habit) => {
  if ((!habit || habit.prev_last_checked.length === 0) && habit.last_checked === 0) return 0;
  const completed = getNumberOfCompletedHabitsLastMonth(habit);
  // Wenn das Habit weniger als 30 Tage alt ist, nur seit Startdatum zählen
  const total = Math.min(30, daysBetween(new Date(habit.start_date), new Date()) + 1);
  return Math.round((completed / total) * 100);
};