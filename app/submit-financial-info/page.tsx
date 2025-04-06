"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/toaster"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [realEstateValue, setRealEstateValue] = useState("")
  const [stockValue, setStockValue] = useState("")
  const [totalAssets, setTotalAssets] = useState("")
  const [liabilities, setLiabilities] = useState("")
  const [jamaicaPercentile, setJamaicaPercentile] = useState("")
  const [worldPercentile, setWorldPercentile] = useState("")
  const [jamaicaRank, setJamaicaRank] = useState("")
  const [worldRank, setWorldRank] = useState("")
  const [isHydrated, setIsHydrated] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsHydrated(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem("token")

    if(!token){
      console.error("No token found")
      return;
    }
    // Here you would handle the sign-up logic
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/auth/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          realEstateValue,
          stockValue,
          totalAssets,
          liabilities,
          jamaicaPercentile,
          worldPercentile,
          jamaicaRank,
          worldRank,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      setSuccess("Submitted Successfully")
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Failed to submit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Financial Metrics</CardTitle>
          <CardDescription>
            Enter your financial information to calculate your rankings and percentiles.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">{success}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="realEstateValue" className="text-sm font-medium">
                  Real Estate Value
                </label>
                <Input
                  id="realEstateValue"
                  placeholder="0.00"
                  value={realEstateValue}
                  onChange={(e) => setRealEstateValue(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="stockValue" className="text-sm font-medium">
                  Stock Value
                </label>
                <Input
                  id="stockValue"
                  placeholder="0.00"
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="totalAssets" className="text-sm font-medium">
                  Total Assets
                </label>
                <Input
                  id="totalAssets"
                  placeholder="0.00"
                  value={totalAssets}
                  onChange={(e) => setTotalAssets(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="liabilities" className="text-sm font-medium">
                  Liabilities
                </label>
                <Input
                  id="liabilities"
                  placeholder="0.00"
                  value={liabilities}
                  onChange={(e) => setLiabilities(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="jamaicaPercentile" className="text-sm font-medium">
                  Jamaica Percentile
                </label>
                <Input
                  id="jamaicaPercentile"
                  placeholder="0.00"
                  value={jamaicaPercentile}
                  onChange={(e) => setJamaicaPercentile(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="worldPercentile" className="text-sm font-medium">
                  World Percentile
                </label>
                <Input
                  id="worldPercentile"
                  placeholder="0.00"
                  value={worldPercentile}
                  onChange={(e) => setWorldPercentile(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="jamaicaRank" className="text-sm font-medium">
                  Jamaica Rank
                </label>
                <Input
                  id="jamaicaRank"
                  placeholder="0"
                  value={jamaicaRank}
                  onChange={(e) => setJamaicaRank(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="worldRank" className="text-sm font-medium">
                  World Rank
                </label>
                <Input
                  id="worldRank"
                  placeholder="0"
                  value={worldRank}
                  onChange={(e) => setWorldRank(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Data"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />

      {/* Debug info for mouse position - can be removed if not needed */}
      {isHydrated && (
        <div className="fixed bottom-2 right-2 text-xs text-gray-400">
          Mouse: {mousePosition.x}, {mousePosition.y}
        </div>
      )}
    </main>
  )
}

