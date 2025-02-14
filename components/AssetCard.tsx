"use client"

import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline"

interface AssetCardProps {
  title: string
  value: string
  change?: string  // Make change optional
  icon: React.ElementType
  color: string
}

const AssetCard: React.FC<AssetCardProps> = ({ title, value, change, icon: Icon, color }) => {
  // Safely handle change prop
  const isPositive = change ? change.startsWith("+") : false
  const changeText = change || "N/A"  // Default value

  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow-sm border dark:border-dark-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text">{title}</h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
        
        {change && (
          <span className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            )}
            {changeText}
          </span>
        )}
      </div>
    </div>
  )
}

export default AssetCard