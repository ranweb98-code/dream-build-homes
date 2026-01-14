import React, { createContext, useContext, ReactNode } from 'react';
import { useProperties } from '@/hooks/useProperties';
import { Property } from '@/types/property';

interface PropertyContextType {
  properties: Property[];
  loading: boolean;
  error: string | null;
  sheetUrl: string;
  isUsingSheet: boolean;
  configLoaded: boolean;
  updateSheetUrl: (url: string) => Promise<void>;
  clearSheetUrl: () => Promise<void>;
  loadSheetUrlFromDb: () => Promise<string>;
  getPropertyById: (id: string) => Property | undefined;
  getFeaturedProperties: () => Property[];
  getAvailableProperties: () => Property[];
  refetch: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const propertyData = useProperties();

  return (
    <PropertyContext.Provider value={propertyData}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('usePropertyContext must be used within a PropertyProvider');
  }
  return context;
}
