"use client"
import AssetCard from "@/components/AssetCard"
import AssetChart from "@/components/AssetChart"
import { useTheme } from "@/contexts/ThemeContext"

export default function BondsPage() {
  const { darkMode } = useTheme()

  const bondAssets = [
    { title: "Government Bonds", value: "$200,000", change: "+0.5%" },
    { title: "Corporate Bonds", value: "$150,000", change: "+1.2%" },
    { title: "Municipal Bonds", value: "$100,000", change: "+0.8%" },
  ]

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-6">Bond Portfolio</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {bondAssets.map((asset, index) => (
          <AssetCard key={index} title={asset.title} value={asset.value} change={asset.change} />
        ))}
      </div>

      <div className="mt-8">
        <AssetChart darkMode={darkMode} />
      </div>
    </div>
  )
}

