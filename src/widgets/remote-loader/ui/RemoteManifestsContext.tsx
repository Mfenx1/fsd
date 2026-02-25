'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useRemoteManifests } from '../lib';

type RemoteManifestsContextValue = ReturnType<typeof useRemoteManifests>;

const RemoteManifestsContext = createContext<RemoteManifestsContextValue | null>(null);


export const RemoteManifestsProvider = ({ children }: { children: ReactNode }) => {
  const value = useRemoteManifests();
  return (
    <RemoteManifestsContext.Provider value={value}>
      {children}
    </RemoteManifestsContext.Provider>
  );
};

export const useRemoteManifestsContext = (): RemoteManifestsContextValue => {
  const ctx = useContext(RemoteManifestsContext);
  if (!ctx) {
    return { manifests: {} as Record<string, null>, loading: false };
  }
  return ctx;
};