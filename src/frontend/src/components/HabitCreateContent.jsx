import { useState } from "react";

export default function HabitCreateContent({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return; // simple Validation

    if (onSubmit) {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Optional: Navbar-Höhe freilassen, falls ihr eine habt */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          {/* Kopfbereich */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Neue Gewohnheit erstellen
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Gib deiner Gewohnheit einen klaren Namen und eine kurze Beschreibung.
              </p>
            </div>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 transition"
              >
                ⟵ Zurück zur Übersicht
              </button>
            )}
          </div>

          {/* Inhalt */}
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* Formular-Card */}
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white shadow-sm border border-slate-200 px-6 py-6 space-y-6"
            >
              {/* Name */}
              <div className="space-y-2">
                <label
                  htmlFor="habit-name"
                  className="block text-sm font-medium text-slate-800"
                >
                  Name der Gewohnheit
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <input
                  id="habit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z. B. 10 Minuten lesen"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
                <p className="text-xs text-slate-500">
                  Halte den Namen kurz und eindeutig – so erkennst du die Gewohnheit später
                  in der Übersicht auf einen Blick.
                </p>
              </div>

              {/* Beschreibung */}
              <div className="space-y-2">
                <label
                  htmlFor="habit-description"
                  className="block text-sm font-medium text-slate-800"
                >
                  Beschreibung
                </label>
                <textarea
                  id="habit-description"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Was genau möchtest du tun? Wann, wie oft, zu welcher Tageszeit…?"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
                <p className="text-xs text-slate-500">
                  Optional, aber hilfreich, um dir selbst die Gewohnheit klarer zu machen.
                </p>
              </div>

              {/* Aktionen */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-xs text-slate-400">
                  Felder mit <span className="text-red-500">*</span> sind erforderlich.
                </p>
                <div className="flex gap-2">
                  {onCancel && (
                    <button
                      type="button"
                      onClick={onCancel}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                    >
                      Abbrechen
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!name.trim()}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60 transition"
                  >
                    Hinzufügen
                  </button>
                </div>
              </div>
            </form>

            {/* Tipp- / Info-Card (rechte Seite) */}
            <aside className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-5 space-y-3 text-sm text-slate-700">
              <h2 className="text-sm font-semibold text-slate-800">
                Tipps für gute Gewohnheiten
              </h2>
              <ul className="space-y-2 text-xs leading-relaxed">
                <li>
                  • Formuliere die Gewohnheit positiv:
                  <span className="font-medium"> „Mehr Wasser trinken“</span> statt
                  „Keine Softdrinks“.
                </li>
                <li>
                  • Mach sie klein und machbar –{" "}
                  <span className="font-medium">5 Minuten Bewegung</span> sind besser als
                  gar keine.
                </li>
                <li>
                  • Verknüpfe sie mit einem Auslöser, z. B.{" "}
                  <span className="font-medium">„nach dem Zähneputzen“</span>.
                </li>
                <li>
                  • Je klarer Name & Beschreibung, desto besser kann unser Tracker dir
                  Fortschritt anzeigen. 🔁
                </li>
              </ul>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
