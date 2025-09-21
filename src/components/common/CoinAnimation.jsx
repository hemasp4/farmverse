import React, { useState, useEffect } from 'react';

export default function CoinAnimation({ amount, isVisible, onComplete }) {
  const [position, setPosition] = useState({ top: '50%', left: '50%' });
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    if (isVisible) {
      // Random position near the center
      const randomTop = 40 + Math.random() * 20;
      const randomLeft = 40 + Math.random() * 20;
      
      setPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
      setOpacity(1);
      
      // Animate out after 1.5 seconds
      const timer = setTimeout(() => {
        setOpacity(0);
        // Call onComplete after animation is done
        setTimeout(onComplete, 500);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);
  
  if (!isVisible) return null;
  
  const isPositive = amount > 0;
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      style={{ opacity }}
    >
      <div 
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000
                    ${isPositive ? 'text-green-600 animate-float-up' : 'text-red-600 animate-float-down'}`}
        style={{ 
          top: position.top, 
          left: position.left,
          fontSize: '2rem',
          fontWeight: 'bold',
          transition: 'opacity 0.5s ease-in-out'
        }}
      >
        {isPositive ? '+' : ''}{amount} 💰
      </div>
    </div>
  );
}
