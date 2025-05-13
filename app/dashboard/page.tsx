"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "@/contexts/ThemeContext"
import NetWorthCard from "@/components/NetWorthCard"
import PortfolioTable from "@/components/PortfolioTable"
import type { StockData } from "@/components/PortfolioTable"
import StockTicker from "@/components/StockTicker"


export default function Dashboard() {
  const router = useRouter()
  const { darkMode } = useTheme()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          throw new Error(`Failed to fetch dashboard data. Status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Dashboard data:", data)
        
        // Update stock data
        setStockData(data.assets || [])
        
        // Update portfolio net worth
        setClientPortfolio(data.netWorth || { netWorth: 0 })
        
        setError(null)
      } catch (err) {
        console.error("Error fetching dashboard data:", err)
        setError("Your Portfolio is Empty. Please upload csv with portfolio dat to get started.")
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

  // Error state
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