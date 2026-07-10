import React, { useState, useEffect } from 'react';
import { Image } from 'lucide-react';

interface LogoProps {
  style: 'flow' | 'neon' | 'urban' | 'custom';
  customLogoUrl?: string;
  logoBlendMode?: 'normal' | 'multiply';
  className?: string;
}

export function DeliverixLogo({ style, customLogoUrl, logoBlendMode = 'normal', className = "w-10 h-10 sm:w-12 sm:h-12" }: LogoProps) {
  const [hasError, setHasError] = useState(false);

  // Ako se promeni URL (npr. otpremljen je novi logo), resetujemo grešku
  useEffect(() => {
    setHasError(false);
  }, [customLogoUrl]);

  if (style === 'custom' && !hasError && customLogoUrl) {
    const blendClass = logoBlendMode === 'multiply' ? 'mix-blend-multiply' : '';
    return (
      <img 
        src={customLogoUrl} 
        alt="Custom Logo" 
        className={`${className} object-contain ${blendClass}`} 
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    );
  }

  if (style === 'custom' && (hasError || !customLogoUrl)) {
    // Ako se slika ne učita (npr. zbog restarta kontejnera gde se gube lokalni fajlovi),
    // automatski prelazimo na prelepi podrazumevani SVG logotip ('flow') tako da korisnik nikada ne vidi "polomljenu" sliku.
    style = 'flow';
  }

  if (style === 'neon') {
    return (
      <svg className={`${className} transition-all`} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="neon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="neon-scooter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="100%" stopColor="#4facfe" />
          </linearGradient>
        </defs>

        {/* Sharp Geometric letter 'D' - Completely Closed */}
        <path 
          d="M 45 20 L 130 20 C 170 20, 190 45, 190 80 C 190 115, 170 140, 130 140 L 45 140 Z" 
          stroke="url(#neon-grad)" 
          strokeWidth="14" 
          strokeLinejoin="miter" 
          fill="none" 
        />
        <line x1="45" y1="20" x2="45" y2="140" stroke="url(#neon-grad)" strokeWidth="14" strokeLinecap="square" />

        {/* Speedy courier inside, designed with modern stylized blocky / geometric shapes */}
        <g transform="translate(10, 5)">
          {/* Scooter frame in sleek flat futuristic design */}
          <circle cx="80" cy="115" r="10" fill="none" stroke="url(#neon-scooter)" strokeWidth="4" />
          <circle cx="125" cy="115" r="10" fill="none" stroke="url(#neon-scooter)" strokeWidth="4" />

          {/* Ground Speed Line under wheels */}
          <line x1="60" y1="125" x2="145" y2="125" stroke="url(#neon-grad)" strokeWidth="3" strokeLinecap="round" />

          {/* Low-riding scooter body */}
          <path d="M 80 115 L 115 115 L 123 90" stroke="url(#neon-scooter)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="miter" fill="none" />
          
          {/* Aggressive angled front aerodynamic fairing */}
          <path d="M 112 115 L 128 80" stroke="url(#neon-scooter)" strokeWidth="6" strokeLinecap="square" />

          {/* Rider torso leaning way forward - represented as a solid parallelogram (aerodynamic shape) */}
          <path d="M 84 96 L 108 68 L 118 68 L 94 96 Z" fill="url(#neon-scooter)" />

          {/* Visor helmet - pure tech oval with cyber visor */}
          <circle cx="112" cy="58" r="10" fill="#1e293b" stroke="url(#neon-scooter)" strokeWidth="3" />
          <path d="M 108 54 C 115 54, 122 58, 122 63 L 115 63 Z" fill="url(#neon-scooter)" />

          {/* Modern cubic delivery pack */}
          <rect x="66" y="66" width="18" height="18" rx="2" fill="url(#neon-grad)" stroke="url(#neon-scooter)" strokeWidth="2" />
          {/* Bolt logo */}
          <path d="M 75 70 L 71 76 L 75 76 L 73 81 L 79 74 L 75 74 Z" fill="#ffffff" />

          {/* Triple speed sparks */}
          <line x1="45" y1="70" x2="58" y2="70" stroke="url(#neon-scooter)" strokeWidth="3" strokeLinecap="round" />
          <line x1="40" y1="80" x2="55" y2="80" stroke="url(#neon-scooter)" strokeWidth="3" strokeLinecap="round" />
          <line x1="45" y1="90" x2="52" y2="90" stroke="url(#neon-scooter)" strokeWidth="3" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  if (style === 'urban') {
    return (
      <svg className={`${className} transition-all`} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="minimal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="minimal-scooter" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Rounded modern letter 'D' - Completely Closed */}
        <path 
          d="M 52 20 L 120 20 C 160 20, 180 48, 180 80 C 180 112, 160 140, 120 140 L 52 140 Z" 
          stroke="url(#minimal-grad)" 
          strokeWidth="18" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none" 
        />
        <line x1="52" y1="20" x2="52" y2="140" stroke="url(#minimal-grad)" strokeWidth="18" strokeLinecap="round" />

        {/* Speedy Courier - styled in a continuous fluid dynamic path */}
        <g transform="translate(12, 2)">
          {/* Wheels: bold, thick, professional */}
          <circle cx="80" cy="118" r="14" fill="#0f172a" />
          <circle cx="80" cy="118" r="7" fill="#ffffff" />
          <circle cx="80" cy="118" r="3" fill="#0ea5e9" />

          <circle cx="128" cy="118" r="14" fill="#0f172a" />
          <circle cx="128" cy="118" r="7" fill="#ffffff" />
          <circle cx="128" cy="118" r="3" fill="#0ea5e9" />

          {/* Scooter body - a single unified curved stroke */}
          <path 
            d="M 80 118 L 128 118 L 132 88 M 120 118 L 126 84" 
            stroke="url(#minimal-scooter)" 
            strokeWidth="6" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />

          {/* Elegant wind-trail background arc indicating extreme speed */}
          <path 
            d="M 55 90 Q 75 60 110 50" 
            stroke="#38bdf8" 
            strokeWidth="4" 
            strokeLinecap="round" 
            fill="none" 
            strokeDasharray="8 6"
          />

          {/* Rider - stylized athletic posture */}
          <path 
            d="M 96 102 C 90 92, 98 82, 108 78" 
            stroke="url(#minimal-scooter)" 
            strokeWidth="10" 
            strokeLinecap="round" 
            fill="none" 
          />
          
          {/* Forward-leaning arms to steering wheel */}
          <path 
            d="M 106 82 L 124 84" 
            stroke="url(#minimal-scooter)" 
            strokeWidth="5" 
            strokeLinecap="round" 
          />

          {/* Helmet - fully round with elegant black visor */}
          <circle cx="114" cy="62" r="12" fill="url(#minimal-scooter)" />
          <path d="M 112 52 Q 124 54 124 64 L 114 64 Z" fill="#0f172a" />

          {/* Square stylish delivery pack */}
          <rect x="70" y="70" width="18" height="20" rx="3" fill="url(#minimal-grad)" />
          <path d="M 79 74 L 75 80 L 79 80 L 77 86 L 83 79 L 79 79 Z" fill="#ffffff" />
        </g>
      </svg>
    );
  }

  // Default / 'flow' style - "Aero-Speed"
  return (
    <svg className={`${className} transition-all`} viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-d-grad-flow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="logo-scooter-grad-flow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="logo-backpack-grad-flow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
      </defs>

      {/* Three Speed Lines on the left of the D */}
      <path 
        d="M 12 52 L 42 52" 
        stroke="url(#logo-d-grad-flow)" 
        strokeWidth="10" 
        strokeLinecap="round" 
      />
      <path 
        d="M 18 80 L 42 80" 
        stroke="url(#logo-d-grad-flow)" 
        strokeWidth="10" 
        strokeLinecap="round" 
      />
      <path 
        d="M 24 108 L 42 108" 
        stroke="url(#logo-d-grad-flow)" 
        strokeWidth="10" 
        strokeLinecap="round" 
      />

      {/* Main "D" - Completely Closed */}
      <path 
        d="M 50 20 L 125 20 C 165 20, 185 50, 185 80 C 185 110, 165 140, 125 140 L 50 140 Z" 
        stroke="url(#logo-d-grad-flow)" 
        strokeWidth="16" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="none" 
      />
      <line x1="50" y1="20" x2="50" y2="140" stroke="url(#logo-d-grad-flow)" strokeWidth="16" strokeLinecap="round" />

      {/* --- PREMIUM GEOMETRIC SCOOTER & RIDER (Resting on bottom bar at y=132) --- */}
      <g transform="translate(15, 0)">
        {/* Scooter rear body & motor */}
        <path 
          d="M 74 114 C 74 103, 86 103, 94 114 Z" 
          fill="url(#logo-scooter-grad-flow)" 
        />

        {/* Scooter Deck / Footboard */}
        <rect x="88" y="112" width="34" height="6" rx="2" fill="#1e293b" />

        {/* Scooter Wheels */}
        <circle cx="82" cy="120" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
        <circle cx="82" cy="120" r="4" fill="#ffffff" />

        <circle cx="132" cy="120" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="3" />
        <circle cx="132" cy="120" r="4" fill="#ffffff" />

        {/* Front Shield & Steering column */}
        <path 
          d="M 120 114 L 132 86" 
          stroke="url(#logo-scooter-grad-flow)" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none" 
        />
        <path 
          d="M 126 84 L 134 84" 
          stroke="#1e293b" 
          strokeWidth="4" 
          strokeLinecap="round" 
        />

        {/* Scooter Seat */}
        <rect x="88" y="102" width="18" height="5" rx="2" fill="#1e293b" />

        {/* Rider Leg (sitting) */}
        <path 
          d="M 95 101 L 108 114 L 118 114" 
          stroke="url(#logo-scooter-grad-flow)" 
          strokeWidth="6" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none" 
        />

        {/* Rider Torso - Thick solid volume */}
        <path 
          d="M 96 101 L 108 81" 
          stroke="url(#logo-scooter-grad-flow)" 
          strokeWidth="15" 
          strokeLinecap="round" 
        />

        {/* Rider Arm stretching forward */}
        <path 
          d="M 106 85 L 124 84" 
          stroke="url(#logo-scooter-grad-flow)" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none" 
        />

        {/* Rider Helmet (Head) with styled Visor */}
        <circle cx="112" cy="65" r="12" fill="url(#logo-scooter-grad-flow)" />
        <path 
          d="M 112 57 C 119 57, 123 61, 123 68 L 115 68 Z" 
          fill="#ffffff" 
        />
        <path 
          d="M 113 59 C 118 59, 121 62, 121 66 L 115 66 Z" 
          fill="#1e293b" 
        />

        {/* Delivery Backpack */}
        <rect 
          x="72" 
          y="74" 
          width="20" 
          height="22" 
          rx="4" 
          fill="url(#logo-backpack-grad-flow)" 
        />
        <path 
          d="M 82 78 L 77 85 L 82 85 L 80 92 L 86 84 L 81 84 Z" 
          fill="#ffffff" 
        />
      </g>
    </svg>
  );
}
