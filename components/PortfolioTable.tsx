"use client"

import React from "react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"

export type StockData = {
  symbol: string
  name: string
  price: number
  shares: number
  value: number
}

interface PortfolioTableProps {
  stocks: StockData[]
}

export default function PortfolioTable({ stocks }: PortfolioTableProps) {
  if (!stocks || stocks.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow">
        <h3 className="text-lg font-medium mb-2">Your Stock Portfolio</h3>
        <p className="text-gray-500 dark:text-gray-400">
          No stocks in your portfolio yet. When you add stocks, they'll appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-surface p-4 rounded-xl shadow overflow-hidden">
      <h3 className="text-lg font-medium mb-4">Your Stock Portfolio</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Symbol</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Shares</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.map((stock) => (
              <TableRow key={stock.symbol}>
                <TableCell className="font-medium">{stock.symbol}</TableCell>
                <TableCell>{stock.name}</TableCell>
                <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">{stock.shares}</TableCell>
                <TableCell className="text-right">${stock.value.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}