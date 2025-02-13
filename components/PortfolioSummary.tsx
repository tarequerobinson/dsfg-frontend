const PortfolioSummary = () => {
  const summary = {
    totalValue: "$1,000,000",
    performance: "+5.2%",
    topPerformer: "Tech Stocks",
    riskLevel: "Moderate",
  }

  return (
    <div className="bg-white dark:bg-dark-surface shadow rounded-lg p-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-dark-text">Portfolio Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Total Value</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-dark-text">{summary.totalValue}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Performance (YTD)</p>
          <p className="text-xl font-semibold text-green-600 dark:text-green-400">{summary.performance}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Top Performer</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-dark-text">{summary.topPerformer}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary">Risk Level</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-dark-text">{summary.riskLevel}</p>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary

