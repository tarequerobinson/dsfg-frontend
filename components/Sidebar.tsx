"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  Building,
  Briefcase,
  DollarSign,
  User,
  Newspaper,
  AlertTriangle,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wallet,
  LineChart,
  Banknote,
  LandPlot,
  Calendar,
  Scale
} from "lucide-react"



const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(true)

  const sidebarVariants = {
    expanded: {
      width: "16rem",
      transition: { type: "spring", damping: 25, stiffness: 150 }
    },
    collapsed: {
      width: "4rem",
      transition: { type: "spring", damping: 25, stiffness: 150 }
    }
  }

  const textVariants = {
    expanded: { 
      opacity: 1,
      width: "auto",
      marginLeft: "0.5rem",
      transition: { duration: 0.2, delay: 0.1 }
    },
    collapsed: {
      opacity: 0,
      width: 0,
      marginLeft: "0rem",
      transition: { duration: 0.15 }
    }
  }

  const portfolioVariants = {
    expanded: {
      height: "auto",
      opacity: 1,
      transition: { staggerChildren: 0.05, when: "beforeChildren" }
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { when: "afterChildren" }
    }
  }

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -10 }
  }

  const portfolioItems = [
    { 
      href: "/real-estate", 
      icon: Building, 
      label: "Real Estate",
      subItems: [
        { href: "/real-estate/residential", icon: Home, label: "Residential" },
        { href: "/real-estate/commercial", icon: Building, label: "Commercial" },
        { href: "/real-estate/land", icon: LandPlot, label: "Land" }
      ]
    },
    { href: "/bonds", icon: Briefcase, label: "Bonds" },
    { href: "/treasury-bills", icon: Banknote, label: "Treasury Bills" },
    { href: "/stocks", icon: LineChart, label: "Stocks" }
  ]

  const otherMenuItems = [
    { href: "/update-networth", icon: Scale,       label: "Update Net Worth",       badge: "Live" },
    { href: "/news", icon: Newspaper, label: "News" },
    { href: "/event-calendar", icon: Calendar, label: "Events" },

    { href: "/profile", icon: User, label: "Profile" },

    { href: "/risk-assessment", icon: AlertTriangle, label: "Risk Assessment"
    },
    { href: "/financial-summarizer", icon: FileText, label: "Summarizer" }
  ]

  return (
    <motion.div
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      className="bg-green-700 dark:bg-dark-surface-2 text-white h-full flex flex-col relative z-50 shadow-xl"
    >
      {/* Logo Section */}
      <div className="flex items-center justify-center py-6 px-2">
        <Link
          href="/dashboard"
          className="flex items-center p-2 rounded hover:bg-green-600 dark:hover:bg-dark-surface transition-colors"
        >
          <DollarSign className="h-8 w-8 flex-shrink-0" />
          <motion.span
            variants={textVariants}
            className="text-2xl font-extrabold overflow-hidden"
          >
            DSFG
          </motion.span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto pb-4">
        {/* Portfolio Section */}
        <div className="px-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsPortfolioExpanded(!isPortfolioExpanded)}
            className="w-full flex items-center p-2 rounded hover:bg-green-600 dark:hover:bg-dark-surface transition-colors"
          >
            <Wallet className="flex-shrink-0" size={20} />
            <motion.span variants={textVariants} className="overflow-hidden">
              Portfolio
            </motion.span>
            <motion.span variants={textVariants} className="ml-auto">
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
                  isPortfolioExpanded ? "rotate-180" : ""
                }`}
              />
            </motion.span>
          </motion.button>

          <AnimatePresence initial={false}>
            {isPortfolioExpanded && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={portfolioVariants}
                className="ml-2 border-l-2 border-green-600/20"
              >
                {portfolioItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="pl-2"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center p-2 rounded hover:bg-green-600 dark:hover:bg-dark-surface transition-colors"
                    >
                      <item.icon className="flex-shrink-0" size={18} />
                      <motion.span variants={textVariants} className="overflow-hidden">
                        {item.label}
                      </motion.span>
                    </Link>
                    {item.subItems && (
                      <div className="ml-2">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="flex items-center p-2 text-sm rounded hover:bg-green-600 dark:hover:bg-dark-surface transition-colors"
                          >
                            <subItem.icon className="flex-shrink-0" size={16} />
                            <motion.span variants={textVariants} className="overflow-hidden">
                              {subItem.label}
                            </motion.span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Other Menu Items */}
        <div className="px-2 mt-4 space-y-1">
    {otherMenuItems.map((item, index) => (
      <Link
        key={index}
        href={item.href}
        className="flex items-center p-2 rounded hover:bg-green-600 dark:hover:bg-dark-surface transition-colors"
      >
        <item.icon className="flex-shrink-0" size={20} />
        <motion.span variants={textVariants} className="overflow-hidden flex-1">
          {item.label}
        </motion.span>
        {item.badge && (
          <motion.span 
            variants={textVariants}
            className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {item.badge}
          </motion.span>
        )}
      </Link>
    ))}
  </div>
      </nav>

      {/* Collapse Button */}
      <div className="p-2 border-t border-green-800/30">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 rounded hover:bg-green-600 dark:hover:bg-dark-surface transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Sidebar