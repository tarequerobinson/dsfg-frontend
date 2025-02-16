"use client"
import { useState } from 'react'
import { Bell, Settings, LogOut, User, HelpCircle, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import DarkModeToggle from "./DarkModeToggle"

const TopBar = () => {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New message from John", isNew: true, time: "2 min ago" },
    { id: 2, text: "Your report is ready", isNew: true, time: "1 hour ago" },
    { id: 3, text: "Meeting reminder: Team sync", isNew: false, time: "3 hours ago" },
  ])

  const handleSignOut = () => {
    document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    router.push("/")
  }

  const newNotificationsCount = notifications.filter(n => n.isNew).length

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isNew: false })))
  }

  
  const dropdownVariants = {
    hidden: { 
      opacity: 0,
      y: -5,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      y: -5,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  }

  return (
    <div className="flex h-16 items-center justify-between px-4 bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#333333]">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
        Dashboard
      </h1>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowSettings(false)
            }}
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
          >
            <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            {newNotificationsCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-0 right-0 h-5 w-5 text-xs flex items-center justify-center bg-red-500 text-white rounded-full"
              >
                {newNotificationsCount}
              </motion.span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg ring-1 ring-gray-200 dark:ring-[#333333] z-50"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold dark:text-white">Notifications</h3>
                    <button
                      onClick={markAllRead}
                      className="text-sm text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={notification.id}
                        className={`p-3 rounded-lg ${
                          notification.isNew
                            ? 'bg-emerald-50 dark:bg-emerald-900/20'
                            : 'bg-gray-50 dark:bg-[#262626]'
                        }`}
                      >
                        <div className="text-sm dark:text-gray-200">{notification.text}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {notification.time}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSettings(!showSettings)
              setShowNotifications(false)
            }}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
          >
            <Settings className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>

          <AnimatePresence>
            {showSettings && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg ring-1 ring-gray-200 dark:ring-[#333333] z-50"
              >
                <div className="py-1">
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                  >
                    <Mail className="h-4 w-4 mr-3" />
                    Messages
                  </button>
                  <button
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                  >
                    <HelpCircle className="h-4 w-4 mr-3" />
                    Help
                  </button>
                  <div className="border-t border-gray-200 dark:border-[#333333]"></div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DarkModeToggle />
      </div>
    </div>
  )
}

export default TopBar