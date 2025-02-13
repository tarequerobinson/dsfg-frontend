"use client"

import { Bell, Settings, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import DarkModeToggle from "./DarkModeToggle"

const TopBar = () => {
  const router = useRouter()

  const handleSignOut = () => {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/")
  }

  return (
    <header className="bg-white dark:bg-dark-surface shadow-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-white">Dashboard</h2>
          <div className="flex items-center">
            <DarkModeToggle />
            <button className="ml-3 p-2 rounded-full text-gray-400 dark:text-dark-text-secondary hover:text-gray-500 dark:hover:text-dark-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800">
              <Bell className="h-6 w-6" />
            </button>
            <button className="ml-3 p-2 rounded-full text-gray-400 dark:text-dark-text-secondary hover:text-gray-500 dark:hover:text-dark-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800">
              <Settings className="h-6 w-6" />
            </button>
            <button
              onClick={handleSignOut}
              className="ml-3 p-2 rounded-full text-gray-400 dark:text-dark-text-secondary hover:text-gray-500 dark:hover:text-dark-text focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
            >
              <LogOut className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800">
                  <img className="h-8 w-8 rounded-full" src="https://via.placeholder.com/150" alt="User avatar" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default TopBar

