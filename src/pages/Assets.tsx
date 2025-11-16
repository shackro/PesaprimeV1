import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService, type WalletData, type Asset, type UserInvestment } from '../services/api';
import { useCurrency } from '../contexts/CurrencyContext';
import { Link } from 'react-router-dom';
import Trading from '../components/Trading';

const Assets = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [marketAssets, setMarketAssets] = useState<Asset[]>([]);
  const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const { user } = useAuth();
  const { formatCurrency, currentCurrency } = useCurrency();

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds for live updates
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [wallet, assets, investments] = await Promise.all([
        apiService.getWalletBalance(),
        apiService.getAssets(),
        apiService.getMyInvestments()
      ]);
      
      setWalletData(wallet);
      setMarketAssets(assets);
      setUserInvestments(investments);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Set fallback data
      setWalletData({ balance: 0, equity: 0, currency: 'KES' });
      setMarketAssets([]);
      setUserInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvest = async (asset: Asset) => {
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }

    if (!user?.phone_number) {
      alert('User phone number not found');
      return;
    }

    const amount = parseFloat(investmentAmount);
    
    if (amount > (walletData?.balance || 0)) {
      alert('Insufficient balance for this investment');
      return;
    }

    setInvesting(true);
    try {
      const result = await apiService.buyInvestment({
        asset_id: asset.id,
        amount: amount,
        phone_number: user.phone_number
      });

      alert(`Investment successful! ${result.message}`);
      setInvestmentAmount('');
      setSelectedAsset(null);
      await fetchData(); // Refresh all data
      
    } catch (error: unknown) {
      alert(`Investment failed: ${error.message || 'Unknown error'}`);
    } finally {
      setInvesting(false);
    }
  };

  const calculateTotalInvestmentValue = () => {
    return userInvestments.reduce((total, investment) => total + investment.current_value, 0);
  };

  const calculateTotalProfitLoss = () => {
    return userInvestments.reduce((total, investment) => total + investment.profit_loss, 0);
  };

  if (loading) {
    return (
      <div className="mx-0 flex-col items-center justify-content-center space-y-4 w-full overflow-x-hidden">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-0 flex-col items-center justify-content-center space-y-4 w-full overflow-x-hidden p-4 mb-20 lg:mb-5">
      {/* Wallet Balance and Equity */}
      <div className="flex flex-col sm:flex-row justify-around items-center w-full py-3 border border-indigo-400 rounded-xl"> 
        <div className="flex-col text-center p-4 w-full sm:w-2/5 rounded-xl bg-gradient-to-br from-orange-500 to-amber-900 mb-2 sm:mb-0">
          Cash Balance: <br />
          <span className="text-xl font-bold">{formatCurrency(walletData?.balance || 0)}</span>
        </div>
        <div className="flex-col text-center p-4 w-full sm:w-2/5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
          Total Equity:<br />
          <span className="text-xl font-bold">{formatCurrency(walletData?.equity || 0)}</span>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="flex flex-col sm:flex-row justify-around items-center w-full py-3 border border-purple-400 rounded-xl">
        <div className="flex-col text-center p-3 w-full sm:w-2/5 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 mb-2 sm:mb-0">
          Total Invested: <br />
          <span className="text-lg font-semibold">
            {formatCurrency(userInvestments.reduce((sum, inv) => sum + inv.invested_amount, 0))}
          </span>
        </div>
        <div className="flex-col text-center p-3 w-full sm:w-2/5 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600">
          Current Value: <br />
          <span className="text-lg font-semibold">
            {formatCurrency(calculateTotalInvestmentValue())}
          </span>
        </div>
      </div>

      {/* My Active Investments */}
      {userInvestments.length > 0 ? (
        <div className="w-full bg-gradient-to-br from-blue-900 to-purple-900 rounded-xl p-4 text-white">
          <h3 className="text-xl font-bold mb-4 text-center">My Active Investments</h3>
          <div className="space-y-3">
            {userInvestments.map((investment) => (
              <div key={investment.id} className="bg-blue-800 rounded-lg p-4 hover:bg-blue-700 transition duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{investment.asset_name}</h4>
                    <div className="text-sm text-blue-200 mt-1">
                      <p>{investment.units.toFixed(4)} units</p>
                      <p>Entry: ${investment.entry_price.toLocaleString()}</p>
                      <p>Current: ${investment.current_price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right flex-1">
                    <p className="font-semibold text-lg">{formatCurrency(investment.current_value)}</p>
                    <p className={`text-sm ${investment.profit_loss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      {investment.profit_loss >= 0 ? '+' : ''}{formatCurrency(Math.abs(investment.profit_loss))} 
                      ({investment.profit_loss_percentage >= 0 ? '+' : ''}{investment.profit_loss_percentage.toFixed(2)}%)
                    </p>
                    <p className="text-xs text-blue-300 mt-1">
                      Invested: {formatCurrency(investment.invested_amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-around items-center w-full py-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl px-3 text-white"> 
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" className="mx-auto mb-4 text-gray-400" viewBox="0 0 16 16">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM4.5 7.5a.5.5 0 0 1 0-1h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5z"/>
            </svg>
            <p className="text-xl mb-2">No Active Investments</p>
            <p className="text-gray-400">Start investing to build your portfolio</p>
          </div>
        </div>
      )}

      {/* Market Assets */}
      <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-white">
        <h3 className="text-xl font-bold mb-4 text-center">Live Market Assets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketAssets.map((asset) => (
            <div 
              key={asset.id} 
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition duration-200 cursor-pointer"
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{asset.name}</h4>
                  <p className="text-sm text-gray-300">{asset.symbol} • {asset.type}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  asset.change_percentage >= 0 ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {asset.change_percentage >= 0 ? '+' : ''}{asset.change_percentage}%
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Current Price:</span>
                  <span className="font-semibold">
                    {asset.type === 'forex' || asset.type === 'commodity' ? '$' : ''}
                    {asset.current_price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Moving Average:</span>
                  <span className="text-gray-300">{asset.moving_average.toFixed(4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Trend:</span>
                  <span className={`font-semibold ${
                    asset.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {asset.trend.toUpperCase()}
                  </span>
                </div>
              </div>
              
            
              <div className="mt-3 flex space-x-2">
                <a 
                  href={asset.chart_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded text-sm transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Chart
                </a>
                <button 
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAsset(asset);
                  }}
                >
                  Invest
                </button>
                {/* Add this new Trade button */}
                <Link 
                  to={`/trading/${asset.id}`}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-center py-2 rounded text-sm transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  Trade
                </Link>

              </div>

            </div>
          ))}
        </div>
      </div>


          <Trading/>
          
      {/* Investment Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Invest in {selectedAsset.name}
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Current Price:</span>
                <span className="font-semibold">
                  {selectedAsset.type === 'forex' || selectedAsset.type === 'commodity' ? '$' : ''}
                  {selectedAsset.current_price.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">24h Change:</span>
                <span className={selectedAsset.change_percentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {selectedAsset.change_percentage >= 0 ? '+' : ''}{selectedAsset.change_percentage}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Available Balance:</span>
                <span className="font-semibold">{formatCurrency(walletData?.balance || 0)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 mb-2">
                Investment Amount ({currentCurrency.code})
              </label>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Min: {formatCurrency(100)}
              </p>
            </div>

            {investmentAmount && parseFloat(investmentAmount) > 0 && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Investment Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Units to buy:</span>
                    <span className="font-semibold">
                      {(parseFloat(investmentAmount) / selectedAsset.current_price).toFixed(4)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated value:</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(investmentAmount))}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setSelectedAsset(null);
                  setInvestmentAmount('');
                }}
                className="flex-1 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-semibold transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleInvest(selectedAsset)}
                disabled={investing || !investmentAmount || parseFloat(investmentAmount) <= 0}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition duration-200 disabled:cursor-not-allowed"
              >
                {investing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Investing...
                  </div>
                ) : (
                  'Confirm Invest'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assets;