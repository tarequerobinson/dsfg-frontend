"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Home,
  Building,
  Briefcase,
  DollarSign,
  BarChart2,
  User,
  Newspaper,
  AlertTriangle,
  Upload,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Wallet,
  LineChart,
  Banknote,
  LandPlot,
  Calendar
} from "lucide-react"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPortfolioExpanded, setIsPortfolioExpanded] = useState(true)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const togglePortfolio = () => {
    setIsPortfolioExpanded(!isPortfolioExpanded)
  }

  const portfolioItems = [
    { href: "/real-estate", icon: Building, label: "Real Estate", subItems: [
      { href: "/real-estate/residential", icon: Home, label: "Residential" },
      { href: "/real-estate/commercial", icon: Building, label: "Commercial" },
      { href: "/real-estate/land", icon: LandPlot, label: "Land" }
    ]},
    { href: "/bonds", icon: Briefcase, label: "Bonds" },
    { href: "/treasury-bills", icon: Banknote, label: "Treasury Bills" },
    { href: "/stocks", icon: LineChart, label: "Stocks" }
  ]

  const otherMenuItems = [
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/news", icon: Newspaper, label: "News" },
    { href: "/event-calendar", icon: Calendar, label: "Events Calendar" },

    { href: "/risk-assessment", icon: AlertTriangle, label: "Risk Assessment" },
    { href: "/portfolio-consolidation", icon: Upload, label: "Portfolio Consolidation" },
    { href: "/financial-summarizer", icon: FileText, label: "Financial Summarizer" }
  ]

  return (
    <div
      className={`bg-green-700 dark:bg-dark-surface-2 text-white ${
        isCollapsed ? "w-16" : "w-64"
      } space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
        isCollapsed ? "-translate-x-0" : "-translate-x-full"
      } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
    >
      <div className="flex items-center space-x-2 px-4">
      <Link
                    href={"/dashboard"}
                    className="block py-2 px-4 rounded transition duration-200 hover:bg-green-600 dark:hover:bg-dark-surface"
                  >


        <DollarSign className="h-8 w-8" />
        {!isCollapsed && <span className="text-2xl font-extrabold">DSFG</span>}

        </Link>

      </div>

      <nav className="space-y-2">
        {/* Portfolio Section */}
        <div>
          <button
            onClick={togglePortfolio}
            className="w-full flex items-center justify-between py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 dark:hover:bg-dark-surface"
          >
            <div className="flex items-center">
              <Wallet className={`${isCollapsed ? "" : "mr-2"}`} size={20} />
              {!isCollapsed && <span>My Portfolio</span>}
            </div>
            {!isCollapsed && (
              <div className="flex items-center">
                {isPortfolioExpanded ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
            )}
          </button>

          {/* Portfolio Items */}
          {isPortfolioExpanded && (
            <div className={`ml-4 space-y-1 ${isCollapsed ? "ml-2" : ""}`}>
              {portfolioItems.map((item, index) => (
                <div key={index}>
                  <Link
                    href={item.href}
                    className="block py-2 px-4 rounded transition duration-200 hover:bg-green-600 dark:hover:bg-dark-surface"
                  >
                    <div className="flex items-center">
                      <item.icon className={`${isCollapsed ? "" : "mr-2"}`} size={18} />
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                  </Link>
                  {!isCollapsed && item.subItems && (
                    <div className="ml-4 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className="block py-1.5 px-4 rounded transition duration-200 hover:bg-green-600 dark:hover:bg-dark-surface text-sm"
                        >
                          <div className="flex items-center">
                            <subItem.icon className="mr-2" size={16} />
                            <span>{subItem.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Other Menu Items */}
        {otherMenuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 dark:hover:bg-dark-surface"
          >
            <div className="flex items-center">
              <item.icon className={`${isCollapsed ? "" : "mr-2"}`} size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>

      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -right-3 bg-green-700 dark:bg-dark-surface-2 text-white p-1 rounded-full"
      >
        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  )
}

export default Sidebar