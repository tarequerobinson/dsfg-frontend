import "./globals.css"
import { Inter } from "next/font/google"
import Sidebar from "@/components/Sidebar"
import TopBar from "@/components/TopBar"
import Chatbot from "@/components/Chatbot"
import { cookies } from "next/headers"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { SessionProvider } from "next-auth/react"
import type React from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "DSFG - The Dollars and Sense Financial Group",
  description: "Consolidate and monitor your assets in one place",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const isLoggedIn = cookieStore.get("auth")?.value === "true"

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider>
            <div className="flex h-screen bg-gray-100 dark:bg-dark-bg transition-colors duration-200">
              {isLoggedIn && <Sidebar />}
              <div className="flex-1 flex flex-col overflow-hidden">
                {isLoggedIn && <TopBar />}
                <main
                  className={`flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-dark-bg transition-colors duration-200 ${!isLoggedIn ? "w-full" : ""}`}
                >
                  {children}
                </main>
              </div>
              {isLoggedIn && <Chatbot />}
            </div>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}



import './globals.css'