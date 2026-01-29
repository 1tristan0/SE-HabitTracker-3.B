import { getNumberOfCompletedHabits, getNumberOfCompletedHabitsLastMonth, getPercentageOfCompletedHabits, getPercentageOfCompletedHabitsLastMonth } from '../src/lib/habit';
import { daysBetween } from '../src/lib/calendar';

jest.mock('../src/lib/calendar');

describe('Habit Functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getNumberOfCompletedHabits', () => {

        it('should return 0 when prev_last_checked is empty and last_checked is 0', () => {
            const habit = { prev_last_checked: [], last_checked: 0 };
            expect(getNumberOfCompletedHabits(habit)).toBe(0);
        });

        it('should return 1 when last_checked exists and prev_last_checked is empty', () => {
            const habit = { prev_last_checked: [], last_checked: Date.now() };
            expect(getNumberOfCompletedHabits(habit)).toBe(1);
        });

        it('should return count + 1 when both last_checked and prev_last_checked exist', () => {
            const habit = { prev_last_checked: ['2024-01-01', '2024-01-02', '2024-01-03'], last_checked: Date.now() };
            expect(getNumberOfCompletedHabits(habit)).toBe(4);
        });
    });

    describe('getNumberOfCompletedHabitsLastMonth', () => {

        it('should count last_checked if within 30 days', () => {
            const today = new Date();
            const habit = { prev_last_checked: [], last_checked: today.toISOString() };
            expect(getNumberOfCompletedHabitsLastMonth(habit)).toBe(1);
        });

        it('should count prev_last_checked dates within 30 days', () => {
            const today = new Date();
            const tenDaysAgo = new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000);
            const habit = { prev_last_checked: [tenDaysAgo.toISOString()], last_checked: 0 };
            expect(getNumberOfCompletedHabitsLastMonth(habit)).toBe(1);
        });

        it('should exclude dates older than 30 days', () => {
            const today = new Date();
            const fortyDaysAgo = new Date(today.getTime() - 40 * 24 * 60 * 60 * 1000);
            const habit = { prev_last_checked: [fortyDaysAgo.toISOString()], last_checked: 0 };
            expect(getNumberOfCompletedHabitsLastMonth(habit)).toBe(0);
        });
    });

    describe('getPercentageOfCompletedHabits', () => {
        it('should return 0 when no habits completed', () => {
            const habit = { prev_last_checked: [], last_checked: 0, start_date: new Date().toISOString() };
            expect(getPercentageOfCompletedHabits(habit)).toBe(0);
        });

        it('should calculate percentage with only last_checked', () => {
            daysBetween.mockReturnValue(9);
            const habit = { prev_last_checked: [], last_checked: Date.now(), start_date: new Date().toISOString() };
            expect(getPercentageOfCompletedHabits(habit)).toBe(10);
        });

        it('should calculate percentage with prev_last_checked and last_checked', () => {
            daysBetween.mockReturnValue(99);
            const habit = { prev_last_checked: ['2024-01-01', '2024-01-02'], last_checked: Date.now(), start_date: new Date().toISOString() };
            expect(getPercentageOfCompletedHabits(habit)).toBe(3);
        });
    });

    describe('getPercentageOfCompletedHabitsLastMonth', () => {
        it('should return 0 when no habits completed', () => {
            const habit = { prev_last_checked: [], last_checked: 0, start_date: new Date().toISOString() };
            expect(getPercentageOfCompletedHabitsLastMonth(habit)).toBe(0);
        });

        it('should calculate percentage based on last month count', () => {
            daysBetween.mockReturnValue(60);
            const today = new Date();
            const habit = { prev_last_checked: [today.toISOString()], last_checked: today.toISOString(), start_date: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString() };
            expect(getPercentageOfCompletedHabitsLastMonth(habit)).toBe(7);
        });

        it('should cap total at 30 days for newer habits', () => {
            daysBetween.mockReturnValue(15);
            const today = new Date();
            const habit = { prev_last_checked: [], last_checked: today.toISOString(), start_date: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString() };
            expect(getPercentageOfCompletedHabitsLastMonth(habit)).toBe(6);
        });
    });
});