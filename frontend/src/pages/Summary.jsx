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
        <div className="bg-slate-800 rounded shadow p-4 w-full max-w-md space-y-2">
        <div className="font-bold text-lg mb-2">Month: {summary.month}</div>
        
        <div className="flex justify-between">
            <span>Starting Balance:</span>
            <span className="font-mono">${summary.startingBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
            <span>Ending Balance:</span>
            <span className="font-mono">${summary.endingBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
            <span>Net Change:</span>
            <span className="font-mono">${summary.netChange.toFixed(2)}</span>
        </div>
        <hr className="my-2 border-slate-600" />

        <div className="flex justify-between">
            <span>Total Deposited:</span>
            <span className="font-mono text-green-400">${summary.totalDeposited.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
            <span>Number of Deposits:</span>
            <span>{summary.numDeposits}</span>
        </div>
        <div className="flex justify-between">
            <span>Largest Deposit:</span>
            <span className="font-mono">${summary.largestDeposit.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
            <span>Average Deposit:</span>
            <span className="font-mono">${summary.avgDeposit.toFixed(2)}</span>
        </div>
        <hr className="my-2 border-slate-600" />

        <div className="flex justify-between">
            <span>Total Withdrawn:</span>
            <span className="font-mono text-red-400">${summary.totalWithdrawn.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
            <span>Number of Withdrawals:</span>
            <span>{summary.numWithdrawals}</span>
        </div>
        <div className="flex justify-between">
            <span>Largest Withdrawal:</span>
            <span className="font-mono">${summary.largestWithdrawal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
            <span>Average Withdrawal:</span>
            <span className="font-mono">${summary.avgWithdrawal.toFixed(2)}</span>
        </div>
        <hr className="my-2 border-slate-600" />

        <div className="flex justify-between">
            <span>First Transaction:</span>
            <span>{summary.firstTransaction}</span>
        </div>
        <div className="flex justify-between">
            <span>Last Transaction:</span>
            <span>{summary.lastTransaction}</span>
        </div>
        </div>
      )}
    </div>
  );
}