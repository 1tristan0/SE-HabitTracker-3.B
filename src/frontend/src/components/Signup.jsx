import React, { useState } from 'react';

export default function Signup({ onSubmit, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary1 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-primary4 mb-4">Registrieren</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary4 mb-1">E-Mail</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary4 mb-1">Passwort</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full py-2 rounded-md bg-primary4 text-white hover:bg-primary3 transition">
            Registrieren
          </button>
        </form>

        <div className="text-center mt-4">
          <button className="text-sm text-primary4 hover:underline" onClick={switchToLogin}>
            Schon registriert? Login
          </button>
        </div>
      </div>
    </div>
  );
}
