import React from "react";
import { NavLink } from "react-router-dom";

// Props:
//  - onLogout: Callback-Funktion zum Ausloggen des Nutzers
export default function Navbar({ onLogout }) {
  return (
    <nav className="bg-primary1 shadow-md px-4 py-3 w-full fixed bottom-0 left-0 right-0 sm:static sm:py-3 z-50">
      <div className="max-w-5xl w-full mx-auto flex items-center sm:justify-between justify-around">
        {/* Linke Seite: App-Logo und Titel (nur auf größeren Bildschirmen sichtbar) */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-primary3 text-primary1 rounded-full font-bold">
            H
          </div>
          <h1 className="text-primary3 text-xl font-semibold">Gewohnheitstier</h1>
        </div>

        {/* Rechte Seite: Navigationslinks & Logout-Button */}
        <div className="flex items-center gap-2 sm:gap-2 sm:ml-auto w-full sm:w-auto justify-around sm:justify-start">
          {/* Link zur Übersicht */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "text-primary3 font-semibold"
                  : "text-gray-600 hover:text-primary3"
              }`
            }
          >
            Übersicht
          </NavLink>

          {/* Link zum Hinzufügen neuer Gewohnheiten */}
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "text-primary3 font-semibold"
                  : "text-gray-600 hover:text-primary3"
              }`
            }
          >
            Hinzufügen
          </NavLink>

          {/* Logout-Button (nur auf größeren Bildschirmen sichtbar) */}
          <button
            className="btn btn-outline-secondary hidden sm:inline-block bg-primary3 text-primary1 hover:bg-primary4"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
