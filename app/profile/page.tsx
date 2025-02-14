"use client"

import type React from "react"
import { useState } from "react"
import { useTheme } from "@/contexts/ThemeContext"

export default function ProfilePage() {
  const { darkMode } = useTheme()
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john.doe@example.com")
  const [riskTolerance, setRiskTolerance] = useState("Moderate")
  const [age, setAge] = useState<number>(30)
  const [investmentGoal, setInvestmentGoal] = useState("Wealth Growth")
  const [annualIncome, setAnnualIncome] = useState("$50,001 - $100,000")
  const [netWorth, setNetWorth] = useState("$100,001 - $500,000")
  const [investmentExperience, setInvestmentExperience] = useState("Intermediate")
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([])
  const [subscribeMarketUpdates, setSubscribeMarketUpdates] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Profile updated:", { 
      name, 
      email, 
      riskTolerance,
      age,
      investmentGoal,
      annualIncome,
      netWorth,
      investmentExperience,
      preferredIndustries,
      subscribeMarketUpdates
    })
  }

  const handleIndustryChange = (industry: string) => {
    setPreferredIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(item => item !== industry) 
        : [...prev, industry]
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-6">Investment Profile</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-surface shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Personal Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">Personal Information</h2>
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
            <label className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2" htmlFor="age">
              Age
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-dark-bg dark:border-dark-border"
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Investment Preferences Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">Investment Preferences</h2>
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
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2" htmlFor="investmentGoal">
              Investment Goal
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-dark-bg dark:border-dark-border"
              id="investmentGoal"
              value={investmentGoal}
              onChange={(e) => setInvestmentGoal(e.target.value)}
            >
              <option>Retirement</option>
              <option>Wealth Growth</option>
              <option>Education</option>
              <option>Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2" htmlFor="annualIncome">
              Annual Income
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-dark-bg dark:border-dark-border"
              id="annualIncome"
              value={annualIncome}
              onChange={(e) => setAnnualIncome(e.target.value)}
            >
              <option>$0 - $1,500,000</option>
              <option>$1,500,000 - $6,000,000</option>
              <option>$6,000,000+</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-dark-text text-sm font-bold mb-2" htmlFor="investmentExperience">
              Investment Experience
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-dark-text leading-tight focus:outline-none focus:shadow-outline dark:bg-dark-bg dark:border-dark-border"
              id="investmentExperience"
              value={investmentExperience}
              onChange={(e) => setInvestmentExperience(e.target.value)}
            >
              <option>Novice</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
        </div>

        {/* Industry Preferences Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-dark-text mb-4">Industry Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['Technology', 'Real Estate', 'Healthcare', 'Energy', 'Consumer Goods', 'Financials'].map((industry) => (
              <label key={industry} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={preferredIndustries.includes(industry)}
                  onChange={() => handleIndustryChange(industry)}
                  className="form-checkbox h-4 w-4 text-green-500 transition duration-150 ease-in-out"
                />
                <span className="text-gray-700 dark:text-dark-text">{industry}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mb-8">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={subscribeMarketUpdates}
              onChange={(e) => setSubscribeMarketUpdates(e.target.checked)}
              className="form-checkbox h-4 w-4 text-green-500 transition duration-150 ease-in-out"
            />
            <span className="text-gray-700 dark:text-dark-text">Subscribe to Market Updates & Investment Insights</span>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Update Investment Profile
          </button>
        </div>
      </form>
    </div>
  )
}