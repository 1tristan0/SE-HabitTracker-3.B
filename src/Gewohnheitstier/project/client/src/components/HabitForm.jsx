// client/src/components/HabitForm.jsx

// Importiere useState aus React, um lokale Zustände (Formularwerte) zu verwalten
import { useState } from 'react';

// HabitForm-Komponente zum Hinzufügen neuer Gewohnheiten
// Erwartet eine Callback-Funktion `onAdd`, die beim Absenden des Formulars ausgeführt wird
export default function HabitForm({ onAdd }) {
  // Lokale Zustände für Eingabefelder: Name und Beschreibung der Gewohnheit
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  return (
    // Formular zum Erfassen einer neuen Gewohnheit
    // onSubmit verhindert das Standardverhalten (Seiten-Reload)
    // ruft `onAdd` mit den aktuellen Werten auf
    // setzt danach die Felder wieder auf leer zurück
    <form
      onSubmit={(e) => {
        e.preventDefault();        // verhindert Seitenneuladen
        onAdd(name, desc);         // ruft Callback-Funktion mit Eingabewerten auf
        setName('');               // Eingabefeld für Name zurücksetzen
        setDesc('');               // Eingabefeld für Beschreibung zurücksetzen
      }}
      className="mb-5"
    >
      {/* Eingabefeld für den Namen der Gewohnheit */}
      <div className="mb-3">
        <label className="form-label">Name der Gewohnheit</label>
        <input
          className="form-control"
          value={name}                      // gebundener Wert (controlled component)
          onChange={(e) => setName(e.target.value)} // aktualisiert Zustand bei Eingabe
          required                          // Pflichtfeld
        />
      </div>

      {/* Textfeld für die Beschreibung der Gewohnheit */}
      <div className="mb-3">
        <label className="form-label">Beschreibung</label>
        <textarea
          className="form-control"
          rows={3}
          value={desc}                      // gebundener Wert
          onChange={(e) => setDesc(e.target.value)} // aktualisiert Zustand
          required                          // Pflichtfeld
        />
      </div>

      {/* Button zum Absenden des Formulars */}
      <button type="submit" className="btn btn-primary">
        Hinzufügen
      </button>
    </form>
  );
}