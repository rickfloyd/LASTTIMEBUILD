import React from 'react';

interface AmericanSportsProps {
  onClose: () => void;
}

const AmericanSports: React.FC<AmericanSportsProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-blue-500 rounded-lg shadow-lg p-6 w-full max-w-4xl m-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white"><span role="img" aria-label="USA Flag">🇺🇸</span> North American Major Sports</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-300">
          <div>
            <h3 className="font-bold text-lg text-blue-400">Football</h3>
            <ul>
              <li>NFL (National Football League)</li>
              <li>NCAAF (College Football)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-orange-400">Basketball</h3>
            <ul>
              <li>NBA (National Basketball Association)</li>
              <li>WNBA (Women's National Basketball Association)</li>
              <li>NCAAB (College Basketball)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-red-400">Baseball</h3>
            <ul>
              <li>MLB (Major League Baseball)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-sky-400">Hockey</h3>
            <ul>
              <li>NHL (National Hockey League)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg text-green-400">Soccer</h3>
            <ul>
              <li>MLS (Major League Soccer)</li>
              <li>NWSL (National Women's Soccer League)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmericanSports;