export interface CryptoCurrency {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr: string;
  changePercent7d: string;
  changePercent30d: string;
}

export interface PriceChange {
  id: string;
  changePercent7d: string;
  changePercent30d: string;
}

export interface CryptoState {
  cryptocurrencies: CryptoCurrency[];
  priceChanges: Map<string, PriceChange> | null;
  loading: boolean;
  error: string | null;
  setCryptocurrencies: (
    data: CryptoCurrency[] | ((prev: CryptoCurrency[]) => CryptoCurrency[])
  ) => void;
  setPriceChanges: (data: Map<string, PriceChange>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export interface HistoricalPriceItem {
  date: Date;
  priceUsd: string;
  time: number;
}
