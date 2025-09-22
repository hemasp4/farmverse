import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/Authcontext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [scope, setScope] = useState('world'); // 'world' or 'panchayat'
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  return (
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
            disabled={!userData?.panchayat}
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
  );
}