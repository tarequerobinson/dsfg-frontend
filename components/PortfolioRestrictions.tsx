const PortfolioRestrictions = () => {
  const restrictions = [
    {
      type: "Asset Allocation",
      status: "Within Limits",
      message: "Your current asset allocation aligns with your goals.",
    },
    {
      type: "Risk Level",
      status: "Warning",
      message: "Your portfolio risk level is slightly higher than your target.",
    },
    { type: "Diversification", status: "Action Required", message: "Consider diversifying your tech stock holdings." },
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Portfolio Restrictions</h2>
      <ul className="space-y-4">
        {restrictions.map((item, index) => (
          <li key={index} className="border-b pb-2">
            <span className="font-semibold">{item.type}: </span>
            <span
              className={`${
                item.status === "Within Limits"
                  ? "text-green-600"
                  : item.status === "Warning"
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {item.status}
            </span>
            <p className="text-sm text-gray-600 mt-1">{item.message}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default PortfolioRestrictions

