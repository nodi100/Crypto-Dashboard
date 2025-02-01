export type CryptoCurrency = {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  changePercent24Hr: string;
  changePercent7d: string;
  changePercent30d: string;
};

export type RateItem = {
  currencySymbol: string;
  id: string;
  rateUsd: string;
  symbol: string;
  type: string;
};

export type PriceChange = {
  changePercent7d: string;
  changePercent30d: string;
};

export type PriceUnit = {
  rateUsd: string;
  name: string;
  symbol: string;
};

export type ServerState = {
  topCryptos: CryptoCurrency[];
  changesMap: Map<string, PriceChange>;
};

export type CryptoState = {
  cryptocurrencies: CryptoCurrency[];
  priceChanges: Map<string, PriceChange> | null;
  rates: RateItem[];
  selectedPriceUnit: PriceUnit;
  initialized: boolean;
  loading: boolean;
  error: string | null;
  setCryptocurrencies: (
    data: CryptoCurrency[] | ((prev: CryptoCurrency[]) => CryptoCurrency[])
  ) => void;
  setPriceChanges: (data: Map<string, PriceChange>) => void;
  setRates: (data: RateItem[]) => void;
  setSelectedPriceUnit: (selectedPriceUnit: PriceUnit) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hydrate: (serverData: ServerState) => void;
};

export type HistoricalPriceItem = {
  date: Date;
  priceUsd: string;
  time: number;
};
