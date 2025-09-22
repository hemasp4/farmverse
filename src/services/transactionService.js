import axios from 'axios';

const API_URL = 'http://localhost:5000/api/transactions';

const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'x-auth-token': token,
    },
  };
};

// Get user's transaction history
export const getTransactions = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};
