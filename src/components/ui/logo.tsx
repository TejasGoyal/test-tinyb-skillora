import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  src?: string;
  alt?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24'
};

export function Logo({ 
  src, 
  alt = 'School Logo', 
  className, 
  size = 'md',
  fallback = 'SX'
}: LogoProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'object-contain rounded-lg',
          sizeClasses[size],
          className
        )}
        onError={(e) => {
          // Fallback to text logo if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallbackDiv = document.createElement('div');
            fallbackDiv.className = cn(
              'flex items-center justify-center rounded-lg bg-gradient-primary text-white font-bold',
              sizeClasses[size],
              className
            );
            fallbackDiv.textContent = fallback;
            parent.appendChild(fallbackDiv);
          }
        }}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg bg-gradient-primary text-white font-bold',
        sizeClasses[size],
        className
      )}
    >
      {fallback}
    </div>
  );
}