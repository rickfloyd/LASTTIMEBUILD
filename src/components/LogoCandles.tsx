import React from "react";

const LogoCandles: React.FC = () => (
  <div className="flex items-center justify-center w-[144px] h-[144px]">
    <svg width="100%" height="100%" viewBox="0 0 144 144" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Candle 1 - Pink */}
      <rect x="32" y="40" width="16" height="64" rx="6" fill="#FF3BDC" />
      <rect x="38" y="32" width="4" height="16" rx="2" fill="#FF3BDC" />
      {/* Candle 2 - Blue */}
      <rect x="64" y="56" width="16" height="48" rx="6" fill="#3B82F6" />
      <rect x="70" y="48" width="4" height="16" rx="2" fill="#3B82F6" />
      {/* Candle 3 - Pink */}
      <rect x="96" y="28" width="16" height="76" rx="6" fill="#FF3BDC" />
      <rect x="102" y="20" width="4" height="16" rx="2" fill="#FF3BDC" />
      {/* Glow effects */}
      <ellipse cx="40" cy="104" rx="14" ry="6" fill="#FF3BDC" fillOpacity="0.25" />
      <ellipse cx="72" cy="104" rx="14" ry="6" fill="#3B82F6" fillOpacity="0.25" />
      <ellipse cx="104" cy="104" rx="14" ry="6" fill="#FF3BDC" fillOpacity="0.25" />
    </svg>
  </div>
);

export default LogoCandles;
