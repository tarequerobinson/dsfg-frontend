"use client"

import type React from "react"
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"

export default function ProfilePage() {
  const { darkMode } = useTheme()
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [riskTolerance, setRiskTolerance] = useState("Moderate")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would handle updating the user's profile
    console.log("Profile updated:", { name, email, riskTolerance })
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-6">Your Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-surface shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-dark-bg dark:border-dark-border"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-dark-bg dark:border-dark-border"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2" htmlFor="riskTolerance">
            Risk Tolerance
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-dark-bg dark:border-dark-border"
            id="riskTolerance"
            value={riskTolerance}
            onChange={(e) => setRiskTolerance(e.target.value)}
          >
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  )
}

