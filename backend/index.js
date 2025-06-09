require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(process.env.DB_FILE);

// Example: Create accounts table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner TEXT NOT NULL,
  balance REAL NOT NULL DEFAULT 0
)`);

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express + SQLite!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});