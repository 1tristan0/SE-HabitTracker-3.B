// client/src/components/Navbar.jsx
import React, { useEffect, useState } from "react";

// Navbar-Komponente
// Props:
//  - onNavigate: Callback-Funktion für Navigation zwischen Ansichten
//  - onLogout: Callback-Funktion zum Ausloggen des Nutzers
export default function Navbar({ onNavigate, onLogout }) {

  // "active" speichert die aktuell aktive Seite anhand des URL-Hashs
  // Fallback: "#/overview", falls kein Hash gesetzt ist
  const [active, setActive] = useState(window.location.hash || "#/overview");

  // useEffect wird einmal beim Laden der Komponente ausgeführt
  // Registriert einen Event-Listener, der reagiert, wenn sich der URL-Hash ändert (Navigation)
  useEffect(() => {
    const onHashChange = () => setActive(window.location.hash || "#/overview");
    window.addEventListener("hashchange", onHashChange);

    // Cleanup-Funktion: entfernt den Listener beim Verlassen der Komponente
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // handleClick navigiert zu einer neuen Ansicht
  // - Ruft optional den übergebenen onNavigate-Callback auf
  // - Aktualisiert den URL-Hash (z. B. "#/overview" oder "#/add")
  // - Aktualisiert den aktiven Zustand für visuelles Feedback
  const handleClick = (target) => {
    if (typeof onNavigate === "function") onNavigate(target); // falls Callback übergeben
    window.location.hash = target;                            // Hash ändern für Navigation
    setActive(target);                                        // aktiven Tab aktualisieren
  };

  return (
    // Navigationsleiste am unteren Rand (mobil) bzw. oben (Desktop)
    <nav className="bg-white shadow-md px-4 py-3 w-full fixed bottom-0 left-0 right-0 sm:static sm:py-3 z-50">
      <div className="max-w-5xl w-full mx-auto flex items-center sm:justify-between justify-around">

        {/* Linke Seite: App-Logo und Titel (nur auf größeren Bildschirmen sichtbar) */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold">
            H {/* App-Icon mit Buchstaben „H“ für „Habit“ */}
          </div>
          <h1 className="text-gray-800 text-xl font-semibold">Gewohnheitstier</h1>
        </div>

        {/* Rechte Seite: Navigationslinks & Logout-Button */}
        <div className="flex items-center gap-2 sm:gap-2 sm:ml-auto w-full sm:w-auto justify-around sm:justify-start">
          
          {/* Link zur Übersicht */}
          <a
            href="#/overview"
            onClick={(e) => {
              e.preventDefault();          // verhindert Standardverhalten (Seitenreload)
              handleClick("#/overview");   // navigiert zur Übersicht
            }}
            className={`px-3 py-2 rounded ${
              active === "#/overview"
                ? "text-blue-600 font-semibold"   // aktive Seite: blau & fett
                : "text-gray-600 hover:text-blue-600" // inaktiv: grau, mit Hover-Effekt
            }`}
            aria-current={active === "#/overview" ? "page" : undefined}
          >
            Übersicht
          </a>

          {/* Link zum Hinzufügen neuer Gewohnheiten */}
          <a
            href="#/add"
            onClick={(e) => {
              e.preventDefault();
              handleClick("#/add");
            }}
            className={`px-3 py-2 rounded ${
              active === "#/add"
                ? "text-blue-600 font-semibold"
                : "text-gray-600 hover:text-blue-600"
            }`}
            aria-current={active === "#/add" ? "page" : undefined}
          >
            Hinzufügen
          </a>

          {/* Logout-Button (nur auf größeren Bildschirmen sichtbar) */}
          <button
            className="btn btn-outline-secondary hidden sm:inline-block"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}