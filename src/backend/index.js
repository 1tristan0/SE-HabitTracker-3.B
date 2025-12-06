//src/backend/index.js
const express = require('express');
const cors = require('cors'); // CORS-Middleware importieren um Frontend mit Backend kommunizieren zu lassen
const habitsRouter = require('./src/routes/habits');
const authRouter = require('./src/routes/auth');

const app = express();

const allowedOrigins = process.env.CORS_ORIGINS // Kommagetrennte Liste von erlaubten Origins
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim()) // Leerzeichen entfernen
  : ['http://localhost:5173', 'http://localhost:3000']; // erlaubt Anfragen von diesen Ports im Localhost
app.use( 
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Erlaubte HTTP-Methoden
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Erlaubte Header
  })
);
app.use(express.json()); // Middleware zum übersetzten von JSON-Anfragen


// Basis-Route liefert uns eine Statusmeldung
app.get('/', (_req, res) => { 
  res.send('Habit Tracker API is running');
});

app.use('/api/auth', authRouter); // Auth-Routen
app.use('/api/habits', habitsRouter); // Habits-Routen



// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server läuft auf http://0.0.0.0:${PORT}`)
);
