import React from 'react';

export default function ProgressBar({ 
  progress, 
  color = 'bg-farm-green', 
  height = 'h-2',
  showPercentage = false,
  rounded = true
}) {
  // Ensure progress is between 0-100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={`w-full bg-gray-200 ${rounded ? 'rounded-full' : 'rounded'} ${height}`}>
      <div 
        className={`${color} ${rounded ? 'rounded-full' : 'rounded-l'} ${height} transition-all duration-500 ease-out`} 
        style={{ width: `${normalizedProgress}%` }}
      >
        {showPercentage && (
          <span className="sr-only">{Math.round(normalizedProgress)}% Complete</span>
        )}
      </div>
    </div>
  );
}
