import React from 'react';
import { CategorySelector } from './CategorySelector';

const ModeDashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-6 bg-gray-900 text-white">
      <CategorySelector />
    </div>
  );
};

export default ModeDashboard;
