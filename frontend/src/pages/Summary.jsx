import { useState } from "react";
import { getMonthlySummary } from "../api";

export function Summary() {
  const accountId = 20; // or get from context
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    const data = await getMonthlySummary(accountId, year, month);
    setSummary(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white px-4 font-mono">
      <h2 className="text-2xl font-bold mb-4">Monthly Summary</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          className="px-2 py-1 rounded text-white bg-slate-800"
          min="2000"
          max="2100"
        />
        <input
          type="number"
          value={month}
          onChange={e => setMonth(Number(e.target.value))}
          className="px-2 py-1 rounded text-white bg-slate-800"
          min="1"
          max="12"
        />
        <button
          className="bg-blue-200 text-blue-900 px-4 py-2 rounded shadow hover:bg-blue-300 transition"
          onClick={fetchSummary}
          disabled={loading}
        >
          {loading ? "Loading..." : "Show Summary"}
        </button>
      </div>
      {summary && (
        <div className="bg-slate-800 rounded shadow p-4 w-full max-w-md">
          <div>Month: {summary.month}</div>
          <div>Starting Balance: ${summary.startingBalance.toFixed(2)}</div>
          <div>Ending Balance: ${summary.endingBalance.toFixed(2)}</div>
          <div>Total Deposited: ${summary.totalDeposited.toFixed(2)}</div>
          <div>Total Withdrawn: ${summary.totalWithdrawn.toFixed(2)}</div>
          <div>Number of Deposits: {summary.numDeposits}</div>
          <div>Number of Withdrawals: {summary.numWithdrawals}</div>
          <div>Largest Deposit: ${summary.largestDeposit.toFixed(2)}</div>
          <div>Largest Withdrawal: ${summary.largestWithdrawal.toFixed(2)}</div>
          <div>Average Deposit: ${summary.avgDeposit.toFixed(2)}</div>
          <div>Average Withdrawal: ${summary.avgWithdrawal.toFixed(2)}</div>
          <div>Net Change: ${summary.netChange.toFixed(2)}</div>
          <div>First Transaction: {summary.firstTransaction}</div>
          <div>Last Transaction: {summary.lastTransaction}</div>
        </div>
      )}
    </div>
  );
}