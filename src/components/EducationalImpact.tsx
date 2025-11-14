import React, { useState } from 'react';
import './EducationalImpact.css';
import { useEducationalImpact } from '../hooks/useEducationalImpact';

interface ImpactBreakdown {
  category: string;
  percentage: number;
  description: string;
  color: string;
  icon: string;
}

const EducationalImpact: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { notifications, getTotalStats } = useEducationalImpact();
  const liveStats = getTotalStats();

  const impactBreakdown: ImpactBreakdown[] = [
    {
      category: "Free Educational Content",
      percentage: 35,
      description: "Creating comprehensive trading courses, tutorials, and educational materials available free to everyone",
      color: "from-cyan-400 to-cyan-600",
      icon: "📚"
    },
    {
      category: "Youth Trading Programs",
      percentage: 25,
      description: "Funding after-school and summer programs teaching financial literacy and trading basics to kids 12-18",
      color: "from-purple-400 to-purple-600",
      icon: "🎓"
    },
    {
      category: "Scholarship Fund",
      percentage: 20,
      description: "Full scholarships for underprivileged students to attend trading academies and financial education programs",
      color: "from-green-400 to-green-600",
      icon: "💰"
    },
    {
      category: "Open Source Tools",
      percentage: 10,
      description: "Developing and maintaining free trading tools, indicators, and educational software for the community",
      color: "from-blue-400 to-blue-600",
      icon: "🛠️"
    },
    {
      category: "Platform Development",
      percentage: 10,
      description: "Keeping this platform free, fast, and constantly improving with new features and capabilities",
      color: "from-pink-400 to-pink-600",
      icon: "🚀"
    }
  ];

  const totalImpact = liveStats;

  return (
    <div className="educational-impact-section bg-gray-900/95 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 mb-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            Educational Impact Transparency
          </h2>
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">
            100% Transparent
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Where Your Payment Goes</span>
          <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </div>

      {/* Always visible summary */}
      <div className="mt-4 text-center">
        <p className="text-gray-300 text-sm mb-3">
          <span className="text-cyan-400 font-semibold">90%</span> of every payment directly funds educational programs for future traders
        </p>
        <div className="flex justify-center space-x-6 text-xs">
          <div className="text-center">
            <div className="text-cyan-400 font-bold text-lg">{totalImpact.studentsHelped.toLocaleString()}</div>
            <div className="text-gray-400">Students Helped</div>
          </div>
          <div className="text-center">
            <div className="text-purple-400 font-bold text-lg">{totalImpact.coursesCreated}</div>
            <div className="text-gray-400">Free Courses</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold text-lg">{totalImpact.scholarshipsAwarded}</div>
            <div className="text-gray-400">Scholarships</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-bold text-lg">{totalImpact.freeToolsReleased}</div>
            <div className="text-gray-400">Free Tools</div>
          </div>
        </div>
      </div>

      {/* Expandable detailed breakdown */}
      {isExpanded && (
        <div className="mt-6 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-4">Detailed Breakdown</h3>
            
            {impactBreakdown.map((item, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-white font-medium">{item.category}</span>
                  </div>
                  <span className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                    {item.percentage}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-800 rounded-full h-3 mb-2">
                  <div 
                    className={`impact-progress-bar h-3 rounded-full bg-gradient-to-r ${item.color} transition-all duration-1000`}
                    data-percentage={item.percentage}
                  ></div>
                </div>
                
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-3">Our Mission</h3>
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                We believe trading education should be accessible to everyone, not just those who can afford $200/month platforms. 
                By making our platform affordable and transparent, we're breaking down financial barriers and empowering the next 
                generation of traders with the knowledge and tools they need to succeed.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">Financial Literacy</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Youth Education</span>
                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Equal Access</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Community Impact</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-semibold text-white mb-3">Live Impact Feed</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                notifications.map((notification) => {
                  const timeAgo = Math.floor((Date.now() - notification.timestamp.getTime()) / 60000);
                  const getColor = (type: string) => {
                    switch(type) {
                      case 'scholarship': return 'bg-green-400';
                      case 'course': return 'bg-cyan-400';
                      case 'program': return 'bg-purple-400';
                      case 'tool': return 'bg-blue-400';
                      default: return 'bg-gray-400';
                    }
                  };
                  
                  return (
                    <div key={notification.id} className="flex items-center space-x-2 text-sm">
                      <div className={`w-2 h-2 ${getColor(notification.type)} rounded-full`}></div>
                      <span className="text-gray-400">
                        {timeAgo === 0 ? 'Just now' : `${timeAgo} minute${timeAgo !== 1 ? 's' : ''} ago`}:
                      </span>
                      <span className="text-white">{notification.message}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-400 py-4">
                  Loading live impact updates...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationalImpact;