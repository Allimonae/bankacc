const bcrypt = require('bcrypt');

// Create Users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);

// Register a new user
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered', userId: this.lastID });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: 'Invalid credentials' });

    // In real use, you'd issue a token. For now, return userId.
    res.json({ message: 'Login successful', userId: user.id });
  });
});


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(process.env.DB_FILE);

// Create tables if they don't exist
db.run(`CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  owner TEXT NOT NULL,
  balance REAL NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
db.run(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id)
)`);

// Enable foreign key enforcement
db.run('PRAGMA foreign_keys = ON');

// API: Get account by ID
app.get('/api/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  getAccountById(id, (err, account) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  });
});

// Helper: Get account by ID
function getAccountById(id, callback) {
  db.get('SELECT * FROM accounts WHERE id = ?', [id], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

// API: Get all accounts
app.get('/api/accounts', (req, res) => {
  db.all('SELECT * FROM accounts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Create new account
app.post('/api/accounts', (req, res) => {
  const { owner, balance } = req.body;
  if (!owner || typeof balance !== 'number' || balance < 0) {
    return res.status(400).json({ error: 'Invalid owner or balance' });
  }
  db.run(
    'INSERT INTO accounts (owner, balance) VALUES (?, ?)',
    [owner, balance],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID, owner, balance });
    }
  );
});

// API: Deposit to account
app.post('/api/accounts/:id/deposit', (req, res) => {
  const id = parseInt(req.params.id);
  const { amount } = req.body;
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid deposit amount' });
  }
  getAccountById(id, (err, account) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    const newBalance = account.balance + amount;
    db.run('UPDATE accounts SET balance = ? WHERE id = ?', [newBalance, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.run(
        'INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)',
        [id, 'deposit', amount]
      );
      res.json({ id, owner: account.owner, balance: newBalance });
    });
  });
});

// API: Withdraw from account
app.post('/api/accounts/:id/withdraw', (req, res) => {
  const id = parseInt(req.params.id);
  const { amount } = req.body;
  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Invalid withdrawal amount' });
  }
  getAccountById(id, (err, account) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    if (account.balance < amount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }
    const newBalance = account.balance - amount;
    db.run('UPDATE accounts SET balance = ? WHERE id = ?', [newBalance, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
            db.run(
                'INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)',
                [id, 'withdrawal', amount],
                function (err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ id, owner: account.owner, balance: newBalance });
                }
            );
        });
    });
});

// API: Delete account
app.delete('/api/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.run('DELETE FROM accounts WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.run('DELETE FROM transactions WHERE account_id = ?', [id]);
    res.json({ success: true });
  });
});

// API: Get all transactions for an account, including running new_balance
// API: Get all transactions for an account, including running new_balance
app.get('/api/accounts/:id/transactions', (req, res) => {
  const id = parseInt(req.params.id);

  db.all(
    // Change ASC to DESC to get most recent transactions first
    'SELECT * FROM transactions WHERE account_id = ? ORDER BY created_at DESC, id DESC',
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      // Calculate running balance for each transaction
      db.get('SELECT balance FROM accounts WHERE id = ?', [id], (err, account) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!account) return res.status(404).json({ error: 'Account not found' });

        // Start from the current balance and work backwards
        let runningBalance = account.balance;
        // Copy and reverse to calculate backwards
        const reversed = [...rows].reverse();
        reversed.forEach(tx => {
          tx.new_balance = runningBalance;
          if (tx.type === 'deposit') {
            runningBalance -= tx.amount;
          } else if (tx.type === 'withdrawal') {
            runningBalance += tx.amount;
          }
        });
        // Reverse back to original order (which is now DESC)
        const withBalances = reversed.reverse();

        res.json(withBalances);
      });
    }
  );
});

// API: Delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.run('DELETE FROM transactions WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express + SQLite!' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
