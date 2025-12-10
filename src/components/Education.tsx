import React from 'react';

const Education: React.FC = () => {
  const educationalInitiatives = [
    {
      title: "Free Educational Content",
      description: "Creating comprehensive trading courses, tutorials, and educational materials available free to everyone.",
      icon: "📚"
    },
    {
      title: "Youth Trading Programs",
      description: "Funding after-school and summer programs teaching financial literacy and trading basics to kids 12-18.",
      icon: "🎓"
    },
    {
      title: "Scholarship Fund",
      description: "Full scholarships for underprivileged students to attend trading academies and financial education programs.",
      icon: "💰"
    }
  ];

  return (
    <div className="p-6 bg-crystal-deep text-white">
      <h2 className="text-3xl font-bold mb-6 text-crystal-highlight">Educational Initiatives</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {educationalInitiatives.map((item, index) => (
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

export default Education;
