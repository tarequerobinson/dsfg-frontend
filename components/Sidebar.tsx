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
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Wallet,
  LineChart,
  LandPlot,
  Calendar,
  Scale,
  BellRing,
  VibrateIcon
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
    // { 
      // href: "/real-estate", 
      // icon: Building, 
      // label: "Real Estate",
      // subItems: [
        // { href: "/real-estate/residential", icon: Home, label: "Residential" },
        // { href: "/real-estate/commercial", icon: Building, label: "Commercial" },
        // { href: "/real-estate/land", icon: LandPlot, label: "Land" }
      //]
    // },
    // { href: "/bonds", icon: Briefcase, label: "Bonds" },
    // { href: "/stocks", icon: LineChart, label: "Stocks" }
   ]

  const otherMenuItems = [
    { href: "/news", icon: Newspaper, label: "News" },
    // { href: "/alerts", icon: VibrateIcon, label: "Alerts" },
    // { href: "/update-networth", icon: Scale, label: "Update Net Worth", badge: "Live" },
    { href: "/event-calendar", icon: Calendar, label: "Events" },
    { href: "/user-update", icon: User, label: "Profile" },
    { href: "/risk-assessment", icon: AlertTriangle, label: "Risk Assessment" },
    // { href: "/submit-financial-info", icon: FileText, label: "Submit"}
    // { href: "/financial-summarizer", icon: FileText, label: "Summarizer" }
  ]

  return (
    <motion.div
      initial="expanded"
      animate={isCollapsed ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      className="bg-white dark:bg-neutral-900 h-full flex flex-col relative z-50 shadow-xl"
    >
      {/* Logo Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-10"></div>
        <Link
          href="/dashboard"
          className="relative flex items-center justify-center py-8 px-2"
        >
          <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-3 rounded-xl">
            <DollarSign className="h-6 w-6 flex-shrink-0 text-white" />
          </div>
          <motion.span
            variants={textVariants}
            className="text-2xl font-extrabold overflow-hidden bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent ml-3"
          >
            DSFG
          </motion.span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto pb-4 px-3">
        {/* Portfolio Section */}
        <div className="mt-6">
          <Link
              href="/dashboard">
            <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-2 rounded-lg flex items-center space-x-2">
              <Wallet className="text-white" size={20} />
              <span className="text-white">Portfolio</span>
            </div>
          </Link>

          {/* <AnimatePresence initial={false}>
            {isPortfolioExpanded && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={portfolioVariants}
                className="ml-2 mt-2 space-y-1"
              >
                {portfolioItems.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                  >
                    <Link
                      href={item.href}
                      className="flex items-center p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <item.icon className="flex-shrink-0 text-neutral-500" size={16} />
                      <motion.span variants={textVariants} className="overflow-hidden text-neutral-700 dark:text-neutral-300">
                        {item.label}
                      </motion.span>
                    </Link>
                    {item.subItems && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="flex items-center p-2 text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
                          >
                            <subItem.icon className="flex-shrink-0 text-neutral-400" size={14} />
                            <motion.span variants={textVariants} className="overflow-hidden text-neutral-600 dark:text-neutral-400">
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
          </AnimatePresence> */}
        </div>

        {/* Other Menu Items */}
        <div className="mt-6 space-y-1">
          {otherMenuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center p-2.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-colors"
            >
              <item.icon className="flex-shrink-0 text-neutral-500" size={16} />
              <motion.span variants={textVariants} className="overflow-hidden flex-1 text-neutral-700 dark:text-neutral-300">
                {item.label}
              </motion.span>
              {item.badge && (
                <motion.span 
                  variants={textVariants}
                  className="ml-2 bg-gradient-to-r from-emerald-400 to-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {item.badge}
                </motion.span>
              )}
            </Link>
          ))}
        </div>
      </nav>

      {/* Collapse Button */}
      <div className="p-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2.5 rounded-lg bg-gradient-to-r from-emerald-400/10 to-blue-500/10 hover:from-emerald-400/20 hover:to-blue-500/20 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="text-neutral-500" />
          ) : (
            <ChevronLeft size={16} className="text-neutral-500" />
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Sidebar