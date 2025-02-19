import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AssetDistributionChart = ({ portfolio = {} }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  
  // Simplified asset categories without icons
  const assetData = [
    {
      name: 'Real Estate',
      value: portfolio.realEstateValue || 0,
      color: '#3B82F6', // blue-500
      subCategories: [
        { name: 'Primary Residence', value: (portfolio.realEstateValue || 0) * 0.7 },
        { name: 'Investment Properties', value: (portfolio.realEstateValue || 0) * 0.3 }
      ]
    },
    {
      name: 'Stocks & Investments',
      value: portfolio.stockValue || 0,
      color: '#8B5CF6', // purple-500
      subCategories: [
        { name: 'Individual Stocks', value: (portfolio.stockValue || 0) * 0.4 },
        { name: 'Mutual Funds', value: (portfolio.stockValue || 0) * 0.3 },
        { name: 'ETFs', value: (portfolio.stockValue || 0) * 0.3 }
      ]
    },
    {
      name: 'Cash & Equivalents',
      value: (portfolio.totalAssets || 0) * 0.15,
      color: '#10B981', // emerald-500
      subCategories: [
        { name: 'Savings', value: (portfolio.totalAssets || 0) * 0.1 },
        { name: 'Checking', value: (portfolio.totalAssets || 0) * 0.05 }
      ]
    },
    {
      name: 'Alternative Investments',
      value: (portfolio.totalAssets || 0) * 0.1,
      color: '#F59E0B', // amber-500
      subCategories: [
        { name: 'Cryptocurrencies', value: (portfolio.totalAssets || 0) * 0.05 },
        { name: 'Commodities', value: (portfolio.totalAssets || 0) * 0.03 },
        { name: 'Art & Collectibles', value: (portfolio.totalAssets || 0) * 0.02 }
      ]
    }
  ].filter(item => item.value > 0);

  const totalAssets = assetData.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalAssets) * 100).toFixed(1);
      
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold mb-2">{data.name}</h3>
          <p className="text-lg font-bold">${data.value.toLocaleString()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {percentage}% of portfolio
          </p>
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium mb-1">Breakdown:</p>
            {data.subCategories.map((sub, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{sub.name}</span>
                <span className="font-medium">${sub.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[32rem] bg-white dark:bg-dark-surface p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Asset Distribution</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Assets</p>
          <p className="text-lg font-bold">${totalAssets.toLocaleString()}</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            data={assetData}
            cx="50%"
            cy="45%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={4}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {assetData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                className="transition-all duration-200"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            formatter={(value, entry) => (
              <span className="text-sm">
                {value}
                <span className="ml-1 text-gray-500">
                  ({((entry.payload.value / totalAssets) * 100).toFixed(1)}%)
                </span>
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Asset Breakdown Table */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {assetData.map((asset, index) => (
          <div 
            key={index}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            style={{ borderLeftColor: asset.color, borderLeftWidth: '4px' }}
          >
            <h4 className="font-semibold mb-2">{asset.name}</h4>
            <p className="text-lg font-bold mb-1">
              ${asset.value.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {((asset.value / totalAssets) * 100).toFixed(1)}% of portfolio
            </p>
            <div className="space-y-1">
              {asset.subCategories.map((sub, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{sub.name}</span>
                  <span>${sub.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssetDistributionChart;