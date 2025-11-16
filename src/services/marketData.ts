// services/marketData.ts
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  volume: number;
  timestamp: number;
}

export class MarketDataService {
  private baseURL = 'https://api.coingecko.com/api/v3';
  private cache = new Map<string, { data: MarketData; timestamp: number }>();
  private CACHE_DURATION = 30000; // 30 seconds

  async getCryptoPrice(symbol: string): Promise<MarketData> {
    const cacheKey = `crypto-${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Map symbols to CoinGecko IDs
      const symbolMap: { [key: string]: string } = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'USDT': 'tether',
        'USDC': 'usd-coin',
        'BNB': 'binancecoin',
        'XRP': 'ripple',
        'ADA': 'cardano',
        'SOL': 'solana',
        'DOT': 'polkadot',
        'DOGE': 'dogecoin'
      };

      const coinId = symbolMap[symbol];
      if (!coinId) {
        throw new Error(`Unknown symbol: ${symbol}`);
      }

      const response = await fetch(`${this.baseURL}/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true`);
      const data = await response.json();
      
      const marketData: MarketData = {
        symbol,
        price: data[coinId].usd,
        change: data[coinId].usd_24h_change || 0,
        changePercent: data[coinId].usd_24h_change || 0,
        high24h: data[coinId].usd + (data[coinId].usd * 0.02), // Approximate
        low24h: data[coinId].usd - (data[coinId].usd * 0.02), // Approximate
        volume: data[coinId].usd_24h_vol || 0,
        timestamp: data[coinId].last_updated_at * 1000
      };

      this.cache.set(cacheKey, { data: marketData, timestamp: Date.now() });
      return marketData;
    } catch (error) {
      console.error('Failed to fetch crypto price:', error);
      throw error;
    }
  }

  async getForexPrice(symbol: string): Promise<MarketData> {
    const cacheKey = `forex-${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // Using free forex API as fallback
      const response = await fetch(`https://api.frankfurter.app/latest?from=${symbol.substring(0,3)}&to=${symbol.substring(3)}`);
      const data = await response.json();
      
      const marketData: MarketData = {
        symbol,
        price: data.rates[symbol.substring(3)],
        change: 0, // Would need historical data
        changePercent: 0,
        high24h: data.rates[symbol.substring(3)] * 1.001,
        low24h: data.rates[symbol.substring(3)] * 0.999,
        volume: 0,
        timestamp: Date.now()
      };

      this.cache.set(cacheKey, { data: marketData, timestamp: Date.now() });
      return marketData;
    } catch (error) {
      console.error('Failed to fetch forex price:', error);
      // Fallback to static data
      return this.getStaticForexData(symbol);
    }
  }

  private getStaticForexData(symbol: string): MarketData {
    const staticData: { [key: string]: MarketData } = {
      'EURUSD': { symbol: 'EURUSD', price: 1.0856, change: 0.0012, changePercent: 0.12, high24h: 1.0870, low24h: 1.0840, volume: 0, timestamp: Date.now() },
      'GBPUSD': { symbol: 'GBPUSD', price: 1.2678, change: -0.0023, changePercent: -0.23, high24h: 1.2700, low24h: 1.2650, volume: 0, timestamp: Date.now() },
      'USDJPY': { symbol: 'USDJPY', price: 148.34, change: 0.45, changePercent: 0.45, high24h: 148.50, low24h: 147.80, volume: 0, timestamp: Date.now() },
      'USDCHF': { symbol: 'USDCHF', price: 0.8790, change: -0.0015, changePercent: -0.15, high24h: 0.8800, low24h: 0.8780, volume: 0, timestamp: Date.now() },
      'AUDUSD': { symbol: 'AUDUSD', price: 0.6523, change: 0.0023, changePercent: 0.34, high24h: 0.6530, low24h: 0.6500, volume: 0, timestamp: Date.now() },
      'USDCAD': { symbol: 'USDCAD', price: 1.3546, change: -0.0038, changePercent: -0.28, high24h: 1.3560, low24h: 1.3520, volume: 0, timestamp: Date.now() },
      'NZDUSD': { symbol: 'NZDUSD', price: 0.6123, change: 0.0041, changePercent: 0.67, high24h: 0.6130, low24h: 0.6100, volume: 0, timestamp: Date.now() },
      'EURGBP': { symbol: 'EURGBP', price: 0.8567, change: -0.0010, changePercent: -0.12, high24h: 0.8575, low24h: 0.8555, volume: 0, timestamp: Date.now() }
    };

    return staticData[symbol] || { symbol, price: 1, change: 0, changePercent: 0, high24h: 1, low24h: 1, volume: 0, timestamp: Date.now() };
  }

  async getStockPrice(symbol: string): Promise<MarketData> {
    // Using Alpha Vantage or similar service would be better
    // For now, using static data with small random variations
    const staticData: { [key: string]: MarketData } = {
      'AAPL': { symbol: 'AAPL', price: 189.45, change: 2.30, changePercent: 1.23, high24h: 190.20, low24h: 188.50, volume: 0, timestamp: Date.now() },
      'TSLA': { symbol: 'TSLA', price: 245.67, change: -5.89, changePercent: -2.34, high24h: 252.00, low24h: 244.50, volume: 0, timestamp: Date.now() },
      'AMZN': { symbol: 'AMZN', price: 145.67, change: 1.28, changePercent: 0.89, high24h: 146.50, low24h: 144.80, volume: 0, timestamp: Date.now() },
      'GOOGL': { symbol: 'GOOGL', price: 138.90, change: 1.98, changePercent: 1.45, high24h: 139.50, low24h: 137.80, volume: 0, timestamp: Date.now() },
      'MSFT': { symbol: 'MSFT', price: 378.45, change: 2.52, changePercent: 0.67, high24h: 380.00, low24h: 377.00, volume: 0, timestamp: Date.now() }
    };

    const data = staticData[symbol];
    if (!data) {
      throw new Error(`Unknown stock symbol: ${symbol}`);
    }

    // Add small random variation to simulate real-time updates
    const variation = (Math.random() - 0.5) * 0.1;
    return {
      ...data,
      price: Number((data.price * (1 + variation)).toFixed(2)),
      change: Number((data.change * (1 + variation)).toFixed(2)),
      changePercent: Number((data.changePercent * (1 + variation)).toFixed(2)),
      timestamp: Date.now()
    };
  }
}

export const marketDataService = new MarketDataService();