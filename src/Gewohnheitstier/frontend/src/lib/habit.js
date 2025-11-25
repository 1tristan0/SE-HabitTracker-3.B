import { daysBetween } from "./calendar";

export const getNumberOfCompletedHabits = (habit) => {
    if (!habit || habit.prev_last_checked.length === 0) return 0;
    return habit.prev_last_checked.length;
}

export const getPercentageOfCompletedHabits = (habit) => {
    if (!habit || habit.prev_last_checked.length === 0) return 0;
    const completed = habit.prev_last_checked.length;
    const total = daysBetween(new Date(habit.start_date), new Date()) + 1;
    return Math.round((completed / total) * 100);
}