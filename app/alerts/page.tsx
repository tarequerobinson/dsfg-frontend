"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { ArrowUpIcon, ArrowDownIcon, BellIcon, XIcon, CurrencyDollarIcon, PlusCircleIcon, ChartBarIcon } from "@heroicons/react/24/outline"

type Alert = {
  id: string
  symbol: string
  condition: "above" | "below"
  price: number
  email: boolean
  sms: boolean
  createdAt: Date
}

type Stock = {
  symbol: string
  price: number
  change: number
}

const MOCK_STOCKS: Stock[] = [
  { symbol: "NCBFG", price: 150.25, change: 2.5 },
  { symbol: "JMMBGL", price: 45.75, change: -0.5 },
  { symbol: "PJAM", price: 80.0, change: 1.2 },
  { symbol: "SEP", price: 62.3, change: -1.8 },
]

const JamaicaStockAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [symbol, setSymbol] = useState("")
  const [condition, setCondition] = useState<"above" | "below">("above")
  const [price, setPrice] = useState("")
  const [email, setEmail] = useState(true)
  const [sms, setSms] = useState(false)
  const [message, setMessage] = useState("")
  const [stocks, setStocks] = useState<Stock[]>(MOCK_STOCKS)
  const { darkMode } = useTheme()

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((prevStocks) =>
        prevStocks.map((stock) => ({
          ...stock,
          price: stock.price + (Math.random() - 0.5) * 2,
          change: (Math.random() - 0.5) * 4,
        })),
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault()
    const newAlert: Alert = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: symbol.toUpperCase(),
      condition,
      price: Number.parseFloat(price),
      email,
      sms,
      createdAt: new Date(),
    }
    setAlerts([...alerts, newAlert])
    setMessage("Alert created successfully")
    setSymbol("")
    setPrice("")
  }

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
    setMessage("Alert deleted successfully")
  }

  const formatPrice = (price: number) => `J$${price.toFixed(2)}`

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <div className={`relative min-h-screen ${darkMode ? "bg-zinc-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        {/* <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-blue-600 p-4 rounded-2xl mb-6">
            <CurrencyDollarIcon className="h-12 w-12 text-white" />
          </div>
          <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}>
            Jamaica Stock Alerts
          </h1>
          <p className={`text-lg ${darkMode ? "text-zinc-300" : "text-gray-600"}`}>
            Monitor your investments with real-time alerts
          </p>
        </div> */}

        {/* Stock Tickers */}
        <div className="mb-8 overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className={`p-4 rounded-xl ${darkMode ? "bg-zinc-800" : "bg-white"} shadow-sm flex items-center space-x-4 min-w-[200px]`}
              >
                <div className={`p-2 rounded-lg ${darkMode ? "bg-zinc-700" : "bg-gray-100"}`}>
                  <ChartBarIcon className={`w-6 h-6 ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`} />
                </div>
                <div>
                  <div className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                    {stock.symbol}
                  </div>
                  <div className={`text-sm ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {formatPrice(stock.price)}
                  </div>
                  <div className={`text-xs flex items-center ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {stock.change >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 mr-1" />
                    )}
                    {Math.abs(stock.change).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Alert Card */}
          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-zinc-800" : "bg-white"}`}>
            <div className="flex items-center mb-6">
              <PlusCircleIcon className="w-8 h-8 text-emerald-500 mr-3" />
              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Create New Alert
              </h2>
            </div>
            
            <form onSubmit={handleCreateAlert} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-gray-700"}`}>
                  Stock Symbol
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                      darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="Enter stock symbol..."
                  />
                  <CurrencyDollarIcon className={`absolute right-3 top-3.5 h-5 w-5 ${darkMode ? "text-zinc-400" : "text-gray-400"}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-gray-700"}`}>
                    Condition
                  </label>
                  <div className="relative">
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as "above" | "below")}
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="above">Price Above</option>
                      <option value="below">Price Below</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-zinc-300" : "text-gray-700"}`}>
                    Threshold Price
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        darkMode ? "bg-zinc-700 border-zinc-600 text-white" : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="J$0.00"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className={`block text-sm font-medium ${darkMode ? "text-zinc-300" : "text-gray-700"}`}>
                  Notification Methods
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={email}
                      onChange={(e) => setEmail(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-emerald-500 rounded focus:ring-emerald-500"
                    />
                    <span className={`${darkMode ? "text-zinc-300" : "text-gray-700"}`}>Email</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={sms}
                      onChange={(e) => setSms(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-emerald-500 rounded focus:ring-emerald-500"
                    />
                    <span className={`${darkMode ? "text-zinc-300" : "text-gray-700"}`}>SMS</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Create Alert
              </button>
            </form>
          </div>

          {/* Active Alerts Card */}
          <div className={`p-6 rounded-2xl shadow-lg ${darkMode ? "bg-zinc-800" : "bg-white"} h-[560px] overflow-y-auto`}>
            <div className="flex items-center mb-6">
              <BellIcon className="w-8 h-8 text-emerald-500 mr-3" />
              <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                Active Alerts
              </h2>
            </div>

            {alerts.length === 0 ? (
              <div className={`text-center py-12 ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
                No active alerts. Create one to get started!
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-xl ${darkMode ? "bg-zinc-700" : "bg-gray-50"} group relative transition-all`}
                  >
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <XIcon className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${darkMode ? "bg-zinc-600" : "bg-white"}`}>
                        <BellIcon className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {alert.symbol}
                          </h3>
                          <span className={`text-sm ${alert.condition === "above" ? "text-green-500" : "text-red-500"}`}>
                            {alert.condition.toUpperCase()}
                          </span>
                        </div>
                        <p className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                          {formatPrice(alert.price)}
                        </p>
                        <div className="flex items-center space-x-4">
                          <div className={`text-sm ${darkMode ? "text-zinc-400" : "text-gray-500"}`}>
                            Notifications: {alert.email && "Email"} {alert.sms && "SMS"}
                          </div>
                          <div className={`text-xs ${darkMode ? "text-zinc-500" : "text-gray-400"}`}>
                            {formatDate(alert.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            darkMode ? "bg-emerald-800 text-emerald-100" : "bg-emerald-100 text-emerald-800"
          } transition-opacity duration-300`}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default JamaicaStockAlerts