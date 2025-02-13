"use client"

import type React from "react"
import { useState } from "react"

const FinancialStatementSummarizer = () => {
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }
  =>
  if (event.target.files) {
    setFile(event.target.files[0])
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Here you would process the file and generate a summary
    console.log("File processed:", file?.name)
    setSummary("This is a placeholder summary of the financial statement.")
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Financial Statement Summarizer</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="financial-statement" className="block text-sm font-medium text-gray-700">
            Upload Financial Statement
          </label>
          <input
            type="file"
            id="financial-statement"
            accept=".pdf,.doc,.docx"
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
          Summarize
        </button>
      </form>
      {summary && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Summary</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
}

export default FinancialStatementSummarizer

