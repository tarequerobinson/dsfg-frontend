"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  DollarSign,
  Book,
  Search,
  Youtube,
  Twitter,
  Briefcase,
  GraduationCap,
  DollarSignIcon as MoneyIcon,
  Menu,
  X,
  ExternalLink,
  Filter,
  Moon,
  Sun,
  Percent,
  CreditCard,
  Home,
  Car,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import DarkModeToggle from "@/components/DarkModeToggle"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
// import { useTheme } from "@/contexts/ThemeContext"

interface ResourceItem {
  title: string
  content: string
  type: "general" | "video" | "book" | "brokerage" | "term" | "twitter" | "course"
  url?: string
}

// const { darkMode } = useTheme()


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

  {
    title: "NCB High Yield Savings Account",
    content: "Offers one of the highest interest rates for savings accounts in Jamaica at 2.5% per annum.",
    type: "savings",
    url: "https://www.jncb.com/personal-banking/accounts/savings-accounts/high-yield-savings-account",
  },
  {
    title: "Sagicor Bank Premium Savings Account",
    content: "Provides a competitive interest rate of 2.3% per annum on savings.",
    type: "savings",
    url: "https://www.sagicorjamaica.com/personal/banking/savings-accounts/premium-savings-account",
  },

  // New items for brokerage accounts
  {
    title: "JMMB Group Easy Start Investment Account",
    content: "Start investing with as little as JMD 1,000. No minimum balance required.",
    type: "brokerage",
    url: "https://jm.jmmb.com/investments/easy-start-investment-account",
  },
  {
    title: "Barita Investments Starter Account",
    content: "Begin your investment journey with a minimum of JMD 2,000.",
    type: "brokerage",
    url: "https://www.barita.com/products-services/individual-investors/starter-account/",
  },

  // New items for bank fees
  {
    title: "Scotiabank Low Fee Banking Package",
    content: "Offers one of the lowest monthly maintenance fees at JMD 385 per month.",
    type: "fees",
    url: "https://jm.scotiabank.com/personal/bank-accounts/savings-accounts/scotia-one-account.html",
  },
  {
    title: "First Global Bank Basic Savings Account",
    content: "No monthly maintenance fee for basic savings account.",
    type: "fees",
    url: "https://www.firstglobal-bank.com/personal-banking/accounts/savings-accounts/",
  },

  // New items for mortgage rates
  {
    title: "Jamaica National Building Society Mortgage",
    content: "Offers competitive mortgage rates starting from 6.5% per annum.",
    type: "mortgage",
    url: "https://www.jnbank.com/personal-banking/loans/mortgages/",
  },
  {
    title: "Victoria Mutual Building Society Home Loans",
    content: "Provides mortgage rates as low as 6.75% per annum for qualified borrowers.",
    type: "mortgage",
    url: "https://www.vmbs.com/loans/mortgages/",
  },

  // New items for car loan rates
  {
    title: "NCB Auto Loan",
    content: "Competitive car loan rates starting from 7.5% per annum.",
    type: "car-loan",
    url: "https://www.jncb.com/personal-banking/loans/auto-loans",
  },
  {
    title: "JMMB Bank Auto Loan",
    content: "Offers car loan rates from 7.75% per annum with flexible terms.",
    type: "car-loan",
    url: "https://jm.jmmb.com/personal/loans/auto-loans",
  },

  // New items for unsecured loan rates
  {
    title: "Sagicor Bank Unsecured Loan",
    content: "Provides unsecured personal loans with rates starting from 15% per annum.",
    type: "unsecured-loan",
    url: "https://www.sagicorjamaica.com/personal/loans/unsecured-loans",
  },
  {
    title: "First Global Bank FastCash Loan",
    content: "Offers unsecured loans with rates from 16% per annum and quick approval.",
    type: "unsecured-loan",
    url: "https://www.firstglobal-bank.com/personal-banking/loans/unsecured-loans/",
  },
]

const categories = [
  { name: "All", type: "all" },
  { name: "General", type: "general" },
  { name: "Videos", type: "video" },
  { name: "Books", type: "book" },
  { name: "Brokerages", type: "brokerage" },
  { name: "Terms", type: "term" },
  { name: "Twitter", type: "twitter" },
  { name: "Courses", type: "course" },
  { name: "Savings Accounts", type: "savings" },
  { name: "Bank Fees", type: "fees" },
  { name: "Mortgages", type: "mortgage" },
  { name: "Car Loans", type: "car-loan" },
  { name: "Unsecured Loans", type: "unsecured-loan" },
]

interface CategoryButtonProps {
  category: { name: string; type: string }
  isActive: boolean
  onClick: () => void
}

const PaginationControls = ({ currentPage, totalPages, onPageChange }: { 
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage <= 3) {
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        
        {getPageNumbers().map((page, i) => (
          <PaginationItem key={i}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(page as number);
                }}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredItems, setFilteredItems] = useState(resourceItems)
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  useEffect(() => {
    const filtered = resourceItems.filter(
      (item) =>
        (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedType === "all" || item.type === selectedType),
    )
    setFilteredItems(filtered)
    setCurrentPage(1)
  }, [searchTerm, selectedType])

  const pageCount = Math.ceil(filteredItems.length / itemsPerPage)
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const renderIcon = (type: string) => {
    const iconClass = "h-5 w-5"
    switch (type) {
      case "video":
        return <Youtube className={`${iconClass} text-red-600 dark:text-neutral-400`} />
      case "book":
        return <Book className={`${iconClass} text-blue-600 dark:text-neutral-400`} />
      case "twitter":
        return <Twitter className={`${iconClass} text-blue-400 dark:text-neutral-400`} />
      case "brokerage":
        return <Briefcase className={`${iconClass} text-purple-600 dark:text-neutral-400`} />
      case "course":
        return <GraduationCap className={`${iconClass} text-green-600 dark:text-neutral-400`} />
      case "term":
        return <MoneyIcon className={`${iconClass} text-yellow-600 dark:text-neutral-400`} />
      case "savings":
        return <Percent className={`${iconClass} text-emerald-600 dark:text-neutral-400`} />
      case "fees":
        return <CreditCard className={`${iconClass} text-orange-600 dark:text-neutral-400`} />
      case "mortgage":
        return <Home className={`${iconClass} text-indigo-600 dark:text-neutral-400`} />
      case "car-loan":
        return <Car className={`${iconClass} text-cyan-600 dark:text-neutral-400`} />
      case "unsecured-loan":
        return <DollarSign className={`${iconClass} text-pink-600 dark:text-neutral-400`} />
      default:
        return <DollarSign className={`${iconClass} text-emerald-600 dark:text-neutral-400`} />
    }
  }

  const CategoryButton = ({ category, isActive, onClick }: CategoryButtonProps) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className={`justify-start ${isActive ? "dark:bg-dark-surface dark:text-dark-text" : ""}`}
    >
      {renderIcon(category.type)}
      <span className="ml-2">{category.name}</span>
    </Button>
  )

  const ResourceCard = ({ item }: { item: ResourceItem }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="dark:bg-dark-surface dark:border-dark-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 dark:text-dark-text">
            {renderIcon(item.type)}
            <span>{item.title}</span>
          </CardTitle>
          <CardDescription className="dark:text-neutral-400">
            {categories.find((c) => c.type === item.type)?.name ||
              item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-600 dark:text-dark-text">{item.content}</p>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-neutral-400 dark:hover:text-neutral-300"
            >
              Learn More
              <ExternalLink className="ml-1 h-4 w-4" />
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg transition-colors duration-200">
      <header className="sticky top-0 z-30 bg-white dark:bg-dark-surface border-b border-neutral-200 dark:border-dark-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-green-600 dark:text-neutral-400" />
              <h1 className="text-xl font-bold text-neutral-900 dark:text-dark-text">Resources</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 dark:bg-dark-surface dark:border-dark-border dark:text-dark-text dark:placeholder-neutral-400"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400 dark:text-neutral-400" />
              </div>
              <DarkModeToggle />

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden dark:hover:bg-dark-surface"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          <div className="md:hidden py-4">
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 dark:bg-dark-surface dark:border-dark-border dark:text-dark-text dark:placeholder-neutral-400"
            />
            <Search className="absolute left-3 top-6 h-5 w-5 text-neutral-400 dark:text-neutral-400" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside
          className={`
            ${isSidebarOpen ? "block" : "hidden"} 
            md:block md:w-64 bg-white dark:bg-dark-surface border-r border-neutral-200 dark:border-dark-border
            fixed md:sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto transition-colors duration-200
          `}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-dark-text mb-4">Categories</h2>
            <div className="space-y-1">
              {categories.map((category) => (
                <CategoryButton
                  key={category.type}
                  category={category}
                  isActive={selectedType === category.type}
                  onClick={() => setSelectedType(category.type)}
                />
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-dark-bg transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-dark-text">
                  {selectedType === "all"
                    ? "All Resources"
                    : `${categories.find((c) => c.type === selectedType)?.name} Resources`}
                  <Badge variant="secondary" className="ml-2 dark:bg-dark-surface dark:text-dark-text">
                    {filteredItems.length} items
                  </Badge>
                </h2>
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-neutral-400 dark:text-neutral-400" />
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {searchTerm ? `Filtered by "${searchTerm}"` : "No filters applied"}
                  </span>
                </div>
              </div>
            </div>

            <Tabs defaultValue="grid" className="mb-6">
            <TabsList className="dark:bg-dark-surface dark:border-dark-border">
                <TabsTrigger
                  value="grid"
                  className="dark:data-[state=active]:bg-dark-surface dark:data-[state=active]:text-dark-text"
                >
                  Grid View
                </TabsTrigger>
                <TabsTrigger
                  value="list"
                  className="dark:data-[state=active]:bg-dark-surface dark:data-[state=active]:text-dark-text"
                >
                  List View
                </TabsTrigger>
              </TabsList>
              <TabsContent value="grid">
                <AnimatePresence>
                  <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" layout>
                    {currentItems.map((item, index) => (
                      <ResourceCard key={index} item={item} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
              <TabsContent value="list">
                <AnimatePresence>
                  <motion.div className="space-y-4" layout>
                    {currentItems.map((item, index) => (
                      <ResourceCard key={index} item={item} />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </Tabs>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-neutral-400 dark:text-neutral-400" />
                <h3 className="mt-4 text-lg font-medium text-neutral-900 dark:text-dark-text">No resources found</h3>
                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedType("all")
                  }}
                  className="mt-4 dark:bg-dark-surface dark:text-dark-text dark:hover:bg-dark-surface/90"
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              pageCount > 1 && (
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={pageCount}
                  onPageChange={setCurrentPage}
                />
              )
            )}
          </div>
        </main>

        <aside className="hidden xl:block xl:w-64 bg-white dark:bg-dark-surface border-l border-neutral-200 dark:border-dark-border transition-colors duration-200">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                Quick Navigation
              </h2>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <nav className="space-y-1">
                  {filteredItems.map((item, index) => (
                    <a
                      key={index}
                      href={`#${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="block px-3 py-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-dark-text rounded-md hover:bg-neutral-50 dark:hover:bg-dark-surface"
                    >
                      <div className="flex items-center">
                        {renderIcon(item.type)}
                        <span className="ml-2 truncate">{item.title}</span>
                      </div>
                    </a>
                  ))}
                </nav>
              </ScrollArea>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}