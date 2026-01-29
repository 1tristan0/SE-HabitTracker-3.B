import React, { useState } from 'react';
import InputField from '../ui/InputField';

export default function Signup({ onSubmit, switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Wenn das Formular abgeschickt wird
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary1 p-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-primary3 mb-4">Registrieren</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputField
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="w-full py-2 rounded-md bg-primary3 text-white hover:bg-primary4 transition">
            Registrieren
          </button>
        </form>

        <div className="text-center mt-4">
          <button className="text-sm text-primary3 hover:underline" onClick={switchToLogin}>
            Schon registriert? Login
          </button>
        </div>
      </div>
    </div>
  );
}
