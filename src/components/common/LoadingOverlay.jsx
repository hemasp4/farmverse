import React from 'react';

export default function LoadingOverlay({ message = "Loading...", isVisible = true }) {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-farm-green mb-4"></div>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
}
