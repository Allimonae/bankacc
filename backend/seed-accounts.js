require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(process.env.DB_FILE);

const accounts = [
  { owner: 'Alice', balance: 100 },
  { owner: 'Bob', balance: 200 },
  { owner: 'Charlie', balance: 300 },
  { owner: 'Diana', balance: 400 }
];

db.serialize(() => {
  accounts.forEach(acc => {
    db.run(
      'INSERT INTO accounts (owner, balance) VALUES (?, ?)',
      [acc.owner, acc.balance],
      function (err) {
        if (err) {
          console.error(`Error inserting ${acc.owner}:`, err.message);
        } else {
          console.log(`Inserted account for ${acc.owner} with id ${this.lastID}`);
        }
      }
    );
  });
});

db.close();