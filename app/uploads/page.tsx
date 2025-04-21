"use client"

import type React from "react"

import { useState } from "react"
import { UploadButton } from "@/components/UploadButtons"

export default function Home() {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    const formData = new FormData()
    formData.append("file", file)

    const token = localStorage.getItem("token")
    console.log("Token before upload: ", token)

    try {
      setUploading(true)

      const response = await fetch("http://localhost:5000/api/auth/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("Upload failed:", error)
        alert(`Upload failed: ${error.error}`)
      } else {
        const result = await response.json()
        console.log("Upload successful:", result)
        alert(result.message)
      }

    } catch (error) {
      console.error("Upload error:", error)
      alert("An error occurred while uploading.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold mb-6 text-center">File Upload</h1>
        <UploadButton onChange={handleFileChange} uploading={uploading} accept="image/*,.pdf,.doc,.docx, .csv" />
      </div>
    </main>
  )
}

