import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/Authcontext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getLeaderboard } from '../services/leaderboardService';
import MainLayout from '../components/layout/MainLayout';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [scope, setScope] = useState('world'); // 'world' or 'panchayat'
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        // Only show full-page loader on initial load
        if (leaderboardData.length === 0) {
          setLoading(true);
        }
        const panchayat = scope === 'panchayat' ? currentUser?.panchayat : null;
        const data = await getLeaderboard(panchayat);
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard(); // Initial fetch

    const intervalId = setInterval(fetchLeaderboard, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [scope, currentUser]);

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center text-farm-green mb-6">Leaderboard</h1>

        <div className="flex justify-center mb-6">
          <div className="bg-gray-200 rounded-full p-1 flex space-x-1">
            <button
              onClick={() => setScope('world')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${scope === 'world' ? 'bg-white text-farm-green shadow' : 'text-gray-600'}`}>
              World
            </button>
            <button
              onClick={() => setScope('panchayat')}
              disabled={!currentUser?.panchayat} // Note: panchayat data doesn't exist on user model yet
              className={`px-4 py-2 rounded-full text-sm font-medium ${scope === 'panchayat' ? 'bg-white text-farm-green shadow' : 'text-gray-600'} disabled:opacity-50 disabled:cursor-not-allowed`}>
              Panchayat
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farm Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboardData.map(user => (
                  <tr key={user.uid}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.rank}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.farmName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.experience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}