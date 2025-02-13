"use client"
import AssetCard from "@/components/AssetCard"
import AssetChart from "@/components/AssetChart"
import { useTheme } from "@/contexts/ThemeContext"

export default function StocksPage() {
  const { darkMode } = useTheme()

  const stockAssets = [
    { title: "Technology Stocks", value: "$150,000", change: "+3.5%" },
    { title: "Financial Stocks", value: "$100,000", change: "+1.8%" },
    { title: "Healthcare Stocks", value: "$120,000", change: "+2.2%" },
  ]

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-6">Stock Portfolio</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {stockAssets.map((asset, index) => (
          <AssetCard key={index} title={asset.title} value={asset.value} change={asset.change} />
        ))}
      </div>

      <div className="mt-8">
        <AssetChart darkMode={darkMode} />
      </div>
    </div>
  )
}

