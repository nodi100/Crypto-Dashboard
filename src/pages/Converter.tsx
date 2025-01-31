"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { useApi } from "@/hooks/useApi";

import { Input } from "@/components/input/Input";
import { Select } from "@/components/select/Select";
import { Button } from "@/components/button/Button";

export default function Converter() {
  const { cryptocurrencies } = useStore();
  const { convertCrypto } = useApi();

  const [fromCrypto, setFromCrypto] = useState("");
  const [toCrypto, setToCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropDownOptions = cryptocurrencies.map((item) => ({
    value: item.id,
    label: item.name,
  }));

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
      console.error(err);
      setError("An error occurred during conversion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Crypto Converter</h2>

      <form onSubmit={handleConvert} className="space-y-4">
        <div>
          <div className="mb-4">
            <Select
              options={dropDownOptions.filter(
                (item) => item.value !== toCrypto
              )}
              label="From"
              className="w-full p-2 border rounded-md"
              value={fromCrypto}
              onChange={(e) => setFromCrypto(e.target.value)}
              placeholder="Select cryptocurrency"
            />
          </div>

          <div>
            <Select
              options={dropDownOptions.filter(
                (item) => item.value !== fromCrypto
              )}
              label="To"
              className="w-full p-2 border rounded-md"
              value={toCrypto}
              onChange={(e) => setToCrypto(e.target.value)}
              placeholder="Select cryptocurrency"
            />
          </div>
        </div>
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0"
          step="any"
          className="w-full p-2 border rounded-md"
          placeholder="Enter amount"
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button
          label={loading ? "Converting..." : "Convert"}
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        />
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
