const RiskManagement = () => {
  const riskAssessment = {
    overallRisk: "Moderate",
    projectedChange: "+2.5%",
    keyFactors: ["Market volatility", "Interest rate changes", "Sector concentration"],
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Risk Assessment</h2>
      <p className="mb-2">
        Overall Risk: <span className="font-semibold">{riskAssessment.overallRisk}</span>
      </p>
      <p className="mb-4">
        Projected Change: <span className="font-semibold text-green-600">{riskAssessment.projectedChange}</span>
      </p>
      <h3 className="font-semibold mb-2">Key Risk Factors:</h3>
      <ul className="list-disc pl-5">
        {riskAssessment.keyFactors.map((factor, index) => (
          <li key={index}>{factor}</li>
        ))}
      </ul>
    </div>
  )
}

export default RiskManagement

