"use client"
import AssetCard from "@/components/AssetCard"
import AssetChart from "@/components/AssetChart"
import { useTheme } from "@/contexts/ThemeContext"

export default function RealEstatePage() {
  const { darkMode } = useTheme()

  const realEstateAssets = [
    { title: "Residential Property", value: "$300,000", change: "+1.5%" },
    { title: "Commercial Property", value: "$500,000", change: "+2.2%" },
    { title: "Land", value: "$100,000", change: "+0.8%" },
  ]

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-6">Real Estate Portfolio</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {realEstateAssets.map((asset, index) => (
          <AssetCard key={index} title={asset.title} value={asset.value} change={asset.change} />
        ))}
      </div>

      <div className="mt-8">
        <AssetChart darkMode={darkMode} />
      </div>
    </div>
  )
}

