import axios from 'axios';

const API_URL = 'http://localhost:5000/api/market';

// Get current market prices
export const getMarketPrices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Sell a crop at current market price
export const sellCrop = async (cropType, quantity) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'x-auth-token': token,
    },
  };
  const response = await axios.post(`${API_URL}/sell`, { cropType, quantity }, config);
  return response.data;
};