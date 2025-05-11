"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation" // Fixed import for App Router
import AssetCard from "@/components/AssetCard"
import AIAdvisor from "@/components/AIAdvisor"
import ImpactAssessment from "@/components/ImpactAssessment"
import PortfolioRestrictions from "@/components/PortfolioRestrictions"
import { useTheme } from "@/contexts/ThemeContext"
import {
  ScaleIcon,
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import { motion, AnimatePresence } from "framer-motion"
import AssetDistributionChart from "@/components/AssetDistributionChart"

// Import the new components at the top of the file
import AnimatedNetWorthCard from "@/components/AnimatedNetWorthCard"
import StockSwiper from "@/components/StockSwiper"
import type { StockData } from "@/components/StockCard"

export default function Dashboard() {
  const router = useRouter()
  const { darkMode } = useTheme()
  const [currentPage, setCurrentPage] = useState(0)
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    assets: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock client portfolio data - replace with real data source
  const [clientPortfolio, setClientPortfolio] = useState({
    netWorth: 0.0,
    realEstateValue: 0.0, // if this value is 0 then we assume you are not a home owner and prompt you to find out how to become one
    //stockValue: 0, //if this value is 0 then we assume you have not started investing in stocks and prompt you on howo to get started
    //totalAssets: 0,
    //liabilities: 0,
  })

  // Calculate net worth
  //const netWorth = clientPortfolio.totalAssets - clientPortfolio.liabilities

  // Mock data for financial standing (replace with real data)
  const [financialStanding, setFinancialStanding] = useState({
    jamaicaPercentile: 0, // Top 5% in Jamaica
    worldPercentile: 0, // Top 20% globally
    jamaicaRank: 0, // Rank among Jamaicans
    worldRank: 0, // Rank globally
  })

  const [mockStocks, setMockStocks] = useState<StockData[]>()

  // Fetch data from PostgreSQL database
  useEffect(() => {
    // For demo purposes, let's simulate loading data
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token")

      if (!token){
        console.error("No token found!");
        return;
      }

      console.log("Sending token: ", token);

      try {
        setLoading(true)

        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data for demonstration
        setClientPortfolio({
          netWorth: 100000,
          realEstateValue: 250000,
          //stockValue: 120000,
          //totalAssets: 420000,
          //liabilities: 180000,
        })
        
        setFinancialStanding({
          jamaicaPercentile: 95,
          worldPercentile: 80,
          jamaicaRank: 15000,
          worldRank: 400000000,
        })


        const response = await fetch("http://localhost:5000/api/auth/finance", {
          method: "GET", 
          headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
          }
        })

        console.log("This is response: ", response)
        
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data Status: ${response.status}");
        }

        const data = await response.json()
        console.log("This is data: ", data)
        setMockStocks(data)

        // Mock data for demonstration
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        //setError("Unable to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Add this mock stock data after the useEffect hook

  /*console.log("This is data: ", data)
  const mockStocks: StockData[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 187.68,
      change: 1.23,
      changePercent: 0.66,
      shares: 15,
      value: 2815.2,
      color: "#5856d6",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 337.22,
      change: 2.45,
      changePercent: 0.73,
      shares: 8,
      value: 2697.76,
      color: "#34c759",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.65,
      change: -0.87,
      changePercent: -0.61,
      shares: 12,
      value: 1711.8,
      color: "#ff9500",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 178.12,
      change: 1.05,
      changePercent: 0.59,
      shares: 10,
      value: 1781.2,
      color: "#ff2d55",
    },
    {
      symbol: "NFLX",
      name: "Netflix Inc.",
      price: 628.78,
      change: -3.22,
      changePercent: -0.51,
      shares: 3,
      value: 1886.34,
      color: "#007aff",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 177.35,
      change: 5.67,
      changePercent: 3.3,
      shares: 12,
      value: 2128.2,
      color: "#af52de",
    },
  ]*/

  const pages = [
    {
      title: "Financial Overview",
      content: (
        <div className="space-y-6">
          <AnimatedNetWorthCard
            netWorth={clientPortfolio.netWorth}
            jamaicaRank={financialStanding.jamaicaRank}
            worldRank={financialStanding.worldRank}
          />
{/* 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div> */}

          {mockStocks && mockStocks.length > 0 ? (
            <StockSwiper stocks={mockStocks} />
          ) : (
            <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow">
              <h3 className="text-lg font-medium mb-2">Your Stock Portfolio</h3>
              <p className="text-gray-500 dark:text-gray-400">
                No stocks in your portfolio yet. When you add stocks, they'll appear here.
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Asset Distribution",
      content: (
        <div className="space-y-6">
          <AssetDistributionChart portfolio={clientPortfolio} />
        </div>
      ),
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
                  <a href="/home-ownership-guide" className="ml-1 text-yellow-600 dark:text-yellow-300 underline">
                    Learn more
                  </a>
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
                  <a href="/investing-guide" className="ml-1 text-blue-600 dark:text-blue-300 underline">
                    Get started
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-dark-surface p-4 rounded-xl">
            <AIAdvisor compact />
          </div>
        </div>
      ),
    },
    {
      title: "Advanced Analysis",
      content: (
        <div className="space-y-6">
          <ImpactAssessment compact />
          <PortfolioRestrictions compact />
        </div>
      ),
    },
  ]

  // Loading and error states
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex justify-center items-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Loading your financial dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-50 dark:bg-red-900 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700 dark:text-red-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

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
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <span className="text-sm text-gray-500">
            {currentPage + 1} / {pages.length}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
            disabled={currentPage === pages.length - 1}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg disabled:opacity-50"
            aria-label="Next page"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Swipeable Content */}
      <div className="overflow-hidden relative min-h-[600px]">
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
              currentPage === index ? "bg-gradient-to-r from-emerald-400 to-blue-500" : "bg-gray-300 dark:bg-gray-700"
            }`}
            aria-label={`Go to page ${index + 1}`}
            aria-current={currentPage === index ? "page" : undefined}
          />
        ))}
      </div>
    </div>
  )
}
