import React, { useMemo, useState } from "react";

// Modal Component
const Modal: React.FC<{ content: React.ReactNode; onClose: () => void }> = ({ content, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-charcoal p-8 rounded-lg shadow-neon-blue w-1/2 max-w-2xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-2xl">&times;</button>
        <div>{content}</div>
        <button
          onClick={onClose}
          className="mt-6 bg-neon-pink text-white py-2 px-5 rounded-lg hover:bg-hot-pink transition-colors duration-300 shadow-neon-pink/50 hover:shadow-neon-pink/80"
        >
          Close
        </button>
      </div>
    </div>
  );
};

type LifeCard = {
  title: string;
  subtitle: string;
  icon: string;
  accent: string; // gradient classes
  modalContent: React.ReactNode;
};

const CyberCard: React.FC<Omit<LifeCard, 'modalContent'> & { onClick: () => void }> = ({ title, subtitle, icon, accent, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group relative text-left rounded-2xl p-[2px] focus:outline-none focus:ring-2 focus:ring-pulsing-cyan/70 w-full h-full"
      style={{ textDecoration: "none" }}
    >
      {/* Neon gradient frame */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accent} opacity-80 blur-[1px]`}
      />

      {/* Card body */}
      <div className="relative rounded-2xl bg-deep-black/90 backdrop-blur-md border border-white/5 p-5 h-full shadow-lg transition-all duration-300
                      group-hover:-translate-y-1 group-hover:shadow-neon-blue">
        {/* Soft glow blobs */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-fluorescent-gradient opacity-20 blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-cyber-gradient opacity-10 blur-3xl" />

        {/* Scanline / cyber texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08]"
             style={{
               backgroundImage:
                 "repeating-linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08) 1px, transparent 1px, transparent 4px)"
             }}
        />

        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">{icon}</div>
          <h3 className="text-lg font-extrabold text-fluorescent-pink drop-shadow-[0_0_12px_rgba(255,20,147,0.6)]">
            {title}
          </h3>
        </div>

        <p className="text-sm text-pulsing-cyan leading-relaxed">
          {subtitle}
        </p>

        {/* Bottom neon bar */}
        <div className="mt-4 h-1 w-full bg-charcoal rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-fluorescent-gradient animate-pulse-glow" />
        </div>
      </div>
    </button>
  );
};

export default function MAKINGLIFEEASIER() {
  const [zip, setZip] = useState("");
  const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);

  const openModal = (content: React.ReactNode) => setModalContent(content);
  const closeModal = () => setModalContent(null);

  const cards: LifeCard[] = useMemo(
    () => [
      {
        title: "Top Fast Food",
        subtitle: "Tap to search top fast food near your Zip.",
        icon: "🍔",
        accent: "from-electric-orange/60 via-electric-yellow/40 to-fluorescent-pink/60",
        modalContent: (
            <div>
                <h3 className='text-neon-lime'>Searching for Fast Food</h3>
                <a href={zip ? `https://www.google.com/search?q=best+fast+food+near+${zip}` : `https://www.google.com/search?q=best+fast+food+near+me`} target="_blank" rel="noopener noreferrer" className='text-bright-cyan'>Click here to see results</a>
            </div>
        )
      },
      {
        title: "Best Restaurants",
        subtitle: "Tap to find best sit-down spots + reviews.",
        icon: "🍽️",
        accent: "from-neon-green/50 via-pulsing-cyan/60 to-electric-purple/60",
        modalContent: (
            <div>
                <h3 className='text-neon-lime'>Searching for Restaurants</h3>
                <a href={zip ? `https://www.google.com/search?q=best+restaurants+near+${zip}` : `https://www.google.com/search?q=best+restaurants+near+me`} target="_blank" rel="noopener noreferrer" className='text-bright-cyan'>Click here to see results</a>
            </div>
        )
      },
      {
        title: "OpenTable",
        subtitle: "Book a table by Zip.",
        icon: "📍",
        accent: "from-fluorescent-blue/60 via-electric-purple/60 to-fluorescent-pink/60",
        modalContent: (
            <div>
                <h3 className='text-neon-lime'>Find a Table</h3>
                <a href={zip ? `https://www.opentable.com/nearby/restaurants-near-me-${zip}` : `https://www.opentable.com/nearby`} target="_blank" rel="noopener noreferrer" className='text-bright-cyan'>Click here to book on OpenTable</a>
            </div>
        )
      },
      {
        title: "Food Delivery",
        subtitle: "DoorDash • UberEats • Grubhub • Postmates",
        icon: "🛵",
        accent: "from-pulsing-cyan/60 via-fluorescent-blue/50 to-neon-green/60",
        modalContent: (
            <div>
                <h3 className='text-neon-lime'>Food Delivery Options</h3>
                <a href="https://www.google.com/search?q=food+delivery+apps" target="_blank" rel="noopener noreferrer" className='text-bright-cyan'>See delivery apps</a>
            </div>
        )
      },
      {
        title: "Bluetooth",
        subtitle: "Quick toggle helper (safe placeholder).",
        icon: "📲",
        accent: "from-electric-purple/60 via-fluorescent-blue/60 to-pulsing-cyan/60",
        modalContent: "Bluetooth toggle is a device feature — we’ll wire this later."
      },
      {
        title: "Spotify",
        subtitle: "Open Spotify.",
        icon: "🎧",
        accent: "from-neon-green/60 via-pulsing-cyan/50 to-fluorescent-blue/60",
        modalContent: (
            <div>
                <h3 className='text-neon-lime'>Launch Spotify</h3>
                <a href="https://open.spotify.com/" target="_blank" rel="noopener noreferrer" className='text-bright-cyan'>Open Spotify</a>
            </div>
        )
      },
      {
        title: "YouTube Music",
        subtitle: "Open YouTube Music.",
        icon: "📺",
        accent: "from-hot-pink/60 via-electric-orange/40 to-electric-yellow/60",
        modalContent: (
            <div>
                <h3 className='text-neon-lime'>Launch YouTube Music</h3>
                <a href="https://music.youtube.com/" target="_blank" rel="noopener noreferrer" className='text-bright-cyan'>Open YouTube Music</a>
            </div>
        )
      },
      {
        title: "Podcasts",
        subtitle: "Apple / Google podcasts hubs.",
        icon: "🎙️",
        accent: "from-fluorescent-pink/60 via-electric-purple/60 to-pulsing-cyan/60",
        modalContent: (
            <div>
                <h3 className='text-neon-lime'>Listen to Podcasts</h3>
                <a href="https://podcasts.google.com/" target="_blank" rel="noopener noreferrer" className='text-bright-cyan'>Open Google Podcasts</a>
            </div>
        )
      },
      {
        title: "Social Media",
        subtitle: "Top socials quick launch list.",
        icon: "🌐",
        accent: "from-fluorescent-blue/60 via-pulsing-cyan/60 to-fluorescent-pink/60",
        modalContent: (
            <div>
                <h3 className='text-neon-lime'>Social Media</h3>
                <a href="https://www.google.com/search?q=top+social+media+sites" target="_blank" rel="noopener noreferrer" className='text-bright-cyan'>Find top social media sites</a>
            </div>
        )
      },
      {
        title: "Quick Tools",
        subtitle: "Extra life helpers slot (we’ll expand).",
        icon: "⚡",
        accent: "from-electric-yellow/60 via-electric-orange/40 to-neon-green/60",
        modalContent: "This is your 10th card slot. Tell me what you want here."
      },
    ],
    [zip]
  );

  return (
    <section className="bg-charcoal-gradient border-2 border-fluorescent-pink shadow-neon-pink p-6 rounded-xl">
      {modalContent && <Modal content={modalContent} onClose={closeModal} />}

      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-neon-green animate-pulse-glow">
            MAKING LIFE EASIER
          </h2>
          <p className="text-sm text-pulsing-cyan">
            Your cyber-punk life dashboard inside Quantum Charts.
          </p>
        </div>

        {/* Zip input */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-300">Zip Code</label>
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            placeholder="90210"
            className="w-28 bg-deep-black text-white border border-electric-purple rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fluorescent-pink/70"
          />
        </div>
      </div>

      {/* The cyberpunk card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card, i) => (
          <CyberCard
            key={i}
            {...card}
            onClick={() => openModal(card.modalContent)}
          />
        ))}
      </div>
    </section>
  );
}