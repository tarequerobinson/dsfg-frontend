"use client"

import { useState } from "react"
import AssetCard from "@/components/AssetCard"
import AssetChart from "@/components/AssetChart"
import AIAdvisor from "@/components/AIAdvisor"
import PortfolioSummary from "@/components/PortfolioSummary"
import ImpactAssessment from "@/components/ImpactAssessment"
import PortfolioRestrictions from "@/components/PortfolioRestrictions"
import { useTheme } from "@/contexts/ThemeContext"
import {
  ChartPieIcon,
  ScaleIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon, ChevronRightIcon
} from "@heroicons/react/24/outline"
import {motion, AnimatePresence } from "framer-motion"

export default function Dashboard() {
  const { darkMode } = useTheme()
  const [currentPage, setCurrentPage] = useState(0)
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    assets: true
  })

  // Mock client portfolio data - replace with real data source
  const [clientPortfolio] = useState({
    realEstateValue: 123, // if this value is 0 then we assume you are not a home owner and prompt you to find out how to become one 
    stockValue: 0, //if this value is 0 then we assume you have not started investing in stocks and prompt you on howo to get started 
    totalAssets: 900000,
    liabilities: 75000
  })

  const pages = [
    {
      title: "Financial Overview",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <PortfolioSummary />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AssetCard 
              title="Total Assets" 
              value={`$${clientPortfolio.totalAssets.toLocaleString()}`} 
              change="+2.4%"
              icon={CurrencyDollarIcon}
              color="text-green-500"
            />
            <AssetCard 
              title="Liabilities" 
              value={`-$${Math.abs(clientPortfolio.liabilities).toLocaleString()}`} 
              change="-0.8%"
              icon={ScaleIcon}
              color="text-red-500"
            />
          </div>
          <div className="bg-white dark:bg-dark-surface p-4 rounded-xl">
            <AssetChart darkMode={darkMode} simplified />
          </div>
        </div>
      )
    },
    {
      title: "Asset Details",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {clientPortfolio.realEstateValue > 0 ? (
              <AssetCard 
                title="Real Estate" 
                value={`$${clientPortfolio.realEstateValue.toLocaleString()}`} 
                change="+2.5%"
                icon={HomeIcon}
                color="text-blue-500"
              />
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-lg">
                <p className="text-sm text-yellow-700 dark:text-yellow-200">
                  We notice you may not yet be a homeowner. Here are some tips on becoming a home owner: 
                  <a href="/home-ownership-guide" className="ml-1 text-yellow-600 dark:text-yellow-300 underline">Learn more</a>
                </p>
              </div>
            )}

            {clientPortfolio.stockValue > 0 ? (
              <AssetCard 
                title="Investments" 
                value={`$${clientPortfolio.stockValue.toLocaleString()}`} 
                change="+3.7%"
                icon={ChartBarIcon}
                color="text-purple-500"
              />
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-200">
                  We notice you may not be investing in stocks. Here's how to get started with your stock portfolio:
                  <a href="/investing-guide" className="ml-1 text-blue-600 dark:text-blue-300 underline">Get started</a>
                </p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-dark-surface p-4 rounded-xl">
            <AIAdvisor compact />
          </div>
        </div>
      )
    },
    {
      title: "Advanced Analysis",
      content: (
        <div className="space-y-6">
          <ImpactAssessment compact />
          <PortfolioRestrictions compact />
        </div>
      )
    }
  ]

  // Rest of the component remains the same...
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header with Pagination */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          {pages[currentPage].title}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg disabled:opacity-50"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <span className="text-sm text-gray-500">
            {currentPage + 1} / {pages.length}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
            disabled={currentPage === pages.length - 1}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg disabled:opacity-50"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Swipeable Content */}
      <div className="overflow-hidden relative h-[600px]">
        <AnimatePresence initial={false} custom={currentPage}>
          <motion.div
            key={currentPage}
            initial={{ x: currentPage > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: currentPage > 0 ? -300 : 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="absolute w-full"
          >
            {pages[currentPage].content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {pages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`w-3 h-3 rounded-full ${
              currentPage === index 
                ? "bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent" 
                : "bg-gray-300 dark:bg-dark-border"
            }`}
          />
        ))}
      </div>
    </div>
  )
}