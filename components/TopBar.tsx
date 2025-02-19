"use client"
import { useState } from 'react'
import { Bell, Settings, LogOut, User, HelpCircle, Mail, GroupIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import DarkModeToggle from "./DarkModeToggle"
import { 
  Squares2X2Icon,
  HomeModernIcon,
  ChartBarIcon,
  CalculatorIcon,
  ScaleIcon,
  BanknotesIcon,
  ReceiptPercentIcon,
  LinkIcon
} from "@heroicons/react/24/outline"

import { Building2, Calendar, CreditCard, ArrowRightLeft, PiggyBank, Shield, CreditCardIcon as PaymentIcon, Wallet as WalletIcon, Banknote as DebitIcon, Send as TransferIcon, ShieldCheck as P2PIcon, Receipt as BillIcon } from "lucide-react";

import { 
  HomeIcon, 
  ReceiptIcon, 
  TrendingUpIcon, 
  PiggyBankIcon,
  TargetIcon,
  CalendarIcon,
  CameraIcon,
  CheckCircleIcon 
} from "lucide-react"

import { 
  Receipt, 
  Wallet,
} from "lucide-react"

import { CreditCard as CardIcon } from 'lucide-react';
import { Globe as GlobalIcon } from 'lucide-react';
import { PiggyBank as DepositIcon } from 'lucide-react';
import { Repeat as RecurringIcon } from 'lucide-react';
import { Smartphone as TopupIcon } from 'lucide-react';
import { Currency as ForexIcon } from 'lucide-react';
import { QrCode as QRIcon } from 'lucide-react';
import { Banknote as CashIcon } from 'lucide-react';
import { LogOut as WithdrawIcon } from 'lucide-react';
import { Network as WireIcon } from 'lucide-react';



const TopBar = ({ floating = false }) => {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showApps, setShowApps] = useState(false)

  const [showSettings, setShowSettings] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New message from John", isNew: true, time: "2 min ago" },
    { id: 2, text: "Your report is ready", isNew: true, time: "1 hour ago" },
    { id: 3, text: "Meeting reminder: Team sync", isNew: false, time: "3 hours ago" },
  ])




// Updated financial services list
const financialServices = [
  { 
    id: 1, 
    name: "Card Payments", 
    icon: CardIcon,
    path: "/services/card-payments",
    description: "Make purchases online and in-store with virtual and physical debit cards"
  },
  { 
    id: 2, 
    name: "Domestic Transfers", 
    icon: TransferIcon,
    path: "/services/domestic-transfers",
    description: "Send money instantly to any local bank account or mobile number"
  },
  { 
    id: 3, 
    name: "International Transfers", 
    icon: GlobalIcon,
    path: "/services/international-transfers",
    description: "Send money abroad with competitive exchange rates and low fees"
  },
  { 
    id: 4, 
    name: "Bill Payments", 
    icon: BillIcon,
    path: "/services/bill-payments",
    description: "Pay utility bills, taxes, and other dues directly from your account"
  },
  { 
    id: 5, 
    name: "Direct Deposits", 
    icon: DepositIcon,
    path: "/services/direct-deposits",
    description: "Receive salary and other regular payments automatically"
  },
  { 
    id: 6, 
    name: "Standing Orders", 
    icon: RecurringIcon,
    path: "/services/standing-orders",
    description: "Set up automated regular payments to other accounts"
  },
  { 
    id: 7, 
    name: "Direct Debits", 
    icon: DebitIcon,
    path: "/services/direct-debits",
    description: "Authorize companies to collect payments automatically"
  },
  { 
    id: 8,
    name: "Mobile Top-ups",
    icon: TopupIcon,
    path: "/services/mobile-topup",
    description: "Purchase airtime and data for any mobile network"
  },
  {
    id: 9,
    name: "Currency Exchange",
    icon: ForexIcon,
    path: "/services/forex",
    description: "Convert between currencies at competitive rates"
  },
  {
    id: 10,
    name: "QR Payments",
    icon: QRIcon,
    path: "/services/qr-payments",
    description: "Pay merchants instantly by scanning their QR code"
  },
  {
    id: 11,
    name: "Cash Deposits",
    icon: CashIcon,
    path: "/services/cash-deposits",
    description: "Add cash to your account through partner locations"
  },
  {
    id: 12,
    name: "Cash Withdrawals",
    icon: WithdrawIcon,
    path: "/services/withdrawals",
    description: "Withdraw cash from ATMs or partner locations"
  },
  {
    id: 13,
    name: "Peer Transfers",
    icon: P2PIcon,
    path: "/services/peer-transfers",
    description: "Send money instantly to other users of the platform"
  },
  {
    id: 14,
    name: "Wire Transfers",
    icon: WireIcon,
    path: "/services/wire-transfers",
    description: "Send secure, same-day transfers for large amounts"
  },
  {
    id: 15,
    name: "Payment Links",
    icon: LinkIcon,
    path: "/services/payment-links",
    description: "Generate links to receive payments from anyone"
  }
];


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

  const handleToolClick = (path: string) => {
    router.push(path)
    setShowApps(false)
  }

  return (
    <div className={`
      sticky top-0 z-50 backdrop-blur-md
      ${floating ? 'mx-4 mt-4 rounded-xl' : 'border-b'}
      ${floating ? 'bg-white/80 dark:bg-[#1a1a1a]/80' : 'bg-white dark:bg-[#1a1a1a]'}
      ${floating ? 'shadow-lg' : 'border-gray-200 dark:border-[#333333]'}
    `}>
      <div className="flex h-14 items-center justify-end px-4">
        <div className="flex items-center space-x-2">
          {/* Apps Launcher */}
          <div className="relative">
            <button
              onClick={() => {
                setShowApps(!showApps)
                setShowNotifications(false)
                setShowSettings(false)
              }}
              className="p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-[#262626]/80 transition-colors"
            >
              <Squares2X2Icon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>

            <AnimatePresence>
              {showApps && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg ring-1 ring-gray-200 dark:ring-[#333333] z-50"
                >
                  <div className="p-4">
                    <h3 className="text-lg font-semibold dark:text-white mb-3">Finance Tools</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {financialServices.map((tool) => {
                        const Icon = tool.icon
                        return (
                          <motion.button
                            key={tool.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleToolClick(tool.path)}
                            className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#262626] transition-colors"
                          >
                            <Icon className="h-6 w-6 text-gray-700 dark:text-gray-300 mb-1.5" />
                            <span className="text-xs text-gray-600 dark:text-gray-300 text-center">
                              {tool.name}
                            </span>
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowSettings(false)
              }}
              className="relative p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-[#262626]/80 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {newNotificationsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0 right-0 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full"
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
              className="p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-[#262626]/80 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
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
    </div>
  )
}

export default TopBar