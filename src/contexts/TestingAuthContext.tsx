/* eslint-disable react-hooks/purity */
// contexts/TestingAuthContext.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  created_at: string;
}

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'bonus';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  currency: string;
}

interface Wallet {
  balance: number;
  equity: number;
  currency: string;
}

interface Investment {
  id: string;
  asset_id: string;
  asset_name: string;
  invested_amount: number;
  current_value: number;
  units: number;
  profit_loss: number;
  profit_loss_percentage: number;
  status: string;
  created_at: string;
}

interface Asset {
  id: string;
  name: string;
  symbol: string;
  type: 'forex' | 'crypto' | 'stock' | 'commodity';
  current_price: number;
  change_percentage: number;
  moving_average: number;
  trend: 'up' | 'down';
  chart_url: string;
}

interface TestingAuthContextType {
  user: User;
  isAuthenticated: boolean;
  loading: boolean;
  wallet: Wallet;
  transactions: Transaction[];
  investments: Investment[];
  assets: Asset[];
  login: () => Promise<void>;
  logout: () => void;
  register: () => Promise<void>;
  deposit: (amount: number) => Promise<{ success: boolean; message: string; new_balance: number }>;
  withdraw: (amount: number) => Promise<{ success: boolean; message: string; new_balance: number }>;
  invest: (assetId: string, amount: number) => Promise<{ success: boolean; message: string; investment: Investment }>;
  getTransactionHistory: () => Transaction[];
  getRecentTransactions: (limit?: number) => Transaction[];
  getTotalDeposits: () => number;
  getTotalWithdrawals: () => number;
  getTotalInvested: () => number;
  getTotalProfitLoss: () => number;
  formatCurrency: (amount: number) => string;
}

const TestingAuthContext = createContext<TestingAuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useTestingAuth = () => {
  const context = useContext(TestingAuthContext);
  if (context === undefined) {
    throw new Error('useTestingAuth must be used within a TestingAuthProvider');
  }
  return context;
};

export const TestingAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user] = useState<User>({
    id: "1",
    name: "Demo User",
    email: "demo@pesaprime.com", 
    phone_number: "+254712345678",
    created_at: new Date().toISOString()
  });

  const [wallet, setWallet] = useState<Wallet>({
    balance: 25000.00, // Increased starting balance
    equity: 28750.00,
    currency: "KES"
  });

  // Enhanced transaction history with more realistic data
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      type: "deposit",
      amount: 20000.00,
      description: "Initial deposit via M-Pesa",
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      status: "completed",
      currency: "KES"
    },
    {
      id: "2",
      type: "deposit",
      amount: 10000.00,
      description: "Additional funding",
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      status: "completed",
      currency: "KES"
    },
    {
      id: "3",
      type: "withdrawal",
      amount: 5000.00,
      description: "Emergency withdrawal",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      status: "completed",
      currency: "KES"
    },
    {
      id: "4",
      type: "investment",
      amount: 8000.00,
      description: "BTC Investment",
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
      status: "completed",
      currency: "KES"
    },
    {
      id: "5",
      type: "investment",
      amount: 6000.00,
      description: "ETH Investment",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      status: "completed",
      currency: "KES"
    },
    {
      id: "6",
      type: "investment",
      amount: 4000.00,
      description: "Apple Stock Investment",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      status: "completed",
      currency: "KES"
    },
    {
      id: "7",
      type: "withdrawal",
      amount: 3000.00,
      description: "Monthly expenses",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      status: "completed",
      currency: "KES"
    },
    {
      id: "8",
      type: "bonus",
      amount: 1000.00,
      description: "Welcome bonus",
      timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
      status: "completed",
      currency: "KES"
    },
    {
      id: "9",
      type: "bonus",
      amount: 500.00,
      description: "Referral bonus",
      timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
      status: "completed",
      currency: "KES"
    },
    {
      id: "10",
      type: "deposit",
      amount: 7500.00,
      description: "Salary deposit",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: "completed",
      currency: "KES"
    }
  ]);

  // Enhanced investments with more assets and realistic data
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: "1",
      asset_id: "1",
      asset_name: "Bitcoin",
      invested_amount: 8000.00,
      current_value: 9250.00,
      units: 0.18,
      profit_loss: 1250.00,
      profit_loss_percentage: 15.63,
      status: "active",
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "2",
      asset_id: "2",
      asset_name: "Ethereum",
      invested_amount: 6000.00,
      current_value: 6800.00,
      units: 2.1,
      profit_loss: 800.00,
      profit_loss_percentage: 13.33,
      status: "active",
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "3",
      asset_id: "3",
      asset_name: "Apple Inc",
      invested_amount: 4000.00,
      current_value: 4200.00,
      units: 21.5,
      profit_loss: 200.00,
      profit_loss_percentage: 5.00,
      status: "active",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "4",
      asset_id: "4",
      asset_name: "EUR/USD",
      invested_amount: 3000.00,
      current_value: 3050.00,
      units: 2765,
      profit_loss: 50.00,
      profit_loss_percentage: 1.67,
      status: "active",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  // Available assets for investment
  const [assets] = useState<Asset[]>([
    {
      id: "1",
      name: "Bitcoin",
      symbol: "BTC",
      type: "crypto",
      current_price: 51388.89,
      change_percentage: 2.5,
      moving_average: 50500.00,
      trend: "up",
      chart_url: "https://www.tradingview.com/chart/?symbol=BINANCE:BTCUSDT"
    },
    {
      id: "2",
      name: "Ethereum",
      symbol: "ETH",
      type: "crypto",
      current_price: 3238.10,
      change_percentage: 1.8,
      moving_average: 3150.00,
      trend: "up",
      chart_url: "https://www.tradingview.com/chart/?symbol=BINANCE:ETHUSDT"
    },
    {
      id: "3",
      name: "Apple Inc",
      symbol: "AAPL",
      type: "stock",
      current_price: 195.35,
      change_percentage: 0.8,
      moving_average: 192.50,
      trend: "up",
      chart_url: "https://www.tradingview.com/chart/?symbol=NASDAQ:AAPL"
    },
    {
      id: "4",
      name: "EUR/USD",
      symbol: "EURUSD",
      type: "forex",
      current_price: 1.1035,
      change_percentage: -0.3,
      moving_average: 1.1050,
      trend: "down",
      chart_url: "https://www.tradingview.com/chart/?symbol=FX:EURUSD"
    },
    {
      id: "5",
      name: "Gold",
      symbol: "XAUUSD",
      type: "commodity",
      current_price: 2035.00,
      change_percentage: 0.5,
      moving_average: 2020.00,
      trend: "up",
      chart_url: "https://www.tradingview.com/chart/?symbol=OANDA:XAUUSD"
    },
    {
      id: "6",
      name: "Tesla Inc",
      symbol: "TSLA",
      type: "stock",
      current_price: 245.75,
      change_percentage: -1.2,
      moving_average: 248.00,
      trend: "down",
      chart_url: "https://www.tradingview.com/chart/?symbol=NASDAQ:TSLA"
    }
  ]);

  // Enhanced real-time market simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // Update investment values with realistic fluctuations
      setInvestments(prev => prev.map(inv => {
        const asset = assets.find(a => a.id === inv.asset_id);
        if (!asset) return inv;

        // More realistic fluctuation based on asset type
        const volatility = asset.type === 'crypto' ? 0.03 : 
                          asset.type === 'forex' ? 0.01 : 0.02;
        const fluctuation = (Math.random() - 0.5) * volatility;
        const newCurrentValue = inv.current_value * (1 + fluctuation);
        const newProfitLoss = newCurrentValue - inv.invested_amount;
        const newProfitLossPercentage = (newProfitLoss / inv.invested_amount) * 100;
        
        return {
          ...inv,
          current_value: parseFloat(newCurrentValue.toFixed(2)),
          profit_loss: parseFloat(newProfitLoss.toFixed(2)),
          profit_loss_percentage: parseFloat(newProfitLossPercentage.toFixed(2))
        };
      }));

      // Update wallet equity based on investments
      setWallet(prev => {
        const totalInvestmentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0);
        const newEquity = prev.balance + totalInvestmentValue;
        return {
          ...prev,
          equity: parseFloat(newEquity.toFixed(2))
        };
      });

    }, 15000); // Update every 15 seconds for better UX

    return () => clearInterval(interval);
  }, [investments, assets]);

  const deposit = async (amount: number): Promise<{ success: boolean; message: string; new_balance: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBalance = wallet.balance + amount;
        const newEquity = wallet.equity + amount;
        
        setWallet({
          ...wallet,
          balance: newBalance,
          equity: newEquity
        });

        // Add transaction to history
        const newTransaction: Transaction = {
          id: `deposit-${Date.now()}`,
          type: "deposit",
          amount: amount,
          description: "Wallet deposit",
          timestamp: new Date().toISOString(),
          status: "completed",
          currency: "KES"
        };

        setTransactions(prev => [newTransaction, ...prev]);

        resolve({
          success: true,
          message: `Successfully deposited ${amount.toLocaleString()} KES`,
          new_balance: newBalance
        });
      }, 1000);
    });
  };

  const withdraw = async (amount: number): Promise<{ success: boolean; message: string; new_balance: number }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount > wallet.balance) {
          reject({
            success: false,
            message: "Insufficient balance for withdrawal",
            new_balance: wallet.balance
          });
          return;
        }

        const newBalance = wallet.balance - amount;
        const newEquity = wallet.equity - amount;
        
        setWallet({
          ...wallet,
          balance: newBalance,
          equity: newEquity
        });

        // Add transaction to history
        const newTransaction: Transaction = {
          id: `withdrawal-${Date.now()}`,
          type: "withdrawal",
          amount: amount,
          description: "Wallet withdrawal",
          timestamp: new Date().toISOString(),
          status: "completed",
          currency: "KES"
        };

        setTransactions(prev => [newTransaction, ...prev]);

        resolve({
          success: true,
          message: `Successfully withdrew ${amount.toLocaleString()} KES`,
          new_balance: newBalance
        });
      }, 1000);
    });
  };

  const invest = async (assetId: string, amount: number): Promise<{ success: boolean; message: string; investment: Investment }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount > wallet.balance) {
          reject({
            success: false,
            message: "Insufficient balance for investment",
            investment: null as any
          });
          return;
        }

        const asset = assets.find(a => a.id === assetId);
        if (!asset) {
          reject({
            success: false,
            message: "Asset not found",
            investment: null as any
          });
          return;
        }

        // Calculate units based on current price
        const units = amount / asset.current_price;
        
        // Create new investment
        const newInvestment: Investment = {
          id: `inv-${Date.now()}`,
          asset_id: assetId,
          asset_name: asset.name,
          invested_amount: amount,
          current_value: amount, // Starts at invested amount
          units: parseFloat(units.toFixed(4)),
          profit_loss: 0,
          profit_loss_percentage: 0,
          status: "active",
          created_at: new Date().toISOString()
        };

        // Update wallet
        const newBalance = wallet.balance - amount;
        setWallet(prev => ({
          ...prev,
          balance: newBalance
        }));

        // Add investment
        setInvestments(prev => [...prev, newInvestment]);

        // Add transaction
        const newTransaction: Transaction = {
          id: `investment-${Date.now()}`,
          type: "investment",
          amount: amount,
          description: `Investment in ${asset.name}`,
          timestamp: new Date().toISOString(),
          status: "completed",
          currency: "KES"
        };

        setTransactions(prev => [newTransaction, ...prev]);

        resolve({
          success: true,
          message: `Successfully invested ${amount.toLocaleString()} KES in ${asset.name}`,
          investment: newInvestment
        });
      }, 1000);
    });
  };

  const getTransactionHistory = (): Transaction[] => {
    return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const getRecentTransactions = (limit: number = 5): Transaction[] => {
    return getTransactionHistory().slice(0, limit);
  };

  const getTotalDeposits = (): number => {
    return transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getTotalWithdrawals = (): number => {
    return transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getTotalInvested = (): number => {
    return investments.reduce((total, inv) => total + inv.invested_amount, 0);
  };

  const getTotalProfitLoss = (): number => {
    return investments.reduce((total, inv) => total + inv.profit_loss, 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const value: TestingAuthContextType = {
    user,
    isAuthenticated: true,
    loading: false,
    wallet,
    transactions,
    investments,
    assets,
    login: async () => {},
    logout: () => {},
    register: async () => {},
    deposit,
    withdraw,
    invest,
    getTransactionHistory,
    getRecentTransactions,
    getTotalDeposits,
    getTotalWithdrawals,
    getTotalInvested,
    getTotalProfitLoss,
    formatCurrency
  };

  return (
    <TestingAuthContext.Provider value={value}>
      {children}
    </TestingAuthContext.Provider>
  );
};