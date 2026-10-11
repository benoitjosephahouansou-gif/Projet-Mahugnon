import React from 'react';
import Link from 'next/link';

interface MahugnonLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const MahugnonLogo: React.FC<MahugnonLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Monogramme 'M' Stylisé Bleu MAHUGNON */}
      <div
        className={`relative ${iconSizes[size]} rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white font-extrabold flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all duration-200`}
      >
        <span className="tracking-tighter font-serif">M</span>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-white dark:border-slate-900" />
      </div>

      <div className="flex flex-col">
        <span className={`font-black tracking-wider text-blue-900 dark:text-blue-100 ${textSizes[size]}`}>
          MAHUGNON
        </span>
        {showSubtitle && (
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400 -mt-1">
            Bénin · E-Commerce
          </span>
        )}
      </div>
    </Link>
  );
};
