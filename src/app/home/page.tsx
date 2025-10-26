'use client';

import { OnboardingProvider } from '../context/OnBoardingContext';
import Home from './home';

export default function Page() {
  return (
    <OnboardingProvider>
      <Home />
    </OnboardingProvider>
  );
}
