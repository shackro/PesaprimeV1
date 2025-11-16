// pages/Deposit.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type DepositRequest, type ApiError } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../contexts/CurrencyContext';

interface Activity {
  id: string;
  user_phone: string;
  activity_type: string;
  amount: number;
  description: string;
  timestamp: string;
  status: string;
}

const Deposit = () => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const { user } = useAuth();
  const { formatCurrency, currentCurrency } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const wallet = await apiService.getWalletBalance();
      setWalletBalance(wallet.balance);
      
      const activities = await apiService.getMyActivities();
      const depositActivities = activities
        .filter(activity => activity.activity_type === 'deposit')
        .slice(0, 5);
      setRecentActivities(depositActivities);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      // Set fallback values
      setWalletBalance(0);
      setRecentActivities([]);
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!user?.phone_number) {
      alert('User phone number not found');
      return;
    }

    setLoading(true);
    try {
      const depositData: DepositRequest = {
        amount: parseFloat(amount),
        phone_number: user.phone_number
      };

      const result = await apiService.depositFunds(depositData);
      
      alert(`Deposit successful! New balance: ${formatCurrency(result.new_balance)}`);
      setAmount('');
      await fetchWalletData(); // Refresh data
      
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(`Deposit failed: ${apiError.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000, 10000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate('/')}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg mr-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Deposit Funds</h1>
        </div>

        {/* Current Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-2">Current Balance</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(walletBalance)}
            </p>
          </div>
        </div>

        {/* Deposit Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Deposit Amount
          </h2>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Enter Amount ({currentCurrency.code})
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">{currentCurrency.symbol}</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-3">Quick Select</p>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="py-2 px-3 bg-gray-100 dark:bg-gray-600 hover:bg-green-500 hover:text-white rounded-lg transition duration-200 text-gray-700 dark:text-gray-300"
                >
                  {currentCurrency.symbol} {quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Deposit Button */}
          <button
            onClick={handleDeposit}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold text-lg transition duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Deposit Now'
            )}
          </button>

          {/* User Info */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Depositing to: {user?.phone_number}
          </div>
        </div>

        {/* Recent Deposits */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Recent Deposits
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    Deposit
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 font-semibold">
                    +{formatCurrency(activity.amount)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {activity.status}
                  </p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <p>No recent deposits</p>
                <p className="text-sm">Your deposit history will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-yellow-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            <div>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold">
                Secure Transaction
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Your funds are secured with bank-level encryption. Deposits are processed instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;