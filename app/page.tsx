"use client"
import Link from "next/link"
import { ArrowRight, BarChart2, Lock, DollarSign, BookOpen, TrendingUp, Calendar, PieChartIcon, NewspaperIcon, LucideVibrate } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"
import DarkModeToggle from "@/components/DarkModeToggle"
import { useState, useEffect } from "react"

export default function LandingPage() {
  const { darkMode } = useTheme()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!isHydrated) return null

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cursor Glow Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, 
            ${darkMode ? 'rgba(52, 211, 153, 0.05)' : 'rgba(52, 211, 153, 0.03)'} 0%, 
            ${darkMode ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.03)'} 30%, 
            transparent 70%)`
        }}
      />

      {/* Glass Panel Effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          backdropFilter: 'blur(100px)',
          WebkitBackdropFilter: 'blur(100px)',
        }}
      />

      {/* Main Content */}
      <div className={`relative z-20 min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-zinc-900/95' : 'bg-white/95'
      }`}>
        {/* Header */}
        <header className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 ${
            darkMode ? 'opacity-[0.03]' : 'opacity-5'
          }`}></div>
          <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-2 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                DSFG
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <DarkModeToggle/>
              <Link 
                href="/resources" 
                className={`flex items-center ${
                  darkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-neutral-600 hover:text-neutral-900'
                } transition-colors`}
              >
                <BookOpen className="h-4 w-4 mr-1" />
                Resources
              </Link>
              <Link 
                href="/signin" 
                className={`${
                  darkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-neutral-600 hover:text-neutral-900'
                } transition-colors`}
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className={`text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl ${
              darkMode ? 'text-zinc-50' : 'text-neutral-900'
            }`}>
              <span className="block">What's Your Networth?</span>
              <span className="block bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mt-2">
                Find out today
              </span>
            </h1>
            <p className={`mt-6 max-w-md mx-auto text-base sm:text-lg md:mt-8 md:text-xl md:max-w-3xl ${
              darkMode ? 'text-zinc-400' : 'text-neutral-600'
            }`}>
              DSFG - The Dollars and Sense Financial Group helps you to see where you stand financially in Jamaica and the world.
            </p>
            <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
              <Link
                href="/signup"
                className="group flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:opacity-90 transition-opacity"
              >
                Get started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="mt-32">
            <h2 className={`text-center text-3xl font-bold ${
              darkMode ? 'text-zinc-50' : 'text-neutral-900'
            }`}>
              Key Features
            </h2>
            <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3">
              {[PortfolioManagement, RiskManagement, FinancialPlanning, NewsAggregator, BusinessCalendar, StockTickerAlerts].map((feature, idx) => (
                <div key={idx} className="relative group">
                  <div className={`absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 ${
                    darkMode ? 'opacity-[0.03]' : 'opacity-5'
                  } rounded-2xl group-hover:opacity-10 transition-opacity`}></div>
                  <div className={`relative ${
                    darkMode ? 'bg-zinc-800/30 backdrop-blur-sm text-zinc-50' : 'bg-white/80 backdrop-blur-sm text-neutral-900'
                  } rounded-2xl p-8 text-center border ${
                    darkMode ? 'border-zinc-700/50' : 'border-zinc-200/50'
                  } shadow-lg ${
                    darkMode ? 'shadow-black/10' : 'shadow-zinc-200/50'
                  } transition-all duration-300 hover:transform hover:scale-[1.02]`}>
                    <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-3 rounded-xl inline-block">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold">{feature.title}</h3>
                    <p className={`mt-4 ${
                      darkMode ? 'text-zinc-400' : 'text-neutral-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className={`mt-32 border-t ${
          darkMode ? 'border-zinc-800' : 'border-neutral-200'
        } transition-colors`}>
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <p className={`text-center ${
              darkMode ? 'text-zinc-400' : 'text-neutral-600'
            }`}>
              © 2025 DSFG - The Dollars and Sense Financial Group. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

const PortfolioManagement = {
  icon: PieChartIcon,
  title: "Portfolio Management",
  description: "Consolidate and monitor all your assets in one place."
}

const RiskManagement = {
  icon: Lock,
  title: "Risk Management",
  description: "Assess and manage your portfolio risk with insights."
}

const FinancialPlanning = {
  icon: DollarSign,
  title: "Financial Planning",
  description: "Get personalized recommendations to achieve your financial goals."
}




const BusinessCalendar = {
  icon: Calendar,
  title: "Business Calendar",
  description: "Consolidate and monitor all your assets in one place."
}

const StockTickerAlerts = {
  icon: LucideVibrate,
  title: "Stock Ticker Alerts",
  description: "Create Email, Telegram and SMS alerts for select stock price changes"
}

const NewsAggregator = {
  icon: NewspaperIcon,
  title: "News Aggregator",
  description: "Get the latest news relevant to your financial goals."
}