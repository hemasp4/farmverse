import React, { useState } from 'react';
import FarmingLearnDetails from './FarmingLearnDetails';

const FarmingLearn = () => {
  const [selectedSolution, setSelectedSolution] = useState(null);

  const modernSolutions = [
    {
      title: 'Precision Agriculture',
      description: 'Utilizing GPS, sensors, and data analytics to optimize crop yields and reduce waste.',
      icon: '🎯',
      details: [
        {
          title: 'Key Technologies',
          content: 'GPS, GIS, remote sensing, variable rate technology (VRT), and data management software.'
        },
        {
          title: 'Benefits',
          content: 'Increased efficiency, reduced input costs (water, fertilizer, pesticides), improved crop quality, and environmental protection.'
        },
        {
          title: 'Implementation Steps',
          content: '1. Data Collection (soil sampling, satellite imagery). 2. Data Analysis (creating management zones). 3. Application (using VRT for precise input application).'
        }
      ]
    },
    {
      title: 'Vertical Farming',
      description: 'Growing crops in vertically stacked layers, often indoors, to save space and resources.',
      icon: '🏢',
      details: [
        {
          title: 'Methods',
          content: 'Hydroponics, aeroponics, and aquaponics are common growing methods in vertical farms.'
        },
        {
          title: 'Advantages',
          content: 'Year-round production, reduced water consumption, no need for pesticides, and can be located in urban areas.'
        },
        {
          title: 'Challenges',
          content: 'High initial investment, high energy consumption for lighting and climate control.'
        }
      ]
    },
    {
      title: 'Hydroponics & Aeroponics',
      description: 'Growing plants without soil, using nutrient-rich water solutions or mist.',
      icon: '💧',
      details: [
        {
          title: 'Hydroponics',
          content: 'Plants are grown in a nutrient-rich water solution. Roots are either submerged or in a medium like perlite or rockwool.'
        },
        {
          title: 'Aeroponics',
          content: 'Plants are suspended in the air and roots are misted with a nutrient solution. This method uses even less water than hydroponics.'
        },
        {
          title: 'Benefits',
          content: 'Faster growth, higher yields, and can be used in areas with poor soil quality.'
        }
      ]
    },
    {
      title: 'Drone Technology',
      description: 'Using drones for crop monitoring, pest control, and aerial imaging.',
      icon: '✈️',
      details: [
        {
          title: 'Applications',
          content: 'Crop health monitoring (NDVI), pest and disease detection, targeted spraying of pesticides and fertilizers, and livestock monitoring.'
        },
        {
          title: 'Data Collection',
          content: 'Drones equipped with multispectral and thermal cameras collect data that is processed to create detailed field maps.'
        },
        {
          title: 'Advantages',
          content: 'Time-saving, early problem detection, and precise application of treatments.'
        }
      ]
    },
    {
      title: 'AI & Machine Learning',
      description: 'Leveraging AI to predict weather patterns, identify diseases, and automate farming tasks.',
      icon: '🤖',
      details: [
        {
          title: 'Use Cases',
          content: 'Predictive analytics for yield prediction, image recognition for disease and pest identification, and autonomous robots for harvesting and weeding.'
        },
        {
          title: 'Impact',
          content: 'Improved decision-making, increased automation, and optimized resource management.'
        },
        {
          title: 'Future Trends',
          content: 'Integration with IoT devices, development of more sophisticated autonomous systems, and hyper-personalization of farm management.'
        }
      ]
    },
  ];

  const handleSolutionClick = (solution) => {
    setSelectedSolution(solution);
  };

  const handleBack = () => {
    setSelectedSolution(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {selectedSolution ? (
        <FarmingLearnDetails solution={selectedSolution} onBack={handleBack} />
      ) : (
        <>
          <h1 className="text-4xl font-bold text-center text-green-800 mb-8">Modern Farming Solutions</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modernSolutions.map((solution, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleSolutionClick(solution)}
              >
                <div className="text-4xl mb-4">{solution.icon}</div>
                <h2 className="text-2xl font-bold text-green-700 mb-2">{solution.title}</h2>
                <p className="text-gray-600">{solution.description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FarmingLearn;