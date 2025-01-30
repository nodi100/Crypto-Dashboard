"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useApi } from "@/hooks/useApi";

export default function Converter() {
  const { cryptocurrencies } = useStore();
  const { convertCrypto } = useApi();

  const [fromCrypto, setFromCrypto] = useState("");
  const [toCrypto, setToCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromCrypto || !toCrypto || !amount) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const convertedAmount = await convertCrypto(
        fromCrypto,
        toCrypto,
        parseFloat(amount)
      );

      if (convertedAmount !== null) {
        setResult(convertedAmount);
      } else {
        setError("Conversion failed");
      }
    } catch (err) {
      setError("An error occurred during conversion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Crypto Converter</h2>

      <form onSubmit={handleConvert} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <select
              value={fromCrypto}
              onChange={(e) => setFromCrypto(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select cryptocurrency</option>
              {cryptocurrencies.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <select
              value={toCrypto}
              onChange={(e) => setToCrypto(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select cryptocurrency</option>
              {cryptocurrencies.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="any"
            className="w-full p-2 border rounded-md"
            placeholder="Enter amount"
          />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Converting..." : "Convert"}
        </button>

        {result !== null && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium mb-2">Result:</h3>
            <p>
              {amount} {fromCrypto.toUpperCase()} = {result.toFixed(8)}{" "}
              {toCrypto.toUpperCase()}
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
