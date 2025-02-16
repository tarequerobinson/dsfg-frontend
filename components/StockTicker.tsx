import React, { useState, useEffect } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

const MOCK_STOCKS = [
  { 
    symbol: "NCBFG", 
    name: "NCB Financial Group",
    price: 150.25, 
    change: 2.5, 
    volume: "1.2M",
    logo: "https://cdn-ukwest.onetrust.com/logos/ebec2086-af50-44d7-9dd2-b60a3b579bc4/7fb33f90-b3b0-4e2c-9ed6-562d57ce14a8/2fdd2e07-6ec9-447b-950b-f763f0752fea/NCB_National_Commercial_Bank.png"
  },
  { 
    symbol: "JMMBGL", 
    name: "JMMB Group Limited",
    price: 45.75, 
    change: -0.5, 
    volume: "856K",
    logo: "https://www.jmmb.com/sites/default/files/images/Logos/Logo-redAndWhite.png"
  },
  { 
    symbol: "PROVEN", 
    name: "Proven Investments",
    price: 62.3, 
    change: -1.8, 
    volume: "891K",
    logo: "https://weareproven.com/wp-content/uploads/2023/05/wealth-rgb.png"
  },
  { 
    symbol: "SEP", 
    name: "Seprod Limited",
    price: 73.45, 
    change: 1.2, 
    volume: "450K",
    logo: "https://www.seprod.com/wp-content/uploads/2022/06/seprod-logo1.png"
  },
  { 
    symbol: "JSE", 
    name: "Jamaica Stock Exchange",
    price: 28.90, 
    change: -0.8, 
    volume: "325K",
    logo: "https://jadiasporaengage.mfaft.gov.jm/sites/default/files/styles/large/public/2024-01/JSE-Logo-1.png?itok=gRzE1mzc"
  },
  { 
    symbol: "BRG", 
    name: "Berger Paints Jamaica",
    price: 15.75, 
    change: 0.5, 
    volume: "215K",
    logo: "https://www.ansamcal.com/wp-content/uploads/2022/11/BERGER_Jamaica-Logo.png"
  },
  { 
    symbol: "GK", 
    name: "GraceKennedy Limited",
    price: 92.30, 
    change: 1.8, 
    volume: "678K",
    logo: "https://www.uwitorontogala.org/sites/torontogala/files/Grace-Kennedy-Group-Logo.png"
  },
  { 
    symbol: "DCJL", 
    name: "Dolla Financial",
    price: 3.45, 
    change: -0.3, 
    volume: "1.1M",
    logo: "https://dollafinancial.com/jm/wp-content/uploads/sites/2/2021/10/Dolla-Logo-ICON.png"
  },
  { 
    symbol: "SJ", 
    name: "Sagicor Group",
    price: 54.20, 
    change: 0.7, 
    volume: "892K",
    logo: "https://alliancefinancialja.com/wp-content/uploads/2023/10/Sagicor-Group-logo-01-600x400.png"
  },
  { 
    symbol: "PJAM", 
    name: "PanJam Investment",
    price: 67.80, 
    change: -1.2, 
    volume: "443K",
    logo: "https://www.caribbeanvalueinvestor.com/news/wp-content/uploads/2018/04/PANJAM-Investments-Ltd-TOP-10-Companies-Jamaica-Caribbean-Value-Investor.png"
  },
  { 
    symbol: "LASM", 
    name: "Lasco Manufacturing",
    price: 4.85, 
    change: 0.2, 
    volume: "765K",
    logo: "https://manufacturing.lascojamaica.com/wp-content/uploads/2022/03/lasco-manu.png"
  }
];

const StockTicker = ({ darkMode }) => {
  const [stocks, setStocks] = useState(MOCK_STOCKS);
  const [hoveredStock, setHoveredStock] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: (Math.random() - 0.5) * 4,
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => `J$${price.toFixed(2)}`;
  const duplicatedStocks = [...stocks, ...stocks];

  return (
    <div className="relative">
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
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    stock.change >= 0 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className={`text-lg font-semibold ${
                    stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {formatPrice(stock.price)}
                  </div>
                  <div className={`text-xs ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
                    Vol: {stock.volume}
                  </div>
                </div>
                
                <div className={`text-xs mt-1 flex items-center ${
                  stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stock.change >= 0 ? (
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(stock.change).toFixed(2)}% Today
                </div>
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