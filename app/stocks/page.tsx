"use client"
import { useState } from "react"
import AssetCard from "@/components/AssetCard"
import AssetChart from "@/components/AssetChart"
import StockTable from "@/components/StockTable"
import { useTheme } from "@/contexts/ThemeContext"
import { Switch } from "@/components/ui/switch"

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
      { title: "NCB Shares", value: "J$150,000", change: "+3.5%", symbol: "NCBFG" },
      { title: "Scotia Group", value: "J$120,000", change: "+2.1%", symbol: "SGJ" },
      { title: "Sagicor Group", value: "J$95,000", change: "+1.8%", symbol: "SGI" },
      { title: "Mayberry Investments", value: "J$75,000", change: "-0.5%", symbol: "MIL" },
    ],
    ncb: [
      { title: "NCB Ordinary Shares", value: "J$100,000", change: "+2.8%", symbol: "NCBFG" },
      { title: "NCB Preference Shares", value: "J$50,000", change: "+0.7%", symbol: "NCB7.5" },
    ],
    scotia: [
      { title: "Scotia Group Common", value: "J$80,000", change: "+1.9%", symbol: "SGJ" },
      { title: "Scotia Preference A", value: "J$40,000", change: "+0.2%", symbol: "SGJPA" },
    ],
    sagicor: [{ title: "Sagicor Financial", value: "J$95,000", change: "+1.8%", symbol: "SGI" }],
    mayberry: [
      { title: "Mayberry Equities", value: "J$50,000", change: "-1.2%", symbol: "MIL" },
      { title: "Mayberry REIT", value: "J$25,000", change: "+0.3%", symbol: "MREIT" },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
          Jamaican Stock Portfolio
        </h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Card</span>
            <Switch checked={isTableView} onCheckedChange={setIsTableView} />
            <span className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>Table</span>
          </div>
          <select
            value={selectedInstitution}
            onChange={(e) => setSelectedInstitution(e.target.value)}
            className={`px-4 py-2 rounded-lg ${
              darkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-200"
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
              symbol={asset.symbol}
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
        <div className={`p-6 rounded-lg ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
            Detailed Holdings Breakdown
          </h2>
          <div className="grid gap-4">
            {Object.entries(stockPortfolios)
              .filter(([key]) => key !== "consolidated")
              .map(([institution, assets]) => (
                <div key={institution}>
                  <h3 className={`font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {JAMAICAN_INSTITUTIONS[institution as keyof typeof JAMAICAN_INSTITUTIONS]}
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {assets.map((asset, index) => (
                      <div key={index} className={`p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-white"} shadow-sm`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                            {asset.symbol}
                          </span>
                          <span className={Number.parseFloat(asset.change) >= 0 ? "text-green-500" : "text-red-500"}>
                            {asset.change}
                          </span>
                        </div>
                        <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{asset.title}</div>
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

