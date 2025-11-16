// pages/Bonus.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, type ApiError } from '../services/api';
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

interface Bonus {
  id: number;
  title: string;
  description: string;
  amount: string;
  type: string;
  minDeposit: number;
  claimed: boolean;
}

const Bonus = () => {
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [bonusActivities, setBonusActivities] = useState<Activity[]>([]);
  const [availableBonuses, setAvailableBonuses] = useState<Bonus[]>([
    {
      id: 1,
      title: "Welcome Bonus",
      description: "Get 10% bonus on your first deposit",
      amount: "10%",
      type: "percentage",
      minDeposit: 1000,
      claimed: false
    },
    {
      id: 2,
      title: "Weekly Reward",
      description: "Claim your weekly trading bonus",
      amount: "500",
      type: "fixed",
      minDeposit: 0,
      claimed: false
    },
    {
      id: 3,
      title: "Referral Bonus",
      description: "Earn 1,000 for each friend you refer",
      amount: "1,000",
      type: "fixed",
      minDeposit: 0,
      claimed: false
    },
    {
      id: 4,
      title: "Loyalty Bonus",
      description: "Monthly bonus for active traders",
      amount: "5%",
      type: "percentage",
      minDeposit: 5000,
      claimed: true
    }
  ]);
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
      const bonusActivitiesList = activities
        .filter(activity => activity.activity_type === 'bonus')
        .slice(0, 10);
      setBonusActivities(bonusActivitiesList);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      // Set fallback values
      setWalletBalance(0);
      setBonusActivities([]);
    }
  };

  const formatBonusAmount = (bonus: Bonus) => {
    if (bonus.type === 'percentage') {
      return bonus.amount;
    }
    return `${currentCurrency.symbol} ${bonus.amount}`;
  };

  const claimBonus = async (bonusId: number, bonusAmount: string, bonusType: string) => {
    setLoading(true);
    try {
      // Calculate bonus amount
      let amount = 0;
      if (bonusType === 'fixed') {
        amount = parseFloat(bonusAmount.replace(',', ''));
      } else {
        // For percentage bonuses, we'd need deposit amount - simplified for demo
        amount = 1000; // Default fixed amount for percentage bonuses in demo
      }

      // In a real app, you would call the backend API here
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark bonus as claimed
      setAvailableBonuses(prev => 
        prev.map(bonus => 
          bonus.id === bonusId ? { ...bonus, claimed: true } : bonus
        )
      );

      // Add to activity list
      const bonusTitle = availableBonuses.find(b => b.id === bonusId)?.title || 'Bonus';
      const newActivity: Activity = {
        id: Date.now().toString(),
        user_phone: user?.phone_number || '',
        activity_type: 'bonus',
        amount: amount,
        description: `Claimed ${bonusTitle}`,
        timestamp: new Date().toISOString(),
        status: 'completed'
      };
      
      setBonusActivities(prev => [newActivity, ...prev]);
      
      // Update wallet balance locally (in real app, this would come from backend)
      setWalletBalance(prev => prev + amount);

      alert(`Bonus claimed successfully! ${formatCurrency(amount)} has been added to your wallet.`);
      
    } catch (error: unknown) {
      const apiError = error as ApiError;
      alert(`Failed to claim bonus: ${apiError.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const shareReferral = () => {
    const referralCode = user?.phone_number || 'PESADASH';
    const referralLink = `https://pesadash.com/invite?ref=${referralCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Join PesaDash - Smart Investing',
        text: `Join PesaDash and get started with smart investing! Use my referral code: ${referralCode}`,
        url: referralLink,
      });
    } else {
      navigator.clipboard.writeText(referralLink);
      alert('Referral link copied to clipboard!');
    }
  };

  const totalBonusesEarned = bonusActivities.reduce((sum, activity) => sum + activity.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-purple-900 p-4">
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
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bonus & Rewards</h1>
        </div>

        {/* Current Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-2">Available Balance</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(walletBalance)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Total bonuses earned: {formatCurrency(totalBonusesEarned)}
            </p>
          </div>
        </div>

        {/* Available Bonuses */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Available Bonuses
          </h2>
          <div className="space-y-4">
            {availableBonuses.map((bonus) => (
              <div 
                key={bonus.id}
                className={`p-4 rounded-xl border-2 ${
                  bonus.claimed 
                    ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700' 
                    : 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      {bonus.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {bonus.description}
                    </p>
                    {bonus.minDeposit > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Min. deposit: {formatCurrency(bonus.minDeposit)}
                      </p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    bonus.claimed 
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      : 'bg-green-500 text-white'
                  }`}>
                    {formatBonusAmount(bonus)}
                  </span>
                </div>
                <button
                  onClick={() => !bonus.claimed && claimBonus(bonus.id, bonus.amount, bonus.type)}
                  disabled={bonus.claimed || loading}
                  className={`w-full py-2 rounded-lg font-semibold transition duration-200 ${
                    bonus.claimed
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white'
                  }`}
                >
                  {bonus.claimed ? 'Claimed' : 'Claim Bonus'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5m-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Invite Friends & Earn</h3>
            <p className="text-purple-100 mb-4">
              Get {formatCurrency(1000)} for each friend who joins and deposits
            </p>
          </div>
          <button
            onClick={shareReferral}
            className="w-full py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition duration-200"
          >
            Share Referral Link
          </button>
          <div className="mt-3 text-center text-purple-200 text-sm">
            Your code: <strong>{user?.phone_number || 'PESADASH'}</strong>
          </div>
        </div>

        {/* Bonus History */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Bonus History
          </h3>
          <div className="space-y-3">
            {bonusActivities.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="text-green-600" viewBox="0 0 16 16">
                      <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleDateString()}
                    </p>
                  </div>
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
            {bonusActivities.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
                  </svg>
                </div>
                <p>No bonus history yet</p>
                <p className="text-sm mt-1">Claim your first bonus to get started!</p>
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <h4 className="font-semibold text-gray-800 dark:text-white mb-2 text-sm">
            Terms & Conditions
          </h4>
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Bonuses are subject to terms and conditions</li>
            <li>• Some bonuses may require minimum deposit</li>
            <li>• Bonus funds may have trading requirements</li>
            <li>• PesaDash reserves the right to modify bonus offers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Bonus;