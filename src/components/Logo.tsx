import React from 'react';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      className={`w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)] ${className}`}
    >
      <defs>
        <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
      </defs>
      
      {/* 8-faceted Emerald Shield */}
      <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="url(#emeraldGradient)" />
      
      {/* Inner Wealth Node / Geometric Star */}
      <polygon points="50,20 65,40 80,50 65,60 50,80 35,60 20,50 35,40" fill="#ffffff" opacity="0.9" />
      <circle cx="50" cy="50" r="8" fill="#10B981" />
    </svg>
  );
}
