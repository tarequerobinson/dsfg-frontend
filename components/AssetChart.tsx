"use client"

import type React from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", value: 900000 },
  { name: "Feb", value: 920000 },
  { name: "Mar", value: 950000 },
  { name: "Apr", value: 980000 },
  { name: "May", value: 1000000 },
  { name: "Jun", value: 1050000 },
]

interface AssetChartProps {
  darkMode: boolean
}

const AssetChart: React.FC<AssetChartProps> = ({ darkMode }) => {
  return (
    <div className="h-96 bg-white dark:bg-dark-surface p-4 rounded-lg shadow transition-colors duration-200">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#333333" : "#e5e7eb"} />
          <XAxis dataKey="name" stroke={darkMode ? "#A0A0A0" : "#6b7280"} />
          <YAxis stroke={darkMode ? "#A0A0A0" : "#6b7280"} />
          <Tooltip
            contentStyle={{
              backgroundColor: darkMode ? "#2C2C2C" : "#ffffff",
              color: darkMode ? "#E0E0E0" : "#000000",
              border: `1px solid ${darkMode ? "#333333" : "#e5e7eb"}`,
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#22c55e" activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AssetChart

