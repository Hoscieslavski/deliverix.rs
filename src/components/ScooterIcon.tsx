import React from 'react';

export default function ScooterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Wheels */}
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />

      {/* Frame / Floorboard */}
      <path d="M8 18h6.5" />

      {/* Steering column / Fork & Handlebar */}
      <path d="M14.5 18l2.5-10" />
      <path d="M15.5 8h3" />

      {/* Front shield/apron */}
      <path d="M14 18c1-1.5 1.5-4 2-8" />

      {/* Main frame and rack support */}
      <path d="M6 16h8" />

      {/* Seat for the courier */}
      <path d="M9.5 16h4c.5 0 .8-.4.8-.8v-1.2h-3" />

      {/* Delivery Cargo Box on the back (instantly recognizable) */}
      <rect x="3" y="9" width="6" height="6" rx="1" />
      <path d="M3 12h6" /> {/* Box separation line for the lid */}
    </svg>
  );
}

