import type React from "react"
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react"

interface AssetCardProps {
  title: string
  value: string
  change: string
}

const AssetCard: React.FC<AssetCardProps> = ({ title, value, change }) => {
  const isPositive = change.startsWith("+")

  return (
    <div className="bg-white dark:bg-dark-surface overflow-hidden shadow rounded-lg transition-colors duration-200">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-dark-text">{title}</h3>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-semibold text-gray-900 dark:text-dark-text">{value}</p>
          <p
            className={`mt-2 flex items-center text-sm ${
              isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpIcon
                className="self-center flex-shrink-0 h-5 w-5 text-green-500 dark:text-green-400"
                aria-hidden="true"
              />
            ) : (
              <ArrowDownIcon
                className="self-center flex-shrink-0 h-5 w-5 text-red-500 dark:text-red-400"
                aria-hidden="true"
              />
            )}
            <span className="ml-1">{change}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AssetCard

