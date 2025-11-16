// Trading.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { apiService, type Asset } from '../services/api';

// Types for API responses
interface CoinGeckoMarketData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

// Enhanced base assets with API mapping
const baseAssetsData = {
  crypto: [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', type: 'crypto', coingecko_id: 'bitcoin', original_price: 45000, change_percentage: 2.34, moving_average: 44210.50, trend: 'up', chart_url: '#', hourly_income: 120.00, min_investment: 600, duration: 20, tradingViewSymbol: 'BINANCE:BTCUSDT' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', type: 'crypto', coingecko_id: 'ethereum', original_price: 3000, change_percentage: 1.23, moving_average: 2950.20, trend: 'up', chart_url: '#', hourly_income: 95.00, min_investment: 500, duration: 12, tradingViewSymbol: 'BINANCE:ETHUSDT' },
    { id: 'tether', name: 'Tether', symbol: 'USDT', type: 'crypto', coingecko_id: 'tether', original_price: 1.00, change_percentage: 0.01, moving_average: 1.00, trend: 'up', chart_url: '#', hourly_income: 90.00, min_investment: 450, duration: 6, tradingViewSymbol: 'BINANCE:USDTUSD' },
    { id: 'usd-coin', name: 'USD Coin', symbol: 'USDC', type: 'crypto', coingecko_id: 'usd-coin', original_price: 1.00, change_percentage: 0.02, moving_average: 1.00, trend: 'up', chart_url: '#', hourly_income: 110.00, min_investment: 550, duration: 10, tradingViewSymbol: 'BINANCE:USDCUSD' },
    { id: 'binance-coin', name: 'Binance Coin', symbol: 'BNB', type: 'crypto', coingecko_id: 'binancecoin', original_price: 312.67, change_percentage: -0.45, moving_average: 315.20, trend: 'down', chart_url: '#', hourly_income: 100.00, min_investment: 500, duration: 4, tradingViewSymbol: 'BINANCE:BNBUSDT' },
    { id: 'ripple', name: 'Ripple', symbol: 'XRP', type: 'crypto', coingecko_id: 'ripple', original_price: 0.6234, change_percentage: 3.21, moving_average: 0.6012, trend: 'up', chart_url: '#', hourly_income: 95.00, min_investment: 475, duration: 6, tradingViewSymbol: 'BINANCE:XRPUSDT' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', type: 'crypto', coingecko_id: 'cardano', original_price: 0.4523, change_percentage: 1.89, moving_average: 0.4456, trend: 'up', chart_url: '#', hourly_income: 105.00, min_investment: 525, duration: 10, tradingViewSymbol: 'BINANCE:ADAUSDT' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', type: 'crypto', coingecko_id: 'solana', original_price: 98.76, change_percentage: 4.56, moving_average: 94.32, trend: 'up', chart_url: '#', hourly_income: 135.00, min_investment: 600, duration: 12, tradingViewSymbol: 'BINANCE:SOLUSDT' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', type: 'crypto', coingecko_id: 'polkadot', original_price: 6.78, change_percentage: -1.23, moving_average: 6.85, trend: 'down', chart_url: '#', hourly_income: 90.00, min_investment: 450, duration: 4, tradingViewSymbol: 'BINANCE:DOTUSDT' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', type: 'crypto', coingecko_id: 'dogecoin', original_price: 0.0789, change_percentage: 5.67, moving_average: 0.0745, trend: 'up', chart_url: '#', hourly_income: 92.50, min_investment: 400, duration: 6, tradingViewSymbol: 'BINANCE:DOGEUSDT' }
  ],
  forex: [
    { id: 'eur-usd', name: 'EUR/USD', symbol: 'EURUSD', type: 'forex', forex_symbol: 'EURUSD', original_price: 1.0856, change_percentage: 0.12, moving_average: 1.0845, trend: 'up', chart_url: '#', hourly_income: 125.00, min_investment: 600, duration: 10, tradingViewSymbol: 'FX:EURUSD' },
    { id: 'gbp-usd', name: 'GBP/USD', symbol: 'GBPUSD', type: 'forex', forex_symbol: 'GBPUSD', original_price: 1.2678, change_percentage: -0.23, moving_average: 1.2690, trend: 'down', chart_url: '#', hourly_income: 150.00, min_investment: 600, duration: 12, tradingViewSymbol: 'FX:GBPUSD' },
    { id: 'usd-jpy', name: 'USD/JPY', symbol: 'USDJPY', type: 'forex', forex_symbol: 'USDJPY', original_price: 148.34, change_percentage: 0.45, moving_average: 147.89, trend: 'up', chart_url: '#', hourly_income: 165.00, min_investment: 600, duration: 20, tradingViewSymbol: 'FX:USDJPY' },
    { id: 'usd-chf', name: 'USD/CHF', symbol: 'USDCHF', type: 'forex', forex_symbol: 'USDCHF', original_price: 0.8790, change_percentage: -0.15, moving_average: 0.8795, trend: 'down', chart_url: '#', hourly_income: 130.00, min_investment: 550, duration: 12, tradingViewSymbol: 'FX:USDCHF' },
    { id: 'aud-usd', name: 'AUD/USD', symbol: 'AUDUSD', type: 'forex', forex_symbol: 'AUDUSD', original_price: 0.6523, change_percentage: 0.34, moving_average: 0.6510, trend: 'up', chart_url: '#', hourly_income: 115.00, min_investment: 500, duration: 10, tradingViewSymbol: 'FX:AUDUSD' },
    { id: 'usd-cad', name: 'USD/CAD', symbol: 'USDCAD', type: 'forex', forex_symbol: 'USDCAD', original_price: 1.3546, change_percentage: -0.28, moving_average: 1.3555, trend: 'down', chart_url: '#', hourly_income: 140.00, min_investment: 600, duration: 12, tradingViewSymbol: 'FX:USDCAD' },
    { id: 'nzd-usd', name: 'NZD/USD', symbol: 'NZDUSD', type: 'forex', forex_symbol: 'NZDUSD', original_price: 0.6123, change_percentage: 0.67, moving_average: 0.6089, trend: 'up', chart_url: '#', hourly_income: 110.00, min_investment: 500, duration: 10, tradingViewSymbol: 'FX:NZDUSD' },
    { id: 'eur-gbp', name: 'EUR/GBP', symbol: 'EURGBP', type: 'forex', forex_symbol: 'EURGBP', original_price: 0.8567, change_percentage: -0.12, moving_average: 0.8570, trend: 'down', chart_url: '#', hourly_income: 135.00, min_investment: 600, duration: 12, tradingViewSymbol: 'FX:EURGBP' }
  ],
  futures: [
    { id: 'gold', name: 'Gold Futures', symbol: 'XAUUSD', type: 'commodity', symbol_key: 'GOLD', original_price: 1987.45, change_percentage: 0.89, moving_average: 1975.60, trend: 'up', chart_url: '#', hourly_income: 160.00, min_investment: 600, duration: 20, tradingViewSymbol: 'TVC:GOLD' },
    { id: 'silver', name: 'Silver Futures', symbol: 'XAGUSD', type: 'commodity', symbol_key: 'SILVER', original_price: 23.45, change_percentage: 1.23, moving_average: 23.20, trend: 'up', chart_url: '#', hourly_income: 120.00, min_investment: 500, duration: 12, tradingViewSymbol: 'TVC:SILVER' },
    { id: 'oil', name: 'Crude Oil', symbol: 'USOIL', type: 'commodity', symbol_key: 'OIL', original_price: 78.90, change_percentage: -1.45, moving_average: 79.50, trend: 'down', chart_url: '#', hourly_income: 155.00, min_investment: 600, duration: 12, tradingViewSymbol: 'TVC:USOIL' },
    { id: 'natural-gas', name: 'Natural Gas', symbol: 'NGAS', type: 'commodity', symbol_key: 'NATURALGAS', original_price: 2.89, change_percentage: 2.34, moving_average: 2.82, trend: 'up', chart_url: '#', hourly_income: 105.00, min_investment: 500, duration: 10, tradingViewSymbol: 'TVC:NATURALGAS' },
    { id: 'copper', name: 'Copper Futures', symbol: 'COPPER', type: 'commodity', symbol_key: 'COPPER', original_price: 3.78, change_percentage: -0.56, moving_average: 3.80, trend: 'down', chart_url: '#', hourly_income: 125.00, min_investment: 550, duration: 12, tradingViewSymbol: 'TVC:COPPER' }
  ],
  stocks: [
    { id: 'apple', name: 'Apple Inc', symbol: 'AAPL', type: 'stock', symbol_key: 'AAPL', original_price: 189.45, change_percentage: 1.23, moving_average: 187.20, trend: 'up', chart_url: '#', hourly_income: 165.00, min_investment: 600, duration: 20, tradingViewSymbol: 'NASDAQ:AAPL' },
    { id: 'tesla', name: 'Tesla Inc', symbol: 'TSLA', type: 'stock', symbol_key: 'TSLA', original_price: 245.67, change_percentage: -2.34, moving_average: 250.10, trend: 'down', chart_url: '#', hourly_income: 150.00, min_investment: 600, duration: 12, tradingViewSymbol: 'NASDAQ:TSLA' },
    { id: 'amazon', name: 'Amazon.com', symbol: 'AMZN', type: 'stock', symbol_key: 'AMZN', original_price: 145.67, change_percentage: 0.89, moving_average: 144.50, trend: 'up', chart_url: '#', hourly_income: 140.00, min_investment: 600, duration: 12, tradingViewSymbol: 'NASDAQ:AMZN' },
    { id: 'google', name: 'Google LLC', symbol: 'GOOGL', type: 'stock', symbol_key: 'GOOGL', original_price: 138.90, change_percentage: 1.45, moving_average: 137.20, trend: 'up', chart_url: '#', hourly_income: 135.00, min_investment: 550, duration: 12, tradingViewSymbol: 'NASDAQ:GOOGL' },
    { id: 'microsoft', name: 'Microsoft Corp', symbol: 'MSFT', type: 'stock', symbol_key: 'MSFT', original_price: 378.45, change_percentage: 0.67, moving_average: 376.10, trend: 'up', chart_url: '#', hourly_income: 160.00, min_investment: 600, duration: 20, tradingViewSymbol: 'NASDAQ:MSFT' }
  ]
};

const Trading = () => {
  const { pairId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { formatCurrency, convertAmount, currentCurrency, exchangeRates } = useCurrency();
  
  const [assets, setAssets] = useState<{ [key: string]: Asset[] }>({});
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'crypto' | 'forex' | 'futures' | 'stocks'>('crypto');
  const [priceHistory, setPriceHistory] = useState<{ [key: string]: number[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Fetch real-time cryptocurrency prices from CoinGecko
  const fetchCryptoPrices = async (): Promise<{ [key: string]: { price: number; change: number } }> => {
    try {
      const cryptoIds = baseAssetsData.crypto.map(crypto => crypto.coingecko_id).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cryptoIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto prices');
      }
      
      const data: CoinGeckoMarketData[] = await response.json();
      const prices: { [key: string]: { price: number; change: number } } = {};
      
      data.forEach(coin => {
        prices[coin.id] = {
          price: coin.current_price,
          change: coin.price_change_percentage_24h || 0
        };
      });
      
      return prices;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      // Fallback to original prices if API fails
      const fallbackPrices: { [key: string]: { price: number; change: number } } = {};
      baseAssetsData.crypto.forEach(crypto => {
        fallbackPrices[crypto.coingecko_id] = {
          price: crypto.original_price,
          change: crypto.change_percentage
        };
      });
      return fallbackPrices;
    }
  };

  // Fetch Forex rates from a free API
  const fetchForexRates = async (): Promise<{ [key: string]: { price: number; change: number } }> => {
    try {
      // Using Frankfurter API for free forex rates
      const response = await fetch('https://api.frankfurter.app/latest?from=USD');
      
      if (!response.ok) {
        throw new Error('Failed to fetch forex rates');
      }
      
      const data = await response.json();
      const rates: { [key: string]: { price: number; change: number } } = {};
      
      // Map forex pairs
      baseAssetsData.forex.forEach(forex => {
        const pair = forex.forex_symbol;
        let rate = 0;
        let change = forex.change_percentage; // Keep original change for now
        
        if (pair === 'EURUSD') {
          rate = data.rates?.EUR || forex.original_price;
        } else if (pair === 'GBPUSD') {
          rate = data.rates?.GBP || forex.original_price;
        } else if (pair === 'USDJPY') {
          rate = data.rates?.JPY ? 1 / data.rates.JPY : forex.original_price;
        } else if (pair === 'USDCHF') {
          rate = data.rates?.CHF ? 1 / data.rates.CHF : forex.original_price;
        } else if (pair === 'AUDUSD') {
          rate = data.rates?.AUD || forex.original_price;
        } else if (pair === 'USDCAD') {
          rate = data.rates?.CAD ? 1 / data.rates.CAD : forex.original_price;
        } else if (pair === 'NZDUSD') {
          rate = data.rates?.NZD || forex.original_price;
        } else if (pair === 'EURGBP') {
          const eurRate = data.rates?.EUR || 1.0856;
          const gbpRate = data.rates?.GBP || 1.2678;
          rate = eurRate / gbpRate;
        }
        
        rates[pair] = {
          price: rate,
          change: change
        };
      });
      
      return rates;
    } catch (error) {
      console.error('Error fetching forex rates:', error);
      // Fallback to original prices
      const fallbackRates: { [key: string]: { price: number; change: number } } = {};
      baseAssetsData.forex.forEach(forex => {
        fallbackRates[forex.forex_symbol] = {
          price: forex.original_price,
          change: forex.change_percentage
        };
      });
      return fallbackRates;
    }
  };

  // Fetch commodity prices (simplified - using free API)
  const fetchCommodityPrices = async (): Promise<{ [key: string]: { price: number; change: number } }> => {
    try {
      // Using a free commodities API (example)
      // For now, we'll use fallback prices but you can integrate with a real API
      const prices: { [key: string]: { price: number; change: number } } = {};
      
      baseAssetsData.futures.forEach(commodity => {
        // Add small random variation to simulate real-time data
        const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
        prices[commodity.symbol_key] = {
          price: commodity.original_price * (1 + variation),
          change: commodity.change_percentage + (Math.random() - 0.5) * 0.5 // Small random change
        };
      });
      
      return prices;
    } catch (error) {
      console.error('Error fetching commodity prices:', error);
      // Fallback to original prices
      const fallbackPrices: { [key: string]: { price: number; change: number } } = {};
      baseAssetsData.futures.forEach(commodity => {
        fallbackPrices[commodity.symbol_key] = {
          price: commodity.original_price,
          change: commodity.change_percentage
        };
      });
      return fallbackPrices;
    }
  };

  // Fetch stock prices (simplified)
  const fetchStockPrices = async (): Promise<{ [key: string]: { price: number; change: number } }> => {
    try {
      // Using simulated data for now - you can integrate with real stock API
      const prices: { [key: string]: { price: number; change: number } } = {};
      
      baseAssetsData.stocks.forEach(stock => {
        // Add small random variation to simulate real-time data
        const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
        prices[stock.symbol_key] = {
          price: stock.original_price * (1 + variation),
          change: stock.change_percentage + (Math.random() - 0.5) * 0.3 // Small random change
        };
      });
      
      return prices;
    } catch (error) {
      console.error('Error fetching stock prices:', error);
      // Fallback to original prices
      const fallbackPrices: { [key: string]: { price: number; change: number } } = {};
      baseAssetsData.stocks.forEach(stock => {
        fallbackPrices[stock.symbol_key] = {
          price: stock.original_price,
          change: stock.change_percentage
        };
      });
      return fallbackPrices;
    }
  };

  // Fetch all real-time prices
  const fetchAllPrices = async () => {
    setIsRefreshing(true);
    try {
      const [cryptoPrices, forexRates, commodityPrices, stockPrices] = await Promise.all([
        fetchCryptoPrices(),
        fetchForexRates(),
        fetchCommodityPrices(),
        fetchStockPrices()
      ]);

      // Convert assets with real-time prices
      const convertedAssets: { [key: string]: Asset[] } = {};
      
      Object.entries(baseAssetsData).forEach(([category, categoryAssets]) => {
        convertedAssets[category] = categoryAssets.map((asset: any) => {
          let currentPrice = asset.original_price;
          let changePercentage = asset.change_percentage;

          // Get real-time price based on asset type
          if (asset.type === 'crypto' && asset.coingecko_id) {
            const realTimeData = cryptoPrices[asset.coingecko_id];
            if (realTimeData) {
              currentPrice = realTimeData.price;
              changePercentage = realTimeData.change;
            }
          } else if (asset.type === 'forex' && asset.forex_symbol) {
            const realTimeData = forexRates[asset.forex_symbol];
            if (realTimeData) {
              currentPrice = realTimeData.price;
              changePercentage = realTimeData.change;
            }
          } else if (asset.type === 'commodity' && asset.symbol_key) {
            const realTimeData = commodityPrices[asset.symbol_key];
            if (realTimeData) {
              currentPrice = realTimeData.price;
              changePercentage = realTimeData.change;
            }
          } else if (asset.type === 'stock' && asset.symbol_key) {
            const realTimeData = stockPrices[asset.symbol_key];
            if (realTimeData) {
              currentPrice = realTimeData.price;
              changePercentage = realTimeData.change;
            }
          }

          // Convert investment amounts and income to current currency
          const minInvestment = convertAmount ? convertAmount(asset.min_investment) : asset.min_investment;
          const hourlyIncome = convertAmount ? convertAmount(asset.hourly_income) : asset.hourly_income;

          const trend = changePercentage >= 0 ? 'up' : 'down';
          const movingAverage = currentPrice * (1 - (changePercentage / 100) * 0.1); // Simulated moving average

          return {
            ...asset,
            current_price: Number(currentPrice.toFixed(asset.type === 'forex' ? 4 : 2)),
            change_percentage: Number(changePercentage.toFixed(2)),
            moving_average: Number(movingAverage.toFixed(asset.type === 'forex' ? 4 : 2)),
            trend: trend,
            hourly_income: Number(hourlyIncome.toFixed(4)),
            min_investment: minInvestment,
          };
        });
      });

      setAssets(convertedAssets);
      setLastUpdate(new Date());
      
      // Initialize price history if empty
      if (Object.keys(priceHistory).length === 0) {
        const initialHistory: { [key: string]: number[] } = {};
        Object.values(convertedAssets).flat().forEach(asset => {
          initialHistory[asset.id] = [asset.current_price];
        });
        setPriceHistory(initialHistory);
      }
    } catch (error) {
      console.error('Error fetching real-time prices:', error);
      // Fallback to original implementation
      convertAssetsToCurrency();
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Convert base assets to current currency (fallback)
  const convertAssetsToCurrency = useCallback(() => {
    const convertedAssets: { [key: string]: Asset[] } = {};
    
    Object.entries(baseAssetsData).forEach(([category, categoryAssets]) => {
      convertedAssets[category] = categoryAssets.map((asset: any) => {
        const minInvestment = convertAmount ? convertAmount(asset.min_investment) : asset.min_investment;
        const hourlyIncome = convertAmount ? convertAmount(asset.hourly_income) : asset.hourly_income;

        return {
          ...asset,
          hourly_income: Number(hourlyIncome.toFixed(4)),
          min_investment: minInvestment,
        };
      });
    });

    setAssets(convertedAssets);
    setIsLoading(false);
    setIsRefreshing(false);
  }, [convertAmount]);

  // Initialize and update assets
  useEffect(() => {
    fetchAllPrices(); // Fetch real-time data on initial load
    
    const interval = setInterval(fetchAllPrices, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Update assets when currency changes
  useEffect(() => {
    if (Object.keys(assets).length > 0) {
      const updatedAssets = { ...assets };
      
      Object.keys(updatedAssets).forEach(category => {
        updatedAssets[category] = updatedAssets[category].map(asset => {
          const minInvestment = convertAmount ? convertAmount(asset.min_investment) : asset.min_investment;
          const hourlyIncome = convertAmount ? convertAmount(asset.hourly_income) : asset.hourly_income;

          return {
            ...asset,
            hourly_income: Number(hourlyIncome.toFixed(4)),
            min_investment: minInvestment,
          };
        });
      });

      setAssets(updatedAssets);
    }
  }, [currentCurrency, convertAmount]);

  // Real-time price updates for chart (in USD only)
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets(prevAssets => {
        if (Object.keys(prevAssets).length === 0) return prevAssets;
        
        const updatedAssets = { ...prevAssets };
        
        Object.keys(updatedAssets).forEach(category => {
          updatedAssets[category] = updatedAssets[category].map(asset => {
            // Generate small random movement on USD price for chart animation
            const changeFactor = (Math.random() - 0.5) * 0.001; // Smaller variation for chart
            const newCurrentPrice = asset.current_price * (1 + changeFactor);

            // Calculate change percentage
            const currentHistory = priceHistory[asset.id] || [asset.current_price];
            const basePrice = currentHistory[0] || asset.current_price;
            const newChangePercentage = ((newCurrentPrice - basePrice) / basePrice) * 100;

            // Update moving average
            const recentPrices = [...currentHistory.slice(-4), newCurrentPrice];
            const newMovingAverage = recentPrices.reduce((sum, price) => sum + price, 0) / recentPrices.length;
            
            const newTrend = newCurrentPrice > asset.current_price ? 'up' : 'down';

            // Update price history
            setPriceHistory(prev => ({
              ...prev,
              [asset.id]: [...(prev[asset.id] || []).slice(-49), newCurrentPrice]
            }));

            return {
              ...asset,
              current_price: Number(newCurrentPrice.toFixed(asset.type === 'forex' ? 4 : 2)),
              change_percentage: Number(newChangePercentage.toFixed(2)),
              moving_average: Number(newMovingAverage.toFixed(asset.type === 'forex' ? 4 : 2)),
              trend: newTrend
            };
          });
        });

        return updatedAssets;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [priceHistory]);

  const getCurrentAssets = () => {
    return assets[activeTab] || [];
  };

  // Handle URL pair selection
  useEffect(() => {
    if (pairId && Object.keys(assets).length > 0) {
      const allAssets = Object.values(assets).flat();
      const asset = allAssets.find(a => a.id === pairId);
      if (asset) {
        setSelectedAsset(asset);
        setInvestmentAmount(asset.min_investment.toString());
      }
    }
  }, [pairId, assets]);

  // Auto-select first asset when tab changes
  useEffect(() => {
    const currentAssets = getCurrentAssets();
    if (currentAssets.length > 0 && (!selectedAsset || !currentAssets.find(a => a.id === selectedAsset.id))) {
      const firstAsset = currentAssets[0];
      setSelectedAsset(firstAsset);
      setInvestmentAmount(firstAsset.min_investment.toString());
    }
  }, [activeTab, assets]);

  // Chart animation
  useEffect(() => {
    startChartAnimation();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedAsset, priceHistory]);

  const startChartAnimation = () => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const drawChart = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 1;
      for (let i = 0; i <= width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i <= height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      if (selectedAsset) {
        const assetHistory = priceHistory[selectedAsset.id] || [selectedAsset.current_price];
        
        if (assetHistory.length > 1) {
          const maxPrice = Math.max(...assetHistory);
          const minPrice = Math.min(...assetHistory);
          const priceRange = maxPrice - minPrice || 1;

          // Draw price line
          ctx.strokeStyle = selectedAsset.trend === 'up' ? '#10B981' : '#EF4444';
          ctx.lineWidth = 3;
          ctx.beginPath();

          const points = assetHistory.map((price, index) => {
            const x = (index / (assetHistory.length - 1)) * width;
            const y = height - ((price - minPrice) / priceRange) * height * 0.8 - height * 0.1;
            return { x, y };
          });

          points.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              const prevPoint = points[index - 1];
              const cpX = (prevPoint.x + point.x) / 2;
              ctx.quadraticCurveTo(cpX, prevPoint.y, point.x, point.y);
            }
          });
          ctx.stroke();

          // Draw current price indicator
          const currentPoint = points[points.length - 1];
          ctx.fillStyle = selectedAsset.trend === 'up' ? '#10B981' : '#EF4444';
          ctx.beginPath();
          ctx.arc(currentPoint.x, currentPoint.y, 6, 0, 2 * Math.PI);
          ctx.fill();

          // Price labels (in USD)
          ctx.fillStyle = '#9CA3AF';
          ctx.font = '12px monospace';
          ctx.fillText(
            `$${maxPrice.toLocaleString(undefined, { 
              minimumFractionDigits: selectedAsset.type === 'forex' ? 4 : 2,
              maximumFractionDigits: selectedAsset.type === 'forex' ? 4 : 2 
            })}`, 
            width - 100, 
            20
          );
          ctx.fillText(
            `$${minPrice.toLocaleString(undefined, { 
              minimumFractionDigits: selectedAsset.type === 'forex' ? 4 : 2,
              maximumFractionDigits: selectedAsset.type === 'forex' ? 4 : 2 
            })}`, 
            width - 100, 
            height - 10
          );
        }
      }

      animationRef.current = requestAnimationFrame(drawChart);
    };

    drawChart();
  };

  const handleInvest = async (asset: Asset) => {
    const amount = parseFloat(investmentAmount);
    if (!investmentAmount || isNaN(amount) || amount < asset.min_investment) {
      alert(`Minimum investment for ${asset.name} is ${formatCurrency(asset.min_investment)}`);
      return;
    }

    if (!user?.phone_number) {
      alert('User authentication required');
      return;
    }

    setIsInvesting(true);
    try {
      const result = await apiService.buyInvestment({
        asset_id: asset.id,
        amount: amount,
        phone_number: user.phone_number
      });

      alert(`Investment successful! ${result.message}`);
      setInvestmentAmount('');
    } catch (error: any) {
      alert(`Investment failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsInvesting(false);
    }
  };

  // Dynamic income calculation that updates with currency and investment amount
  const calculateTotalIncome = (asset: Asset, amount: number) => {
    const hourlyIncome = asset.hourly_income;
    return hourlyIncome * asset.duration * (amount / asset.min_investment);
  };

  const getTradingViewUrl = (asset: Asset) => {
    return `https://www.tradingview.com/chart/?symbol=${asset.tradingViewSymbol}`;
  };

  // Always show USD for prices
  const getPricePrefix = (asset: Asset) => {
    return '$'; // Always show USD for asset prices
  };

  const AssetCard = ({ asset }: { asset: Asset }) => {
    const totalIncome = calculateTotalIncome(asset, asset.min_investment);
    const pricePrefix = getPricePrefix(asset);

    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-white hover:from-gray-700 hover:to-gray-800 transition duration-200">
        <div className="flex items-center mb-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
            asset.trend === 'up' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-rose-500'
          }`}>
            <span className="font-bold text-white">{asset.symbol[0]}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{asset.name}</h3>
            <p className="text-gray-400 text-sm">{asset.symbol} • {asset.type.toUpperCase()}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-bold text-lg">
              {pricePrefix}
              {asset.current_price.toLocaleString(undefined, { 
                minimumFractionDigits: asset.type === 'forex' ? 4 : 2,
                maximumFractionDigits: asset.type === 'forex' ? 4 : 2 
              })}
            </p>
            <span className={`text-sm ${asset.change_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {asset.change_percentage >= 0 ? '+' : ''}{asset.change_percentage.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Min Investment</span>
            <span className="text-white font-semibold">{formatCurrency(asset.min_investment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Duration</span>
            <span className="text-white font-semibold">{asset.duration} Hours</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Hourly Income</span>
            <span className="text-green-400 font-semibold">
              {formatCurrency(Number(asset.hourly_income.toFixed(4)))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Income</span>
            <span className="text-green-400 font-semibold">
              {formatCurrency(Number(totalIncome.toFixed(4)))}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedAsset(asset);
              setInvestmentAmount(asset.min_investment.toString());
            }}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-lg font-bold transition duration-200"
          >
            INVEST
          </button>
          <a
            href={getTradingViewUrl(asset)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg transition duration-200"
            title="Open Advanced Chart in TradingView"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </a>
        </div>
      </div>
    );
  };

  // Show loading state while assets are being converted
  if (isLoading && Object.keys(assets).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading real-time market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-0 flex-col items-center justify-content-center space-y-6 w-full overflow-x-hidden p-4">
      {/* Navigation and Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={() => navigate('/assets')}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
          </svg>
          Back to Assets
        </button>
        
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Live Trading</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Real-time market data • Prices in USD • Income in {currentCurrency.code}
            {lastUpdate && (
              <span className="block text-xs text-gray-500 mt-1">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchAllPrices}
            disabled={isRefreshing}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3 py-2 rounded-lg text-sm transition duration-200"
          >
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Live</span>
          </div>
        </div>
      </div>

      {/* Asset Type Tabs */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-1">
        <div className="flex space-x-1">
          {[
            { id: 'crypto', label: 'Cryptocurrency', count: 10 },
            { id: 'forex', label: 'Forex', count: 8 },
            { id: 'futures', label: 'Futures', count: 5 },
            { id: 'stocks', label: 'Stocks', count: 5 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Assets Grid */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <span className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Live {activeTab.toUpperCase()} Assets
              </h2>
              {isRefreshing && (
                <div className="flex items-center text-sm text-blue-300">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {getCurrentAssets().map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Chart & Investment Panel */}
        <div className="space-y-6">
          {/* Live Chart */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {selectedAsset ? `${selectedAsset.name} (${selectedAsset.symbol})` : 'Select an Asset'}
              </h3>
              <div className="flex space-x-2">
                {selectedAsset && (
                  <a
                    href={getTradingViewUrl(selectedAsset)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center text-sm"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    TradingView
                  </a>
                )}
                <div className="flex space-x-1">
                  {['1H', '4H', '1D', '1W', '1M'].map((tf) => (
                    <button
                      key={tf}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition duration-200"
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4">
              {selectedAsset ? (
                <canvas 
                  ref={chartCanvasRef}
                  width={600}
                  height={300}
                  className="w-full h-48 bg-gray-800 rounded"
                />
              ) : (
                <div className="h-48 bg-gray-800 rounded flex items-center justify-center">
                  <p className="text-gray-400">Select an asset to view chart</p>
                </div>
              )}
            </div>

            {selectedAsset && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Current Price</p>
                  <p className="font-bold text-lg">
                    {getPricePrefix(selectedAsset)}
                    {selectedAsset.current_price.toLocaleString(undefined, { 
                      minimumFractionDigits: selectedAsset.type === 'forex' ? 4 : 2,
                      maximumFractionDigits: selectedAsset.type === 'forex' ? 4 : 2 
                    })}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">24h Change</p>
                  <p className={`font-bold text-lg ${
                    selectedAsset.change_percentage >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedAsset.change_percentage >= 0 ? '+' : ''}{selectedAsset.change_percentage.toFixed(2)}%
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Moving Avg</p>
                  <p className="font-bold text-lg">
                    {getPricePrefix(selectedAsset)}
                    {selectedAsset.moving_average.toLocaleString(undefined, { 
                      minimumFractionDigits: selectedAsset.type === 'forex' ? 4 : 2,
                      maximumFractionDigits: selectedAsset.type === 'forex' ? 4 : 2 
                    })}
                  </p>
                </div>
                <div className="bg-gray-700 rounded-lg p-3">
                  <p className="text-gray-400 text-sm">Trend</p>
                  <p className={`font-bold text-lg ${
                    selectedAsset.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {selectedAsset.trend.toUpperCase()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Investment Panel */}
          {selectedAsset && (
            <div className="bg-gradient-to-br from-green-900 to-emerald-900 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Investment Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">
                    Investment Amount ({currentCurrency.code})
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    min={selectedAsset.min_investment}
                    step="0.01"
                    className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={`Min: ${formatCurrency(selectedAsset.min_investment)}`}
                  />
                </div>

                {investmentAmount && parseFloat(investmentAmount) >= selectedAsset.min_investment && (
                  <div className="bg-gray-800 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-lg mb-2">Investment Summary</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Asset:</span>
                      <span className="font-semibold">{selectedAsset.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Duration:</span>
                      <span className="font-semibold">{selectedAsset.duration} Hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Hourly Income:</span>
                      <span className="text-green-400 font-semibold">
                        {formatCurrency(Number((selectedAsset.hourly_income * (parseFloat(investmentAmount) / selectedAsset.min_investment)).toFixed(4)))}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-gray-600 pt-2">
                      <span className="text-gray-300">Total Income:</span>
                      <span className="text-green-400 font-bold text-lg">
                        {formatCurrency(Number(calculateTotalIncome(selectedAsset, parseFloat(investmentAmount)).toFixed(4)))}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => handleInvest(selectedAsset)}
                  disabled={isInvesting || !investmentAmount || parseFloat(investmentAmount) < selectedAsset.min_investment}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 text-white py-4 rounded-lg font-bold text-lg transition duration-200 disabled:cursor-not-allowed"
                >
                  {isInvesting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `INVEST ${formatCurrency(parseFloat(investmentAmount) || 0)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trading;