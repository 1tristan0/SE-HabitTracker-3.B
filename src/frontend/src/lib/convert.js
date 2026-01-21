//Hier werden alle Utilities aufgeführt, welche Daten konvertieren

/**
 * Konvertiert einen Timestamp in ein Datum im Format YYYY-MM-DD
 * @param {*} ts 
 * @returns {string|null} Datum im Format YYYY-MM-DD oder null bei Fehler
 */
export const dateOnly = (ts) => {
        if (!ts) return null;
        try {
            return new Date(ts).toISOString().slice(0, 10);
        } catch (e) {
            console.error("Fehler bei der Datumskonvertierung:", e);
            return null;
        }
};

/**
 * Gibt den Monatsnamen und das Jahr für eine gegebene Jahreszahl und einen Monat zurück (Beispiel: März 2025)
 * @param {*} year 
 * @param {*} month 
 * @returns {string} Monatsname und Jahr im Format "Monat Jahr" (z.B. "März 2025")
 */
export const monthAndYear = (year, month) => {
    return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(new Date(year,month, 1)); // Diese Zeile formatiert den Monatsnamen und das Jahr für die Anzeige
};

/**
 * Gibt das heutige Datum im Format YYYY-MM-DD zurück
 * @returns {string} heutiges Datum im Format YYYY-MM-DD
 */
export const todayAsString = () => {
    return new Date().toISOString().slice(0,10);
};
/**
 * Datum wird in deutsches Format DD.MM.YYYY konvertiert
 * @param {*} dateStr 
 * @returns {string} Datum im Format DD.MM.YYYY
 */
export const convertToGermanDateString = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}
/**
 * Nur das Datum im Format YYYY-MM-DD in der Zeitzone Europe/Berlin extrahieren
 * @param {*} ts 
 * @returns {string|null} Datum im Format YYYY-MM-DD oder null bei Fehler
 */
export const dateOnlyBerlin = (ts) => {
  if (!ts) return null;
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date(ts));
  } catch (e) {
    return null;
  }
};
/**
 * Heutiges Datum in Berlin im Format YYYY-MM-DD
 * @returns {string} Datum im Format YYYY-MM-DD
 */
export const todayAsStringBerlin = () => {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(new Date());
};
/**
 * Ist das übergebene Datum in der Zukunft?
 * @param {*} dateStr istt ein Datum im Format YYYY-MM-DD
 * @returns {boolean} true, wenn das Datum in der Zukunft liegt, sonst false
 */
export const isInFuture = (dateStr) => {
  const today = new Date();
  const date = new Date(dateStr);
  return date > today;
}