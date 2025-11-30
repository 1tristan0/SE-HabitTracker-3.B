//Hier werden alle Utilities aufgeführt, welche Daten konvertieren

//Konvertiert einen Timestamp in ein Datum im Format YYYY-MM-DD
export const dateOnly = (ts) => {
        if (!ts) return null;
        try {
            return new Date(ts).toISOString().slice(0, 10);
        } catch (e) {
            return null;
        }
};

// Gibt den Monatsnamen und das Jahr für eine gegebene Jahreszahl und einen Monat zurück (Beispiel: März 2025)
export const monthAndYear = (year, month) => {
    return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date(year,month, 1)); // Diese Zeile formatiert den Monatsnamen und das Jahr für die Anzeige
};

// Gibt das heutige Datum im Format YYYY-MM-DD zurück
export const todayAsString = () => {
    return new Date().toISOString().slice(0,10);
};