import React from 'react';

interface WorldSportsProps {
  onClose: () => void;
}

const WorldSports: React.FC<WorldSportsProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-green-500 rounded-lg shadow-lg p-6 w-full max-w-4xl m-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white"><span role="img" aria-label="Globe">🌍</span> World Sports</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-300">
          <div>
            <h3 className="font-bold text-lg text-red-400">Combat Sports</h3>
            <ul>
              <li>Boxing</li>
              <li>MMA (Mixed Martial Arts)</li>
              <li>UFC (Ultimate Fighting Championship)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-yellow-400">Racing</h3>
            <ul>
              <li>NASCAR</li>
              <li>Formula 1</li>
              <li>Horse Racing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-green-400">Golf & Tennis</h3>
            <ul>
              <li>PGA (Professional Golfers' Association)</li>
              <li>LPGA (Ladies Professional Golf Association)</li>
              <li>Grand Slam Tournaments</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-purple-400">Other Sports</h3>
            <ul>
                <li>Badminton</li>
                <li>Cricket</li>
                <li>Cycling</li>
                <li>Darts</li>
                <li>Handball</li>
                <li>Lacrosse</li>
                <li>Rugby</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldSports;