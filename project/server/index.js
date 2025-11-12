const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

// Neue Route für den Browser-Aufruf
app.get('/', (req, res) => {
  res.send('Hello from your Express server!');
});

// Deine bestehende API-Route
app.get('/api/hello', (req, res) => {
  res.json({ msg: 'Hello from Express!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => 
  console.log(`Server läuft auf http://0.0.0.0:${PORT}`)
);
