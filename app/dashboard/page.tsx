"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import NetWorthCard from "@/components/NetWorthCard"
import PortfolioTable from "@/components/PortfolioTable"
import type { StockData } from "@/components/PortfolioTable"
import StockTicker from "@/components/StockTicker"
import { PlusCircle, Upload } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const { darkMode } = useTheme()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEmptyPortfolio, setIsEmptyPortfolio] = useState(false)

  // State for portfolio data
  const [clientPortfolio, setClientPortfolio] = useState({
    netWorth: 0.0,
  })

  // State for stocks data
  const [stockData, setStockData] = useState<StockData[]>([])

  // Fetch data from PostgreSQL database
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        console.error("No token found!")
        router.push("/login") // Redirect to login if no token
        return
      }

      try {
        setLoading(true)

        const response = await fetch("http://localhost:5000/api/auth/finance", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        })

        if (!response.ok) {
          if (response.status === 404) {
            // Handle specifically empty portfolio case
            setIsEmptyPortfolio(true)
            return
          }
          throw new Error(`Failed to fetch dashboard data. Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Dashboard data:", data)

        // Check if portfolio is empty
        if (!data.assets || data.assets.length === 0) {
          setIsEmptyPortfolio(true)
          return
        }

        // Update stock data
        setStockData(data.assets || [])

        // Update portfolio net worth
        setClientPortfolio({
          netWorth: data.netWorth?.netWorth || 0
        })

        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Failed to load your financial data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  // Loading state
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

  // Error state for actual errors
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

  // Empty portfolio state
  if (isEmptyPortfolio) {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              Financial Overview
            </h1>
          </div>

          <StockTicker darkMode={darkMode} />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mt-6">
            <div className="text-center py-10">
              <div className="mx-auto mb-4 h-20 w-20 text-gray-400 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <PlusCircle size={40} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Your Portfolio is Empty</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start tracking your investments by uploading your portfolio data or adding assets manually.
              </p>

              <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">


              </div>
            </div>
          </div>
        </div>
    )
  }

  // Normal dashboard view with data
  return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Financial Overview
          </h1>
        </div>

        <StockTicker darkMode={darkMode} />

        {/* Content */}
        <div className="space-y-6">
          {/* Net Worth Card */}
          <NetWorthCard netWorth={clientPortfolio.netWorth} />

          {/* Portfolio Table */}
          <PortfolioTable stocks={stockData} />
        </div>
      </div>
  )
}