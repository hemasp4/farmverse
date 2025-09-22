import React from 'react';

const FarmingLearnDetails = ({ solution, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <button onClick={onBack} className="mb-5  hover:scale-105 transition ease-in-out text-xl duration-600 bg-black px-3 py-3 rounded-xl hover:text-white text-white">
        &larr; Back to Solutions
      </button>
      <h2 className="text-3xl font-bold text-green-800 mb-4">{solution.title}</h2>
      <div className="text-6xl mb-4">{solution.icon}</div>
      <p className="text-gray-700 mb-6">{solution.description}</p>
      
      <div className="space-y-4">
        {solution.details.map((detail, index) => (
          <div key={index}>
            <h3 className="text-xl font-semibold text-green-700">{detail.title}</h3>
            <p className="text-gray-600">{detail.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FarmingLearnDetails;
