"use client"

import { motion } from "framer-motion"
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"

export interface StockData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  shares: number
  value: number
  logo?: string
  color: string
}

interface StockCardProps {
  stock: StockData
  index: number
}

export default function StockCard({ stock, index }: StockCardProps) {
  const isPositive = stock.change >= 0

  return (
    <motion.div
      className="h-full w-full overflow-hidden rounded-xl bg-white p-4 shadow-md dark:bg-dark-surface"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: stock.color }}
          >
            {stock.logo ? (
              <img src={stock.logo || "/placeholder.svg"} alt={stock.symbol} className="h-8 w-8" />
            ) : (
              <span className="text-lg font-bold">{stock.symbol.substring(0, 2)}</span>
            )}
          </div>
          <div>
            <h3 className="font-bold">{stock.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stock.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold">${stock.price.toFixed(2)}</p>
          <div
            className={`flex items-center justify-end ${
              isPositive ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"
            }`}
          >
            {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            <span className="text-xs font-medium">
              {isPositive ? "+" : ""}
              {stock.change.toFixed(2)} ({isPositive ? "+" : ""}
              {stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Shares</p>
          <p className="font-medium">{stock.shares}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">Value</p>
          <p className="text-lg font-bold">${stock.value.toLocaleString()}</p>
        </div>
      </div>

      {/* Mini chart placeholder */}
      <div className="mt-4 h-12 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
        <svg viewBox="0 0 100 20" className="h-full w-full">
          <path
            d={`M 0,${isPositive ? 20 : 10} ${generateRandomPath(isPositive)} L 100,${isPositive ? 5 : 15} L 100,20 L 0,20 Z`}
            fill={`${stock.color}20`}
          />
          <path
            d={`M 0,${isPositive ? 20 : 10} ${generateRandomPath(isPositive)} L 100,${isPositive ? 5 : 15}`}
            fill="none"
            stroke={stock.color}
            strokeWidth="1"
          />
        </svg>
      </div>
    </motion.div>
  )
}

// Helper function to generate a random path for the mini chart
function generateRandomPath(isPositive: boolean) {
  let path = ""
  const points = 10
  for (let i = 1; i < points; i++) {
    const x = (i * 100) / points
    // For positive trend, y values should generally decrease (SVG y-axis is inverted)
    // For negative trend, y values should generally increase
    const randomFactor = Math.random() * 5
    const trend = isPositive ? -i / 2 : i / 2
    const y = 10 + trend + randomFactor
    path += ` L ${x},${y}`
  }
  return path
}
