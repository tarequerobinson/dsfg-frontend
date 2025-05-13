"use client"

import React from "react"

interface NetWorthCardProps {
  netWorth: number
}

export default function NetWorthCard({ netWorth }: NetWorthCardProps) {
  return (
    <div className="bg-white dark:bg-dark-surface p-6 rounded-xl shadow">
      <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Net Worth</h2>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          ${netWorth.toLocaleString()}
        </span>
      </div>
    </div>
  )
}