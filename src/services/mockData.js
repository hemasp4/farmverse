// src/services/mockData.js
export const getMockCrops = (userId) => {
  return [
    {
      id: 'mock-crop-1',
      userId,
      type: 'wheat',
      plantedAt: { toDate: () => new Date(Date.now() - 5 * 60 * 1000) },
      harvestTime: { toDate: () => new Date(Date.now() + 5 * 60 * 1000) },
      position: { x: 0, y: 0 },
      stage: 'growing',
      isHarvestable: false
    },
    {
      id: 'mock-crop-2',
      userId,
      type: 'corn',
      plantedAt: { toDate: () => new Date(Date.now() - 10 * 60 * 1000) },
      harvestTime: { toDate: () => new Date(Date.now() - 2 * 60 * 1000) },
      position: { x: 1, y: 0 },
      stage: 'ready',
      isHarvestable: true
    }
  ];
};

export const getMockMarketPrices = () => {
  return {
    wheat: 110,
    corn: 145,
    tomato: 210,
    carrot: 75
  };
};
