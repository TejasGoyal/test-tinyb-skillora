import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Tenant {
  id: string;
  school_name: string;
  school_code: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  theme_mode: string;
}

interface BrandingContextType {
  tenant: Tenant | null;
  isLoading: boolean;
  setTenant: (tenant: Tenant | null) => void;
  applyBranding: (tenant: Tenant) => void;
  clearBranding: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

interface BrandingProviderProps {
  children: ReactNode;
}

export function BrandingProvider({ children }: BrandingProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Utility function to convert hex to RGB
  function hexToRGB(hex: string): string {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(x => x + x).join('');
    }
    const num = parseInt(hex, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }

  const applyBranding = useCallback((tenant: Tenant) => {
    const root = document.documentElement;
    // Parse colors from hex to RGB
    const primaryRGB = hexToRGB(tenant.primary_color);
    const secondaryRGB = hexToRGB(tenant.secondary_color);
    // Apply dynamic CSS variables
    root.style.setProperty('--school-primary', primaryRGB);
    root.style.setProperty('--school-secondary', secondaryRGB);
    // Update theme mode if needed
    if (tenant.theme_mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setTenant(tenant);
  }, []);

  const clearBranding = useCallback(() => {
    const root = document.documentElement;
    
    // Reset to default colors
    root.style.setProperty('--school-primary', '236 72 153');
    root.style.setProperty('--school-secondary', '59 130 246');
    
    setTenant(null);
  }, []);

  return (
    <BrandingContext.Provider 
      value={{
        tenant,
        isLoading,
        setTenant,
        applyBranding,
        clearBranding
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}

// Utility function to convert hex to HSL
function hexToHSL(hex: string): string {
  // Remove hash if present
  hex = hex.trim().replace(/^#/, '');
  // Support short hex (#abc)
  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }
  if (hex.length !== 6) {
    // fallback to blue if invalid
    return '217 91% 60%'; // hsl(217,91%,60%) = #3B82F6
  }
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}