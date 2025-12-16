
import React from 'react';

const ModeratorsPage: React.FC = () => {
  const moderators = [
    { id: 1, name: 'Zenith', rank: 'Lead Moderator', description: 'Head of community safety and enforcement. Ensures a respectful and productive environment for all users.', avatar: 'https://i.pravatar.cc/150?u=zenith' },
    { id: 2, name: 'Cypher', rank: 'Technical Moderator', description: 'Specializes in script and code moderation. Keeps the community scripts clean and safe.', avatar: 'https://i.pravatar.cc/150?u=cypher' },
    { id: 3, name: 'Nova', rank: 'Community Moderator', description: 'Manages public discussions and user-generated content. The first point of contact for community issues.', avatar: 'https://i.pravatar.cc/150?u=nova' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          Community Moderators
        </h1>
        <p className="text-center text-lg text-gray-400 mt-2">
          The enforcers of the community.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {moderators.map(mod => (
          <div key={mod.id} className="neon-card p-6 text-center">
            <img src={mod.avatar} alt={mod.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-red-500" />
            <h3 className="text-2xl font-bold neon-card-title">{mod.name}</h3>
            <p className="text-red-400 font-semibold">{mod.rank}</p>
            <p className="text-sm text-gray-300 mt-3">{mod.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeratorsPage;
