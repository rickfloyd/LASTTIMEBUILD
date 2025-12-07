import React, { useMemo, useState } from "react";

type LifeCard = {
  title: string;
  subtitle: string;
  icon: string;
  accent: string; // gradient classes
  href?: string;
  onClick?: () => void;
};

const CyberCard: React.FC<LifeCard> = ({ title, subtitle, icon, accent, href, onClick }) => {
  const Wrapper: any = href ? "a" : "button";
  const wrapperProps = href
    ? { href, target: "_blank", rel: "noreferrer noopener" }
    : { onClick };

  return (
    <Wrapper
      {...wrapperProps}
      className="group relative text-left rounded-2xl p-[2px] focus:outline-none focus:ring-2 focus:ring-pulsing-cyan/70"
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
    </Wrapper>
  );
};

export default function MAKINGLIFEEASIER() {
  const [zip, setZip] = useState("");

  const cards: LifeCard[] = useMemo(
    () => [
      {
        title: "Top Fast Food",
        subtitle: "Tap to search top fast food near your Zip.",
        icon: "🍔",
        accent: "from-electric-orange/60 via-electric-yellow/40 to-fluorescent-pink/60",
        href: zip
          ? `https://www.google.com/search?q=best+fast+food+near+${zip}`
          : `https://www.google.com/search?q=best+fast+food+near+me`,
      },
      {
        title: "Best Restaurants",
        subtitle: "Tap to find best sit-down spots + reviews.",
        icon: "🍽️",
        accent: "from-neon-green/50 via-pulsing-cyan/60 to-electric-purple/60",
        href: zip
          ? `https://www.google.com/search?q=best+restaurants+near+${zip}`
          : `https://www.google.com/search?q=best+restaurants+near+me`,
      },
      {
        title: "OpenTable",
        subtitle: "Book a table by Zip.",
        icon: "📍",
        accent: "from-fluorescent-blue/60 via-electric-purple/60 to-fluorescent-pink/60",
        href: zip
          ? `https://www.opentable.com/nearby/restaurants-near-me-${zip}`
          : `https://www.opentable.com/nearby`,
      },
      {
        title: "Food Delivery",
        subtitle: "DoorDash • UberEats • Grubhub • Postmates",
        icon: "🛵",
        accent: "from-pulsing-cyan/60 via-fluorescent-blue/50 to-neon-green/60",
        href: "https://www.google.com/search?q=food+delivery+apps",
      },
      {
        title: "Bluetooth",
        subtitle: "Quick toggle helper (safe placeholder).",
        icon: "📲",
        accent: "from-electric-purple/60 via-fluorescent-blue/60 to-pulsing-cyan/60",
        onClick: () => alert("Bluetooth toggle is a device feature — we’ll wire this later."),
      },
      {
        title: "Spotify",
        subtitle: "Open Spotify.",
        icon: "🎧",
        accent: "from-neon-green/60 via-pulsing-cyan/50 to-fluorescent-blue/60",
        href: "https://open.spotify.com/",
      },
      {
        title: "YouTube Music",
        subtitle: "Open YouTube Music.",
        icon: "📺",
        accent: "from-hot-pink/60 via-electric-orange/40 to-electric-yellow/60",
        href: "https://music.youtube.com/",
      },
      {
        title: "Podcasts",
        subtitle: "Apple / Google podcasts hubs.",
        icon: "🎙️",
        accent: "from-fluorescent-pink/60 via-electric-purple/60 to-pulsing-cyan/60",
        href: "https://podcasts.google.com/",
      },
      {
        title: "Social Media",
        subtitle: "Top socials quick launch list.",
        icon: "🌐",
        accent: "from-fluorescent-blue/60 via-pulsing-cyan/60 to-fluorescent-pink/60",
        href: "https://www.google.com/search?q=top+social+media+sites",
      },
      {
        title: "Quick Tools",
        subtitle: "Extra life helpers slot (we’ll expand).",
        icon: "⚡",
        accent: "from-electric-yellow/60 via-electric-orange/40 to-neon-green/60",
        onClick: () => alert("This is your 10th card slot. Tell me what you want here."),
      },
    ],
    [zip]
  );

  return (
    <section className="bg-charcoal-gradient border-2 border-fluorescent-pink shadow-neon-pink p-6 rounded-xl">
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
        {cards.map((c, i) => (
          <CyberCard key={i} {...c} />
        ))}
      </div>
    </section>
  );
}