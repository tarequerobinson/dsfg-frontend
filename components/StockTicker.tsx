import React, { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import axios from 'axios';

// Map of stock symbols to their logo URLs
const STOCK_LOGOS = {
  "NCBFG": "https://cdn-ukwest.onetrust.com/logos/ebec2086-af50-44d7-9dd2-b60a3b579bc4/7fb33f90-b3b0-4e2c-9ed6-562d57ce14a8/2fdd2e07-6ec9-447b-950b-f763f0752fea/NCB_National_Commercial_Bank.png",
  "JMMBGL": "https://www.jmmb.com/sites/default/files/images/Logos/Logo-redAndWhite.png",
  "PROVEN": "https://weareproven.com/wp-content/uploads/2023/05/wealth-rgb.png",
  "SEP": "https://www.seprod.com/wp-content/uploads/2022/06/seprod-logo1.png",
  "JSE": "https://jadiasporaengage.mfaft.gov.jm/sites/default/files/styles/large/public/2024-01/JSE-Logo-1.png?itok=gRzE1mzc",
  "BRG": "https://www.ansamcal.com/wp-content/uploads/2022/11/BERGER_Jamaica-Logo.png",
  "GK": "https://www.uwitorontogala.org/sites/torontogala/files/Grace-Kennedy-Group-Logo.png",
  "DCJL": "https://dollafinancial.com/jm/wp-content/uploads/sites/2/2021/10/Dolla-Logo-ICON.png",
  "SJ": "https://alliancefinancialja.com/wp-content/uploads/2023/10/Sagicor-Group-logo-01-600x400.png",
  "PJAM": "https://www.caribbeanvalueinvestor.com/news/wp-content/uploads/2018/04/PANJAM-Investments-Ltd-TOP-10-Companies-Jamaica-Caribbean-Value-Investor.png",
  "LASM": "https://manufacturing.lascojamaica.com/wp-content/uploads/2022/03/lasco-manu.png"
};

// Default logo for stocks without a specific logo
const DEFAULT_LOGO = "https://www.jamstockex.com/wp-content/uploads/2015/12/JSE-Favicon.png";

const StockTicker = ({ darkMode }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredStock, setHoveredStock] = useState(null);

  // Fetch JSE prices from the backend
  useEffect(() => {
    const fetchJSEPrices = async () => {
      try {
        // Get the token from localStorage or wherever you store it
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("Authentication token not found");
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/auth/jse-prices', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Transform API data to match component format
        const formattedStocks = response.data.jse_prices.map(stock => {
          // Generate a random "change" percentage for visual effect
          // In a real application, you would calculate this from historical data
          const randomChange = (Math.random() - 0.5) * 4;
          
          return {
            symbol: stock.symbol,
            name: stock.name,
            price: stock.close_price,
            change: randomChange, // Random for demo purposes
            volume: `${Math.floor(Math.random() * 1000) + 100}K`, // Random volume for demo
            logo: STOCK_LOGOS[stock.symbol] || DEFAULT_LOGO
          };
        });

        setStocks(formattedStocks);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching JSE prices:", err);
        setError(err.message || "Failed to fetch stock data");
        setLoading(false);
      }
    };

    fetchJSEPrices();
  }, []);

  // Update prices with small random changes periodically (for visual effect)
  useEffect(() => {
    if (stocks.length === 0) return;

    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: (Math.random() - 0.5) * 4, // Random change for visual effect
        }))
      );
    }, 5000);
    
    return () => clearInterval(interval);
  }, [stocks]);

  const formatPrice = (price) => `J$${price.toFixed(2)}`;
  
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mr-3"></div>
        Loading stock data...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-6 rounded-lg ${darkMode ? "bg-red-900/20 text-red-200" : "bg-red-100 text-red-800"}`}>
        <p>Error loading stock data: {error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className={`p-6 rounded-lg ${darkMode ? "bg-zinc-800 text-white" : "bg-gray-100 text-gray-800"}`}>
        <p>No stock data available at this time.</p>
      </div>
    );
  }
  
  // Duplicate stocks array for continuous scrolling effect
  const duplicatedStocks = [...stocks, ...stocks];

  return (
    <div className="relative">
      <div> Closing prices as of the closing of the market</div>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-blue-600 opacity-75" />
      <div className="relative overflow-hidden mb-8 py-4">
        <div className="animate-ticker flex">
          {duplicatedStocks.map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className={`flex-shrink-0 p-4 rounded-xl ${
                darkMode ? "bg-zinc-800/90 backdrop-blur-sm" : "bg-white/90 backdrop-blur-sm"
              } shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-4 mx-3 min-w-[320px]
              border border-transparent hover:border-emerald-500/20
              ${hoveredStock === stock.symbol ? 'scale-105' : 'scale-100'}`}
              onMouseEnter={() => setHoveredStock(stock.symbol)}
              onMouseLeave={() => setHoveredStock(null)}
            >
              <div className={`w-14 h-14 rounded-lg overflow-hidden flex items-center justify-center 
                ${darkMode ? "bg-white" : "bg-gray-50"} p-2`}>
                <img 
                  src={stock.logo} 
                  alt={`${stock.symbol} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div>
                    <div className={`font-bold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {stock.symbol}
                    </div>
                    <div className={`text-xs ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
                      {stock.name}
                    </div>
                  </div>
                  {/* <div className={`text-xs px-2 py-1 rounded-full ${
                    stock.change >= 0 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div> */}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className={`text-lg font-semibold ${
                    stock.change >= 0 ? 'text-green-500' : 'text-green-500'
                  }`}>
                    {formatPrice(stock.price)}
                  </div>
                  {/* <div className={`text-xs ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
                    Vol: {stock.volume}
                  </div> */}
                </div>
                
                {/* <div className={`text-xs mt-1 flex items-center ${
                  stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stock.change >= 0 ? (
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(stock.change).toFixed(2)}% Today
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-600 to-emerald-500 opacity-75" />
      
      <style jsx global>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default StockTicker;