import Link from "next/link"
import { ArrowRight, BarChart2, Lock, DollarSign, BookOpen } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Gradient Header */}
      <header className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-5"></div>
        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-2 rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              DSFG
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/resources" className="text-neutral-600 hover:text-neutral-900 flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              Resources
            </Link>
            <Link href="/signin" className="text-neutral-600 hover:text-neutral-900">
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
            <span className="block text-neutral-900">What's Your Networth?</span>
            <span className="block bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mt-2">
              Find out today
            </span>
          </h1>
          <p className="mt-6 max-w-md mx-auto text-base text-neutral-600 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl">
            DSFG - The Dollars and Sense Financial Group helps you to see where you stand financially in Jamaica and the world.
          </p>
          <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center md:mt-10">
            <Link
              href="/signup"
              className="group flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:opacity-90 transition-opacity"
            >
              Get started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="mt-32">
          <h2 className="text-center text-3xl font-bold text-neutral-900">Key Features</h2>
          <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3">
            {/* Portfolio Management Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 text-center shadow-lg">
                <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-3 rounded-xl inline-block">
                  <BarChart2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-neutral-900">Portfolio Management</h3>
                <p className="mt-4 text-neutral-600">Consolidate and monitor all your assets in one place.</p>
              </div>
            </div>

            {/* Risk Management Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 text-center shadow-lg">
                <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-3 rounded-xl inline-block">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-neutral-900">Risk Management</h3>
                <p className="mt-4 text-neutral-600">Assess and manage your portfolio risk with AI-powered insights.</p>
              </div>
            </div>

            {/* Financial Planning Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl p-8 text-center shadow-lg">
                <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-3 rounded-xl inline-block">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-neutral-900">Financial Planning</h3>
                <p className="mt-4 text-neutral-600">Get personalized recommendations to achieve your financial goals.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-32 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-neutral-600">
            © 2024 DSFG - The Dollars and Sense Financial Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}