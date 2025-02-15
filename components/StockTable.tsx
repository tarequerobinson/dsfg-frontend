import type React from "react"
import { useTheme } from "@/contexts/ThemeContext"

interface Stock {
  symbol: string
  name: string
  quantity: number
  price: string
  value: string
  change: string
}

interface StockTableProps {
  stocks: Stock[]
  institution?: string
}

const StockTable: React.FC<StockTableProps> = ({ stocks, institution }) => {
  const { darkMode } = useTheme()

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-neutral-200 ${darkMode ? "text-neutral-200" : "text-neutral-700"}`}>
        <thead className={darkMode ? "bg-neutral-900" : "bg-neutral-50"}>
          <tr>
            {institution && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Institution
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Symbol
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Value
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
              Change
            </th>
          </tr>
        </thead>
        <tbody className={`divide-y divide-neutral-200 ${darkMode ? "bg-neutral-800" : "bg-white"}`}>
          {stocks.map((stock, index) => (
            <tr key={index} className={index % 2 === 0 ? (darkMode ? "bg-neutral-900" : "bg-neutral-50") : ""}>
              {institution && <td className="px-6 py-4 whitespace-nowrap text-sm">{institution}</td>}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{stock.symbol}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{stock.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{stock.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{stock.price}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">{stock.value}</td>
              <td
                className={`px-6 py-4 whitespace-nowrap text-sm ${Number.parseFloat(stock.change) >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {stock.change}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StockTable