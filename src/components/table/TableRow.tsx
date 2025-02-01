import React from "react";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { TableRowProps } from "./types";

const TableRow = ({ crypto }: TableRowProps) => {
  const { selectedPriceUnit } = useStore();

  const price = Number(crypto.priceUsd) / Number(selectedPriceUnit.rateUsd);
  return (
    <tr key={crypto.id} className="border-b">
      <td className="p-2">
        <div className="flex items-center">
          <span className="font-medium">{crypto.name}</span>
        </div>
      </td>
      <td className="p-2">
        <div className="flex items-center">
          <span className="text-gray-500 ml-2">{crypto.symbol}</span>
        </div>
      </td>
      <td className="p-2 text-right">
        {selectedPriceUnit.symbol}
        {price.toFixed(2)}
      </td>
      <td
        className={`p-2 text-right ${
          parseFloat(crypto.changePercent24Hr) > 0
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {parseFloat(crypto.changePercent24Hr).toFixed(2)}%
      </td>
      <td
        className={`p-2 text-right ${
          parseFloat(crypto.changePercent7d) > 0
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {parseFloat(crypto.changePercent7d).toFixed(2)}%
      </td>
      <td
        className={`p-2 text-right ${
          parseFloat(crypto.changePercent30d) > 0
            ? "text-green-500"
            : "text-red-500"
        }`}
      >
        {parseFloat(crypto.changePercent30d).toFixed(2)}%
      </td>
      <td className="p-2 text-right ">
        <Link
          href={`/history/${crypto.id}`}
          className="text-sm underline cursor-pointer hover:text-blue-700 transition-colors"
        >
          Details
        </Link>
      </td>
    </tr>
  );
};

export default TableRow;
