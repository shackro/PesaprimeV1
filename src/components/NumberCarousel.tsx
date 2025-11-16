import { useCurrency } from '../contexts/CurrencyContext';

const NumberCarousel = () => {
  const { formatCurrency } = useCurrency();
  
  const numbers = Array.from({ length: 75 }, (_, i) => ({
    phone: `+254 ${Math.floor(12 + Math.random() * 87)} xxx ${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`,
    profit: [25,22,-3,-43, 50, 75, -15, -30, 10, 35, -5, 60,-2,-28,2,90,-45, 20, -10, 45, 5, -20, 30][i],
    amount: Math.floor(5000 + Math.random() * 95000)
  }));

  return (
    <div className="mt-6 relative overflow-hidden bg-gray-800 rounded-lg py-4">
      <div className="relative">
        {/* Left Gradient Overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-800 to-transparent z-10"></div>
        
        {/* Right Gradient Overlay */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-800 to-transparent z-10"></div>
        
        {/* Carousel Track */}
        <div className="flex space-x-3 animate-scroll">
          {[...numbers, ...numbers].map((number, index) => (
            <div key={index} className="flex-shrink-0 w-grow bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg p-2 text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              {/* Number */}
              <div className="text-white font-mono font-bold text-lg mb-1">{number.phone}</div>
              
              {/* Status Indicator */}
              <div className="flex items-center justify-center space-x-1 mb-2">
                {number.profit > 0 ? (
                  <div className="flex items-center bg-green-500 bg-opacity-30 px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-green-300 text-xs font-semibold ml-1">+{number.profit}%</span>
                  </div>
                ) : number.profit < 0 ? (
                  <div className="flex items-center bg-red-500 bg-opacity-30 px-2 py-1 rounded-full">
                    <svg className="w-3 h-3 text-red-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-red-300 text-xs font-semibold ml-1">{number.profit}%</span>
                  </div>
                ) : (
                  <div className="flex items-center bg-gray-500 bg-opacity-30 px-2 py-1 rounded-full">
                    <span className="text-gray-300 text-xs font-semibold">0%</span>
                  </div>
                )}
              </div>
              
              {/* Amount */}
              <div className="text-teal-200 text-sm font-semibold">{formatCurrency(number.amount)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NumberCarousel;