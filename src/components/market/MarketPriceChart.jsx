import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useGame } from '../../contexts/GameContext';
import LoadingSpinner from '../common/LoadingSpinner';

export default function MarketPriceChart() {
  const { cropCatalog, marketPrices } = useGame();
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedCrops, setSelectedCrops] = useState(Object.keys(cropCatalog));

  const toggleCropSelection = (cropType) => {
    setSelectedCrops(prev => {
      if (prev.includes(cropType)) {
        return prev.filter(type => type !== cropType);
      } else {
        return [...prev, cropType];
      }
    });
  };
  
  const getCropColor = (type) => {
    const colors = {
      wheat: '#F9D923',
      corn: '#F8B400',
      tomato: '#EB5353',
      carrot: '#F37121'
    };
    
    return colors[type] || '#36AE7C';
  };
  
  // Add current market prices to the chart data
  const chartData = [...historicalPrices];
  if (chartData.length > 0 && Object.keys(marketPrices).length > 0) {
    chartData.push({
      date: 'Today',
      ...marketPrices
    });
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2">
          <button
            onClick={() => setSelectedTimeframe('day')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedTimeframe === 'day' 
                ? 'bg-farm-green text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setSelectedTimeframe('week')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedTimeframe === 'week' 
                ? 'bg-farm-green text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedTimeframe('month')}
            className={`px-3 py-1 text-sm rounded-full ${
              selectedTimeframe === 'month' 
                ? 'bg-farm-green text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
        </div>
        
        <div className="flex space-x-2">
          {Object.entries(cropCatalog).map(([type, data]) => (
            <button
              key={type}
              onClick={() => toggleCropSelection(type)}
              className={`
                px-2 py-1 text-xs rounded-full flex items-center
                ${selectedCrops.includes(type) 
                  ? `bg-${type}-100 text-${type}-800 border border-${type}-300` 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
              style={{
                backgroundColor: selectedCrops.includes(type) 
                  ? `${getCropColor(type)}20` 
                  : '',
                borderColor: selectedCrops.includes(type) 
                  ? getCropColor(type) 
                  : '',
                color: selectedCrops.includes(type) 
                  ? getCropColor(type) 
                  : ''
              }}
            >
              <span className="mr-1">{data.icon}</span>
              {data.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-80 w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              
              {Object.entries(cropCatalog)
                .filter(([type]) => selectedCrops.includes(type))
                .map(([type, data]) => (
                  <Line
                    key={type}
                    type="monotone"
                    dataKey={type}
                    name={data.name}
                    stroke={getCropColor(type)}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
