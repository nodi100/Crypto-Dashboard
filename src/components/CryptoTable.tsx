import React from "react";
import CryptoCard from "./CryptoCard";
import type { CryptoCurrency } from "@/types/cryptoTypes";

type CryptoTableProps = {
  cryptocurrencies: CryptoCurrency[];
  onSort: (key: "name" | "price") => void;
  sortConfig: { key: "name" | "price" | null; direction: "asc" | "desc" };
};

const CryptoTable = ({
  cryptocurrencies,
  onSort,
  sortConfig,
}: CryptoTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th
              onClick={() => onSort("name")}
              className="cursor-pointer py-2 text-left hover:bg-gray-50"
            >
              Name{" "}
              {sortConfig.key === "name" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
            <th className="py-2 text-left">Symbol</th>
            <th
              onClick={() => onSort("price")}
              className="cursor-pointer py-2 text-right hover:bg-gray-50"
            >
              Price{" "}
              {sortConfig.key === "price" &&
                (sortConfig.direction === "asc" ? "↑" : "↓")}
            </th>
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
