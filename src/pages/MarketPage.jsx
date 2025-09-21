import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import Market from '../components/market/Market';
import { useAuth } from '../contexts/Authcontext';
import { getMarketTrend, getUserSalesHistory } from '../services/marketService';

export default function MarketPage() {
  const { currentUser } = useAuth();
  const [salesHistory, setSalesHistory] = useState([]);
  const [marketTips, setMarketTips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!currentUser) return;
    
    const loadMarketData = async () => {
      try {
        setLoading(true);
        
        // Get user's sales history
        const history = await getUserSalesHistory(currentUser.uid);
        setSalesHistory(history);
        
        // Get market trends for tips
        const tips = [];
        const cropTypes = ['wheat', 'corn', 'tomato', 'carrot'];
        
        for (const cropType of cropTypes) {
          const trend = await getMarketTrend(cropType);
          
          let message = '';
          if (trend === 'increasing') {
            message = `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} prices are rising. Good time to sell!`;
          } else if (trend === 'decreasing') {
            message = `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} prices are falling. Consider holding.`;
          } else {
            message = `${cropType.charAt(0).toUpperCase() + cropType.slice(1)} prices are stable.`;
          }
          
          tips.push({
            cropType,
            trend,
            message
          });
        }
        
        setMarketTips(tips);
      } catch (error) {
        console.error('Error loading market data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMarketData();
  }, [currentUser]);
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Farmer's Market</h1>
          <p className="text-gray-600">Buy seeds, sell crops, and track market trends</p>
        </div>
        
        {/* Market Tips */}
        {marketTips.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-blue-700 mb-2">Market Insights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {marketTips.map((tip, index) => (
                <div key={index} className="bg-white rounded-md p-3 border border-blue-100">
                  <div className="flex items-center mb-1">
                    <span className="text-xl mr-2">
                      {tip.cropType === 'wheat' && '🌾'}
                      {tip.cropType === 'corn' && '🌽'}
                      {tip.cropType === 'tomato' && '🍅'}
                      {tip.cropType === 'carrot' && '🥕'}
                    </span>
                    <span className="font-medium">{tip.cropType.charAt(0).toUpperCase() + tip.cropType.slice(1)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{tip.message}</p>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tip.trend === 'increasing' 
                        ? 'bg-green-100 text-green-700' 
                        : tip.trend === 'decreasing'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                    }`}>
                      {tip.trend === 'increasing' && '↗ Rising'}
                      {tip.trend === 'decreasing' && '↘ Falling'}
                      {tip.trend === 'stable' && '→ Stable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Main Market Component */}
        <Market />
        
        {/* Recent Sales History */}
        {salesHistory.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Your Recent Sales</h2>
            <div className="bg-white rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crop
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {salesHistory.slice(0, 5).map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.timestamp.toDate().toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">
                            {sale.cropType === 'wheat' && '🌾'}
                            {sale.cropType === 'corn' && '🌽'}
                            {sale.cropType === 'tomato' && '🍅'}
                            {sale.cropType === 'carrot' && '🥕'}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {sale.cropType.charAt(0).toUpperCase() + sale.cropType.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.pricePerUnit} coins
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">
                        {sale.totalEarnings} coins
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
