"use client"

import type React from "react"
import { useTheme } from "@/contexts/ThemeContext"
import { Moon, Sun } from "lucide-react"

const DarkModeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
      aria-label="Toggle dark mode"
    >
      {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </button>
  )
}

export default DarkModeToggle

