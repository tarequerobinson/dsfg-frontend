import React from 'react';

const PortfolioPage = () => {
    return (
        <div className="max-w-6xl mx-auto p-6 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Jamaica Stock Exchange Portfolio</h1>
                <p className="text-gray-600">Last updated: May 11, 2025</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-gray-100 rounded">
                    <div className="text-sm text-gray-600">PORTFOLIO VALUE</div>
                    <div className="text-xl font-bold">J$4,621,838.00</div>
                </div>
                <div className="p-4 bg-gray-100 rounded">
                    <div className="text-sm text-gray-600">DAILY CHANGE</div>
                    <div className="text-xl font-bold text-green-600">+J$45,876.32</div>
                </div>
                <div className="p-4 bg-gray-100 rounded">
                    <div className="text-sm text-gray-600">RISK EXPOSURE</div>
                    <div className="text-xl font-bold">
                        <span className="bg-green-100 text-green-800 px-2 rounded">Low</span>
                    </div>
                </div>
                <div className="p-4 bg-gray-100 rounded">
                    <div className="text-sm text-gray-600">DRASTIC THRESHOLD</div>
                    <div className="text-xl font-bold">20%</div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search stocks..."
                    className="flex-1 px-4 py-2 border rounded"
                />
                <div className="flex gap-2">
                    <button className="px-4 py-2 border-b-2 border-blue-500">All Stocks</button>
                    <button className="px-4 py-2 hover:border-b-2 border-gray-300">Low Risk</button>
                    <button className="px-4 py-2 hover:border-b-2 border-gray-300">Moderate Risk</button>
                    <button className="px-4 py-2 hover:border-b-2 border-gray-300">High Risk</button>
                </div>
            </div>

            {/* Holdings Grid */}
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-4">Your Holdings</h2>
                <div className="grid grid-cols-3 gap-4">
                    {/* NCB Column */}
                    <div className="p-4 border rounded">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">NCB Financial Group</h3>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Low Risk</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Units</span>
                                <span>5000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Price</span>
                                <span>J$142.67</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Value</span>
                                <span>J$713,350.00</span>
                            </div>
                        </div>
                        <div className="mt-4 bg-green-100 p-2 rounded text-center">
                            <span className="text-green-800">Low 25%</span>
                        </div>
                    </div>

                    {/* JMMB Column */}
                    <div className="p-4 border rounded">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">Jamaica Money Market Brokers</h3>
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Moderate Risk</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Units</span>
                                <span>8000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Price</span>
                                <span>J$58.14</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Value</span>
                                <span>J$465,120.00</span>
                            </div>
                        </div>
                        <div className="mt-4 bg-yellow-100 p-2 rounded text-center">
                            <span className="text-yellow-800">MODERATE 48%</span>
                        </div>
                    </div>

                    {/* GK Column */}
                    <div className="p-4 border rounded">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold">GraceKennedy Limited</h3>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Low Risk</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Units</span>
                                <span>6000</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Price</span>
                                <span>J$97.53</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Value</span>
                                <span>J$585,180.00</span>
                            </div>
                        </div>
                        <div className="mt-4 bg-green-100 p-2 rounded text-center">
                            <span className="text-green-800">LOW 22%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPage;