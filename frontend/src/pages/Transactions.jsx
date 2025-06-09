import { useEffect, useState } from "react";
import { getTransactions } from "../api";
import { useNavigate } from "react-router-dom";

export function Transactions() {
  const accountId = 20; // Hardcoded for now
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const data = await getTransactions(accountId, page, pageSize, filter);
      setTransactions(data.transactions || data); // fallback if not paginated
      setTotal(data.total || 0);
    }
    fetchData();
  }, [accountId, page, pageSize, filter]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white px-4 font-mono">
      <h2 className="text-2xl font-bold mb-4">Transactions for Account #{accountId}</h2>
      <button
        className="mb-4 bg-blue-200 text-blue-900 px-4 py-2 rounded shadow hover:bg-blue-300 transition"
        onClick={() => navigate("/actions")}
      >
        Withdraw or Deposit
      </button>
      <input
        className="mb-4 px-2 py-1 rounded text-black bg-white"
        placeholder="Filter by type or amount"
        value={filter}
        onChange={e => { setPage(1); setFilter(e.target.value); }}
      />
      <table className="bg-slate-800 rounded shadow w-full max-w-2xl mb-4">
        <thead>
          <tr>
            <th className="px-2 py-1">Date</th>
            <th className="px-2 py-1">Time</th>
            <th className="px-2 py-1">Type</th>
            <th className="px-2 py-1">Amount</th>
            <th className="px-2 py-1">Account</th>
            <th className="px-2 py-1">New Balance</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => (
            <tr
              key={tx.id}
              className={
                tx.type === "deposit"
                  ? "bg-green-100 text-green-900"
                  : tx.type === "withdrawal"
                  ? "bg-red-100 text-red-900"
                  : ""
              }
            >
              <td className="px-2 py-1">{new Date(tx.created_at).toLocaleDateString()}</td>
              <td className="px-2 py-1">{new Date(tx.created_at).toLocaleTimeString()}</td>
              <td className="px-2 py-1">{tx.type}</td>
              <td className="px-2 py-1">${tx.amount}</td>
              <td className="px-2 py-1">{tx.account_id}</td>
              <td className="px-2 py-1">
                {tx.new_balance !== undefined && tx.new_balance !== null
                  ? `$${tx.new_balance.toFixed(2)}`
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2">
        <button
          className="bg-green-200 text-green-900 px-3 py-1 rounded disabled:opacity-50"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >Prev</button>
        <span>Page {page}</span>
        <button
          className="bg-green-200 text-green-900 px-3 py-1 rounded disabled:opacity-50"
          onClick={() => setPage(p => p + 1)}
          disabled={transactions.length < pageSize}
        >Next</button>
      </div>
    </div>
  );
}