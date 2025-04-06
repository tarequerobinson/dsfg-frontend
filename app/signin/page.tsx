"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { DollarSign } from "lucide-react"
import { signIn } from "next-auth/react"
import { useTheme } from "@/contexts/ThemeContext"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { darkMode } = useTheme()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
        const response = await fetch("/api/auth/signin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || "Invalid credentials");
            return;
        }

        router.push("/dashboard");
    } catch (error) {
        setError("Server error. Please try again later.");
    }
  };*/


    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      setError("")

      try {
        const response = await fetch("http://localhost:5000/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
    
        const data = await response.json()
    
        if (!response.ok) {
          setError(data.message || "Something went wrong")
          return
        }
        document.cookie = "auth=true; path=/"
        localStorage.setItem("token", data.access_token);
        router.push("/dashboard")
      } catch (error) {
        setError("Server error. Please try again later.")
      }
    }


  /*const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Hardcoded credential check
    if (email === "demo@dsfg.com" && password === "demopass123") {
       //Set a cookie to simulate authentication
      document.cookie = "auth=true; path=/"
      router.push("/dashboard")
    } else {
      setError("Invalid credentials. Please use demo@dsfg.com and demopass123.")
    }
  }*/

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/dashboard" })
  }

  if (!isHydrated) return null

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-zinc-900/95" : "bg-white/95"
      }`}
    >
      {/* Cursor Glow Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, 
            ${darkMode ? "rgba(52, 211, 153, 0.05)" : "rgba(52, 211, 153, 0.03)"} 0%, 
            ${darkMode ? "rgba(59, 130, 246, 0.05)" : "rgba(59, 130, 246, 0.03)"} 30%, 
            transparent 70%)`,
        }}
      />

      {/* Glass Panel Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-20"
        style={{
          backdropFilter: "blur(100px)",
          WebkitBackdropFilter: "blur(100px)",
        }}
      />

      <div className="relative z-20 min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-2 rounded-xl inline-block mx-auto">
            <DollarSign className="h-12 w-12 text-white" />
          </div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? "text-zinc-50" : "text-neutral-900"}`}>
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div
            className={`relative ${
              darkMode
                ? "bg-zinc-800/30 backdrop-blur-sm text-zinc-50"
                : "bg-white/80 backdrop-blur-sm text-neutral-900"
            } py-8 px-4 shadow sm:rounded-lg sm:px-10 border ${
              darkMode ? "border-zinc-700/50" : "border-zinc-200/50"
            } transition-all duration-300`}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium ${darkMode ? "text-zinc-200" : "text-neutral-700"}`}
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                      darkMode
                        ? "bg-zinc-700/50 border-zinc-600 text-zinc-100"
                        : "bg-white border-gray-300 text-neutral-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium ${darkMode ? "text-zinc-200" : "text-neutral-700"}`}
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                      darkMode
                        ? "bg-zinc-700/50 border-zinc-600 text-zinc-100"
                        : "bg-white border-gray-300 text-neutral-900"
                    }`}
                  />
                </div>
              </div>

              {error && <div className="text-red-500 text-sm">{error}</div>}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-opacity"
                >
                  Sign in
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${darkMode ? "border-zinc-600" : "border-gray-300"}`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${darkMode ? "bg-zinc-800/30 text-zinc-400" : "bg-white text-gray-500"}`}>
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleSignIn}
                  className={`w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${
                    darkMode
                      ? "border-zinc-600 text-zinc-200 bg-zinc-700/50 hover:bg-zinc-600/50"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors`}
                >
                  Sign in with Google
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${darkMode ? "border-zinc-600" : "border-gray-300"}`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${darkMode ? "bg-zinc-800/30 text-zinc-400" : "bg-white text-gray-500"}`}>
                    Don't have an account?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/signup"
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                    darkMode
                      ? "text-emerald-400 bg-zinc-700/50 hover:bg-zinc-600/50"
                      : "text-emerald-600 bg-white hover:bg-gray-50"
                  } transition-colors`}
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

