import axios from 'axios';

const API_URL = 'http://localhost:5000/api/leaderboard';

// Get leaderboard data
export const getLeaderboard = async (panchayat) => {
  const params = {};
  if (panchayat) {
    params.panchayat = panchayat;
  }
  const response = await axios.get(API_URL, { params });
  return response.data;
};
