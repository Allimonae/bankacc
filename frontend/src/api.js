const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export async function getAccounts() {
  const res = await fetch(`${API_URL}/api/accounts`);
  return res.json();
}

export async function getAccount(id) {
  const res = await fetch(`${API_URL}/api/accounts/${id}`);
  return res.json();
}

export async function createAccount(owner, balance) {
  const res = await fetch(`${API_URL}/api/accounts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ owner, balance }),
  });
  return res.json();
}

export async function deposit(id, amount) {
  const res = await fetch(`${API_URL}/api/accounts/${id}/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}

export async function withdraw(id, amount) {
  const res = await fetch(`${API_URL}/api/accounts/${id}/withdraw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  return res.json();
}