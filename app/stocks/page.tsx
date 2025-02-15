"use client"
import { useState } from "react"
import AssetCard from "@/components/AssetCard"
import AssetChart from "@/components/AssetChart"
import StockTable from "@/components/StockTable"
import { useTheme } from "@/contexts/ThemeContext"
import { Switch } from "@/components/ui/switch"
import { 
  BanknotesIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  CurrencyDollarIcon 
} from "@heroicons/react/24/outline"

const JAMAICAN_INSTITUTIONS = {
  consolidated: "Consolidated View",
  ncb: "NCB Financial Group",
  scotia: "Scotia Group Jamaica",
  sagicor: "Sagicor Group Jamaica",
  mayberry: "Mayberry Investments",
}

export default function StocksPage() {
  const { darkMode } = useTheme()
  const [selectedInstitution, setSelectedInstitution] = useState<string>("consolidated")
  const [isTableView, setIsTableView] = useState(false)

  const stockPortfolios = {
    consolidated: [
      { title: "NCB Shares", value: "J$150,000", change: "+3.5%", symbol: "NCBFG", icon: BanknotesIcon, color: "bg-blue-500" },
      { title: "Scotia Group", value: "J$120,000", change: "+2.1%", symbol: "SGJ", icon: BuildingOfficeIcon, color: "bg-red-500" },
      { title: "Sagicor Group", value: "J$95,000", change: "+1.8%", symbol: "SGI", icon: ChartBarIcon, color: "bg-green-500" },
      { title: "Mayberry Investments", value: "J$75,000", change: "-0.5%", symbol: "MIL", icon: CurrencyDollarIcon, color: "bg-purple-500" },
    ],
    ncb: [
      { title: "NCB Ordinary Shares", value: "J$100,000", change: "+2.8%", symbol: "NCBFG", icon: BanknotesIcon, color: "bg-blue-500" },
      { title: "NCB Preference Shares", value: "J$50,000", change: "+0.7%", symbol: "NCB7.5", icon: BanknotesIcon, color: "bg-blue-300" },
    ],
    scotia: [
      { title: "Scotia Group Common", value: "J$80,000", change: "+1.9%", symbol: "SGJ", icon: BuildingOfficeIcon, color: "bg-red-500" },
      { title: "Scotia Preference A", value: "J$40,000", change: "+0.2%", symbol: "SGJPA", icon: BuildingOfficeIcon, color: "bg-red-300" },
    ],
    sagicor: [
      { title: "Sagicor Financial", value: "J$95,000", change: "+1.8%", symbol: "SGI", icon: ChartBarIcon, color: "bg-green-500" }
    ],
    mayberry: [
      { title: "Mayberry Equities", value: "J$50,000", change: "-1.2%", symbol: "MIL", icon: CurrencyDollarIcon, color: "bg-purple-500" },
      { title: "Mayberry REIT", value: "J$25,000", change: "+0.3%", symbol: "MREIT", icon: BuildingOfficeIcon, color: "bg-purple-300" },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? "text-neutral-50" : "text-neutral-900"}`}>
          Jamaican Stock Portfolio
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>Card</span>
            <Switch checked={isTableView} onCheckedChange={setIsTableView} />
            <span className={`text-sm ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>Table</span>
          </div>
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className={`px-4 py-2 rounded-lg ${
              darkMode ? "bg-neutral-800 text-neutral-50 border-neutral-700" : "bg-white text-neutral-900 border-neutral-200"
            } border focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {Object.entries(JAMAICAN_INSTITUTIONS).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isTableView ? (
        <StockTable stocks={stockPortfolios[selectedInstitution as keyof typeof stockPortfolios]} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {stockPortfolios[selectedInstitution as keyof typeof stockPortfolios].map((asset, index) => (
            <AssetCard
              key={index}
              title={asset.title}
              value={asset.value}
              change={asset.change}
              icon={asset.icon}
              color={asset.color}
            />
          ))}
        </div>
      )}

      <div className="mb-8">
        <AssetChart
          darkMode={darkMode}
          title={`${JAMAICAN_INSTITUTIONS[selectedInstitution as keyof typeof JAMAICAN_INSTITUTIONS]} Performance`}
        />
      </div>

      {selectedInstitution === "consolidated" && !isTableView && (
        <div className={`p-6 rounded-lg ${darkMode ? "bg-neutral-900" : "bg-neutral-50"}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-neutral-100" : "text-neutral-800"}`}>
            Detailed Holdings Breakdown
          </h2>
          <div className="grid gap-4">
            {Object.entries(stockPortfolios)
              .filter(([key]) => key !== "consolidated")
              .map(([institution, assets]) => (
                <div key={institution}>
                  <h3 className={`font-medium mb-2 ${darkMode ? "text-neutral-300" : "text-neutral-700"}`}>
                    {JAMAICAN_INSTITUTIONS[institution as keyof typeof JAMAICAN_INSTITUTIONS]}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {assets.map((asset, index) => (
                      <div key={index} className={`p-4 rounded-lg ${darkMode ? "bg-neutral-800" : "bg-white"} shadow-sm`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${darkMode ? "text-neutral-100" : "text-neutral-800"}`}>
                            {asset.symbol}
                          </span>
                          <span className={Number.parseFloat(asset.change) >= 0 ? "text-green-500" : "text-red-500"}>
                            {asset.change}
                          </span>
                        </div>
                        <div className={`text-sm ${darkMode ? "text-neutral-400" : "text-neutral-600"}`}>{asset.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}