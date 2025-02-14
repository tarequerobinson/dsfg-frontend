"use client"
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Building, Home, TreePine, ArrowUp, ArrowDown } from 'lucide-react'
import AssetChart from "@/components/AssetChart"

const RealEstatePage = () => {
  const [activeView, setActiveView] = useState('overview')

  const realEstateAssets = [
    {
      id: 1,
      title: "Downtown Commercial Building",
      type: "commercial",
      metrics: {
        purchasePrice: 500000,
        currentValue: 575000,
        yearBuilt: 1995,
        squareFeet: 2500,
        pricePerSqFt: 230,
        occupancyRate: 92,
        annualGrossIncome: 75000,
        operatingExpenses: 25000,
        netOperatingIncome: 50000,
        capRate: 8.7,
        mortgageBalance: 350000,
        monthlyMortgage: 2100,
        propertyTax: 8500,
        insurance: 3600,
        maintenanceCosts: 5000,
        lastRenovation: "2019",
        appreciation: 15
      }
    },
    {
      id: 2,
      title: "Suburban Residential Property",
      type: "residential",
      metrics: {
        purchasePrice: 300000,
        currentValue: 345000,
        yearBuilt: 2005,
        squareFeet: 1800,
        pricePerSqFt: 192,
        occupancyRate: 100,
        annualGrossIncome: 36000,
        operatingExpenses: 12000,
        netOperatingIncome: 24000,
        capRate: 7.0,
        mortgageBalance: 225000,
        monthlyMortgage: 1500,
        propertyTax: 4200,
        insurance: 1800,
        maintenanceCosts: 3000,
        lastRenovation: "2021",
        appreciation: 15
      }
    },
    {
      id: 3,
      title: "Development Land",
      type: "land",
      metrics: {
        purchasePrice: 100000,
        currentValue: 125000,
        squareFeet: 10000,
        pricePerSqFt: 12.50,
        propertyTax: 1200,
        insurance: 600,
        appreciation: 25,
        zoning: "Mixed-Use",
        utilities: "Available",
        topography: "Flat"
      }
    }
  ]

  const calculateTotalValue = () => {
    return realEstateAssets.reduce((sum, asset) => sum + asset.metrics.currentValue, 0)
  }

  const calculateTotalIncome = () => {
    return realEstateAssets.reduce((sum, asset) => {
      return sum + (asset.metrics.annualGrossIncome || 0)
    }, 0)
  }

  const calculateTotalExpenses = () => {
    return realEstateAssets.reduce((sum, asset) => {
      return sum + (asset.metrics.operatingExpenses || 0)
    }, 0)
  }

  const getAssetIcon = (type) => {
    switch (type) {
      case 'commercial':
        return <Building className="h-6 w-6" />
      case 'residential':
        return <Home className="h-6 w-6" />
      case 'land':
        return <TreePine className="h-6 w-6" />
      default:
        return <Building className="h-6 w-6" />
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8">Real Estate Portfolio</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateTotalValue().toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Gross Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateTotalIncome().toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Operating Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${calculateTotalExpenses().toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial Metrics</TabsTrigger>
          <TabsTrigger value="property">Property Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {realEstateAssets.map((asset) => (
              <Card key={asset.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    {getAssetIcon(asset.type)}
                    <CardTitle className="text-lg">{asset.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Value:</span>
                    <span className="font-medium">${asset.metrics.currentValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Price/sqft:</span>
                    <span className="font-medium">${asset.metrics.pricePerSqFt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Appreciation:</span>
                    <span className="font-medium text-green-600">
                      <ArrowUp className="inline h-4 w-4 mr-1" />
                      {asset.metrics.appreciation}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {realEstateAssets.map((asset) => (
              asset.metrics.annualGrossIncome && (
                <Card key={`${asset.id}-financial`}>
                  <CardHeader>
                    <CardTitle>{asset.title} - Financial Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Gross Income:</span>
                        <span className="font-medium">${asset.metrics.annualGrossIncome.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Operating Expenses:</span>
                        <span className="font-medium">${asset.metrics.operatingExpenses.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">NOI:</span>
                        <span className="font-medium">${asset.metrics.netOperatingIncome.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Cap Rate:</span>
                        <span className="font-medium">{asset.metrics.capRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mortgage Balance:</span>
                        <span className="font-medium">${asset.metrics.mortgageBalance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Mortgage:</span>
                        <span className="font-medium">${asset.metrics.monthlyMortgage.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Property Tax:</span>
                        <span className="font-medium">${asset.metrics.propertyTax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Insurance:</span>
                        <span className="font-medium">${asset.metrics.insurance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Maintenance:</span>
                        <span className="font-medium">${asset.metrics.maintenanceCosts.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        </TabsContent>

        <TabsContent value="property" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {realEstateAssets.map((asset) => (
              <Card key={`${asset.id}-property`}>
                <CardHeader>
                  <CardTitle>{asset.title} - Property Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Year Built:</span>
                      <span className="font-medium">{asset.metrics.yearBuilt || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Square Feet:</span>
                      <span className="font-medium">{asset.metrics.squareFeet.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Renovation:</span>
                      <span className="font-medium">{asset.metrics.lastRenovation || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Occupancy Rate:</span>
                      <span className="font-medium">{asset.metrics.occupancyRate || 'N/A'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Zoning:</span>
                      <span className="font-medium">{asset.metrics.zoning || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Utilities:</span>
                      <span className="font-medium">{asset.metrics.utilities || 'N/A'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <AssetChart />
      </div>
    </div>
  )
}

export default RealEstatePage