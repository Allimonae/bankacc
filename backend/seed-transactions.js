require('dotenv').config();
const fetch = require('node-fetch'); // npm install node-fetch@2

const API_URL = `http://localhost:${process.env.PORT || 8080}`;

const transactions = [
  { account_id: 1, type: 'deposit', amount: 75 },
  { account_id: 1, type: 'withdrawal', amount: 10 },
  { account_id: 2, type: 'deposit', amount: 150 },
  { account_id: 2, type: 'withdrawal', amount: 60 },
  { account_id: 3, type: 'deposit', amount: 300 },
  { account_id: 3, type: 'withdrawal', amount: 120 },
  { account_id: 4, type: 'deposit', amount: 80 },
  { account_id: 4, type: 'withdrawal', amount: 40 },
  { account_id: 4, type: 'withdrawal', amount: 40 }
];

async function seedTransactions() {
  for (const tx of transactions) {
    const endpoint =
      tx.type === 'deposit'
        ? `/api/accounts/${tx.account_id}/deposit`
        : `/api/accounts/${tx.account_id}/withdraw`;

    try {
      const res = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: tx.amount })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`Success: ${tx.type} $${tx.amount} for account ${tx.account_id}`);
      } else {
        console.error(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error(`Request failed for account ${tx.account_id}:`, err.message);
    }
  }
}

seedTransactions();