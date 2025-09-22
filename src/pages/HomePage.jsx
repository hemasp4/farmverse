import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/Authcontext';
import MainLayout from '../components/layout/MainLayout';

export default function HomePage() {
  const { currentUser } = useAuth();
  
  return (
    <MainLayout requireAuth={false}>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Grow Your Virtual</span>
                <span className="block text-farm-green">Sustainable Farm</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-3xl">
                Welcome to FarmVerse, where sustainable farming meets gaming. Plant crops, watch them grow in real-time, and build your farming empire while learning about sustainable agriculture practices.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                {currentUser ? (
                  <Link to="/farm" className="btn-primary text-center px-8 py-3 text-lg">
                    Go to My Farm
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn-primary text-center px-8 py-3 text-lg">
                      Start Farming
                    </Link>
                    <Link to="/login" className="bg-white border border-farm-green text-farm-green hover:bg-green-50 px-8 py-3 rounded-lg text-center text-lg">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/farm-hero.png" 
                alt="Virtual Farm Illustration" 
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/600x400?text=FarmVerse';
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">How FarmVerse Works</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              A simple, engaging, and educational farming experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Plant Feature */}
            <div className="bg-green-50 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-xl font-bold mb-2">Plant & Grow</h3>
              <p className="text-gray-600">
                Choose from various crops to plant in your virtual farm. Each crop has unique growth times and values.
              </p>
            </div>
            
            {/* Harvest Feature */}
            <div className="bg-yellow-50 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">🌾</div>
              <h3 className="text-xl font-bold mb-2">Harvest & Sell</h3>
              <p className="text-gray-600">
                Harvest your crops when they're ready and sell them at the market for coins. Prices fluctuate daily!
              </p>
            </div>
            
            {/* Expand Feature */}
            <div className="bg-blue-50 rounded-xl p-8 text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Expand & Evolve</h3>
              <p className="text-gray-600">
                Reinvest your earnings to expand your farm, unlock new crops, and climb the leaderboard.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">What Farmers Are Saying</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-farm-green rounded-full flex items-center justify-center text-white text-xl font-bold">
                  A
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Alex Johnson</h4>
                  <p className="text-sm text-gray-500">Level 12 Farmer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've learned so much about crop cycles and sustainable farming practices. The real-time growth system makes it so engaging!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-farm-green rounded-full flex items-center justify-center text-white text-xl font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah Miller</h4>
                  <p className="text-sm text-gray-500">Level 8 Farmer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I check my farm every day to see how my crops are doing. The market price fluctuations add a fun strategic element!"
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-farm-green rounded-full flex items-center justify-center text-white text-xl font-bold">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Michael Lee</h4>
                  <p className="text-sm text-gray-500">Level 15 Farmer</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Started with a tiny plot and now I have a thriving farm empire. The notifications keep me engaged even when I'm busy!"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-farm-green">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">Ready to Start Your Farming Journey?</h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join thousands of virtual farmers today and grow your sustainable farm empire.
          </p>
                    {currentUser ? (
            <Link to="/farm" className="bg-white text-farm-green hover:bg-green-50 px-8 py-3 rounded-lg text-lg font-medium inline-block">
              Go to My Farm
            </Link>
          ) : (
            <Link to="/register" className="bg-white text-farm-green hover:bg-green-50 px-8 py-3 rounded-lg text-lg font-medium inline-block">
              Start Farming Now
            </Link>
          )}
        </div>
      </section>
    </MainLayout>
  );
}
