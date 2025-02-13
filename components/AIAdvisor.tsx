const AIAdvisor = () => {
  const recommendations = [
    "Consider diversifying your stock portfolio to reduce risk.",
    "Based on your goals, increasing your bond allocation may provide more stability.",
    "Your real estate investments are performing well, consider maintaining current levels.",
  ]

  return (
    <div className="bg-white dark:bg-dark-surface shadow rounded-lg p-6 transition-colors duration-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-dark-text">AI Recommendations</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-dark-text-secondary">
        {recommendations.map((rec, index) => (
          <li key={index}>{rec}</li>
        ))}
      </ul>
    </div>
  )
}

export default AIAdvisor

