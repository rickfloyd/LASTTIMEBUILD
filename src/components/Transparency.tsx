import React from 'react';

const Transparency: React.FC = () => {
  const transparencyPoints = [
    {
      title: "Open Source Tools",
      description: "Developing and maintaining free trading tools, indicators, and educational software for the community.",
      icon: "🛠️"
    },
    {
      title: "Platform Development",
      description: "Keeping this platform free, fast, and constantly improving with new features and capabilities.",
      icon: "🚀"
    },
    {
      title: "Community Driven",
      description: "Our roadmap and features are prioritized based on community feedback and suggestions.",
      icon: "💬"
    }
  ];

  return (
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6 text-green-400">Transparency & Open Source</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {transparencyPoints.map((item, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-all duration-300">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transparency;
