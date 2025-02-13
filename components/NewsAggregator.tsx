const NewsAggregator = () => {
  const newsItems = [
    { source: "The Gleaner", title: "Stock Market Surges Amid Economic Recovery", url: "#" },
    { source: "The Observer", title: "New Tax Policies to Impact Investors", url: "#" },
    { source: "The Star", title: "Tech Stocks Continue to Dominate Market", url: "#" },
    { source: "Loop News", title: "Real Estate Market Shows Signs of Cooling", url: "#" },
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Latest Business News</h2>
      <ul className="space-y-4">
        {newsItems.map((item, index) => (
          <li key={index} className="border-b pb-2">
            <a href={item.url} className="text-blue-600 hover:underline">
              <span className="font-semibold">{item.source}:</span> {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default NewsAggregator

