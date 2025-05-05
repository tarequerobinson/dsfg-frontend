"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"
import { TrophyIcon, GlobeAltIcon } from "@heroicons/react/24/outline"

interface AnimatedNetWorthCardProps {
  netWorth: number
  previousNetWorth?: number
  jamaicaRank: number
  worldRank: number
}

export default function AnimatedNetWorthCard({
  netWorth,
  previousNetWorth = netWorth * 0.98, // Default to 2% less if not provided
  jamaicaRank,
  worldRank,
}: AnimatedNetWorthCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const percentChange = ((netWorth - previousNetWorth) / previousNetWorth) * 100
  const isPositive = percentChange >= 0

  return (
    <div className="perspective-1000 relative h-64 w-full cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <motion.div
        className="relative h-full w-full rounded-xl transition-all duration-500"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Front of card - Net Worth */}
        <div
          className={`absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br ${
            isPositive
              ? "from-emerald-500/10 to-blue-500/10 dark:from-emerald-900/20 dark:to-blue-900/20"
              : "from-red-500/10 to-orange-500/10 dark:from-red-900/20 dark:to-orange-900/20"
          } p-6 shadow-lg`}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold">Net Worth</h2>
              <p className="text-sm opacity-70">Click to see your global ranking</p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-5xl font-bold">${netWorth.toLocaleString()}</p>
                  <div
                    className={`flex items-center ${
                      isPositive ? "text-emerald-500 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
                    }`}
                  >
                    {isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
                    <span className="text-sm font-medium">{Math.abs(percentChange).toFixed(1)}%</span>
                  </div>
                </div>
                <p className="mt-1 text-sm opacity-70">vs. previous month</p>
              </div>

              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 dark:bg-white/5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="h-10 w-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeOpacity="0.2"
                    strokeLinecap="round"
                  />
                  <motion.path
                    d="M50 5 A 45 45 0 1 1 49.9999 5"
                    stroke={isPositive ? "#10b981" : "#ef4444"}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 0.8 }}
                    transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
                  />
                </svg>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Back of card - Rankings */}
        <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-900/20 dark:to-purple-900/20 p-6 shadow-lg [transform:rotateY(180deg)]">
          <div className="flex h-full flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold">Global Standing</h2>
              <p className="text-sm opacity-70">Click to see your net worth</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                  <TrophyIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-70">Jamaica Rank</p>
                  <p className="text-2xl font-bold">#{jamaicaRank.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                  <GlobeAltIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium opacity-70">Global Rank</p>
                  <p className="text-2xl font-bold">#{worldRank.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hint to flip */}
      <div className="absolute bottom-2 right-2 rounded-full bg-white/20 p-1 text-xs dark:bg-white/10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      </div>
    </div>
  )
}
