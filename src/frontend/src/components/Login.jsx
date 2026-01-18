import React, { useState } from 'react';

export default function Login({ onSubmit, switchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary1 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-primary3 mb-4">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary3 mb-1">E-Mail</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-primary3 mb-1">Passwort</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full py-2 rounded-md bg-primary3 text-white hover:bg-primary4 transition">
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <button className="text-sm text-primary3 hover:underline" onClick={switchToRegister}>
            Noch keinen Account? Registrieren
          </button>
        </div>
      </div>
    </div>
  );
}
