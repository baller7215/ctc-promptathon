export const STOCKS_METADATA = {
  "AAPL": { name: "Apple Inc.", type: "Stock", sector: "Technology", risk: "Medium" },
  "MSFT": { name: "Microsoft Corp.", type: "Stock", sector: "Technology", risk: "Low" },
  "TSLA": { name: "Tesla, Inc.", type: "Stock", sector: "Consumer Discretionary", risk: "High" },
  "VOO": { name: "Vanguard S&P 500 ETF", type: "ETF", sector: "Broad Market", risk: "Low" },
  "QQQ": { name: "Invesco QQQ Trust", type: "ETF", sector: "Technology", risk: "Medium" },
  "VTI": { name: "Vanguard Total Stock Market ETF", type: "ETF", sector: "Broad Market", risk: "Low" },
  "SCHD": { name: "Schwab US Dividend Equity ETF", type: "ETF", sector: "Broad Market", risk: "Low" },
  "NVDA": { name: "NVIDIA Corp.", type: "Stock", sector: "Technology", risk: "High" },
  "AMZN": { name: "Amazon.com, Inc.", type: "Stock", sector: "Consumer Discretionary", risk: "Medium" },
  "GOOGL": { name: "Alphabet Inc.", type: "Stock", sector: "Technology", risk: "Medium" },
  "BRK.B": { name: "Berkshire Hathaway Inc.", type: "Stock", sector: "Financials", risk: "Low" },
  "JPM": { name: "JPMorgan Chase & Co.", type: "Stock", sector: "Financials", risk: "Medium" },
  "JNJ": { name: "Johnson & Johnson", type: "Stock", sector: "Healthcare", risk: "Low" },
  "PG": { name: "Procter & Gamble Co.", type: "Stock", sector: "Consumer Staples", risk: "Low" },
  "XOM": { name: "Exxon Mobil Corp.", type: "Stock", sector: "Energy", risk: "Medium" }
};

export const DEMO_PORTFOLIOS = [
  {
    id: 'beginner-etf',
    name: 'Beginner ETF Portfolio',
    description: 'A diversified, lower-risk portfolio focused on broad market index funds.',
    holdings: [
      { ticker: 'VOO', shares: 5, avgPrice: 450 },
      { ticker: 'SCHD', shares: 10, avgPrice: 75 },
      { ticker: 'VTI', shares: 3, avgPrice: 250 }
    ]
  },
  {
    id: 'risky-tech',
    name: 'High-Concentration Tech',
    description: 'Focused heavily on technology and high-growth individual stocks.',
    holdings: [
      { ticker: 'TSLA', shares: 20, avgPrice: 180 },
      { ticker: 'NVDA', shares: 10, avgPrice: 900 },
      { ticker: 'AAPL', shares: 5, avgPrice: 190 }
    ]
  },
  {
    id: 'tiktok-random',
    name: 'Random Social Media Picks',
    description: 'A mix of trending stocks often discussed on social platforms.',
    holdings: [
      { ticker: 'TSLA', shares: 5, avgPrice: 200 },
      { ticker: 'AMC', shares: 100, avgPrice: 5 },
      { ticker: 'GME', shares: 50, avgPrice: 20 },
      { ticker: 'NVDA', shares: 2, avgPrice: 850 }
    ]
  }
];
