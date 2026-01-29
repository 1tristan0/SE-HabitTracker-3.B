import { dateOnly, monthAndYear, todayAsString, convertToGermanDateString, dateOnlyBerlin, todayAsStringBerlin, isInFuture } from '../src/lib/convert';

describe('convert.js', () => {
    describe('dateOnly', () => {

        it('should convert valid timestamp to YYYY-MM-DD format', () => {
            const ts = new Date('2025-03-15').getTime();
            expect(dateOnly(ts)).toBe('2025-03-15');
        });

        it('should convert ISO string to YYYY-MM-DD format', () => {
            expect(dateOnly('2025-03-15T12:30:00Z')).toBe('2025-03-15');
        });

        it('should return null for null input', () => {
            expect(dateOnly(null)).toBeNull();
        });

        it('should return null for undefined input', () => {
            expect(dateOnly(undefined)).toBeNull();
        });

        it('should return null for invalid timestamp', () => {
            expect(dateOnly('invalid')).toBeNull();
        });

        it('should return null for empty string', () => {
            expect(dateOnly('')).toBeNull();
        });
    });

    describe('monthAndYear', () => {
        it('should return formatted month and year', () => {
            expect(monthAndYear(2025, 2)).toBe('März 2025');
        });

        it('should handle January', () => {
            expect(monthAndYear(2025, 0)).toBe('Januar 2025');
        });

        it('should handle December', () => {
            expect(monthAndYear(2025, 11)).toBe('Dezember 2025');
        });
    });

    describe('todayAsString', () => {
        it('should return today\'s date in YYYY-MM-DD format', () => {
            const result = todayAsString();
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe('convertToGermanDateString', () => {
        it('should convert to German date format DD.MM.YYYY', () => {
            expect(convertToGermanDateString('2025-03-15')).toBe('15.03.2025');
        });
    });

    describe('dateOnlyBerlin', () => {
        it('should return date in YYYY-MM-DD format with Berlin timezone', () => {
            const result = dateOnlyBerlin(new Date('2025-03-15').getTime());
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('should return null for null input', () => {
            expect(dateOnlyBerlin(null)).toBeNull();
        });
    });

    describe('todayAsStringBerlin', () => {
        it('should return today\'s date in YYYY-MM-DD format with Berlin timezone', () => {
            const result = todayAsStringBerlin();
            expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });
    });

    describe('isInFuture', () => {
        it('should return true for future date', () => {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            expect(isInFuture(futureDate.toISOString().split('T')[0])).toBe(true);
        });

        it('should return false for past date', () => {
            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - 1);
            expect(isInFuture(pastDate.toISOString().split('T')[0])).toBe(false);
        });

        it('should return false for today', () => {
            expect(isInFuture(todayAsString())).toBe(false);
        });
    });
});