import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/Authcontext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Farm', path: '/farm', icon: '🌱' },
    { name: 'Market', path: '/market', icon: '🛒' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🏆' },
    { name: 'News', path: '/news', icon: '📰' },
    { name: 'Learn', path: '/learn', icon: '🎓' },
  ];
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl">🌾</span>
                <span className="ml-2 text-xl font-bold text-farm-green">FarmVerse</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {currentUser && navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive(item.path)
                      ? 'text-farm-green bg-green-50'
                      : 'text-gray-600 hover:text-farm-green hover:bg-green-50'
                    }
                  `}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* User Menu */}
          <div className="flex items-center">
            {currentUser ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  {currentUser && (
                    <div className="mr-4 hidden md:flex items-center">
                      <span className="text-yellow-500 mr-1">💰</span>
                      <span className="font-medium">{currentUser.coins}</span>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-farm-green"
                  >
                    <div className="h-8 w-8 rounded-full bg-farm-green flex items-center justify-center text-white">
                      {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '?'}
                    </div>
                  </button>
                </div>
                
                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                    {currentUser && (
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium">Welcome, {currentUser.username}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                    )}
                    <div className="px-4 py-2">
                      {/* <LanguageSwitcher /> */}
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-farm-green">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center sm:hidden ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-farm-green"
              >
                <span className="sr-only">Open main menu</span>
                {/* Icon for menu */}
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {currentUser && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  block pl-3 pr-4 py-2 border-l-4
                  ${isActive(item.path)
                    ? 'border-farm-green text-farm-green bg-green-50'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                  }
                `}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            
            {currentUser && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
