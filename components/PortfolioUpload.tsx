"use client"

import type React from "react"
import { useState } from "react"

const PortfolioUpload = () => {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would handle the file upload and processing
    console.log("File uploaded:", file?.name)
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Portfolio</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="portfolio-file" className="block text-sm font-medium text-gray-700">
            Choose CSV file
          </label>
          <input
            type="file"
            id="portfolio-file"
            accept=".csv"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100"
          />
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" disabled={!file}>
          Upload and Process
        </button>
      </form>
    </div>
  )
}

export default PortfolioUpload

