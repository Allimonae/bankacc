// Example: src/components/ApiDemoButtons.jsx
import { useState } from 'react';
import { getAccounts, createAccount, deposit, withdraw } from '../api';

export function ApiDemoButtons() {
  const [result, setResult] = useState(null);

  return (
    <div className="bg-green-100 text-gray-900 p-4 rounded shadow mt-6 flex flex-col gap-2 w-full max-w-md">
      <button className="api-demo-button bg-white text-green-900 px-4 py-2 rounded shadow hover:bg-green-200 transition"
        onClick={async () => setResult(await getAccounts())}>
        Get Accounts
      </button>
      <button className="api-demo-button bg-white text-green-900 px-4 py-2 rounded shadow hover:bg-green-200 transition"
        onClick={async () => setResult(await createAccount('Sample User', 100))}>
        Create Account
      </button>
      <button className="api-demo-button bg-white text-green-900 px-4 py-2 rounded shadow hover:bg-green-200 transition"
        onClick={async () => setResult(await deposit(1, 50))}>
        Deposit $50 to Account 1
      </button>
      <button className="api-demo-button bg-white text-green-900 px-4 py-2 rounded shadow hover:bg-green-200 transition"
        onClick={async () => setResult(await withdraw(1, 20))}>
        Withdraw $20 from Account 1
      </button>
      <pre className="bg-green-50 text-xs rounded p-2 mt-2 overflow-x-auto">{result && JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}