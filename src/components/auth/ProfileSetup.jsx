import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/Authcontext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import LoadingSpinner from '../common/LoadingSpinner';

const FARM_STYLES = [
  { id: 'traditional', name: 'Traditional Farm', icon: '🏡', description: 'Classic farming with a mix of crops and traditional methods.' },
  { id: 'organic', name: 'Organic Farm', icon: '🌿', description: 'Chemical-free farming focusing on natural cultivation methods.' },
  { id: 'hightech', name: 'High-Tech Farm', icon: '🤖', description: 'Modern farming using advanced technology and precision agriculture.' },
  { id: 'tropical', name: 'Tropical Farm', icon: '🌴', description: 'Exotic farming in warm climate with unique tropical crops.' }
];

export default function ProfileSetup() {
  const [selectedStyle, setSelectedStyle] = useState('');
  const [farmName, setFarmName] = useState('');
  const [avatar, setAvatar] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, userData, fetchUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user already completed profile setup, redirect to dashboard
    if (userData && userData.profileSetupComplete) {
      navigate('/dashboard');
    }
  }, [userData, navigate]);

  const handleAvatarChange = (direction) => {
    if (direction === 'next') {
      setAvatar(prev => (prev === 5 ? 1 : prev + 1));
    } else {
      setAvatar(prev => (prev === 1 ? 5 : prev - 1));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!farmName.trim()) {
      return setError('Please enter a farm name');
    }
    
    if (!selectedStyle) {
      return setError('Please select a farm style');
    }
    
    try {
      setLoading(true);
      setError('');
      
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        farmName: farmName,
        farmStyle: selectedStyle,
        avatarId: avatar,
        profileSetupComplete: true
      });
      
      // Refresh user data
      await fetchUserData(currentUser.uid);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="card w-full max-w-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-farm-green mb-2">Set Up Your Farm</h2>
          <p className="text-gray-600">Customize your farming experience</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Farm Name */}
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="farm-name">
              Farm Name
            </label>
            <input
              id="farm-name"
              type="text"
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-farm-green"
              placeholder="Green Acres"
              maxLength={20}
              required
            />
          </div>
          
          {/* Farmer Avatar */}
          <div>
            <label className="block text-gray-700 mb-2">
              Farmer Avatar
            </label>
            <div className="flex items-center justify-center space-x-4">
              <button 
                type="button"
                onClick={() => handleAvatarChange('prev')}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center border-4 border-farm-green">
                <span className="text-4xl">
                  {avatar === 1 && '👨‍🌾'}
                  {avatar === 2 && '👩‍🌾'}
                  {avatar === 3 && '🧑‍🌾'}
                  {avatar === 4 && '👵'}
                  {avatar === 5 && '👴'}
                </span>
              </div>
              
              <button 
                type="button"
                onClick={() => handleAvatarChange('next')}
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Farm Style */}
          <div>
            <label className="block text-gray-700 mb-2">
              Farm Style
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {FARM_STYLES.map(style => (
                <div 
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`
                    p-4 border rounded-lg cursor-pointer
                    ${selectedStyle === style.id ? 'border-farm-green bg-green-50' : 'border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">{style.icon}</span>
                    <h3 className="font-medium">{style.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{style.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-lg"
          >
            {loading ? 'Setting Up...' : 'Start Farming!'}
          </button>
        </form>
      </div>
    </div>
  );
}
