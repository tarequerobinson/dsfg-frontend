"use client"

import { useState } from "react"
import PortfolioUpload from "@/components/PortfolioUpload"
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  ComputerDesktopIcon,
  WalletIcon,
  CreditCardIcon,
  AcademicCapIcon,
  TruckIcon,
  DocumentChartBarIcon,
  BookOpenIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
  ChartPieIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline"

type ModalType = "asset" | "liability" | null

export default function NetWorthTrackerPage() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null)

  const assetTypes = [
    { name: "Cash & Equivalents", icon: CurrencyDollarIcon, color: "text-green-500" },
    { name: "Real Estate", icon: HomeIcon, color: "text-blue-500" },
    { name: "Stocks & ETFs", icon: ChartBarIcon, color: "text-purple-500" },
    { name: "Investment Portfolio", icon: DocumentChartBarIcon, color: "text-indigo-500" },
    { name: "Retirement Accounts", icon: BanknotesIcon, color: "text-yellow-500" },
    { name: "Cryptocurrency", icon: ComputerDesktopIcon, color: "text-pink-500" },
    { name: "Private Equity", icon: BuildingLibraryIcon, color: "text-red-500" },
  ]

  const liabilityTypes = [
    { name: "Credit Card Debt", icon: CreditCardIcon, color: "text-red-500" },
    { name: "Mortgage", icon: ScaleIcon, color: "text-blue-500" },
    { name: "Student Loan", icon: AcademicCapIcon, color: "text-purple-500" },
    { name: "Personal Loan", icon: WalletIcon, color: "text-yellow-500" },
    { name: "Car Loan", icon: TruckIcon, color: "text-indigo-500" },
    { name: "Business Debt", icon: BookOpenIcon, color: "text-green-500" },
    { name: "Other Liability", icon: ChartPieIcon, color: "text-gray-500" },
  ]

  const handleAddAsset = (type: string) => {
    setSelectedAssetType(type)
    if (type === "Investment Portfolio") {
      // Handle portfolio upload logic
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4 flex items-center justify-center gap-3">
          <ChartPieIcon className="w-12 h-12 text-green-500" />
          Net Worth Manager
        </h1>
        <p className="text-lg text-gray-600 dark:text-dark-text">
          Track and optimize your total financial position
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
        <button
          onClick={() => setActiveModal("asset")}
          className="bg-green-500/10 hover:bg-green-500/20 p-8 rounded-2xl shadow-lg transition-all duration-200 group border-2 border-green-500/30"
        >
          <div className="flex flex-col items-center">
            <div className="mb-4 relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md group-hover:blur-lg transition-all" />
              <CurrencyDollarIcon className="w-16 h-16 text-green-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
              + Add Asset
            </h2>
            <p className="text-gray-600 dark:text-dark-text opacity-90">
              Boost your net worth
            </p>
          </div>
        </button>

        <button
          onClick={() => setActiveModal("liability")}
          className="bg-red-500/10 hover:bg-red-500/20 p-8 rounded-2xl shadow-lg transition-all duration-200 group border-2 border-red-500/30"
        >
          <div className="flex flex-col items-center">
            <div className="mb-4 relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md group-hover:blur-lg transition-all" />
              <ScaleIcon className="w-16 h-16 text-red-500 relative z-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
              + Add Liability
            </h2>
            <p className="text-gray-600 dark:text-dark-text opacity-90">
              Manage your debts
            </p>
          </div>
        </button>
      </div>

      {/* Asset Modal */}
      {activeModal === "asset" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 w-full max-w-2xl border dark:border-dark-border">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <ChartBarIcon className="w-8 h-8 text-green-500" />
                <h3 className="text-2xl font-bold">Track New Asset</h3>
              </div>
              <button
                onClick={() => {
                  setActiveModal(null)
                  setSelectedAssetType(null)
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-full"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-dark-text" />
              </button>
            </div>

            {selectedAssetType === "Investment Portfolio" ? (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setSelectedAssetType(null)}
                    className="flex items-center gap-1 text-sm text-gray-600 dark:text-dark-text hover:text-gray-900"
                  >
                    <ArrowUturnLeftIcon className="w-4 h-4" />
                    Back to Assets
                  </button>
                </div>
                <PortfolioUpload />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assetTypes.map(({ name, icon: Icon, color }) => (
                  <button
                    key={name}
                    onClick={() => handleAddAsset(name)}
                    className="p-4 border dark:border-dark-border rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors text-left group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 relative z-10">
                      <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{name}</h4>
                        {name === "Investment Portfolio" && (
                          <p className="text-sm text-gray-500 dark:text-dark-text">
                            Bulk upload investments
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Liability Modal */}
      {activeModal === "liability" && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-surface rounded-2xl p-6 w-full max-w-2xl border dark:border-dark-border">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <ScaleIcon className="w-8 h-8 text-red-500" />
                <h3 className="text-2xl font-bold">Track New Liability</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-full"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-dark-text" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liabilityTypes.map(({ name, icon: Icon, color }) => (
                <button
                  key={name}
                  className="p-4 border dark:border-dark-border rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors text-left group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{name}</h4>
                      <p className="text-sm text-gray-500 dark:text-dark-text">
                        {name.includes("Loan") ? "Track loan balance" : "Monitor liability"}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}