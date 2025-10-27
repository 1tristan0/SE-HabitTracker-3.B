import React, { useEffect, useState } from "react";

export default function Navbar({ onNavigate, onLogout }) {
  const [active, setActive] = useState(window.location.hash || "#/overview");

  useEffect(() => {
    const onHashChange = () => setActive(window.location.hash || "#/overview");
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleClick = (target) => {
    if (typeof onNavigate === "function") onNavigate(target);
    // update hash to allow simple routing without adding a dependency
    window.location.hash = target;
    setActive(target);
  };

    return (
      <nav className="bg-white shadow-md px-4 py-3 w-full fixed bottom-0 left-0 right-0 sm:static sm:py-3 z-50">
        <div className="max-w-5xl w-full mx-auto flex items-center sm:justify-between justify-around">
          <div className="hidden sm:flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-bold">
              H
            </div>
            <h1 className="text-gray-800 text-xl font-semibold">Gewohnheitstier</h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-2 sm:ml-auto w-full sm:w-auto justify-around sm:justify-start">
          <a
            href="#/overview"
            onClick={(e) => {
              e.preventDefault();
              handleClick("#/overview");
            }}
            className={`px-3 py-2 rounded ${
              active === "#/overview" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
            }`}
            aria-current={active === "#/overview" ? "page" : undefined}
          >
            Übersicht
          </a>

          <a
            href="#/add"
            onClick={(e) => {
              e.preventDefault();
              handleClick("#/add");
            }}
            className={`px-3 py-2 rounded ${
              active === "#/add" ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
            }`}
            aria-current={active === "#/add" ? "page" : undefined}
          >
            Hinzufügen
          </a>
          <button className="btn btn-outline-secondary hidden sm:inline-block" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}