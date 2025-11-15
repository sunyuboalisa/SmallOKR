import React, { createContext, useContext, useState, ReactNode } from 'react';

type LoadingLayerContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const LoadingLayerContext = createContext<LoadingLayerContextType | undefined>(
  undefined,
);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingLayerContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingLayerContext.Provider>
  );
};

export const useLoadingLayer = (): LoadingLayerContextType => {
  const context = useContext(LoadingLayerContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
