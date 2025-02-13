const ImpactAssessment = () => {
  const impacts = [
    { event: "Interest Rate Increase", impact: "Negative", description: "May affect bond yields" },
    { event: "New Tech Regulations", impact: "Neutral", description: "Limited impact on your tech stocks" },
    { event: "Real Estate Market Growth", impact: "Positive", description: "Potential increase in property values" },
  ]

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Current Affairs Impact</h2>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="text-left">Event</th>
            <th className="text-left">Impact</th>
            <th className="text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {impacts.map((item, index) => (
            <tr key={index}>
              <td className="py-2">{item.event}</td>
              <td
                className={`py-2 ${item.impact === "Positive" ? "text-green-600" : item.impact === "Negative" ? "text-red-600" : "text-yellow-600"}`}
              >
                {item.impact}
              </td>
              <td className="py-2">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ImpactAssessment

