export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  priceNSE: number;
  priceBSE: number;
}

export interface Watchlist {
  id: string;
  name: string;
  stocks: Stock[];
}

const generateRandomStocks = (count: number, prefix: string): Stock[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${prefix}-stock-${i}`,
    symbol: `${prefix}${i}`,
    name: `${prefix} Company ${i}`,
    price: parseFloat((Math.random() * 2000 + 10).toFixed(2)),
    change: parseFloat((Math.random() * 50 - 25).toFixed(2)),
    changePercent: parseFloat((Math.random() * 5 - 2.5).toFixed(2)),
    priceNSE: parseFloat((Math.random() * 2000 + 10).toFixed(2)),
    priceBSE: parseFloat((Math.random() * 2000 + 10).toFixed(2)),
  }));
};

export const dummyWatchlists: Watchlist[] = [
  { id: 'wl-1', name: 'Nifty 50', stocks: generateRandomStocks(50, 'NIFTY') },
  { id: 'wl-2', name: 'Bank Nifty', stocks: generateRandomStocks(20, 'BANK') },
  { id: 'wl-3', name: 'Tech Giants', stocks: generateRandomStocks(15, 'TECH') },
  { id: 'wl-4', name: 'Massive List', stocks: generateRandomStocks(450, 'MASS') }, // To test virtualization
  { id: 'wl-5', name: 'Auto Sector', stocks: generateRandomStocks(10, 'AUTO') },
  { id: 'wl-6', name: 'Metals', stocks: generateRandomStocks(8, 'MTL') },
];
