import React, { useState, useEffect } from 'react';

interface LogoProps {
  style?: 'flow' | 'neon' | 'urban' | 'custom';
  customLogoUrl?: string;
  logoBlendMode?: 'normal' | 'multiply';
  className?: string;
}

export function DeliverixLogo({ customLogoUrl, logoBlendMode = 'normal', className = "" }: LogoProps) {
  const [hasError, setHasError] = useState(false);

  // Reset error state if the URL changes
  useEffect(() => {
    setHasError(false);
  }, [customLogoUrl]);

  if (customLogoUrl && !hasError) {
    const blendClass = logoBlendMode === 'multiply' ? 'mix-blend-multiply' : '';
    return (
      <img 
        src={customLogoUrl} 
        alt="Deliverix Logo" 
        className={`${className} object-contain ${blendClass}`} 
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
      />
    );
  }

  // Fallback purely to text: DELIVERIX
  // Calculate size class based on container sizing in className
  let textSizeClass = "text-xl sm:text-2xl";
  if (className.includes("w-32") || className.includes("w-36") || className.includes("w-12")) {
    textSizeClass = "text-3xl sm:text-4xl font-black";
  } else if (className.includes("w-8")) {
    textSizeClass = "text-lg";
  }

  return (
    <span className={`font-black tracking-widest text-sky-500 whitespace-nowrap transition-colors duration-200 select-none ${textSizeClass}`}>
      DELIVERIX
    </span>
  );
}
