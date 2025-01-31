import type { CryptoCurrency } from "@/types/cryptoTypes";

export interface TableProps {
  cryptocurrencies: CryptoCurrency[];
  onSort: (key: "name" | "price") => void;
  sortConfig: { key: "name" | "price" | null; direction: "asc" | "desc" };
}

export interface TableRowProps {
  crypto: CryptoCurrency;
}
