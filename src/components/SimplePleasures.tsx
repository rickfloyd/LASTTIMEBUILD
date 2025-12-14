import React, { useState } from 'react';

const SimplePleasures: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-charcoal-gradient p-4 rounded-lg shadow-lg">
      <button
        onClick={toggleModal}
        className="text-lg font-bold text-white bg-transparent border-none cursor-pointer focus:outline-none"
      >
        Simple Pleasures
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-charcoal p-8 rounded-lg shadow-neon-blue w-1/2">
            <h2 className="text-2xl font-bold mb-4">Simple Pleasures</h2>
            <p>Enjoy the little things in life.</p>
            <button
              onClick={toggleModal}
              className="mt-4 bg-neon-pink text-white py-2 px-4 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplePleasures;
