interface ComingSoonProps {
  title: string;
  description: string;
  icon?: string;
  features?: string[];
}

const ComingSoon = ({ title, description, icon = "🚀", features = [] }: ComingSoonProps) => {
  return (
    <div className="min-h-screen bg-charcoal-gradient text-fluorescent-pink flex items-center justify-center p-6">
      <div className="text-center max-w-4xl mx-auto">
        {/* Coming Soon Header */}
        <div className="mb-12">
          <div className="text-6xl mb-4 animate-bounce">{icon}</div>
          <h1 className="text-5xl font-bold text-fluorescent-pink mb-4 drop-shadow-lg animate-pulse-glow">
            {title}
          </h1>
          <h2 className="text-3xl font-bold text-electric-purple mb-6 drop-shadow-lg">
            COMING SOON
          </h2>
          <div className="text-xl text-gray-300 max-w-2xl mx-auto">
            {description}
          </div>
        </div>

        {/* Features Grid */}
        {features.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-deep-black/70 rounded-xl p-6 border-2 border-fluorescent-blue shadow-neon-blue hover:animate-pulse-glow cursor-pointer"
              >
                <div className="text-fluorescent-blue text-sm font-bold">{feature}</div>
              </div>
            ))}
          </div>
        )}

        {/* 404 Style Message */}
        <div className="bg-deep-black/50 rounded-xl p-8 border-2 border-electric-yellow shadow-neon-yellow max-w-md mx-auto">
          <div className="text-6xl font-bold text-electric-yellow mb-4 animate-pulse">404</div>
          <div className="text-xl font-bold text-fluorescent-pink mb-2">Page Under Construction</div>
          <div className="text-gray-400 text-sm mb-4">
            Our quantum engineers are building advanced AI-powered trading tools. Expected launch: Q2 2025.
          </div>
          <div className="text-xs text-pulsing-cyan">
            ⚡ Powered by AI Quantum Algorithms ⚡
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-fluorescent-gradient text-deep-black font-bold py-3 px-8 rounded-lg hover:shadow-neon-pink transition-all duration-300 hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;