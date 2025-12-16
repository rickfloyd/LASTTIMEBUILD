
import React from 'react';

const BrokersPage: React.FC = () => {
  const brokers = [
    { id: 1, name: 'Vertex Finance', logo: 'https://placehold.co/100x40/000000/FFFFFF/png?text=Vertex' },
    { id: 2, name: 'Quantum Trades', logo: 'https://placehold.co/100x40/000000/FFFFFF/png?text=Quantum' },
    { id: 3, name: 'Apex Futures', logo: 'https://placehold.co/100x40/000000/FFFFFF/png?text=Apex' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          Connect a Broker
        </h1>
        <p className="text-center text-lg text-gray-400 mt-2">
          Link your brokerage account to trade directly from QUBIT.
        </p>
      </header>

      {/* Featured Brokers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {brokers.map(broker => (
          <div key={broker.id} className="neon-card p-6 flex flex-col items-center justify-between">
            <img src={broker.logo} alt={`${broker.name} logo`} className="h-12 mb-4"/>
            <button className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg hover:bg-yellow-400 transition-colors">
              Connect
            </button>
          </div>
        ))}
      </div>

      {/* Broker Comparison Table */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-6">Broker Comparison</h2>
        {/* Placeholder for table */}
        <div className="overflow-x-auto">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-center text-gray-400">Broker comparison table coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokersPage;
