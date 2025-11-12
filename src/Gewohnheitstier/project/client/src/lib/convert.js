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