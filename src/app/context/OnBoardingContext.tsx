'use client';

import React, { createContext, useContext, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';

type OnboardingContextValue = {
  showOnboarding: boolean;
  setShowOnboarding: Dispatch<SetStateAction<boolean>>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(true);

  return (
    <OnboardingContext.Provider value={{ showOnboarding, setShowOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider');
  return ctx;
}
