import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Market from '../components/market/Market';

export default function MarketPage() {
  
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Farmer's Market</h1>
          <p className="text-gray-600">Buy seeds, sell crops, and track market trends</p>
        </div>
        
        {/* Main Market Component */}
        <Market />
        
      </div>
    </MainLayout>
  );
}
