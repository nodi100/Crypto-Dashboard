import React from "react";
import CryptoCard from "./CryptoCard";
import type { CryptoCurrency } from "@/types/cryptoTypes";

type CryptoTableProps = {
  cryptocurrencies: CryptoCurrency[];
};

const CryptoTable = ({ cryptocurrencies }: CryptoTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Name</th>
            <th className="py-2 text-left">Symbol</th>
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">24h</th>
            <th className="py-2 text-right">7d</th>
            <th className="py-2 text-right">30d</th>
            <th className="py-2 text-right"></th>
          </tr>
        </thead>
        <tbody>
          {cryptocurrencies.map((crypto) => (
            <CryptoCard crypto={crypto} key={crypto.id} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;
