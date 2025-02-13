"use client"

import type React from "react"
import { useState } from "react"

interface PriceAlertProps {
  assetName: string
  currentPrice: number
}

const PriceAlert: React.FC<PriceAlertProps> = ({ assetName, currentPrice }) => {
  const [alertPrice, setAlertPrice] = useState<string>("")

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would set up the alert in a real application
    console.log(`Alert set for ${assetName} at $${alertPrice}`)
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Set Price Alert</h2>
      <p className="mb-4">
        Current price of {assetName}: ${currentPrice}
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="alert-price" className="block text-sm font-medium text-gray-700">
            Alert Price
          </label>
          <input
            type="number"
            id="alert-price"
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            placeholder="Enter price"
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Set Alert
        </button>
      </form>
    </div>
  )
}

export default PriceAlert

