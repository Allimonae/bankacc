require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database(process.env.DB_FILE);

// --- Table Creation ---
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);
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
db.run('PRAGMA foreign_keys = ON');

// --- Helper Functions ---
function getAccountById(id, callback) {
  db.get('SELECT * FROM accounts WHERE id = ?', [id], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

// --- User Authentication ---
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
    res.json({ message: 'Login successful', userId: user.id });
  });
});

// --- Account APIs ---
app.get('/api/accounts', (req, res) => {
  db.all('SELECT * FROM accounts', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  getAccountById(id, (err, account) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    res.json(account);
  });
});

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
      const accountId = this.lastID;
      if (balance > 0) {
        db.run(
          'INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)',
          [accountId, 'deposit', balance],
          function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: accountId, owner, balance });
          }
        );
      } else {
        res.json({ id: accountId, owner, balance });
      }
    }
  );
});

app.delete('/api/accounts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.run('DELETE FROM accounts WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.run('DELETE FROM transactions WHERE account_id = ?', [id]);
    res.json({ success: true });
  });
});

// --- Transaction APIs ---
app.get('/api/accounts/:id/transactions', (req, res) => {
  const id = parseInt(req.params.id);
  db.all(
    'SELECT * FROM transactions WHERE account_id = ? ORDER BY created_at ASC, id ASC',
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      db.get('SELECT balance FROM accounts WHERE id = ?', [id], (err, account) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!account) return res.status(404).json({ error: 'Account not found' });
        let runningBalance = account.balance;
        const reversed = [...rows].reverse();
        reversed.forEach(tx => {
          tx.new_balance = runningBalance;
          if (tx.type === 'deposit') {
            runningBalance -= tx.amount;
          } else if (tx.type === 'withdrawal') {
            runningBalance += tx.amount;
          }
        });
        const withBalances = reversed.reverse();
        res.json(withBalances);
      });
    }
  );
});

app.delete('/api/transactions/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.run('DELETE FROM transactions WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Deposit
app.post('/api/accounts/:id/deposit', (req, res) => {
  const id = parseInt(req.params.id);
  const { amount } = req.body;
  db.get('SELECT * FROM accounts WHERE id = ?', [id], (err, account) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Invalid deposit amount' });
    }
    const newBalance = account.balance + amount;
    db.run('UPDATE accounts SET balance = ? WHERE id = ?', [newBalance, id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      db.run(
        'INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)',
        [id, 'deposit', amount],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id, owner: account.owner, balance: newBalance });
        }
      );
    });
  });
});

// Withdraw
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

app.get('/api/accounts/:id/summary/:year/:month', (req, res) => {
  const id = parseInt(req.params.id);
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);

  // Get account creation time
  db.get('SELECT created_at FROM accounts WHERE id = ?', [id], (err, account) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!account) return res.status(404).json({ error: 'Account not found' });
    const accountCreatedAt = account.created_at;

    db.all(
      `SELECT * FROM transactions WHERE account_id = ? AND strftime('%Y', created_at) = ? AND strftime('%m', created_at) = ? ORDER BY created_at ASC, id ASC`,
      [id, year.toString(), month.toString().padStart(2, '0')],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Filter out the initial deposit (transaction at account creation time)
        const filteredRows = rows.filter(tx => tx.created_at !== accountCreatedAt);

        // Calculate summary as before, but use filteredRows
        let totalDeposited = 0, totalWithdrawn = 0;
        let numDeposits = 0, numWithdrawals = 0;
        let largestDeposit = 0, largestWithdrawal = 0;
        let sumDeposit = 0, sumWithdrawal = 0;
        let firstDate = null, lastDate = null;

        filteredRows.forEach(tx => {
          if (!firstDate) firstDate = tx.created_at;
          lastDate = tx.created_at;
          if (tx.type === 'deposit') {
            totalDeposited += tx.amount;
            numDeposits++;
            sumDeposit += tx.amount;
            if (tx.amount > largestDeposit) largestDeposit = tx.amount;
          } else if (tx.type === 'withdrawal') {
            totalWithdrawn += tx.amount;
            numWithdrawals++;
            sumWithdrawal += tx.amount;
            if (tx.amount > largestWithdrawal) largestWithdrawal = tx.amount;
          }
        });

        // Get starting balance as before
        db.all(
          `SELECT * FROM transactions WHERE account_id = ? AND created_at < ? ORDER BY created_at ASC, id ASC`,
          [id, `${year}-${month.toString().padStart(2, '0')}-01 00:00:00`],
          (err, allRows) => {
            if (err) return res.status(500).json({ error: err.message });

            db.get('SELECT balance FROM accounts WHERE id = ?', [id], (err, account) => {
              if (err) return res.status(500).json({ error: err.message });
              if (!account) return res.status(404).json({ error: 'Account not found' });

              let runningBalance = account.balance;
              const reversed = [...allRows].reverse();
              reversed.forEach(tx => {
                if (tx.type === 'deposit') runningBalance -= tx.amount;
                else if (tx.type === 'withdrawal') runningBalance += tx.amount;
              });
              const startingBalance = runningBalance;
              const endingBalance = startingBalance + totalDeposited - totalWithdrawn;

              res.json({
                month: `${year}-${month.toString().padStart(2, '0')}`,
                startingBalance,
                endingBalance,
                totalDeposited,
                totalWithdrawn,
                numDeposits,
                numWithdrawals,
                largestDeposit,
                largestWithdrawal,
                avgDeposit: numDeposits ? sumDeposit / numDeposits : 0,
                avgWithdrawal: numWithdrawals ? sumWithdrawal / numWithdrawals : 0,
                netChange: endingBalance - startingBalance,
                firstTransaction: firstDate,
                lastTransaction: lastDate,
              });
            });
          }
        );
      }
    );
  });
});

// --- Miscellaneous ---
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express + SQLite!' });
});

// --- Start Server ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});