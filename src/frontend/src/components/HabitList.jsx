// client/src/components/HabitList.jsx

// Funktion zum Aktualisieren (Abhaken) einer Gewohnheit
// Sie sendet eine PUT-Anfrage an die API, um das Feld `last_checked` auf das aktuelle Datum zu setzen
async function handleCheck(habitId) {
  await fetch(`/api/habits/${habitId}/check`, {
    method: "PUT",                               // HTTP-Methode für Update
    headers: { "Content-Type": "application/json" }, // JSON als Datenformat
    body: JSON.stringify({
      last_checked: new Date().toISOString(),    // aktuelles Datum im ISO-Format (z. B. "2025-11-03T09:45:00Z")
    }),
  });

  // Nach erfolgreichem Update die Habit-Liste neu laden,
  // damit der neue Status (z. B. „heute erledigt“) angezeigt wird.
  // Alternativ könnte man auch den lokalen State direkt anpassen, um einen API-Call zu sparen.
  await fetchHabits();
}

// Rendering der HabitCards
// Jede Gewohnheit wird als eigene Karte angezeigt
// Props:
//  - key: eindeutige ID für React
//  - habit: Objekt mit Name, Beschreibung, Status etc.
//  - onDelete: Callback zum Löschen der Gewohnheit
//  - onCheck: Callback zum Abhaken (setzt last_checked auf heute)
{habits.map((h) => (
  <HabitCard
    key={h.id}
    habit={h}
    onDelete={handleDelete}   // ruft handleDelete(h.id) auf, wenn Nutzer "Löschen" klickt
    onCheck={handleCheck}     // ruft handleCheck(h.id) auf, wenn Nutzer "Erledigt" anklickt
  />
))}