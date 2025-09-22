import axios from 'axios';

const API_URL = 'http://localhost:5000/api/crops';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'x-auth-token': token,
    },
  };
};

// Plant a new crop
export const plantCrop = async (cropType, position, cropCatalog) => {
  const response = await axios.post(API_URL, { cropType, position, cropCatalog }, getAuthConfig());
  return response.data;
};

// Get user's crops
export const getUserCrops = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

// Harvest a crop
export const harvestCrop = async (cropId, marketPrices, cropCatalog) => {
  const response = await axios.post(`${API_URL}/harvest`, { cropId, marketPrices, cropCatalog }, getAuthConfig());
  return response.data;
};