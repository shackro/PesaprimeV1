// pages/Withdraw.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type WithdrawRequest, type ApiError } from '../services/api';
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

const Withdraw = () => {
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
      const withdrawActivities = activities
        .filter(activity => activity.activity_type === 'withdraw')
        .slice(0, 5);
      setRecentActivities(withdrawActivities);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      // Set fallback values
      setWalletBalance(0);
      setRecentActivities([]);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount > walletBalance) {
      alert('Insufficient balance for withdrawal');
      return;
    }

    if (!user?.phone_number) {
      alert('User phone number not found');
      return;
    }

    setLoading(true);
    try {
      const withdrawData: WithdrawRequest = {
        amount: withdrawAmount,
        phone_number: user.phone_number
      };

      const result = await apiService.withdrawFunds(withdrawData);
      
      alert(`Withdrawal successful! New balance: ${formatCurrency(result.new_balance)}`);
      setAmount('');
      await fetchWalletData(); // Refresh data
      
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(`Withdrawal failed: ${apiError.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-red-900 p-4">
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Withdraw Funds</h1>
        </div>

        {/* Current Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-2">Available Balance</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(walletBalance)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Maximum withdrawal: {formatCurrency(walletBalance)}
            </p>
          </div>
        </div>

        {/* Withdrawal Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Withdrawal Amount
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
                max={walletBalance}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span>Min: {formatCurrency(100)}</span>
              <span>Max: {formatCurrency(walletBalance)}</span>
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 mb-3">Quick Select</p>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts
                .filter(quickAmount => quickAmount <= walletBalance)
                .map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="py-2 px-3 bg-gray-100 dark:bg-gray-600 hover:bg-red-500 hover:text-white rounded-lg transition duration-200 text-gray-700 dark:text-gray-300"
                  >
                    {currentCurrency.symbol} {quickAmount.toLocaleString()}
                  </button>
                ))}
            </div>
          </div>

          {/* Withdrawal Details */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
              Withdrawal Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                <span className="font-semibold">{amount ? `${currentCurrency.symbol} ${amount}` : `${currentCurrency.symbol} 0`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Fee:</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                <span className="text-gray-800 dark:text-white font-semibold">Total to receive:</span>
                <span className="font-semibold">{amount ? `${currentCurrency.symbol} ${amount}` : `${currentCurrency.symbol} 0`}</span>
              </div>
            </div>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={handleWithdraw}
            disabled={loading || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > walletBalance}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold text-lg transition duration-200 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Withdraw Now'
            )}
          </button>

          {/* User Info */}
          <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Withdrawing from: {user?.phone_number}
          </div>
        </div>

        {/* Recent Withdrawals */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Recent Withdrawals
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">
                    Withdrawal
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-red-600 font-semibold">
                    -{formatCurrency(activity.amount)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {activity.status}
                  </p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <p>No recent withdrawals</p>
                <p className="text-sm">Your withdrawal history will appear here</p>
              </div>
            )}
          </div>
        </div>

        {/* Processing Info */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
            <div>
              <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold">
                Processing Time
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Withdrawals are processed within 2-4 hours during business days. Weekend withdrawals may take longer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;