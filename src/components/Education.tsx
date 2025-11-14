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
    <div className="p-6 bg-gray-900 text-white">
      <h2 className="text-3xl font-bold mb-6 text-cyan-400">Educational Initiatives</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {educationalInitiatives.map((item, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-cyan-500 transition-all duration-300">
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
