const express = require('express');
const cors    = require('cors');
const prisma  = require('./src/prisma');   // NEU: Prisma importiert
const app     = express();

app.use(cors());
app.use(express.json());

// Neue Route für den Browser-Aufruf
app.get('/', (req, res) => {
  res.send('Hello from your Express server!');
});

// Beispielroute, um Prisma zu testen:
app.get('/api/habits', async (req, res) => {
  try {
    const habits = await prisma.habits_table.findMany();  // <-- Prisma Query

    // BigInt-Felder in Strings umwandeln
    const serialized = habits.map(habit => ({
      ...habit,
      id: habit.id.toString(),
      streak: habit.streak?.toString(),
      father_id: habit.father_id?.toString(),
    }));

    res.json(serialized);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Prisma query failed' });
  }
});

// Deine bestehende API-Route
app.get('/api/hello', (req, res) => {
  res.json({ msg: 'Hello from Express!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => 
  console.log(`Server läuft auf http://0.0.0.0:${PORT}`)
);
