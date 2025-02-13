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
} from "lucide-react"

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const menuItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/real-estate", icon: Building, label: "Real Estate" },
    { href: "/bonds", icon: Briefcase, label: "Bonds" },
    { href: "/treasury-bills", icon: DollarSign, label: "Treasury Bills" },
    { href: "/stocks", icon: BarChart2, label: "Stocks" },
    { href: "/profile", icon: User, label: "Profile" },
    { href: "/news", icon: Newspaper, label: "News" },
    { href: "/risk-assessment", icon: AlertTriangle, label: "Risk Assessment" },
    { href: "/portfolio-consolidation", icon: Upload, label: "Portfolio Consolidation" },
    { href: "/financial-summarizer", icon: FileText, label: "Financial Summarizer" },
  ]

  return (
    <div
      className={`bg-green-700 dark:bg-dark-surface-2 text-white ${isCollapsed ? "w-16" : "w-64"} space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isCollapsed ? "-translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition duration-200 ease-in-out`}
    >
      <div className="flex items-center space-x-2 px-4">
        <DollarSign className="h-8 w-8" />
        {!isCollapsed && <span className="text-2xl font-extrabold">DSFG</span>}
      </div>
      <nav>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-600 dark:hover:bg-dark-surface hover:text-white"
          >
            <item.icon className={`inline-block ${isCollapsed ? "" : "mr-2"}`} size={20} />
            {!isCollapsed && item.label}
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

