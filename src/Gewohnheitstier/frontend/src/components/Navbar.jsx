// client/src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

// Props:
//  - onLogout: Callback-Funktion zum Ausloggen des Nutzers
export default function Navbar({ onLogout }) {
  return (
    <nav className="bg-white shadow-md px-4 py-3 w-full fixed bottom-0 left-0 right-0 sm:static sm:py-3 z-50">
      <div className="max-w-5xl w-full mx-auto flex items-center sm:justify-between justify-around">
        {/* Linke Seite: App-Logo und Titel (nur auf größeren Bildschirmen sichtbar) */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold">
            H
          </div>
          <h1 className="text-gray-800 text-xl font-semibold">Gewohnheitstier</h1>
        </div>

        {/* Rechte Seite: Navigationslinks & Logout-Button */}
        <div className="flex items-center gap-2 sm:gap-2 sm:ml-auto w-full sm:w-auto justify-around sm:justify-start">
          {/* Link zur Übersicht */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-3 py-2 rounded ${
                isActive
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
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
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            Hinzufügen
          </NavLink>

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
