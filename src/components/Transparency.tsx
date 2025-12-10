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
    <div className="p-6 bg-crystal-deep text-white">
      <h2 className="text-3xl font-bold mb-6 text-crystal-highlight">Transparency & Open Source</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {transparencyPoints.map((item, index) => (
          <div key={index} className={`bg-crystal-top p-6 rounded-lg border hover:border-crystal-highlight transition-all duration-300 ${
            index === 0 ? 'border-neon-lime shadow-outline-neon-lime' :
            index === 1 ? 'border-bright-cyan shadow-outline-bright-cyan' :
            'border-crystal-glow shadow-neon-blue'
          }`}>
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
