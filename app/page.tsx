import Link from "next/link"
import { ArrowRight, BarChart2, Lock, DollarSign, BookOpen } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">DSFG</span>
          </div>
          <div>
          <Link href="/resources" className="text-gray-500 hover:text-gray-900 mr-4 flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              Resources
            </Link>

            <Link href="/signin" className="text-gray-500 hover:text-gray-900 mr-4">
              Sign In
            </Link>
            <Link href="/signup" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Sign Up
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Manage Your Wealth</span>
            <span className="block text-green-600">All in One Place</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            DSFG - The Dollars and Sense Financial Group helps you consolidate your assets, monitor your investments,
            and make informed financial decisions.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/signup"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
              >
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-24">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Key Features</h2>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <BarChart2 className="mx-auto h-12 w-12 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold">Portfolio Management</h3>
              <p className="mt-2 text-gray-600">Consolidate and monitor all your assets in one place.</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <Lock className="mx-auto h-12 w-12 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold">Risk Management</h3>
              <p className="mt-2 text-gray-600">Assess and manage your portfolio risk with AI-powered insights.</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <DollarSign className="mx-auto h-12 w-12 text-green-600" />
              <h3 className="mt-4 text-xl font-semibold">Financial Planning</h3>
              <p className="mt-2 text-gray-600">Get personalized recommendations to achieve your financial goals.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            © 2023 DSFG - The Dollars and Sense Financial Group. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

