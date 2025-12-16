import React from 'react';
import CommunityHub from '../components/CommunityHub';

const PrivateCommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
          Private Community Hub
        </h1>
        <p className="text-center text-lg text-gray-400 mt-2">
          Access exclusive content, tools, and discussions for members only.
        </p>
      </header>
      
      <CommunityHub visibility="private" />
    </div>
  );
};

export default PrivateCommunityPage;
