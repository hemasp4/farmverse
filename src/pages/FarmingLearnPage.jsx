import React from 'react';
import FarmingLearn from '../components/learn/FarmingLearn';
import MainLayout from '../components/layout/MainLayout';

const FarmingLearnPage = () => {
  return (
    <MainLayout requireAuth={false}>
      <div className="bg-gray-100 min-h-screen">
        <FarmingLearn />
      </div>
    </MainLayout>
  );
};

export default FarmingLearnPage;
