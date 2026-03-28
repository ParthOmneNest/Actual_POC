export interface PortfolioAsset {
  name: string;
  symbol: string;
  total: number;
  value: number;
}

export const portfolioData: PortfolioAsset[] = [
  { name: "Bitcoin",   symbol: "BTC",  total: 1.5,    value: 97500.00  },
  { name: "Ethereum",  symbol: "ETH",  total: 10,     value: 32000.00  },
  { name: "Solana",    symbol: "SOL",  total: 50,     value: 7500.00   },
  { name: "Cardano",   symbol: "ADA",  total: 5000,   value: 2250.00   },
  { name: "Dogecoin",  symbol: "DOGE", total: 20000,  value: 3400.00   },
  { name: "Ripple",    symbol: "XRP",  total: 8000,   value: 4800.00   },
  { name: "Polkadot",  symbol: "DOT",  total: 300,    value: 2100.00   },
  { name: "Chainlink", symbol: "LINK", total: 400,    value: 5600.00   },
  { name: "Avalanche", symbol: "AVAX", total: 60,     value: 2220.00   },
  { name: "Shiba", symbol: "SHIB", total: 1000000,value: 1100.00   },
];
