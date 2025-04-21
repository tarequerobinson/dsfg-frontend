"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserCircle } from "lucide-react"
import { useTheme } from "@/contexts/ThemeContext"

export default function UpdateProfile() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [phonenumber, setPhoneNumber] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { darkMode } = useTheme()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    // Fetch user data when component mounts
    fetchUserData()

    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const fetchUserData = async () => {
    const token = localStorage.getItem("token")

    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:5000/api/auth/display", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming token auth
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const userData = await response.json()

      // Populate the form with existing user data
      setEmail(userData.email || "")
      setUsername(userData.username || "")
      setPhoneNumber(userData.phonenumber || "")

      // Don't set password fields with existing data for security reasons
    } catch (err: any) {
      setError("Failed to load user data. Please try again.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    // Create update payload - only include password if user is trying to change it
    const updateData: any = {
      email,
      username,
      phonenumber,
    }

    if (password && newPassword) {
      updateData.currentPassword = password
      updateData.newPassword = newPassword
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming token auth
        },
        body: JSON.stringify(updateData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      setSuccess("Profile updated successfully!")

      // Clear password fields after successful update
      setPassword("")
      setNewPassword("")
    } catch (err: any) {
      setError(err.message || "Failed to update profile")
    } finally {
      setLoading(false)
    }
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
            <UserCircle className="h-12 w-12 text-white" />
          </div>
          <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? "text-zinc-50" : "text-neutral-900"}`}>
            Update Your Profile
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
            {error && <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

            {success && (
              <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>
            )}

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
                  htmlFor="username"
                  className={`block text-sm font-medium ${darkMode ? "text-zinc-200" : "text-neutral-700"}`}
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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
                  htmlFor="phoneNumber"
                  className={`block text-sm font-medium ${darkMode ? "text-zinc-200" : "text-neutral-700"}`}
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phonenumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                      darkMode
                        ? "bg-zinc-700/50 border-zinc-600 text-zinc-100"
                        : "bg-white border-gray-300 text-neutral-900"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <p className={`text-sm font-medium ${darkMode ? "text-zinc-200" : "text-neutral-700"}`}>
                  Change Password (optional)
                </p>
                <div className="border-t border-b py-4 space-y-4 mt-2 mb-2 ${darkMode ? 'border-zinc-700' : 'border-gray-200'}">
                  <div>
                    <label
                      htmlFor="current-password"
                      className={`block text-sm font-medium ${darkMode ? "text-zinc-200" : "text-neutral-700"}`}
                    >
                      Current Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="current-password"
                        name="current-password"
                        type="password"
                        autoComplete="current-password"
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

                  <div>
                    <label
                      htmlFor="new-password"
                      className={`block text-sm font-medium ${darkMode ? "text-zinc-200" : "text-neutral-700"}`}
                    >
                      New Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="new-password"
                        name="new-password"
                        type="password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm ${
                          darkMode
                            ? "bg-zinc-700/50 border-zinc-600 text-zinc-100"
                            : "bg-white border-gray-300 text-neutral-900"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-emerald-400 to-blue-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <button
                onClick={() => router.back()}
                className={`w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium ${
                  darkMode
                    ? "border-zinc-600 text-zinc-200 bg-zinc-700/50 hover:bg-zinc-600/50"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors`}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

