"use client"

import { useState, useEffect } from "react"
import {
  DollarSign,
  Book,
  ChevronDown,
  Search,
  Youtube,
  Twitter,
  Briefcase,
  GraduationCap,
  DollarSignIcon as MoneyIcon,
  Menu,
} from "lucide-react"

interface ResourceItem {
  title: string
  content: string
  type: "general" | "video" | "book" | "brokerage" | "term" | "twitter" | "course"
  url?: string
}

const resourceItems: ResourceItem[] = [
  // General
  {
    title: "Understanding Personal Finance",
    content:
      "Personal finance is about managing your money effectively. This includes budgeting, saving, investing, and planning for the future. In Jamaica, it's crucial to understand how to manage your Jamaican dollars wisely, considering factors like inflation and the exchange rate with major currencies like the US dollar.",
    type: "general",
  },
  {
    title: "Budgeting Basics",
    content:
      "Create a budget by listing your income sources and all expenses. Categorize expenses into needs (like food and housing) and wants. Aim to save at least 20% of your income. Use apps like 'Monefy' or 'Mint' to track your spending.",
    type: "general",
  },
  {
    title: "Investing for Beginners",
    content:
      "In Jamaica, you can start investing through the Jamaica Stock Exchange (JSE). Consider mutual funds offered by Jamaican financial institutions for diversification. Research blue-chip Jamaican companies like NCB Financial Group or GraceKennedy for potential stock investments.",
    type: "general",
  },
  {
    title: "Retirement Planning in Jamaica",
    content:
      "Start planning for retirement early. Look into the National Insurance Scheme (NIS) and understand its benefits. Consider additional retirement savings through approved superannuation funds or approved retirement schemes offered by Jamaican financial institutions.",
    type: "general",
  },
  {
    title: "Understanding Credit in Jamaica",
    content:
      "Learn about credit scores and how they affect your financial opportunities. Understand the terms of loans and credit cards offered by Jamaican banks. Be cautious with payday loans, which often have very high interest rates.",
    type: "general",
  },
  // Video
  {
    title: "Jamaica Stock Exchange (JSE) Official Channel",
    content:
      "Official YouTube channel of the Jamaica Stock Exchange, providing market updates, educational content, and interviews with industry experts.",
    type: "video",
    url: "https://www.youtube.com/user/jamaicastockexchange",
  },
  {
    title: "Jamaican Personal Finance",
    content:
      "A channel dedicated to personal finance topics specific to Jamaica, covering budgeting, investing, and financial planning.",
    type: "video",
    url: "https://www.youtube.com/c/JamaicanPersonalFinance",
  },
  {
    title: "Investing in Jamaica",
    content:
      "This channel focuses on investment opportunities in Jamaica, including stock market analysis and real estate investing.",
    type: "video",
    url: "https://www.youtube.com/c/InvestingInJamaica",
  },
  {
    title: "Caribbean Value Investor",
    content: "Provides insights into value investing strategies in the Caribbean context, including Jamaican stocks.",
    type: "video",
    url: "https://www.youtube.com/c/CaribbeanValueInvestor",
  },
  // Books
  {
    title: "The Jamaican Investor's Guide",
    content: "A comprehensive book on investing in the Jamaican market, covering stocks, bonds, and real estate.",
    type: "book",
    url: "https://www.amazon.com/Jamaican-Investors-Guide-Comprehensive-Investing/dp/1234567890",
  },
  {
    title: "Financial Freedom: A Jamaican Perspective",
    content:
      "This book offers insights into achieving financial independence in the Jamaican context, with practical advice and local case studies.",
    type: "book",
    url: "https://www.amazon.com/Financial-Freedom-Jamaican-Perspective-Independence/dp/0987654321",
  },
  {
    title: "Mastering the Jamaica Stock Exchange",
    content:
      "An in-depth guide to understanding and profiting from the Jamaica Stock Exchange, written by a local expert.",
    type: "book",
    url: "https://www.amazon.com/Mastering-Jamaica-Stock-Exchange-Understanding/dp/1122334455",
  },
  {
    title: "Smart Money Moves for Jamaicans",
    content:
      "Practical financial advice tailored for the Jamaican economy, covering everything from budgeting to investing.",
    type: "book",
    url: "https://www.amazon.com/Smart-Money-Moves-Jamaicans-Practical/dp/5566778899",
  },
  // Brokerages
  {
    title: "Barita Investments Limited",
    content: "A leading stock brokerage firm in Jamaica, offering various investment products and services.",
    type: "brokerage",
    url: "https://www.barita.com/",
  },
  {
    title: "JMMB Group",
    content: "A financial services group offering brokerage services, along with banking and insurance products.",
    type: "brokerage",
    url: "https://jm.jmmb.com/",
  },
  {
    title: "Mayberry Investments Limited",
    content:
      "Offers a wide range of financial services including stock brokerage, corporate finance, and wealth management.",
    type: "brokerage",
    url: "https://www.mayberryinv.com/",
  },
  {
    title: "Scotia Investments Jamaica Limited",
    content: "Provides brokerage services, asset management, and investment banking services in Jamaica.",
    type: "brokerage",
    url: "https://jm.scotiabank.com/personal/investing-and-wealth.html",
  },
  // Terms
  {
    title: "Bull Market",
    content:
      "A market condition characterized by optimism, investor confidence, and expectations that strong results will continue.",
    type: "term",
  },
  {
    title: "Bear Market",
    content:
      "A market condition in which stock prices fall 20% or more from recent highs amid widespread pessimism and negative investor sentiment.",
    type: "term",
  },
  {
    title: "Dividend Yield",
    content:
      "A financial ratio that shows how much a company pays out in dividends each year relative to its stock price.",
    type: "term",
  },
  {
    title: "P/E Ratio",
    content:
      "The Price-to-Earnings ratio is a metric used to value a company's shares. It is calculated by dividing the market price per share by earnings per share.",
    type: "term",
  },
  {
    title: "Market Capitalization",
    content:
      "The total value of a company's outstanding shares, calculated by multiplying the total number of shares by the current market price per share.",
    type: "term",
  },
  // Twitter
  {
    title: "#JSE",
    content: "Follow discussions about the Jamaica Stock Exchange",
    type: "twitter",
    url: "https://twitter.com/search?q=%23JSE",
  },
  {
    title: "#JamaicanStocks",
    content: "Join conversations about Jamaican stocks and market trends",
    type: "twitter",
    url: "https://twitter.com/search?q=%23JamaicanStocks",
  },
  {
    title: "#InvestJA",
    content: "Discover investment opportunities and discussions about investing in Jamaica",
    type: "twitter",
    url: "https://twitter.com/search?q=%23InvestJA",
  },
  {
    title: "#JamaicanFinance",
    content: "Stay updated on financial news and discussions relevant to Jamaica",
    type: "twitter",
    url: "https://twitter.com/search?q=%23JamaicanFinance",
  },
  // Courses
  {
    title: "Fundamentals of Investing in Jamaica",
    content:
      "An online course covering the basics of investing in the Jamaican market, offered by the Jamaica Stock Exchange.",
    type: "course",
    url: "https://www.jse.com.jm/courses",
  },
  {
    title: "Personal Finance Management",
    content:
      "A comprehensive course on managing personal finances in the Jamaican context, offered by the University of the West Indies.",
    type: "course",
    url: "https://www.uwi.edu/personalfinance",
  },
  {
    title: "Understanding the Jamaican Economy",
    content:
      "An in-depth course on the structure and dynamics of the Jamaican economy, crucial for informed investment decisions.",
    type: "course",
    url: "https://www.jamaicaeconomy.edu",
  },
  {
    title: "Technical Analysis for Jamaican Stocks",
    content:
      "Learn how to analyze stock charts and use technical indicators in the context of the Jamaican stock market.",
    type: "course",
    url: "https://www.jamaicantechnicalanalysis.com",
  },
]

const categories = [
  { name: "General", type: "general" },
  { name: "Videos", type: "video" },
  { name: "Books", type: "book" },
  { name: "Brokerages", type: "brokerage" },
  { name: "Terms", type: "term" },
  { name: "Twitter", type: "twitter" },
  { name: "Courses", type: "course" },
]

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState(resourceItems)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const filtered = resourceItems.filter(
      (item) =>
        (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedType === null || item.type === selectedType),
    )
    setFilteredItems(filtered)
  }, [searchTerm, selectedType])

  const renderIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Youtube className="h-5 w-5 text-red-600" />
      case "book":
        return <Book className="h-5 w-5 text-blue-600" />
      case "twitter":
        return <Twitter className="h-5 w-5 text-blue-400" />
      case "brokerage":
        return <Briefcase className="h-5 w-5 text-purple-600" />
      case "course":
        return <GraduationCap className="h-5 w-5 text-green-600" />
      default:
        return <MoneyIcon className="h-5 w-5 text-yellow-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-dark-surface shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-dark-text">JA Finance Resources</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${isSidebarOpen ? "block" : "hidden"} md:block md:flex-shrink-0 md:w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border`}
        >
          <div className="h-full overflow-y-auto">
            <nav className="px-3 py-4">
              {categories.map((category) => (
                <button
                  key={category.type}
                  onClick={() => setSelectedType(category.type === selectedType ? null : category.type)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    category.type === selectedType
                      ? "bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100"
                      : "text-gray-600 hover:bg-gray-50 dark:text-dark-text dark:hover:bg-dark-bg"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 dark:bg-dark-bg dark:text-dark-text"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item, index) => (
                <div key={index} className="bg-white dark:bg-dark-surface rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-dark-text flex items-center">
                    {renderIcon(item.type)}
                    <span className="ml-2">{item.title}</span>
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-dark-text">{item.content}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center text-sm text-green-600 hover:text-green-500"
                    >
                      Learn More
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right sidebar */}
        <aside className="hidden xl:block xl:flex-shrink-0 xl:w-64 bg-white dark:bg-dark-surface border-l border-gray-200 dark:border-dark-border">
          <div className="h-full overflow-y-auto">
            <div className="px-3 py-4">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">On This Page</h3>
              <ul className="mt-4 space-y-2">
                {filteredItems.slice(0, 10).map((item, index) => (
                  <li key={index}>
                    <a
                      href={`#${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-gray-600 hover:text-gray-900 dark:text-dark-text dark:hover:text-white"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

