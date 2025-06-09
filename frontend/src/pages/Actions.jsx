import { useState, useEffect } from "react";
import { getAccount, deposit, withdraw } from "../api";
import { useNavigate } from "react-router-dom";

export function Actions() {
  const [accountId] = useState(21); // Change as needed for other accounts
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch account balance on mount and after actions
  const fetchBalance = async () => {
    const data = await getAccount(accountId);
    setBalance(data.balance);
  };

  useEffect(() => {
    fetchBalance();
  }, [accountId]);

  // Only allow positive numbers with up to 2 decimals
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setAmount(value);
    }
  };

  const handleAction = async (type) => {
    setLoading(true);
    setMessage(null);
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setMessage({ type: "error", text: "Please enter a positive amount." });
      setLoading(false);
      return;
    }
    try {
      const fn = type === "deposit" ? deposit : withdraw;
      const res = await fn(accountId, amt);
      if (res.error) {
        setMessage({ type: "error", text: res.error });
      } else {
        setMessage({ type: "success", text: `${type === "deposit" ? "Deposited" : "Withdrew"} $${amt.toFixed(2)} successfully.` });
        setAmount(""); // Clear input on success
        fetchBalance(); // Update balance
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong." });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white px-4 font-mono">
      <h2 className="text-2xl font-bold mb-4">Account Actions</h2>
      <div className="mb-4 text-lg">
        Current Balance:{" "}
        {balance !== null ? (
          <span className="font-mono">${balance.toFixed(2)}</span>
        ) : (
          "Loading..."
        )}
      </div>
      <input
        className="mb-2 px-3 py-2 rounded text-black w-40 bg-white"
        type="number"
        min="0"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={handleAmountChange}
        disabled={loading}
      />
      <div className="flex gap-4 mb-4">
        <button
          className="bg-green-200 text-green-900 px-4 py-2 rounded shadow hover:bg-green-300 transition disabled:opacity-50"
          onClick={() => handleAction("deposit")}
          disabled={loading}
        >
          Deposit
        </button>
        <button
          className="bg-red-200 text-red-900 px-4 py-2 rounded shadow hover:bg-red-300 transition disabled:opacity-50"
          onClick={() => handleAction("withdraw")}
          disabled={loading}
        >
          Withdraw
        </button>
      </div>
      {message && (
        <div
          className={`mb-2 px-4 py-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-900"
              : "bg-red-100 text-red-900"
          }`}
        >
          {message.text}
        </div>
      )}
    <button
        className="mt-2 bg-blue-200 text-blue-900 px-4 py-2 rounded shadow hover:bg-blue-300 transition"
        onClick={() => navigate("/transactions")}
      >
        View Transaction History
      </button>
    </div>
  );
}