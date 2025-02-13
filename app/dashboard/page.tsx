"use client"

import AssetCard from "@/components/AssetCard"
import AssetChart from "@/components/AssetChart"
import AIAdvisor from "@/components/AIAdvisor"
import PortfolioSummary from "@/components/PortfolioSummary"
import ImpactAssessment from "@/components/ImpactAssessment"
import PortfolioRestrictions from "@/components/PortfolioRestrictions"
import { useTheme } from "@/contexts/ThemeContext"

export default function Dashboard() {
  const { darkMode } = useTheme()

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Financial Dashboard</h1>

      <PortfolioSummary />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <AssetCard title="Real Estate" value="$500,000" change="+2.5%" />
        <AssetCard title="Bonds" value="$100,000" change="+1.2%" />
        <AssetCard title="Treasury Bills" value="$50,000" change="+0.8%" />
        <AssetCard title="Stocks" value="$250,000" change="+3.7%" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AssetChart darkMode={darkMode} />
        <AIAdvisor />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ImpactAssessment />
        <PortfolioRestrictions />
      </div>
    </div>
  )
}

